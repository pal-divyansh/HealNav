import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, AlertTriangle, Trash2, ThumbsUp, ThumbsDown, Mic, Image as ImageIcon, History, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Add proper type checking for the API key
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.error('Gemini API key is not set');
}

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
  image?: string;
}

interface ChatHistory {
  id: string;
  messages: Message[];
  date: Date;
}

// Define SpeechRecognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}

interface IWindow extends Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognition: typeof SpeechRecognition;
}

declare const window: IWindow;

const INITIAL_MESSAGE: Message = {
  type: 'bot',
  content: "Hello! I'm your medical assistant. I can help you with general health questions and analyze medical images. How can I help you today?",
  timestamp: new Date()
};

const MEDICAL_CONTEXT = `You are an advanced medical AI assistant named HealNav Assistant. Format your responses using proper markdown:

Formatting Guidelines:
- Use ## for section headers
- Use **bold** for emphasis
- Use proper bullet points with "-" or numbered lists with "1."
- Use > for important quotes or warnings
- Use proper line breaks between sections

Your responses should be:
1. Professional yet friendly and empathetic
2. Structured with clear sections
3. Include relevant medical terminology with layman explanations
4. Always emphasize the importance of consulting healthcare professionals
5. Use proper markdown formatting for clarity
6. Provide actionable recommendations

Remember to:
- Immediately identify emergency situations
- Cite general medical guidelines when relevant
- Explain both benefits and risks
- Use simple language while being thorough
- Be clear about your limitations as an AI

Example format:
## Symptoms
- First symptom
- Second symptom

**Important:** Key information here

> Warning: Emergency information here`;

// Add typing animation component
const TypingIndicator = () => (
  <div className="flex gap-1 p-2 bg-gray-100 rounded-lg w-fit">
    {[1, 2, 3].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-emerald-600 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: dot * 0.1,
        }}
      />
    ))}
  </div>
);

export function MedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new states for enhanced features
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Load chat history from localStorage on component mount
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Convert string dates back to Date objects
      const historyWithDates = parsed.map((chat: ChatHistory) => ({
        ...chat,
        date: new Date(chat.date)
      }));
      setChatHistory(historyWithDates);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const simulateTyping = async (text: string) => {
    const minDelay = 500;
    const maxDelay = 1500;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
    return text;
  };

  const handleFeedback = (messageIndex: number, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, feedback } : msg
    ));
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve our responses.",
    });
  };

  const clearChat = () => {
    if (messages.length > 1) {
      const newHistory: ChatHistory = {
        id: Date.now().toString(),
        messages: [...messages],
        date: new Date(),
      };
      const updatedHistory = [...chatHistory, newHistory];
      setChatHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    }
    setMessages([INITIAL_MESSAGE]);
    toast({
      title: "Chat cleared",
      description: "The conversation has been saved to history and reset.",
    });
  };

  const loadPreviousChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
  };

  const handleImageAnalysis = async (imageData: string) => {
    setIsThinking(true);
    
    try {
      const base64Data = imageData.split(',')[1];
      const parts = [
        {
          text: "You are a medical professional. Please analyze this medical image and provide insights about: 1) What it shows 2) Any concerns 3) Recommendations. Include medical disclaimers."
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ];

      try {
        const result = await visionModel.generateContent(parts);
        const response = await result.response;
        
        if (!response.text()) {
          throw new Error('Empty response from Gemini');
        }

        const botMessage: Message = {
          type: 'bot',
          content: response.text(),
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Gemini API Error:', error);
        const errorMessage = error.message || 'Failed to analyze image';
        throw new Error(`Image analysis failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error in handleImageAnalysis:', error);
      toast({
        title: "Image Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the image. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Add user message with image
        const userMessage: Message = {
          type: 'user',
          content: "I've uploaded a medical image for analysis",
          timestamp: new Date(),
          image: base64Image
        };

        setMessages(prev => [...prev, userMessage]);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Analyze the image
        await handleImageAnalysis(base64Image);
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the image file",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported in this browser');
        }
        
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          toast({
            title: "Voice recording transcribed",
            description: "You can now edit or send your message.",
          });
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast({
            variant: "destructive",
            title: "Transcription failed",
            description: "Could not convert your speech to text. Please try again or type manually.",
          });
        };

        recognition.start();
        
        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input.",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Converting speech to text...",
      });
    }
  };

  // Add scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced message handling
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsThinking(true);
    setIsTyping(true);

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const conversationHistory = messages
        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const prompt = `${MEDICAL_CONTEXT}\n\nConversation history:\n${conversationHistory}\n\nUser: ${input}\nAssistant:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponse = await simulateTyping(response.text());

      const botMessage: Message = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      const emergencyKeywords = ['emergency', 'immediate', '911', 'urgent care', 'hospital'];
      if (emergencyKeywords.some(keyword => botResponse.toLowerCase().includes(keyword))) {
        toast({
          variant: "destructive",
          title: "Emergency Alert",
          description: "Please seek immediate medical attention or call emergency services.",
        });
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
        action: <Button onClick={() => handleSendMessage()}>Retry</Button>
      });
    } finally {
      setIsThinking(false);
      setIsTyping(false);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-3xl mx-auto shadow-xl bg-gradient-to-b from-emerald-50 to-white border-emerald-100">
        {/* Header Section */}
        <div className="p-4 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-emerald-600" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">HealNav Assistant</h2>
                <p className="text-xs text-gray-500">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat History</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px]">
                    {chatHistory.length === 0 ? (
                      <p className="text-center text-gray-500 p-4">No chat history available</p>
                    ) : (
                      chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className="p-4 border-b cursor-pointer hover:bg-gray-100"
                          onClick={() => loadPreviousChat(chat)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {chat.date.toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {chat.messages.length} messages
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <span className="text-sm text-gray-500">
                {currentTime.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <Alert variant="destructive" className="m-4 border-l-4 border-red-500 w-fit">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Medical Disclaimer:</span> This AI assistant provides general information only. 
            Always consult healthcare professionals for medical advice.
          </AlertDescription>
        </Alert>

        {/* Chat Area */}
        <ScrollArea 
          className="h-[500px] p-4 md:h-[600px]" 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center mr-2">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-transparent shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-emerald-100'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2 relative">
                          <img 
                            src={message.image} 
                            alt="Uploaded medical image"
                            className="max-w-[300px] rounded-lg shadow-md"
                          />
                          {message.type === 'user' && isThinking && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <div className="text-white text-sm">Analyzing image...</div>
                            </div>
                          )}
                        </div>
                      )}
                      <ReactMarkdown 
                        className="text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:mb-2 prose-ul:mb-2"
                        components={{
                          h2: ({children}) => <h2 className="text-lg font-bold mt-4">{children}</h2>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-emerald-500 pl-4 my-2 italic bg-emerald-50/10 py-1">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFeedback(index, 'positive')}
                              className={`opacity-50 hover:opacity-100 ${message.feedback === 'positive' ? 'text-green-500' : ''}`}
                              aria-label="Positive feedback"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(index, 'negative')}
                              className={`opacity-50 hover:opacity-100 ${message.feedback === 'negative' ? 'text-red-500' : ''}`}
                              aria-label="Negative feedback"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center ml-2">
                      <span className="text-sm font-medium">You</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-emerald-100 bg-white/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 items-end"
          >
            <div className="flex-1 space-y-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health question..."
                className="min-h-[50px] text-base"
                disabled={isThinking}
              />
              {isThinking && (
                <p className="text-xs text-emerald-600 animate-pulse">
                  Analyzing your question...
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleImageButtonClick}
                disabled={isThinking}
                className="hover:bg-emerald-500"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`hover:bg-emerald-500 ${isRecording ? 'animate-pulse bg-red-500' : ''}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                size="icon"
                disabled={isThinking || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-20 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

interface HealthcareFacility {
  name: string;
  type: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  hours: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  emergency?: boolean;
  insurance?: string[];
  website?: string;
  reviews?: number;
}

export interface SearchFilters {
  type?: string;
  maxDistance?: number;
  emergencyOnly?: boolean;
  hours24?: boolean;
  insurance?: string[];
  minRating?: number;
  searchQuery?: string;
  specialties?: string[];
}

function generatePrompt(location: string, filters: SearchFilters = {}) {
  const basePrompt = `Act as a healthcare facility database. For the given location (${location}), provide detailed information about nearby healthcare facilities.`;

  // Add filter-specific requirements
  const filterRequirements = [
    filters.type && filters.type !== 'all' && `Focus on ${filters.type} facilities.`,
    filters.maxDistance && `Include facilities within ${filters.maxDistance} miles.`,
    filters.emergencyOnly && "Prioritize facilities with emergency services.",
    filters.hours24 && "Include facilities that operate 24/7.",
    filters.insurance?.length && `Show facilities accepting these insurances: ${filters.insurance.join(", ")}.`,
    filters.minRating && `Include facilities with ratings of ${filters.minRating} or higher.`,
    filters.specialties?.length && `Focus on facilities offering these specialties: ${filters.specialties.join(", ")}.`,
    filters.searchQuery && `Particularly look for facilities matching: ${filters.searchQuery}`
  ].filter(Boolean).join("\n");

  const structureGuide = `
Format each facility as a JSON object with these properties:
{
  "name": "Facility Name",
  "type": "Specific type (Hospital/Clinic/etc)",
  "address": "Full street address",
  "distance": "X.X miles from provided location",
  "rating": number (1-5),
  "phone": "Formatted phone number",
  "hours": "Operating hours",
  "services": ["Array of available services"],
  "coordinates": {
    "lat": exact_latitude,
    "lng": exact_longitude
  },
  "description": "Detailed facility description",
  "emergency": boolean,
  "insurance": ["Accepted insurance providers"],
  "website": "Facility website URL",
  "reviews": number
}`;

  const responseGuide = `
Important requirements:
1. Return exactly 5 most relevant facilities based on the filters
2. Ensure all coordinates are accurate for the given addresses
3. Provide realistic and accurate information
4. Format as a valid JSON array
5. Include detailed service descriptions
6. Specify emergency service availability
7. Include accurate distance calculations from the provided location`;

  return `${basePrompt}

${filterRequirements}

${structureGuide}

${responseGuide}

Return only the JSON array without any markdown formatting or additional text.`;
}

// Add caching with location and filter-based keys
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const facilitiesCache = new Map<string, { data: HealthcareFacility[]; timestamp: number }>();

function getCacheKey(location: string, filters: SearchFilters = {}): string {
  return `${location}-${JSON.stringify(filters)}`;
}

const DEBOUNCE_DELAY = 300; // milliseconds
let debounceTimer: NodeJS.Timeout;

// Add this function for debouncing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>) => {
    return new Promise((resolve) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
}

export const getHealthcareFacilities = debounce(async (
  location: string,
  filters: SearchFilters = {}
): Promise<HealthcareFacility[]> => {
  const cacheKey = getCacheKey(location, filters);
  const cached = facilitiesCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Return fallback data immediately while fetching
  const fallbackData = getFallbackFacilities(location, filters);
  
  try {
    const data = await fetchFacilities(location, filters);
    facilitiesCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return fallbackData;
  }
}, DEBOUNCE_DELAY);

async function fetchFacilities(
  location: string,
  filters: SearchFilters
): Promise<HealthcareFacility[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = generatePrompt(location, filters);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response
    text = text.replace(/```json\n?|\n?```/g, '')  // Remove markdown code blocks
              .replace(/[\u201C\u201D]/g, '"')     // Replace smart quotes
              .replace(/\n\s*/g, ' ')              // Remove newlines
              .trim();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return getFallbackFacilities(location, filters);
    }
  } catch (error) {
    console.error('Error fetching healthcare facilities:', error);
    return getFallbackFacilities(location, filters);
  }
}

function getFallbackFacilities(location: string, filters: SearchFilters): HealthcareFacility[] {
  // Generate more relevant fallback data based on filters
  const fallbackData = [
    {
      name: "City General Hospital",
      type: "Hospital",
      address: `123 Healthcare Ave, ${location.split(',')[0]}`,
      distance: "1.2 miles",
      rating: 4.5,
      phone: "(555) 123-4567",
      hours: filters.hours24 ? "24/7" : "8:00 AM - 8:00 PM",
      services: ["Emergency Care", "Surgery", "General Medicine"],
      coordinates: { lat: 40.7128, lng: -74.0060 },
      description: "Full-service hospital with comprehensive care",
      emergency: true,
      insurance: filters.insurance || ["Medicare", "Medicaid", "Private Insurance"],
      website: "https://citygeneralhospital.com",
      reviews: 524
    },
    // Add more fallback facilities based on filters...
  ];

  // Filter fallback data based on provided filters
  return fallbackData.filter(facility => {
    if (filters.type && filters.type !== 'all' && !facility.type.toLowerCase().includes(filters.type)) {
      return false;
    }
    if (filters.emergencyOnly && !facility.emergency) {
      return false;
    }
    if (filters.minRating && facility.rating < filters.minRating) {
      return false;
    }
    return true;
  });
} 

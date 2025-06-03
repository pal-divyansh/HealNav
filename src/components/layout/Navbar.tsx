import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Bot } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();

  const handleSymptomsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/symptoms", { replace: true, state: { fresh: true } });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/HealNavLogo.webp"
              alt="Logo"
              className="w-10 h-10 mr-2 rounded-full"
            />
            <Link
              to="/"
              className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-800 bg-clip-text text-transparent hover:text-emerald-600"
            >
              HealNav
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/symptoms"
                onClick={handleSymptomsClick}
                className=""
              >
            <Button variant="outline">
                Symptoms
            </Button>
              </Link>

            <Link to="/community" >
            <Button variant="outline">
              Community
            </Button>
              </Link>
              <Link to="/resources">
            <Button variant="outline">
                Resources
            </Button>
              </Link>
            <Link to="/education" >
            <Button variant="outline">
              Education
            </Button>
            </Link>

            <Link
              to="/notifications"
              
              >
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="w-5 h-5" />
              </Button>
            </Link>

            <Link
              to="/medical-bot"
              className="flex items-center gap-2"
              >
            <Button variant="outline" size="icon" className="rounded-full">
              <Bot className="w-5 h-5" />
              </Button>
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Star, Search, Globe, CreditCard, AlertTriangle, Check, Shield, ListChecks } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { getHealthcareFacilities, type SearchFilters } from "@/services/healthcare";
import { GoogleMap, LoadScript, InfoWindow, Libraries } from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingState } from "@/components/LoadingState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Filter } from "lucide-react";
import { LoadingFallback } from "@/components/LoadingFallback";
import React from "react";
import { useSearchParams } from "react-router-dom";

// Add these interfaces
interface Coordinates {
  lat: number;
  lng: number;
}

interface HealthcareFacility {
  name: string;
  type: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  hours: string;
  services: string[];
  coordinates: Coordinates;
  description?: string;
  emergency?: boolean;
  insurance?: string[];
  website?: string;
  reviews?: number;
}

const filterOptions = [
  { value: "all", label: "All Services" },
  { value: "hospital", label: "Hospitals" },
  { value: "clinic", label: "Medical Centers" },
  { value: "pharmacy", label: "Pharmacies" },
  { value: "emergency", label: "Emergency Care" },
  { value: "specialist", label: "Specialists" },
  { value: "dental", label: "Dental Care" },
  { value: "mental", label: "Mental Health" },
  { value: "pediatric", label: "Pediatric Care" },
];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

// Add these at the top level
const libraries: Libraries = ["places"];

const defaultMapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const insuranceProviders = [
  "Medicare",
  "Medicaid",
  "Blue Cross",
  "Aetna",
  "United Healthcare",
  "Cigna",
  "Humana",
];

// Add this static information
const STATIC_INFO = {
  emergencyNote: {
    title: "Emergency Services",
    content: "If you're experiencing a medical emergency, dial 102 immediately.",
  },
  commonServices: {
    title: "Available Services",
    items: [
      "24/7 Emergency Care",
      "Primary Care",
      "Specialist Consultations",
      "Diagnostic Services",
      "Pharmacy Services",
      "Mental Health Services",
    ]
  },
  insuranceInfo: {
    title: "Insurance Information",
    content: "Most facilities accept major insurance providers. Contact the facility directly to verify coverage."
  }
};

const MapComponent = React.lazy(() => import('@/components/Map'));

// Add this helper function at the top
const formatIndianNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

// Add this distance converter
const milesToKm = (miles: string | number): string => {
  const milesNum = typeof miles === 'string' 
    ? parseFloat(miles.replace(/[^0-9.]/g, ''))
    : miles;
  
  if (isNaN(milesNum)) return '0 km';
  
  const km = milesNum * 1.60934;
  return `${km.toFixed(1)} km`;
};

export default function Resources() {
  const [searchParams] = useSearchParams();
  
  const [selectedFilter, setSelectedFilter] = useState(searchParams.get("type") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") || "");
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(searchParams.get("emergency") === "true");
  const [show24Hours, setShow24Hours] = useState(searchParams.get("hours24") === "true");
  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [showAccessible, setShowAccessible] = useState(false);
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0);
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          fetchFacilities(coords);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to IP-based location
          fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
              const coords = {
                lat: data.latitude,
                lng: data.longitude
              };
              setUserLocation(coords);
              setMapCenter(coords);
              fetchFacilities(coords);
            })
            .catch((error) => {
              console.error('Location detection failed:', error);
              setLoading(false);
            });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // If geolocation is not supported, try IP-based location
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          const coords = {
            lat: data.latitude,
            lng: data.longitude
          };
          setUserLocation(coords);
          setMapCenter(coords);
          fetchFacilities(coords);
        })
        .catch((error) => {
          console.error('Location detection failed:', error);
          setLoading(false);
        });
    }
  }, []);

  const fetchFacilities = useCallback(async (coords: Coordinates) => {
    if (!isInitialLoad) setIsFetching(true);
    
    try {
      const location = `${coords.lat},${coords.lng}`;
      const filters: SearchFilters = {
        type: selectedFilter,
        maxDistance,
        emergencyOnly: showEmergencyOnly,
        hours24: show24Hours,
        insurance: selectedInsurance,
        minRating,
        searchQuery: searchQuery,
        specialties: []
      };
      
      const data = await getHealthcareFacilities(location, filters);
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setIsInitialLoad(false);
      setIsFetching(false);
      setLoading(false);
    }
  }, [selectedFilter, maxDistance, showEmergencyOnly, show24Hours, selectedInsurance, minRating, searchQuery, isInitialLoad]);

  // Update the fetchFacilities dependency check
  useEffect(() => {
    if (userLocation && !isInitialLoad) {
      fetchFacilities(userLocation);
    }
  }, [
    selectedFilter,
    maxDistance,
    showEmergencyOnly,
    show24Hours,
    selectedInsurance,
    minRating,
    searchQuery,
    userLocation,
    isInitialLoad
  ]);

  const filteredFacilities = facilities.filter((facility) => {
    // Search functionality
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const facilityText = `${facility.name} ${facility.address} ${facility.type} ${facility.services.join(' ')}`.toLowerCase();
    const matchesSearch = searchQuery === '' || searchTerms.every(term => facilityText.includes(term));

    // Filter by type
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "emergency" ? facility.emergency : facility.type.toLowerCase().includes(selectedFilter));

    // Distance filter with better type handling
    const distanceValue = typeof facility.distance === 'string' 
      ? parseFloat(facility.distance.replace(/[^0-9.]/g, ''))
      : typeof facility.distance === 'number'
      ? facility.distance
      : 0;
    
    const matchesDistance = isNaN(distanceValue) || distanceValue <= maxDistance;

    // Other filters
    const matchesEmergency = !showEmergencyOnly || facility.emergency;
    const matches24Hours = !show24Hours || facility.hours === "24/7";
    const matchesInsurance = selectedInsurance.length === 0 || 
      selectedInsurance.some(ins => facility.insurance?.includes(ins));
    const matchesRating = facility.rating >= minRating;

    return matchesSearch && 
           matchesFilter && 
           matchesDistance && 
           matchesEmergency && 
           matches24Hours && 
           matchesInsurance && 
           matchesRating;
  });

  const handleMarkerClick = (facility: HealthcareFacility) => {
    setSelectedFacility(facility);
    setMapCenter(facility.coordinates);
  };

  useEffect(() => {
    if (searchParams.toString() && userLocation) {
      setShowFilters(true);
      fetchFacilities(userLocation);
      
      return () => {
        setSearchQuery('');
      };
    }
  }, [searchParams, fetchFacilities, userLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="mt-16">
          <PageHeader
            title="Resource Locator"
            subtitle="Find health services near you."
          />
          <main className="container mx-auto px-4 py-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16">
        <PageHeader
          title="Resource Locator"
          subtitle="Find health services near you."
        />
        
        <div className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {STATIC_INFO.emergencyNote.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{STATIC_INFO.emergencyNote.content}</p>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5" />
                    {STATIC_INFO.commonServices.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {STATIC_INFO.commonServices.items.map((service) => (
                      <li key={service} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {STATIC_INFO.insuranceInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{STATIC_INFO.insuranceInfo.content}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  className="pl-10"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Distance</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[maxDistance]}
                        onValueChange={([value]) => setMaxDistance(value)}
                        max={80}
                        step={1}
                      />
                      <span className="text-sm">{maxDistance} km</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[minRating]}
                        onValueChange={([value]) => setMinRating(value)}
                        max={5}
                        step={0.5}
                      />
                      <span className="text-sm">{minRating} ★</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Quick Filters</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={showEmergencyOnly}
                          onCheckedChange={setShowEmergencyOnly}
                        />
                        <label className="text-sm">Emergency Only</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={show24Hours}
                          onCheckedChange={setShow24Hours}
                        />
                        <label className="text-sm">24/7 Only</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={showAccessible}
                          onCheckedChange={setShowAccessible}
                        />
                        <label className="text-sm">Wheelchair Accessible</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Insurance Accepted</h3>
                  <div className="flex flex-wrap gap-2">
                    {insuranceProviders.map((insurance) => (
                      <Badge
                        key={insurance}
                        variant={selectedInsurance.includes(insurance) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedInsurance(prev =>
                            prev.includes(insurance)
                              ? prev.filter(i => i !== insurance)
                              : [...prev, insurance]
                          );
                        }}
                      >
                        {insurance}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isInitialLoad ? (
            <LoadingState />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 h-[800px]">
              <div className="overflow-y-auto pr-4">
                {isFetching ? (
                  <LoadingFallback />
                ) : (
                  filteredFacilities.map((facility) => (
                    <Card 
                      key={facility.name} 
                      className={`p-6 cursor-pointer transition-shadow hover:shadow-lg ${
                        selectedFacility?.name === facility.name ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleMarkerClick(facility)}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{facility.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{facility.type}</Badge>
                              {facility.emergency && (
                                <Badge variant="destructive">24/7 Emergency</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{facility.rating}</span>
                            {facility.reviews && (
                              <span className="text-sm text-gray-500">
                                ({formatIndianNumber(facility.reviews)})
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">{facility.description}</p>

                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{facility.address}</span>
                            <span className="text-gray-500">({milesToKm(facility.distance)})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{facility.phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1 $2 $3')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{facility.hours}</span>
                          </div>
                          {facility.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <a 
                                href={facility.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {facility.services.map((service) => (
                            <Badge
                              key={service}
                              variant="secondary"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>

                        {facility.insurance && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>Accepts: {facility.insurance.join(", ")}</span>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.location.href = `tel:${facility.phone}`}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates.lat},${facility.coordinates.lng}`,
                              '_blank'
                            )}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              <div className="h-full sticky top-20">
                <ErrorBoundary>
                  <React.Suspense fallback={<div className="h-full bg-gray-100 animate-pulse" />}>
                    <MapComponent
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      facilities={filteredFacilities}
                      center={mapCenter}
                      onMarkerClick={handleMarkerClick}
                      selectedFacility={selectedFacility}
                      onInfoWindowClose={() => setSelectedFacility(null)}
                    />
                  </React.Suspense>
                </ErrorBoundary>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
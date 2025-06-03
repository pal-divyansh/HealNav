import { LoadScript, GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

interface MapProps {
  apiKey: string;
  facilities: HealthcareFacility[];
  center: Coordinates;
  onMarkerClick: (facility: HealthcareFacility) => void;
  selectedFacility: HealthcareFacility | null;
  onInfoWindowClose: () => void;
}

export default function Map({ 
  apiKey, 
  facilities, 
  center, 
  onMarkerClick, 
  selectedFacility, 
  onInfoWindowClose 
}: MapProps) {
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={["places"]}
      loadingElement={<div className="h-full bg-gray-100 animate-pulse" />}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {facilities.map((facility) => (
          <MarkerF
            key={facility.name}
            position={facility.coordinates}
            onClick={() => onMarkerClick(facility)}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 8,
              fillColor: facility.emergency ? '#ef4444' : '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
          />
        ))}
        
        {selectedFacility && (
          <InfoWindow
            position={selectedFacility.coordinates}
            onCloseClick={onInfoWindowClose}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedFacility.name}</h3>
              <p className="text-sm">{selectedFacility.address}</p>
              <p className="text-sm text-primary">{selectedFacility.phone}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
} 
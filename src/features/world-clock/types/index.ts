export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates: { lat: number; lon: number };
}

export interface WorldClockCity extends City {
  addedAt: number;
}

export interface TimezoneInfo {
  timezone: string;
  offset: string;
  offsetMinutes: number;
  isDST: boolean;
  abbreviation: string;
}

export const MAJOR_CITIES: City[] = [
  // Americas
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'US', timezone: 'America/New_York', coordinates: { lat: 40.7128, lon: -74.0060 } },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', countryCode: 'US', timezone: 'America/Los_Angeles', coordinates: { lat: 34.0522, lon: -118.2437 } },
  { id: 'chicago', name: 'Chicago', country: 'United States', countryCode: 'US', timezone: 'America/Chicago', coordinates: { lat: 41.8781, lon: -87.6298 } },
  { id: 'denver', name: 'Denver', country: 'United States', countryCode: 'US', timezone: 'America/Denver', coordinates: { lat: 39.7392, lon: -104.9903 } },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryCode: 'CA', timezone: 'America/Toronto', coordinates: { lat: 43.6532, lon: -79.3832 } },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryCode: 'CA', timezone: 'America/Vancouver', coordinates: { lat: 49.2827, lon: -123.1207 } },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', timezone: 'America/Mexico_City', coordinates: { lat: 19.4326, lon: -99.1332 } },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', timezone: 'America/Sao_Paulo', coordinates: { lat: -23.5505, lon: -46.6333 } },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', coordinates: { lat: -34.6037, lon: -58.3816 } },
  { id: 'santiago', name: 'Santiago', country: 'Chile', countryCode: 'CL', timezone: 'America/Santiago', coordinates: { lat: -33.4489, lon: -70.6693 } },

  // Europe
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', coordinates: { lat: 51.5074, lon: -0.1278 } },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', coordinates: { lat: 48.8566, lon: 2.3522 } },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin', coordinates: { lat: 52.5200, lon: 13.4050 } },
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'IT', timezone: 'Europe/Rome', coordinates: { lat: 41.9028, lon: 12.4964 } },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', coordinates: { lat: 40.4168, lon: -3.7038 } },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', timezone: 'Europe/Amsterdam', coordinates: { lat: 52.3676, lon: 4.9041 } },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', countryCode: 'SE', timezone: 'Europe/Stockholm', coordinates: { lat: 59.3293, lon: 18.0686 } },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', countryCode: 'CH', timezone: 'Europe/Zurich', coordinates: { lat: 47.3769, lon: 8.5417 } },
  { id: 'warsaw', name: 'Warsaw', country: 'Poland', countryCode: 'PL', timezone: 'Europe/Warsaw', coordinates: { lat: 52.2297, lon: 21.0122 } },
  { id: 'moscow', name: 'Moscow', country: 'Russia', countryCode: 'RU', timezone: 'Europe/Moscow', coordinates: { lat: 55.7558, lon: 37.6173 } },

  // Africa
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', timezone: 'Africa/Cairo', coordinates: { lat: 30.0444, lon: 31.2357 } },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', timezone: 'Africa/Johannesburg', coordinates: { lat: -26.2041, lon: 28.0473 } },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', countryCode: 'NG', timezone: 'Africa/Lagos', coordinates: { lat: 6.5244, lon: 3.3792 } },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', countryCode: 'KE', timezone: 'Africa/Nairobi', coordinates: { lat: -1.2921, lon: 36.8219 } },

  // Asia
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', timezone: 'Asia/Dubai', coordinates: { lat: 25.2048, lon: 55.2708 } },
  { id: 'mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', coordinates: { lat: 19.0760, lon: 72.8777 } },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore', coordinates: { lat: 1.3521, lon: 103.8198 } },
  { id: 'hong-kong', name: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', timezone: 'Asia/Hong_Kong', coordinates: { lat: 22.3193, lon: 114.1694 } },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo', coordinates: { lat: 35.6762, lon: 139.6503 } },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', countryCode: 'KR', timezone: 'Asia/Seoul', coordinates: { lat: 37.5665, lon: 126.9780 } },
  { id: 'shanghai', name: 'Shanghai', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', coordinates: { lat: 31.2304, lon: 121.4737 } },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', timezone: 'Asia/Bangkok', coordinates: { lat: 13.7563, lon: 100.5018 } },

  // Oceania
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney', coordinates: { lat: -33.8688, lon: 151.2093 } },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Melbourne', coordinates: { lat: -37.8136, lon: 144.9631 } },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', timezone: 'Pacific/Auckland', coordinates: { lat: -36.8485, lon: 174.7633 } },

  // UTC
  { id: 'utc', name: 'UTC', country: 'Coordinated Universal Time', countryCode: 'UTC', timezone: 'UTC', coordinates: { lat: 0, lon: 0 } },
];

export function findCityByName(query: string): City[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return MAJOR_CITIES.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery) ||
    city.timezone.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
}

export function getCityById(id: string): City | undefined {
  return MAJOR_CITIES.find(city => city.id === id);
}
import { useState, useEffect, useCallback } from 'react';
import type { WorldClockCity, City, TimezoneInfo } from '../types';
import { MAJOR_CITIES, findCityByName, getCityById } from '../types';

const STORAGE_KEY = 'nothing-clock-world-cities';

function loadCities(): WorldClockCity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }
  return [];
}

function saveCities(cities: WorldClockCity[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    // Ignore save errors
  }
}

export function useWorldClock() {
  const [cities, setCities] = useState<WorldClockCity[]>(() => loadCities());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [times, setTimes] = useState<Map<string, { time: string; offset: string; abbreviation: string }>>(new Map());

  // Persist to localStorage
  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  // Search cities
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = findCityByName(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Real-time clock updates
  const updateTimes = useCallback(() => {
    const now = new Date();
    const newTimes = new Map<string, { time: string; offset: string; abbreviation: string }>();
    
    cities.forEach(city => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: city.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        });
        
        const parts = formatter.formatToParts(now);
        let hour = '', minute = '', second = '', timeZoneName = '';
        
        parts.forEach(part => {
          if (part.type === 'hour') hour = part.value;
          else if (part.type === 'minute') minute = part.value;
          else if (part.type === 'second') second = part.value;
          else if (part.type === 'timeZoneName') timeZoneName = part.value;
        });
        
        // Get UTC offset
        const jan = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const jul = new Date(now.getFullYear(), 6, 1, 0, 0, 0, 0);
        const stdOffset = -jan.getTimezoneOffset();
        const dstOffset = -jul.getTimezoneOffset();
        const currentOffset = -now.getTimezoneOffset();
        
        // Use Intl to get offset for the specific timezone
        const targetDate = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const offsetMinutes = (targetDate.getTime() - utcDate.getTime()) / 60000;
        
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes >= 0 ? '+' : '-';
        const offsetStr = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;
        
        newTimes.set(city.id, {
          time: `${hour}:${minute}:${second}`,
          offset: offsetStr,
          abbreviation: timeZoneName,
        });
      } catch {
        newTimes.set(city.id, {
          time: '--:--:--',
          offset: 'UTC+00:00',
          abbreviation: 'UTC',
        });
      }
    });
    
    setTimes(newTimes);
  }, [cities]);

  // Real-time clock updates
  useEffect(() => {
    updateTimes();
    const intervalId = window.setInterval(updateTimes, 1000);
    return () => clearInterval(intervalId);
  }, [updateTimes]);

  const addCity = useCallback((city: City) => {
    setCities(prev => {
      if (prev.some(c => c.id === city.id)) return prev;
      const newCity: WorldClockCity = {
        ...city,
        addedAt: Date.now(),
      };
      return [...prev, newCity].sort((a, b) => a.name.localeCompare(b.name));
    });
    setSearchQuery('');
    setShowSearchResults(false);
  }, []);

  const removeCity = useCallback((id: string) => {
    setCities(prev => prev.filter(c => c.id !== id));
  }, []);

  const reorderCities = useCallback((newCities: WorldClockCity[]) => {
    setCities(newCities);
  }, []);

  const getTime = useCallback((cityId: string) => {
    return times.get(cityId) || { time: '--:--:--', offset: 'UTC+00:00', abbreviation: 'UTC' };
  }, [times]);

  return {
    cities,
    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    addCity,
    removeCity,
    reorderCities,
    getTime,
  };
}
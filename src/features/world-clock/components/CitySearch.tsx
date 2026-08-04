import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Icon, Typography, Button, Badge } from '../../../components/ui';
import type { City, WorldClockCity } from '../types';
import { getCityById } from '../types';

interface CitySearchProps {
  query: string;
  onChange: (query: string) => void;
  results: City[];
  onSelect: (city: City) => void;
  onClose: () => void;
  show: boolean;
  addedCityIds: string[];
}

export const CitySearch = memo(function CitySearch({ 
  query, 
  onChange, 
  results, 
  onSelect, 
  onClose, 
  show, 
  addedCityIds 
}: CitySearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-bg-primary border border-border-primary rounded-card-lg shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border-primary flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search cities..."
              className="flex-1 bg-bg-tertiary font-mono"
              leftIcon={<Icon name="search" size="md" />}
              rightIcon={
                query && (
                  <motion.button
                    onClick={() => onChange('')}
                    className="p-1 text-text-tertiary hover:text-text-primary"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon name="x" size="sm" />
                  </motion.button>
                )
              }
              autoFocus
            />
            <motion.button
              onClick={onClose}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Close search"
            >
              <Icon name="x" size="md" />
            </motion.button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary">
                <Icon name="search" size="xl" className="mx-auto mb-3 opacity-50" />
                <Typography variant="body-sm">No cities found</Typography>
                <Typography variant="caption" className="mt-1 font-mono">Try a different search term</Typography>
              </div>
            ) : (
              <div className="divide-y divide-border-primary">
                {results.map((city) => {
                  const isAdded = addedCityIds.includes(city.id);
                  return (
                    <motion.button
                      key={city.id}
                      onClick={() => !isAdded && onSelect(city)}
                      disabled={isAdded}
                      className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                        isAdded 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-bg-tertiary'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label={city.countryCode}>{getFlagEmoji(city.countryCode)}</span>
                        <div className="min-w-0">
                          <Typography variant="body-sm" className="text-text-primary truncate font-mono">
                            {city.name}
                          </Typography>
                          <Typography variant="caption" className="text-text-tertiary font-mono truncate">
                            {city.country} • {city.timezone}
                          </Typography>
                        </div>
                      </div>
                      {isAdded ? (
                        <Badge variant="dot" dotColor="green" size="sm">Added</Badge>
                      ) : (
                        <Icon name="plus" size="sm" className="text-text-tertiary" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

CitySearch.displayName = 'CitySearch';

// Simple flag emoji mapping
function getFlagEmoji(countryCode: string): string {
  if (countryCode === 'UTC') return '🌐';
  if (countryCode.length !== 2) return '🏙️';
  const codePoints = countryCode.toUpperCase().split('').map(char => 
    127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}
import { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Typography, Icon, Button, Badge, Input } from '../components/ui';
import { CitySearch } from '../features/world-clock/components/CitySearch';
import { CityCard } from '../features/world-clock/components/CityCard';
import { useWorldClock } from '../features/world-clock/hooks/useWorldClock';
import type { ScreenProps } from '../components/layout/types';
import type { WorldClockCity } from '../features/world-clock/types';

export const WorldClockScreen = memo(function WorldClockScreen({ className = '' }: ScreenProps) {
  const {
    cities,
    searchQuery,
    setSearchQuery,
    searchResults,
    showSearchResults,
    setShowSearchResults,
    addCity,
    removeCity,
    getTime,
  } = useWorldClock();

  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const [draggedCity, setDraggedCity] = useState<WorldClockCity | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, city: WorldClockCity) => {
    setDraggedCity(city);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetCity: WorldClockCity) => {
    e.preventDefault();
    if (draggedCity && draggedCity.id !== targetCity.id) {
      // Reorder cities - this is a simplified version
      // In a full implementation, you'd update the cities array
    }
    setDraggedCity(null);
  }, [draggedCity]);

  const handleDragEnd = useCallback(() => {
    setDraggedCity(null);
  }, []);

  const addedCityIds = cities.map(c => c.id);

  return (
    <motion.main
      className={`flex-1 flex flex-col overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <motion.div
        className="px-6 py-4 border-b border-border-primary flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-primary flex items-center justify-center">
              <Icon name="globe" size="md" className="text-text-secondary" />
            </div>
            <div>
              <Typography variant="display-sm" weight="extralight">
                World Clock
              </Typography>
              <Typography variant="caption" className="font-mono">
                {cities.length} cit{cities.length !== 1 ? 'ies' : 'y'} tracked
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-bg-tertiary rounded-lg px-3 py-1">
              <Typography variant="caption" className="text-text-secondary font-mono">Format:</Typography>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value as '12h' | '24h')}
                className="bg-transparent border-none text-text-primary font-mono text-sm focus:outline-none cursor-pointer"
              >
                <option value="24h">24h</option>
                <option value="12h">12h</option>
              </select>
            </div>

            <motion.button
              onClick={() => setShowSearchResults(true)}
              className="btn-primary"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              <Icon name="plus" size="sm" />
              <span>Add City</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* City List */}
      <motion.div
        className="flex-1 overflow-y-auto px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <motion.div
              className="w-24 h-24 rounded-card-lg bg-bg-card border border-border-primary flex items-center justify-center mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            >
              <Icon name="globe" size="xl" className="text-text-tertiary" />
            </motion.div>
            <Typography variant="display-sm" weight="extralight" className="mb-3">
              No Cities Added
            </Typography>
            <Typography variant="body" className="text-text-secondary max-w-sm mx-auto mb-8">
              Search and add cities to track their local time
            </Typography>
            <motion.button
              onClick={() => setShowSearchResults(true)}
              className="btn-primary"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              <Icon name="plus" size="sm" />
              <span>Add Your First City</span>
            </motion.button>
          </div>
        ) : (
          <div
            className="space-y-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, cities[0])} // Simplified
          >
            {cities.map((city, index) => {
              const timeData = getTime(city.id);
              return (
                <CityCard
                  key={city.id}
                  city={city}
                  time={timeData.time}
                  offset={timeData.offset}
                  abbreviation={timeData.abbreviation}
                  timeFormat={timeFormat}
                  onRemove={() => removeCity(city.id)}
                  onDragStart={(e) => handleDragStart(e, city)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedCity?.id === city.id}
                />
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Search Modal */}
      <CitySearch
        query={searchQuery}
        onChange={setSearchQuery}
        results={searchResults}
        onSelect={addCity}
        onClose={() => setShowSearchResults(false)}
        show={showSearchResults}
        addedCityIds={addedCityIds}
      />
    </motion.main>
  );
});

WorldClockScreen.displayName = 'WorldClockScreen';

function getFlagEmoji(countryCode: string): string {
  if (countryCode === 'UTC') return '🌐';
  if (countryCode.length !== 2) return '🏙️';
  const codePoints = countryCode.toUpperCase().split('').map(char => 
    127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}
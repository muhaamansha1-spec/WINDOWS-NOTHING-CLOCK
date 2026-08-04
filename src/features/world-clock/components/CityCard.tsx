import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Icon, Button, Badge } from '../../../components/ui';
import type { WorldClockCity } from '../types';

interface CityCardProps {
  city: WorldClockCity;
  time: string;
  offset: string;
  abbreviation: string;
  timeFormat: '12h' | '24h';
  onRemove: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export const CityCard = memo(function CityCard({ 
  city, 
  time, 
  offset, 
  abbreviation,
  timeFormat,
  onRemove,
  onDragStart,
  onDragEnd,
  isDragging,
}: CityCardProps) {
  let displayTime = time;
  
  if (timeFormat === '12h' && time !== '--:--:--') {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    displayTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
  }

  return (
    <motion.div
      draggable={true}
      onDragStart={onDragStart as any}
      onDragEnd={onDragEnd as any}
      className={`w-full ${isDragging ? 'opacity-50 rotate-1 shadow-xl' : ''}`}
      whileDrag={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        variant="hover" 
        padding="md" 
        className="flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-3xl flex-shrink-0" role="img" aria-label={city.countryCode}>
            {getFlagEmoji(city.countryCode)}
          </span>
          <div className="min-w-0">
            <Typography variant="body-sm" className="text-text-primary truncate font-mono">
              {city.name}
            </Typography>
            <Typography variant="caption" className="text-text-tertiary font-mono truncate">
              {city.country} • {city.timezone}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <motion.span
              key={time}
              className="font-mono tabular-nums text-text-primary"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {displayTime}
            </motion.span>
            <Typography variant="caption" className="text-text-tertiary font-mono">
              {offset} {abbreviation !== 'UTC' ? `(${abbreviation})` : ''}
            </Typography>
          </div>

          <motion.button
            onClick={onRemove}
            className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-600/20 transition-colors duration-fast opacity-0 group-hover:opacity-100"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label={`Remove ${city.name}`}
          >
            <Icon name="x" size="md" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
});

CityCard.displayName = 'CityCard';

function getFlagEmoji(countryCode: string): string {
  if (countryCode === 'UTC') return '🌐';
  if (countryCode.length !== 2) return '🏙️';
  const codePoints = countryCode.toUpperCase().split('').map(char => 
    127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}
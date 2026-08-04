import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icon, Typography } from '../../../components/ui';

interface TimerProgressProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  showTime?: boolean;
  timeText?: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export const TimerProgress = memo(function TimerProgress({ 
  progress, 
  size = 280, 
  strokeWidth = 8,
  showTime = true,
  timeText = '00:00:00',
  status,
}: TimerProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const getStatusColor = () => {
    switch (status) {
      case 'running': return '#22C55E'; // green
      case 'paused': return '#EAB308';  // yellow
      case 'completed': return '#3B82F6'; // blue
      default: return '#FFFFFF'; // white
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="relative flex flex-col items-center justify-center" role="img" aria-label={`Timer progress: ${Math.round(progress * 100)}%`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#262626"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={statusColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${statusColor})` }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Completion pulse */}
        {status === 'completed' && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: 0, opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </svg>

      {showTime && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Typography variant="clock-2xl" className="font-mono tabular-nums text-text-primary" style={{ fontWeight: '100' }}>
            {timeText}
          </Typography>
          <Typography variant="caption" className="text-text-tertiary font-mono mt-2">
            {status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : status === 'completed' ? 'Complete' : 'Ready'}
          </Typography>
        </motion.div>
      )}
    </div>
  );
});

TimerProgress.displayName = 'TimerProgress';
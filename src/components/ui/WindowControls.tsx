import { motion } from 'framer-motion';
import { useWindowControls } from '../../hooks/useWindowControls';

export function WindowControls() {
  const { isMaximized, minimize, maximize, close } = useWindowControls();

  return (
    <div
      className="fixed top-0 right-0 z-50 flex items-center gap-1 p-2"
      style={{ WebkitAppRegion: 'no-drag' } as any}
      role="group"
      aria-label="Window controls"
    >
      <motion.button
        onClick={minimize}
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Minimize"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </motion.button>

      <motion.button
        onClick={maximize}
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        {isMaximized ? (
          <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8v8M15 8v8" />
          </svg>
        )}
      </motion.button>

      <motion.button
        onClick={close}
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Close"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    </div>
  );
}
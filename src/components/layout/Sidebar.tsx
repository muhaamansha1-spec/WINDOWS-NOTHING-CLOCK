import { motion, AnimatePresence } from 'framer-motion';
import { Icon, Typography } from '../ui';
import type { NavItem } from './types';

interface SidebarProps {
  activeItem: string;
  onNavigate: (itemId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Clock', icon: 'clock', shortcut: '⌘1' },
  { id: 'timer', label: 'Timer', icon: 'timer', shortcut: '⌘2' },
  { id: 'alarm', label: 'Alarms', icon: 'alarm', shortcut: '⌘3' },
  { id: 'stopwatch', label: 'Stopwatch', icon: 'stopwatch', shortcut: '⌘4' },
  { id: 'dock', label: 'Dock Mode', icon: 'monitor', shortcut: 'F11' },
  { id: 'world-clock', label: 'World Clock', icon: 'globe', shortcut: '⌘5' },
];

export function Sidebar({
  activeItem,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.aside
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-bg-primary border-r border-border-primary transition-all duration-normal ease-out-expo ${isCollapsed ? 'w-16' : 'w-64'}`}
        initial={{ width: isCollapsed ? 64 : 256, opacity: 0 }}
        animate={{ width: isCollapsed ? 64 : 256, opacity: 1 }}
        exit={{ width: isCollapsed ? 64 : 256, opacity: 0 }}
        style={{ width: isCollapsed ? '64px' : '256px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border-primary">
            {!isCollapsed && (
              <motion.span
                className="font-mono text-sm font-medium tracking-wide text-text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Nothing Clock
              </motion.span>
            )}
            <motion.button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-fast flex-shrink-0"
              whileTap={{ scale: 0.9 }}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'chevronRight' : 'chevronLeft'} size="md" />
            </motion.button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" role="navigation" aria-label="Main navigation">
            <AnimatePresence mode="popLayout">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-fast ease-out-expo
                    ${activeItem === item.id
                      ? 'bg-bg-card text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  whileHover={{ scale: isCollapsed ? 1 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  aria-current={activeItem === item.id ? 'page' : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} size="md" className="flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-mono text-sm font-medium tracking-wide flex-1 truncate">
                        {item.label}
                      </span>
                      <Typography variant="caption" className="opacity-50 whitespace-nowrap">
                        {item.shortcut}
                      </Typography>
                    </>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </nav>

          <div className="p-3 border-t border-border-primary">
            <motion.button
              onClick={() => onNavigate('settings')}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-fast ease-out-expo
                ${activeItem === 'settings'
                  ? 'bg-bg-card text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
              whileHover={{ scale: isCollapsed ? 1 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              aria-current={activeItem === 'settings' ? 'page' : undefined}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Icon name="settings" size="md" className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-mono text-sm font-medium tracking-wide">
                  Settings
                </span>
              )}
            </motion.button>

            {!isCollapsed && (
              <motion.div
                className="mt-4 pt-4 border-t border-border-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Typography variant="overline" className="mb-3">
                  Version
                </Typography>
                <Typography variant="caption" className="font-mono">
                  1.0.0
                </Typography>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
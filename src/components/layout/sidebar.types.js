/**
 * @file src/components/layout/sidebar.types.js
 * @description Centralized navigation route definitions and metadata
 */
import {
  LayoutDashboard,
  Bot,
  Image,
  History,
  Settings,
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    path: '/',
    ord: '01',
    icon: LayoutDashboard,
    label: 'Clip Generator',
    short: 'Clips',
    primary: true,
  },
  {
    id: 'ai-agent',
    path: '/ai-agent',
    ord: '02',
    icon: Bot,
    label: 'AI Agent',
    short: 'Agent',
    byok: true,
  },
  {
    id: 'thumbnails',
    path: '/thumbnails',
    ord: '03',
    icon: Image,
    label: 'YouTube Studio',
    short: 'Studio',
    primary: true,
  },
  {
    id: 'settings',
    path: '/settings',
    ord: '04',
    icon: Settings,
    label: 'Settings',
    short: 'Settings',
  },
];


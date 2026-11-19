/**
 * @file src/components/layout/sidebar.types.js
 * @description Centralized navigation route definitions and metadata
 */
import {
  LayoutDashboard,
  Image,
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
    id: 'thumbnails',
    path: '/thumbnails',
    ord: '02',
    icon: Image,
    label: 'YouTube Studio',
    short: 'Studio',
    primary: true,
  },
  {
    id: 'settings',
    path: '/settings',
    ord: '03',
    icon: Settings,
    label: 'Settings',
    short: 'Settings',
  },
];


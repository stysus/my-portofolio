/**
 * Project Design System & Architecture Type Definitions
 */

export interface SiteMeta {
  title: string;
  description: string;
  author: string;
  ogImage?: string;
}

export type DesignTokenCategory = 
  | 'background'
  | 'surface'
  | 'surfaceElevated'
  | 'border'
  | 'primaryNeon'
  | 'secondaryNeon'
  | 'accent'
  | 'text'
  | 'mutedText'
  | 'glow'
  | 'radius'
  | 'spacing'
  | 'shadows';

export interface DesignTokenItem {
  name: string;
  cssVariable: string;
  value: string;
  category: DesignTokenCategory;
  description: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

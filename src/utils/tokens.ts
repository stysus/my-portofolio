import type { DesignTokenItem } from '../types';

export const DESIGN_TOKENS: DesignTokenItem[] = [
  // Background Tokens
  { name: 'Background Primary', cssVariable: '--bg-primary', value: '#07070f', category: 'background', description: 'Main obsidian dark backdrop' },
  { name: 'Background Secondary', cssVariable: '--bg-secondary', value: '#0c0d1a', category: 'background', description: 'Deep slate blue background layer' },
  { name: 'Background Elevated', cssVariable: '--bg-elevated', value: '#131527', category: 'background', description: 'Elevated dark container layer' },
  { name: 'Background Glass', cssVariable: '--bg-glass', value: 'rgba(12, 13, 26, 0.75)', category: 'background', description: 'Translucent background glass' },

  // Surface Tokens
  { name: 'Surface Base', cssVariable: '--surface', value: '#111322', category: 'surface', description: 'Base card and panel surface' },
  { name: 'Surface Hover', cssVariable: '--surface-hover', value: '#191c32', category: 'surface', description: 'Interactive card hover state' },
  { name: 'Surface Active', cssVariable: '--surface-active', value: '#212543', category: 'surface', description: 'Active element surface state' },

  // Surface Elevated Tokens
  { name: 'Surface Elevated', cssVariable: '--surface-elevated', value: '#191b35', category: 'surfaceElevated', description: 'Elevated floating card surface' },
  { name: 'Surface Glass', cssVariable: '--surface-glass', value: 'rgba(17, 19, 34, 0.7)', category: 'surfaceElevated', description: 'Glassmorphic frosted surface' },
  { name: 'Surface Glow', cssVariable: '--surface-glow', value: 'rgba(168, 85, 247, 0.06)', category: 'surfaceElevated', description: 'Ambient purple glow surface' },

  // Border Tokens
  { name: 'Border Subtle', cssVariable: '--border-subtle', value: 'rgba(255, 255, 255, 0.07)', category: 'border', description: 'Subtle container boundary line' },
  { name: 'Border Default', cssVariable: '--border-default', value: 'rgba(255, 255, 255, 0.12)', category: 'border', description: 'Standard container border' },
  { name: 'Border Active', cssVariable: '--border-active', value: 'rgba(168, 85, 247, 0.5)', category: 'border', description: 'Interactive active item border' },
  { name: 'Border Neon Primary', cssVariable: '--border-neon-primary', value: 'rgba(168, 85, 247, 0.35)', category: 'border', description: 'Neon purple border glow' },
  { name: 'Border Neon Secondary', cssVariable: '--border-neon-secondary', value: 'rgba(56, 189, 248, 0.35)', category: 'border', description: 'Neon cyan border glow' },

  // Primary Neon Tokens
  { name: 'Primary Neon Base', cssVariable: '--primary-neon', value: '#a855f7', category: 'primaryNeon', description: 'Core cyberpunk neon purple' },
  { name: 'Primary Neon Bright', cssVariable: '--primary-neon-bright', value: '#c084fc', category: 'primaryNeon', description: 'Vibrant highlight neon purple' },
  { name: 'Primary Neon Dark', cssVariable: '--primary-neon-dark', value: '#7e22ce', category: 'primaryNeon', description: 'Deep purple accent shading' },

  // Secondary Neon Tokens
  { name: 'Secondary Neon Base', cssVariable: '--secondary-neon', value: '#38bdf8', category: 'secondaryNeon', description: 'Electric neon cyan blue' },
  { name: 'Secondary Neon Bright', cssVariable: '--secondary-neon-bright', value: '#7dd3fc', category: 'secondaryNeon', description: 'Vibrant highlight neon cyan' },

  // Accent Tokens
  { name: 'Accent Pink', cssVariable: '--accent-pink', value: '#ec4899', category: 'accent', description: 'Hot magenta pink highlight' },
  { name: 'Accent Green', cssVariable: '--accent-green', value: '#4ade80', category: 'accent', description: 'Cyber green indicator accent' },
  { name: 'Accent Purple', cssVariable: '--accent-purple', value: '#8b5cf6', category: 'accent', description: 'Deep electric violet accent' },

  // Text Tokens
  { name: 'Text Bright', cssVariable: '--text-bright', value: '#ffffff', category: 'text', description: 'High contrast text and titles' },
  { name: 'Text Primary', cssVariable: '--text-primary', value: '#f8fafc', category: 'text', description: 'Primary readable body text' },
  { name: 'Text Secondary', cssVariable: '--text-secondary', value: '#94a3b8', category: 'text', description: 'Secondary descriptive text' },

  // Muted Text Tokens
  { name: 'Text Muted', cssVariable: '--text-muted', value: '#64748b', category: 'mutedText', description: 'Muted captions, dates, and meta info' },

  // Glow Tokens
  { name: 'Glow Primary', cssVariable: '--glow-primary', value: '0 0 25px rgba(168, 85, 247, 0.45)', category: 'glow', description: 'Purple ambient neon box-shadow' },
  { name: 'Glow Secondary', cssVariable: '--glow-secondary', value: '0 0 25px rgba(56, 189, 248, 0.45)', category: 'glow', description: 'Cyan ambient neon box-shadow' },
  { name: 'Glow Accent', cssVariable: '--glow-accent', value: '0 0 25px rgba(236, 72, 153, 0.45)', category: 'glow', description: 'Pink ambient neon box-shadow' },
  { name: 'Glow Box', cssVariable: '--glow-box', value: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', category: 'glow', description: 'Glass panel depth shadow' },

  // Radius Tokens
  { name: 'Radius Small', cssVariable: '--radius-sm', value: '0.375rem (6px)', category: 'radius', description: 'Small component rounding' },
  { name: 'Radius Medium', cssVariable: '--radius-md', value: '0.5rem (8px)', category: 'radius', description: 'Default card rounding' },
  { name: 'Radius Large', cssVariable: '--radius-lg', value: '0.75rem (12px)', category: 'radius', description: 'Large panel rounding' },
  { name: 'Radius XL', cssVariable: '--radius-xl', value: '1rem (16px)', category: 'radius', description: 'Extra large hero component rounding' },

  // Spacing Tokens
  { name: 'Spacing XS', cssVariable: '--space-xs', value: '0.5rem (8px)', category: 'spacing', description: 'Tight component gap' },
  { name: 'Spacing SM', cssVariable: '--space-sm', value: '0.75rem (12px)', category: 'spacing', description: 'Compact element margin/padding' },
  { name: 'Spacing MD', cssVariable: '--space-md', value: '1rem (16px)', category: 'spacing', description: 'Standard container padding' },
  { name: 'Spacing LG', cssVariable: '--space-lg', value: '1.5rem (24px)', category: 'spacing', description: 'Section content padding' },
  { name: 'Spacing XL', cssVariable: '--space-xl', value: '2rem (32px)', category: 'spacing', description: 'Major section layout spacing' },

  // Shadow Tokens
  { name: 'Shadow Neon Purple', cssVariable: '--shadow-neon-purple', value: '0 0 20px rgba(168, 85, 247, 0.35)', category: 'shadows', description: 'Glowing purple shadow' },
  { name: 'Shadow Neon Cyan', cssVariable: '--shadow-neon-cyan', value: '0 0 20px rgba(56, 189, 248, 0.35)', category: 'shadows', description: 'Glowing cyan shadow' },
  { name: 'Shadow Glass', cssVariable: '--shadow-glass', value: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', category: 'shadows', description: 'Dark glass floating depth shadow' }
];

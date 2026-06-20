/**
 * Industrial Site Layout Configurations
 * Centralized constants governing physical dimensions, rendering scalars, and brand design tokens.
 */

export const LAYOUT_CONSTRAINTS = {
  SCALE: 4,               // Mapping ratio: 1 Physical Foot = 4 Render Pixels
  MAX_WIDTH_FEET: 100,    // Hard boundary ceiling limit for industrial plot width
  FALLBACK_HEIGHT_FEET: 100, // Default visual viewport baseline
} as const;

export const TYPE_COLOR_MAP: Record<string, string> = {
  battery: '#3498db',     // Tesla Blue
  transformer: '#e67e22', // Industrial Orange
} as const;
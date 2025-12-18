/**
 * Unit conversion utilities for recipe ingredients
 */

type UnitSystem = 'us' | 'metric';

interface ConversionResult {
  amount: number;
  unit: string;
}

// US to Metric conversion factors
const CONVERSIONS: Record<string, { metric: string; factor: number }> = {
  // Volume
  'cup': { metric: 'ml', factor: 236.588 },
  'cups': { metric: 'ml', factor: 236.588 },
  'tbsp': { metric: 'ml', factor: 14.787 },
  'tablespoon': { metric: 'ml', factor: 14.787 },
  'tablespoons': { metric: 'ml', factor: 14.787 },
  'tsp': { metric: 'ml', factor: 4.929 },
  'teaspoon': { metric: 'ml', factor: 4.929 },
  'teaspoons': { metric: 'ml', factor: 4.929 },
  'fl oz': { metric: 'ml', factor: 29.574 },
  'fluid ounce': { metric: 'ml', factor: 29.574 },
  'fluid ounces': { metric: 'ml', factor: 29.574 },
  'pint': { metric: 'ml', factor: 473.176 },
  'pints': { metric: 'ml', factor: 473.176 },
  'quart': { metric: 'L', factor: 0.946 },
  'quarts': { metric: 'L', factor: 0.946 },
  'gallon': { metric: 'L', factor: 3.785 },
  'gallons': { metric: 'L', factor: 3.785 },

  // Weight
  'oz': { metric: 'g', factor: 28.35 },
  'ounce': { metric: 'g', factor: 28.35 },
  'ounces': { metric: 'g', factor: 28.35 },
  'lb': { metric: 'g', factor: 453.592 },
  'pound': { metric: 'g', factor: 453.592 },
  'pounds': { metric: 'g', factor: 453.592 },
  'lbs': { metric: 'g', factor: 453.592 },

  // Temperature (special handling)
  '°f': { metric: '°C', factor: 0 }, // Special case
  'fahrenheit': { metric: '°C', factor: 0 },

  // Length
  'inch': { metric: 'cm', factor: 2.54 },
  'inches': { metric: 'cm', factor: 2.54 },
  'in': { metric: 'cm', factor: 2.54 },
};

// Metric to US conversion (reverse)
const METRIC_TO_US: Record<string, { us: string; factor: number }> = {
  'ml': { us: 'tbsp', factor: 0.0676 },
  'l': { us: 'cups', factor: 4.227 },
  'g': { us: 'oz', factor: 0.0353 },
  'kg': { us: 'lbs', factor: 2.205 },
  'cm': { us: 'inches', factor: 0.394 },
};

/**
 * Convert an amount from one unit system to another
 */
export function convertUnit(
  amount: number,
  unit: string | null,
  targetSystem: UnitSystem
): ConversionResult {
  if (!unit) {
    return { amount, unit: '' };
  }

  const normalizedUnit = unit.toLowerCase().trim();

  if (targetSystem === 'metric') {
    const conversion = CONVERSIONS[normalizedUnit];
    if (conversion) {
      // Special case for temperature
      if (normalizedUnit === '°f' || normalizedUnit === 'fahrenheit') {
        return {
          amount: Math.round((amount - 32) * 5 / 9),
          unit: '°C'
        };
      }

      let convertedAmount = amount * conversion.factor;
      let convertedUnit = conversion.metric;

      // Smart unit scaling for readability
      if (convertedUnit === 'ml' && convertedAmount >= 1000) {
        convertedAmount = convertedAmount / 1000;
        convertedUnit = 'L';
      } else if (convertedUnit === 'g' && convertedAmount >= 1000) {
        convertedAmount = convertedAmount / 1000;
        convertedUnit = 'kg';
      }

      return { amount: convertedAmount, unit: convertedUnit };
    }
  } else if (targetSystem === 'us') {
    const conversion = METRIC_TO_US[normalizedUnit];
    if (conversion) {
      return {
        amount: amount * conversion.factor,
        unit: conversion.us
      };
    }
  }

  // No conversion found, return as-is
  return { amount, unit };
}

/**
 * Scale an amount by a factor
 */
export function scaleAmount(amount: number, scale: number): number {
  return amount * scale;
}

/**
 * Format a number for display (with fractions for US, decimals for metric)
 */
export function formatAmount(
  amount: number,
  unitSystem: UnitSystem = 'us'
): string {
  if (unitSystem === 'metric') {
    // Metric uses decimals
    if (amount >= 100) {
      return Math.round(amount).toString();
    } else if (amount >= 10) {
      return amount.toFixed(0);
    } else if (amount >= 1) {
      return amount.toFixed(1).replace(/\.0$/, '');
    } else {
      return amount.toFixed(2).replace(/\.?0+$/, '');
    }
  }

  // US uses fractions
  return formatWithFractions(amount);
}

/**
 * Convert decimal to fraction for US measurements
 */
function formatWithFractions(num: number): string {
  const fractions: Record<number, string> = {
    0.125: '⅛',
    0.25: '¼',
    0.333: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.667: '⅔',
    0.75: '¾',
    0.875: '⅞',
  };

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Find closest fraction
  let closestFrac = '';
  let minDiff = 0.05; // Threshold for matching

  for (const [key, value] of Object.entries(fractions)) {
    const diff = Math.abs(decimal - parseFloat(key));
    if (diff < minDiff) {
      minDiff = diff;
      closestFrac = value;
    }
  }

  if (closestFrac) {
    return whole > 0 ? `${whole}${closestFrac}` : closestFrac;
  }

  // No close fraction found
  if (decimal === 0 || decimal < 0.05) {
    return whole.toString();
  }

  // Return as decimal
  return num.toFixed(num < 1 ? 2 : 1).replace(/\.?0+$/, '');
}

/**
 * Check if a unit is a volume measurement
 */
export function isVolumeUnit(unit: string | null): boolean {
  if (!unit) return false;
  const volumeUnits = ['cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons', 'fl oz', 'fluid ounce', 'pint', 'pints', 'quart', 'quarts', 'gallon', 'gallons', 'ml', 'l', 'liter', 'liters'];
  return volumeUnits.includes(unit.toLowerCase().trim());
}

/**
 * Check if a unit is a weight measurement
 */
export function isWeightUnit(unit: string | null): boolean {
  if (!unit) return false;
  const weightUnits = ['oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds', 'g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms'];
  return weightUnits.includes(unit.toLowerCase().trim());
}

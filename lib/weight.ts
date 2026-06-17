import type { LogEntry, WeightUnit } from './types';

export interface WeightPoint {
  date: string;
  weight: number;
  unit: WeightUnit;
  grams: number;
}

export function weightToGrams(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return weight * 1000;
    case 'oz':
      return weight * 28.3495;
    case 'lb':
      return weight * 453.592;
    default:
      return weight;
  }
}

export function formatWeight(weight: number, unit: WeightUnit): string {
  const rounded = Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
  return `${rounded} ${unit}`;
}

export function getWeightPoints(logs: LogEntry[]): WeightPoint[] {
  return logs
    .filter((log) => log.type === 'weight' && log.weight != null)
    .map((log) => {
      const unit = log.weightUnit ?? 'g';
      const weight = log.weight as number;
      return {
        date: log.date,
        weight,
        unit,
        grams: weightToGrams(weight, unit),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getWeightChange(points: WeightPoint[]): number | null {
  if (points.length < 2) return null;
  const latest = points[points.length - 1].grams;
  const previous = points[points.length - 2].grams;
  return latest - previous;
}

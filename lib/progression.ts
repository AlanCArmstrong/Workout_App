export type ProgressionType = 'linear' | 'exponential' | 'percentage';
export type FrequencyType = 'per_workout' | 'per_rotation' | 'weekly' | 'bi_weekly';

interface ProgressionSettings {
  currentWeight: number;
  currentReps: number;
  currentSets: number;
  progressionType: ProgressionType;
  growthRate: number;
  frequency: FrequencyType;
}

interface WorkoutRecommendation {
  recommendedWeight: number;
  recommendedReps: number;
  recommendedSets: number;
  nextWeight: number;
}

/**
 * Calculate the next recommended weight based on progression settings
 */
export function calculateNextWeight(
  currentWeight: number,
  progressionType: ProgressionType,
  growthRate: number
): number {
  switch (progressionType) {
    case 'linear':
      return currentWeight + growthRate;
    
    case 'exponential':
      return currentWeight * (1 + growthRate / 100);
    
    case 'percentage':
      return currentWeight * (1 + growthRate / 100);
    
    default:
      return currentWeight + growthRate;
  }
}

/**
 * Determine if weight should increase based on workout count and frequency
 */
export function shouldIncreaseWeight(
  workoutCount: number,
  frequency: FrequencyType
): boolean {
  switch (frequency) {
    case 'per_workout':
      return true;
    
    case 'per_rotation':
      // Assuming rotation is every 3 workouts
      return workoutCount % 3 === 0;
    
    case 'weekly':
      // Assuming 3 workouts per week
      return workoutCount % 3 === 0;
    
    case 'bi_weekly':
      // Assuming 3 workouts per week, so 6 workouts = 2 weeks
      return workoutCount % 6 === 0;
    
    default:
      return true;
  }
}

/**
 * Generate workout recommendation based on progression settings
 */
export function generateRecommendation(
  settings: ProgressionSettings,
  workoutsSinceLastIncrease: number = 1
): WorkoutRecommendation {
  const shouldIncrease = shouldIncreaseWeight(
    workoutsSinceLastIncrease,
    settings.frequency
  );

  const nextWeight = shouldIncrease
    ? calculateNextWeight(
        settings.currentWeight,
        settings.progressionType,
        settings.growthRate
      )
    : settings.currentWeight;

  // Round to nearest 2.5 lbs for practical weight plate increments
  const roundedNextWeight = Math.round(nextWeight / 2.5) * 2.5;

  return {
    recommendedWeight: settings.currentWeight,
    recommendedReps: settings.currentReps,
    recommendedSets: settings.currentSets,
    nextWeight: roundedNextWeight,
  };
}

/**
 * Format weight for display (remove unnecessary decimals)
 */
export function formatWeight(weight: number): string {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
}

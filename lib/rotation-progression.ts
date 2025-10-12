// Rotation-based workout progression algorithm with priority system

interface DayExercise {
  id: string
  name: string
  weight: number
  reps: number
  sets: number
  partialReps: number
}

interface PriorityRules {
  repPriority: number
  setPriority: number
  weightPriority: number
  repMax: number
  repMin: number
  setMax: number
  setMin: number
  repsToSetsMultiplier: number
  weightRange: number
}

interface GrowthSettings {
  growthType: 'linear' | 'percent' | 'sigmoid'
  amount: number
  frequency: 'day' | 'rotation' | 'week'
}

interface Priority {
  type: 'rep' | 'set' | 'weight' | 'partial'
  priority: number
}

/**
 * Calculate the next progression for an exercise based on priority rules
 */
export function calculateNextProgression(
  exercise: DayExercise,
  priorityRules: PriorityRules,
  growthSettings: GrowthSettings
): DayExercise {
  // Sort priorities (1 = highest, partial always 4)
  const priorities: Priority[] = [
    { type: 'rep' as const, priority: priorityRules.repPriority },
    { type: 'set' as const, priority: priorityRules.setPriority },
    { type: 'weight' as const, priority: priorityRules.weightPriority },
    { type: 'partial' as const, priority: 4 }
  ].sort((a, b) => a.priority - b.priority)

  // Try each progression type in priority order
  for (const priority of priorities) {
    switch (priority.type) {
      case 'rep':
        if (canIncreaseReps(exercise, priorityRules)) {
          return increaseReps(exercise)
        }
        break
      
      case 'set':
        if (canIncreaseSets(exercise, priorityRules)) {
          return increaseSets(exercise, priorityRules)
        }
        break
      
      case 'weight':
        if (canIncreaseWeight(exercise, priorityRules, growthSettings)) {
          return increaseWeight(exercise, growthSettings, priorityRules)
        }
        break
      
      case 'partial':
        // Partial reps are always possible as last resort
        return increasePartialReps(exercise)
    }
  }

  // If somehow nothing worked, return unchanged
  return exercise
}

/**
 * Check if reps can be increased
 * - Must not exceed repMax
 * - Must maintain reps > (multiplier * sets) constraint
 */
function canIncreaseReps(exercise: DayExercise, rules: PriorityRules): boolean {
  const newReps = exercise.reps + 1
  
  // Check max constraint
  if (newReps > rules.repMax) return false
  
  // Check reps > (multiplier * sets) constraint
  if (newReps <= rules.repsToSetsMultiplier * exercise.sets) return false
  
  return true
}

/**
 * Increase reps by 1
 */
function increaseReps(exercise: DayExercise): DayExercise {
  return {
    ...exercise,
    reps: exercise.reps + 1
  }
}

/**
 * Check if sets can be increased
 * - Must not exceed setMax
 * - Must maintain reps > (multiplier * sets) constraint after increase
 */
function canIncreaseSets(exercise: DayExercise, rules: PriorityRules): boolean {
  const newSets = exercise.sets + 1
  
  // Check max constraint
  if (newSets > rules.setMax) return false
  
  // Check reps > (multiplier * sets) constraint with new set count
  if (exercise.reps <= rules.repsToSetsMultiplier * newSets) return false
  
  return true
}

/**
 * Increase sets by 1, reset reps to minimum
 */
function increaseSets(exercise: DayExercise, rules: PriorityRules): DayExercise {
  return {
    ...exercise,
    sets: exercise.sets + 1,
    reps: rules.repMin  // Reset to minimum reps when adding a set
  }
}

/**
 * Check if weight can be increased
 * - Must be within weightRange constraint
 */
function canIncreaseWeight(
  exercise: DayExercise,
  rules: PriorityRules,
  settings: GrowthSettings
): boolean {
  const increase = calculateWeightIncrease(exercise.weight, settings)
  
  // Check if increase is within allowed range
  return Math.abs(increase) <= rules.weightRange
}

/**
 * Increase weight, reset reps and sets to minimum
 */
function increaseWeight(
  exercise: DayExercise,
  settings: GrowthSettings,
  rules: PriorityRules
): DayExercise {
  const increase = calculateWeightIncrease(exercise.weight, settings)
  
  return {
    ...exercise,
    weight: exercise.weight + increase,
    reps: rules.repMin,   // Reset to minimum
    sets: rules.setMin,   // Reset to minimum
    partialReps: 0        // Clear partial reps
  }
}

/**
 * Calculate weight increase based on growth settings
 */
function calculateWeightIncrease(currentWeight: number, settings: GrowthSettings): number {
  switch (settings.growthType) {
    case 'linear':
      return settings.amount  // e.g., +5 lbs
    
    case 'percent':
      return currentWeight * (settings.amount / 100)  // e.g., +5%
    
    case 'sigmoid':
      // TODO: Implement sigmoid curve (will work on this together)
      // For now, use linear
      return settings.amount
    
    default:
      return settings.amount
  }
}

/**
 * Add one partial rep (last resort)
 */
function increasePartialReps(exercise: DayExercise): DayExercise {
  return {
    ...exercise,
    partialReps: exercise.partialReps + 1
  }
}

/**
 * Calculate total load (volume) for an exercise
 * Formula: weight × reps × sets + weight × partialReps
 */
export function calculateTotalLoad(exercise: DayExercise): number {
  const mainLoad = exercise.weight * exercise.reps * exercise.sets
  const partialLoad = exercise.weight * exercise.partialReps
  return mainLoad + partialLoad
}

/**
 * Format exercise display (e.g., "40 lb, 13 reps, 4 sets + 1")
 */
export function formatExerciseDisplay(exercise: DayExercise): string {
  const base = `${exercise.weight} lb, ${exercise.reps} reps, ${exercise.sets} sets`
  if (exercise.partialReps > 0) {
    return `${base} + ${exercise.partialReps} rep${exercise.partialReps > 1 ? 's' : ''}`
  }
  return base
}

/**
 * Check if it's time to progress based on frequency setting
 */
export function shouldProgress(
  lastWorkoutDate: Date | null,
  currentDayIndex: number,
  totalDays: number,
  frequency: 'day' | 'rotation' | 'week'
): boolean {
  switch (frequency) {
    case 'day':
      // Progress after every workout
      return true
    
    case 'rotation':
      // Progress only after completing full rotation
      return currentDayIndex === totalDays - 1
    
    case 'week':
      // Progress after 7 days
      if (!lastWorkoutDate) return false
      const daysSince = Math.floor((Date.now() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysSince >= 7
    
    default:
      return true
  }
}

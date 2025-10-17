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
  weightIncrement: number
  overEstimateTolerance: number
}

interface GrowthSettings {
  growthType: 'linear' | 'percent' | 'sigmoid'
  amount: number
  frequency: 'day' | 'rotation' | 'week'
  decayRate: number
  iterationCount: number
}

interface Priority {
  type: 'rep' | 'set' | 'weight' | 'partial'
  priority: number
}

/**
 * Round weight to nearest increment (2.5 lb, 5 lb, etc.)
 */
function roundWeight(weight: number, increment: number): number {
  return Math.round(weight / increment) * increment
}

/**
 * Calculate the next progression for an exercise using optimization
 * Finds the best combination of reps, sets, weight, and partials that gets closest to target load
 */
export function calculateNextProgression(
  exercise: DayExercise,
  priorityRules: PriorityRules,
  growthSettings: GrowthSettings
): DayExercise {
  // Calculate current total load
  const currentLoad = calculateTotalLoad(exercise)
  
  // Calculate target load based on growth settings
  let targetLoad: number
  
  if (growthSettings.growthType === 'linear') {
    // Linear: Add fixed amount to each rep
    // Target = current + (growth_amount * current_reps_total)
    const totalReps = exercise.reps * exercise.sets + exercise.partialReps
    targetLoad = currentLoad + (growthSettings.amount * totalReps)
  } else {
    // Percent and Sigmoid: Multiply by percentage
    const growthPercent = calculateWeightIncrease(exercise.weight, growthSettings) / exercise.weight
    targetLoad = currentLoad * (1 + growthPercent)
  }
  
  // Generate possible values for each parameter
  const possibleReps: number[] = []
  for (let r = priorityRules.repMin; r <= priorityRules.repMax; r++) {
    possibleReps.push(r)
  }
  
  const possibleSets: number[] = []
  for (let s = priorityRules.setMin; s <= priorityRules.setMax; s++) {
    possibleSets.push(s)
  }
  
  // Possible weights: current -5, current, current +5
  // (rounded to weightIncrement)
  const possibleWeights: number[] = [
    roundWeight(exercise.weight - 5, priorityRules.weightIncrement),
    roundWeight(exercise.weight, priorityRules.weightIncrement),
    roundWeight(exercise.weight + 5, priorityRules.weightIncrement),
  ].filter((w, i, arr) => w > 0 && arr.indexOf(w) === i) // Remove duplicates and negatives
  
  const possiblePartials: number[] = []
  for (let p = 0; p <= 20; p++) {
    possiblePartials.push(p)
  }
  
  // Generate all combinations and find the best one
  interface Combination {
    reps: number
    sets: number
    weight: number
    partials: number
    load: number
    distance: number
  }
  
  const combinations: Combination[] = []
  
  for (const reps of possibleReps) {
    for (const sets of possibleSets) {
      for (const weight of possibleWeights) {
        for (const partials of possiblePartials) {
          // Check constraints
          if (reps <= sets * priorityRules.repsToSetsMultiplier) {
            continue // Skip: reps must be > (sets * multiplier)
          }
          
          // Calculate total load for this combination
          const load = weight * reps * sets + weight * partials
          
          // Only consider combinations that meet or exceed target
          // Or if nothing meets target, consider all
          const distance = Math.abs(load - targetLoad)
          
          combinations.push({
            reps,
            sets,
            weight,
            partials,
            load,
            distance
          })
        }
      }
    }
  }
  
  if (combinations.length === 0) {
    // No valid combinations, return unchanged
    return exercise
  }
  
  // Filter to combinations >= target load (never under-estimate)
  const meetsTarget = combinations.filter(c => c.load >= targetLoad)
  const validCombos = meetsTarget.length > 0 ? meetsTarget : combinations
  
  // Sort by distance from target (ascending) - find closest match
  validCombos.sort((a, b) => a.distance - b.distance)
  
  // Return the best combination (closest to target)
  let best = validCombos[0]
  
  // Post-process: If partial reps > reps, consolidate into full sets
  // Example: 10 reps, 3 sets, 12 partials → 10 reps, 4 sets, 2 partials
  let finalReps = best.reps
  let finalSets = best.sets
  let finalPartials = best.partials
  
  while (finalPartials >= finalReps && finalSets < priorityRules.setMax) {
    finalSets += 1
    finalPartials -= finalReps
  }
  
  return {
    ...exercise,
    reps: finalReps,
    sets: finalSets,
    weight: best.weight,
    partialReps: finalPartials
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
      // Sigmoid: Percentage growth with decay
      // Formula: currentPercent = initialPercent - (decayRate * iterationCount)
      // Example: 1% - (0.01% * iteration) = stops at 100 iterations (0% growth)
      const currentPercent = Math.max(0, settings.amount - (settings.decayRate * settings.iterationCount))
      return currentWeight * (currentPercent / 100)
    
    default:
      return settings.amount
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

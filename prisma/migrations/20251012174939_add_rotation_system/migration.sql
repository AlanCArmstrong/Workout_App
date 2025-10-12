-- CreateTable
CREATE TABLE "WorkoutRotation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Rotation',
    "currentDayIndex" INTEGER NOT NULL DEFAULT 0,
    "lastWorkoutDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutRotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotationDay" (
    "id" TEXT NOT NULL,
    "rotationId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Day',
    "order" INTEGER NOT NULL,

    CONSTRAINT "RotationDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayExercise" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "partialReps" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriorityRules" (
    "id" TEXT NOT NULL,
    "rotationId" TEXT NOT NULL,
    "repPriority" INTEGER NOT NULL DEFAULT 1,
    "setPriority" INTEGER NOT NULL DEFAULT 2,
    "weightPriority" INTEGER NOT NULL DEFAULT 3,
    "repMax" INTEGER NOT NULL DEFAULT 15,
    "repMin" INTEGER NOT NULL DEFAULT 8,
    "setMax" INTEGER NOT NULL DEFAULT 5,
    "setMin" INTEGER NOT NULL DEFAULT 3,
    "repsToSetsMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "weightRange" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriorityRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthSettings" (
    "id" TEXT NOT NULL,
    "rotationId" TEXT NOT NULL,
    "growthType" TEXT NOT NULL DEFAULT 'percent',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "frequency" TEXT NOT NULL DEFAULT 'rotation',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RotationDay_rotationId_idx" ON "RotationDay"("rotationId");

-- CreateIndex
CREATE UNIQUE INDEX "RotationDay_rotationId_dayNumber_key" ON "RotationDay"("rotationId", "dayNumber");

-- CreateIndex
CREATE INDEX "DayExercise_dayId_idx" ON "DayExercise"("dayId");

-- CreateIndex
CREATE UNIQUE INDEX "PriorityRules_rotationId_key" ON "PriorityRules"("rotationId");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthSettings_rotationId_key" ON "GrowthSettings"("rotationId");

-- AddForeignKey
ALTER TABLE "RotationDay" ADD CONSTRAINT "RotationDay_rotationId_fkey" FOREIGN KEY ("rotationId") REFERENCES "WorkoutRotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayExercise" ADD CONSTRAINT "DayExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "RotationDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriorityRules" ADD CONSTRAINT "PriorityRules_rotationId_fkey" FOREIGN KEY ("rotationId") REFERENCES "WorkoutRotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthSettings" ADD CONSTRAINT "GrowthSettings_rotationId_fkey" FOREIGN KEY ("rotationId") REFERENCES "WorkoutRotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

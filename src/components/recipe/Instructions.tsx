'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Instruction } from '@/types/recipe';

interface InstructionsProps {
  instructions: Instruction[];
}

export function Instructions({ instructions }: InstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  if (instructions.length === 0) {
    return (
      <p className="text-neutral-500 italic">No instructions available.</p>
    );
  }

  return (
    <ol className="space-y-6">
      {instructions.map((instruction) => (
        <li
          key={instruction.id}
          className={cn(
            'group flex gap-4 cursor-pointer',
            completedSteps.has(instruction.stepNumber) && 'opacity-60'
          )}
          onClick={() => toggleStep(instruction.stepNumber)}
        >
          {/* Step number */}
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all',
              completedSteps.has(instruction.stepNumber)
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
            )}
          >
            {completedSteps.has(instruction.stepNumber) ? (
              <svg className="w-4 h-4" viewBox="0 0 12 12">
                <path
                  fill="currentColor"
                  d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z"
                />
              </svg>
            ) : (
              instruction.stepNumber
            )}
          </div>

          {/* Step text */}
          <p
            className={cn(
              'text-base leading-relaxed text-neutral-700 pt-1 transition-all',
              completedSteps.has(instruction.stepNumber) && 'line-through text-neutral-400'
            )}
          >
            {instruction.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

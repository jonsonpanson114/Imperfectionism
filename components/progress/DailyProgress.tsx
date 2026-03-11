'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DailyProgress } from '@/lib/storage/types';

const STEPS = [
  { number: 1, label: '気分を選択', description: '今の気分を記録' },
  { number: 2, label: '選択', description: 'やること・やらないこと・受け入れること' },
  { number: 3, label: '達成', description: 'やったことを記録' },
];

interface DailyProgressProps {
  progress: DailyProgress | null;
  currentStep?: 1 | 2 | 3;
}

export function DailyProgress({ progress, currentStep }: DailyProgressProps) {
  const step1Completed = progress?.step1Completed || false;
  const step2Completed = progress?.step2Completed || false;
  const step3Completed = progress?.step3Completed || false;

  const progressPercentage = Math.round(
    ((step1Completed ? 1 : 0) + (step2Completed ? 1 : 0) + (step3Completed ? 1 : 0)) / 3 * 100
  );

  return (
    <Card className="p-6 bg-white border-stone-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-stone-800">今日のフロー</h3>
          <span className="text-sm text-stone-500">{progressPercentage}% 完了</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const isCompleted =
            step.number === 1 ? step1Completed :
            step.number === 2 ? step2Completed :
            step3Completed;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              className={`flex items-start gap-4 ${isCompleted ? 'opacity-50' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : isCurrent ? (
                  <Circle className="w-6 h-6 text-blue-500 fill-blue-100" />
                ) : (
                  <Circle className="w-6 h-6 text-stone-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-stone-800">
                  STEP {step.number}: {step.label}
                </div>
                <div className="text-sm text-stone-500">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

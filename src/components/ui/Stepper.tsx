import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  number: number;
  title: string;
  shortTitle?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  ref?: React.Ref<HTMLDivElement>;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  ref,
  ...props
}: StepperProps) {
  const activeStep = steps.find((s) => s.number === currentStep) || steps[0];
  const progressPercent =
    steps.length > 1
      ? ((Math.max(1, currentStep) - 1) / (steps.length - 1)) * 100
      : 100;

  return (
    <div
      ref={ref}
      aria-label="Progres langkah formulir pendaftaran"
      className={cn("w-full py-2", className)}
      {...props}
    >
      {/* Mobile progress indicator info */}
      <div className="flex items-center justify-between text-xs mb-2.5 sm:hidden text-[#434655] font-medium">
        <span>
          Langkah {currentStep} dari {steps.length}:{" "}
          <strong className="text-[#0F172A] font-bold">{activeStep.shortTitle || activeStep.title}</strong>
        </span>
        <span className="font-extrabold text-[#1D4ED8] bg-[#E2E7FF] px-2 py-0.5 rounded-full text-[11px]">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Bar progres visual garis atas bergaya Playful Stitch */}
      <div className="relative mb-4">
        <div className="h-2 w-full bg-[#E2E7FF] rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#F97316] rounded-full transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Daftar langkah */}
      <ol className="flex items-center justify-between w-full">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = onStepClick && isCompleted;

          return (
            <li
              key={step.number}
              className={cn(
                "flex items-center gap-2 sm:gap-2.5 text-left select-none transition-colors",
                isClickable && "cursor-pointer group hover:opacity-90"
              )}
              onClick={() => isClickable && onStepClick(step.number)}
              title={isClickable ? `Kembali ke Langkah ${step.number}: ${step.title}` : undefined}
            >
              {/* Lingkaran nomor / centang Tactile Chunky */}
              <div
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 min-h-[32px] min-w-[32px] rounded-full flex items-center justify-center text-xs sm:text-sm font-bold tabular-nums transition-all duration-200 shrink-0",
                  isCompleted
                    ? "bg-[#10B981] text-white shadow-[0_3px_0_#047857] group-hover:scale-105"
                    : isCurrent
                    ? "bg-[#1D4ED8] text-white shadow-[0_4px_0_#173fa8] ring-4 ring-[#1D4ED8]/15"
                    : "bg-[#F2F3FF] border-2 border-[#DAE2FD] text-[#434655]"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                ) : (
                  step.number
                )}
              </div>

              {/* Judul langkah */}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider hidden sm:block">
                  Langkah {step.number}
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold transition-colors leading-tight truncate",
                    isCurrent
                      ? "text-[#0F172A] font-extrabold"
                      : isCompleted
                      ? "text-slate-700 font-medium"
                      : "text-[#434655]",
                    !isCurrent && "hidden sm:inline"
                  )}
                >
                  <span className="sm:hidden">{step.shortTitle || step.title}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

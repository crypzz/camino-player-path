import { Brain, Download, Eye, Save, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const steps = [
  { key: 'queued', label: 'Queued for analysis', icon: Clock },
  { key: 'downloading', label: 'Downloading video...', icon: Download },
  { key: 'detecting', label: 'Detecting players with AI...', icon: Eye },
  { key: 'saving', label: 'Saving tracking data...', icon: Save },
  { key: 'done', label: 'Analysis complete', icon: CheckCircle },
];

function stepIndex(status: string) {
  if (status === 'queued') return 0;
  if (status === 'processing') return 2;
  if (status === 'ready') return 4;
  return 1;
}

interface Props {
  status: string;
  trackingCount?: number;
  uniquePlayers?: number;
}

export default function AIProcessingPanel({ status, trackingCount, uniquePlayers }: Props) {
  const isActive = status === 'queued' || status === 'processing';
  const isDone = status === 'ready' && (trackingCount ?? 0) > 0;

  if (!isActive && !isDone) return null;

  const currentStep = stepIndex(status);
  const progress = isDone ? 100 : Math.min(95, ((currentStep + 1) / steps.length) * 100);

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <Brain className="h-3.5 w-3.5 text-primary" />
        {isActive ? 'AI Analysis in Progress' : 'AI Analysis Complete'}
      </div>

      {isActive && (
        <>
          <Progress value={progress} className="h-1.5" />
          <div className="space-y-1">
            {steps.slice(0, currentStep + 1).map((step) => {
              const Icon = step.icon;
              const isCurrent = steps.indexOf(step) === currentStep;
              return (
                <div key={step.key} className={`flex items-center gap-2 text-[11px] ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  <Icon className={`h-3 w-3 ${isCurrent ? 'animate-pulse' : ''}`} />
                  {step.label}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">Usually takes 30–60 seconds for short clips</p>
        </>
      )}

      {isDone && (
        <p className="text-[11px] text-muted-foreground">
          Found <span className="font-semibold text-foreground">{uniquePlayers}</span> players across{' '}
          <span className="font-semibold text-foreground">{trackingCount}</span> tracked positions.
          Go to the <span className="font-medium text-primary">Tracking</span> tab to assign player names.
        </p>
      )}
    </div>
  );
}

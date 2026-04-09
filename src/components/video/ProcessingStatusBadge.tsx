import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  uploading: {
    label: 'Uploading',
    icon: <Upload className="h-3 w-3 animate-pulse" />,
    className: 'bg-info/20 text-info border-info/30',
  },
  processing: {
    label: 'Processing',
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className: 'bg-warning/20 text-warning border-warning/30',
  },
  ready: {
    label: 'Ready',
    icon: <CheckCircle className="h-3 w-3" />,
    className: 'bg-success/20 text-success border-success/30',
  },
  error: {
    label: 'Error',
    icon: <AlertCircle className="h-3 w-3" />,
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

export default function ProcessingStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.ready;
  return (
    <Badge variant="outline" className={`gap-1 text-[10px] ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

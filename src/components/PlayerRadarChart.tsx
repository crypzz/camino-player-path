import { Player } from '@/types/player';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  player: Player;
  category: 'technical' | 'tactical' | 'physical' | 'mental';
}

const categoryColors: Record<string, string> = {
  technical: 'hsl(43, 96%, 56%)',
  tactical: 'hsl(210, 92%, 55%)',
  physical: 'hsl(152, 69%, 45%)',
  mental: 'hsl(280, 70%, 60%)',
};

export function PlayerRadarChart({ player, category }: Props) {
  const metrics = player[category] as Record<string, number>;
  const data = Object.entries(metrics).map(([key, value]) => ({
    metric: key.length > 12 ? key.slice(0, 12) + '…' : key,
    fullMetric: key,
    value,
    fullMark: 10,
  }));

  const color = categoryColors[category];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
        <PolarGrid stroke="hsl(222, 30%, 18%)" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name={category}
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

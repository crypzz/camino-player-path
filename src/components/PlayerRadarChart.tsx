import { Player } from '@/types/player';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  player: Player;
  category: 'technical' | 'tactical' | 'physical' | 'mental';
}

const categoryColors: Record<string, string> = {
  technical: 'hsl(45, 100%, 58%)',
  tactical: 'hsl(215, 95%, 58%)',
  physical: 'hsl(160, 72%, 42%)',
  mental: 'hsl(275, 65%, 55%)',
};

export function PlayerRadarChart({ player, category }: Props) {
  const metrics = player[category] as Record<string, number>;
  const data = Object.entries(metrics).map(([key, value]) => ({
    metric: key.length > 10 ? key.slice(0, 10) + '…' : key,
    fullMetric: key,
    value,
    fullMark: 10,
  }));

  const color = categoryColors[category];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="62%">
        <PolarGrid stroke="hsl(225, 15%, 15%)" strokeWidth={0.5} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'hsl(220, 15%, 45%)', fontSize: 9, fontWeight: 500 }}
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
          fillOpacity={0.15}
          strokeWidth={1.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

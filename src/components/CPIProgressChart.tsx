import { Player } from '@/types/player';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Props {
  player: Player;
}

export function CPIProgressChart({ player }: Props) {
  const data = player.cpiHistory.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(45, 100%, 58%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(45, 100%, 58%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 12%)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'hsl(220, 15%, 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: 'hsl(220, 15%, 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(225, 25%, 8%)',
            border: '1px solid hsl(225, 15%, 15%)',
            borderRadius: '6px',
            fontSize: '11px',
            padding: '6px 10px',
          }}
          labelStyle={{ color: 'hsl(0, 0%, 95%)', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(45, 100%, 58%)"
          fill="url(#cpiGradient)"
          strokeWidth={1.5}
          dot={{ fill: 'hsl(45, 100%, 58%)', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="CPI"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

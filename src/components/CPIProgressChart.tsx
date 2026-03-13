import { Player, CPIEntry } from '@/types/player';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Props {
  player: Player;
}

export function CPIProgressChart({ player }: Props) {
  const data = player.cpiHistory.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 14%)" />
        <XAxis dataKey="date" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 44%, 9%)',
            border: '1px solid hsl(222, 30%, 18%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(43, 96%, 56%)"
          fill="url(#cpiGradient)"
          strokeWidth={2}
          dot={{ fill: 'hsl(43, 96%, 56%)', r: 4 }}
          name="CPI Score"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

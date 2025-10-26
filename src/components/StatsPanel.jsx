import { memo } from 'react';
import { BarChart3, Sparkles, Calendar } from 'lucide-react';

function StatsPanel({ stats }) {
  const { totalHabits, totalCompletions, bestStreak } = stats;

  const cards = [
    {
      title: 'Habits',
      value: totalHabits,
      icon: Sparkles,
      gradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
      ring: 'ring-emerald-500/30',
    },
    {
      title: 'Completions',
      value: totalCompletions,
      icon: BarChart3,
      gradient: 'from-sky-500/20 via-sky-400/10 to-transparent',
      ring: 'ring-sky-500/30',
    },
    {
      title: 'Best Streak',
      value: `${bestStreak}d`,
      icon: Calendar,
      gradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
      ring: 'ring-violet-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur-md`}
        >
          <div className={`pointer-events-none absolute -inset-px bg-gradient-to-b ${c.gradient}`} />
          <div className="relative z-10 flex items-center gap-3">
            <div className={`rounded-xl border border-white/10 bg-neutral-950 p-3 ring-2 ${c.ring}`}>
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400">{c.title}</div>
              <div className="text-2xl font-semibold text-white">{c.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(StatsPanel);

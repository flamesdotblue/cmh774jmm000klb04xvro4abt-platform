import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, CalendarDays } from 'lucide-react';

function dayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
}

export default function HabitList({ habits, weekDates, onToggle, onDelete, calcStreak }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">This Week</h2>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <CalendarDays className="h-4 w-4" />
          <span>
            {weekDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
            {weekDates[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.6fr] items-center bg-neutral-900/60 backdrop-blur">
          <div className="px-4 py-3 text-xs uppercase tracking-wider text-neutral-400">Habit</div>
          {weekDates.map((d) => (
            <div key={d.toISOString()} className="px-2 py-3 text-center text-xs uppercase tracking-wider text-neutral-400">
              {dayLabel(d)}
            </div>
          ))}
          <div className="px-4 py-3 text-right text-xs uppercase tracking-wider text-neutral-400">Streak</div>
        </div>

        <AnimatePresence initial={false}>
          {habits.length === 0 ? (
            <div className="bg-neutral-950/40 p-8 text-center text-neutral-400">No habits yet. Add one above to get started.</div>
          ) : (
            habits.map((habit, idx) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.6fr] items-stretch border-t border-white/10 bg-neutral-950/40 hover:bg-neutral-900/40"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-white">{habit.name}</div>
                    <div className="text-xs text-neutral-400">Created {new Date(habit.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {weekDates.map((d) => {
                  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  const checked = (habit.datesChecked || []).includes(iso);
                  return (
                    <button
                      key={iso}
                      onClick={() => onToggle(habit.id, d)}
                      className={`flex items-center justify-center border-l border-white/5 p-2 transition ${
                        checked ? 'bg-emerald-500/15 hover:bg-emerald-500/25' : 'hover:bg-white/5'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 transition ${checked ? 'text-emerald-400' : 'text-neutral-500'}`}
                        strokeWidth={2.5}
                      />
                    </button>
                  );
                })}

                <div className="flex items-center justify-end gap-3 px-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{calcStreak(habit.datesChecked)}d</div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400">Streak</div>
                  </div>
                  <button
                    onClick={() => onDelete(habit.id)}
                    className="group rounded-lg p-2 text-neutral-400 transition hover:bg-white/5 hover:text-red-400"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

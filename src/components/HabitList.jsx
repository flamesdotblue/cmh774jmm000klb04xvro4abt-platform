import { memo, useMemo } from 'react';
import { Trash2, CheckCircle2, CalendarDays } from 'lucide-react';

function dayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
}

function HabitList({ habits, weekDates, onToggle, onDelete, calcStreak }) {
  const weekRange = useMemo(() => {
    return `${weekDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  }, [weekDates]);

  const weekISO = useMemo(() => {
    return weekDates.map((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, [weekDates]);

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base md:text-lg font-semibold text-white">This Week</h2>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <CalendarDays className="h-4 w-4" />
          <span>{weekRange}</span>
        </div>
      </div>

      {/* Mobile layout: cards with horizontal day scroller */}
      <div className="md:hidden space-y-3">
        {habits.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-neutral-950/50 p-6 text-center text-neutral-400">
            No habits yet. Add one above to get started.
          </div>
        ) : (
          habits.map((habit) => {
            const checkedSet = new Set(habit.datesChecked || []);
            return (
              <div key={habit.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">{habit.name}</div>
                      <div className="text-xs text-neutral-400">Created {new Date(habit.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(habit.id)}
                    className="rounded-lg p-2 text-neutral-400 transition hover:bg-white/5 hover:text-red-400"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                  {weekDates.map((d, idx) => {
                    const iso = weekISO[idx];
                    const checked = checkedSet.has(iso);
                    return (
                      <button
                        key={iso}
                        onClick={() => onToggle(habit.id, d)}
                        className={`flex min-w-[44px] max-w-[56px] flex-col items-center justify-center rounded-xl border border-white/10 p-2 text-xs transition ${
                          checked ? 'bg-emerald-500/15 hover:bg-emerald-500/25' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-wider text-neutral-400">{dayLabel(d)}</div>
                        <CheckCircle2 className={`mt-1 h-5 w-5 ${checked ? 'text-emerald-400' : 'text-neutral-500'}`} strokeWidth={2.5} />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-right text-sm"><span className="font-semibold text-white">{calcStreak(habit.datesChecked)}d</span> <span className="text-neutral-400">streak</span></div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop/tablet layout: table grid */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.6fr] items-center bg-neutral-900/60">
          <div className="px-4 py-3 text-xs uppercase tracking-wider text-neutral-400">Habit</div>
          {weekDates.map((d) => (
            <div key={d.toISOString()} className="px-2 py-3 text-center text-xs uppercase tracking-wider text-neutral-400">
              {dayLabel(d)}
            </div>
          ))}
          <div className="px-4 py-3 text-right text-xs uppercase tracking-wider text-neutral-400">Streak</div>
        </div>

        {habits.length === 0 ? (
          <div className="bg-neutral-950/40 p-8 text-center text-neutral-400">No habits yet. Add one above to get started.</div>
        ) : (
          habits.map((habit) => {
            const checkedSet = new Set(habit.datesChecked || []);
            return (
              <div
                key={habit.id}
                className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.6fr] items-stretch border-t border-white/10 bg-neutral-950/40 hover:bg-neutral-900/40"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-white">{habit.name}</div>
                    <div className="text-xs text-neutral-400">Created {new Date(habit.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {weekDates.map((d, idx) => {
                  const iso = weekISO[idx];
                  const checked = checkedSet.has(iso);
                  return (
                    <button
                      key={iso}
                      onClick={() => onToggle(habit.id, d)}
                      className={`flex items-center justify-center border-l border-white/5 p-2 transition ${
                        checked ? 'bg-emerald-500/15 hover:bg-emerald-500/25' : 'hover:bg-white/5'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 ${checked ? 'text-emerald-400' : 'text-neutral-500'}`}
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
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default memo(HabitList);

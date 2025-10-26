import { memo, useMemo } from 'react';
import { Trash2, CheckCircle2, CalendarDays } from 'lucide-react';

function dayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
}

const DayButton = memo(function DayButton({ checked, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-md border border-white/10 p-2 transition ${checked ? 'bg-emerald-500/15 hover:bg-emerald-500/25' : 'hover:bg-white/5'}`}
      aria-pressed={checked}
      aria-label={`Toggle ${label}`}
    >
      <CheckCircle2 className={`h-5 w-5 transition ${checked ? 'text-emerald-400' : 'text-neutral-500'}`} strokeWidth={2.5} />
    </button>
  );
});

export default function HabitList({ habits, weekDates, onToggle, onDelete, calcStreak }) {
  const rangeLabel = useMemo(() => {
    return `${weekDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  }, [weekDates]);

  // Precompute ISO dates for the week for performance
  const weekISO = useMemo(
    () => weekDates.map((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`),
    [weekDates]
  );

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-white">This Week</h2>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
          <CalendarDays className="h-4 w-4" />
          <span>{rangeLabel}</span>
        </div>
      </div>

      {/* Mobile layout: cards for smooth scrolling and better tap targets */}
      <div className="md:hidden">
        {habits.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-6 text-center text-neutral-400">No habits yet. Add one above to get started.</div>
        ) : (
          <ul className="space-y-3">
            {habits.map((habit) => {
              const set = new Set(habit.datesChecked || []);
              const streak = calcStreak(habit.datesChecked);
              return (
                <li key={habit.id} className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">{habit.name}</div>
                        <div className="text-[11px] text-neutral-400">Created {new Date(habit.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{streak}d</div>
                        <div className="text-[10px] uppercase tracking-wider text-neutral-400">Streak</div>
                      </div>
                      <button
                        onClick={() => onDelete(habit.id)}
                        className="rounded-lg p-2 text-neutral-400 transition hover:bg-white/5 hover:text-red-400"
                        aria-label="Delete habit"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="-mx-1 flex items-stretch gap-2 overflow-x-auto pb-1">
                    {weekDates.map((d, i) => {
                      const iso = weekISO[i];
                      const checked = set.has(iso);
                      return (
                        <div key={iso} className="min-w-[48px] text-center">
                          <div className="mb-1 text-[10px] uppercase tracking-wider text-neutral-400">{dayLabel(d)}</div>
                          <DayButton checked={checked} onClick={() => onToggle(habit.id, d)} label={dayLabel(d)} />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Desktop/tablet layout: performant table without heavy animations */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[1.2fr_repeat(7,1fr)_0.6fr] items-center bg-neutral-900/60 backdrop-blur">
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
            const set = new Set(habit.datesChecked || []);
            const streak = calcStreak(habit.datesChecked);
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

                {weekDates.map((d, i) => {
                  const iso = weekISO[i];
                  const checked = set.has(iso);
                  return (
                    <button
                      key={iso}
                      onClick={() => onToggle(habit.id, d)}
                      className={`flex items-center justify-center border-l border-white/5 p-2 transition ${
                        checked ? 'bg-emerald-500/15 hover:bg-emerald-500/25' : 'hover:bg-white/5'
                      }`}
                      aria-pressed={checked}
                      aria-label={`Toggle ${dayLabel(d)}`}
                    >
                      <CheckCircle2 className={`h-5 w-5 transition ${checked ? 'text-emerald-400' : 'text-neutral-500'}`} strokeWidth={2.5} />
                    </button>
                  );
                })}

                <div className="flex items-center justify-end gap-3 px-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{streak}d</div>
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

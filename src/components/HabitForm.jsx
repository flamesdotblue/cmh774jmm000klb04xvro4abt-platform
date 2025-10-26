import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const presetColors = ['#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#a78bfa', '#f43f5e', '#f59e0b', '#eab308'];

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(presetColors[0]);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Please enter a habit name.');
      return;
    }
    onAdd(trimmed, color);
    setName('');
    toast.success('Habit added');
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs sm:text-sm text-neutral-400">New Habit</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Run, Read 10 pages"
            className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-3 text-white outline-none ring-emerald-500/0 transition focus:ring-2 text-sm sm:text-base"
            aria-label="Habit name"
          />
        </div>
        <div className="md:w-[280px]">
          <label className="mb-2 block text-xs sm:text-sm text-neutral-400">Color</label>
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Pick ${c}`}
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 transition ${color === c ? 'ring-white' : 'ring-white/10 hover:ring-white/30'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 sm:h-10 sm:w-14 cursor-pointer rounded-lg border border-white/10 bg-neutral-950 p-1"
              aria-label="Custom color"
            />
          </div>
        </div>
        <div className="md:w-[180px]">
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99] text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 transition group-hover:rotate-90" />
            Add Habit
          </button>
        </div>
      </div>
    </form>
  );
}

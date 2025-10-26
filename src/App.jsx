import { useEffect, useMemo, useState } from 'react';
import { Toaster } from 'sonner';
import Hero from './components/Hero';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import StatsPanel from './components/StatsPanel';

function getISO(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMonday(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Monday ... 6=Sunday
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getCurrentWeekDates() {
  const start = getMonday(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(start);
    dt.setDate(start.getDate() + i);
    return dt;
  });
}

function calcStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (streak < 3650) {
    const iso = getISO(cursor);
    if (set.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function App() {
  const [habits, setHabits] = useState([]);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('habit-tracker:data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setHabits(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('habit-tracker:data', JSON.stringify(habits));
    } catch {}
  }, [habits]);

  useEffect(() => {
    const id = setInterval(() => setWeekDates(getCurrentWeekDates()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const addHabit = (name, color) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      color,
      datesChecked: [],
      createdAt: Date.now(),
    };
    setHabits((h) => [newHabit, ...h]);
  };

  const deleteHabit = (id) => {
    setHabits((h) => h.filter((x) => x.id !== id));
  };

  const toggleCheck = (id, date) => {
    const iso = getISO(date);
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const set = new Set(h.datesChecked || []);
        if (set.has(iso)) set.delete(iso);
        else set.add(iso);
        return { ...h, datesChecked: Array.from(set) };
      })
    );
  };

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((acc, h) => acc + (h.datesChecked?.length || 0), 0);
    const bestStreak = habits.reduce((acc, h) => Math.max(acc, calcStreak(h.datesChecked)), 0);
    return { totalHabits, totalCompletions, bestStreak };
  }, [habits]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 antialiased">
      <Hero />
      <main className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-24 sm:-mt-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <HabitForm onAdd={addHabit} />
          </div>
          <StatsPanel stats={stats} />
        </div>
        <HabitList
          habits={habits}
          weekDates={weekDates}
          onToggle={toggleCheck}
          onDelete={deleteHabit}
          calcStreak={calcStreak}
        />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

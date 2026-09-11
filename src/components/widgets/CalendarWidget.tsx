import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

const mockEvents: Event[] = [
  { id: '1', title: 'Team Standup', date: 'Today', time: '10:00 AM' },
  { id: '2', title: 'Design Review', date: 'Today', time: '2:00 PM' },
  { id: '3', title: 'Project Planning', date: 'Tomorrow', time: '11:00 AM' },
];

export const CalendarWidget = () => {
  const [events] = useState<Event[]>(mockEvents);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[var(--widget-accent)]" />
          <span className="command-kicker text-[var(--widget-accent)]">UPCOMING EVENTS</span>
        </div>
      </div>
      
      {events.length === 0 ? (
        <p className="text-xs text-[var(--page-muted)]">No upcoming events.</p>
      ) : (
        <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {events.map((event) => (
            <li key={event.id} className="group flex flex-col gap-1 rounded-xl border border-[var(--surface-line)] bg-[var(--surface-strong)]/40 p-2 text-left hover:border-[var(--widget-accent)]/30 hover:bg-[var(--surface-strong)]/60 transition-all">
               <div className="flex justify-between items-center">
                 <span className="text-xs font-medium text-[var(--page-ink)]">{event.title}</span>
                 <ExternalLink className="h-3 w-3 text-[var(--page-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="text-[10px] text-[var(--page-muted)] flex items-center gap-2">
                 <span>{event.date}</span>
                 <span>•</span>
                 <span>{event.time}</span>
               </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTicketMessage } from '../services/ticketSystem';

export default function TicketToast({ tickets, secondsUntilNext, lastTicketsEarned }) {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (lastTicketsEarned > 0) {
      setToastMessage(`🎟️ A new ticket has arrived! (${tickets}/5)`);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastTicketsEarned, tickets]);

  const message = getTicketMessage(tickets, secondsUntilNext);

  return (
    <div className="w-full max-w-md mx-auto px-4 my-2">
      {showToast && (
        <div className="mb-2 p-3 rounded-xl bg-brand-500/20 border border-brand-400/50 text-brand-200 text-xs font-semibold flex items-center gap-2 shadow-glow-emerald animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
          <span>🎟️ A new ticket has arrived! Ready for action.</span>
        </div>
      )}

      {tickets === 0 && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Out of tickets.</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-rose-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{message.split('Next ticket in ')[1] || ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

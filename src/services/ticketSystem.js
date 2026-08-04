/**
 * Ticket & Energy System Service
 * Handles server/client timestamp comparison for ticket regeneration (1 ticket per 15 mins)
 */

export const MAX_TICKETS = 5;
export const REGEN_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes in ms

export function calculateTicketState(lastRegenTimestamp, currentTickets) {
  const now = Date.now();
  const lastTime = lastRegenTimestamp || now;

  if (currentTickets >= MAX_TICKETS) {
    return {
      tickets: MAX_TICKETS,
      nextRegenTime: null,
      secondsUntilNext: 0,
      lastRegenTimestamp: now
    };
  }

  const elapsedMs = now - lastTime;
  const ticketsEarned = Math.floor(elapsedMs / REGEN_INTERVAL_MS);

  const newTickets = Math.min(MAX_TICKETS, currentTickets + ticketsEarned);

  if (newTickets >= MAX_TICKETS) {
    return {
      tickets: MAX_TICKETS,
      nextRegenTime: null,
      secondsUntilNext: 0,
      lastRegenTimestamp: now
    };
  }

  // Calculate remaining ms for next ticket
  const remainderMs = elapsedMs % REGEN_INTERVAL_MS;
  const msUntilNext = REGEN_INTERVAL_MS - remainderMs;
  const secondsUntilNext = Math.ceil(msUntilNext / 1000);
  const updatedLastRegen = lastTime + ticketsEarned * REGEN_INTERVAL_MS;

  return {
    tickets: newTickets,
    nextRegenTime: Date.now() + msUntilNext,
    secondsUntilNext,
    lastRegenTimestamp: updatedLastRegen,
    ticketsEarned
  };
}

/**
 * Formats seconds into MM:SS
 */
export function formatTimeRemaining(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates user-facing ticket notification messages
 */
export function getTicketMessage(tickets, secondsUntilNext) {
  if (tickets >= MAX_TICKETS) {
    return '⚡ Tickets fully charged (5/5)! Ready for infinite math rounds.';
  }
  if (tickets === 0) {
    return `⚠️ You have run out of tickets. Next ticket in ${formatTimeRemaining(secondsUntilNext)}`;
  }
  return `🎟️ ${tickets}/${MAX_TICKETS} Tickets remaining. Next ticket in ${formatTimeRemaining(secondsUntilNext)}`;
}

import type { DateTime } from 'luxon'

export interface BreachEntry {
  // Name of the database/website that was compromised
  name: string

  // The known day the database/website was compromised
  dateBreached: DateTime
}

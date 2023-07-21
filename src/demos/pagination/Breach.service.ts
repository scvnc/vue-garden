import { unref, type MaybeRefOrGetter } from 'vue'
import type { BreachEntry } from './models'
import { getBreaches } from './breach.rpc'

interface GetBreachesOptions {
  pageSize: MaybeRefOrGetter<number>
}

interface GetBreachesResult {
  results: BreachEntry[]
}

export const BreachService = {
  async getBreaches({ pageSize }: GetBreachesOptions): GetBreachesResult {
    const allBreaches = await getBreaches()

    const results = allBreaches.slice(0, 30)

    return { results }
  }
}

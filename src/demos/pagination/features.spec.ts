import { beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { BreachService } from './Breach.service'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'

interface ExampleData {
  name: string
  breachedDate: DateTime
}

const data: ExampleData[] = [...Array(60).keys()].map<ExampleData>((v) => ({
  name: `Entry ${v}`,
  breachedDate: DateTime.fromISO(`${v}-01-01`)
}))

describe('stuff', () => {
  const pageSize = ref(0)
  let results: ExampleData[]
  beforeEach(async () => {
    pageSize.value = faker.number.int({ min: 10, max: 20 })

    const result = await BreachService.getBreaches({ pageSize })
    results = result.results
  })

  it('should open', async () => {
    expect(results).toHaveLength(pageSize.value)
  })

  it('should', () => {
    expect(results[0]).toEqual({ name: 'Entry 1', breachedDate: '1-01-01' })
  })

  it('should have a nextCur', () => {})
})

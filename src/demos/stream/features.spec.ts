import { describe, expect, it, test } from 'vitest'

import { useAsyncIterable } from './features'
import { ref } from 'vue'

const AsyncIterable = {
  from: <T>(k: (T | (() => T))[]) => {
    return {
      async *[Symbol.asyncIterator]() {
        for (const val of k) {
          if (typeof val === 'function') {
            yield val()
          } else {
            yield val
          }

          await new Promise((resolve) => setTimeout(resolve))
        }
      }
    }
  }
}

const nextTick = () => new Promise((resolve) => setTimeout(resolve))

describe('stream stuff', () => {
  describe('async iter', () => {
    test('should do', async () => {
      const itr = AsyncIterable.from([1, 2, 3])

      const { latest, complete } = useAsyncIterable(itr, -1)

      // Starts with -1
      expect(latest.value).toEqual(-1)
      expect(complete.value).toEqual(false)

      await nextTick()

      // Next value is 1
      expect(latest.value).toEqual(1)
      expect(complete.value).toEqual(false)

      await nextTick()

      // Next value is 2
      expect(latest.value).toEqual(2)
      expect(complete.value).toEqual(false)

      await nextTick()

      // Next value is 3
      expect(latest.value).toEqual(3)
      expect(complete.value).toEqual(false)

      await nextTick()

      // Now it should be complete
      expect(complete.value).toEqual(true)
      expect(latest.value).toEqual(3)
    })
  })

  test('errors', async () => {
    const itr = AsyncIterable.from([
      // emit 1
      1,
      // and then the next one throws
      () => {
        throw new Error('Some Error!')
      }
    ])

    const { latest, complete, error } = useAsyncIterable(itr, -1)

    expect(latest.value).toEqual(-1)
    expect(complete.value).toEqual(false)

    await nextTick()

    expect(latest.value).toEqual(1)
    expect(complete.value).toEqual(false)

    await nextTick()

    expect(error.value).toEqual('Some Error!')
    expect(latest.value).toEqual(1)
    expect(complete.value).toEqual(true)
  })

  test('that it works correctly with a ref that switches iterable', async () => {
    const itr = AsyncIterable.from([
      1,
      () => {
        throw new Error('gotcha!, this error should not end up in error!')
      },
      3
    ])

    const itr2 = AsyncIterable.from([4, 5, 6])

    const currentAsyncItr = ref(itr)

    const { latest, complete, error } = useAsyncIterable(currentAsyncItr, -1)

    expect(latest.value).toEqual(-1)
    await nextTick()

    expect(latest.value).toEqual(1)
    expect(complete.value).toEqual(false)
    expect(error.value).toBeUndefined()

    // SWITCH!
    currentAsyncItr.value = itr2

    await nextTick()

    expect(latest.value).toEqual(4)
    expect(complete.value).toEqual(false)
    expect(error.value).toBeUndefined()

    await nextTick()

    expect(latest.value).toEqual(5)
    expect(complete.value).toEqual(false)
    expect(error.value).toBeUndefined()

    await nextTick()

    expect(latest.value).toEqual(6)
    expect(complete.value).toEqual(false)
    expect(error.value).toBeUndefined()

    await nextTick()

    expect(latest.value).toEqual(6)
    expect(complete.value).toEqual(true)
    expect(error.value).toBeUndefined()
  })
})

import { type MaybeRef, ref, unref, type Ref, watchEffect, computed } from 'vue'

export const useAsyncIterable = <T>(asyncItr: MaybeRef<AsyncIterable<T>>, initialValue: T) => {
  const currentValue: Ref<T> = ref(initialValue) as Ref<T>

  const complete = ref(false)
  const error = ref()
  let itrId = 0

  watchEffect(async () => {
    const _asyncItr = unref(asyncItr)

    // Do some tracking of iterators
    itrId = itrId + 1
    const currentItrId = itrId
    const isActiveItr = () => currentItrId === itrId

    try {
      for await (const nextVal of _asyncItr) {
        // Skip if we are no longer subscribed
        if (!isActiveItr()) {
          return
        }

        const _nextVal: T = nextVal
        currentValue.value = _nextVal
      }
    } catch (e) {
      if (!isActiveItr()) {
        return
      }
      error.value = e.message
    }

    // Completion
    complete.value = true
  })

  // ;(async () => {
  //   const _asyncItr = unref(asyncItr)
  //   try {
  //     for await (const nextVal of _asyncItr) {
  //       const _nextVal: T = nextVal
  //       currentValue.value = _nextVal
  //     }
  //   } catch (e) {
  //     error.value = e.message
  //   }

  //   complete.value = true
  // })()

  return { latest: currentValue, complete, error }
}

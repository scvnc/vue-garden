import { useDebounce } from '@vueuse/core'
import type { FormContext } from 'vee-validate'
import { watchEffect } from 'vue'

type GenericObject = Record<string, any>

export const useFormAutoSave = <T extends GenericObject>(
  form: FormContext<T>,
  onSave: (arg: T) => Promise<void>
) => {
  const debounced = useDebounce(form.controlledValues, 1000)

  watchEffect(() => {
    onSave(debounced.value)
  })
}

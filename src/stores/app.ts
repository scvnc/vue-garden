import { ref } from 'vue'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import type { ExampleForm } from '@/types'

export const useAppStore = defineStore('App', () => {
  const savedDateTime = ref<DateTime>()
  const savedForm = ref<ExampleForm>({ firstName: '' })

  async function autosave(form: ExampleForm): Promise<void> {
    savedForm.value = form
    savedDateTime.value = DateTime.now()
  }

  return { autosave, savedDateTime, savedForm }
})

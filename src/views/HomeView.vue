<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { useAppStore } from '@/stores/app'
import { useFormAutoSave } from '@/util'

const form = useForm({ initialValues: { firstName: '' } })

const appStore = useAppStore()

useFormAutoSave(form, (updatedForm) => appStore.autosave(updatedForm))
</script>

<template>
  <main>
    First Name
    <Field name="firstName" />
    {{ appStore.savedDateTime?.toISO() }}
    {{ appStore.savedForm }}
  </main>
</template>

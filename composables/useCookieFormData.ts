import { deleteCookie } from 'h3'

export default function<T extends Record<string, any>>(state: Ref<T>, cookieFields: string[]) {
  if (import.meta.client)
    return

  const formDataCookie = useCookie('formData', {
    default: () => {
      return cookieFields.reduce((acc, key) => {
        acc[key] = ''
        return acc
      }, {} as Record<string, string>)
    },
  })

  const formErrorsCookie = useCookie('formErrors', {
    default: () => {
      return cookieFields.reduce((acc, key) => {
        acc[key] = { _errors: [] }
        return acc
      }, {} as Record<string, { _errors: [] }>)
    },
  })

  cookieFields.forEach((key) => {
    state.value.errors[key] = formErrorsCookie.value[key]?._errors
  })

  const event = useRequestEvent()

  cookieFields.forEach((key) => {
    (state.value as Record<string, string>)[key] = formDataCookie.value[key]
  })

  if (event) {
    deleteCookie(event, 'formData')
    deleteCookie(event, 'formErrors')
  }
}

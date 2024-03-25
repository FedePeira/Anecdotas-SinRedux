import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange, 
    reset
  }
}

export const usePlaceholder = () => {
  const [placeholder, setPlaceholder] = useState('')

  const onChangePlaceholder = (event) => {
    setPlaceholder(event.target.value)
  }

  return {
    placeholder,
    onChangePlaceholder
  }
}
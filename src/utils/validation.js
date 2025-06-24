// src/utils/validations.js

export const requiredField = (val) => !!val || 'This field is required'

export const minLength = (min) => (val) => (val && val.length >= min) || `Minimum length is ${min}`

export const maxLength = (max) => (val) => (val && val.length <= max) || `Maximum length is ${max}`

export const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format'

export const isNumber = (val) => (!isNaN(parseFloat(val)) && isFinite(val)) || 'Must be a number'

export const isFileValid = (val) => {
  if (val === null) {
    return 'Please select a file!'
  }
  return true
}

export const isMultiSelected = (val) =>
  (Array.isArray(val) && val.length > 0) || 'Please input at least one entry'

export const passwordStrength = (val) =>
  (val && val.length >= 8) || 'Password must be at least 8 characters long'

export const confirmPasswordMatch = (password) => (val) =>
  val === password || 'Passwords do not match'

export const isSelected = (val) =>
  (val !== null && val !== '' && val !== undefined) || 'Please select an option'

// Optional: grouped rules
export const emailRules = [requiredField, isEmail]
export const nameRules = [requiredField, minLength(2), maxLength(30)]

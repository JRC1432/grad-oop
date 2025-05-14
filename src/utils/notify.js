// src/utils/notify.js
import { Notify } from 'quasar'

export function notifySuccess(message, opts = {}) {
  Notify.create({
    type: 'positive',
    message,
    position: 'top-right',
    timeout: 3000,
    ...opts,
  })
}

export function notifyError(message, opts = {}) {
  Notify.create({
    classes: 'custom-notify',
    type: 'negative',
    message,
    position: 'top-right',
    timeout: 3000,
    ...opts,
  })
}

export function notifyInfo(message, opts = {}) {
  Notify.create({
    type: 'info',
    message,
    position: 'top-right',
    timeout: 3000,
    ...opts,
  })
}

export function notifyWarning(message, opts = {}) {
  Notify.create({
    type: 'warning',
    message,
    position: 'top-right',
    timeout: 3000,
    ...opts,
  })
}

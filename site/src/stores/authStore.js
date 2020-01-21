import {writable} from 'svelte/store'

export const authStore = writable({
  idToken: localStorage.getItem('idToken'),
  expirationTime: localStorage.getItem('expirationTime'),
})

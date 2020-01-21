import {get} from 'svelte/store'
import {authStore} from '../stores/authStore'

const API_URL = process.env.API_URL
const AUTH_URL = process.env.AUTH_URL

const headers = {
  'Authorization': '',
  'Content-Type': 'application/json',
}

const clearSession = () => ['idToken', 'expirationTime'].forEach(localStorage.removeItem.bind(localStorage))
const checkAuth = (cb) => (...args) => {
  const {idToken, expirationTime} = get(authStore)
  if (expirationTime < Date.now()) logout()

  return cb(...args, {...headers, Authorization: idToken})
}
export const login = () => window.location = AUTH_URL
export const logout = () => {
  clearSession()
  login()
}
export const getFile = checkAuth((fileId, headers) => fetch(`${API_URL}/files/${fileId}`, {headers}))
export const getFiles = checkAuth((headers) => fetch(`${API_URL}/files`, {headers}))
export const addFile = checkAuth((data, headers) => fetch(`${API_URL}/files`, {
  method: 'POST',
  body: JSON.stringify(data),
  headers,
}))
export const deleteFile = checkAuth((fileId, headers) => fetch(`${API_URL}/files/${fileId}`, {
  method: 'DELETE',
  headers,
}))

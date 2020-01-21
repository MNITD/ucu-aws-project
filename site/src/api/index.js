import {get} from 'svelte/store'
import {authStore} from '../stores/authStore'

const API_URL = process.env.API_URL  || 'https://id7095ia4i.execute-api.us-east-2.amazonaws.com/api'
const AUTH_URL = process.env.AUTH_URL || 'https://ucu-project.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=4uunfj0elum9ktoomq8f7q0k1n&redirect_uri=http%3A%2F%2Flocalhost%3A3001'

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

// ====== Cookie helpers (hand-rolled, no library) ======
// Backend sets X_AS-TOKEN (access) + R_FS-TOKEN (refresh) on signin.

export const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

export const setCookie = (name, value, days = 15) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value || ''}; expires=${date.toUTCString()}; path=/; SameSite=Lax`
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

// ====== Access token (localStorage) — primary auth for a separate-host API ======
// Cross-site cookies can be blocked by the browser, so we also keep the token
// here and send it via the Authorization header.
const TOKEN_KEY = 'kn_token'
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (token) => {
  try { if (token) localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
}
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

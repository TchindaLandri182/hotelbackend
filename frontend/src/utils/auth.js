// Cookie utilities
export const setCookie = (name, value, days = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export const getCookie = (name) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Auth utilities
export const getAuthToken = () => getCookie('token')

export const getAuthUser = () => {
  const userCookie = getCookie('user')
  return userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null
}

export const setAuthData = (token, user) => {
  setCookie('token', token, 15) // 15 days
  setCookie('user', encodeURIComponent(JSON.stringify(user)), 15)
}

export const clearAuthData = () => {
  deleteCookie('token')
  deleteCookie('user')
}

export const isAuthenticated = () => {
  const token = getAuthToken()
  const user = getAuthUser()
  return !!(token && user)
}

export const hasPermission = (user, permission) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.permissions && user.permissions.includes(permission)
}
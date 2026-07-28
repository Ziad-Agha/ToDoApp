const BASE_URL = "http://localhost:3001/api"

export function apiFetch(path: string, options: RequestInit = {}) {
    return fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            ...options.headers
        }
    })
}

export function toUTCDate(date: Date): Date {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0, 0
  ))
}
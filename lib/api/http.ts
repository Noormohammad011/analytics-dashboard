const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export const apiUrl = (path: string) => {
  const base = getBaseUrl()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const fetchJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(apiUrl(path), { cache: "no-store" })
  if (!res.ok) {
    throw new ApiError(res.statusText || "Request failed", res.status)
  }
  return res.json() as Promise<T>
}

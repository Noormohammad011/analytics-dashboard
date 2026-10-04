import { getSeedData } from "@/lib/server/data"

export const getRecentActivities = async (limit: number) => {
  const { activities } = await getSeedData()
  return [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

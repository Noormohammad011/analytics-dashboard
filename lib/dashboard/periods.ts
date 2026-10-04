const MS_DAY = 24 * 60 * 60 * 1000

export const getDashboardRanges = () => {
  const currentTo = new Date()
  currentTo.setUTCHours(23, 59, 59, 999)
  const currentFrom = new Date(currentTo.getTime() - 29 * MS_DAY)
  currentFrom.setUTCHours(0, 0, 0, 0)

  const previousTo = new Date(currentFrom.getTime() - 1)
  previousTo.setUTCHours(23, 59, 59, 999)
  const previousFrom = new Date(previousTo.getTime() - 29 * MS_DAY)
  previousFrom.setUTCHours(0, 0, 0, 0)

  return {
    current: { from: currentFrom.toISOString(), to: currentTo.toISOString() },
    previous: { from: previousFrom.toISOString(), to: previousTo.toISOString() },
  }
}

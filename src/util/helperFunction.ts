function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatBranchMessage(
  branch: any,
  userLat?: number,
  userLng?: number
): string {
  let text = `*${branch.name}*\n📍 ${branch.address}`

  if (userLat !== undefined && userLng !== undefined) {
    const dist = calculateDistance(
      userLat,
      userLng,
      branch.latitude,
      branch.longitude
    )
    text += `\n📏 ${dist.toFixed(4)} KM` // 4 decimal points
  }

  return text
}

export default {
  calculateDistance,
  formatBranchMessage,
}

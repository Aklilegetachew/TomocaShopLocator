import { AppDataSource } from "../data-source"
import { Branch } from "../entities/Branch"
import utils from "../util/helperFunction"
const branchRepository = AppDataSource.getRepository(Branch)

export const createBranch = async (
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  photo?: string
): Promise<{ success: boolean; data?: Branch; error?: string }> => {
  try {
    if (!name || !address || latitude == null || longitude == null) {
      throw new Error("Name, latitude, and longitude are required")
    }

    const branch = branchRepository.create({
      name,
      address,
      latitude,
      longitude,
      photo,
    })
    const saved = await branchRepository.save(branch)
    return { success: true, data: saved }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const deleteBranch = async (
  id: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const branch = await branchRepository.findOneBy({ id })
    if (!branch) throw new Error("Branch not found")

    await branchRepository.remove(branch)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const listBranches = async (): Promise<{
  success: boolean
  data?: Branch[]
  error?: string
}> => {
  try {
    const branches = await branchRepository.find()
    return { success: true, data: branches }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const getBranchMapLink = async (
  id: number
): Promise<{ success: boolean; data?: string; error?: string }> => {
  try {
    const branch = await branchRepository.findOneBy({ id })
    if (!branch) throw new Error("Branch not found")

    // Use requested format: Current Location to branch
    const mapsLink = `https://www.google.com/maps/dir/Current+Location/${branch.latitude},${branch.longitude}`
    return { success: true, data: mapsLink }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const getNearestBranch = async (
  userLat: number,
  userLng: number
): Promise<{ success: boolean; data?: Branch; error?: string }> => {
  try {
    const branches = await branchRepository.find()
    if (!branches || branches.length === 0) {
      throw new Error("No branches available")
    }

    let nearest = branches[0]
    let minDist = utils.calculateDistance(
      userLat,
      userLng,
      nearest.latitude,
      nearest.longitude
    )

    for (const b of branches) {
      const d = utils.calculateDistance(
        userLat,
        userLng,
        b.latitude,
        b.longitude
      )
      if (d < minDist) {
        nearest = b
        minDist = d
      }
    }

    return { success: true, data: nearest }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const updateBranch = async (
  id: number,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  photo?: string
): Promise<{ success: boolean; data?: Branch; error?: string }> => {
  try {
    const branch = await branchRepository.findOneBy({ id })
    if (!branch) throw new Error("Branch not found")

    branch.name = name
    branch.address = address
    branch.latitude = latitude
    branch.longitude = longitude
    if (photo) branch.photo = photo

    const updated = await branchRepository.save(branch)
    return { success: true, data: updated }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export const getBranchById = async (
  id: number
): Promise<{ success: boolean; data?: Branch; error?: string }> => {
  try {
    const branch = await branchRepository.findOneBy({ id })
    if (!branch) throw new Error("Branch not found")
    return { success: true, data: branch }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

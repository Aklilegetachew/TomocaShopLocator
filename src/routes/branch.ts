import { Router, Request, Response } from "express"
import multer from "multer"
import path from "path"
import * as branchService from "../services/branchService"

const router = Router()

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
})
const upload = multer({ storage })

// ===== Add new branch =====
router.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    const { name, latitude, longitude, address } = req.body
    const photo = req.file ? req.file.filename : undefined

    const result = await branchService.createBranch(
      name,
      address,
      parseFloat(latitude),
      parseFloat(longitude),
      photo
    )

    if (!result.success) return res.status(400).json(result)
    // res.json(result)
    res.redirect("/admin/branches")
  }
)

// ===== Delete a branch =====
router.post("/:id/delete", async (req: Request, res: Response) => {
  const result = await branchService.deleteBranch(parseInt(req.params.id))
  if (!result.success) return res.status(404).json(result)
  res.redirect("/admin/branches")
})

// ===== List all branches =====
router.get("/", async (_req: Request, res: Response) => {
  const result = await branchService.listBranches()
  if (!result.success) return res.status(500).json(result)
  res.json(result)
})

// ===== Get Google Maps link =====
router.get("/:id/map", async (req: Request, res: Response) => {
  const result = await branchService.getBranchMapLink(parseInt(req.params.id))
  if (!result.success) return res.status(404).json(result)
  res.json(result)
})

router.post(
  "/:id/update",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    const { name, latitude, longitude, address } = req.body
    const photo = req.file ? req.file.filename : undefined

    const result = await branchService.updateBranch(
      parseInt(req.params.id),
      name,
      address,
      parseFloat(latitude),
      parseFloat(longitude),
      photo
    )

    if (!result.success) return res.status(400).json(result)
    res.redirect("/admin/branches")
  }
)


export default router

import { Router } from "express"
import {
  listBranches,
  createBranch,
  getBranchById,
} from "../services/branchService"

const router = Router()

router.get("/branches", async (req, res) => {
  const result = await listBranches()
  res.render("admin/branches", {
    title: "Branches",
    branches: result.data || [],
  })
})

router.get("/branches/create", (req, res) => {
  res.render("admin/create", { title: "Add Branch" })
})

router.post("/branches/create", async (req, res) => {
  const { name, address, latitude, longitude, photo } = req.body
  await createBranch(
    name,
    address,
    parseFloat(latitude),
    parseFloat(longitude),
    photo
  )
  res.redirect("/admin/branches")
})

//      EDIT PAGE
// ----------------------
router.get("/branches/edit/:id", async (req, res) => {
  const id = Number(req.params.id)

  const result = await getBranchById(id)

  if (!result || !result.data) {
    return res.status(404).send("Branch not found")
  }

  res.render("admin/edit", {
    title: "Edit Branch",
    branch: result.data,
  })
})

export default router

import { Router } from "express"
import { listBranches } from "../services/branchService"

const router = Router()

router.get("/branches", async (req, res) => {
  const result = await listBranches()
  res.render("users", { title: "Branches", branches: result.data })
})

export default router

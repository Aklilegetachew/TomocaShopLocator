import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import branchRoutes from "./routes/branch"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

app.use("/api/branches", branchRoutes)

// Initialize DB
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✔️")
  })
  .catch((err) => {
    console.error("Database connection error:", err)
  })

// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TypeORM backend initialized 🚀" })
})

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)

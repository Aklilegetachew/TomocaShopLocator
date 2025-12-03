import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import expressLayouts from "express-ejs-layouts"

import { AppDataSource } from "./data-source"
import branchRoutes from "./routes/branch"
import adminRoutes from "./routes/admin"
import usersRoutes from "./routes/usersRoutes"

dotenv.config()

const app = express()

// -------------------- Middleware -------------------- //
// Enable CORS
app.use(cors())

// Parse JSON request bodies
app.use(express.json())

// EJS Layouts
app.use(expressLayouts)
app.set("layout", "layout")

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
app.use("/public", express.static(path.join(__dirname, "public")))

// -------------------- Views Setup -------------------- //
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// -------------------- Routes -------------------- //
app.use("/api/branches", branchRoutes)
app.use("/admin", adminRoutes)
app.use("/users", usersRoutes)

// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "TypeORM backend initialized 🚀" })
})

// -------------------- Database Initialization -------------------- //
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✔️")
  })
  .catch((err) => {
    console.error("Database connection error:", err)
  })

// -------------------- Start Server -------------------- //
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

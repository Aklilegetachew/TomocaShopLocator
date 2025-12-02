import { Telegraf, Markup } from "telegraf"
import axios from "axios"
import dotenv from "dotenv"
import utils from "./util/helperFunction"
dotenv.config()
import * as branchService from "./services/branchService"
import { AppDataSource } from "./data-source"

AppDataSource.initialize()
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

console.log("TomocaNearbyBot (Telegraf) is starting...")

// ===== Show main menu keyboard =====
function showMainMenu(ctx: any) {
  ctx.reply(
    "☕ *Tomoca Nearby Bot*\n\nPlease select an option below:\nእባክዎን ከዚህ በታች አማራጭ ይምረጡ።",
    Markup.keyboard([
      ["📋 List All Branches", "📍 Find Nearby Branch"],
      ["🏠 Home"],
    ])
      .oneTime()
      .resize()
  )
}

// ===== Start =====
bot.start((ctx) => {
  showMainMenu(ctx)
})

// ===== Home button =====
bot.hears("🏠 Home", (ctx) => {
  showMainMenu(ctx)
})

// ===== List All Branches =====
bot.hears("📋 List All Branches", async (ctx) => {
  try {
    const res = await branchService.listBranches()
    console.log(res)
    if (res.success && res.data && res.data.length > 0) {
      for (const b of res.data) {
        const buttons = Markup.inlineKeyboard([
          Markup.button.url(
            "🗺 View on Map",
            `https://www.google.com/maps/dir/Current+Location/${b.latitude},${b.longitude}`
          ),
        ])

        const caption: string = utils.formatBranchMessage(b)

        if (b.photo) {
          await ctx.replyWithPhoto(
            { source: `uploads/${b.photo}` },
            { caption, parse_mode: "Markdown", ...buttons }
          )
        } else {
          await ctx.reply(caption, buttons)
        }
      }
    } else {
      ctx.reply("No Tomoca branches found.\nምንም የTomoca ቅጥ አልተገኘም።")
    }
  } catch (err: any) {
    ctx.reply("Error fetching branches: " + err.message)
  }
})

// ===== Find Nearby Branch =====
bot.hears("📍 Find Nearby Branch", (ctx) => {
  ctx.reply(
    "Please share your location to find the nearest branch:\nእባክዎን የእርስዎን ቦታ ያጋሩ እና ቅጥ ቅርብ አገኘው።",
    Markup.keyboard([
      [Markup.button.locationRequest("📍 Send My Location")],
      ["🏠 Home"],
    ])
      .oneTime()
      .resize()
  )
})

// ===== Handle user location =====
bot.on("location", async (ctx) => {
  const userLocation = ctx.message.location
  const userLat = userLocation.latitude
  const userLng = userLocation.longitude

  try {
    const res = await branchService.getNearestBranch(userLat, userLng)
    if (res.success && res.data) {
      const nearest = res.data

      const buttons = Markup.inlineKeyboard([
        Markup.button.url(
          "🗺 View on Map",
          `https://www.google.com/maps/dir/Current+Location/${nearest.latitude},${nearest.longitude}`
        ),
      ])

      const caption = utils.formatBranchMessage(nearest, userLat, userLng)

      if (nearest.photo) {
        await ctx.replyWithPhoto(
          { source: `uploads/${nearest.photo}` },
          { caption, parse_mode: "Markdown", ...buttons }
        )
      } else {
        await ctx.reply(caption, buttons)
      }
    } else {
      ctx.reply("No branches available.\nምንም ቅጥ አልተገኘም።")
    }
  } catch (err: any) {
    ctx.reply("Error fetching nearest branch: " + err.message)
  }
})

// ===== Launch bot =====
bot.launch()
console.log("TomocaNearbyBot (Telegraf) is running...")

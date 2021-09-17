const express = require("express");
const { google } = require("googleapis");
const { Telegraf } = require("telegraf");
require("dotenv").config();

const spreadsheetID = "1ttD1tC1MO1Ab_mRl6roKoG5zx9-9VW4URZbQfMV7etw";
const app = express();

// const bot = new Telegraf(process.env.TOKEN);
// bot.on("text", (ctx) => {
//   console.log(ctx.message.text);
//   console.log(getRow[`/help`]);
//   ctx.reply("Welcome");
// });
// bot.launch();

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    includeGridData: true,
    spreadsheetId: spreadsheetID,
  });

  var getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetID,
    range: "Sheet1!A3:Z1004",
  });

  getRows = Object.assign(
    ...getRows.data.values.map(([key, val]) => ({ [key]: val }))
  );

  const bot = new Telegraf(process.env.TOKEN);
  bot.on("text", (ctx) => {
    ctx.reply(getRows[ctx.message.text]);
  });
  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main();

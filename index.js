const express = require("express");
const { google } = require("googleapis");

const spreadsheetID = "1ttD1tC1MO1Ab_mRl6roKoG5zx9-9VW4URZbQfMV7etw";

const app = express();

function name(params) {}

app.get("/", async (req, res) => {
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

  const getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetID,
    range: "Sheet1!A3:Z1004",
  });

  const getRow = Object.assign(
    ...getRows.data.values.map(([key, val]) => ({ [key]: val }))
  );

  res.send(getRow);
  console.log(getRow[`/help`]);

  getResponse = () => {};
});

app.listen(1337, (req, res) => console.log("Running on 1337"));

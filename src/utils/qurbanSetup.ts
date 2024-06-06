import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
    keyFile: './qurbanservice.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const authDrive = new GoogleAuth({
    keyFile: './qurbanservice.json',
    scopes: 'https://www.googleapis.com/auth/drive',
});
export const sheetsService = google.sheets({version: 'v4', auth});

export const driveServices = google.drive({version: 'v3', auth:authDrive});
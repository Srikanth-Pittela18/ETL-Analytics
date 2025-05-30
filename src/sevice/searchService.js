import { google } from 'googleapis';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(__dirname, '../../tokens.json');
const sitePath = path.resolve(__dirname, '../../selected-site.json');
 
export async function fetchSearchAnalytics() {
  const tokens = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
  const { site } = JSON.parse(await fs.readFile(sitePath, 'utf8'));
 
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials(tokens);
 
  const searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
 
  const endDate = dayjs().format('YYYY-MM-DD');
  const startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD');
 
  const res = await searchConsole.searchanalytics.query({
    siteUrl: site,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date', 'page'],
      rowLimit: 25000,
    },
  });
 
  if (!res.data.rows) return [];
 
  return res.data.rows.map(row => ({
    date: row.keys[0],
    page: row.keys[1],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}
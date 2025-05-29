import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(__dirname, '../../tokens.json');
const selectedSitePath = path.resolve(__dirname, '../../selected-site.json');
 
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
 
export const googleAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  res.redirect(url);
};
 
export const googleCallback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
  res.redirect('/auth/sites');
};
 
export const listSites = async (req, res) => {
  const tokens = JSON.parse(await fs.readFile(tokenPath));
  oauth2Client.setCredentials(tokens);
  const searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
 
  const siteList = await searchConsole.sites.list();
  const sites = siteList.data.siteEntry.map(s => s.siteUrl);
  res.render('sites', { sites });
};
 
export const selectSite = async (req, res) => {
  const selected = req.body.site;
  await fs.writeFile(selectedSitePath, JSON.stringify({ site: selected }, null, 2));
  res.send(`Site selected: ${selected}`);
};
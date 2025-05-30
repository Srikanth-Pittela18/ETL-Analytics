import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import { oauth2Client } from '../config/googleClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(__dirname, '../../tokens.json');
const selectedSitePath = path.resolve(__dirname, '../../selected-site.json');

export const googleAuth = (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/webmasters.readonly', 'openid', 'email', 'profile'],
    });

    console.log(`Generated Google OAuth URL: ${url}`);
    res.redirect(url);
  } catch (e) {
    console.error('Error generating Google OAuth URL:', e);
    res.status(500).send('Failed to initiate Google OAuth');
  }
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
  res.redirect('/auth/sites');
};

export const listSites = async (req, res) => {
  try {
    console.log(`list sites`)
    const tokens = JSON.parse(await fs.readFile(tokenPath));
    oauth2Client.setCredentials(tokens);
    const searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    const siteList = await searchConsole.sites.list();
    const entries = siteList.data.siteEntry || [];
    console.log(`entries: ${JSON.stringify(entries)}`)
    
    const sites = entries.map((s) => ({ siteUrl: s.siteUrl }));
    console.log(`sites: ${JSON.stringify(sites)}`)
    res.render('select-site', { sites });
  }
  catch (e) {
    console.log(e)
    res.status(500).send('something went wrong');
  }
};

export const selectSite = async (req, res) => {
  const selected = req.body.site;
  await fs.writeFile(selectedSitePath, JSON.stringify({ site: selected }, null, 2));
  res.send(`Site selected: ${selected}`);
};

export async function showSites(req, res) {
  const sites = await getSearchConsoleSites(); // however you fetch them
  res.render('select-site', { sites });
}
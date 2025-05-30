import express from 'express';
import {
  googleAuth,
  googleCallback,
  listSites,
  selectSite,
} from '../controllers/authController.js';

const router = express.Router();
try {
  router.get('/google', googleAuth);
  router.get('/google/callback', googleCallback);
  router.get('/sites', listSites);
  router.post('/sites', selectSite);
}
catch (error) {
  console.log(error)
  res.status(500).send('something went wrong');
}
export default router;
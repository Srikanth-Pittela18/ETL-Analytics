import express from 'express';
import {
  googleAuth,
  googleCallback,
  listSites,
  selectSite,
} from '../controllers/authController.js';
 
const router = express.Router();
 
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/sites', listSites);
router.post('/sites', selectSite);
 
export default router;
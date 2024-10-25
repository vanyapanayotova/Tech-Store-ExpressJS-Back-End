import { Router } from 'express';
import itemService from "../services/itemService.js";


const router = Router();

router.get('/', async (req, res) => {
    const devices = await itemService.getAll(3).sort({ _id: -1 }).lean();
    res.render('home', { devices: devices, title: "Home page" });
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/profile', async (req, res) => {
    const createdDevices = await itemService.getUserDevices(req.user._id).lean();
    const preferredDevices = await itemService.getUserPreferredDevices(req.user._id).lean();
    res.render('auth/profile', { createdDevices, preferredDevices, title: 'Profile' });
});

export default router;

import { query, Router } from "express";
import itemService from "../services/itemService.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import Device from "../models/Device.js";

const router = Router();

router.get('/', async (req, res) => {
    const devices = await itemService.getAll().lean();
    res.render('devices/catalog', { devices: devices, title: 'Catalog Page' });
});

// router.get('/search', async (req, res) => {
//     const query = req.query;
//     const devices = await itemService.getAll(query).lean();
//     res.render('devices/search', { devices, title: 'Search Page', query });
// });

router.get('/create', isAuth, (req, res) => {
    res.render('devices/create', { title: 'Create Page' });
});

router.post('/create', isAuth, async (req, res) => {
    const itemData = req.body;
    const ownerId = req.user?._id;

    try {
        await itemService.create(itemData, ownerId);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('devices/create', {
            error: errorMessage,
            device: itemData,
            title: 'Create Page'
        });
    }

    res.redirect('/devices');
});

// router.get('/search', async (req, res) => {
//     const filter = req.query;
//     const movies = await itemService.getAll(filter).lean();

//     res.render('home', { isSearch: true, movies, filter });
// });

router.get('/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId;
    const device = await itemService.getOne(deviceId).lean();
    const isOwner = device.owner && device.owner.toString() === req.user?._id;
    const isAuth = !!req.user;
    const hasPreferred = device.preferredList.some(userID => userID == req.user?._id);

    res.render('devices/details', { device: device, hasPreferred, isOwner, isAuth, title: 'Details Page' });
});


// router.get('/:deviceId/prefer', async (req, res) => {
//     const deviceId = req.params.deviceId;
//     const device = await itemService.getOne(deviceId).lean();
//     res.render('devicees/details', { device: device, isOwner, title:'Details Page'});
// });

// router.get('/:movieId/attach', isAuth, async (req, res) => {
//     const device = await itemService.getOne(req.params.deviceeId).lean();
//     const casts = await castService.getAllWithout(device.casts).lean();

//     res.render('movies/attach', { device: device, casts });
// });

// router.post('/:movieId/attach', isAuth, async (req, res) => {
//     const deviceeId = req.params.deviceeId;
//     const castId = req.body.cast;
//     const character = req.body.character;

//     await itemService.attach(deviceeId, castId, character);

//     res.redirect(`/movies/${deviceeId}/details`);
// });

router.get('/:deviceId/delete', isAuth, isOwner, async (req, res) => {
    const deviceId = req.params.deviceId;

    // // Check if owner
    // const device = await itemService.getOne(deviceId).lean();
    // if (device.owner?.toString() !== req.user._id) {
    //     // return res.render('movies/details', { movie, isOwner: false, error: 'You cannot delete this movie!' });
    //     res.setError('You cannot delete this device!');
    //     return res.redirect('/404');
    // }

    await itemService.remove(deviceId);

    res.redirect('/devices');
});

router.get('/:deviceId/edit', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;
    const device = await itemService.getOne(deviceId).lean();

    if (device.owner?.toString() !== req.user._id) {
        // return res.render('movies/details', { movie, isOwner: false, error: 'You cannot delete this movie!' });
        res.setError('You cannot edit this device!');
        return res.redirect('/404');
    }

    res.render('devices/edit', {
        device: device,
        // deviceTypes: getdeviceTypeViewData(device.deviceType),
        title: 'Edit Page'
    });
});

router.post('/:deviceId/edit', isAuth, async (req, res) => {
    const itemData = req.body;
    const deviceId = req.params.deviceId;
    const deviceType = itemData.deviceType;

    try {
        await itemService.edit(deviceId, itemData);
    } catch (err) {
        const errorMessage = getErrorMessage(err);
        return res.render('devices/edit', {
            error: errorMessage,
            device: itemData,
            // deviceTypes: getdeviceTypeViewData(deviceType),
            title: 'Edit Page'
        });
    }

    res.redirect(`/devices/${deviceId}`);
});


router.get('/:deviceId/prefer', isAuth, async (req, res) => {
    const deviceId = req.params.deviceId;
    const device = await itemService.getOne(deviceId).lean();
    const hasPreferred = device.preferredList.some(userID => userID == req.user?._id);

    if (device.owner?.toString() === req.user._id || hasPreferred) {
        res.setError('You cannot prefer this device!');
        return res.redirect(`/devices/${deviceId}`);
    }

    const userID = req.user._id;
    await itemService.prefer(deviceId, userID);
    res.redirect(`/devices/${deviceId}`);
});




// function getTypeViewData(typedevice = null) {
//     let deviceTypes = [
//         'Superdevicees',
//         'Submarine',
//         'Subglacial',
//         'Mud',
//         'Stratodevicees',
//         'Shield'
//     ];

//     const viewData = deviceTypes.map(type => ({
//         value: type,
//         label: type,
//         selected: typedevice === type ? 'selected' : ''
//     }));

//     return viewData;
// }

export default router;

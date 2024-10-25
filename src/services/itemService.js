import Item from '../models/Device.js';

// TODO: Filter in db not in memory
const getAll = (count = null) => {
    let itemsQuery = Item.find().limit(count);

    // if (filter.name) {
    //     itemsQuery.find({ name: { $regex: filter.name, $options: 'i' } });
    //     // moviesQuery.regex('title', new RegExp(filter.search, 'i'))
    // }

    // if (filter.volcanoType) {
    //     itemsQuery.find({ volcanoType: filter.volcanoType });
    //     // moviesQuery.where('genre').equals(filter.genre.toLowerCase())
    // }

    // if (filter.year) {
    //     itemsQuery.find({ year: filter.year });
    //     // moviesQuery.where('year').equals(filter.year);
    // }

    return itemsQuery;
};


const getUserDevices = (userId) => {
    return Item.find({ owner: userId });
};

const getUserPreferredDevices = (userId) => {
    return Item.find().where('preferredList').in([userId]);
};

const create = (item, ownerId) => Item.create({ ...item, owner: ownerId })

const getOne = (itemId) => Item.findById(itemId);

const remove = (itemId) => Item.findByIdAndDelete(itemId);

const edit = (itemId, data) => Item.findByIdAndUpdate(itemId, data, { runValidators: true });

const prefer = (itemId, ownerId) => Item.findByIdAndUpdate(itemId, { $push: { preferredList: ownerId } });

export default {
    getAll,
    create,
    getOne,
    remove,
    edit,
    prefer,
    getUserDevices,
    getUserPreferredDevices
}

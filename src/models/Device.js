import { Schema, model, Types } from 'mongoose';

const deviceSchema = new Schema({
    brand: {
        type: String,
        required: [true, 'Brand is required!'],
        minLength: 2,
        // validate: [/^[A-Za-z0-9 ]+$/, 'Title can contain only alpha numeric characters!'],
    },
    model: {
        type: String,
        required: true,
        minLength: 5,
        // validate: [/^[A-Za-z0-9 ]+$/, 'Genre can contain only alpha numeric characters!'],
    },
    hardDisk: {
        type: String,
        required: true,
        minLength: 5,
        // validate: [/^[A-Za-z0-9 ]+$/, 'Director can contain only alpha numeric characters!'],
    },
    screenSize: {
        type: String,
        required: true,
        minLength: 1
        // min: [0, 'The Year should be between 0 and 2024!'],
        // max: [2024, 'The Year should be between 0 and 2024!'],
    },
    ram: {
        type: String,
        required: true,
        minLength: 2
    },
    operatingSystem: {
        type: String,
        required: true,
        minLength: [5, 'The Operating System should be between 5 and 20 characters long.'],
        maxLength: [29, 'The Operating System should be between 5 and 20 characters long.']
    },
    cpu: {
        type: String,
        required: true,
        minLength: [10, 'The CPU should be between 10 and 50 characters long.'],
        maxLength: [50, 'The CPU should be between 10 and 50 characters long.']
    },
    gpu: {
        type: String,
        required: true,
        minLength: [10, 'The GPU should be between 10 and 50 characters long.'],
        maxLength: [50, 'The GPU should be between 10 and 50 characters long.']
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'The price should be positive number!']
    },
    color: {
        type: String,
        required: true,
        minLength: [2, 'The color should be between 2 and 10 characters long.'],
        maxLength: [10, 'The color should be between 2 and 10 characters long.']
    },
    weight: {
        type: String,
        required: true,
        minLength: [1, 'The weight should be at least 1 characters long.']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'Invalid image url!'],
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    },
    preferredList: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
});

const Device = model('Device', deviceSchema);

export default Device;

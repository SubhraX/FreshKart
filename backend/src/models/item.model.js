import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true,
    },
    productName:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true, 
    },
    discountedPrice:{
        type: Number,
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    absoluteUrl:{
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);
import { Item } from "../models/item.model.js";

export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
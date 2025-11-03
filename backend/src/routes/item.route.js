import express from 'express';
import { getAllItems } from '../controllers/item.controller.js';

const router = express.Router();

router.get('/get-all-items', getAllItems);

export default router;


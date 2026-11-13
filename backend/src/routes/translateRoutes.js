import express from 'express';
import { translateText, translateLegacy } from '../controllers/translateController.js';

const router = express.Router();

router.post('/', translateText);
router.get('/:message/:speechcode/:captioncode', translateLegacy);

export default router;

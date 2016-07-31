import express from 'express';
import authenticator from './authenticate';

const router = express.Router();

router.use('/authenticate', authenticator);

export default router;
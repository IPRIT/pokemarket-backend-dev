import express from 'express';
import cors from './cors';
import test from './test';
import user from './user';
import { ClientError, ApiError } from './error/api-errors';

const router = express.Router();

router.all('*', cors);

router.use('/test', test);
router.use('/user', user);

router.use(ClientError);
router.use(ApiError);

export default router;
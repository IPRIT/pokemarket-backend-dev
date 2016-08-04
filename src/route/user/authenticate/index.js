import express from 'express';
import googleTokenVerifier from '../../../utils/google-token-verifier-middleware';
import facebookTokenVerifier from '../../../utils/facebook-token-verifier-middleware';
import { google, facebook } from './providers';

const router = express.Router();

router.post('/google', [ googleTokenVerifier ], google);
router.post('/facebook', [ facebookTokenVerifier ], facebook);

export default router;
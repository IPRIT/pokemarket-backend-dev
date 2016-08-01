import express from 'express';
import rights from '../../../utils/rights-middleware';
import googleTokenVerifier from '../../../utils/google-token-verifier-middleware';
import facebookTokenVerifier from '../../../utils/facebook-token-verifier-middleware';
import { google, facebook } from './providers';

const router = express.Router();

router.post('/google', [ rights('user', 'admin'), googleTokenVerifier ], google);
router.post('/facebook', [ rights('user', 'admin'), facebookTokenVerifier ], facebook);

export default router;
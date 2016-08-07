import express from 'express';
import { rightsAllocator, userRetriever } from '../../utils';
import * as adminMethods from './methods';

const router = express.Router();

router.post('/scanPokemons', [ userRetriever, rightsAllocator() ], adminMethods.scanPokemons);

export default router;
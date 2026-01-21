import express from 'express';

const router = express.Router();

import { signUp, signIn, getUsers } from './users.controllers';

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/users', getUsers);

export default router;
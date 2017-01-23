//api 루트 라우터 생성

import express from 'express';

import article from './article';


const router = express.Router();

router.use('/article', article);

export default router;


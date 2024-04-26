import * as Express from 'express';
import apiRoutes from './api';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE } from '@/utils/ReturnCode';

const router = Express.Router();

router.use('/api', apiRoutes);

// Undefined routes
router.use('*', (req: Request, res: Response) => {
    const response = new BaseResponse(RET_CODE.NOT_FOUND, false, 'API route not found');
    res.json(response.getResponse());
});

export default router;

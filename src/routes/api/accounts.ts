import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE, RET_MSG } from '@/utils/ReturnCode';

import AccountService from '@/services/accounts';

const router = Express.Router();

// POST: /api/accounts
// Desc: Register an account
router.post('/', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.register(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

// GET: /api/accounts
// Desc: Login
router.get('/', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.login(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse()); 
});

export default router;

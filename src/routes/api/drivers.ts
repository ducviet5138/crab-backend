import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE, RET_MSG } from '@/utils/ReturnCode';

import AccountService from '@/services/bookings';

const router = Express.Router();

// GET: /api/drivers/:id/cash-incomes
// Desc: Get cash income of a driver
router.get('/:id/cash-incomes', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.getCashIncome(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/drivers/:id/card-incomes
// Desc: Get card income of a driver
router.get('/:id/card-incomes', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.getCardIncome(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;
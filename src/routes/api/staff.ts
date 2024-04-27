import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/BaseResponse';
import { RET_CODE, RET_MSG } from '@/utils/ReturnCode';

import BookingService from '@/services/bookings';

const router = Express.Router();

// POST: /api/staff/bookings
// Desc: Create a booking by staff
router.post('/bookings', async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.createByStaff(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;
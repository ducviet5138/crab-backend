import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import BookingInfoService from "@/services/booking-infos";

const router = Express.Router();

// POST: /api/booking-infos
// Desc: Create a booking info
router.post("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        if (req.body.pLat) {
            response = await BookingInfoService.createWithLatLng(req);
        } else {
            response = await BookingInfoService.createWithId(req);
        }
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

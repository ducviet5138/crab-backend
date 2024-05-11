import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
import FeeService from "@/services/fee";

const router = Express.Router();

// POST: /api/fee/get-fee
// Desc: Get all fee to display on the screen
router.post("/get-fee", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await FeeService.getAllFee(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
import NotficaticationService from "@/services/notification";

const router = Express.Router();

// POST: /api/notification/update-token
// Desc: Get all fee to display on the screen
router.post("/update-token", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await NotficaticationService.updateToken(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

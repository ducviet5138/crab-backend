import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import AccountService from "@/services/accounts";

const router = Express.Router();

// POST: /api/firebase/auth
// Desc: Register or login with Firebase
router.post("/auth", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.firebaseAuth(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

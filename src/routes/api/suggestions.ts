import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import SuggestionService from "@/services/suggestion";

const router = Express.Router();

// POST: /api/suggestions
// Desc: Create a booking by staff
router.post("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        let prompt = req.body.prompt;
        response = await SuggestionService.chatGPT(prompt);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());

    }
});

export default router;

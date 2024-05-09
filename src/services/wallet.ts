import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
import { Transaction } from "@/entities";

class WalletService {
    async getHistory(req: Request) {
        try {
            const { id } = req.body;

            const data = await Transaction.find({ wallet: id });
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

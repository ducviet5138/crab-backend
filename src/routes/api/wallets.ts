import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import WalletService from "@/services/wallet";

const router = Express.Router();

// GET: /api/wallets/:userId/:type
// Desc: Get wallet
router.get("/:userId/:type", async (req: Request, res: Response) => {
    try {
        const data = await WalletService.getWallet(req);
        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
    } catch (_: any) {
        return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
});

// GET: /api/wallets/:userId/:type/transactions
// Desc: Get transaction history
router.get("/:userId/:type/transactions", async (req: Request, res: Response) => {
    try {
        const data = await WalletService.getHistory(req);
        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
    } catch (_: any) {
        return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
});

// // GET: /api/wallets/:userId/:type/balance
// // Desc: Get wallet balance
// router.get("/:id/balance", async (req: Request, res: Response) => {
//     try {
//         const data = await WalletService.getBalance(req);
//         return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
//     } catch (_: any) {
//         return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
//     }
// });

// GET: /api/wallets/:userId/:type/transactions/:id
// Desc: Get transaction
router.get("/:userId/:type/transactions/:id", async (req: Request, res: Response) => {
    try {
        const data = await WalletService.getTransaction(req);
        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
    } catch (_: any) {
        return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
});

export default router;

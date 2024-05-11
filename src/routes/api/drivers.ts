import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import BookingService from "@/services/bookings";
import WalletService from "@/services/wallet";

const router = Express.Router();

// GET: /api/drivers/:id/cash-incomes
// Desc: Get cash income of a driver
router.get("/:id/cash-incomes", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.getCashIncome(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/drivers/:id/card-incomes
// Desc: Get card income of a driver
router.get("/:id/card-incomes", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.getCardIncome(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/drivers/:id/vehicle-types
router.get("/:id/vehicle-types", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.getCardIncome(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/drivers/:userId/wallets/:type
// Desc: Get wallet
router.get("/:userId/wallets/:type", async (req: Request, res: Response) => {
    let response = null;
    try {
        // const data = await WalletService.getWallet(req);
        response = await WalletService.getWallet(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/drivers/:userId/wallets/:type/transactions
// Desc: Get transaction history
router.get("/:userId/wallets/:type/transactions", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await WalletService.getHistory(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// // GET: /api/drivers/:userId/wallets/:type/balance
// // Desc: Get wallet balance
// router.get("/:id/balance", async (req: Request, res: Response) => {
//     try {
//         const data = await WalletService.getBalance(req);
//         return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
//     } catch (_: any) {
//         return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
//     }
// });

// GET: /api/drivers/:userId/wallets/:type/transactions/:id
// Desc: Get transaction
router.get("/:userId/wallets/:type/transactions/:id", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await WalletService.getTransaction(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// POST /api/drivers/:userId/top-up
// Desc: Top up wallet
router.post("/:userId/top-up", async (req: Request, res: Response) => {
    let response = null;
    try {
        console.log(req.body);
        response = await WalletService.topUp(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// POST /api/drivers/:userId/withdraw
// Desc: Withdraw from wallet
router.post("/:userId/withdraw", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await WalletService.withdraw(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import AccountService from "@/services/accounts";

const router = Express.Router();

// POST: /api/accounts/sign-up
// Desc: Register an account
router.post("/sign-up", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.register(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/accounts/sign-in
// Desc: Login
router.post("/sign-in", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.login(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/accounts/get-user
// Desc: Register in mobile app
router.post("/get-user", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.getUserData(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// PATCH: /api/accounts/
router.patch("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.update(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// POST: /api/accounts/:id/payment-methods
// Desc: Add a payment method
router.post("/:id/payment-methods", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.addPaymentMethod(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/accounts/:id/payment-methods
// Desc: Get payment methods of an account
router.get("/:id/payment-methods", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.getPaymentMethods(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/accounts/members
// Desc: Get all members except admin
router.get("/members", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await AccountService.getMembers(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

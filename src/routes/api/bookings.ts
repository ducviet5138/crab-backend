import * as Express from "express";
import { Request, Response } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
// import { addBookingToQueue } from "@/app";
import BookingService from "@/services/bookings";

const router = Express.Router();

// POST: /api/bookings
// Desc: Create a booking
router.post("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.flatCreate(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// PATCH: /api/bookings
// Desc: Update a booking
router.patch("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.patch(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/bookings
// Desc: Get all bookings
router.get("/", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.list();
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// GET: /api/bookings/:id
// Desc: Get a booking by id
router.get("/:id", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.get(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;
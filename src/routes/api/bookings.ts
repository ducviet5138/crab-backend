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


// GET: /api/bookings/check-progress-booking?id=userId&role=role
// Desc: Get a booking by id
router.post("/check-progress-booking", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.checkProgressBooking(req);
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



// GET: /api/bookings/driver-assigned/:id
// Desc: Get a driver of the booking
router.get("/driver-assigned/:id", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.getAssignedDriverBooking(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});


// GET: /api/bookings/:id/rating/pre-rate-info
// Desc: Get a rate info of the booking
router.get("/:id/rating/pre-rating-info", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.getPreRatingInfo(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// POST: /api/bookings/:id/customer-rating
// Desc: Customer rate a booking
router.post("/:id/customer-rating", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.customerRating(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

// POST: /api/bookings/:id/driver-rating
// Desc: Driver rate a booking
router.post("/:id/driver-rating", async (req: Request, res: Response) => {
    let response = null;
    try {
        response = await BookingService.driverRating(req);
    } catch (_: any) {
        response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    }
    res.status(response.getRetCode()).json(response.getResponse());
});

export default router;

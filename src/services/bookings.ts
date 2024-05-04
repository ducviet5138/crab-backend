import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { BookingInfo, LocationRecord, Booking } from "@/entities";
import objectIdConverter from "@/utils/ObjectIdConverter";

import BookingInfoService from "./booking-infos";

import { addBookingToQueue, BookingWS } from "@/app";

class BookingService {
    async flatCreate(req: Request) {
        try {
            const { ordered_by, service, vehicle } = req.body;

            if (!ordered_by) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const booking_info = await BookingInfoService.createWithLatLng(req);

            const data = new Booking({
                info: objectIdConverter(booking_info.data._id),
                orderedBy: objectIdConverter(ordered_by),
                vehicle,
                service,
            });

            await data.save();
            const dat = new BookingWS(data._id.toString(), req.body.pLat, req.body.pLng, req.body.ordered_by);
            addBookingToQueue(dat);
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async create(req: Request) {
        try {
            const { booking_info, ordered_by } = req.body;

            if (!booking_info || !ordered_by) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = new Booking({
                info: booking_info,
                orderedBy: ordered_by,
            });

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const { id, status, driver } = req.body;

            if (!id || !status) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = await Booking.findById(id);

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid booking info");
            }

            if (status === "accepted" && !driver) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            } else if (status === "accepted") {
                data.driver = driver;
            }

            data.status = status;

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const { id } = req.params;

            if (!id) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = await Booking.findById(id).populate("info").populate("orderedBy").populate("driver");

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid booking info");
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async list() {
        try {
            const data = await Booking.find().populate("info").populate("orderedBy").populate("driver");

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async createByStaff(req: Request) {
        try {
            const { ordered_by, pick_up, destination, phone, name, vehicle } = req.body;

            if (!ordered_by || !pick_up || !destination || !destination.address || !phone || !name) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            let pickUpId = pick_up._id ? objectIdConverter(pick_up._id) : "";
            let destinationId = destination._id ? objectIdConverter(destination._id) : "";

            if (!pickUpId) {
                const newPickUpLocationRecord = new LocationRecord({
                    address: pick_up.address as string,
                });

                const data = await newPickUpLocationRecord.save();

                pickUpId = data._id;
            }

            if (!destinationId) {
                const newDestinationLocationRecord = new LocationRecord({
                    address: destination.address as string,
                });

                const data = await newDestinationLocationRecord.save();

                destinationId = data._id;
            }

            const bookingInfo = new BookingInfo({
                pickup: pickUpId,
                destination: destinationId,
                name,
                phone,
            });

            await bookingInfo.save();

            const data = new Booking({
                info: bookingInfo._id,
                orderedBy: objectIdConverter(ordered_by),
                vehicle,
                service: vehicle === "car" ? "Car" : "Bike",
            });

            const pickup = await LocationRecord.findById(pickUpId);

            const dat = new BookingWS(
                data._id.toString(),
                pickup?.location?.coordinates[1],
                pickup?.location?.coordinates[0],
                ordered_by
            );

            addBookingToQueue(dat);

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new BookingService();

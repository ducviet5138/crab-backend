import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { BookingInfo, LocationRecord, Booking, User, NotificationToken } from "@/entities";
import objectIdConverter from "@/utils/ObjectIdConverter";

import BookingInfoService from "./booking-infos";
import NotificationService from "./notification";
import { addBookingToQueue, BookingWS } from "@/app";
import { TRIP_STATUS } from "@/utils/TripStatus";

class BookingService {
    async flatCreate(req: Request) {
        try {
            const { ordered_by, service, vehicle } = req.body;

            if (!ordered_by) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const booking  = await Booking.findOne({ orderedBy: ordered_by, status: { $in: ["pending", "accepted", "arrived-at-pick-up", "pick-up"] } });
            
            if (booking) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "You already have a booking");
            }

            const booking_info = await BookingInfoService.createWithLatLng(req);

            const data = new Booking({
                info: objectIdConverter(booking_info.data._id),
                orderedBy: objectIdConverter(ordered_by),
                vehicle,
                service,
            });

            await data.save();
            const dat = new BookingWS(
                data._id.toString(),
                req.body.pLat,
                req.body.pLng,
                req.body.ordered_by,
                data.vehicle
            );
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
            } else{
                const token = await NotificationToken.findOne({ user: data.orderedBy });
                if (token != null)
                {
                    switch(status) {
                        case "accepted": {
                            const {driverLat, driverLng} = req.body;
                            NotificationService.sendNotification(token.token, TRIP_STATUS.DRIVER_COMMING, data._id.toString(), driverLat, driverLng);
                            break;
                        }
                        case "arrived-at-pick-up": {
                            NotificationService.sendNotification(token.token, TRIP_STATUS.DRIVER_ARRIVED, data._id.toString());
                            break;

                        }
                        case "pick-up": {
                            NotificationService.sendNotification(token.token, TRIP_STATUS.PICKUP,data._id.toString());
                            break;

                        }
                        case "completed": {
                            NotificationService.sendNotification(token.token, TRIP_STATUS.TRIP_FINISHED, data._id.toString());
                            break;

                        }
                    
                    }
                }

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

    async checkProgressBooking(req: Request)
    {
        try {
            const { id, role } = req.body;
            if (!id) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            if(!role) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            let data = null
            if (role === "driver") {
                data = await Booking.findOne({ 
                    driver: id,
                    status: { $in: ["pending", "accepted", "arrived-at-pick-up", "pick-up"]}
                }).populate("info").populate("orderedBy").populate("driver");
            }else {
                data = await Booking.findOne({ 
                    orderedBy: id,
                    status: { $in: ["pending", "accepted", "arrived-at-pick-up", "pick-up"]}
                }).populate("info").populate("orderedBy").populate("driver");
            }

            if (data) {
                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
            }else {
                return new BaseResponse(RET_CODE.ERROR, false, "No booking in progress");
            }
        }catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAssignedDriverBooking(req: Request) {
        const {id} = req.params;
        if (!id) {
            return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
        }
        const booking = await Booking.findById(id).populate("driver");
        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, booking.driver);
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
                ordered_by,
                data.vehicle
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

    async getCashIncome(req: Request) {
        try {
            const { id } = req.params;

            if (!id) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = (await Booking.find({ driver: id, status: "completed" }).populate("info")) as any;

            let total = 0;

            for (const item of data)
                if (!item.info.transaction) {
                    total += item.info.fee;
                }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                total,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getCardIncome(req: Request) {
        try {
            const { id } = req.params;

            if (!id) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = (await Booking.find({ driver: id, status: "completed" }).populate("info")) as any;

            let total = 0;

            for (const item of data)
                if (item.info.transaction) {
                    total += item.info.fee;
                }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                total,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new BookingService();

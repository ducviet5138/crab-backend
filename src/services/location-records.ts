import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
import { updateBookingWS } from "@/app";

import * as dotenv from "dotenv";
dotenv.config();

import { LocationRecord, BookingInfo, Booking } from "@/entities";
import coordinateConverter from "@/utils/CoordinateConverter";
import objectIdConverter from "@/utils/ObjectIdConverter";

import { FeeDriving } from "@/class/FeeDriving";
import { BikeStrategy } from "@/class/strategy/BikeStrategy";
import { CarStrategy } from "@/class/strategy/CarStrategy";

class LocationRecordsService {
    async create(req: Request) {
        try {
            const { address, location } = req.body;

            if (!address || !location) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = new LocationRecord({
                address,
                location: coordinateConverter(location),
            });

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async findBySearchParams(req: Request) {
        try {
            // Do a string search for address
            const address = req.query.address;
            const lat = req.query.lat;
            const long = req.query.long;

            if (!address && !lat && !long) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            let query = {};

            if (address) {
                query = {
                    ...query,
                    address: {
                        $regex: address,
                        $options: "i",
                    },
                };
            }

            if (lat && long) {
                query = {
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [long, lat],
                            },
                            $maxDistance: 50,
                        },
                    },
                };
            }

            const data = await LocationRecord.find(query).then((res) => {
                return res;
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async listUnresolved() {
        try {
            const data = await LocationRecord.find({ location: { $exists: false } });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async update(req: Request) {
        try {
            const { id } = req.params;
            const { address, location } = req.body;

            if (!id || (!address && !location)) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = await LocationRecord.findById(id);

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Record not found");
            }

            if (address) {
                data.address = address;
            }

            if (location) {
                data.location = coordinateConverter(location);
            }

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async updateFee(req: Request) {
        try {
            const { id } = req.params;

            const associatedBookingInfo = (await BookingInfo.find({
                $or: [{ pickup: objectIdConverter(id) }, { destination: objectIdConverter(id) }],
            }).populate("pickup destination")) as any;

            if (!associatedBookingInfo) {
                return new BaseResponse(RET_CODE.ERROR, false, "Record not found");
            }

            let totalUpdatedDocuments = 0;

            for (const it of associatedBookingInfo)
                if (it.pickup.location && it.destination.location && !it.fee) {
                    const dLong = it.destination.location.coordinates[0];
                    const dLat = it.destination.location.coordinates[1];

                    const pLong = it.pickup.location.coordinates[0];
                    const pLat = it.pickup.location.coordinates[1];

                    const requestUrl =
                        "https://maps.googleapis.com/maps/api/distancematrix/json" +
                        "?origins=" +
                        pLat +
                        "," +
                        pLong +
                        "&destinations=" +
                        dLat +
                        "," +
                        dLong +
                        "&key=" +
                        process.env.API_KEY;

                    const response = await fetch(requestUrl);
                    const data = await response.json();

                    const distance = data.rows[0].elements[0].distance.value / 1000; // in km

                    // Get all fee strategies
                    // If customer place order from telephone operator, there are 2 options: bike and car
                    const feeDriving = new FeeDriving(distance);
                    feeDriving.feeManager.addFeeStrategy(new BikeStrategy());
                    feeDriving.feeManager.addFeeStrategy(new CarStrategy());
                    const feeList = feeDriving.getAllFeeStrategy();

                    // Find type of vehicle in Booking
                    const booking = await Booking.findOne({
                        info: it._id,
                    });

                    // Calculate fee
                    const fee = feeList.find((fee) => fee.typeVehicle === booking.vehicle).fee;
                    updateBookingWS(booking._id.toString(), pLat, pLong);
                    // Update fee to BookingInfo
                    it.fee = fee;
                    it.distance = distance;
                    await it.save();
                    ++totalUpdatedDocuments;
                }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                totalUpdatedDocuments,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new LocationRecordsService();

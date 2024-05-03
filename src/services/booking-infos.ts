import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { BookingInfo, LocationRecord } from "@/entities";

class BookingInfoService {
    async createWithLatLng(req: Request) {
        try {
            const { pLat, pLng, dLat, dLng, pAddress, dAddress, name, phone, fee } = req.body;

            if (!pLat || !pLng || !dLat || !dLng || !pAddress || !dAddress || !name || !phone) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            // search for the nearest location record
            let pLocation = await LocationRecord.findOne({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [pLng, pLat],
                        },
                        $maxDistance: 25,
                    },
                },
            });

            let dLocation = await LocationRecord.findOne({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [dLng, dLat],
                        },
                        $maxDistance: 25,
                    },
                },
            });

            if (!pLocation) {
                pLocation = new LocationRecord({
                    address: pAddress,
                    location: {
                        type: "Point",
                        coordinates: [pLng, pLat],
                    },
                });

                await pLocation.save();
            }

            if (!dLocation) {
                dLocation = new LocationRecord({
                    address: dAddress,
                    location: {
                        type: "Point",
                        coordinates: [dLng, dLat],
                    },
                });

                await dLocation.save();
            }

            const data = new BookingInfo({
                name: name,
                phone: phone,
                pickup: pLocation,
                destination: dLocation,
                fee: fee,
            });

            await data.save();
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async createWithId(req: Request) {
        try {
            const { pId, dId, name, phone } = req.body;

            if (!pId || !dId || !name || !phone) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const pLocation = await LocationRecord.findById(pId);
            const dLocation = await LocationRecord.findById(dId);

            if (!pLocation || !dLocation) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid location record");
            }

            const data = new BookingInfo({
                name: name,
                phone: phone,
                pickup: pLocation,
                destination: dLocation,
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
            const { id, name, phone } = req.body;

            if (!id || !name || !phone) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid request");
            }

            const data = await BookingInfo.findById(id);

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid booking info");
            }

            data.name = name;
            data.phone = phone;

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new BookingInfoService();

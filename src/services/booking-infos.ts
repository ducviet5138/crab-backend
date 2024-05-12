import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { BookingInfo, LocationRecord, Transaction, Booking } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";
import { groupBy, mapValues, sumBy } from "lodash";

class BookingInfoService {
    async createWithLatLng(req: Request) {
        try {
            const { pLat, pLng, dLat, dLng, pAddress, dAddress, name, phone, fee, distance } = req.body;

            const { visa } = req.body;
            console.log(visa);
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
                        $maxDistance: 50,
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
                        $maxDistance: 50,
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
                transaction: null,
                distance: distance ? distance : 0,
                payment_method: visa ? "card" : "cash",
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

    async getTotalFees(req: Request) {
        try {
            const data = (await Booking.find().populate("info")) as any;

            const { type } = req.query;

            let total;

            if (type) {
                const groupedByDate = groupBy(data, (item) => {
                    const date = new Date(item.updatedAt);
                    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                });
                const totalPerDate = mapValues(groupedByDate, (items) =>
                    sumBy(items, (item) => (item.vehicle === type ? item.info.fee : 0))
                );
                total = Object.entries(totalPerDate).map(([date, value]) => ({ date, value }));
            } else {
                total = data.reduce((acc, cur) => acc + cur.info.fee, 0);
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, total);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new BookingInfoService();

import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { LocationRecord } from "@/entities";
import coordinateConverter from "@/utils/CoordinateConverter";

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
}

export default new LocationRecordsService();

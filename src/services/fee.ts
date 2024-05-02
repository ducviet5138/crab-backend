import { FeeDriving } from "@/class/FeeDriving";
import { BikeEconomyStrategy } from "@/class/strategy/BikeEconomyStrategy";
import { BikeStrategy } from "@/class/strategy/BikeStrategy";
import { CarEconomyStrategy } from "@/class/strategy/CarEconomyStrategy";
import { CarStrategy } from "@/class/strategy/CarStrategy";

import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

class FeeService {
    async getAllFee(req: Request) {
        const { distance } = req.body;
        // calculate distance
        const fee = new FeeDriving(distance);
        fee.feeManager.addFeeStrategy(new BikeEconomyStrategy());
        fee.feeManager.addFeeStrategy(new BikeStrategy());
        fee.feeManager.addFeeStrategy(new CarStrategy());
        fee.feeManager.addFeeStrategy(new CarEconomyStrategy());
        const result = fee.getAllFeeStrategy();
        return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
            fee: result,
        });
    }
}

export default new FeeService();

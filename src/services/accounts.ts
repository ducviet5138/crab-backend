import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { User } from "@/entities";

import hashPassword from "@/utils/HashPassword";

class AccountService {
    async register(req: Request) {
        try {
            const { phone, password, role } = req.body;

            const duplicatedAccount = await User.findOne({ phone });

            if (duplicatedAccount) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "This phone number is already registered");
            }

            if (role && (role === "admin" || role === "staff")) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Invalid role");
            }

            const data = new User({
                phone,
                password: hashPassword(password),
                role,
            });

            await data.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async login(req: Request) {
        try {
            const { phone, password } = req.body;

            const account = await User.findOne({ phone });

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Account not found");
            }

            if (account.password !== hashPassword(password)) {
                return new BaseResponse(RET_CODE.ERROR, false, "Invalid password");
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: account._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new AccountService();

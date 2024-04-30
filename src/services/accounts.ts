import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { User } from "@/entities";

import hashPassword from "@/utils/HashPassword";
import generateJWTToken from "@/utils/GenerateJWTToken";

class AccountService {
    async register(req: Request) {
        try {
            const { phone, password } = req.body;
            let { role } = req.body;

            if (!role) role = "customer";

            const existedAccount = await User.findOne({ phone });

            if (existedAccount) {
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
            let { role } = req.body;

            if (!role) role = "customer";

            const account = await User.findOne({
                phone,
                role,
                password: hashPassword(password),
            });

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number or password is invalid");
            }

            // Return JWT token
            const token = generateJWTToken({ _id: account._id.toString() });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async firebaseAuth(req: Request) {
        try {
            const { UID } = req.body;
            let { role, phone } = req.body;

            if (!phone || !UID) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, "Missing phone or UID");
            }

            if (!role) role = "customer";

            // Format phone number from +84xxxxxxxxx to 0xxxxxxxxx
            if (phone.startsWith("+84")) phone = "0" + phone.slice(3);

            const existedAccount = await User.findOne({ phone });

            // Update UID for existed account and return jwt token to client
            if (existedAccount) {
                existedAccount.firebaseUID = UID;
                await existedAccount.save();

                // Return JWT token
                const token = generateJWTToken({ _id: existedAccount._id.toString() });

                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                    existedAccount,
                    newUser: false,
                    token,

                });
            }

            const data = new User({
                phone,
                password: hashPassword(Math.random().toString(36).substring(8)), // Generate random password for account created by Firebase
                role,
                firebaseUID: UID,
            });

            await data.save();

            // Return JWT token
            const token = generateJWTToken({ _id: data._id.toString() });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data,
                newUser: true,
                token
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getUserData(req: Request) {
        try {
            const { phone } = req.body;
            let { role } = req.body;

            if (!role) role = "customer";

            const account = await User.findOne({
                phone,
                role,
            }).select("-password");

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number is invalid");
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                account: account,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new AccountService();

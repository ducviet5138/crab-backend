import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";

import { User, PaymentMethod, Vehicle } from "@/entities";

import hashPassword from "@/utils/HashPassword";
import generateJWTToken from "@/utils/GenerateJWTToken";
import objectIdConverter from "@/utils/ObjectIdConverter";

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

            let account = await User.findOne({
                phone,
                role,
                password: hashPassword(password),
            });

            if (!account && role == "staff")
                account = await User.findOne({
                    phone,
                    role: "admin",
                    password: hashPassword(password),
                });

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number or password is invalid");
            }

            // Return JWT token
            const token = generateJWTToken({
                _id: account._id.toString(),
                phone: account.phone,
                name: account.name,
                role: account.role,
                avatar: account.avatar,
            });

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
                const token = generateJWTToken({
                    _id: existedAccount._id.toString(),
                    phone: existedAccount.phone,
                    name: existedAccount.name,
                    role: existedAccount.role,
                    avatar: existedAccount.avatar,
                });

                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
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
            const token = generateJWTToken({
                _id: data._id.toString(),
                phone: data.phone,
                name: data.name,
                role: data.role,
                avatar: data.avatar,
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
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

    async update(req: Request) {
        try {
            const { _id, name, avatar } = req.body;
            let { role } = req.body;

            if (!role) role = "customer";

            const account = await User.findById(objectIdConverter(_id));

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number is invalid");
            }

            // Update data if it's not empty
            if (name) account.name = name;
            if (avatar) account.avatar = avatar;
            if (role) account.role = role;

            await account.save();

            // Get token
            const token = generateJWTToken({
                _id: account._id.toString(),
                phone: account.phone,
                name: account.name,
                role: account.role,
                avatar: account.avatar,
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async addPaymentMethod(req: Request) {
        try {
            const { id } = req.params;
            const { number, exp, cvv, name } = req.body;

            const account = await User.findById(objectIdConverter(id));

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number is invalid");
            }

            const card = new PaymentMethod({
                number,
                exp,
                cvv,
                name,
            });

            await card.save();

            account.payment_methods.push(card._id);

            await account.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getPaymentMethods(req: Request) {
        try {
            const { id } = req.params;

            const account = (await User.findById(objectIdConverter(id)).populate("payment_methods")) as any;

            if (!account) {
                return new BaseResponse(RET_CODE.ERROR, false, "Phone number is invalid");
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data: account.payment_methods,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getMembers(req: Request) {
        try {
            const members = await User.find({ role: { $ne: "admin" } });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data: members,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async addOrUpdateVehicle(req: Request) {
        try {
            const { id } = req.params;
            const { plate, type, description } = req.body;

            const vehicle = await Vehicle.findOne({ user: objectIdConverter(id) });

            // If vehicle is not existed, create new one
            if (!vehicle) {
                const newVehicle = new Vehicle({
                    user: objectIdConverter(id),
                    plate,
                    type,
                    description,
                });

                await newVehicle.save();

                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                    user: newVehicle.user,
                    plate: newVehicle.plate,
                    type: newVehicle.type,
                    description: newVehicle.description,
                });
            } else {
                // Update vehicle if it's already existed
                vehicle.plate = plate;
                vehicle.type = type;
                vehicle.description = description;

                await vehicle.save();

                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                    user: vehicle.user,
                    plate: vehicle.plate,
                    type: vehicle.type,
                    description: vehicle.description,
                });
            }
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getVehicles(req: Request) {
        try {
            const { id } = req.params;

            const vehicle = await Vehicle.findOne({ user: objectIdConverter(id) });

            // If vehicle is not existed, return "" in all fields
            if (!vehicle) {
                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                    user: "",
                    plate: "",
                    type: "",
                    description: "",
                });
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                user: vehicle.user,
                plate: vehicle.plate,
                type: vehicle.type,
                description: vehicle.description,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async validateVehicle(req: Request) {
        try {
            const { id } = req.params;

            const vehicle = await Vehicle.findOne({ user: objectIdConverter(id) });

            if (!vehicle) {
                return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                    data: false,
                });
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                data: true,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new AccountService();

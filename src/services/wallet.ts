import { Request } from "express";
import BaseResponse from "@/utils/BaseResponse";
import { RET_CODE, RET_MSG } from "@/utils/ReturnCode";
import { Transaction, User, Wallet } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";

class WalletService {
    async resolveWallet(userId: string, type: string) {
        const user = await User.findById(userId);
        switch (type) {
            case "credit":
                return Wallet.findById(user.credit_wallet).populate("transactions");
            case "cash":
                return Wallet.findById(user.cash_wallet).populate("transactions");
            default:
                return null;
        }
    }

    async getHistory(req: Request) {
        try {
            const { userId, type } = req.params;

            const wallet = await this.resolveWallet(userId, type);
            if (!wallet) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
            }

            const data = await Transaction.find({ wallet: wallet._id });
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    // async getBalance(req: Request) {
    //     try {
    //         // const { id } = req.body;

    //         // const data = await Transaction.find({ wallet: id });

    //         // if (!data) {
    //         //     return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
    //         // }

    //         // const balance = data.reduce((acc, cur) => acc + cur.amount, 0);
    //         // return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, { balance });

    //         const { userId, type } = req.params;

    //         const wallet = await this.resolveWallet(userId, type);
    //         if (!wallet) {
    //             return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
    //         }

    //         return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, { balance: wallet.amount });
    //     } catch (_: any) {
    //         return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
    //     }
    // }

    async getWallet(req: Request) {
        try {
            const { userId, type } = req.params;
            const wallet = await this.resolveWallet(userId, type);
            if (!wallet) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, wallet);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getTransaction(req: Request) {
        try {
            const { userId, type, id } = req.params;

            const wallet = await this.resolveWallet(userId, type);
            if (!wallet) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
            }

            const data = await Transaction.findById(id);
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async topUp(req: Request) {
        try {
            const { userId } = req.params;
            const { amount } = req.body;

            const wallet = await this.resolveWallet(userId, "credit");
            if (!wallet) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
            }

            const transaction = new Transaction({
                ref: "TPU" + generateTrans(),
                amount,
                type: "DEPOSIT",
                wallet: wallet._id,
            });
            await transaction.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async withdraw(req: Request) {
        try {
            const { userId } = req.params;
            const { amount } = req.body;

            const wallet = await this.resolveWallet(userId, "cash");
            if (!wallet) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, "Wallet not found");
            }

            const transaction = new Transaction({
                ref: "WTD" + generateTrans(),
                amount,
                type: "WITHDRAWAL",
                wallet: wallet._id,
            });
            await transaction.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new WalletService();

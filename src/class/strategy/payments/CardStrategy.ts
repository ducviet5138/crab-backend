import { IPaymentStrategy } from "@/class/IPaymentStrategy";
import { Transaction, User } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";
import mongoose from "mongoose";

export class CardStrategy implements IPaymentStrategy {
    async pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        const driverInstance = await User.findById(driver);
        const transaction = new Transaction({
            ref: "PMT" + generateTrans(),
            amount: amount,
            type: "PAYMENT",
            wallet: driverInstance.cash_wallet,
        });
        await transaction.save();
    }
}

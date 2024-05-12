import { IPaymentStrategy } from "@/class/IPaymentStrategy";
import { Transaction, User } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";
import mongoose from "mongoose";

export class CashStrategy implements IPaymentStrategy {
    async pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        const driverInstance = await User.findById(driver);
        const transactionA = new Transaction({
            ref: "PMT" + generateTrans(),
            amount: amount * 0.8,
            type: "PAYMENT",
            wallet: driverInstance.cash_wallet,
        });
        await transactionA.save();

        const transactionB = new Transaction({
            ref: "FEE" + generateTrans(),
            amount: amount,
            type: "FEE",
            wallet: driverInstance.credit_wallet,
        });
        await transactionB.save();
    }
}

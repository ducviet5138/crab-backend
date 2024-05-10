import { IPaymentStrategy } from "@/class/IPaymentStrategy";
import { Transaction, User } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";
import mongoose from "mongoose";

export class CashStrategy implements IPaymentStrategy {
    async pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        const customerInstance = await User.findById(customer);
        const transaction = new Transaction({
            ref: customer.id + " " + driver.id + " " + amount,
            amount: amount,
            type: "PAYMENT",
            wallet: customerInstance.cash_wallet,
        });
        await transaction.save();
        return await Transaction.findById(transaction.id);
    }
}

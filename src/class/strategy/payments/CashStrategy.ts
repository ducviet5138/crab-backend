import { IPaymentStrategy } from "@/class/IPaymentStrategy";
import { Transaction } from "@/entities";
import generateTrans from "@/utils/GenerateTrans";
import mongoose from "mongoose";

export class CashStrategy implements IPaymentStrategy {
    async pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        const transaction = new Transaction({ ref: customer.id + " " + driver.id + " " + amount });
        await transaction.save();
        return await Transaction.findById(transaction.id);
    }
}

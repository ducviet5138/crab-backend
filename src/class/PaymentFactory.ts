import mongoose from "mongoose";
import { IPaymentStrategy } from "./IPaymentStrategy";
import { CashStrategy } from "./strategy/payments/CashStrategy";

export class PaymentFactory {
    private paymentStrategy: IPaymentStrategy;

    constructor(strategy: string) {
        if (strategy === "cash") {
            this.paymentStrategy = new CashStrategy();
        }
    }

    pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        this.paymentStrategy.pay(customer, driver, amount);
    }
}

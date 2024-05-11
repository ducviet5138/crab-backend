import mongoose from "mongoose";
import { IPaymentStrategy } from "./IPaymentStrategy";
import { CashStrategy } from "./strategy/payments/CashStrategy";
import { CardStrategy } from "./strategy/payments/CardStrategy";

export class PaymentFactory {
    private paymentStrategy: IPaymentStrategy;

    constructor(strategy: string) {
        if (strategy === "cash") {
            this.paymentStrategy = new CashStrategy();
        } else if (strategy === "card") {
            this.paymentStrategy = new CardStrategy();
        }
    }

    pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number) {
        this.paymentStrategy.pay(customer, driver, amount);
    }
}

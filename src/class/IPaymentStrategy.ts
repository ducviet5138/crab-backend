import mongoose from "mongoose";

export interface IPaymentStrategy {
    pay(customer: mongoose.Types.ObjectId, driver: mongoose.Types.ObjectId, amount: number): any;
}

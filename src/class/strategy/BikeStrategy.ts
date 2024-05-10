import { IFeeStrategy } from "../IFeeStrategy";

export class BikeStrategy implements IFeeStrategy {
    getName(): string {
        return "Bike";
    }

    getNumSeat(): number {
        return 1;
    }
    // create method
    calculateFee(distance: number): number {
        let fee = 0;
        if (distance <= 2) {
            fee = distance * 13500;
            return fee;
        }
        fee = 2 * 13500 + (distance - 2) * 4300;
        return fee;
    }

    getTypeVehicle(): string {
        return "motorbike";
    }
}

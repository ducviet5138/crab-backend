import { IFeeStrategy } from "../IFeeStrategy";

export class CarStrategy implements IFeeStrategy {
    // create method
    calculateFee(distance: number): number {
        if (distance <= 2)
            return distance*29000;
        else
            return 2*29000 + (distance-2)*9000;
    }

    getName(): string {
        return 'Car';
    }

    getNumSeat(): number {
        return 4;
    }

    getTypeVehicle(): string {
        return 'car';
    }
}
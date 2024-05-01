import { IFeeStrategy } from "../IFeeStrategy";

export class CarEconomyStrategy implements IFeeStrategy {
    // create method
    calculateFee(distance: number): number {
        if (distance <= 2)
            return  distance*267000;
        else
            return 2*26700 + (distance-2)*9100
    }

    getName(): string {
        return 'Car Economy';
    }

    getNumSeat(): number {
        return 4;
    }

    getTypeVehicle(): string {
        return 'car';
    }
}
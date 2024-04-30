import { IFeeStrategy } from "../IFeeStrategy";

export class CarEconomyStrategy implements IFeeStrategy {
    // create method
    calculateFee(distance: number): number {
        if (distance <= 2)
            return  distance*267000;
        else
            return 2*267000 + (distance-2)*91000
    }

    getName(): string {
        return 'Car economy';
    }

    getNumSeat(): number {
        return 4;
    }

    getTypeVehicle(): string {
        return 'Car';
    }
}
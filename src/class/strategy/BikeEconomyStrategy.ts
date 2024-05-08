import { IFeeStrategy } from "../IFeeStrategy";

export class BikeEconomyStrategy implements IFeeStrategy {
    // create method
    calculateFee(distance: number): number {
        let fee = 0;
        if (distance <= 2) fee = distance * 12500;
        else fee = 2 * 12500 + (distance - 2) * 4300;
        return fee;
    }

    getName(): string {
        return "Bike Economy";
    }

    getNumSeat(): number {
        return 1;
    }

    getTypeVehicle(): string {
        return "motorbike";
    }
}

import { IFeeStrategy } from '../IFeeStrategy';

export class BikeStrategy implements IFeeStrategy {

    getName(): string {
        return 'Crab bike';
    }

    getNumSeat(): number {
        return 1;
    }
    // create method
    calculateFee(distance: number): number {
        let fee = 0;
        if (distance <= 2)
            fee = distance*12500;
        
        fee = 2*12500 + (distance-2)*4300;
        return fee
    }

    getTypeVehicle(): string {
        return 'Bike';
    }
}
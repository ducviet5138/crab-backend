import { IFeeStrategy } from './IFeeStrategy';
export class FeeManager {
    private listFeeStrategy: IFeeStrategy[] = [];
    constructor() {
        this.listFeeStrategy = [];
    }

    addFeeStrategy(feeStrategy: IFeeStrategy): void {
        this.listFeeStrategy.push(feeStrategy);
    }

    removeFeeStrategy(feeStrategy: IFeeStrategy): void {
        this.listFeeStrategy = this.listFeeStrategy.filter(fee => fee !== feeStrategy);
    }

    getAllFeeStrategy(distance: number): {fee: number, typeVehicle: string, typeName: string, numSeat: number}[] {
        let list = []
        for (let fee of this.listFeeStrategy) {
            list.push({fee: fee.calculateFee(distance), typeVehicle: fee.getTypeVehicle() , typeName: fee.getName(), numSeat: fee.getNumSeat()})
        }

        return list
    }
}
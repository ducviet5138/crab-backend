import { IFeeStrategy } from './IFeeStrategy';
import { FeeManager } from './FeeManager';
import fee from '@/services/fee';
// create class vechicle
class LatLng {
    constructor(public lat: number, public lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

}
export class FeeDriving {
    private feeStrategy: IFeeStrategy;

    public feeManager: FeeManager;

    constructor (public distance: number)
    {
        this.distance = distance;
        this.feeManager = new FeeManager();
    }



    setStrategy(feeStrategy: IFeeStrategy): void {
        this.feeStrategy = feeStrategy;
    }

    getAllFeeStrategy(): {}[]  {
        let res = this.feeManager.getAllFeeStrategy(this.distance);   
        return res;   
    }

    calculateFee(): number {
        return this.feeStrategy.calculateFee(this.distance);
    }
}
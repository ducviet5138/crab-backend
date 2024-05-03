export interface IFeeStrategy {
    // create method
    calculateFee(distance: number): number;
    getName(): string;
    getNumSeat(): number;
    getTypeVehicle(): string;
}

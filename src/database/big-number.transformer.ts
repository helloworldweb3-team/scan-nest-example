import {ValueTransformer} from "typeorm";
import {BigNumber} from "bignumber.js";

export class BigNumberTransformer implements ValueTransformer {
    to(value: BigNumber): string {
        return value.toString();
    }

    from(value: string): BigNumber {
        return new BigNumber(value);
    }
}
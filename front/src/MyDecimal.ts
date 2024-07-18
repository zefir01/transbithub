import Decimal from "decimal.js";
import * as grpc from "./Protos/api_pb"

declare module 'decimal.js'{
    interface Decimal{
        FromPb(value?: grpc.Decimal.AsObject):Decimal;
        ToPb(): grpc.Decimal;
    }
}
function FromPb(value?: grpc.Decimal.AsObject):Decimal{
    if (value === undefined) {
        return new Decimal(0);
    }
    const NanoFactor: number = 1000000000;
    let units = new Decimal(value.units);
    let nanos = new Decimal(value.nanos);
    return units.add(nanos.dividedBy(NanoFactor));
}
function ToPb(this: Decimal): grpc.Decimal {
    const NanoFactor: number = 1000000000;
    let res = new grpc.Decimal();
    let units = this.trunc().toNumber();
    let nanos = this.minus(units).mul(NanoFactor).toNumber();
    res.setUnits(units);
    res.setNanos(nanos);
    return res;
}



export class MyDecimal extends Decimal.set({ toExpNeg: -10, toExpPos: 10 }) {
    constructor(value: any) {
        if (typeof (value) === "string") {
            if (value === "") {
                super(0);
            } else {
                super(value);
            }
        } else if (value === undefined || value == null) {
            super(0);
        } else {
            super(value);
        }
    }

    public ToPb(): grpc.Decimal {
        const NanoFactor: number = 1000000000;
        let res = new grpc.Decimal();
        let units = this.trunc().toNumber();
        let nanos = this.minus(units).mul(NanoFactor).toNumber();
        res.setUnits(units);
        res.setNanos(nanos);
        return res;
    }

    public static FromPb(value?: grpc.Decimal.AsObject): MyDecimal {
        if (value === undefined) {
            return new MyDecimal(0);
        }
        const NanoFactor: number = 1000000000;
        let units = new Decimal(value.units);
        let nanos = new Decimal(value.nanos);
        return new MyDecimal(units.add(nanos.dividedBy(NanoFactor)));
    }
}
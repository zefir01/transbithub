import {Advertisement} from "../Protos/api_pb";
import {MyDecimal} from "../MyDecimal";


export function DealLimitsComponent(ad: Advertisement.AsObject): string {
    let max: string;
    if (MyDecimal.FromPb(ad!.maxamountcalculated).toString() === "0") {
        max = "∞";
    } else {
        max = MyDecimal.FromPb(ad!.maxamountcalculated).toString();
    }
    return `${MyDecimal.FromPb(ad!.minamount)} - ${max} ${ad!.fiatcurrency}`;
}
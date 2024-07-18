import * as React from "react";
import {MyDecimal} from "../MyDecimal";
import {PrettyPrice} from "../helpers";

export interface IPriceProps {
    price: MyDecimal;
    currency: string;
}

export const Price = (props: IPriceProps) => {
    return (<span className="font-weight-bold text-success">
                                        {PrettyPrice(props.price)} {props.currency}
                                    </span>
    );
};
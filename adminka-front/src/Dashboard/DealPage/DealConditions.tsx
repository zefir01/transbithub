import * as React from "react";
import {Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import {Advertisement} from "../../Protos/api_pb";
import {data, IStrings} from "../../localization/DealPage/DealConditions"
import {useStrings} from "../../Hooks";

export interface DealConditionsProps {
    ad: Advertisement.AsObject;
}
//d-md-none
export const DealConditions = (props: DealConditionsProps) => {
    const strings: IStrings=useStrings(data);
    return (
        <React.Fragment>
            <Card className="my-3">
                <CardBody>
                    <CardTitle>
                        <h5>{strings.dealConditions}</h5>
                    </CardTitle>
                    {props.ad.message.split("\n").map((t, i) => {
                        if (t === "") {
                            return (
                                <br key={i}/>
                            );
                        }
                        return (
                            <span style={{display: "block"}} className="m-0 font-italic"
                                  key={i}>{t}</span>
                        );
                    })}
                </CardBody>
            </Card>
            <div className="text-center w-100 d-md-none my-3">
                <p className="text-primary">{strings.report}</p>
            </div>
        </React.Fragment>
    );
};
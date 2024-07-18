import * as React from "react";
import {useCallback, useState} from "react";
import {Button, Col, ListGroup, ListGroupItem, Row} from "reactstrap";
import {useMappedState} from "redux-react-hook";
import {IStore} from "../redux/store/Interfaces";
import {Balance} from "../Protos/api_pb";
import {MyDecimal} from "../MyDecimal";
import {Loading} from "../Loading";
import {Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Wallet/BalanceComponent"
import {useStrings} from "../Hooks";

export function BalanceComponent() {
    const mapState = useCallback(
        (store: IStore) => ({
            balances: store.balances,
            authState: store.auth.state,
            catalog: store.catalog
        }), []
    );
    const {balances} = useMappedState(mapState);
    const strings: IStrings=useStrings(data);

    const [redirect, setRedirect] = useState("");


    function DoRedirect(curr: string, isGet: boolean) {
        let prefix = "/";
        if (isGet)
            prefix += "receive";
        else
            prefix += "send";
        switch (curr) {
            case "BTC":
                setRedirect(prefix + "Bitcoins");
        }
    }

    function BalalanceRow(balance: Balance.AsObject) {
        let b = {
            currency: "BTC",
            confirmed: MyDecimal.FromPb(balance.confirmed),
            unConfirmed: MyDecimal.FromPb(balance.unconfirmed),
            deposited: MyDecimal.FromPb(balance.deposited)
        };
        return (
            <ListGroupItem tag="a" action className="py-1" key={b.currency}>
                <Row>
                    <Col className="my-auto font-weight-bold">{b.currency}</Col>
                    <Col className="my-auto">
                        {b.confirmed.toString()}
                    </Col>
                    <Col className="my-auto">
                        {b.unConfirmed.toString()}
                    </Col>
                    <Col className="my-auto">
                        {b.deposited.toString()}
                    </Col>
                    <Col className="col-auto">
                        <Button color="success" outline
                                onClick={() => DoRedirect(b.currency, false)}>
                            {strings.Send}
                        </Button>
                        <Button className="ml-1" color="primary" outline
                                onClick={() => DoRedirect(b.currency, true)}>
                            {strings.Receive}
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (balances.Balance==null) {
        return <Loading/>;
    }

    return (
        <Row>
            <Col>
                <ListGroup>
                    <ListGroupItem color="info" className="rounded-0 pb-0 font-weight-bold" key="header">
                        <Row>
                            <Col>{strings.Currency}</Col>
                            <Col>{strings.Confirmed}</Col>
                            <Col>{strings.NotConfirmed}</Col>
                            <Col>{strings.Deposited}</Col>
                            <Col className="col-auto invisible">
                                <Button color="success" outline>
                                    {strings.Send}
                                </Button>
                                <Button className="ml-1 invisible" color="primary" outline>
                                    {strings.Receive}
                                </Button>
                            </Col>
                        </Row>
                    </ListGroupItem>
                    {BalalanceRow(balances.Balance)}
                </ListGroup>
            </Col>
        </Row>
    );
}
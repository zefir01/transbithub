import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Button, Col, Row, Table} from "reactstrap";
import {Deal, DealStatus} from "../Protos/api_pb";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDeals} from "../Profile/Hooks";
import {pageSize} from "../global";
import {DealRow} from "./DealRow";
import {Redirect} from "react-router-dom";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Dashboard/DealsTable"
import {useStrings} from "../Hooks";

interface IDealsTableProps {
    status: DealStatus
}

export function DealsTable(props: IDealsTableProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            deals: store.deals,
            preload: store.preload
        }), []
    );
    const {profile, authState, deals, preload} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [selectedDeals, setSelectedDeals] = useState<Deal.AsObject[]>([]);
    const [page, setPage] = useState(1);
    const [haveMoreDeals, setHaveMoreDeals] = useState(false);
    const [redirect, setRedirect] = useState("");

    function isPreloading() {
        switch (props.status) {
            case DealStatus.OPENED:
                return !preload.openedDeals;
            case DealStatus.COMPLETED:
                return !preload.completedDeals;
            case DealStatus.CANCELED:
                return !preload.canceledDeals;
            case DealStatus.DISPUTED:
                return !preload.disputedDeals;
            case DealStatus.WAITDEPOSIT:
                return !preload.openedDeals;
        }
    }

    useDeals(isPreloading(), page, props.status, () => {
    }, (e) => setError(e));

    useEffect(() => {
        if (authState === AuthState.NotAuthed) {
            return;
        }

        async function f() {
            let suitable: Deal.AsObject[];
            if (props.status === DealStatus.OPENED) {
                suitable = deals.deals.filter(p => p.status === DealStatus.OPENED || p.status === DealStatus.WAITDEPOSIT).sort((a, b) => b.id - a.id);
            }
            else {
                suitable = deals.deals.filter(p => p.status === props.status).sort((a, b) => b.id - a.id);
            }
            let d = suitable.slice(0, (pageSize * page));
            setSelectedDeals(d);
            setHaveMoreDeals(suitable.length > d.length);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, deals, page, props.status]);

    if (redirect !== "")
        return <Redirect push to={redirect}/>;
    if (isPreloading())
        return <Loading/>;

    return (
        <>
            <Row>
                <Table hover>
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{strings.createdAt}</th>
                        <th scope="col">{strings.dealType}</th>
                        <th scope="col">{strings.partner}</th>
                        <th scope="col">{strings.fiatCurrency}</th>
                        <th scope="col">{strings.cryptoCurrency}</th>
                        <th scope="col">{strings.price}</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        selectedDeals.map(p => DealRow({
                            deal: p,
                            onClick: (id) => {
                                setRedirect("/deal/" + id.toString())
                            },
                            partner: p.adownerinfo!.id === profile.UserId ? p.initiator! : p.adownerinfo!,
                            isNew: deals.newDeals.includes(p.id),
                            isChanged: deals.newStatusDeals.includes(p.id),
                            isNewMessage: deals.newMessageDeals.includes(p.id),
                            strings
                        }))
                    }
                    </tbody>
                </Table>
            </Row>
            {error !== "" ?
                <Row>
                    <Col>
                        <Alert color="danger">{error}</Alert>
                    </Col>
                </Row>
                : null
            }
            <Row>
                <Col>
                    <Button outline className="mx-auto d-block"
                            disabled={!haveMoreDeals}
                            onClick={() => setPage(page + 1)}>
                        {strings.btn}
                    </Button>
                </Col>
            </Row>
        </>
    );
}
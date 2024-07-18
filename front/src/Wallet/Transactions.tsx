import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {GetTransactionsRequest, GetTransactionsResponse, Transaction} from "../Protos/api_pb";
import {MyDecimal} from "../MyDecimal";
import {Loading} from "../Loading";
import {pageSize} from "../global";
import {getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {CryptoCurrenciesCatalog} from "../Catalog";
import {data, IStrings} from "../localization/Wallet/Transactions"
import {useStrings} from "../Hooks";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";


export function Transactions() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);
    const [getTransactionsRunning, setGetTransactionsRunning] = useState(false);
    const [transactions, setTransactions] = useState<Array<Transaction.AsObject> | null>(null);
    const [currency, setCurrency] = useState("BTC");
    const [isInput, setIsInput] = useState(true);
    const [find, setFind] = useState(false);
    const [, setError] = useState("");
    const [page, setPage] = useState(1);
    const [changePage, setChangePage] = useState(false);

    useEffect(() => {
        if (authState !== AuthState.Authed || getTransactionsRunning || (transactions !== null && !find && !changePage)) {
            return;
        }
        setGetTransactionsRunning(true);
        setFind(false);
        setChangePage(false);

        async function f() {
            let req = new GetTransactionsRequest();
            req.setCount(pageSize);
            req.setIsinput(isInput);
            if (transactions === null || transactions.length === 0 || find) {
                req.setLastid(0);
            } else {
                let min = Math.min.apply(Math, transactions.map(p => p.id));
                req.setLastid(min);
            }

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<GetTransactionsResponse.AsObject>(tradeApiClient.getTransactions, req, token);
                if (!changePage && (transactions == null || transactions.length)) {
                    setTransactions(resp.transactionsList);
                } else {
                    let arr = transactions!.concat(resp.transactionsList);
                    setTransactions(arr);
                }

            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setGetTransactionsRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, transactions, find, changePage, getTransactionsRunning, isInput]);

    function Item(transaction: Transaction.AsObject) {
        return (
            <ListGroupItem tag="a" action className="py-1" key={transaction.id}>
                <Row>
                    <Col>
                        <div className="text-muted small">
                            {"ID: " + transaction.txid}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="my-auto">
                        {MyDecimal.FromPb(transaction.amount).toString()}
                    </Col>
                    <Col className="my-auto">
                        {transaction.confirmations}/3
                    </Col>
                    <Col className="my-auto">
                        {toDate(transaction.time).toLocaleString()}
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }

    if (transactions === null) {
        return <Loading/>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <InputGroup>
                                <Input type="select"
                                       value={currency}
                                       onChange={event => setCurrency(event.currentTarget.value)}>
                                    {
                                        CryptoCurrenciesCatalog.map(val => {
                                            return (
                                                <option key={val} value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </Input>
                                <Input type="select" value={isInput ? "Input" : "Output"}
                                       onChange={event => setIsInput(event.currentTarget.value === "Input")}>
                                    <option value="Input">{strings.Input}</option>
                                    <option value="Output">{strings.Output}</option>
                                </Input>
                                <InputGroupAddon addonType="append">
                                    <LoadingBtn loading={getTransactionsRunning} color="warning" onClick={() => setFind(true)}>
                                        {strings.Find}
                                    </LoadingBtn>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                </CardHeader>

                <Row>
                    <Col>
                        <ListGroup>
                            <ListGroupItem color="info" className="rounded-0 pb-0 font-weight-bold">
                                <Row>
                                    <Col>{strings.Amount}</Col>
                                    <Col>{strings.Confirmations}</Col>
                                    <Col>{strings.Time}</Col>
                                </Row>
                            </ListGroupItem>
                            {transactions.map(p => Item(p))}
                        </ListGroup>
                    </Col>
                </Row>
                {transactions.length === page * pageSize ?
                    <Row>
                        <Col>
                            <Button color="secondary" outline className="btn-block"
                                    onClick={() => {
                                        setPage(page + 1);
                                        setChangePage(true);
                                    }}>
                                {strings.more}
                            </Button>
                        </Col>
                    </Row>
                    : null
                }
            </Card>
        </>
    );
}
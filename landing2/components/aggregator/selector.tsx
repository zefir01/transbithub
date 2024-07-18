import React, {useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Card, CardContent, Grid, makeStyles, TextField, Theme} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "./AggregatorCatalog";
import {DecimalInput} from "../DecimalInput";
import {useSelectorParams} from "./helpers";
import Link from "next/link";

export interface SelectorProps {
    paymentTypes: {
        value: string;
        label: string;
    }[],
    currencies: string[],
    cryptoCurrencies: string[],
    sources: string[],
}

interface Option {
    value: string;
    label: string;
}

export function Selector(props: SelectorProps) {
    const findButtonCb = makeStyles((theme: Theme) => (
        {
            root: {
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#FFAB09",
                color: 'white',
                '&:hover': {
                    color: "white",
                    backgroundColor: "#FFAB09",
                },
                [theme.breakpoints.up('xs')]: {
                    borderRadius: 70,
                    height: "40px",
                    width: "150px",
                    fontSize: "20px",
                },
                [theme.breakpoints.up('sm')]: {
                    borderRadius: 70,
                    height: "50px",
                    width: "180px",
                    fontSize: "25px",
                },
                [theme.breakpoints.up('md')]: {
                    borderRadius: 70,
                    height: "50px",
                    width: "180px",
                    fontSize: "25px",
                },
                [theme.breakpoints.up('lg')]: {
                    borderRadius: 70,
                    height: "50px",
                    width: "180px",
                    fontSize: "25px",
                },
                [theme.breakpoints.up('xl')]: {
                    borderRadius: 70,
                    height: "50px",
                    width: "180px",
                    fontSize: "25px",
                },
            }
        }
    ));
    const findButton = findButtonCb();
    const params = useSelectorParams();
    const [isBuy, setIsBuy] = useState(true);
    const [sources, setSources] = useState<string[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
    const [fiatCurrency, setFiatCurrency] = useState<Currencies | null>(null);
    const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrencies | null>(null);
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        if (!params) {
            return;
        }
        setIsBuy(params.isBuy);
        setSources(params.sources.map(p => AggregatorSources[p]));
        setPaymentTypes(params.paymentTypes.map(p => PaymentTypes[p]));
        setFiatCurrency(params.fiatCurrency);
        setCryptoCurrency(params.cryptoCurrency);
        setAmount(params.amount);
    }, [params]);

    function getPaymentTypeOption() {
        return props.paymentTypes.filter(p => paymentTypes.includes(p.value));
    }

    function isO(pet: any): pet is Option {
        return true;
    }

    function getRequest() {
        return {
            isBuy,
            currency: fiatCurrency === null ? undefined : Currencies[fiatCurrency],
            cryptoCurrency: cryptoCurrency === null ? undefined : CryptoCurrencies[cryptoCurrency],
            page: params.page.toString(),
            sources: sources.map(p => AggregatorSources[p]),
            paymentTypes: paymentTypes.map(p => PaymentTypes[p]),
            amount: !amount || amount === "" ? undefined : amount
        }
    }

    if (!params) {
        return null;
    }

    return (
        <Box boxShadow={3} className={"w-100"}>
            <Card>
                <CardContent>
                    <Grid container direction="column" spacing={3}>
                        <Grid item container justify={"center"}>
                            <h4>
                                Поиск объявлений
                            </h4>
                        </Grid>
                        <Grid item container justify={"center"}>
                            <ButtonGroup>
                                <Button variant={isBuy ? "contained" : undefined}
                                        color={isBuy ? "primary" : undefined}
                                        onClick={() => setIsBuy(true)}
                                >
                                    Купить
                                </Button>
                                <Button variant={!isBuy ? "contained" : undefined}
                                        color={!isBuy ? "primary" : undefined}
                                        onClick={() => setIsBuy(false)}
                                >
                                    Продать
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item>
                            <Autocomplete autoComplete={false}
                                          value={sources}
                                          multiple
                                          options={props.sources}
                                          getOptionLabel={(option) => option}
                                          renderInput={(params) => <TextField
                                              {...params}
                                              inputProps={{...params.inputProps}}
                                              label={"Выберите биржу"}
                                          />}
                                          onChange={(event, values) => {
                                              setSources(values);
                                          }}
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete autoComplete={false}
                                          multiple
                                          value={getPaymentTypeOption()}
                                          options={props.paymentTypes}
                                          getOptionLabel={(option) => option.label}
                                          renderInput={(params) => <TextField
                                              {...params}
                                              inputProps={{...params.inputProps}}
                                              label={"Выберите платежную систему"}
                                          />}
                                          onChange={(event, values) => {
                                              setPaymentTypes(values.map(p => {
                                                  if (isO(p)) {
                                                      return p.value;
                                                  }
                                                  return undefined;
                                              }));
                                          }}
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete autoComplete={false}
                                          value={Currencies[fiatCurrency]}
                                          options={props.currencies}
                                          getOptionLabel={(option) => option}
                                          renderInput={(params) => <TextField
                                              {...params}
                                              inputProps={{...params.inputProps}}
                                              label={"Выберите валюту"}
                                          />}
                                          onChange={(event, values) => {
                                              setFiatCurrency(Currencies[values]);
                                          }}
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete autoComplete={false}
                                          value={CryptoCurrencies[cryptoCurrency]}
                                          options={props.cryptoCurrencies}
                                          getOptionLabel={(option) => option}
                                          renderInput={(params) => <TextField
                                              {...params}
                                              inputProps={{...params.inputProps}}
                                              label={"Выберите криптовалюту"}
                                          />}
                                          onChange={(event, values) => {
                                              setCryptoCurrency(CryptoCurrencies[values]);
                                          }}
                            />
                        </Grid>
                        <Grid item>
                            <DecimalInput defaultValue={amount} onChange={(value, error) => {
                                setAmount(value);
                                setAmountError(error);
                            }
                            }/>
                        </Grid>
                        <Grid item container justify={"center"}>
                            <Link passHref href={{
                                pathname: "/aggregator/find",
                                query: getRequest(),
                            }}
                            >
                                <Button size="large" variant="contained" className={findButton.root}
                                        disabled={amountError}
                                        href="">
                                    Поиск
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );

}
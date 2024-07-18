import {Box, Button, ButtonGroup, Card, CardContent, Grid, makeStyles, TextField, Theme} from "@material-ui/core";
import Link from "next/link";
import React, {useState} from "react";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "../AggregatorCatalog";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SelectorData} from "../helpers";
import {DecimalInput} from "../../DecimalInput";

export interface SelectorProps {
    data: SelectorData;
}

interface Option {
    value: string;
    label: string;
}

export function Selector(props: SelectorProps) {
    const [isBuy, setIsBuy] = useState(true);
    const [sources, setSources] = useState<string[]>([]);
    const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
    const [fiatCurrency, setFiatCurrency] = useState<Currencies | null>(null);
    const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrencies | null>(null);
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    const btnStyleCb = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    textTransform: "none",
                    [theme.breakpoints.up('xs')]: {
                        borderRadius: 4,
                        fontSize: "14px",
                        height: "40px",
                        width: "127px",
                        marginRight: "8px",
                        marginBottom: "50px"
                    },
                    [theme.breakpoints.up('sm')]: {
                        borderRadius: 4,
                        fontSize: "18px",
                        height: "50px",
                        width: "160px",
                        marginRight: "7px",
                        marginBottom: "50px"
                    },
                    [theme.breakpoints.up('md')]: {
                        borderRadius: 4,
                        fontSize: "18px",
                        height: "50px",
                        width: "160px",
                        marginRight: "7px",
                        marginBottom: "50px"
                    },
                    [theme.breakpoints.up('lg')]: {
                        borderRadius: 4,
                        fontSize: "20px",
                        height: "60px",
                        width: "200px",
                        marginRight: "7px",
                        marginBottom: "50px"
                    },
                    [theme.breakpoints.up('xl')]: {
                        borderRadius: 4,
                        fontSize: "20px",
                        height: "60px",
                        width: "200px",
                        marginRight: "7px",
                        marginBottom: "50px"
                    },
                }
            }
        )
    );
    const btnStyle = btnStyleCb();

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
                    height: "70px",
                    width: "260px",
                    fontSize: "30px",
                },
            }
        }
    ));
    const findButton = findButtonCb();

    const findGridCb = makeStyles((theme: Theme) => (
        {
            container: {
                alignContent: "flex-center",
                [theme.breakpoints.up('xs')]: {
                    justifyContent: "center"
                },
                [theme.breakpoints.up('sm')]: {
                    justifyContent: "center"
                },
                [theme.breakpoints.up('md')]: {
                    justifyContent: "center"
                },
                [theme.breakpoints.up('lg')]: {
                    justifyContent: "start"
                },
                [theme.breakpoints.up('xl')]: {
                    justifyContent: "start"
                },
            }
        }
    ));
    const findGrid = findGridCb();


    function getPaymentTypeOption() {
        return props.data.paymentTypes.filter(p => paymentTypes.includes(p.value));
    }

    function isO(pet: any): pet is Option {
        return true;
    }

    function getRequest() {
        return {
            isBuy,
            currency: fiatCurrency === null ? undefined : Currencies[fiatCurrency],
            cryptoCurrency: cryptoCurrency === null ? undefined : CryptoCurrencies[cryptoCurrency],
            page: 1,
            sources: sources.map(p => AggregatorSources[p]),
            paymentTypes: paymentTypes.map(p => PaymentTypes[p]),
            amount: !amount || amount === "" ? undefined : amount
        }
    }


    return (
        <Card>
            <CardContent>
                <Grid container direction="row">
                    <Grid item>
                        <Box mb={3}>
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
                        </Box>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete autoComplete={false}
                                      value={sources.map(p => AggregatorSources[p])}
                                      multiple
                                      options={props.data.sources}
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
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete autoComplete={false}
                                      multiple
                                      value={getPaymentTypeOption()}
                                      options={props.data.paymentTypes}
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
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete autoComplete={false}
                                      value={Currencies[fiatCurrency]}
                                      options={props.data.currencies}
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
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete autoComplete={false}
                                      value={CryptoCurrencies[cryptoCurrency]}
                                      options={props.data.cryptoCurrencies}
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
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <DecimalInput defaultValue={amount} onChange={(value, error) => {
                            setAmount(value);
                            setAmountError(error);
                        }
                        }/>
                    </Grid>
                    <Grid container item className={findGrid.container} xl={4} lg={4} md={4} sm={12} xs={12}>
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
    )
}
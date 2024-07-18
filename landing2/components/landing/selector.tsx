import {
    Button,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import {PaymentTypeSelect} from "./PaymentTypeSelect";
import {CurrencySelect} from "./CurrencySelect";
import {CountrySelect} from "./CountrySelect";
import {useEffect, useState} from "react";
import {CurrenciesCatalog} from "../Catalog";
import {PaymentTypes} from "./PaymentTypes";
import Link from "next/link";

export function Selector() {
    const [country, setCountry] = useState("RU");
    const [paymentType, setPaymentType] = useState("SBERBANK");
    const [currency, setCurrency] = useState("RUB");
    const [paymentTypes, _] = useState(new PaymentTypes())
    const [isBuy, setIdBuy] = useState(true);


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


    const testCb = makeStyles((theme: Theme) => (
        {
            root: {
                [theme.breakpoints.up('xs')]: {
                    fontSize: "20px",
                },
                [theme.breakpoints.up('sm')]: {
                    fontSize: "25px",
                },
                [theme.breakpoints.up('md')]: {
                    fontSize: "25px",
                },
                [theme.breakpoints.up('lg')]: {
                    fontSize: "25px",
                },
                [theme.breakpoints.up('xl')]: {
                    fontSize: "30px",
                },
            }
        }
    ));
    const test = testCb();

    useEffect(() => {
        let cur = CurrenciesCatalog.get(country);
        setCurrency(cur);
        let pt = paymentTypes.get(country)[0];
        setPaymentType(pt);
    }, [country]);

    function getIsBuyStyle(isBuyBtn: boolean) {
        if (isBuyBtn !== isBuy) {
            return {backgroundColor: "#EEEEEE"};
        }
        return undefined;
    }


    return (
        <>
            <Grid container direction="row">
                <Grid item>
                    <Button className={btnStyle.root} size="large" variant="contained"
                            style={getIsBuyStyle(true)}
                            color={isBuy ? "primary" : undefined}
                            onClick={() => setIdBuy(true)}
                    >
                        Покупка
                    </Button>
                </Grid>
                <Grid item>
                    <Button className={btnStyle.root} size="large" variant="contained"
                            onClick={() => setIdBuy(false)}
                            style={getIsBuyStyle(false)}
                            color={!isBuy ? "primary" : undefined}>
                        Продажа
                    </Button>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <CountrySelect className={test.root} defaultValue={"RU"}
                                   onChange={countryCode => {
                                       setCountry(countryCode);
                                   }}
                    />
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <CurrencySelect value={currency} onChange={value => setCurrency(value)} className={test.root}/>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <PaymentTypeSelect value={paymentType} onChange={value => setPaymentType(value)}
                                       className={test.root}
                                       country={country}/>
                </Grid>
                <Grid container item xl={3} lg={3} md={6} sm={6} xs={12} className={findGrid.container}>
                    <Link href={`/app/find/${isBuy ? "buy" : "sell"}/${country}/${currency}/${paymentType}/`} passHref prefetch={true}>
                        <Button size="large" variant="contained" className={findButton.root}
                                href=""
                                disabled={country === "" || currency === "" || paymentType === ""}>
                            Поиск
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </>
    );
}
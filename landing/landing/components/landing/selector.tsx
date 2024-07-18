import {
    Button,
    ButtonGroup,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Theme,
    Typography, withStyles
} from "@material-ui/core";

export function Selector() {

    const headersStyleCb = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    fontWeight: "bold",
                    [theme.breakpoints.up('xs')]: {
                        fontSize: "16px"
                    },
                    [theme.breakpoints.up('sm')]: {
                        fontSize: "20px"
                    },
                    [theme.breakpoints.up('md')]: {
                        fontSize: "20px"
                    },
                    [theme.breakpoints.up('lg')]: {
                        fontSize: "20px"
                    },
                    [theme.breakpoints.up('xl')]: {
                        fontSize: "25px"
                    },
                }
            }
        )
    );
    const headersStyle = headersStyleCb();

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

    return (
        <Grid container spacing={8}>
            <Grid container direction="row">
                <Grid item>
                    <Button className={btnStyle.root} size="large" variant="contained" color="primary">
                        Покупка
                    </Button>
                </Grid>
                <Grid item>
                    <Button className={btnStyle.root} size="large" variant="contained"
                            style={{backgroundColor: "#EEEEEE"}}>
                        Продажа
                    </Button>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Typography className={headersStyle.root}>
                        что отдаем
                    </Typography>
                    <Select
                        value={"age"}
                        style={{width: "100%"}}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Typography className={headersStyle.root}>
                        что получаем
                    </Typography>
                    <Select
                        value={"age"}
                        className="w-100"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Typography className={headersStyle.root}>
                        способ перевода
                    </Typography>
                    <Select
                        value={"age"}
                        className="w-100"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                    <Select
                        value={"age"}
                        className="w-100"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Grid>
            </Grid>
        </Grid>
    );
}
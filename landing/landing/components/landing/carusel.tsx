import Carousel from "react-material-ui-carousel";
import {
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    makeStyles,
    Paper,
    Theme,
    useMediaQuery
} from "@material-ui/core";
import Link from "next/link";
import MuiLink from "@material-ui/core/Link";
import React, {useEffect, useState} from "react";
import {useTheme} from '@material-ui/core/styles';


enum Breakepoints {
    XL,
    LG,
    MD,
    SM,
    XS,
    Undefined
}


function getMedia(): Breakepoints {
    const theme = useTheme();
    const matchXl = useMediaQuery(theme.breakpoints.only("xl"));
    const matchLg = useMediaQuery(theme.breakpoints.only("lg"));
    const matchMd = useMediaQuery(theme.breakpoints.only("md"));
    const matchSm = useMediaQuery(theme.breakpoints.only("sm"));
    const matchXs = useMediaQuery(theme.breakpoints.only("xs"));
    if (matchXl) {
        return Breakepoints.XL;
    } else if (matchLg) {
        return Breakepoints.LG;
    } else if (matchMd) {
        return Breakepoints.MD;
    } else if (matchSm) {
        return Breakepoints.SM;
    } else if (matchXs) {
        return Breakepoints.XS;
    }
    return Breakepoints.Undefined;
}

export default function Carusel() {
    const [media, setMedia] = useState<Breakepoints>(Breakepoints.Undefined);
    const [image1Loaded, setImage1Loaded] = useState(false);
    const [image2Loaded, setImage2Loaded] = useState(false);
    const [image3Loaded, setImage3Loaded] = useState(false);

    const enterBtnStyleCB = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    top: 0,
                    left: 0,
                    position: "absolute",
                    textTransform: "none",
                    [theme.breakpoints.up('xs')]: {
                        borderRadius: 50,
                        fontSize: "20px",
                        height: "35px",
                        width: "120px",
                        marginLeft: "13px",
                        marginTop: "321px"
                    },
                    [theme.breakpoints.up('sm')]: {
                        borderRadius: 50,
                        fontSize: "32px",
                        height: "44.57px",
                        width: "150px",
                        marginLeft: "44px",
                        marginTop: "403px"
                    },
                    [theme.breakpoints.up('md')]: {
                        borderRadius: 50,
                        fontSize: "32px",
                        height: "44.57px",
                        width: "150px",
                        marginLeft: "60px",
                        marginTop: "430px"
                    },
                    [theme.breakpoints.up('lg')]: {
                        borderRadius: 50,
                        fontSize: "50px",
                        height: "74.29px",
                        width: "250px",
                        marginLeft: "42px",
                        marginTop: "563px"
                    },
                    [theme.breakpoints.up('xl')]: {
                        borderRadius: 50,
                        fontSize: "50px",
                        height: "100px",
                        width: "350px",
                        marginLeft: "211px",
                        marginTop: "639px"
                    },
                }
            }
        )
    );
    const infoLinkStyleCB = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    top: 0,
                    left: 0,
                    position: "absolute",
                    textTransform: "none",
                    textDecorationLine: "underline",
                    color: "#979797",
                    textDecorationColor: "#979797",
                    '&:hover': {
                        textDecorationColor: "#2979F2",
                        color: "#2979F2",
                    },
                    [theme.breakpoints.up('xs')]: {
                        fontSize: "14px",
                        marginLeft: "33px",
                        paddingTop: "370px"
                    },
                    [theme.breakpoints.up('sm')]: {
                        fontSize: "20px",
                        marginLeft: "211px",
                        paddingTop: "409px"
                    },
                    [theme.breakpoints.up('md')]: {
                        fontSize: "20px",
                        marginLeft: "227px",
                        paddingTop: "436px"
                    },
                    [theme.breakpoints.up('lg')]: {
                        fontSize: "25px",
                        marginLeft: "320px",
                        paddingTop: "581px"
                    },
                    [theme.breakpoints.up('xl')]: {
                        fontSize: "25px",
                        marginLeft: "595px",
                        paddingTop: "675px"
                    },
                }
            }
        )
    );

    const img1StyleCB = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    [theme.breakpoints.up('xs')]: {
                        content: 'url("/img/carousel1_320.png")'
                    },
                    [theme.breakpoints.up('sm')]: {
                        content: 'url("/img/carousel1_768.png")'
                    },
                    [theme.breakpoints.up('md')]: {
                        content: 'url("/img/carousel1_922.png")'
                    },
                    [theme.breakpoints.up('lg')]: {
                        content: 'url("/img/carousel1_1200.png")'
                    },
                    [theme.breakpoints.up('xl')]: {
                        content: 'url("/img/carousel1_1920.png")'
                    },
                }
            }
        )
    );
    const img2StyleCB = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    [theme.breakpoints.up('xs')]: {
                        content: 'url("/img/carousel2_320.png")'
                    },
                    [theme.breakpoints.up('sm')]: {
                        content: 'url("/img/carousel2_768.png")'
                    },
                    [theme.breakpoints.up('md')]: {
                        content: 'url("/img/carousel2_922.png")'
                    },
                    [theme.breakpoints.up('lg')]: {
                        content: 'url("/img/carousel2_1200.png")'
                    },
                    [theme.breakpoints.up('xl')]: {
                        content: 'url("/img/carousel2_1920.png")'
                    },
                }
            }
        )
    );
    const img3StyleCB = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    [theme.breakpoints.up('xs')]: {
                        content: 'url("/img/carousel3_320.png")'
                    },
                    [theme.breakpoints.up('sm')]: {
                        content: 'url("/img/carousel3_768.png")'
                    },
                    [theme.breakpoints.up('md')]: {
                        content: 'url("/img/carousel3_922.png")'
                    },
                    [theme.breakpoints.up('lg')]: {
                        content: 'url("/img/carousel3_1200.png")'
                    },
                    [theme.breakpoints.up('xl')]: {
                        content: 'url("/img/carousel3_1920.png")'
                    },
                }
            }
        )
    );

    const enterBtnStyle = enterBtnStyleCB();
    const infoLinkStyle = infoLinkStyleCB();
    const img1Style = img1StyleCB();
    const img2Style = img2StyleCB();
    const img3Style = img3StyleCB();


    function Btns(props: {infoLink: string}) {
        return (
            <>
                <Button href="/app" className={enterBtnStyle.root} size="large" variant="contained" color="primary">
                    Вход
                </Button>
                <Link href={props.infoLink === "" ? "/" : props.infoLink} passHref prefetch={true}>
                    <MuiLink className={infoLinkStyle.root}>
                        Подробнее
                    </MuiLink>
                </Link>
            </>
        )
    }


    const mediaQ = getMedia();
    useEffect(() => {
        if (mediaQ !== media) {
            setMedia(mediaQ);
            setImage1Loaded(false);
            setImage2Loaded(false);
            setImage3Loaded(false);
        }
    }, [mediaQ, media])


    if (media === Breakepoints.Undefined) {
        return <CircularProgress/>
    }

    if (!image1Loaded || !image2Loaded || !image3Loaded) {
        let src1: string;
        let src2: string;
        let src3: string;
        let counter = 0;

        switch (media) {
            case Breakepoints.XL:
                src1 = "/img/carousel1_1920.png";
                src2 = "/img/carousel2_1920.png";
                src3 = "/img/carousel3_1920.png";
                break;
            case Breakepoints.LG:
                src1 = "/img/carousel1_1200.png";
                src2 = "/img/carousel2_1200.png";
                src3 = "/img/carousel3_1200.png";
                break;
            case Breakepoints.MD:
                src1 = "/img/carousel1_922.png";
                src2 = "/img/carousel2_922.png";
                src3 = "/img/carousel3_922.png";
                break;
            case Breakepoints.SM:
                src1 = "/img/carousel1_768.png";
                src2 = "/img/carousel2_768.png";
                src3 = "/img/carousel3_768.png";
                break;
            case Breakepoints.XS:
                src1 = "/img/carousel1_320.png";
                src2 = "/img/carousel2_320.png";
                src3 = "/img/carousel3_320.png";
                break;

        }
        if (image1Loaded) {
            counter += 1;
        }
        if (image2Loaded) {
            counter += 1;
        }
        if (image3Loaded) {
            counter += 1;
        }

        return (
            <>
                <Box alignSelf="center">
                    <CircularProgress value={counter * 33}/>
                </Box>
                <Box display="none">
                    <img src={src1} onLoad={() => setImage1Loaded(true)} alt="Для трейдеров"/>
                    <img src={src2} onLoad={() => setImage2Loaded(true)} alt="Для покупателей"/>
                    <img src={src3} onLoad={() => setImage3Loaded(true)} alt="Продавцам"/>
                </Box>
            </>
        )
    }

    return (
        <>

            <Carousel autoPlay>
                <Paper style={{background: "white"}}>
                    <Card style={{background: "white"}}>
                        <div style={{position: 'relative'}}>
                            <CardMedia>
                                <img className={img1Style.root} alt="Для трейдеров"/>
                            </CardMedia>
                            <Btns infoLink=""/>
                        </div>
                    </Card>
                </Paper>
                <Paper style={{background: "white"}}>
                    <Card style={{background: "white"}}>
                        <div style={{position: 'relative'}}>
                            <CardMedia>
                                <img className={img2Style.root} alt="Для покупателей"/>
                            </CardMedia>
                            <Btns infoLink=""/>
                        </div>
                    </Card>
                </Paper>

                <Paper style={{background: "white"}}>
                    <Card style={{background: "white"}}>
                        <div style={{position: 'relative'}}>
                            <CardMedia>
                                <img className={img3Style.root} alt="Продавцам"/>
                            </CardMedia>
                            <Btns infoLink=""/>
                        </div>
                    </Card>
                </Paper>
            </Carousel>
        </>
    )
}
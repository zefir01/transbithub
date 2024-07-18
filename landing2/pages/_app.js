// noinspection JSUnusedGlobalSymbols

import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import './index.css'
import '@fontsource/roboto'
import {StylesProvider} from '@material-ui/core';
import {Header} from "../components/header";
import {Footer} from "../components/footer";
import {Container} from "@material-ui/core";
import {YMInitializer} from "react-yandex-metrika";
import App from "next/app";
import Head from 'next/head';


export default function MyApp(props) {
    const {Component, pageProps, store} = props;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    if(props.disableHeader){
        return (
            <Container maxWidth="xl">
                <Component {...pageProps} />
            </Container>
        );
    }

    return (
        <React.Fragment>
            <Head>
                <link rel="prerender" href="/app"/>
            </Head>
            <StylesProvider>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline/>
                    {process.env.NEXT_PUBLIC_YM_ID ?
                        <YMInitializer accounts={[process.env.NEXT_PUBLIC_YM_ID]} options={{webvisor: true}}
                                       version="2"/>
                        : null
                    }
                    <Header/>
                    <Container maxWidth="xl">
                        <Component {...pageProps} />
                    </Container>
                    <Footer/>
                </ThemeProvider>
            </StylesProvider>
        </React.Fragment>
    );
}


MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);

    return {
        ...appProps,
        disableHeader: appContext.ctx.pathname.endsWith("test")
    };
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

export const site = GetSite();
export const bot = GetBot();
export const onionSite = GetOnion();
export const tokenEndpoint = GetStsServer() + "/connect/token";
export const revocEndpoint = GetStsServer() + "/connect/revocation";
export const grpcEndpoint = GetGrpcServer();
export const authClientId = "front";
export const authClientSecret = "Urooyu7IeDeikais";
export const authScopes = "trade profile_security openid offline_access";
export const pageSize = 30;
export const DisputeHours = 24;
export const defaultRateVar = "bittrex_usd";
export const invoiceFeePercent = "1";
export const satoshi = 0.00000001;
export const minimalAmountBtc = satoshi * 100;
export const autoPriceFee = satoshi;
export const promiseFee = 0.001;
export const MB10 = 10485760;
export const BitcoinNetwork = GetBitcoinNet();
export const bugsMail = "bugs";
export const supportMail = "support";
export const streamsKeepAliveTimeout = 20000;
export const adLnTimeoutSec = 600;

function GetBitcoinNet(): string {
    if (process.env.REACT_APP_BITCOIN_NET === undefined) {
        return "testnet";
    }
    return process.env.REACT_APP_BITCOIN_NET;
}

function GetStsServer(): string {
    if (window.location.hostname.endsWith("onion")) {
        // noinspection HttpUrlsUsage
        return `http://${onionSite}`;
    }
    return `https://${process.env.REACT_APP_SITE}`;
}

function GetGrpcServer(): string {
    if (window.location.hostname.endsWith("onion")) {
        // noinspection HttpUrlsUsage
        return `http://${onionSite}`;
    }
    return `https://${process.env.REACT_APP_SITE}`;
}

function GetSite(): string {
    if (process.env.REACT_APP_SITE === undefined) {
        return "http://localhost";
    }
    return process.env.REACT_APP_SITE;
}

function GetBot(): string {
    if (process.env.REACT_APP_BOT === undefined) {
        return "http://localhost";
    }
    return process.env.REACT_APP_BOT;
}

function GetOnion(): string {
    if (process.env.REACT_APP_ONION_SITE === undefined) {
        return "http://localhost";
    }
    return process.env.REACT_APP_ONION_SITE;
}


declare global {
    interface Window {
        captchaOnLoad: () => void;
        authTimer?: NodeJS.Timeout;
        imageTimer?: NodeJS.Timeout;
        accessToken?: string;
        refreshToken?: string;
        anonRefreshToken?: string;
    }
}

export const Col6_12 = {
    sm: 12,
    md: 12,
    lg: 6,
    xl: 6
};
export const Col4_12 = {
    sm: 12,
    md: 12,
    lg: 4,
    xl: 4
};

export const Col2 = {
    sm: 2,
    md: 2,
    lg: 2,
    xl: 2
};

export const Col3 = {
    sm: 3,
    md: 3,
    lg: 3,
    xl: 3
};

export const Col4 = {
    sm: 4,
    md: 4,
    lg: 4,
    xl: 4
};

export const Col6 = {
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
};
export const Col8 = {
    sm: 8,
    md: 8,
    lg: 8,
    xl: 8
};
export const Col10 = {
    sm: 10,
    md: 10,
    lg: 10,
    xl: 10
};
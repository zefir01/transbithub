export const tokenEndpoint = GetStsServer() + "/connect/token";
export const revocEndpoint = GetStsServer() + "/connect/revocation";
export const grpcEndpoint = GetGrpcServer();
export const authClientId = "adminka";
export const authClientSecret = "ceeheiF0chai2ae2";
export const authScopes = "adminka_security openid offline_access";
export const pageSize = 30;
export const invoiceFeePercent = "1";
export const satoshi = 0.00000001;
export const minimalAmountBtc = satoshi * 100;
export const autoPriceFee = satoshi;
export const promiseFee = 0.001;
export const MB10 = 10485760;
export const BitcoinNetwork = GetBitcoinNet();
export const bugsMail = "bugs";
export const supportMail = "support";
export const streamsKeepAliveTimeout=20000;

function GetBitcoinNet(): string {
    if (process.env.REACT_APP_BITCOIN_NET === undefined) {
        return "testnet";
    }
    return process.env.REACT_APP_BITCOIN_NET;
}

function GetStsServer(): string {
    if (process.env.REACT_APP_STS_SERVER !== undefined) {
        return process.env.REACT_APP_STS_SERVER;
    }
    return window.location.origin.toString();
}

function GetGrpcServer(): string {
    if (process.env.REACT_APP_GRPC_SERVER !== undefined) {
        return process.env.REACT_APP_GRPC_SERVER;
    }
    return window.location.origin.toString();
}


declare global {
    interface Window {
        authTimer?: NodeJS.Timeout;
        imageTimer?: NodeJS.Timeout;
        accessToken?: string;
        refreshToken?: string;
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
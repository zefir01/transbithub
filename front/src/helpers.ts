import * as grpcWeb from "grpc-web";
import {authClientId, authClientSecret, authScopes, grpcEndpoint, revocEndpoint, tokenEndpoint} from "./global";
import jwt_decode from "jwt-decode";
import {Timestamp} from "google-protobuf/google/protobuf/timestamp_pb";
import {IImage} from "./redux/store/Interfaces";
import {TradeApiClient} from "./Protos/ApiServiceClientPb";
import {ProfileApiClient} from "./Protos/ProfileServiceClientPb";
import {Dispatch} from "redux";
import {NewAnonToken, NewToken, ProfileActionTypes} from "./redux/actions";
import {Decimal} from 'decimal.js';
import * as jspb from "google-protobuf";
import axios, {AxiosResponse} from 'axios';

export class GrpcError extends Error {
    InnerError: grpcWeb.Error;

    constructor(innerError: grpcWeb.Error) {
        super(decodeURI(innerError.message));
        this.InnerError = innerError;
        let re = /Exception was thrown by handler. ModelException: /gi;
        this.message = this.message.replace(re, "");
    }
}

export const profileApiClient = new ProfileApiClient(grpcEndpoint, null, null);
export const tradeApiClient = new TradeApiClient(grpcEndpoint, null, null);

interface IMetadata {
    Authorization: string;
    deadline: number;
}

export function ProfileGrpcRunAsync<AsObject>(func: any, request: any, token?: string, deadlineMinutes: number = 1): Promise<AsObject> {
    let metadata: IMetadata | null = null;
    if (token !== undefined) {
        let deadline = new Date();
        deadline.setHours(deadline.getMinutes() + deadlineMinutes);
        metadata = {
            "Authorization": "Bearer " + token,
            deadline: deadline.getTime()
        };
    }
    return new Promise<AsObject>((resolve, reject) => {
        func.bind(profileApiClient)(request, metadata, (err: grpcWeb.Error, response: jspb.Message) => {
            function isObject(object: any): object is AsObject {
                return object;
            }

            if (err !== null) {
                reject(new GrpcError(err));
                return;
            }
            let t = response.toObject(false);
            if (isObject(t)) {
                resolve(t);
            } else {
                reject(new Error("Invalid type."));
            }
        });
    });
}


export function TradeGrpcRunAsync<T>(func: any, request: any, token: string, asObject: boolean = true, deadlineMinutes: number = 1): Promise<T> {
    if (token === "") {
        throw new Error("Empty token.");
    }
    let metadata: IMetadata | null = null;
    let deadline = new Date();
    deadline.setHours(deadline.getMinutes() + deadlineMinutes);
    metadata = {
        "Authorization": "Bearer " + token,
        deadline: deadline.getTime()
    };
    return new Promise<T>((resolve, reject) => {
        func.bind(tradeApiClient)(request, metadata, (err: grpcWeb.Error, response: jspb.Message) => {
            if (err) reject(new GrpcError(err));
            else {
                function isObject(object: any): object is T {
                    return true;
                }

                if (err !== null) {
                    reject(new GrpcError(err));
                    return;
                }
                let t;
                if (asObject) {
                    t = response.toObject(false);
                } else {
                    t = response;
                }
                if (isObject(t)) {
                    resolve(t);
                } else {
                    reject(new Error("Invalid type."));
                }
            }
        });
    });
}

export function decodeToken(token: string): IToken {
    return jwt_decode(token);
}

export interface IToken {
    nbf: number,
    exp: number,
    iss: string,
    aud: string[],
    client_id: string,
    sub: string,
    auth_time: number,
    idp: string,
    given_name: string,
    email: string,
    scope: string[],
    amr: string[]
}



export interface IJWTResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
    error?: string;
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry<T>(todo: () => Promise<T>, retrys: number, delayMs: number): Promise<T> {
    let r = 0;
    let err;
    do {
        try {
            return await todo();
        } catch (error) {
            let s: string = error.response?.data?.error;
            if (s.startsWith("invalid_")) {
                throw error;
            }
            err = error;
            r = r + 1;
            //console.log(error);
            console.log(`Retry: ${r}`);
            if (r === retrys - 1) {
                throw error;
            }
            await sleep(delayMs);
        }
    } while (r < retrys)
    throw err;
}

export async function RefreshAccessToken(refreshToken: string): Promise<IJWTResponse | undefined> {
    if (refreshToken === "")
        return undefined;

    let resp: AxiosResponse;
    const formData = new URLSearchParams();
    formData.append("refresh_token", refreshToken);
    formData.append("grant_type", "refresh_token");
    formData.append("client_id", authClientId);
    formData.append("client_secret", authClientSecret);
    formData.append("scope", authScopes);

    const client = axios.create();
    const options = {
        timeout: 5000,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    resp = await retry(async () => await client.post(tokenEndpoint, formData, options), 24, 5000);

    return resp.data;
}

export async function GetRefreshToken(username: string, password: string, pin: string) {
    let resp: AxiosResponse;
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");
    formData.append("client_id", authClientId);
    formData.append("client_secret", authClientSecret);
    formData.append("scope", authScopes);
    formData.append("two_fa", pin);

    const client = axios.create();
    const options = {
        timeout: 5000,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    };
    resp = await retry(async () => await client.post(tokenEndpoint, formData, options), 3, 5000);

    return resp.data;
}

export async function Logout(refreshToken: string) {
    const formData = new URLSearchParams();
    formData.append("token", refreshToken);
    formData.append("token_type_hint", "refresh_token");
    formData.append("client_id", authClientId);
    formData.append("client_secret", authClientSecret);

    const client = axios.create();
    const options = {
        timeout: 5000,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + window.accessToken
        },
    };
    await retry(async () => await client.post(revocEndpoint, formData, options), 3, 5000);
}


export function toLocalDateTimeString(date: Timestamp.AsObject | undefined) {
    let time = toDate(date);
    return time.toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function toDate(date: Timestamp.AsObject | undefined): Date {
    if (date === undefined)
        return new Date('0001-01-01T00:00:00Z');
    return new Date(date.seconds * 1000);
}

export function getToken(): string {
    if (!window.accessToken) {
        throw new Error("No access token");
    }
    return window.accessToken;
}


export async function RenewAccessToken(dispatch: Dispatch<any>, refreshToken: string): Promise<boolean> {
    let json: IJWTResponse | undefined = undefined;
    try {
        json = await RefreshAccessToken(refreshToken);
    } catch (e) {
        console.log("Error in refresh token: " + e.response?.data?.error);
        if (e.response?.data?.error === "invalid_grant") {
            dispatch({type: ProfileActionTypes.LOGOUT});
        }
        return false;
    }
    if (json === undefined) {
        dispatch({type: ProfileActionTypes.REMOVE_TOKEN});
        return false;
    }
    dispatch(NewToken(json.access_token, json.refresh_token, json.expires_in));
    return true;
}

export async function RenewAnonAccessToken(dispatch: Dispatch<any>, refreshToken: string): Promise<boolean> {
    let json: IJWTResponse | undefined = undefined;
    try {
        json = await RefreshAccessToken(refreshToken);
    } catch (e) {
        console.log("Error in refresh token: " + e.response?.data?.error);
        if (e.response?.data?.error === "invalid_grant") {
            dispatch({type: ProfileActionTypes.REMOVE_ANON_TOKEN});
        }
        return false;
    }
    if (json === undefined) {
        dispatch({type: ProfileActionTypes.ANON_TOKEN_ERROR});
        return false;
    }
    dispatch(NewAnonToken(json.access_token, json.refresh_token));
    return true;
}

export function PrettyPrice(price: Decimal | null, decimals: number = 2): string {
    if (price === null || price === undefined)
        return "";
    let p;
    try {
        p = price.toDecimalPlaces(decimals).toString();
    } catch {
        return "";
    }
    if (decimals === 2) {
        p = p.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    if (p.includes(".")) {
        while (p.endsWith(".") || (p.includes(".") && p.endsWith("0"))) {
            p = p.slice(0, -1);
        }
    }
    return p;
}

export class Guid {
    public static newGuid(): Guid {
        return new Guid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            // eslint-disable-next-line eqeqeq,no-mixed-operators
            const v = (c == 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    }

    public static get empty(): string {
        return '00000000-0000-0000-0000-000000000000';
    }

    public get empty(): string {
        return Guid.empty;
    }

    public static isValid(str: string): boolean {
        const validRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return validRegex.test(str);
    }

    private readonly value: string = this.empty;

    constructor(value?: string) {
        if (value) {
            if (Guid.isValid(value)) {
                this.value = value;
            }
        }
    }

    public toString() {
        return this.value;
    }
}

export function GetHash(str: string): number {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export async function createImage(file: File): Promise<IImage> {
    let guid = Guid.newGuid();
    let b = await file.arrayBuffer();
    let array8 = new Uint8Array(b);
    let blob = new Blob([array8]);
    return {
        id: guid.toString(),
        url: URL.createObjectURL(blob),
        original: blob
    }
}

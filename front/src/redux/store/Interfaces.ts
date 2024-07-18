import {
    Balance,
    Conversation,
    Deal,
    Invoice,
    InvoicePayment,
    PayInvoiceByPromiseRequest,
    BoughtOptions
} from "../../Protos/api_pb";
import {MyDecimal} from "../../MyDecimal";
import Decimal from "decimal.js";

export interface IProfileGeneralSettings {
    timezone: string;
    introduction: string;
    site: string;
    salesDisabled: boolean;
    buysDisabled: boolean;
    DefaultCurrency: string;
}

export interface LastSearch {
    country: string;
    currency: string;
    paymentType: string;
    amount: Decimal | null;
}
export enum Langs{
    ru="ru",
    en="en",
    auto="auto"
}
export interface ILang{
    Lang: Langs;
}
export interface IProfile {
    UserId: string;
    Username: string;
    Email: string;
    EnabledTwoFA: boolean;
    EmailVerifed: boolean;
    GeneralSettings: IProfileGeneralSettings;
    LastSearchBuy: LastSearch | null;
    LastSearchSell: LastSearch | null;
    BoughtOptions: BoughtOptions.AsObject | null;
    ProfileNeedUpdate: boolean;
}

export enum AuthState {
    NotAuthed,
    AnonAuthed,
    Authed
}

export interface IAuthState {
    refreshToken: string;
    anonRefreshToken: string;
    state: AuthState;
}

export interface ISystemState {
    interval?: NodeJS.Timeout;
    accessTokenIsUpdating: boolean;
}

export interface ICatalog {
    variables: Map<string, MyDecimal> | null;
    fee: MyDecimal | null;
}

export interface IBalances {
    Balance: Balance.AsObject | null;
}

export interface IStore {
    system: ISystemState;
    router: any;
    auth: IAuthState;
    profile: IProfile;
    catalog: ICatalog;
    deals: IDeals;
    preload: IPreload;
    balances: IBalances;
    invoices: IInvoices;
    images: IImages;
    idbStates: IDBStates;
    helperState: HelperState;
    lang: ILang;
}

export enum EventTypes {
    DealNew,
    DealStatusChanged,
    DealNewMessage,
    DealFiatPayed,
    DealDisputeCreated,
    BalanceChanged,
    InvoiceNew,
    InvoicePaymentNew,
    ConversationNewMessage
}

export interface IEvent {
    id: number;
    type: EventTypes;
    dealId: number | null;
    dealMessageId: number | null;
    invoiceId: number | null;
    invoiceType: InvoiceType | null;
    invoicePayment: InvoicePayment.AsObject | null;
    conversation?: Conversation.AsObject
}

export interface IDeals {
    newEvents: Array<IEvent>;
    newDeals: Array<number>;
    newStatusDeals: Array<number>;
    newMessageDeals: Array<number>;
    deals: Array<Deal.AsObject>;
}

export interface IPreload {
    openedDeals: boolean;
    completedDeals: boolean;
    canceledDeals: boolean;
    disputedDeals: boolean;
    toMeInvoices: boolean;
    fromMeInvoices: boolean;
    toMeInvoicePayments: boolean;
    fromMeInvoicePayments: boolean;
    publicInvoices: boolean;
    lastSearch: boolean;
    conversations: boolean;
}

export enum InvoiceType {
    fromMe,
    toMe
}

export interface IInvoices {
    toMeInvoices: Array<Invoice.AsObject> | null;
    fromMeInvoices: Array<Invoice.AsObject> | null;
    newEvents: Array<IEvent>;
    newInvoicesIds: Array<number>;
    toMeInvoicePayments: Array<InvoicePayment.AsObject> | null;
    fromMeInvoicePayments: Array<InvoicePayment.AsObject> | null;
    newPaymentsIds: Array<number>;
    publicInvoices: Array<Invoice.AsObject> | null;
    userId: string;
    conversations: Array<Conversation.AsObject> | null;
}

export interface IImage {
    id: string;
    url: string;
    preview?: Blob;
    original?: Blob;
}

export interface ImageDownloadRequest {
    id: string;
    isPreview: boolean;
    createdAt?: Date;
}

export interface IImages {
    toUpload: IImage[];
    uploading: IImage[];
    uploaded: IImage[];
    uploadFailed: IImage[];
    toDownload: ImageDownloadRequest[];
    downloading: ImageDownloadRequest[];
    downloaded: IImage[];
    downloadFailed: ImageDownloadRequest[];
    originalView: OriginalImageView
}

export interface OriginalImageView {
    id: string;
    isOpen: boolean;
    createdAt: Date;
}
export interface InMemoryImageStore{
    previewImages:  IImage[];
    originalImages: IImage[];
}
export interface IDBStates {
    previewImages: number;
    originalImages: number;
    idbAvailable?: boolean;
    inMemoryImageStore: InMemoryImageStore
}

export enum HelperBuyResultType {
    Balance,
    Bitcoin,
    Promise
}

export interface HelperBuyResult {
    type: HelperBuyResultType,
    btcAddress: string;
    promisePass: string;
}

export enum HelperOperation {
    BuyBtc,
    PayInvoice,
    UsePromise
}

export enum HelperInvoicePaymentType {
    Balance,
    Deal,
    Promise,
    LN
}

export enum HelperUsePromiseType {
    Balance,
    Sell
}

export interface HelperState {
    operation: HelperOperation | null;
    country: string;
    currency: string;
    paymentType: string;
    amount: MyDecimal | null;
    amountIsFiat: boolean;
    currentPath: string;
    buyResult: HelperBuyResult | null;
    dealId: number | null;
    invoiceId: number | null;
    pieces: number | null;
    invoicePaymentType: HelperInvoicePaymentType | null;
    invoicePaymentId: number | null;
    promise: string;
    promisePass: string;
    promiseOddType: PayInvoiceByPromiseRequest.OddTypes | null;
    promiseUseType: HelperUsePromiseType | null;
    disableUseHelperRequest: boolean;
    useHelperModalShowed: boolean;
    adId: number | null;
}
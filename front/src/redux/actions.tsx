import {Action as act} from 'redux';
import {
    HelperBuyResult, HelperInvoicePaymentType, HelperOperation, HelperUsePromiseType,
    IEvent,
    IImage,
    ImageDownloadRequest,
    IProfileGeneralSettings, Langs,
    LastSearch,
} from "./store/Interfaces";
import {
    Balance,
    Conversation, CreateRefundResponse,
    Deal,
    DealMessage,
    Event,
    Invoice,
    InvoicePayment, MyProfileResponse, PayInvoiceByPromiseRequest,
    Variables
} from "../Protos/api_pb";
import {MyDecimal} from "../MyDecimal";

export enum ProfileActionTypes {
    ANON_TOKEN_ERROR = "ANON_TOKEN_ERROR",
    NEW_ANON_TOKEN = "NEW_ANON_TOKEN",
    NEW_TOKEN = "NEW_TOKEN",
    RENEW_TOKEN_ERROR = "RENEW_TOKEN_ERROR",
    NEED_TWOFA_PIN = "NEED_TWOFA_PIN",
    REMOVE_TOKEN = "REMOVE_TOKEN",
    REMOVE_ANON_TOKEN = "REMOVE_ANON_TOKEN",
    PROFILE_SUCCESS = "PROFILE_SUCCESS",
    PROFILE_ERROR = "PROFILE_ERROR",
    SAVE_PROFILE_GENERAL_SETTINGS_SUCCESS = "SAVE_PROFILE_GENERAL_SETTINGS_SUCCESS",
    TOTP_ENABLE_SUCCESS = "TOTP_ENABLE_SUCCESS",
    TOTP_DISABLE_SUCCESS = "TOTP_DISABLE_SUCCESS",
    CHANGE_EMAIL_SUCCESS = "CHANGE_EMAIL_SUCCESS",
    CONFIRM_EMAIL_SUCCESS = "CONFIRM_EMAIL_SUCCESS",
    LOGOUT = "LOGOUT",
    LAST_SEARCH_BUY = "LAST_SEARCH_BUY",
    LAST_SEARCH_SELL = "LAST_SEARCH_SELL",
    SET_DEFAULT_CURRENCY = "SET_DEFAULT_CURRENCY",
    BALANCE_UPDATED = "BALANCE_UPDATED"
}

export enum EventsActionTypes {
    CLEAR = "CLEAR",
    NEW_EVENT = "NEW_EVENT",
    MARK_AS_READED_EVENT = "MARK_AS_READED_EVENT",
    MARK_AS_READED_EVENTS = "MARK_AS_READED_EVENTS",
    MARK_AS_READED_DEAL = "MARK_AS_READED_DEAL",
    ADD_DEALS = "ADD_DEALS",
    ADD_MESSAGE_TO_DEAL = "ADD_MESSAGE_TO_DEAL",
    LOAD_DEALS = "LOAD_DEALS",
    DEAL_CANCELED = "DEAL_CANCELED",
}

export enum PreloadActionTypes {
    OPENED_DEALS = "OPENED_DEALS",
    COMPLETED_DEALS = "COMPLETED_DEALS",
    CANCELED_DEALS = "CANCELED_DEALS",
    DISPUTED_DEALS = "DISPUTED_DEALS",
    TOME_INVOICES = "TOME_INVOICES",
    FROMME_INVOICES = "FROMME_INVOICES",
    TOME_PAYMENTS = "TOME_PAYMENTS",
    FROMME_PAYMENTS = "FROMME_PAYMENTS",
    PUBLIC_INVOICES = "PUBLIC_INVOICES",
    LAST_SEARCH = "LAST_SEARCH",
    CONVERSATIONS = "CONVERSATIONS"
}

export enum CatalogActionTypes {
    NEW_VARIABLES = "NEW_VARIABLES",
    NEW_FEES = "NEW_FEES"
}

export enum InvoiceActionTypes {
    INVOICE_CREATED = "INVOICE_CREATED",
    TOME_INVOICES_LOADED = "TOME_INVOICES_LOADED",
    FROMME_INVOICES_LOADED = "FROMME_INVOICES_LOADED",
    INVOICE_DELETED = "INVOICE_DELETED",
    INVOICES_DELETED = "INVOICES_DELETED",
    PAYMENTS_LOADED = "PAYMENTS_LOADED",
    NEW_INVOICE_PAYMENT = "NEW_INVOICE_PAYMENT",
    PUBLIC_INVOICES_LOADED = "PUBLIC_INVOICES_LOADED",
    PUBLIC_INVOICE_UPDATED = "PUBLIC_INVOICE_UPDATED",
    CONVERSATION_LOADED = "CONVERSATION_LOADED",
    CONVERSATIONS_LOADED = "CONVERSATIONS_LOADED",
    CONVERSATION_DELETED = "CONVERSATION_DELETED",
    REFUND_CREATED = "REFUND_CREATED"
}

export enum ImagesActionTypes {
    UPLOAD_IMAGES = "UPLOAD_IMAGES",
    UPLOADING_IMAGES = "UPLOADING_IMAGES",
    UPLOADED_IMAGE = "UPLOADED_IMAGE",
    UPLOAD_IMAGE_FAILED = "UPLOAD_IMAGE_FAILED",
    TO_DOWNLOAD_IMAGE = "TO_DOWNLOAD_IMAGE",
    DOWNLOADING_IMAGES = "DOWNLOADING_IMAGES",
    DOWNLOADED_IMAGE = "DOWNLOADED_IMAGE",
    DOWNLOAD_IMAGE_FAILED = "DOWNLOAD_IMAGE_FAILED",
    RETRY_IMAGES = "RETRY_IMAGES",
    OPEN_ORIGINAL_VIEW = "OPEN_ORIGINAL_VIEW",
    CLOSE_ORIGINAL_VIEW = "CLOSE_ORIGINAL_VIEW",
    IMAGES_CACHED = "IMAGES_CACHED",
}

export enum IDBStatesActionTypes {
    PREVIEW_IMAGES_UPDATED = "PREVIEW_IMAGES_UPDATED",
    ORIGINAL_IMAGES_UPDATED = "ORIGINAL_IMAGES_UPDATED",
    IDB_AVAILABLE = "IDB_AVAILABLE",
    IDB_NOT_AVAILABLE = "IDB_NOT_AVAILABLE",
    STORE_PREVIEW_IMAGE = "STORE_PREVIEW_IMAGE",
    STORE_ORIGINAL_IMAGE = "STORE_ORIGINAL_IMAGE"
}

export enum HelperActionTypes {
    SET_BUY_FILTER = "SET_BUY_FILTER",
    SET_CURRENT_PATH = "SET_CURRENT_PATH",
    SET_BUY_AMOUNT = "SET_BUY_AMOUNT",
    SET_BUY_RESULT = "SET_BUY_RESULT",
    SET_DEAL_ID = "SET_DEAL_ID",
    RESET = "RESET",
    SET_INVOICE_ID = "SET_INVOICE_ID",
    SET_INVOICE_PIECES = "SET_INVOICE_PIECES",
    SET_OPERATION = "SET_OPERATION",
    SET_INVOICE_PAYMENT_TYPE = "SET_INVOICE_PAYMENT_TYPE",
    SET_INVOICE_PAYMENT_ID = "SET_INVOICE_PAYMENT_ID",
    SET_PROMISE = "SET_PROMISE",
    SET_PROMISE_ODD_TYPE = "SET_PROMISE_ODD_TYPE",
    SET_PROMISE_USE_TYPE = "SET_PROMISE_USE_TYPE",
    DISABLE_USE_HELPER_REQUEST = "DISABLE_USE_HELPER_REQUEST",
    USE_HELPER_MODAL_SHOWED = "USE_HELPER_MODAL_SHOWED",
    SET_AD_ID = "SET_AD_ID"
}

export enum LangActionTypes {
    SET_LANG = "SET_LANG"
}

export interface IActionBase extends act {
    type: ProfileActionTypes
        | EventsActionTypes
        | PreloadActionTypes
        | CatalogActionTypes
        | InvoiceActionTypes
        | ImagesActionTypes
        | IDBStatesActionTypes
        | HelperActionTypes
        | LangActionTypes;
}

export const NewToken = (accessToken: string, refreshToken: string, expiredIn: number) => {
    return {
        type: ProfileActionTypes.NEW_TOKEN,
        accessToken,
        refreshToken,
        expiredIn,
    }
};
export type NewTokenType = ReturnType<typeof NewToken>;

export const NewAnonToken = (accessToken: string, refreshToken: string) => {
    return {
        type: ProfileActionTypes.NEW_ANON_TOKEN,
        accessToken,
        refreshToken
    }
};
export type NewAnonTokenType = ReturnType<typeof NewAnonToken>;

export const ProfileSuccess = (profile: MyProfileResponse.AsObject) => {
    return {
        type: ProfileActionTypes.PROFILE_SUCCESS,
        profile
    }
};
export type ProfileSuccessType = ReturnType<typeof ProfileSuccess>;

export const SaveProfileGeneralSettingsSuccess = (settings: IProfileGeneralSettings) => {
    return {
        type: ProfileActionTypes.SAVE_PROFILE_GENERAL_SETTINGS_SUCCESS,
        settings
    }
};
export type SaveProfileGeneralSettingsSuccessType = ReturnType<typeof SaveProfileGeneralSettingsSuccess>;

export const ChangeEmailSuccess = (email: string) => {
    return {
        type: ProfileActionTypes.CHANGE_EMAIL_SUCCESS,
        email,
    }
};
export type ChangeEmailSuccessType = ReturnType<typeof ChangeEmailSuccess>;

export const NewEvent = (event: Event.AsObject) => {
    return {
        type: EventsActionTypes.NEW_EVENT,
        event
    }
};
export type NewEventType = ReturnType<typeof NewEvent>;

export const MarkAsReadedEvent = (event: Event.AsObject) => {
    return {
        type: EventsActionTypes.MARK_AS_READED_EVENT,
        event
    }
};
export type MarkAsReadedEventType = ReturnType<typeof MarkAsReadedEvent>;

export const MarkAsReadedEvents = (events: Array<IEvent>) => {
    return {
        type: EventsActionTypes.MARK_AS_READED_EVENTS,
        events
    }
};
export type MarkAsReadedEventsType = ReturnType<typeof MarkAsReadedEvents>;

export const MarkAsReadedDeal = (deal: Deal.AsObject) => {
    return {
        type: EventsActionTypes.MARK_AS_READED_DEAL,
        deal
    }
};
export type MarkAsReadedDealType = ReturnType<typeof MarkAsReadedDeal>;

export const AddDeals = (deals: Array<Deal.AsObject>) => {
    return {
        type: EventsActionTypes.ADD_DEALS,
        deals
    }
};
export type AddDealsType = ReturnType<typeof AddDeals>;

export const AddMessageToDeal = (deal: Deal.AsObject, message: DealMessage.AsObject) => {
    return {
        type: EventsActionTypes.ADD_MESSAGE_TO_DEAL,
        deal,
        message
    }
};
export type AddMessageToDealType = ReturnType<typeof AddMessageToDeal>;

export const LoadDeals = (deals: Array<Deal.AsObject>) => {
    return {
        type: EventsActionTypes.LOAD_DEALS,
        deals
    }
};
export type LoadDealsType = ReturnType<typeof LoadDeals>;

export const DealCanceled = (deal: Deal.AsObject) => {
    return {
        type: EventsActionTypes.DEAL_CANCELED,
        deal
    }
};
export type DealCanceledType = ReturnType<typeof DealCanceled>;

export const NewVariables = (variables: Variables.AsObject) => {
    return {
        type: CatalogActionTypes.NEW_VARIABLES,
        variables
    }
};
export type NewVariablesType = ReturnType<typeof NewVariables>;

export const NewFees = (fee: MyDecimal) => {
    return {
        type: CatalogActionTypes.NEW_FEES,
        fee
    }
};
export type NewFeesType = ReturnType<typeof NewFees>;

export const InvoiceCreated = (invoice: Invoice.AsObject) => {
    return {
        type: InvoiceActionTypes.INVOICE_CREATED,
        invoice
    }
};
export type InvoiceCreatedType = ReturnType<typeof InvoiceCreated>;

export const ToMeInvoicesLoaded = (invoices: Array<Invoice.AsObject>) => {
    return {
        type: InvoiceActionTypes.TOME_INVOICES_LOADED,
        invoices
    }
};
export type ToMeInvoicesLoadedType = ReturnType<typeof ToMeInvoicesLoaded>;

export const FromMeInvoicesLoaded = (invoices: Array<Invoice.AsObject>) => {
    return {
        type: InvoiceActionTypes.FROMME_INVOICES_LOADED,
        invoices
    }
};
export type FromMeInvoicesLoadedType = ReturnType<typeof FromMeInvoicesLoaded>;

export const InvoiceDeleted = (invoiceId: number) => {
    return {
        type: InvoiceActionTypes.INVOICE_DELETED,
        invoiceId
    }
};
export type InvoiceDeletedType = ReturnType<typeof InvoiceDeleted>;

export const InvoicesDeleted = (invoices: Array<Invoice.AsObject>) => {
    return {
        type: InvoiceActionTypes.INVOICES_DELETED,
        invoices
    }
};
export type InvoicesDeletedType = ReturnType<typeof InvoicesDeleted>;

export const InvoicePaymentsLoaded = (payments: Array<InvoicePayment.AsObject>) => {
    return {
        type: InvoiceActionTypes.PAYMENTS_LOADED,
        payments
    }
};
export type InvoicePaymentsLoadedType = ReturnType<typeof InvoicePaymentsLoaded>;

export const NewInvoicesPayment = (payment: InvoicePayment.AsObject) => {
    return {
        type: InvoiceActionTypes.NEW_INVOICE_PAYMENT,
        payment
    }
};
export type NewInvoicesPayment = ReturnType<typeof NewInvoicesPayment>;

export const PublicInvoicesLoaded = (invoices: Array<Invoice.AsObject>) => {
    return {
        type: InvoiceActionTypes.PUBLIC_INVOICES_LOADED,
        invoices,
    }
};
export type PublicInvoicesLoadedType = ReturnType<typeof PublicInvoicesLoaded>;

export const PublicInvoiceUpdated = (invoice: Invoice.AsObject) => {
    return {
        type: InvoiceActionTypes.PUBLIC_INVOICE_UPDATED,
        invoice,
    }
};
export type PublicInvoiceUpdatedType = ReturnType<typeof PublicInvoiceUpdated>;

export const LastSearchBuy = (lastSearch: LastSearch) => {
    return {
        type: ProfileActionTypes.LAST_SEARCH_BUY,
        lastSearch,
    }
};
export type LastSearchBuyType = ReturnType<typeof LastSearchBuy>;

export const LastSearchSell = (lastSearch: LastSearch) => {
    return {
        type: ProfileActionTypes.LAST_SEARCH_SELL,
        lastSearch,
    }
};
export type LastSearchSellType = ReturnType<typeof LastSearchSell>;

export const SetDefaultCurrency = (currency: string) => {
    return {
        type: ProfileActionTypes.SET_DEFAULT_CURRENCY,
        currency,
    }
};
export type SetDefaultCurrencyType = ReturnType<typeof SetDefaultCurrency>;

export const LoadConversation = (conversation: Conversation.AsObject) => {
    return {
        type: InvoiceActionTypes.CONVERSATION_LOADED,
        conversation
    }
}
export type LoadConversationType = ReturnType<typeof LoadConversation>;

export const LoadConversations = (conversations: Array<Conversation.AsObject>) => {
    return {
        type: InvoiceActionTypes.CONVERSATIONS_LOADED,
        conversations
    }
}
export type LoadConversationsType = ReturnType<typeof LoadConversations>;

export const ConversationDeleted = (id: number) => {
    return {
        type: InvoiceActionTypes.CONVERSATION_DELETED,
        id
    }
}
export type ConversationDeletedType = ReturnType<typeof ConversationDeleted>;

export const RefundCreated = (response: CreateRefundResponse.AsObject) => {
    return {
        type: InvoiceActionTypes.REFUND_CREATED,
        response
    }
}
export type RefundCreatedType = ReturnType<typeof RefundCreated>;

export const BalanceUpdated = (balance: Balance.AsObject) => {
    return {
        type: ProfileActionTypes.BALANCE_UPDATED,
        balance
    }
}
export type BalanceUpdatedType = ReturnType<typeof BalanceUpdated>;

export const UploadImages = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.UPLOAD_IMAGES,
        images: images
    }
}
export type UploadImagesType = ReturnType<typeof UploadImages>;

export const UploadingImages = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.UPLOADING_IMAGES,
        images: images
    }
}
export type UploadingImagesType = ReturnType<typeof UploadingImages>;

export const UploadedImage = (image: IImage) => {
    return {
        type: ImagesActionTypes.UPLOADED_IMAGE,
        image
    }
}
export type UploadedImagesType = ReturnType<typeof UploadedImage>;

export const UploadedImageFiled = (image: IImage) => {
    return {
        type: ImagesActionTypes.UPLOAD_IMAGE_FAILED,
        image: image
    }
}
export type UploadedImageFiledType = ReturnType<typeof UploadedImageFiled>;

export const ToDownloadImage = (image: ImageDownloadRequest) => {
    return {
        type: ImagesActionTypes.TO_DOWNLOAD_IMAGE,
        image: image
    }
}
export type ToDownloadImageType = ReturnType<typeof ToDownloadImage>;

export const DownloadingImages = (images: ImageDownloadRequest[]) => {
    return {
        type: ImagesActionTypes.DOWNLOADING_IMAGES,
        images: images
    }
}
export type DownloadingImagesType = ReturnType<typeof DownloadingImages>;

export const DownloadedImage = (image: IImage) => {
    return {
        type: ImagesActionTypes.DOWNLOADED_IMAGE,
        image: image
    }
}
export type DownloadedImageType = ReturnType<typeof DownloadedImage>;

export const DownloadImageFailed = (image: ImageDownloadRequest) => {
    return {
        type: ImagesActionTypes.DOWNLOAD_IMAGE_FAILED,
        image: image
    }
}
export type DownloadImageFailedType = ReturnType<typeof DownloadImageFailed>;

export const OpenOriginalImageView = (id: string, createdAt?: Date) => {
    return {
        type: ImagesActionTypes.OPEN_ORIGINAL_VIEW,
        id,
        createdAt
    }
}
export type OpenOriginalImageViewType = ReturnType<typeof OpenOriginalImageView>;

export const ImagesCached = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.IMAGES_CACHED,
        images
    }
}
export type ImagesCachedType = ReturnType<typeof ImagesCached>;

export const SetBuyFilter = (country: string, currency: string, paymentType: string) => {
    return {
        type: HelperActionTypes.SET_BUY_FILTER,
        country,
        currency,
        paymentType
    }
}
export type SetBuyFilterType = ReturnType<typeof SetBuyFilter>;

export const SetCurrentPath = (path: string) => {
    return {
        type: HelperActionTypes.SET_CURRENT_PATH,
        path
    }
}
export type SetCurrentPathType = ReturnType<typeof SetCurrentPath>;

export const SetBuyAmount = (amount: MyDecimal, isFiat: boolean) => {
    return {
        type: HelperActionTypes.SET_BUY_AMOUNT,
        amount,
        isFiat
    }
}
export type SetBuyAmountType = ReturnType<typeof SetBuyAmount>;

export const SetBuyResult = (result: HelperBuyResult) => {
    return {
        type: HelperActionTypes.SET_BUY_RESULT,
        result
    }
}
export type SetBuyResultType = ReturnType<typeof SetBuyResult>;

export const SetDealId = (dealId: number) => {
    return {
        type: HelperActionTypes.SET_DEAL_ID,
        dealId
    }
}
export type SetDealIdType = ReturnType<typeof SetDealId>;

export const SetInvoiceId = (invoiceId: number) => {
    return {
        type: HelperActionTypes.SET_INVOICE_ID,
        invoiceId
    }
}
export type SetInvoiceIdType = ReturnType<typeof SetInvoiceId>;

export const SetInvoicePieces = (pieces: number) => {
    return {
        type: HelperActionTypes.SET_INVOICE_PIECES,
        pieces
    }
}
export type SetInvoicePiecesType = ReturnType<typeof SetInvoicePieces>;

export const SetOperation = (operation: HelperOperation) => {
    return {
        type: HelperActionTypes.SET_OPERATION,
        operation
    }
}
export type SetOperationType = ReturnType<typeof SetOperation>;

export const SetInvoicePaymentType = (paymentType: HelperInvoicePaymentType) => {
    return {
        type: HelperActionTypes.SET_INVOICE_PAYMENT_TYPE,
        paymentType
    }
}
export type SetInvoicePaymentTypeType = ReturnType<typeof SetInvoicePaymentType>;

export const SetInvoicePaymentId = (id: number) => {
    return {
        type: HelperActionTypes.SET_INVOICE_PAYMENT_ID,
        id
    }
}
export type SetInvoicePaymentIdType = ReturnType<typeof SetInvoicePaymentId>;

export const SetPromise = (promise: string, pass: string) => {
    return {
        type: HelperActionTypes.SET_PROMISE,
        promise,
        pass,
    }
}
export type SetPromiseType = ReturnType<typeof SetPromise>;

export const SetPromiseOddType = (oddType: PayInvoiceByPromiseRequest.OddTypes) => {
    return {
        type: HelperActionTypes.SET_PROMISE_ODD_TYPE,
        addType: oddType
    }
}
export type SetPromiseOddTypeType = ReturnType<typeof SetPromiseOddType>;

export const SetPromiseUse = (data: HelperUsePromiseType) => {
    return {
        type: HelperActionTypes.SET_PROMISE_USE_TYPE,
        data
    }
}
export type SetPromiseUseType = ReturnType<typeof SetPromiseUse>;

export const SetAdId = (id: number) => {
    return {
        type: HelperActionTypes.SET_AD_ID,
        id
    }
}
export type SetAdIdType = ReturnType<typeof SetAdId>;

export const SetLang = (lang: Langs) => {
    return {
        type: LangActionTypes.SET_LANG,
        lang
    }
}
export type SetLangType = ReturnType<typeof SetLang>;

export const IDBStorePreviewImage = (image: IImage) => {
    return {
        type: IDBStatesActionTypes.STORE_PREVIEW_IMAGE,
        image
    }
}
export type IDBStorePreviewImageType = ReturnType<typeof IDBStorePreviewImage>;

export const IDBStoreOriginalImage = (image: IImage) => {
    return {
        type: IDBStatesActionTypes.STORE_ORIGINAL_IMAGE,
        image
    }
}
export type IDBStoreOriginalImageType = ReturnType<typeof IDBStoreOriginalImage>;
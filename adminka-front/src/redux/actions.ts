import {Action as act} from 'redux';
import {Deal, Event, Variables} from "../Protos/api_pb";
import {IImage, ImageDownloadRequest, Langs} from "./interfaces";
import {Dispute, Profile, SupportAccount} from "../Protos/adminka_pb";

export enum ProfileActionTypes {
    NEW_TOKEN = "NEW_TOKEN",
    RENEW_TOKEN_ERROR = "RENEW_TOKEN_ERROR",
    REMOVE_TOKEN = "REMOVE_TOKEN",
    LOGOUT = "LOGOUT",
    PROFILE_LOADED = "PROFILE_LOADED"
}

export enum EventsActionTypes {
    NEW_EVENT = "NEW_EVENT",
    MARK_AS_READ_EVENTS = "MARK_AS_READ_EVENTS",
    LOAD_DEAL = "LOAD_DEAL",
}

export enum CatalogActionTypes {
    NEW_VARIABLES = "NEW_VARIABLES",
    NEW_FEES = "NEW_FEES"
}

export enum SupportAccountsTypes{
    LOADED_ACCOUNTS="LOADED_ACCOUNTS"
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

export interface IActionBase extends act {
    type: ProfileActionTypes |
        LangActionTypes |
        DisputesTypes |
        SupportAccountsTypes |
        EventsActionTypes |
        ImagesActionTypes |
        IDBStatesActionTypes;
}

export enum LangActionTypes {
    SET_LANG = "SET_LANG"
}

export enum DisputesTypes {
    UPDATE_DISPUTE="UPDATE_DISPUTE",
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

export const NewEvent = (event: Event.AsObject) => {
    return {
        type: EventsActionTypes.NEW_EVENT,
        event
    }
};
export type NewEventType = ReturnType<typeof NewEvent>;

export const NewVariables = (variables: Variables.AsObject) => {
    return {
        type: CatalogActionTypes.NEW_VARIABLES,
        variables
    }
};
export type NewVariablesType = ReturnType<typeof NewVariables>;

export const SetLang = (lang: Langs) => {
    return {
        type: LangActionTypes.SET_LANG,
        lang
    }
}
export type SetLangType = ReturnType<typeof SetLang>;

export const ProfileLoaded = (profile: Profile.AsObject) => {
    return {
        type: ProfileActionTypes.PROFILE_LOADED,
        profile
    }
}
export type ProfileLoadedType = ReturnType<typeof ProfileLoaded>;

export const UpdateDispute = (dispute: Dispute.AsObject) => {
    return {
        type: DisputesTypes.UPDATE_DISPUTE,
        dispute
    }
}
export type UpdateDisputeType = ReturnType<typeof UpdateDispute>;

export const LoadedAccounts = (accounts: SupportAccount.AsObject[]) => {
    return {
        type: SupportAccountsTypes.LOADED_ACCOUNTS,
        accounts
    }
}
export type LoadedAccountsType = ReturnType<typeof LoadedAccounts>;

export const LoadDeal = (deal: Deal.AsObject) => {
    return {
        type: EventsActionTypes.LOAD_DEAL,
        deal
    }
}
export type LoadDealType = ReturnType<typeof LoadDeal>;

export const MarkAsReadEvents = (events: Event.AsObject[]) => {
    return {
        type: EventsActionTypes.MARK_AS_READ_EVENTS,
        events
    }
}
export type MarkAsReadEventsType = ReturnType<typeof MarkAsReadEvents>;

export const UploadImages = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.UPLOAD_IMAGES,
        images: images
    }
}
export type UploadImagesType = ReturnType<typeof UploadImages>;

export const OpenOriginalImageView = (id: string, createdAt?: Date) => {
    return {
        type: ImagesActionTypes.OPEN_ORIGINAL_VIEW,
        id,
        createdAt
    }
}
export type OpenOriginalImageViewType = ReturnType<typeof OpenOriginalImageView>;

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

export const ImagesCached = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.IMAGES_CACHED,
        images
    }
}
export type ImagesCachedType = ReturnType<typeof ImagesCached>;

export const ToDownloadImage = (image: ImageDownloadRequest) => {
    return {
        type: ImagesActionTypes.TO_DOWNLOAD_IMAGE,
        image: image
    }
}
export type ToDownloadImageType = ReturnType<typeof ToDownloadImage>;

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

export const DownloadingImages = (images: ImageDownloadRequest[]) => {
    return {
        type: ImagesActionTypes.DOWNLOADING_IMAGES,
        images: images
    }
}
export type DownloadingImagesType = ReturnType<typeof DownloadingImages>;

export const UploadedImageFiled = (image: IImage) => {
    return {
        type: ImagesActionTypes.UPLOAD_IMAGE_FAILED,
        image: image
    }
}
export type UploadedImageFiledType = ReturnType<typeof UploadedImageFiled>;

export const UploadedImage = (image: IImage) => {
    return {
        type: ImagesActionTypes.UPLOADED_IMAGE,
        image
    }
}
export type UploadedImagesType = ReturnType<typeof UploadedImage>;

export const UploadingImages = (images: IImage[]) => {
    return {
        type: ImagesActionTypes.UPLOADING_IMAGES,
        images: images
    }
}
export type UploadingImagesType = ReturnType<typeof UploadingImages>;
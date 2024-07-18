import {Dispute, Profile, SupportAccount} from "../Protos/adminka_pb";
import {Deal, Event, UserInfo} from "../Protos/api_pb";

export enum AuthState {
    NotAuthed,
    Authed
}

export interface IAuthState {
    refreshToken: string;
    state: AuthState;
}

export interface IProfile {
    profile?: Profile.AsObject;
}

export interface IStore {
    router: any;
    auth: IAuthState;
    profile: IProfile;
    lang: ILang;
    disputes: Disputes;
    supportAccounts: SupportAccounts;
    images: IImages;
    idbStates: IDBStates;
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
export interface IDBStates {
    previewImages: number;
    originalImages: number;
    idbAvailable?: boolean;
    inMemoryImageStore: InMemoryImageStore
}
export interface InMemoryImageStore{
    previewImages:  IImage[];
    originalImages: IImage[];
}
export interface IImage {
    id: string;
    url: string;
    preview?: Blob;
    original?: Blob;
}

export enum Langs {
    ru = "ru",
    en = "en",
    auto = "auto"
}

export interface ILang {
    Lang: Langs;
}

export interface Disputes {
    availableDisputes?: Dispute.AsObject[];
    myDisputes?: Dispute.AsObject[];
    userID?: string;
    deals: Deal.AsObject[];
    events: Event.AsObject[];
}

export interface SupportAccounts {
    accounts?: SupportAccount.AsObject[];
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
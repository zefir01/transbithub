import {IImage, IImages} from "../store/Interfaces";
import {
    DownloadedImageType,
    DownloadImageFailedType,
    DownloadingImagesType,
    IActionBase,
    ImagesActionTypes, ImagesCachedType,
    OpenOriginalImageViewType,
    ProfileActionTypes,
    ToDownloadImageType,
    UploadedImageFiledType,
    UploadedImagesType,
    UploadImagesType,
    UploadingImagesType
} from "../actions";
import deepEqual from "deep-equal";

function InitialState(): IImages {
    return {
        toUpload: [],
        uploading: [],
        uploaded: [],
        uploadFailed: [],
        toDownload: [],
        downloading: [],
        downloaded: [],
        downloadFailed: [],
        originalView: {
            id: "",
            isOpen: false,
            createdAt: new Date()
        }
    }
}

export function ImagesReducer(state: IImages = InitialState(), action: IActionBase) {
    function isImageEquals(img1: IImage, img2: IImage): boolean {
        return img1.id === img2.id && ((img1.preview !== undefined) === (img2.preview !== undefined));
    }

    function isImageIncludes(arr: IImage[], img: IImage) {
        for (let i of arr) {
            if (isImageEquals(i, img)) {
                return true;
            }
        }
        return false;
    }


    switch (action.type) {
        case ImagesActionTypes.UPLOAD_IMAGES: {
            let act = action as UploadImagesType;
            let arr: IImage[] = [];
            for (let img of act.images) {
                if (state.toUpload.find(p => p.id === img.id)) {
                    continue;
                }
                if (state.uploading.find(p => p.id === img.id)) {
                    continue;
                }
                if (state.uploaded.find(p => p.id === img.id)) {
                    continue;
                }
                arr.push(img);
            }
            let downloaded = Array.from(state.downloaded);
            downloaded.push(...act.images);
            return {
                ...state,
                toUpload: arr,
                downloaded
            }
        }
        case ImagesActionTypes.UPLOADING_IMAGES: {
            let act = action as UploadingImagesType;
            let uploading = Array.from(state.uploading);
            let toUpload = Array.from(state.toUpload);
            toUpload = toUpload.filter(p => !isImageIncludes(act.images, p));
            uploading.push(...act.images);
            return {
                ...state,
                toUpload,
                uploading
            };
        }
        case ImagesActionTypes.UPLOADED_IMAGE: {
            let act = action as UploadedImagesType;
            let uploading = Array.from(state.uploading);
            let uploaded = Array.from(state.uploaded);
            uploading = uploading.filter(p => !isImageEquals(act.image, p));
            uploaded.push(act.image);
            return {
                ...state,
                uploading,
                uploaded
            };
        }
        case ImagesActionTypes.UPLOAD_IMAGE_FAILED: {
            let act = action as UploadedImageFiledType;
            let uploading = Array.from(state.uploading);
            let failed = Array.from(state.uploadFailed);
            uploading = uploading.filter(p => !isImageEquals(act.image, p));
            failed.push(act.image)
            return {
                ...state,
                uploading,
                uploadFailed: failed
            };
        }
        case ImagesActionTypes.TO_DOWNLOAD_IMAGE: {
            let act = action as ToDownloadImageType;
            if (state.toDownload.concat(state.downloaded.map(p => {
                    return {
                        id: p.id,
                        isPreview: p.preview !== undefined,
                        createdAt: act.image.createdAt
                    }
                }
            )).concat(state.downloading).find(p => deepEqual(p, act.image))) {
                return state;
            }
            let toDownload = Array.from(state.toDownload);
            toDownload.push(act.image);
            return {
                ...state,
                toDownload
            };
        }
        case ImagesActionTypes.DOWNLOADING_IMAGES: {
            let act = action as DownloadingImagesType;
            let toDownload = Array.from(state.toDownload);
            let downloading = Array.from(state.downloading);
            for (let req of act.images) {
                toDownload = toDownload.filter(p => !deepEqual(p, req));
            }
            downloading.push(...act.images);
            return {
                ...state,
                toDownload,
                downloading
            }
        }
        case ImagesActionTypes.DOWNLOADED_IMAGE: {
            let act = action as DownloadedImageType;
            let downloading = state.downloading.filter(p => !deepEqual(p, {
                id: act.image.id,
                isPreview: act.image.preview !== undefined
            }));
            let downloaded = Array.from(state.downloaded);
            downloaded.push(act.image);
            return {
                ...state,
                downloading,
                downloaded
            };
        }
        case ImagesActionTypes.DOWNLOAD_IMAGE_FAILED: {
            let act = action as DownloadImageFailedType;
            let downloading = state.downloading.filter(p => !deepEqual(p, act.image));
            let failed = Array.from(state.downloadFailed);
            failed.push(act.image);
            return {
                ...state,
                downloading,
                downloadFailed: failed
            };
        }
        case ImagesActionTypes.RETRY_IMAGES:
            let toDownload = Array.from(state.downloadFailed);
            toDownload = state.downloadFailed.filter(p => p.createdAt === undefined || Date.now() - p.createdAt.getTime() < 10 * 60 * 1000);
            let toDownloadFailedNew = state.downloadFailed.filter(p => !toDownload.map(p => p.id).includes(p.id));
            let toUpload = Array.from(state.uploadFailed);
            return {
                ...state,
                toDownload,
                downloadFailed: toDownloadFailedNew,
                toUpload,
                uploadFailed: [],
            }
        case ImagesActionTypes.OPEN_ORIGINAL_VIEW: {
            let act = action as OpenOriginalImageViewType;
            return {
                ...state,
                originalView: {
                    id: act.id,
                    createdAt: act.createdAt,
                    isOpen: true
                }
            }
        }
        case ImagesActionTypes.CLOSE_ORIGINAL_VIEW:
            return {
                ...state,
                originalView: {
                    id: "",
                    createdAt: new Date(),
                    isOpen: false
                }
            }
        case ImagesActionTypes.IMAGES_CACHED: {
            function isPreview(image: IImage): boolean {
                return image.preview !== undefined;
            }

            let act = action as ImagesCachedType;
            let downloaded = Array.from(state.downloaded);
            let uploaded = Array.from(state.uploaded);
            for (let image of act.images) {
                downloaded = downloaded.filter(p => !(p.id === image.id && isPreview(p) === isPreview(image)));
                uploaded = uploaded.filter(p => !(p.id === image.id && isPreview(p) === isPreview(image)));
            }
            return {
                ...state,
                downloaded,
                uploaded
            }
        }
        case ProfileActionTypes.LOGOUT:
            return InitialState();
        default:
            return state;
    }
}
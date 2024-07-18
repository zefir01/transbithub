import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IImage, IStore} from "./redux/interfaces";
import {
    DownloadedImage,
    DownloadImageFailed,
    DownloadingImages, ImagesActionTypes,
    UploadedImage,
    UploadedImageFiled,
    UploadingImages
} from "./redux/actions";
import {getToken, apiClient, grpcRunAsync} from "./helpers";
import {GetImageRequest, Image, StoreImageRequest} from "./Protos/api_pb";

export function ImageLoader() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            images: store.images
        }), []
    );
    const {authState, images} = useMappedState(mapState);
    const [uploadRunning, setUploadRunning] = useState(false);
    const [downloadRunning, setDownloadRunning] = useState(false);

    useEffect(() => {
        if (window.imageTimer) {
            return;
        }

        window.imageTimer = setTimeout(async function refreshCallback() {
            dispatch({type: ImagesActionTypes.RETRY_IMAGES})
            window.imageTimer = setTimeout(refreshCallback, 20 * 1000);
        }, 10 * 1000
        );

    }, [dispatch]);

    useEffect(() => {
        if (images.toUpload.length === 0 || authState === AuthState.NotAuthed || uploadRunning) {
            return;
        }
        setUploadRunning(true);

        async function f() {
            try {
                dispatch(UploadingImages(images.toUpload));
                for (let img of images.toUpload) {
                    let req = new StoreImageRequest();
                    req.setId(img.id);

                    let buf = await img.original?.arrayBuffer();
                    if (buf) {
                        let array8 = new Uint8Array(buf);
                        req.setData(array8);
                    } else {
                        console.log("something strange...");
                        continue;
                    }
                    try {
                        let resp = await grpcRunAsync<Image>(apiClient.storeImage, req, getToken(), false);
                        let u8 = resp.getPreview_asU8();
                        let blob = new Blob([u8]);
                        let downloadedImage: IImage = {
                            id: img.id,
                            preview: blob,
                            url: ""
                        }
                        dispatch(DownloadedImage(downloadedImage));
                        dispatch(UploadedImage(img));
                    } catch {
                        dispatch(UploadedImageFiled(img));
                    }
                }
            } finally {
                setUploadRunning(false);
            }
        }

        f();

    }, [authState, images.toUpload, dispatch, uploadRunning]);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || images.toDownload.length === 0 || downloadRunning) {
            return;
        }
        setDownloadRunning(true);

        async function f() {
            dispatch(DownloadingImages(images.toDownload));
            for (let img of images.toDownload) {
                let req = new GetImageRequest();
                req.setId(img.id);
                req.setIspreview(img.isPreview);

                grpcRunAsync<Image>(apiClient.getImage, req, getToken(), false).then(resp => {
                    let url;
                    let preview: Blob | undefined;
                    let original: Blob | undefined;
                    if (resp.getIspreview()) {
                        let arr = resp.getPreview_asU8();
                        preview = new Blob([arr]);
                        url = URL.createObjectURL(preview);
                    } else {
                        let arr = resp.getOriginal_asU8();
                        original = new Blob([arr]);
                        url = URL.createObjectURL(original);
                    }
                    let img: IImage = {
                        id: resp.getId(),
                        url: url,
                        preview: preview,
                        original: original
                    }
                    dispatch(DownloadedImage(img));
                }).catch(err => {
                    dispatch(DownloadImageFailed(img));
                });
            }
            setDownloadRunning(false);
        }

        f();
    }, [authState, images.toDownload, dispatch, downloadRunning])

    return null;
}
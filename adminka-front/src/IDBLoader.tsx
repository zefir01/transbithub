import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useMappedState} from "redux-react-hook";
import {IImage, IStore} from "./redux/interfaces";
import {DBSchema, IDBPDatabase, IDBPObjectStore, openDB} from 'idb';
import {
    IDBStatesActionTypes, IDBStoreOriginalImage,
    IDBStorePreviewImage,
    ImagesCached,
    ToDownloadImage
} from "./redux/actions";
import {StoreNames} from "idb/build/esm/entry";


interface MyDB extends DBSchema {
    previewImages: {
        key: string;
        value: IImage
    };
    originalImages: {
        key: string;
        value: IImage
    };
    userId: {
        key: string;
        value: string;
    }
}

interface MyDbStores {
    previewImages: IDBPObjectStore<MyDB, StoreNames<MyDB>[], "previewImages">
    originalImages: IDBPObjectStore<MyDB, StoreNames<MyDB>[], "originalImages">
}

enum DBStatus {
    Unknown,
    Active,
    Blocking,
    Blocked,
    Terminated
}

export function IDBLoader() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            downloaded: store.images.downloaded,
            uploaded: store.images.uploaded,
            toDownload: store.images.toDownload,
            toUpload: store.images.toUpload,
            authState: store.auth.state,
            userId: store.profile.profile?.userid,
            idbAvailable: store.idbStates.idbAvailable,
            inMemory: store.idbStates.inMemoryImageStore
        }), []
    );
    const {
        downloaded,
        uploaded,
        authState,
        userId,
        idbAvailable,
        inMemory,
        toDownload,
        toUpload
    } = useMappedState(mapState);
    const [cacheRunning, setCacheRunning] = useState(false);

    const {db, status} = useIDB();

    useEffect(() => {
        if (!isIdbInit(status, db, idbAvailable) || downloaded.length + uploaded.length === 0 || cacheRunning) {
            return;
        }
        setCacheRunning(true);

        async function cacheImages(images: IImage[]) {
            for (let image of images) {
                let img: IImage | undefined;
                if (idbAvailable) {
                    let table: StoreNames<MyDB>;
                    if (image.preview !== undefined) {
                        table = "previewImages";
                    } else {
                        table = "originalImages";
                    }
                    img = await db!.get(table, image.id);
                    if (!img) {
                        await db!.put(table, image, image.id);
                    }
                } else {
                    let table: IImage[];
                    if (image.preview !== undefined) {
                        table = inMemory.previewImages;
                    } else {
                        table = inMemory.originalImages;
                    }
                    img = table.find(p => p.id === image.id);
                    if (!img) {
                        if (image.preview !== undefined) {
                            dispatch(IDBStorePreviewImage(image));
                        } else {
                            dispatch(IDBStoreOriginalImage(image));
                        }
                    }
                }
            }
            dispatch(ImagesCached(images));
        }

        async function run() {
            try {
                if (downloaded.length !== 0) {
                    await cacheImages(downloaded);
                }
                if (uploaded.length !== 0) {
                    await cacheImages(uploaded);
                }
                let downPrev = downloaded.find(p => p.preview !== undefined);
                let downOrig = downloaded.find(p => p.preview === undefined);
                let upPrev = uploaded.find(p => p.preview !== undefined);
                let upOrig = uploaded.find(p => p.preview === undefined);
                if (downPrev || upPrev) {
                    dispatch({type: IDBStatesActionTypes.PREVIEW_IMAGES_UPDATED});
                }
                if (downOrig || upOrig) {
                    dispatch({type: IDBStatesActionTypes.ORIGINAL_IMAGES_UPDATED});
                }
            } finally {
                setCacheRunning(false)
            }
        }

        run();

    }, [downloaded, uploaded, db, status, cacheRunning, dispatch, idbAvailable, inMemory.originalImages, inMemory.previewImages, toUpload, toDownload]);

    useEffect(() => {
        if (status !== DBStatus.Active || !db || userId === "" || !idbAvailable) {
            return;
        }
        db.get("userId", "userId").catch(e => {
            console.log(e);
        }).then(async id => {
            if (!id || id !== userId) {
                for (let i = 0; i < db.objectStoreNames.length; i++) {
                    let item = db.objectStoreNames.item(i);
                    if (item === null) {
                        continue;
                    }
                    await db.clear(item);
                }
                await db.put("userId", userId!, "userId");
            }
        }).catch(e => {
            console.log(e);
        });
    }, [userId, status, authState, db, idbAvailable]);


    return null;
}

export function useIDB() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(DBStatus.Unknown);
    const [db, setDb] = useState<IDBPDatabase<MyDB> | null>(null);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.profile?.userid,
            idbAvailable: store.idbStates.idbAvailable,
        }), []
    );
    const {userId, idbAvailable} = useMappedState(mapState);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (isIdbInit(status, db, idbAvailable) || userId === "" || running) {
            return;
        }
        setRunning(true);

        async function openDb() {
            try {
                const db = await openDB<MyDB>('my-db', 1, {
                    upgrade(db) {
                        db.createObjectStore("previewImages");
                        db.createObjectStore("originalImages");
                        db.createObjectStore("userId");
                    },
                    blocking() {
                        //setStatus(DBStatus.Blocking);
                    },
                    blocked() {
                        setStatus(DBStatus.Blocked);
                    },
                    terminated() {
                        setStatus(DBStatus.Terminated);
                    }
                });
                console.log("IDB opened.");
                setDb(db);
                setStatus(DBStatus.Active);
                dispatch({type: IDBStatesActionTypes.IDB_AVAILABLE});
            } catch (e) {
                console.log("IDB not available!");
                console.log(e);
                dispatch({type: IDBStatesActionTypes.IDB_NOT_AVAILABLE});
                setDb(null);
            } finally {
                setRunning(false);
            }
        }

        openDb();
    }, [status, userId, running, dispatch, idbAvailable, db]);

    return {db, status};
}

function isIdbInit(idbStatus: DBStatus, db: IDBPDatabase<MyDB> | null, idbAvailable?: boolean): boolean {
    if (idbAvailable === undefined) {
        return false;
    }
    if (idbAvailable) {
        if (idbStatus !== DBStatus.Active || !db) {
            return false;
        }
    }
    return true;
}

export function useImage(id: string, isPreview: boolean, createdAt?: Date) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            version: isPreview ? store.idbStates.previewImages : store.idbStates.originalImages,
            idbAvailable: store.idbStates.idbAvailable,
            inMemory: store.idbStates.inMemoryImageStore,
        }), [isPreview]
    );
    const {version, idbAvailable, inMemory} = useMappedState(mapState);
    const [image, setImage] = useState<IImage | null>(null);

    const {db, status} = useIDB();

    useEffect(() => {
        async function f() {
            if (!isIdbInit(status, db, idbAvailable) || id === "" || image) {
                return;
            }

            let img: IImage | undefined;
            if (idbAvailable) {
                let table: StoreNames<MyDB>;
                if (isPreview) {
                    table = "previewImages";
                } else {
                    table = "originalImages";
                }
                img = await db!.get(table, id);
            } else {
                let table: IImage[];
                if (isPreview) {
                    table = inMemory.previewImages;
                } else {
                    table = inMemory.originalImages;
                }
                img = table.find(p => p.id === id);
            }
            if (img) {
                let blob = isPreview ? img.preview : img.original;
                setImage({
                    id: img.id,
                    url: URL.createObjectURL(blob),
                    preview: isPreview ? blob : undefined,
                    original: !isPreview ? blob : undefined
                });
            } else {
                setImage(null);
                dispatch(ToDownloadImage({
                    id,
                    isPreview,
                    createdAt
                }));
            }
        }

        f();

    }, [version, id, isPreview, status, db, createdAt, dispatch, image, idbAvailable, inMemory.originalImages, inMemory.previewImages]);

    return image;
}

export function useImages(ids: string[], isPreview: boolean, createdAt?: Date) {
    const mapState = useCallback(
        (store: IStore) => ({
            version: isPreview ? store.idbStates.previewImages : store.idbStates.originalImages,
            idbAvailable: store.idbStates.idbAvailable,
            inMemory: store.idbStates.inMemoryImageStore
        }), [isPreview]
    );
    const {version, idbAvailable, inMemory} = useMappedState(mapState);
    const [images, setImages] = useState<Array<IImage>>([]);

    const {db, status} = useIDB();

    useEffect(() => {
        if (!isIdbInit(status, db, idbAvailable)) {
            return;
        }

        async function f() {
            let toStore = [];
            for (let imgId of ids) {
                if (images.map(p => p?.id).includes(imgId)) {
                    continue;
                }

                let img: IImage | undefined;
                if (idbAvailable) {
                    let table: StoreNames<MyDB>;
                    if (isPreview) {
                        table = "previewImages";
                    } else {
                        table = "originalImages";
                    }
                    img = await db!.get(table, imgId);
                } else {
                    let table: IImage[];
                    if (isPreview) {
                        table = inMemory.previewImages;
                    } else {
                        table = inMemory.originalImages;
                    }
                    img = table.find(p => p.id === imgId);
                }
                if (img) {
                    let blob = isPreview ? img.preview : img.original;
                    let image = {
                        id: img.id,
                        url: URL.createObjectURL(blob),
                        preview: isPreview ? blob : undefined,
                        original: !isPreview ? blob : undefined
                    };
                    toStore.push(image);
                }
            }
            if (toStore.length > 0) {
                let arr = Array.from(images);
                arr.push(...toStore);
                setImages(arr);
            }
            let toRemove: string[] = [];
            for (let imgId of images.map(p => p.id)) {
                if (ids.includes(imgId)) {
                    continue;
                }
                toRemove.push(imgId);
            }
            if (toRemove.length > 0) {
                let arr = Array.from(images);
                arr = arr.filter(p => !toRemove.includes(p.id));
                setImages(arr);
            }
        }

        f();

    }, [version, ids, isPreview, status, db, createdAt, images, idbAvailable, inMemory.previewImages, inMemory.originalImages]);

    return images;
}
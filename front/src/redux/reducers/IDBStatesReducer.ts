import {IDBStates} from "../store/Interfaces";
import {
    IActionBase,
    IDBStatesActionTypes,
    IDBStoreOriginalImageType,
    IDBStorePreviewImageType,
    ProfileActionTypes
} from "../actions";

const initialState = () => {
    return {
        previewImages: 0,
        originalImages: 0,
        idbAvailable: undefined,
        inMemoryImageStore: {
            previewImages: [],
            originalImages: []
        }
    };
};

export function IDBStatesReducer(state: IDBStates = initialState(), action: IActionBase) {
    switch (action.type) {
        case IDBStatesActionTypes.ORIGINAL_IMAGES_UPDATED:
            return {
                ...state,
                originalImages: Date.now()
            };
        case IDBStatesActionTypes.PREVIEW_IMAGES_UPDATED:
            return {
                ...state,
                previewImages: Date.now()
            };
        case IDBStatesActionTypes.IDB_AVAILABLE:
            return {
                ...state,
                idbAvailable: true
            };
        case IDBStatesActionTypes.IDB_NOT_AVAILABLE:
            return {
                ...state,
                idbAvailable: false
            }
        case IDBStatesActionTypes.STORE_PREVIEW_IMAGE: {
            let act = action as IDBStorePreviewImageType;
            let arr = Array.from(state.inMemoryImageStore.previewImages);
            arr = arr.filter(p => p.id !== act.image.id);
            arr.push(act.image);
            return {
                ...state,
                inMemoryImageStore: {
                    ...state.inMemoryImageStore,
                    previewImages: arr
                }
            }
        }
        case IDBStatesActionTypes.STORE_ORIGINAL_IMAGE: {
            let act = action as IDBStoreOriginalImageType;
            let arr = Array.from(state.inMemoryImageStore.originalImages);
            arr = arr.filter(p => p.id !== act.image.id);
            arr.push(act.image);
            return {
                ...state,
                inMemoryImageStore: {
                    ...state.inMemoryImageStore,
                    originalImages: arr
                }
            }
        }
        case ProfileActionTypes.LOGOUT:
            return initialState();
        default:
            return state;
    }
}
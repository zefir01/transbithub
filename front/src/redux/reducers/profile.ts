import {
    ChangeEmailSuccessType,
    IActionBase,
    InvoiceActionTypes,
    LastSearchBuyType,
    LastSearchSellType,
    NewInvoicesPayment,
    ProfileActionTypes,
    ProfileSuccessType,
    SaveProfileGeneralSettingsSuccessType,
    SetDefaultCurrencyType
} from "../actions";
import {IProfile} from "../store/Interfaces";
import {Invoice} from "../../Protos/api_pb";

function initialState(): IProfile {
    return {
        UserId: "",
        Username: "",
        Email: "",
        EnabledTwoFA: false,
        EmailVerifed: false,
        GeneralSettings: {
            timezone: "",
            introduction: "",
            site: "",
            salesDisabled: true,
            buysDisabled: true,
            DefaultCurrency: ""
        },
        LastSearchBuy: null,
        LastSearchSell: null,
        BoughtOptions: null,
        ProfileNeedUpdate: true
    };
}

export function ProfileReducer(
    state: IProfile = initialState(),
    action: IActionBase
): IProfile {
    switch (action.type) {
        case ProfileActionTypes.PROFILE_SUCCESS: {
            let act = action as ProfileSuccessType;
            const ret: IProfile = {
                ...state,
                UserId: act.profile.userid,
                Username: act.profile.username,
                Email: act.profile.email,
                EnabledTwoFA: act.profile.enabledtwofa,
                EmailVerifed: act.profile.emailverifed,
                GeneralSettings: {
                    timezone: act.profile.timezone,
                    introduction: act.profile.introduction,
                    site: act.profile.site,
                    salesDisabled: act.profile.salesdisabled,
                    buysDisabled: act.profile.buysdisabled,
                    DefaultCurrency: act.profile.defaultcurrency
                },
                BoughtOptions: act.profile.boughtoptions!,
                ProfileNeedUpdate: false
            };
            return ret;
        }
        case ProfileActionTypes.PROFILE_ERROR: {
            return initialState();
        }
        case ProfileActionTypes.SAVE_PROFILE_GENERAL_SETTINGS_SUCCESS: {
            let act = action as SaveProfileGeneralSettingsSuccessType;
            return {
                ...state,
                GeneralSettings: act.settings
            };
        }
        case ProfileActionTypes.TOTP_ENABLE_SUCCESS: {
            return {
                ...state,
                EnabledTwoFA: true
            };
        }
        case ProfileActionTypes.TOTP_DISABLE_SUCCESS: {
            return {
                ...state,
                EnabledTwoFA: false
            };
        }
        case ProfileActionTypes.NEED_TWOFA_PIN: {
            return {
                ...state,
                EnabledTwoFA: true
            }
        }
        case ProfileActionTypes.CHANGE_EMAIL_SUCCESS: {
            let act = action as ChangeEmailSuccessType;
            return {
                ...state,
                Email: act.email,
                EmailVerifed: false
            }
        }
        case ProfileActionTypes.CONFIRM_EMAIL_SUCCESS: {
            return {
                ...state,
                EmailVerifed: true
            }
        }
        case ProfileActionTypes.LAST_SEARCH_SELL: {
            let act = action as LastSearchSellType;
            return {
                ...state,
                LastSearchSell: act.lastSearch,
                LastSearchBuy: state.LastSearchBuy === null ? act.lastSearch : state.LastSearchBuy
            };
        }
        case ProfileActionTypes.LAST_SEARCH_BUY: {
            let act = action as LastSearchBuyType;
            return {
                ...state,
                LastSearchBuy: act.lastSearch,
                LastSearchSell: state.LastSearchSell === null ? act.lastSearch : state.LastSearchSell
            };
        }
        case ProfileActionTypes.SET_DEFAULT_CURRENCY:{
            let act=action as SetDefaultCurrencyType;
            return {
                ...state,
                GeneralSettings:{
                    ...state.GeneralSettings,
                    DefaultCurrency: act.currency
                }
            }
        }
        case InvoiceActionTypes.NEW_INVOICE_PAYMENT:{
            let act = action as NewInvoicesPayment;
            if(act.payment.invoice?.service!==Invoice.ServiceType.NONE){
                return {
                    ...state,
                    ProfileNeedUpdate: true
                };
            }
            return state;
        }
        case ProfileActionTypes.LOGOUT: {
            return initialState();
        }
        default:
            return state;

    }
}
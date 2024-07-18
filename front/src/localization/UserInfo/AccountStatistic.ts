import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    site: string,
    createdAt: string;
    lastOnline: string;
    emailVerified: string;
    verified: string;
    notVerified: string;
    verifiedW: string;
    notVerifiedW: string;
    identityVerified: string;
    verifiedByUsers: string;
    blocked: string;
    self: string;
    account: string;
}

export const data = {
    ru: {
        site: "Сайт",
        createdAt: "Учетная запись создана",
        lastOnline: "В последний раз был онлайн",
        emailVerified: "Email подтвержден",
        verified: "Подтвержден",
        notVerified: "Не подтвержден",
        verifiedW: "Подтверждена",
        notVerifiedW: "Не подтверждена",
        identityVerified: "Личность подтверждена",
        verifiedByUsers: "Доверенный",
        blocked: "Заблокирован пользователями",
        self: " о себе:",
        account: "Учетная запись"
    },
    en: {
        site: "Site",
        createdAt: "Account created at",
        lastOnline: "Last online at",
        emailVerified: "Email confirmed",
        verified: "Confirmed",
        notVerified: "Not confirmed",
        verifiedW: "Confirmed",
        notVerifiedW: "Not confirmed",
        identityVerified: "Identity confirmed",
        verifiedByUsers: "Trusted by users",
        blocked: "Blocked by users",
        self: " about himself:",
        account: "Account"
    }
};
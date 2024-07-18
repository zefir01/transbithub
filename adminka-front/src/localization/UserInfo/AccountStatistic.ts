import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    site: string,
    createdAt: string;
    lastOnline: string;
    emailVerifed: string;
    verifed: string;
    notVerifed: string;
    verifedW: string;
    notVerifedW: string;
    identityVerifed: string;
    verifedByUsers: string;
    blocked: string;
    self: string;
    account: string;
}

export const data = {
    ru: {
        site: "Сайт",
        createdAt: "Учетная запись создана",
        lastOnline: "В последний раз был онлайн",
        emailVerifed: "Email подтвержден",
        verifed: "Подтвержден",
        notVerifed: "Не подтвержден",
        verifedW: "Подтверждена",
        notVerifedW: "Не подтверждена",
        identityVerifed: "Личность подтверждена",
        verifedByUsers: "Доверенный",
        blocked: "Заблокирован пользователями",
        self: " о себе:",
        account: "Учетная запись"
    },
    en: {
        site: "Site",
        createdAt: "Account created at",
        lastOnline: "Last online at",
        emailVerifed: "Email confirmed",
        verifed: "Confirmed",
        notVerifed: "Not confirmed",
        verifedW: "Confirmed",
        notVerifedW: "Not confirmed",
        identityVerifed: "Identity confirmed",
        verifedByUsers: "Trusted by users",
        blocked: "Blocked by users",
        self: " about himself:",
        account: "Account"
    }
};
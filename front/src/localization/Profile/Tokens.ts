import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Title: string;
    Info1: string;
    Info2: string;
    Info3_1: string;
    Info3_2: string;
    Info3_3: string;
    Info4: string;
    KeyCreate: string;
    CreateKey: string;
    NoToken: string;
    Success: string;
    RemoveToken: string;
    RemoveSuccess: string;
}

export const data = {
    ru: {
        Title: "Ключ доступа сторонних приложений",
        Info1: "Вы можете создать ключ для использования в сторонних приложениях и API. Ключ действителен 3 месяца. Через три месяца необходимо создать новый ключ.",
        Info2: "Один пользователь может создать один ключ. При создании нового ключа, старый удаляется.",
        Info3_1: "Ключ отображается полностью, ",
        Info3_2: "только первый час после создания",
        Info3_3: ", Если вы потеряли его, создайте новый.",
        Info4: "Внимание! Будьте крайне осторожны с приватностью ключа. Зная его, злоумышленники смогут получить доступ к вашему кошельку.",
        KeyCreate: "Создание ключа",
        CreateKey: "Создать ключ",
        NoToken: "Ключ пока не создан",
        Success: "Ключ успешно создан",
        RemoveToken: "Удалить ключ",
        RemoveSuccess: "Ключ успешно удален",
    },
    en:{
        Title: "Third-Party Application Key",
        Info1: "You can create a key for use in third-party applications and APIs. The key is valid for 3 months. Three months later, you need to create a new key.",
        Info2: "One user can create one key. When creating a new key, the old one is deleted.",
        Info3_1: "The key is fully displayed,",
        Info3_2: "only the first hour after creation",
        Info3_3: ". If you lost it, create a new one.",
        Info4: "Attention! Be extremely careful with the privacy of the key. Knowing him, attackers will be able to access your wallet.",
        KeyCreate: "Key creation",
        CreateKey: "Create key",
        NoToken: "Key not yet created",
        Success: "Key created successfully",
        RemoveToken: "Remove key",
        RemoveSuccess: "Key removed successfully",
    }
};
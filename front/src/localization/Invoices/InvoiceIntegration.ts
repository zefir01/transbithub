import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    use: string;
    use1: string;
    useDesc: string;
    type: string;
    redirect: string;
    webhook: string;
    typeInfo: string;
    typeInfo1: string;
    urlInfo1: string;
    urlInfo2: string;
    clientCert: string;
    clientCertDesc1: string;
    clientCertDesc2: string;
    clientCertDesc3: string;
    clientCertDesc4: string;
    clientCertDesc5: string;
    clientKey: string;
    clientKeyDesc: string;
    serverCert: string;
    serverCertDesc1: string;
    serverCertDesc2: string;
    serverCertDesc3: string;
    serverCertDesc4: string;
    required: string;
    requiredDesc: string;
}

export const data = {
    ru: {
        use: "Использовать",
        use1: "Использовать интеграцию",
        useDesc: "Интеграция позволяет использовать редиректы, вебхуки и контент со сторонних ресурсов при оплате счета.",
        type: "Тип интеграции",
        redirect: "Редирект",
        webhook: "Вебхук",
        typeInfo: "Редирект позволяет перенаправить покупателя на указанный URL после успешной покупки.",
        typeInfo1: " Вебхук будет вызван в случае успешной покупки.\n" +
            " Вебхук это POST запрос, с json информацией о покупке, такой как: Счет, Платеж,\n" +
            " Информация о покупателе, количество и время купленного.\n" +
            " Через вебхук можно передать контент для отображения покупателю.",
        urlInfo1: "На этот URL будет перенаправлен покупатель, в случае успешной покупки.",
        urlInfo2: "URL на который будет отправлен POST запрос.",
        clientCert: "Сертификат клиента",
        clientCertDesc1: "Ssl сертификат клиента в формате PEM, с которым будет совершен запрос.",
        clientCertDesc2: "Его необходимо проверить на целевом сервере перед обработкой запроса.",
        clientCertDesc3: "Проверка сертификата подтверждает, что запрос пришел именно от ",
        clientCertDesc4: ", а не от мошенника.",
        clientCertDesc5: "Можно использовать самоподписанный сертификат.",
        clientKey: "Ключ сертификата клиента",
        clientKeyDesc: "Ключ будет использован для установления соединения и выполнения запроса.",
        serverCert: "Сертификат сервера",
        serverCertDesc1: "Ssl сертификат сервера в формате PEM.",
        serverCertDesc2: "Он будет проверен при установлении соединения.",
        serverCertDesc3: "Проверка сертификата подтверждает, что запрос будет обработан именно вашим сервером, а не мошенником.",
        serverCertDesc4: "Можно использовать самоподписанный сертификат.",
        required: "Обязательный успешный запрос",
        requiredDesc: "Если этот параметр включен и запрос не выполнен успешно, то покупка отменяется.",

    },
    en: {
        use: "Use",
        use1: "Use integration",
        useDesc: "Integration allows you to use redirects, webhooks and content from third-party resources when paying a invoices.",
        type: "Integration type",
        redirect: "Redirect",
        webhook: "Webhook",
        typeInfo: "Redirect allows you to redirect the buyer to the specified URL after a successful purchase.",
        typeInfo1: " The webhook will be called upon a successful purchase.\n" +
            " A webhook is a POST request, with json information about the purchase, such as: Invoice, Payment,\n" +
            " Information about the buyer, quantity and time of the purchased.\n" +
            " Through the webhook, you can transfer content for display to the buyer.",
        urlInfo1: "The buyer will be redirected to this lesson in case of a successful purchase.",
        urlInfo2: "The URL to which the POST request will be sent.",
        clientCert: "Client certificate",
        clientCertDesc1: "Ssl client certificate in PEM format with which the request will be made.",
        clientCertDesc2: "It needs to be verified on the target server before processing the request.",
        clientCertDesc3: "Checking the certificate confirms that the request came from ",
        clientCertDesc4: ", not from a scammer.",
        clientCertDesc5: "You can use a self-signed certificate.",
        clientKey: "Client certificate key",
        clientKeyDesc: "The key will be used to establish the connection and complete the request.",
        serverCert: "Server certificate",
        serverCertDesc1: "Ssl server certificate in PEM format.",
        serverCertDesc2: "It will be checked when the connection is established.",
        serverCertDesc3: "Certificate verification confirms that the request will be processed by your server, and not by a scammer.",
        serverCertDesc4: "You can use a self-signed certificate.",
        required: "Required successful request",
        requiredDesc: "If this parameter is enabled and the request is not successful, then the purchase is canceled.",
    }
};
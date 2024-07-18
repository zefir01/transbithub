title: Пример авторизации для Net.Core 
description: Подробные инструкции по торговле биткоинами. Объявления, авторизация, сделки на Transbithub.com. Быстро, понятно и безопасно!


#Авторизация для Net.Core

Вот пример авторизации для Net.Core:
```csharp
string token="13266F4D727424F6DB263B2AFC83F47C99614FD6AC562EE2295426B722142B63" //токен авторизации
string host="localhost"; //хост api 
string post="5000"; //порт api

var callCredentials = CallCredentials.FromInterceptor((context, metadata) =>
{
    metadata.Add("Authorization", $"Bearer {token}");
    return Task.CompletedTask;
});

var channelCredentials = ChannelCredentials.Create(new SslCredentials(), callCredentials);
var channelOptions = new GrpcChannelOptions
{
    Credentials = channelCredentials
};
var channel = GrpcChannel.ForAddress($"https://{host}:{port}", channelOptions);
GrpcChannel.ForAddress(config.BackendGrpcUrl, channelOptions);
var tradeClient = new TradeApi.TradeApiClient(channel);

var prof = await tradeClient.GetMyProfileAsync(new Empty()); //получение профиля
```
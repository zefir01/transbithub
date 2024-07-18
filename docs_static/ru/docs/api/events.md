title: API Transbithub работа с событиями
description: Чтение, изменение, удаление событий через API Transbithub



#События

## GetUserEvents
```
message GetUserEventsResponse{
  repeated Event Events = 1;
}

rpc GetUserEvents (google.protobuf.Empty) returns (GetUserEventsResponse);
```
Получение вашего списка событий.

### GetUserEventsResponse
- Events - Список событий.

## MarkEventsAsRead
```
message MarkEventsAsReadRequest {
  repeated uint64 Id = 1;
}

rpc MarkEventsAsRead (MarkEventsAsReadRequest) returns (google.protobuf.Empty);
```
Отметить события как прочитанные. После этого, они будут удалены.

### MarkEventsAsReadRequest
- Id - Номера событий.

# Получение событий в реальном времени

Клиент может получать события в реальном времени, посредством Grpc server-side streaming.
Подключение к потоку происходит посредством вызова соответствующего Api.

Доступны следующие подписки:
- SubscribeVariables
- SubscribeNewEvents  
- SubscribeAdvertisementChanges
- SubscribePublicInvoice

## SubscribeVariables
```
message Variables {
    map<string, Decimal> Variables = 1;
    bool KeepAlive = 2;
}

rpc SubscribeVariables (google.protobuf.Empty) returns (stream Variables);
```

Через эту подписку транслируются изменения переменных, используемых для расчета уравнений цен, цен счетов и т.п.
Это все курсы валют, курсы биткоина, средние значения цен сделок. При вызове этого api, вы обязательно получите текущие
значения переменных, вне зависимости, когда они были изменены.

### Возвращаемое значение
Возвращается поток сообщений Variables. Где:
- Variables - словарь переменных и их значений.
- KeepAlive - поле указывающее, что сообщение пустое. Сообщение с KeepAlive=true отправляется для поддержания соединения.
Просто игнорируйте его.
  
### Переменные
Переменные бывают трех типов:
- Курсы биткоина к доллару с разных криптовалютных бирж:
    - bitstamp_usd
    - binance_usd
    - bkex_usd
    - mxc_usd
    - bittrex_usd
    - bitfinex_usd
- Курсы национальных валют к доллару. Имя переменной, это трёхбуквенный код валюты.
  (их много, поэтому тут нет списка, вы можете посмотреть из при запросе.)
- Средние значения цен сделок по по фиатной валюте, за последние 5 минут. Имя переменной начинается с "AVG_". 

## SubscribeNewEvents
```
message Event {
  uint64 id = 1;
  google.protobuf.Timestamp CreatedAt = 2;
  oneof content {
    Deal DealNew = 3;
    Deal DealStatusChanged = 4;
    Deal DealNewMessage = 5;
    Deal DealFiatPayed = 6;
    Deal DealDisputeCreated = 7;
    Balance Balance = 8;
    bool KeepAlive = 9;
    Invoice InvoiceNew = 10;
    Invoice InvoicePayed = 11;
    Invoice InvoiceDeleted = 12;
    InvoicePayment InvoicePaymentNew = 13;
    Conversation ConversationNewMessage = 14;
    InvoicePayment InvoicePaymentUpdated = 15;
  }
}

rpc SubscribeNewEvents (google.protobuf.Empty) returns (stream Event);
```
Это самая важная подписка. Через нее вы в реальном времени, узнаете о событиях, которые касаются вас. Вам не транслируются 
события, инициатором которых являетесь вы.

### Возвращаемое значение
Возвращается поток сообщений, типа Event. Где:
- id - номер события.
- CreatedAt - Timestamp события.
- DealNew - Была создана новая сделка по вашему объявлению.
- DealStatusChanged - Статут сделки, участником которой вы являетесь, был изменен.
- DealNewMessage - В сделке, участником которой вы являетесь, появилось новое сообщение от Партнера или Арбитра.
- DealFiatPayed - Партнер сообщил, о том что перевел фиатные деньги.
- DealDisputeCreated - Партнер создал диспут.
- Balance - Ваш баланс изменился. Причины могут быть разными, завершилась сделка, оплачен счет, 
  подтвердилась транзакция пополнения и т.п.
- KeepAlive - Если значение True, то событие переслано для поддержания соединения и должно быть проигнорировано клиентом.
- InvoiceNew - Вам выставлен приватный счет.
- InvoicePayed - Ваш приватный счет оплачен.
- InvoiceDeleted - Счет удален.
- InvoicePaymentNew - По вашему счету создан платеж. Кто-то начал оплату вашего счета.
- ConversationNewMessage - Новое сообщение в чате счетов.
- InvoicePaymentUpdated - Платеж изменен. Может его отменили или оплатили, или еще что-то изменилось.

## SubscribeAdvertisementChanges
```
message GetAdvertisementsByIdRequest {
  uint64 Id = 1;
}
message SubscribeAdvertisementChangesResponse {
  oneof content {
    Advertisement Advertisement = 1;
    bool AdDeleted = 2;
    bool KeepAlive = 3;
  }
}

rpc SubscribeAdvertisementChanges (GetAdvertisementsByIdRequest) returns (stream SubscribeAdvertisementChangesResponse);
```
Подписка на изменение объявления. Это полезно перед началом сделки. Это дает больше уверенности, что объявление не изменилось,
пока вы искали объявления и готовили сделку.

### Запрос
- Id - Номер объявления.

### Возвращаемое значение
- Advertisement - Объявление, его текущее состояние.
- AdDeleted - Если True, то объявление было удалено или отключено. Дальнейшее существование подписки бессмысленно.
- KeepAlive - Если значение True, то событие переслано для поддержания соединения и должно быть проигнорировано клиентом.

## SubscribePublicInvoice
```
message SubscribePublicInvoiceRequest{
  uint64 InvoiceId = 1;
}
message SubscribePublicInvoiceResponse {
  oneof content {
    Invoice Invoice = 1;
    bool InvoiceDeleted = 2;
    bool KeepAlive = 3;
  }
}

rpc SubscribePublicInvoice(SubscribePublicInvoiceRequest) returns(stream SubscribePublicInvoiceResponse);
```
Подписка на изменение публичного счёта. Это полезно перед началом оплаты счета. Это дает больше уверенности, что счет не изменился,
пока вы готовились к оплате.

### Запрос
- InvoiceId - Номер объявления.

### Возвращаемое значение
- Invoice - Публичный счет, его текущее состояние.
- InvoiceDeleted - Если True, то счет был удален. Дальнейшее существование подписки бессмысленно.
- KeepAlive - Если значение True, то событие переслано для поддержания соединения и должно быть проигнорировано клиентом.


## Пример
```
var stream = GrpcClients.TradeClient.SubscribeNewEvents(new Empty(), 
  Metadata.Empty, DateTime.MaxValue, cancellationTokenSource.Token);
await foreach (var response in stream.ResponseStream.ReadAllAsync())
{
    if (response.KeepAlive)
        continue;
    logger.LogDebug($"New event received. id={response.Id}");
    Console.WriteLine(response.ContentCase);
    switch (response.ContentCase)
    {
        case Event.ContentOneofCase.None:
            break;
        case Event.ContentOneofCase.DealNew:
            break;
        case Event.ContentOneofCase.DealStatusChanged:
            break;
        case Event.ContentOneofCase.DealNewMessage:
            break;
        case Event.ContentOneofCase.DealFiatPayed:
            break;
        case Event.ContentOneofCase.DealDisputeCreated:
            break;
        case Event.ContentOneofCase.Balance:
            break;
        case Event.ContentOneofCase.KeepAlive:
            break;
        case Event.ContentOneofCase.InvoiceNew:
            break;
        case Event.ContentOneofCase.InvoicePayed:
            break;
        case Event.ContentOneofCase.InvoiceDeleted:
            break;
        case Event.ContentOneofCase.InvoicePaymentNew:
            break;
        case Event.ContentOneofCase.ConversationNewMessage:
            break;
        case Event.ContentOneofCase.InvoicePaymentUpdated:
            break;
        default:
          throw new ArgumentOutOfRangeException();
    }
}
```
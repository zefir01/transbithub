title: API Transbithub работа со счетами
description: Чтение, создание, выставление и удаление счетов через API Transbithub


#Счета

## CreateInvoice
```
message CreateInvoiceSecretRequest{
  uint64 InvoiceId = 1;
  string Text = 2;
  repeated string Images = 3;
  uint32 Order = 4;
}
message Webhook{
  string ClientCrt = 1;
  string ClientKey = 2;
  string ServerCrt = 3;
  string Url = 4;
  bool Required = 5;
}
message CreateInvoiceRequest {
  bool isPrivate = 1;
  bool isBaseCrypto = 2;
  string UserName = 3;
  Decimal Price = 4;
  string FiatCurrency = 5;
  string PriceVariable = 6;
  uint32 TtlMinutes = 7;
  string Comment = 8;
  uint32 PiecesMin = 9;
  uint32 PiecesMax = 10;
  bool LimitLiquidity = 11;
  repeated string Images = 12;
  repeated CreateInvoiceSecretRequest Secrets = 13;
  oneof Integration{
    bool NoIntegration = 14;
    string Redirect = 15;
    Webhook Webhook = 16;
  }
}
message Invoice {
  enum InvoiceStatus
  {
    Active = 0;
    PendingPay = 1;
    NoPieces = 2;
    Payed = 3;
    Deleted = 4;
  }
  enum ServiceType
  {
    None = 0;
    AutoPrice = 1;
  }
  uint64 Id = 1;
  bool isPrivate = 2;
  bool isBaseCrypto = 3;
  Decimal Price = 4;
  string FiatCurrency = 5;
  string PriceVariable = 6;
  uint32 TtlMinutes = 7;
  string Comment = 8;
  uint32 PiecesMin = 9;
  uint32 PiecesMax = 10;

  InvoiceStatus Status = 11;
  Decimal TotalPayedCrypto = 12;
  uint32 PaymentsCount = 13;
  UserInfo Owner = 14;
  oneof NullableTargetUser{
    bool TargetUserIsNull = 15;
    UserInfo TargetUser = 16;
  }
  google.protobuf.Timestamp CreatedAt = 17;
  google.protobuf.Timestamp ValidTo = 18;
  Decimal Fee = 19;
  bool LimitLiquidity = 20;
  Decimal CurrentCryptoPrice = 21;
  oneof NullableRefund{
    bool RefundIsNull = 22;
    uint64 RefundPaymentId = 23;
  }
  ServiceType Service = 24;
  repeated string Images = 25;
  uint32 SecretsCount = 26;
  oneof Integration{
    bool NoIntegration = 27;
    string Redirect = 28;
    Webhook Webhook = 29;
  }
}

rpc CreateInvoice (CreateInvoiceRequest) returns (Invoice);
```
Создание счета.

### CreateInvoiceSecretRequest
- InvoiceId - Номер счета. Игнорируется в методе CreateInvoice.
- Text - Текст секрета. Покупатель увидит его после покупки секрета.
- Images - Список GUID изображений, которые будут отображаться покупателю, после покупки секрета.
- Order - Номер в очереди секретов. Чем меньше номер, тем быстрее будет продан секрет.

### Webhook
- ClientCrt - сертификат клиента, с которым будет выполняться запрос.
- ClientKey - ключ сертификата клиента.
- ServerCrt - сертификат сервера, который будет проверен при выполнении запроса.
- Url - URL на который будет сделан POST запрос.
- Required - Если True, то если запрос не выполнен успешно, покупка завершится с ошибкой. 

### CreateInvoiceRequest
- isPrivate - Если True, счет будет приватным, если False, то счет будет публичным. 
- isBaseCrypto - Если True, счет будет в криптовалюте (сумма не будет меняться, с курсами валют и курсом биткоина). 
  Если нет, то будет поддерживаться заданная сумма в фиатной валюте, путем изменения суммы в биткоинах (в зависимости от курса).
- UserName - Если счет приватный, то обязательно нужно указать имя пользователя, которому счет выставляется. Если счет публичный,
  поле будет проигнорировано.
- Price - Для приватного счета, сумма счета в фиатной валюте(isBaseCrypto=false) или в биткоинах(isBaseCrypto=true). 
  Если счет публичный, то цена за одну часть, в фиатной валюте (isBaseCrypto=false) или в биткоинах(isBaseCrypto=true). 
- FiatCurrency - Если счет в фиатной валюте, то тут указывается трёхбуквенный код валюты. [(ISO 4217)](/api/catalog#currencies)
- PriceVariable - Если счет в фиатной валюте, переменная, которая будет использована для получения курса биткоина к доллару.
- TtlMinutes - Количество минут, через которое счет будет автоматически удален. 
- Comment - Комментарий к счету. Здесь можно описать товар или услугу. Если товар продается частями, то значение одной части. 
- PiecesMin - Минимальное количество частей, которое можно купить за один раз.
- PiecesMax - Максимальное количество частей, которое можно купить за один раз.
- LimitLiquidity - Ограничение ликвидности. Если True, то при покупке, PiecesMax будет уменьшено на количество покупаемых частей.
  При отмене покупки, PiecesMax будет увеличено на количество покупаемых частей.
- Images - Список GUID изображений, которые будут отображаться при просмотре счета (до покупки).
- Secrets - Список секретов, которые будут добавлены к счету, при его создании.
- NoIntegration - Если True, то интеграция не используется.
- Redirect - Если интеграция включена, покупатель получит сообщение, что товар он может получить перейдя по URL в этом поле. 
- Webhook - [Смотри](#webhook)

### InvoiceStatus
- Active - Счет активен и может быть оплачен.
- PendingPay - Ожидает оплату (только для приватных счетов).
- NoPieces - Закончились части. Только если LimitLiquidity=true.
- Payed - Счет оплачен (только для приватных счетов).
- Deleted - Счет удален.

### ServiceType
Счет может выть выставлен системой, для оплаты каких либо дополнительных услуг. В этом случае будет указан тип услуги.
- None - Нет услуги.
- AutoPrice - Покупка расчетов Автоцены.

### Invoice
- Id - Номер счета.
- isPrivate - Если True, счет приватный, если False, то счет публичный.
- isBaseCrypto - Если True, счет в криптовалюте (сумма не будет меняться, с курсами валют и курсом биткоина).
  Если нет, то будет поддерживаться заданная сумма в фиатной валюте, путем изменения суммы в биткоинах (в зависимости от курса).
- Price - Для приватного счета, сумма счета в фиатной валюте(isBaseCrypto=false) или в биткоинах(isBaseCrypto=true).
  Если счет публичный, то цена за одну часть, в фиатной валюте (isBaseCrypto=false) или в биткоинах(isBaseCrypto=true).
- FiatCurrency - Если счет в фиатной валюте, то тут указывается трёхбуквенный код валюты. [(ISO 4217)](/api/catalog#currencies)
- PriceVariable - Если счет в фиатной валюте, переменная, которая будет использована для получения курса биткоина к доллару.
- TtlMinutes - Количество минут, через которое счет будет автоматически удален.
- Comment - Комментарий к счету. Здесь можно описать товар или услугу. Если товар продается частями, то значение одной части.
- PiecesMin - Минимальное количество частей, которое можно купить за один раз.
- PiecesMax - Максимальное количество частей, которое можно купить за один раз.
- Status - Текущий статус счета. [Смотрите](#invoicestatus)
- TotalPayedCrypto - Всего оплачено по этому счету в биткоинах.
- PaymentsCount - Количество платежей по счету.
- Owner - Информация о владельце счета.
- TargetUserIsNull - Если счет публичный, то True. 
- TargetUser - Если счет приватный, то тут информация о пользователе, которому он выставлен.
- CreatedAt - Дата и время создания счета.
- ValidTo - Дата и время, до которого счет действителен. После этого времени, счет будет автоматически удален.
- Fee - Комиссия за выставление счета (только для приватных счетов).
- LimitLiquidity - Ограничение ликвидности. Если True, то при покупке, PiecesMax будет уменьшено на количество покупаемых частей.
  При отмене покупки, PiecesMax будет увеличено на количество покупаемых частей.
- CurrentCryptoPrice - Текущая цена в биткоинах.
- RefundIsNull - Если счет не является счетом за возврат товара, то True.
- RefundPaymentId - Если счет выставлен служит для оплаты возврата средств за товар, то в этом поле будет платеж, по которому делается возврат. 
- Service - Если счет выставлен для покупки дополнительных услуг сервиса, то тут будет тип услуги.
- Images - Список GUID изображений, которые прикреплены к счету. Покупатель видит их до оплаты. 
- SecretsCount - Количество не купленных секретов этого счета. 
- NoIntegration - Если интеграция не используется, то True.
- Redirect - Если интеграция включена, покупатель получит сообщение, что товар он может получить перейдя по URL в этом поле.
- Webhook - [Смотрите](#webhook)


## UpdatePublicInvoice
```
message UpdatePublicInvoiceRequest{
  uint64 InvoiceId = 1;
  bool isBaseCrypto = 2;
  Decimal Price = 3;
  string FiatCurrency = 4;
  string PriceVariable = 5;
  string Comment = 6;
  uint32 PiecesMin = 7;
  uint32 PiecesMax = 8;
  bool LimitLiquidity = 9;
  repeated string Images = 10;
  oneof Integration{
    bool NoIntegration = 11;
    string Redirect = 12;
    Webhook Webhook = 13;
  }
}

rpc UpdatePublicInvoice (UpdatePublicInvoiceRequest) returns (Invoice);
```
Изменение публичного счёта.

### UpdatePublicInvoiceRequest
- InvoiceId - Номер счета.
- isBaseCrypto - Если True, счет в криптовалюте (сумма не будет меняться, с курсами валют и курсом биткоина).
- Price - Для приватного счета, сумма счета в фиатной валюте(isBaseCrypto=false) или в биткоинах(isBaseCrypto=true).
  Если счет публичный, то цена за одну часть, в фиатной валюте (isBaseCrypto=false) или в биткоинах(isBaseCrypto=true).
- FiatCurrency - Если счет в фиатной валюте, то тут указывается трёхбуквенный код валюты. [(ISO 4217)](/api/catalog#currencies)
- PriceVariable - Если счет в фиатной валюте, переменная, которая будет использована для получения курса биткоина к доллару.
- Comment - Комментарий к счету. Здесь можно описать товар или услугу. Если товар продается частями, то значение одной части.
- PiecesMin - Минимальное количество частей, которое можно купить за один раз.
- PiecesMax - Максимальное количество частей, которое можно купить за один раз.
- LimitLiquidity - Ограничение ликвидности. Если True, то при покупке, PiecesMax будет уменьшено на количество покупаемых частей.
  При отмене покупки, PiecesMax будет увеличено на количество покупаемых частей.
- Images - Список GUID изображений, которые прикреплены к счету. Покупатель видит их до оплаты.
- NoIntegration - Если интеграция не используется, то True.
- Redirect - Если интеграция включена, покупатель получит сообщение, что товар он может получить перейдя по URL в этом поле.
- Webhook - [Смотрите](#webhook)

## DeleteInvoice
```
message DeleteInvoiceRequest {
  uint64 InvoiceId = 1;
}
message DeleteInvoiceResponse{
  oneof Refund{
    bool  RefundIsNull = 1;
    InvoicePayment PaymentRefund = 2;
  }
}

rpc DeleteInvoice (DeleteInvoiceRequest) returns (DeleteInvoiceResponse);
```
Удаление счета.

### DeleteInvoiceRequest
- InvoiceId - Номер счета.

### DeleteInvoiceResponse
- RefundIsNull - Если счет не являлся возвратом, то True.
- PaymentRefund - Если счет являлся возвратом, то его удаление приводит к отмене платежа возврата. В этом поле будет отмененный платеж.

## GetInvoices
```
message GetInvoicesRequest {
  bool IsOwner = 1;
  bool isOwnerHasValue = 2;
  repeated Invoice.InvoiceStatus Statuses = 3;
  bool isStatusHasValue = 4;
  bool IsPrivate = 5;
  bool IsPrivateHasValue = 6;
  uint64 Id = 7;
  string ToUser = 8;
  uint64 lastId = 9;
  uint32 count = 10;
}
message GetInvoicesResponse {
  repeated Invoice Invoices = 1;
}

rpc GetInvoices (GetInvoicesRequest) returns (GetInvoicesResponse);
```
Поиск счетов по параметрам. Счета отсортированы в порядке убывания ID.  

### GetInvoicesRequest
- IsOwner - Если True, то будут возвращены только счета созданные вами.
- isOwnerHasValue - Если True, то будет учитываться поле IsOwner. Если False, то поле IsOwner будет игнорироваться.
- Statuses - Список статусов возвращаемых счетов. Если список пустой, будут возвращены счета с любым статусом.
- isStatusHasValue - Если True, то будет учитываться поле Status. Если False, то поле Status будет игнорироваться.
- IsPrivate - Если True, то будут возвращены только приватные счета. Если False, то будут возвращены только публичные счета.
- IsPrivateHasValue - Если True, то будет учитываться поле IsPrivate. Если False, то поле IsPrivate будет игнорироваться.
- Id - Номер счета. Если 0, то поле игнорируется.
- ToUser - Имя пользователя, которому выставлен счет. Если пустая строка, то полк будет игнорироваться.
- lastId - Пагинация. Минимальное значение номера счета. Если 0, то поле игнорируется. 
- count - Максимальное количество счетов в ответе.

### GetInvoicesResponse
- Invoices - Список счетов. [Смотрите](#invoice)

## GetInvoiceById
```
message GetInvoiceByIdRequest {
  uint64 InvoiceId = 1;
}

rpc GetInvoiceById(GetInvoiceByIdRequest) returns (GetInvoicesResponse);
```
Поиск счета по его номеру.

### GetInvoiceByIdRequest
- InvoiceId - Номер счета.

## SendInvoiceMessage
```
message SendInvoiceMessageRequest{
  string ToUserId = 1;
  uint64 InvoiceId = 2;
  string Text = 3;
  repeated string ImageIds = 4;
}
message ConversationMessage {
  uint64 Id = 1;
  string OwnerId = 2;
  string Text = 3;
  google.protobuf.Timestamp CreatedAt = 4;
  repeated string Images = 5;
}
message Conversation{
  uint64 Id = 1;
  UserInfo Seller = 2;
  UserInfo Buyer = 3;
  oneof Parent{
    Invoice Invoice = 4;
    InvoicePayment Payment = 5;
  }
  repeated ConversationMessage Messages = 6;
}

rpc SendInvoiceMessage(SendInvoiceMessageRequest) returns (Conversation);
```
Отправить сообщение в переписку связанную со счетом.

### SendInvoiceMessageRequest
- ToUserId - Если сообщение отправляет продавец, то нужно указать какому именно покупателю адресовано сообщение. 
  Если сообщение отправляет покупатель, то это поле игнорируется.  
- InvoiceId - Номер счета.
- Text - Текст сообщения.
- ImageIds - Список GUID изображений, прикрепляемых к сообщению.

### ConversationMessage
- Id - Номер сообщения.
- OwnerId - Id автора сообщения.
- Text - Текст сообщения.
- CreatedAt - Дата создания сообщения.
- Images - Список GUID изображений, прикрепленных к сообщению.

### Conversation
- Id - Номер переписки.
- Seller - Информация о продавце.
- Buyer - Информация о покупателе.
- Invoice - Если переписка создана для счёта, то в этом поле будет информация о счете.
- Payment - Если переписка создана для платежа, то в этом поле будет информация о платеже.
- Messages - Список сообщений.

## GetInvoiceSecrets
```
message GetInvoiceSecretsRequest{
  uint64 InvoiceId = 1;
  bool isSold = 2;
}
message InvoiceSecret{
  uint64 Id = 1;
  string Text = 2;
  repeated string Images = 3;
  uint32 Order = 4;
  oneof NullablePayment{
    bool PaymentIdIsNull = 5;
    uint64 PaymentId = 6;
  }
  string Url = 7;
}
message InvoiceSecretsList{
  repeated InvoiceSecret Secrets = 1;
}

rpc GetInvoiceSecrets(GetInvoiceSecretsRequest) returns (InvoiceSecretsList);
```
Получение секретов счета.

### GetInvoiceSecretsRequest
- InvoiceId - Номер счета.
- isSold - Если True, то будут возвращены проданные секреты. Если False, то будут возвращены непроданные секреты.

### InvoiceSecretsList
- InvoiceSecret - Список секретов.

### InvoiceSecret
- Id - Номер векрета.
- Text - Текст секрета.
- Images - Список GUID изображений.
- Order - Порядковый номер секрета в очереди на продажу.
- PaymentIdIsNull - Если True, то полк PaymentId пустое и секрет еще не продан.
- PaymentId - Номер платежа, по которому секрет продан.
- Url - URL показываемый покупателю для получения товара. Если пустая строка, то игнорируется.

## ChangeInvoiceSecret
```
message ChangeInvoiceSecretRequest{
  enum SecretOperations{
    ToUp = 0;
    ToDown = 1;
    ToTop = 2;
    ToBottom = 3;
    Remove = 5;
  }
  uint64 SecretId = 1;
  SecretOperations Operation = 2;
}
rpc ChangeInvoiceSecret(ChangeInvoiceSecretRequest) returns (InvoiceSecretsList);
```
Проведение операции с секретом.

### SecretOperations
- ToUp - Переместить секрет в очереди продаж на одну позицию вверх. (будет продан раньше)
- ToDown - Переместить секрет в очереди продаж на одну позицию вниз. (будет продан позже)
- ToTop - Переместить секрет в очереди продаж на первое место.
- ToBottom - Переместить секрет в очереди продаж на последнее место.
- Remove - Удалить секрет.

### ChangeInvoiceSecretRequest
- SecretId - Номер секрета.
- Operation - Операция, которую нужно выполнить с секретом.

## CreateInvoiceSecret
```
message CreateInvoiceSecretRequest{
  uint64 InvoiceId = 1;
  string Text = 2;
  repeated string Images = 3;
  uint32 Order = 4;
}

rpc CreateInvoiceSecret(CreateInvoiceSecretRequest) returns (InvoiceSecretsList);
```
Создать секрет и добавить его к счету. Возвращается список всех секретов счета.

### CreateInvoiceSecretRequest
- InvoiceId - Номер счета.
- Text - Текст секрета.
- Images - Список GUID изображений.
- Order - Порядковый номер секрета в очереди на продажу.

## UpdateInvoiceSecret
```
message UpdateInvoiceSecretRequest{
  uint64 SecretId = 2;
  string Text = 3;
  repeated string Images = 4;
  uint32 Order = 5;
}

rpc UpdateInvoiceSecret(UpdateInvoiceSecretRequest) returns (InvoiceSecretsList);
```
Изменить секрет. Возвращается список всех секретов счета.

### UpdateInvoiceSecretRequest
- SecretId - Номер секрета.
- Text - Текст секрета.
- Images - Список GUID изображений.
- Order - Порядковый номер секрета в очереди на продажу.
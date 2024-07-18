title: API Transbithub второстепенные функции
description: Второстепенные функции API Transbithub


#Остальное

## GetVariables
```
message Variables {
  map<string, Decimal> Variables = 1;
  bool KeepAlive = 2;
}

rpc GetVariables(google.protobuf.Empty) returns (Variables);
```
Получение списка переменных, используемых для расчета цен объявлений, счетов и т.д.

### Variables
- Variables - Словарь переменных.
- KeepAlive - В методе GetVariables, не используется.

## GetLastAdSearchParams
```
message LastAdSearchParams{
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  Decimal Amount = 4;
}
message GetLastAdSearchParamsResponse{
  bool LastBuySearchHasValue = 1;
  bool LastSellSearchHasValue = 2;
  LastAdSearchParams LastBuySearch = 3;
  LastAdSearchParams LastSellSearch = 4;
}

rpc GetLastAdSearchParams(google.protobuf.Empty) returns (GetLastAdSearchParamsResponse);
```
Получение параметров последнего поиска объявлений.

### LastAdSearchParams
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- Amount - Сумма.

### GetLastAdSearchParamsResponse
- LastBuySearchHasValue - Если False, то поле LastBuySearch пустое.
- LastSellSearchHasValue - Если False, то поле LastSellSearch пустое.
- LastBuySearch - Параметры последнего поиска объявлений о покупке биткоинов.
- LastSellSearch - Параметры последнего поиска объявлений о продаже биткоинов.


## GetConversations
```
message GetConversationsResponse{
  repeated Conversation Conversations = 1;
}

rpc GetConversations(google.protobuf.Empty) returns (GetConversationsResponse);
```
Получение всех ваших переписок.

### GetConversationsResponse
- Conversations - Список переписок. [Сотрите](/api/invoicePayments#conversation)

## GetConversationsById
```
message GetConversationsByIdRequest{
  oneof Ids{
    uint64 InvoiceId = 1;
    uint64 PaymentId = 2;
    string UserId = 3;
  }
}

rpc GetConversationsById(GetConversationsByIdRequest) returns (GetConversationsResponse);
```
Получение переписок по номеру счета, платежа, ID пользователя.
### GetConversationsByIdRequest
- InvoiceId - Номер счета.
- PaymentId - Номер плтежа.
- UserId - ID пользователя

## DeleteConversation
```
message DeleteConversationRequest{
  uint64 ConversationId = 1;
}

rpc DeleteConversation(DeleteConversationRequest) returns (google.protobuf.Empty);
```
Удаление переписки. Если другой пользователь напишет в удаленную вами переписку, то переписка снова будет доступна. 

### DeleteConversationRequest
- ConversationId - Номер переписки.


## BuyAutoPriceRecalcs
```
message BuyAutoPriceRecalcsRequest{
  uint32 Recalcs = 1;
}

rpc BuyAutoPriceRecalcs(BuyAutoPriceRecalcsRequest) returns (Invoice);
```
Получить счет на покупку расчетов Автоцены. [Смотрите](/trading/autoPrice)

### BuyAutoPriceRecalcsRequest
- Recalcs - Количество покупаемых расчетов.
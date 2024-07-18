title: API Transbithub работа с платежами по счетам
description: Чтение, создание, платежей по счетам через API Transbithub


#Платежи по счетам

## GetInvoicePayments
```
message GetInvoicePaymentsRequest{
  uint64 PaymentId = 1;
  bool IsToMe = 2;
  bool IsToMeHasValue = 3;
  uint64 LastId = 4;
  uint32 Count = 5;
}
message InvoicePayment{
  enum InvoicePaymentStatus
  {
    Pending = 0;
    Paid = 1;
    Canceled = 2;
  }
  uint64 Id = 1;
  Decimal CryptoAmount = 2;
  google.protobuf.Timestamp CreatedAt = 3;
  string Confirmation = 4;
  UserInfo Owner = 5;
  Invoice Invoice = 6;
  oneof NullableSellerFeedback{
    bool SellerFeedbackIsNull = 7;
    InvoicePaymentFeedback SellerFeedback = 8;
  }
  oneof NullableOwnerFeedback{
    bool OwnerFeedbackIsNull = 9;
    InvoicePaymentFeedback OwnerFeedback = 10;
  }
  InvoicePaymentStatus Status = 11;
  oneof NullableDeal{
    bool DealIsNull = 12;
    Deal Deal = 13;
  }
  uint32 Pieces = 14;
  bool IsRefund = 16;
  repeated Invoice Refunds = 17;
  uint32 Refunded = 18;
  uint32 Refunding = 19;
  string OddPromise = 20;
  repeated InvoiceSecret Secrets = 21;
  string LNInvoice = 22;
}
message GetInvoicePaymentsResponse{
  repeated InvoicePayment Payments = 1;
}

rpc GetInvoicePayments(GetInvoicePaymentsRequest) returns (GetInvoicePaymentsResponse);
```
Поиск платежей по счетам. Возвращаются платежи отсортированные по убыванию времени создания.

### GetInvoicePaymentsRequest
- PaymentId - Номер платежа.
- IsToMe - Если True, то возвращаются платежи вам. Если False, то возвращаются платежи от вас. 
- IsToMeHasValue - Если False, то поле IsToMe игнорируется.
- LastId - Пагинация. Минимальный номер платежа в выдаче.
- Count - Пагинация. Максимальное количество платежей в выдаче. Максимальное значение: 100.

### InvoicePaymentStatus
- Pending - Ожидается оплата. Покупка начата.
- Paid - Оплачен. Покупка завершена.
- Canceled - Отменен. Покупка отменена.

### InvoicePayment
- Id - Номер платежа.
- CryptoAmount - Сумма в биткоинах.
- CreatedAt - Дата и время создания.
- Confirmation - Подтверждение оплаты, подписанное pgp.
- Owner - Информация о покупателе, создателе платежа.
- Invoice - Информация о счете, который оплачивается.
- SellerFeedbackIsNull - Если True, то поле SellerFeedback пустое.
- SellerFeedback - Отзыв продавца о продаже.
- OwnerFeedbackIsNull - Если True, то поле OwnerFeedback пустое.
- OwnerFeedback - Отзыв покупателя о покупке.
- Status - Статус платежа.
- DealIsNull - Если True, то поле Deal пустое.
- Deal - Если оплата производится фиатной валютой, через сделку, то в этом поле будет информация о сделке.  
- Pieces - Количество покупаемых частей.
- IsRefund - Если True, то производится оплата счета на возврат средств за покупку.
- Refunds - Список счетов на возврат средств по этому платежу.
- Refunded - Количество купленных частей, за которые был осуществлен возврат средств.
- Refunding - Количество купленных частей, возврат средств за которые начат, но еще не завершен.
- OddPromise - Если оплата производилась Промисом и тип сдачи Промис, то в этом поле будет Промис со сдачей.
- Secrets - Купленные секреты.
- LNInvoice - Если оплата товара производилась через Lightning Network, в этом поле будет BOLT11 приглашение к оплате.

### GetInvoicePaymentsResponse
- Payments - Список платежей.

## SendInvoicePaymentFeedback
```
message InvoicePaymentFeedback{
  uint64 id = 1;
  bool IsPositive = 2;
  string Message = 3;
}
message SendInvoicePaymentFeedbackRequest{
  uint64 PaymentId = 1;
  InvoicePaymentFeedback Feedback = 2;
}

rpc SendInvoicePaymentFeedback(SendInvoicePaymentFeedbackRequest) returns (InvoicePayment);
```
Оставить отзыв о покупке/продаже.

### InvoicePaymentFeedback
- id - Номер отзыва. Игнорируется в методе SendInvoicePaymentFeedback.
- IsPositive - Если True, то отзыв положительный. Если False, то отзыва отрицательный.
- Message - Текст отзыва. Максимум 500 символов.

### SendInvoicePaymentFeedbackRequest
- PaymentId - Номер платежа.
- Feedback - Отзыв.

### PayInvoiceFromBalance
```
message PayInvoiceFromBalanceRequest{
  uint64 InvoiceId = 1;
  uint32 Pieces = 2;
}

rpc PayInvoiceFromBalance(PayInvoiceFromBalanceRequest) returns (InvoicePayment);
```
Оплата с баланса.

### PayInvoiceFromBalanceRequest
- InvoiceId - Номер счета.
- Pieces - Количество покупаемых частей.

## PayInvoiceByBestDeal
```
message PayInvoiceByBestDealRequest{
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  uint64 InvoiceId = 4;
  uint32 Pieces = 5;
}

rpc PayInvoiceByBestDeal(PayInvoiceByBestDealRequest) returns (InvoicePayment);
```
Оплата счета фиатной валютой, через сделку по объявлению с лучшей ценой. Вы указываете страну, фиатную валюту и способ платежа.
Сделка будет создана автоматически, через объявление с лучшей ценой. Завершение сделки, приводит к завершению оплаты и покупки.

### PayInvoiceByBestDealRequest
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- InvoiceId - Номер оплачиваемого счета.
- Pieces - Количество покупаемых частей.

## GetInvoiceSuitableAdvertisements
```
message GetInvoiceSuitableAdvertisementsRequest{
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  uint64 InvoiceId = 4;
  uint32 Pieces = 5;
  uint32 Skip = 6;
  uint32 Count = 7;
}
message GetInvoiceSuitableAdvertisementResponse{
  repeated Advertisement Advertisements = 1;
}

rpc GetInvoiceSuitableAdvertisements(GetInvoiceSuitableAdvertisementsRequest) returns (GetInvoiceSuitableAdvertisementResponse);
```
Поиск объявлений, подходящих для оплаты указанного счета фиатной валютой. Результат отсортирован по ухудшению цены.

### GetInvoiceSuitableAdvertisementsRequest
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- InvoiceId - Номер счета.
- Pieces - Количество частей.
- Skip - Пагинация. Сколько объявлений пропустить в выдаче.
- Count - Максимальное количество объявлений в ответе. Максимальное значение: 100.

### GetInvoiceSuitableAdvertisementResponse
- Advertisements - Список подходящих объявлений.

## PayInvoiceByDeal
```
message PayInvoiceByDealRequest{
  uint64 InvoiceId = 1;
  uint32 Pieces = 2;
  uint64 AdvertisementId = 3;
}

rpc PayInvoiceByDeal(PayInvoiceByDealRequest) returns (InvoicePayment);
```
Оплата счета фиатной валютой, через указанное объявление.

### PayInvoiceByDealRequest
- InvoiceId - Номер счета.
- Pieces - Количество частей.
- AdvertisementId - Номер объявления.

## CancelInvoicePayment
```
message CancelInvoicePaymentRequest{
  uint64 PaymentId = 1;
}

rpc CancelInvoicePayment(CancelInvoicePaymentRequest) returns (InvoicePayment);
```
Отмена платежа.

### CancelInvoicePaymentRequest
- PaymentId - Номер платежа.

## SendInvoicePaymentMessage
```
message SendInvoicePaymentMessageRequest{
  uint64 PaymentId = 1;
  string Text = 2;
  repeated string ImageIds = 3;
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

rpc SendInvoicePaymentMessage(SendInvoicePaymentMessageRequest) returns (Conversation);
```
Отправка сообщения в переписку связанную с платежом.

### SendInvoicePaymentMessageRequest
- PaymentId - Номер платежа.
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

## CreateRefund
```
message CreateRefundRequest{
  uint64 PaymentId = 1;
  uint32 Pieces = 2;
}
message CreateRefundResponse{
  InvoicePayment Payment = 1;
  Invoice Refund = 2;
}

rpc CreateRefund(CreateRefundRequest) returns (CreateRefundResponse);
```
Создание счета на возврат средств.

### CreateRefundRequest
- PaymentId - Номер платежа, по которому делается возврат.
- Pieces - Количество частей, средства за которые нужно вернуть.

### CreateRefundResponse
- Payment - Информация о платеже, по которому создан возврат.
- Refund - Информация и счете, оплата которого приведет к возврату средств.


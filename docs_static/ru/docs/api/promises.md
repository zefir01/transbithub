title: API Transbithub работа с Промисами
description: Создание и использование Промисов через API Transbithub


#Промисы

## CreatePromise
```
message CreatePromiseRequest{
  Decimal Amount = 1;
  string Password = 2;
}
message Balance {
  Decimal Confirmed = 1;
  Decimal UnConfirmed = 2;
  Decimal Deposited = 3;
}
message CreatePromiseResponse{
  string Promise = 1;
  Balance Balance = 2;
}

rpc CreatePromise(CreatePromiseRequest) returns (CreatePromiseResponse);
```
Создание Промиса. Биткоины вычитаются из вашего баланса, и помещаются в Промис.

### CreatePromiseRequest
- Amount - Сумма Промиса.
- Password - Пароль Промиса. Если пустая строка, то будет создан незащищенный Промис.

### Balance
Confirmed - Подтвержденный баланс в биткоинах. Доступен для использования. 
UnConfirmed - Неподтвержденный баланс. Сумма транзакций пополнения кошелька, ожидающих необходимое количество подтверждений.
Deposited - Депонированный баланс. Сумма всех зарезервированных сделками средств.

### CreatePromiseResponse
- Promise - Промис.
- Balance - Ваш баланс.

## PromiseToBalance
```
message PromiseToBalanceRequest{
  string Promise = 1;
  string Password = 2;
}

rpc PromiseToBalance(PromiseToBalanceRequest) returns (Balance);
```
Зачисление Промиса на баланс.

### PromiseToBalanceRequest
- Promise - Промис.
- Password - Пароль Промиса. Если Промис не защищен, то поле игнорируется.

## PromiseSellByBestDeal
```
message PromiseSellByBestDealRequest{
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  string Promise = 4;
  string Password = 5;
}

rpc PromiseSellByBestDeal(PromiseSellByBestDealRequest) returns (Deal);
```
Продать Промис за фиатную валюту по объявлению с лучшей ценой. Будет автоматически создана сделка, на сумму Промиса.

### PromiseSellByBestDealRequest
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- Promise - Промис.
- Password - Пароль Промиса. Если Промис не защищен, то поле игнорируется.

### Deal
[Смотрите](/api/deals#deal)

## GetPromiseSuitableAdvertisements
```
message GetPromiseSuitableAdvertisementsRequest{
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  string Promise = 4;
  string Password = 5;
  uint32 Skip = 6;
  uint32 Count = 7;
}
message GetPromiseSuitableAdvertisementsResponse{
  repeated Advertisement Advertisements = 1;
  repeated Decimal FiatAmounts = 2;
  Decimal PromiseAmount = 3;
}

rpc GetPromiseSuitableAdvertisements(GetPromiseSuitableAdvertisementsRequest) returns(GetPromiseSuitableAdvertisementsResponse);
```
Получить список объявлений, подходящих для продажи Промиса. Объявления отсортированы по ухудшению цены.

### GetPromiseSuitableAdvertisementsRequest
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- Promise - Промис.
- Password - Пароль Промиса. Если Промис не защищен, то поле игнорируется.
- Skip - Пагинация. Сколько объявлений пропустить в выдаче.
- Count - Максимальное количество возвращаемых объявлений. Максимальное значение: 100.

### GetPromiseSuitableAdvertisementsResponse
- Advertisements - Список объявлений. 
- FiatAmounts - Список сумм в фиатной валюте, которые вы получите при продаже через объявление.  
- PromiseAmount - Сумма Промиса в биткоинах.

## PromiseSellByDeal
```
message PromiseSellByDealRequest{
  string Promise = 1;
  string Password = 2;
  uint64 AdvertisementId = 3;
}

rpc PromiseSellByDeal(PromiseSellByDealRequest) returns (Deal);
```
Продажа Промиса, через указанное объявление.

### PromiseSellByDealRequest
- Promise - Промис.
- Password - Пароль Промиса. Если Промис не защищен, то поле игнорируется.
- AdvertisementId - Номер объявления.

### Deal
[Смотрите](/api/deals#deal)

## PayInvoiceByPromise
```
message PayInvoiceByPromiseRequest{
  enum OddTypes{
    noOdd = 0;
    toBalance = 1;
    toPromise = 2;
  }
  string Promise = 1;
  string Password = 2;
  uint64 InvoiceId = 3;
  uint32 Pieces = 4;
  OddTypes OddType = 5;
}

rpc PayInvoiceByPromise(PayInvoiceByPromiseRequest) returns (InvoicePayment);
```
Оплата счета Промисом.

### OddTypes
- noOdd - Не получать сдачу.
- toBalance - Получить сдачу на баланс. 
- toPromise - Получить сдачу Промисом. Пароль созданного Промиса, будет тем же, что и у используемого Промиса.

### PayInvoiceByPromiseRequest
- Promise - Промис.
- Password - Пароль Промиса. Если Промис не защищен, то поле игнорируется.
- InvoiceId - Номер счета.
- Pieces - Количество покупаемых частей.
- OddType - Тип получаемой сдачи.

### InvoicePayment
[Смотрите](/api/invoicePayments#invoicepayment)
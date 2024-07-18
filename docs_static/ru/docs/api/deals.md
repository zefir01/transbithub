title: API Transbithub работа со сделками
description: Чтение, создание, изменение, удаление сделок через API Transbithub


#Сделки

## GetMyDeals
```
enum DealStatus {
  Opened = 0;
  Completed = 1;
  Canceled = 2;
  Disputed = 3;
}
message DealMessage {
  uint64 Id = 1;
  google.protobuf.Timestamp CreatedAt = 2;
  string OwnerId = 3;
  string Text = 4;
  repeated string ImageIds = 5;
}
message Deal {
  uint64 Id = 1;
  Decimal FiatAmount = 2;
  Decimal CryptoAmount = 3;
  google.protobuf.Timestamp CreatedAt = 4;
  DealStatus Status = 5;
  google.protobuf.Timestamp CompletedAt = 6;
  google.protobuf.Timestamp CanceledAt = 7;
  google.protobuf.Timestamp DisputedAt = 8;
  bool IsFiatPayed = 10;
  uint64 DisputeId = 11;
  Advertisement Advertisement = 12;
  UserInfo AdOwnerInfo = 13;
  UserInfo Initiator = 14;
  repeated DealMessage Messages = 15;
  string Fee = 16;
  oneof AdOwnerFeedbackNullable{
    bool AdOwnerFeedbackIsnull = 17;
    Feedback AdOwnerFeedback = 18;
  }
  oneof InitiatorFeedbackNullable{
    bool InitiatorFeedbackIsNull = 19;
    Feedback InitiatorFeedback = 20;
  }
  google.protobuf.Timestamp FiatPayedAt = 21;
  oneof NullablePayment{
    bool PaymentIsNull = 22;
    InvoicePayment Payment = 23;
  }
  oneof Withdrawal{
    string Promise = 24;
    string BitcoinAddress = 25;
    bool NoWithdrawal = 26;
  }
}
message GetMyDealsRequest {
  repeated DealStatus Status = 1;
  uint64 DealId = 2;
  int32 LoadCount = 3;
}
message GetMyDealsResponse {
  repeated Deal Deals = 1;
}

rpc GetMyDeals (GetMyDealsRequest) returns (GetMyDealsResponse);
```

Запрос ваших сделок. Сортировка по убыванию даты.

### GetMyDealsRequest
- Status - Список статусов сделок, которые должны быть выданы.
- DealId - Номер сделки. Если 0, то игнорируется.
- LoadCount - Количество сделок в выдаче. Если 0, то игнорируется.

### DealStatus
- Opened - Сделка открыта.
- Completed - Сделка успешно завершена. 
- Canceled - Сделка отменена.
- Disputed - Создан диспут. Этот статус может изменить только Арбитр.

### DealMessage
- Id - Номер сообщения.
- CreatedAt - Дата и время создания сообщения.
- OwnerId - Id автора сообщения. Если пустая строка, значит сообщение от арбитра.
- Text - Текст сообщения. Не должен быть пустым, если нет прикрепленных сообщений.
- ImageIds - Список GUID изображений, прикрепленных к сообщению.

### Deal
- Id - Номер сделки.
- FiatAmount - Сумма сделки в фиатной валюте.
- CryptoAmount - Сумма сделки в биткоинах.
- CreatedAt - Дата создания сделки.
- Status - Статус сделки. [Смотрите](/api/deals#getmydealsrequest)
- CompletedAt - Дата и время завершения сделки.
- CanceledAt - Дата и время отмены сделки.
- DisputedAt - Дата и время создания диспута.
- IsFiatPayed - Сообщил ли пользователь, что фиатные деньги отправлены.
- DisputeId - Номер диспута.
- Advertisement - Объявление, по которому создана сделка.
- AdOwnerInfo - Информация о владельце объявления.
- Initiator - Информация об инициаторе сделки.
- Messages - Сообщения в чате сделки.
- Fee - Комиссия за сделку, в биткоинах.
- AdOwnerFeedbackIsnull - Отзыв владельца объявления о сделке с инициатором. Если True, то отзыва нет. 
- AdOwnerFeedback - Отзыв владельца объявления о сделке с инициатором.
- InitiatorFeedbackIsNull - Отзыв инициатора о сделке с владельцем объявления. Если True, то отзыва нет.
- InitiatorFeedback - Отзыв инициатора о сделке с владельцем объявления.
- FiatPayedAt - Если True, то пользователь сообщил, что перевод фифтных денег выполнен.
- PaymentIsNull - Если True, то Payment пустой.
- Payment - Если сделка была создана при оплате счета, то в этом поле будет информация о платеже, связанном со сделкой и счетом.
  Для владельца объявления, всегда пусто.
- Promise - Если при создании сделки, указан вывод средств в Промис, то в этом поле будет Промис, после завершения сделки. 
- BitcoinAddress - Если при создании сделки, указан вывод средств на внешний Bitcoin кошелек, то в этом поле будет адрес кошелька.
- NoWithdrawal - Если при создании сделки, не указан вывод средств, то в этом поле будет True. 

### GetMyDealsResponse
- Deals - Список сделок. [Смотрите](/api/deals#deal)


## CreateDeal
```
message CreateDealRequest {
  uint64 AdvertisementId = 1;
  oneof Amount{
    Decimal FiatAmount = 2;
    Decimal CryptoAmount = 3;
  }
  string SellPromise = 4;
  bool BuyPromise = 5;
  string PromisePassword = 6;
  string BtcWallet = 7;
}
message DealResponse {
  Deal Deal = 1;
}

rpc CreateDeal (CreateDealRequest) returns (DealResponse);
```

Создание сделки.

### CreateDealRequest
- AdvertisementId - Номер объявления.
- FiatAmount - Сумма в фиатной валюте.
- CryptoAmount - Сумма в биткоинах.
- SellPromise - Если продается Промис, то Промис. Или пустая строка.
- BuyPromise - Если True, то в результате завершения сделки, будет создан Промис.
- PromisePassword - Пароль Промиса.
- BtcWallet - Если не пустая строка, то в результате завершения сделки, купленные биткоины будут отправлены на
адрес, указанный в этом поле.

### DealResponse
- Deal - Созданная сделка. [Смотрите](/api/deals#deal)


## GetDealById
```
message GetDealByIdRequest {
  uint64 Id = 1;
}

rpc GetDealById (GetDealByIdRequest) returns (DealResponse);
```

### GetDealByIdRequest
- Id - Номер сделки.

## SendMessage
```
message SendMessageRequest {
  uint64 DealId = 1;
  string Text = 2;
  repeated string ImageIds = 3;
}
message SendMessageResponse {
  DealMessage Message = 1;
}

rpc SendMessage (SendMessageRequest) returns (SendMessageResponse);
```

Отправка сообщения в чат сделки.

### SendMessageRequest
- DealId - Номер сделки.
- Text - Текст сообщения. Максимум 1000 символов.
- ImageIds - Список GUID изображений, прикрепленных к сообщению.

### SendMessageResponse
- Message - Созданное сообщение. [Смотрите](/api/deals#dealmessage)

## CancelDeal
```
message CancelDealRequest {
  uint64 DealId = 1;
}
message CancelDealResponse {
  Deal deal = 1;
}

rpc CancelDeal (CancelDealRequest) returns (CancelDealResponse);
```

Отмена сделки. Вы не можете отменить сделку, если создан диспут, или фиатные деньги отправлены.

### CancelDealRequest
- DealId - Номер сделки.

### CancelDealResponse
- Deal - Сделка. [Смотрите](/api/deals#deal)

## IPayed
```
message IPayedRequest {
  uint64 DealId = 1;
}
message IPayedResponse {
  Deal deal = 1;
}

rpc IPayed (IPayedRequest) returns (IPayedResponse);
```

Если вы та сторона сделки, которая отдает фиатную валюту, то вам нужно сообщить о переводе.
Если вы та сторона сделки, которая отдает фиатную валюту, то вызвав это api, вы сообщите, что получили перевод, и сделка перейдет
в состояние "Завершена", биткоины будут отправлены партнеру.

### IPayedRequest
- DealId - Номер сделки.

### IPayedResponse
- Deal - Сделка. [Смотрите](/api/deals#deal)


## CreateDispute
```
message CreateDisputeRequest {
  uint64 DealId = 1;
}
message CreateDisputeResponse {
  Deal deal = 1;
}

rpc CreateDispute (CreateDisputeRequest) returns (CreateDisputeResponse);
```

Создание диспута.

### CreateDisputeRequest
- DealId - Номер сделки.

### CreateDisputeResponse
- Deal - Сделка. [Смотрите](/api/deals#deal)

## SendFeedback
```
message SendFeedbackRequest {
  uint64 DealId = 1;
  bool IsPositive = 2;
  string Text = 3;
}

rpc SendFeedback (SendFeedbackRequest) returns (Deal);
```

Оставить отзыв о сделке и партнере.

### SendFeedbackRequest
- DealId - Номер сделки.
- IsPositive - Если True, то отзыв позитивный. Если False, то отзыв негативный.
- Text - Текст отзыва. Максимальная длинна 500 символов. 
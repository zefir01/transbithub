title: API Transbithub работа с объявлениями
description: Чтение, создание, изменение, удаление объявлений через API Transbithub


#Объявления

## CreateAdvertisement
Создание объявления.
```
message TimeTableItem {
  string day = 1;
  uint32 start = 2;
  uint32 end = 3;
}
message AdvertisementData{
  string Equation = 2;
  Decimal MinAmount = 3;
  Decimal MaxAmount = 4;
  string Message = 6;
  google.protobuf.Timestamp CreatedAt = 7;
  string Country = 8;
  string PaymentType = 9;
  string FiatCurrency = 10;
  bool IsBuy = 12;
  bool IsEnabled = 13;
  repeated TimeTableItem TimeTable = 15;
  bool MonitorLiquidity = 16;
  bool NotAnonymous = 17;
  bool Trusted = 18;
  string Title = 19;
  uint32 window = 20;
  oneof AutoPrice{
    bool AutoPriceDelayIsNull = 21;
    uint32 AutoPriceDelay = 22;
  }
}
message Advertisement {
  uint64 Id = 1;
  string Equation = 2;
  Decimal MinAmount = 3;
  Decimal MaxAmountRequested = 4;
  Decimal MaxAmountCalculated = 5;
  string Message = 6;
  google.protobuf.Timestamp CreatedAt = 7;
  string Country = 8;
  string PaymentType = 9;
  string FiatCurrency = 10;
  bool IsBuy = 12;
  bool IsEnabled = 13;
  UserInfo Owner = 14;
  repeated TimeTableItem TimeTable = 15;
  bool MonitorLiquidity = 16;
  bool NotAnonymous = 17;
  bool Trusted = 18;
  string Title = 19;
  uint32 window = 20;
  Decimal Price = 21;
  AdCurrentStatus CurrentStatus = 22;
  oneof AutoPrice{
    bool AutoPriceDelayIsNull = 23;
    uint32 AutoPriceDelay = 24;
  }
}

rpc CreateAdvertisement (AdvertisementData) returns (Advertisement);
```

### AdvertisementData
- Equation - Уравнение цены. Возможно просто число, без использования переменных.
- MinAmount - Минимальная сумма сделки по этому объявлению. Не может быть меньше фиатного эквивалента 0.00000001 BTC.
- MaxAmount - Максимальная сумма сделки по этому объявлению. Если объявление о продаже биткоинов и значение 0, 
  то максимальный лимит автоматически ограничивается вашим доступным балансом. Если объявление о покупке, 
  то значение, отличное от нуля, обязательно.   
- Message - Дополнительные условия, пользователь их видит перед созданием сделки. 
- CreatedAt - Дата создания объявления. При создании объявления, не учитывается и значение может быть любым.
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- FiatCurrency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- IsBuy - Тип объявления. Если True, то объявление о покупке биткоинов. Если False, то объявление о продаже биткоинов. 
- IsEnabled - Включено ли объявление. Если объявление выключено, оно не будет отображаться при поиске.
- TimeTable - График работы объявления.
- MonitorLiquidity - Ограничение ликвидности. Если True, то значение MaxAmount будет автоматически уменьшаться на сумму сделки при создании сделки,
  и автоматически увеличиваться на сумму сделки при отмене сделки. Это удобно, если вы хотите продать/купить на определенную сумму. 
- NotAnonymous - Если True, не показывать объявление анонимным пользователям.
- Trusted - Показывать объявление только пользователям из списка "Доверенные".
- Title - Название объявления. Оно будет отображаться в списке объявлений, при поиске.
- window - Окно оплаты. Количество минут, за которое должны быть переведены фиатные деньги, начиная от времени создания сделки.
  Если фиатные деньги не переведены за указанное время, сделка автоматически отменяется.  
- AutoPriceDelayIsNull - Если AutoPrice не используется, то значение должно быть True. Если False, то будет учитываться значение AutoPriceDelay. 
- AutoPriceDelay - Период расчета Автоцены в секундах. Минимальное значение 10сек.  

### Advertisement
- Id - Номер объявления
- Equation - Уравнение цены. Возможно просто число, без использования переменных. 
- MinAmount - Минимальная сумма сделки по этому объявлению. Не может быть меньше фиатного эквивалента 0.00000001 BTC.
- MaxAmountRequested - Максимальная сумма сделки, возможная по этому объявлению, запрошенная пользователем, 
  при создании или изменении объявления.
- MaxAmountCalculated - Фактическая Максимальная сумма сделки, возможная по этому объявлению.
- Message - Дополнительные условия, пользователь их видит перед созданием сделки.
- CreatedAt - Дата создания объявления.
- Country - [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- FiatCurrency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- IsBuy - Тип объявления. Если True, то объявление о покупке биткоинов. Если False, то объявление о продаже биткоинов.
- IsEnabled - Включено ли объявление. Если объявление выключено, оно не будет отображаться при поиске.
- Owner - Информация о владельце объявления.
- TimeTable - График работы объявления.
- MonitorLiquidity - Ограничение ликвидности. Если True, то значение MaxAmount будет автоматически уменьшаться на сумму сделки при создании сделки,
  и автоматически увеличиваться на сумму сделки при отмене сделки. Это удобно, если вы хотите продать/купить на определенную сумму.
- NotAnonymous - Если True, не показывать объявление анонимным пользователям.
- Trusted - Показывать объявление только пользователям из списка "Доверенные".
- Title - Название объявления. Оно будет отображаться в списке объявлений, при поиске.
- window - Окно оплаты. Количество минут, за которое должны быть переведены фиатные деньги, начиная от времени создания сделки.
  Если фиатные деньги не переведены за указанное время, сделка автоматически отменяется.
- Price - Фактическая, расчитанная цена объявления. По этой цене будут создаваться сделки. 
- CurrentStatus - Текущий статус объявления.
- AutoPriceDelayIsNull - Окно оплаты. Количество минут, за которое должны быть переведены фиатные деньги, начиная от времени создания сделки.
  Если фиатные деньги не переведены за указанное время, сделка автоматически отменяется.
- AutoPriceDelay - Период расчета Автоцены в секундах. Минимальное значение 10сек.

### TimeTableItem
- day - Трёхбуквенный код дня недели.
  - san
  - mon
  - tue
  - wed
  - thu
  - fri
  - sat
- start - Номер 15ти минутного интервала, начиная от 00:00. При наступлении этого интервала, объявление будет включено.
- end - Номер 15ти минутного интервала, начиная от 00:00. При наступлении этого интервала, объявление будет выключено.

## DeleteAdvertisement
```
message DeleteAdvertisementRequest {
  uint64 Id = 9;
}

rpc DeleteAdvertisement (DeleteAdvertisementRequest) returns (google.protobuf.Empty);
```
Удаление объявления.

### DeleteAdvertisementRequest
- Id - Номер объявления.

## ChangeAdvertisementStatus
```
message ChangeAdvertisementStatusRequest {
  uint64 AdvertisementId = 1;
  bool IsEnabled = 2;
}
enum AdCurrentStatus {
  Enabled = 0;
  DisabledByOwner = 1;
  NotEnoughMoney = 2;
  GlobalDisabled = 3;
  DisabledByTimetable = 4;
}
message ChangeAdvertisementStatusResponse {
  AdCurrentStatus CurrentStatus = 1;
}

rpc ChangeAdvertisementStatus (ChangeAdvertisementStatusRequest) returns (ChangeAdvertisementStatusResponse);
```
Включение и выключение объявления.

### ChangeAdvertisementStatusRequest
- AdvertisementId - Номер объявления.
- IsEnabled - Если True, то объявление включено. Если False, то объявление выключено.

### ChangeAdvertisementStatusResponse
- CurrentStatus - Статус объявления, после выполнения запроса.

### AdCurrentStatus
- Enabled - Включено. Объявление отображается в поиске.
- DisabledByOwner - Отключено. Объявление принудительно отключено владельцем. Объявление не отображается в поиске. 
- NotEnoughMoney - Объявление отключено автоматически, т.к. доступный баланс меньше минимальной суммы сделки по этому объявлению.
  (Не актуально, для объявлений о покупке биткоинов)
- GlobalDisabled - Установлен режим "Отпуск", все объявления пользователя принудительно отключены.
- DisabledByTimetable - Автоматически отключено по расписанию.

## ModifyAdvertisement
```
message ModifyAdvertisementRequest{
  uint64 AdvertisementId = 1;
  AdvertisementData Data = 2;
}

rpc ModifyAdvertisement (ModifyAdvertisementRequest) returns (Advertisement);
```
Изменение объявления.

### ModifyAdvertisementRequest
- AdvertisementId - Номер объявления.
- Data - [Смотрите](/api/ads#advertisementdata)

### Advertisement
[Смотрите](/api/ads#advertisement)

## GetMyAdvertisements
```
message FindAdvertisementsResponse {
  repeated Advertisement Advertisements = 1;
}

rpc GetMyAdvertisements (google.protobuf.Empty) returns (FindAdvertisementsResponse);
```
Запрос всех ваших объявлений.

### FindAdvertisementsResponse
- Advertisements - Список объявлений. [Смотрите](/api/ads#advertisement)

## GetAdvertisementsById
```
message GetAdvertisementsByIdRequest {
  uint64 Id = 1;
}

rpc GetAdvertisementsById (GetAdvertisementsByIdRequest) returns (Advertisement);
```
Получение объявления по его номеру.

### GetAdvertisementsByIdRequest
- Id - Номер объявления.

### Advertisement
[Смотрите](/api/ads#advertisement)


## GetMyAdvertisementsById
```
message GetAdvertisementsByIdRequest {
  uint64 Id = 1;
}

rpc GetMyAdvertisementsById (GetAdvertisementsByIdRequest) returns (Advertisement);
```
Получение именно вашего объявление, по его номеру.


### GetAdvertisementsByIdRequest
- Id - Номер объявления.

### Advertisement
[Смотрите](/api/ads#advertisement)

## FindAdvertisements
```
message FindAdvertisementsRequest {
  string Country = 1;
  string Currency = 2;
  string PaymentType = 3;
  Decimal FiatAmount = 4;
  Decimal CryptoAmount = 5;
  bool IsBuy = 6;
  string UserId = 7;
  uint32 Skip = 8;
  uint32 Take = 9;
}

rpc FindAdvertisements (FindAdvertisementsRequest) returns (FindAdvertisementsResponse);
```
Поиск объявлений по параметрам. Объявления будут отсортированы по ухудшению цены.

### FindAdvertisementsRequest
- Country - Двухбуквенный код страны [(ISO 3166-1 alpha-2)](/api/catalog#countries).
- Currency - Трёхбуквенный код фиатной валюты. [(ISO 4217)](/api/catalog#currencies)
- PaymentType - Код платежной системы. [(Список)](/api/catalog#paymenttypes)
- FiatAmount - Сумма, на которую вы хотите совершить сделку в фиатной валюте. 
- CryptoAmount - Сумма, на которую вы хотите совершить сделку в биткоинах.
- IsBuy - Если True, то будут выданы объявления о покупке. Если False, то будут выданы объявления о продаже. 
- UserId - Id пользователя, кому принадлежит объявление. Если пустая строка, то параметр не учитывается. 
- Skip - Пагинация. Сколько объявлений пропустить, от начала выдачи.
- Take - Пагинация. Сколько максимум объявлений выдать в ответе. Максимальное значение 100.

### FindAdvertisementsResponse
[Смотрите](/api/ads#getmyadvertisements)


## SubscribeAdvertisementChanges
[Смотрите](/api/events#subscribeadvertisementchanges)

## GetAllAdvertisementsStatus
```
message AllAdvertisementsStatus {
  bool SalesDisabled = 1;
  bool BuysDisabled = 2;
}

rpc GetAllAdvertisementsStatus (google.protobuf.Empty) returns (AllAdvertisementsStatus);
```
Получение глобального значения включения/отключения всех объявлений (режим "Отпуск").

### AllAdvertisementsStatus
- SalesDisabled - Если True, все объявления о продаже биткоинов отключены.
- BuysDisabled - Если True, все объявления о покупке биткоинов отключены.

## SetAllAdvertisementsStatus
```
message AllAdvertisementsStatus {
  bool SalesDisabled = 1;
  bool BuysDisabled = 2;
}

rpc SetAllAdvertisementsStatus (AllAdvertisementsStatus) returns (MyProfileResponse);
```
Глобальное включение/отключение всех объявлений о продаже/покупке биткоинов (режим "Отпуск").

### AllAdvertisementsStatus
- SalesDisabled - Если True, все объявления о продаже биткоинов будут отключены.
- BuysDisabled - Если True, все объявления о покупке биткоинов будут отключены.
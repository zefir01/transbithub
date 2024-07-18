title: API Transbithub работа с пользователями
description: Получение информации о пользователе и редактирование профиля API Transbithub


#Пользователи

## GetUserInfo
```
message UserInfo {
  string Id = 1;
  string Username = 2;
  Decimal TradesAvgAmount = 3;
  uint32 TradesCount = 4;
  uint32 CounterpartysCount = 5;
  Decimal ResponseRate = 6;
  google.protobuf.Timestamp FirstTradeDate = 7;
  google.protobuf.Timestamp CreatedAt = 8;
  google.protobuf.Timestamp LastOnline = 9;
  uint32 TrustedCount = 10;
  uint32 BlockedCount = 11;
  uint32 AvgDelaySeconds = 12;
  uint32 MedianDelaySeconds = 13;
  string Introduction = 14;
  string Site = 15;
  string Timezone = 16;
  bool IsTrusted = 17;
  bool IsBlocked = 18;
  uint32 InvoicesCreatedCount = 19;
  Decimal PaymentsPayedAvgAmount = 20;
  uint32 PaymentsPayedCount = 21;
  Decimal PaymentsReceivedAvgAmount = 22;
  uint32 PaymentsReceivedCount = 23;
  Decimal InvoiceResponseRate = 24;
  bool IsAnonymous = 24;
}
message GetUserInfoRequest {
  string Id = 1;
}
message GetUserInfoResponse {
  UserInfo UserInfo = 1;
}
rpc GetUserInfo (GetUserInfoRequest) returns (GetUserInfoResponse);
```

Запрос информации о пользователе. 

### GetUserInfoRequest
- Id - Id пользователя.

### GetUserInfoResponse
- UserInfo - Информация о пользователе.

### UserInfo
- Id - Id пользователя.
- Username - Имя пользователя.
- TradesAvgAmount - Средняя сумма сделок при торговле биткоинами.
- TradesCount - Количество сделок при торговле биткоинами.
- CounterpartysCount - Количество уникальным пользователей, с которыми была торговля. 
- ResponseRate - Процент положительных отзывов.
- FirstTradeDate - Дата и время первой сделки, при торговле биткоинами.
- CreatedAt - Дата регистрации пользователя.
- LastOnline - Дата и время последней активности.
- TrustedCount - Количество уникальных пользователей, которые добавили этого пользователя в список доверенных.
- BlockedCount - Количество уникальных пользователей, которые добавили этого пользователя в список заблокированных.
- AvgDelaySeconds - Среднее время сделки, при торговле биткоинами.
- MedianDelaySeconds - Медиана времени сделки, при торговле биткоинами.
- Introduction - Описание пользователя, указанное этим пользователем.
- Site - Сайт, который указал пользователь.
- Timezone - Часовой пояс, который указал пользователь.
- IsTrusted - Находится ли этот пользователь в вашем списке доверенных пользователей.
- IsBlocked - Находится ли этот пользователь в вашем списке заблокированных пользователей.
- InvoicesCreatedCount - Количество созданных счетов, этим пользователем.
- PaymentsPayedAvgAmount - Средняя сумма исходящих платежей.
- PaymentsPayedCount - Количество исходящих платежей.
- PaymentsReceivedAvgAmount - Средняя сумма входящих платежей.
- PaymentsReceivedCount - Количество входящих платежей.
- InvoiceResponseRate - Процент положительных отзывов, при выставлении или оплате счетов.
- IsAnonymous - Если True, значит пользователь анонимный.

## GetUserFeedbacks
```
message GetUserFeedbacksRequest {
  string UserId = 1;
  int64 startId = 2;
  int32 count = 3;
  bool IsDealsFeedbacks = 4;
}
message Feedback {
  uint64 Id = 1;
  bool IsPositive = 2;
  string Text = 3;
  google.protobuf.Timestamp CreatedAt = 4;
}
message GetUserFeedbacksResponse {
  repeated Feedback Feedbacks = 1;
}
rpc GetUserFeedbacks (GetUserFeedbacksRequest) returns (GetUserFeedbacksResponse);
```
Запрос отзывов о пользователе.

### GetUserFeedbacksRequest
- UserId - Id пользователя.
- startId - Минимальный номер отзыва.
- count - Максимальное количество отзывов в ответе. Если значение отрицательное, отзывы будут отсортированы по убыванию номера.
- IsDealsFeedbacks - Если True, то будут возвращены отзывы по сделкам. Если False, то будут возвращены отзывы по счетам. 

### Feedback
- Id - Номер отзыва.
- IsPositive - Если True, то отзыв положительный. Если False, то отзыв отрицательный.
- Text - Текст отзыва.
- CreatedAt - Дата и время создания отзыва.

### GetUserFeedbacksResponse
- Feedbacks - Список отзывов.

## AddUserToTrusted
```
message AddUserToTrustedRequest {
  string UserId = 1;
}

rpc AddUserToTrusted (AddUserToTrustedRequest) returns (google.protobuf.Empty);
```
Добавление пользователя в список доверенных пользователей.

### AddUserToTrustedRequest
- UserId - Id пользователя.

## CreateUserComplaint
```
message CreateUserComplaintRequest {
  string UserId = 1;
  string Text = 2;
  string Contact = 3;
}

rpc CreateUserComplaint (CreateUserComplaintRequest) returns (google.protobuf.Empty);
```
Создание жалобы на пользователя. Жалоба будет рассмотрена службой поддержки.

### CreateUserComplaintRequest
- UserId - Id пользователя.
- Text - Текст жалобы.
- Contact - Email или другой контакт для связи.

## BlockUser
```
message BlockUserRequest {
  string UserId = 1;
}

rpc BlockUser (BlockUserRequest) returns (google.protobuf.Empty);
```
Добавление пользователя в список заблокированных пользователей.

### BlockUserRequest
- UserId - Id пользователя.

## UnBlockUser
```
message UnBlockUserRequest {
  string UserId = 1;
}

rpc UnBlockUser (UnBlockUserRequest) returns (google.protobuf.Empty);
```
Удаление пользователя из списка заблокированных пользователей.

### UnBlockUserRequest
- UserId - Id пользователя.

## GetMyBlockedUsers
```
message GetMyBlockedUsersResponse {
  repeated UserInfo Users = 1;
}

rpc GetMyBlockedUsers (google.protobuf.Empty) returns (GetMyBlockedUsersResponse);
```
Получение списка заблокированных пользователей.

### GetMyBlockedUsersResponse
- Users - Список пользователей.

## GetMyTrustedUsers
```
message GetMyTrustedUsersResponse {
  repeated UserInfo Users = 1;
}

rpc GetMyTrustedUsers (google.protobuf.Empty) returns (GetMyTrustedUsersResponse);
```
Получение списка доверенных пользователей.

### GetMyTrustedUsersResponse
- Users - Список пользователей.

## RemoveFromTrustedUsers
```
message RemoveFromTrustedRequest {
  string UserId = 1;
}

rpc RemoveFromTrustedUsers (RemoveFromTrustedRequest) returns (google.protobuf.Empty);
```
Удаление пользователя из списка доверенных пользователей.

### RemoveFromTrustedUsers
- UserId - Id пользователя.

## IsUserTrusted
```
message IsUserTrustedRequest {
  string UserId = 1;
}
message IsUserTrustedResponse {
  bool IsTrusted = 1;
}

rpc IsUserTrusted (IsUserTrustedRequest) returns (IsUserTrustedResponse);
```
Проверка, есть ли пользователь в списке доверенных пользователей.

### IsUserTrustedRequest
- UserId - Id пользователя.

### IsUserTrustedResponse
- IsTrusted - True, если пользователь есть в списке доверенных пользователей. False, если нет.

## IsUserBlocked
```
message IsUserBlockedRequest {
  string UserId = 1;
}
message IsUserBlockedResponse {
  bool IsBlocked = 1;
}

rpc IsUserBlocked (IsUserBlockedRequest) returns (IsUserBlockedResponse);
```
Проверка, есть ли пользователь в списке заблокированных пользователей.

### IsUserBlockedRequest
- UserId - Id пользователя.

### IsUserBlockedResponse
- IsBlocked - True, если пользователь есть в списке заблокированных пользователей. False, если нет.

## IsUserExist
```
message IsUserExistRequest {
  string UserName = 1;
}
message IsUserExistResponse {
  bool isExist = 1;
}

rpc IsUserExist (IsUserExistRequest) returns (IsUserExistResponse);
```
Проверка, существует ли пользователь.

### IsUserExistRequest
- UserName - имя пользователя.

### IsUserExistResponse
- isExist - True, если пользователь существует. False, если нет.

## GetMyProfile
```
message BoughtOptions{
  uint32 AutoPriceRecalcs = 1;
}
message MyProfileResponse{
  string UserId = 1;
  string Username = 2;
  string Email = 3;
  bool EnabledTwoFA = 5;
  bool EmailVerifed = 6;
  string Timezone = 9;
  string Introduction = 10;
  string Site = 11;
  bool SalesDisabled = 12;
  bool BuysDisabled = 13;
  string DefaultCurrency = 15;
  BoughtOptions BoughtOptions = 16;
  bool IsAnonymous = 17;
}

rpc GetMyProfile (google.protobuf.Empty) returns (MyProfileResponse);
```
Получение профиля пользователя.

### BoughtOptions
- AutoPriceRecalcs - купленные расчеты Автоцены.

### MyProfileResponse
- UserId - Id пользователя.
- Username - Имя пользователя.
- Email - Email указанный пользователем.
- EnabledTwoFA - Если True, то двухфакторная авторизация включена.  
- EmailVerifed - Если True, то email подтвержден.
- Timezone - Часовая зона, указанная пользователем. [(Список)](/api/catalog#timezones)
- Introduction - Описание пользователя, указанное пользователем.
- Site - Сайт пользователя, указанный пользователем.
- SalesDisabled - Если True, то все объявление о продаже биткоинов выключены.
- BuysDisabled - Если True, то все объявление о покупке биткоинов выключены.
- DefaultCurrency - Фиатная валюта по усолчанию.
- BoughtOptions - Информация о дополнительных услугах, купленных пользователем.
- IsAnonymous - Если True, то пользователь является анонимным.

## UpdateMyProfile
```
message UpdateMyProfileRequest{
  string Timezone = 1;
  string Introduction = 2;
  string Site = 3;
  bool SalesDisabled = 4;
  bool BuysDisabled = 5;
  string DefaultCurrency = 6;
}

rpc UpdateMyProfile (UpdateMyProfileRequest) returns(google.protobuf.Empty);
```
Изменение информации в профиле.

### UpdateMyProfileRequest
- Timezone - Часовая зона, указанная пользователем. [(Список)](/api/catalog#timezones)
- Introduction - Описание пользователя, указанное пользователем. Максимальная длинна: 300 символов.
- Site - Сайт пользователя, указанный пользователем. Максимальная длинна: 300 символов.
- SalesDisabled - Если True, то все объявления о продаже биткоинов будут отключены. 
- BuysDisabled - Если True, то все объявления о покупке биткоинов будут отключены.
- DefaultCurrency - Валюта используемая по умолчанию, для отображения цен счетов и т.п.
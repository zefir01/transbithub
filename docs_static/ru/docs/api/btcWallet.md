title: API Transbithub работа с кошельком
description: Чтение баланса, ввод, вывод средств через API Transbithub


#Кошелек

## GetTransactions
```
message GetTransactionsRequest {
  bool IsInput = 1;
  uint64 LastId = 2;
  uint32 Count = 3;
}
message Transaction {
  uint64 Id = 1;
  string TxId = 2;
  Decimal Amount = 3;
  uint32 Confirmations = 4;
  string To = 5;
  google.protobuf.Timestamp Time = 6;
}
message GetTransactionsResponse {
  repeated Transaction Transactions = 1;
}

rpc GetTransactions (GetTransactionsRequest) returns (GetTransactionsResponse);
```
Запрос Bitcoin транзакций.

### GetTransactionsRequest
- IsInput - Если True, то будет выдан список входящих транзакций, если False, то исходящих. 
- LastId - Минимальный номер транзакции.
- Count - Максимальное количество транзакций в ответе. Максимальное значение: 100.

### Transaction
- Id - Номер транзакции.
- TxId - Номер транзакции в сети Bitcoin.
- Amount - Сумма транзакции.
- Confirmations - Количество подтверждений.
- To - Адрес назначения. Пустой, для входящих транзакций.
- Time - Дата и время создания транзакции.

### GetTransactionsResponse
- Transactions - Список транзакций.

## GetTransactionsById
```
message GetTransactionByIdRequest {
  repeated string TxId = 1;
  bool IsInput = 2;
}
message GetTransactionsResponse {
  repeated Transaction Transactions = 1;
}

rpc GetTransactionsById (GetTransactionByIdRequest) returns (GetTransactionsResponse);
```
Получение транзакции по списку TxId.

### GetTransactionByIdRequest
- TxId - Список номеров транзакций.
- IsInput - Если True, то будут выданы входящие транзакции, если False, то исходящие.

### GetTransactionsResponse
- Transactions - Список транзакций.

## GetInputAddress
```
message BtcAddress {
  string legacy = 1;
  string bech32 = 2;
}
message GetInputAddressResponse {
  BtcAddress BtcAddress = 1;
}

rpc GetInputAddress (google.protobuf.Empty) returns (GetInputAddressResponse);
```
Получение адреса для пополнения счета через транзакцию сети Bitcoin.

### BtcAddress
- legacy - адрес legacy.
- bech32 - адрес bech32.

## CreateTransaction
```
message CreateTransactionRequest {
  Decimal Amount = 1;
  string TargetAddress = 2;
}

rpc CreateTransaction (CreateTransactionRequest) returns (google.protobuf.Empty);
```
Создать запрос на вывод на внешний Bitcoin кошелек.

### CreateTransactionRequest
- Amount - Сумма транзакции.
- TargetAddress - Адрес, куда перевести биткоины.

## GetFees
```
message GetFeesResponse {
  Decimal Fee = 1;
}

rpc GetFees (google.protobuf.Empty) returns (GetFeesResponse);
```
Получение текущей комиссии сети Bitcoin, которая будет использована при выводе средств.

### GetFeesResponse
- Fee - Комиссия.

## LNDeposit
```
message LNDepositRequest{
  Decimal Amount = 1;
  string Description = 2;
  uint32 ExpiresIn = 3;
}
message LNDepositResponse{
  string Invoice = 1;
}

rpc LNDeposit(LNDepositRequest) returns (LNDepositResponse);
```
Создание BOLT11 приглашения к оплате, для пополнения баланса, через Lightning Network.

### LNDepositRequest
- Amount - Сумма в биткоинах.
- Description - Описание приглашения.
- ExpiresIn - Количество минут, в течении которых приглашение будет действительно.

### LNDepositResponse
- Invoice - BOLT11 приглашения к оплате.

## LNWithdrawal
```
message LNWithdrawalRequest{
  string Invoice = 1;
  oneof AmountNullable{
    Decimal Amount = 2;
    bool AmountIsNull = 3;
  }
}
message Balance {
  Decimal Confirmed = 1;
  Decimal UnConfirmed = 2;
  Decimal Deposited = 3;
}

rpc LNWithdrawal(LNWithdrawalRequest) returns (Balance);
```
Оплата BOLT11 приглашения к оплате. Вывод средств с баланса, через Lightning Network.

### LNWithdrawalRequest
- Invoice - BOLT11 приглашение к оплате.
- Amount - Сумма к оплате, если она отличается, от суммы в BOLT11. 
- AmountIsNull - Если True, то поле Amount игнорируется и используется сумма из BOLT11.

### Balance
- Confirmed - Баланс доступный для использования.
- UnConfirmed - Баланс, ожидаемый к зачислению. 
- Deposited - Баланс, заблокированный открытыми сделками.

## LNGetInvoices
```
message LNGetInvoicesRequest{
  uint32 Skip = 1;
  uint32 Take = 2;
}
message LNInvoice{
  string Id = 1;
  Decimal Amount = 2;
  string Description = 3;
  uint32 ExpiresIn = 4;
  google.protobuf.Timestamp CreatedAt = 5;
  string Bolt11 = 6;
  bool IsPaid = 7;
  oneof Relations{
    bool NoRelations = 8;
    uint64 PaymentId = 9;
  }
}
message LNGetInvoicesResponse{
  repeated LNInvoice Invoices = 1;
}

rpc LNGetInvoices(LNGetInvoicesRequest) returns (LNGetInvoicesResponse);
```
Получение списка BOLT11 приглашений к оплате, через Lightning Network. Ввод средств или оплата счетов.

### LNGetInvoicesRequest
- Skip - Пагинация. Количество приглашений, пропущенных в выдаче.
- Take - Пагинация. Максимальное количество приглашений в ответе. Максимальное значение: 100.

### LNInvoice
- Id - Номер приглашения.
- Amount - Сумма в биткоинах.
- Description - Описание приглашения.
- ExpiresIn - Количество минут, в течении которых приглашение должно быть оплачено.
- CreatedAt - Дата создания.
- Bolt11 - BOLT11 приглашение к оплате.
- IsPaid - True, если оплачено.
- NoRelations - Если True, то средства будут зачислены на баланс.
- PaymentId - Номер платежа, который будет оплачен при оплате этого приглашения.

### LNGetInvoicesResponse
- Invoices - Список приглашений к оплате.

## LNGetPayments
```
message LNGetPaymentsRequest{
  uint32 Skip = 1;
  uint32 Take = 2;
}
message LNPayment{
  string Id = 1;
  Decimal Amount = 2;
  string Description = 3;
  string Bolt11 = 4;
  google.protobuf.Timestamp CreatedAt = 5;
}
message LNGetPaymentsResponse{
  repeated LNPayment LNPayments = 1;
}

rpc LNGetPayments (LNGetPaymentsRequest) returns (LNGetPaymentsResponse);
```
Получение списка исходящих платежей через Lightning Network.

### LNGetPaymentsRequest
- Skip - Пагинация. Количество платежей, пропущенных в выдаче.
- Take - Пагинация. Максимальное количество платежей в ответе. Максимальное значение: 100.

### LNPayment
- Id - Номер платежа Lightning Network.
- Amount - Сумма в биткоинах.
- Description - Описание платежа.
- Bolt11 - BOLT11 приглашение к оплате.
- CreatedAt - Дата создания.

## GetBalances
```
rpc GetBalances (google.protobuf.Empty) returns(Balance);
```
Получение вашего баланса.
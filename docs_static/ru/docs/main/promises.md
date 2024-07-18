title: Как пользоваться промисами: создание, пересылка, зачисление
description: Что нужно знать о промисах: как создать, получить, зачислить на баланс, проввверить подлинность - читайте  в Transbithub.


## Что такое промисы
Промисы это что-то типа ценной бумаги или ключа от кошелька. Вы можете, в любой момент, создать Промис из биткоинов или
преобразовать Промис в биткоины.

Промис не имеет владельца. Т.е. хранится только номер и сумма Промиса. Узнать, кто создал его, невозможно.

Любой, кто знает незащищенный Промис, может его использовать. Пересылать незащищенные Промисы через, 
незащищенные сквозным шифрованием каналы связи, очень рискованно. Вы можете защитить Промис паролем при создании.
Если вы защитили Промис паролем, то для его использования, потребуется знать пароль.

При создании защищенного Промиса, для шифрования Промиса используется пароль кодированный BASE64.

Если вы получили от кого-то Промис, в счет оплаты товара например, то зачислите его на баланс, и только после этого
отдавайте товар. __Пока вы не зачислили Промис на баланс, вы не знаете действительный ли он, может оказаться так, что его 
уже использовали.__

Промис подписан с помощью PGP. Это гарантирует, что никто сможет его подделать.
Вы можете проверить подлинность Промиса, даже без подключения к интернету, просто проверив подпись.
__Правильная подпись, не гарантирует, что Промис действительный. Для полной уверенности, что Промис действительный, 
его необходимо зачислить на баланс или продать.__


## Открытый ключ тестовой среды:
```
--BEGIN PGP PUBLIC KEY BLOCK--

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
=iPRF
--END PGP PUBLIC KEY BLOCK--

```

## Открытый ключ основной среды:
```
--BEGIN PGP PUBLIC KEY BLOCK--

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
=lFra
--END PGP PUBLIC KEY BLOCK--
```
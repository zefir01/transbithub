title: Как продать товар за биткоины?
description: О том, как продать товар или услугу за биткоины на сайте Transbithub.com. Подробное руководство для продавцов.


#Руководство для продавцов товаров

Продавец может продавать товар анонимно.
Возможны следующие сценарии:
- Размещение ссылки на публичный счет на стороннем ресурсе.
- Размещение Telegram ссылки на публичный счет на стороннем ресурсе или в группе Telegram.
- Интеграция iframe ссылки на публичный счет на стороннем сайте.
- Размещение номера публичного счёта на любом стороннем ресурсе.
- Выставление приватного счёта конкретному пользователю, при условии, что пользователь 
  зарегистрирован в приложении и продавцу известно его имя пользователя.
  
## Типы цен
Счета можно создавать как в биткоинах, так и в фиатной валюте. 
- Если счет создан в биткоинах, то его цена не будет меняться при изменении курсов валют и курса биткоина.
- Если счет создан в фиатной валюте, то цена будет автоматически корректироваться в зависимости от курсов
  фиатных валют и курса биткоина. Таким образом, цена биткоинах будет меняться в зависимости от курсов валют,
  а цена в фиатной валюте будет оставаться постоянной.
  
## Свойства счетов
- Приватный счет можно оплачивать только один раз. Публичный счет можно оплатить множество раз.
- Счет может содержать описание и фотографии товара или магазина.
- Счет может быть выставлен как на одну единицу товара, так и на множество частей. Т.е. покупатель может сам решить
  сколько единиц товара ему нужно.
- Вы можете разместить дополнительные условия в описании счета.
- Покупатель может оплатить счет любым удобным ему способом. Это не зависит от продавца.
  После оплаты счета, продавец получает биткоины на баланс.
- Ликвидность публичного счёта можно ограничить. это подходит для продажи ограниченной партии товара. 

## Секреты
Счет может иметь секреты. Секрет, это набор фотографий (не более десяти) и текст. 
Одна единица товара, это один секрет.
Если секреты созданы, покупатель получит один секрет на одну единицу товара.
Если секреты не созданы (или их недостаточно), то покупатель получит рекомендацию связаться с продавцом, 
через внутренний чат приложения, для получения товара.

## Возвраты
Если что-то пошло не так и покупатель остался недоволен товаром, продавец __может__ сделать 
возврат средств покупателю за какое-то количество купленных частей. Цена используемая при возврате,
будет сформирована по тем же правилам, которые использовались при оплате счета.

## Интеграция
Счет можно интегрировать со сторонним сервисом, через механизм вебхуков.
В этом случае секреты будут формироваться сторонним сервисом, приложение, через вебхук, 
будет их получать во время оплаты счета и передавать покупателю.
Это полезно в том случае, если у вас уже есть сервис в котором хранятся секреты или вы не доверяете приложению
и не хотите, чтоб неиспользованные секреты хранились в нем.
Авторизация вебхуков построена на основе сертификатов.

## Комиссия
Комиссия за публичные счета взимается с продавца, за каждую покупку, в момент оплаты счета.
Комиссия за приватные счета взимается с продавца, в момент __создания__ счета, вне зависимости, будет оплачен счет или нет.
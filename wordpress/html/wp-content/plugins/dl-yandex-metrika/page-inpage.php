<?php
$dl_metrika_id = get_option('dl_yandex_metrika_id');
$dl_token = get_option('dl_yandex_metrika_token');
?>
<div class="wrap">
<h2>Поведение на сайте</h2>
<table class="form-table">
	<tr valign="top">
		<th scope="row"><a target="_blank" href="https://metrika.yandex.ru/stat/visor?id=<?php echo $dl_metrika_id; ?>">Вебвизор</a></th>
		<td><p>Технология <strong>Вебвизор</strong> позволяет пользователям Яндекс.Метрики проанализировать поведение посетителей на своем сайте на качественно новом уровне. Владелец сайта может воспроизвести действия посетителей в формате видео и узнать, что они делают на каждой странице, как осуществляют навигацию, передвигают курсор мыши, кликают по ссылкам.

		<p>Детальный анализ поведения посетителей помогает выявить проблемы в навигации, логике и юзабилити, а в результате — повысить конверсию сайта.
		</td>
	</tr>	
	<tr valign="top">
		<th scope="row"><a target="_blank" href="http://inpage.metrika.yandex.ru/inpage/link_map?id=<?php echo $dl_metrika_id; ?>">Карта ссылок</a></th>
		<td><p>Инструмент для измерения статистики переходов по ссылкам на вашем сайте. Ссылки в карте подсвечиваются разными цветами в зависимости от их популярности.
		<p>При наведении курсора на ссылку отображаются следующие данные:
		<ul><li>- количество переходов по ссылке;
			<li>- доля переходов относительно других ссылок на странице.
			</ul>
		</td>
	</tr>
	<tr valign="top">
		<th scope="row"><a target="_blank" href="http://inpage.metrika.yandex.ru/inpage/click_map?id=<?php echo $dl_metrika_id; ?>">Карта кликов</a></th>
		<td><p>Инструмент для измерения и отображения статистики по кликам на вашем сайте. Карта отображает клики по всем элементам страницы (в том числе по тем, которые не являются ссылками).
		
		<p>Карта кликов помогает оценивать юзабилити сайта, выявлять наиболее кликабельные элементы, определять, какие элементы дизайна кажутся посетителям сайтов ссылкой, но таковой не являются.
		
		<p>Клики на карте подсвечиваются разными цветами в зависимости от их частоты. На панели внизу страницы указано общее количество кликов на странице и доля кликов, попавших в текущую видимую вам область.
		</td>
	</tr>	
	<tr valign="top">
		<th scope="row"><a target="_blank" href="http://inpage.metrika.yandex.ru/inpage/scroll_map?id=<?php echo $dl_metrika_id; ?>">Карта скроллинга</a></th>
		<td><p>И инструмент для анализа того, как распределяется внимание посетителей сайта на определенных областях страницы. С помощью карты скроллинга можно узнать, сколько времени посетители сайта просматривают различные области страницы. Эта информация поможет вам подобрать оптимальную длину страницы и правильно разместить важную информацию.
		<p>Карта показывает:
		<ul><li>- Общее время, за которое пользователь просматривал страницу.
			<li>- Среднее время и количество просмотров определенного участка страницы, на который вы навели курсор.
		</ul>
		<p>Вы можете использовать несколько режимов отображения карты:
		<ul><li>- «Тепловая карта» — изменение времени просмотра страницы выделено зонами разного цвета.
			<li>- «Карта прозрачности» — области страницы, которые пользователь просматривал меньшее время затемнены, области, которые просматривались большее время — более прозрачные.
		</ul>
		<p><strong>Минимум</strong> — минимальное время просмотра от общего времени просмотров выбранной страницы за отчетный период.
		<p><strong>Максимум</strong> — максимальное время просмотра от общего количества просмотров выбранной страницы за отчетный период.
		</td>
		</td>
	</tr>
	<tr valign="top">
		<th scope="row"><a target="_blank" href="http://inpage.metrika.yandex.ru/inpage/form_analysis?id=<?php echo $dl_metrika_id; ?>">Аналитика форм</a></th>
		<td><p>Инструмент, предназначенный для сайтов, активно использующих формы для заполнения. Например, форму заказа или форму обратной связи. Аналитика форм позволяет понять, как именно посетители сайта взаимодействуют с формами.
		
		<p>Инструмент доступен в двух видах отображения данных: <strong>Конверсия формы</strong> и <strong>Поля формы</strong>.
		 
		<p>Конверсия формы позволяет увидеть:
		<ul>
			<li>- количество просмотров страницы с формой;
			<li>- количество взаимодействий с формой;
			<li>- количество отправленных форм.
		</ul>
		<p>Отчет по полям формы содержит следующие данные:
		<ul>
		<li>- время взаимодействия с каждым полем формы;
		<li>- незаполненные поля формы;
		<li>- поля, с которых покидают страницу с формой, не отправив данные (то есть полях, которые вызвали затруднения при заполнении).
		</ul>
		<p>Если на анализируемой странице находится несколько форм, можно переключаться между ними с помощью списка форм.
		</td>
	</tr>
</table>
</div>
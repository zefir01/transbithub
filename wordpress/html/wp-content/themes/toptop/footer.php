

        <footer>
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-5 me-auto">
                        <a class="footer-logo" href="/">
                            <span>trans<span style="color: #FFAB09;">bit</span>hub</span>
                        </a>
                        <div class="footer-support d-flex flex-column">
                            <span>Поддержка:</span>
                            <a href="mailto:support@transbithub.com">support@transbithub.com</a>
                        </div>
                    </div>
                    <div class="col-12 col-lg-auto">
                        <?php foreach (get_menu_items("header") as $item): ?>
                        <a class="btn btn-outline-white btn-new btn-menu btn-menu-light" href="<?php echo $item->url; ?>"><?php echo $item->title; ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </footer>

        <?php wp_footer(); ?>
        <!-- Yandex.Metrika counter -->
        <script type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(73005085, "init", {
                clickmap:true,
                trackLinks:true,
		accurateTrackBounce:true,
		webvisor:true
        });
        </script>
        <noscript><div><img src="https://mc.yandex.ru/watch/73005085" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
        <!-- /Yandex.Metrika counter -->
    </body>
</html>

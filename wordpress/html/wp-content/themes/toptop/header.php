<html lang="ru">
    <head>
        <?php wp_head(); ?>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body class="bg-white">
        <div class="header">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-lg-auto me-auto">
                        <a class="header-logo" href="/">
                            <span>trans<span style="color: #FFAB09;">bit</span>hub</span>
                        </a>
                    </div>
                    <div class="col-12 col-lg-auto">
                        <?php foreach (get_menu_items("header") as $item): ?>
                        <a class="btn btn-outline-primary btn-new btn-menu" href="<?php echo $item->url; ?>"><?php echo $item->title; ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
<?php get_header(); ?>
<div class="container main-wallpaper">
    <div class="row align-items-lg-center align-items-xs-start">
        <div class="col-lg-8 col-xl-6">
            <div class="main-block">
                <h1><?php the_field("main_h1"); ?></h1>
                <p><?php the_field("main_description"); ?></p>
                <a class="btn btn-primary btn-new" href="/app" target="_blank" onclick="ym(73005085,'reachGoal','push_button'); return true;">Вход</a>
            </div>
        </div>
        <?php if (get_field("main_image")): ?>
        <div class="col-lg-4 col-xl-6 text-center d-none d-lg-block">
            <img class="mw-100" src="<?php the_field("main_image"); ?>" alt="bitcoin" loading="lazy" alt="<?php the_field("main_h1"); ?>" />
        </div>
        <?php endif; ?>
    </div>
</div>
<div class="feautures">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2 class="feauture-h2"><?php the_field("feautures_h"); ?></h2>
            </div>

            <?php
            $features_block_1 = get_field('features_block_1');
            if( $features_block_1 ):
            ?>
            <div class="col-12 col-lg-4 mb-68">
                <a class="feature-block d-flex flex-column align-items-start" href="<?php echo $features_block_1["feature_url"]; ?>">
                    <?php if ($features_block_1["feature_image"]): ?>
                    <img class="mw-100" src="<?php echo $features_block_1["feature_image"]; ?>" alt="<?php echo $features_block_1["feature_header"]; ?>" loading="lazy" />
                    <?php endif; ?>
                    <p><?php echo $features_block_1["feature_header"]; ?></p>
                    <span class="d-none d-lg-flex align-items-center">Подробнее</span>
                </a>
            </div>
            <?php endif; ?>

            <?php
            $features_block_2 = get_field('features_block_2');
            if( $features_block_2 ):
            ?>
            <div class="col-12 col-lg-4 mb-68">
                <a class="feature-block d-flex flex-column align-items-start" href="<?php echo $features_block_2["feature_url"]; ?>">
                    <?php if ($features_block_2["feature_image"]): ?>
                    <img class="mw-100" src="<?php echo $features_block_2["feature_image"]; ?>" alt="<?php echo $features_block_2["feature_header"]; ?>" loading="lazy" />
                    <?php endif; ?>
                    <p><?php echo $features_block_2["feature_header"]; ?></p>
                    <span class="d-none d-lg-flex align-items-center">Подробнее</span>
                </a>
            </div>
            <?php endif; ?>

            <?php
            $features_block_3 = get_field('features_block_3');
            if( $features_block_3 ):
            ?>
            <div class="col-12 col-lg-4 mb-68">
                <a class="feature-block d-flex flex-column align-items-start" href="<?php echo $features_block_3["feature_url"]; ?>">
                    <?php if ($features_block_3["feature_image"]): ?>
                    <img class="mw-100" src="<?php echo $features_block_3["feature_image"]; ?>" alt="<?php echo $features_block_3["feature_header"]; ?>" loading="lazy" />
                    <?php endif; ?>
                    <p><?php echo $features_block_3["feature_header"]; ?></p>
                    <span class="d-none d-lg-flex align-items-center">Подробнее</span>
                </a>
            </div>
            <?php endif; ?>
            <div class="col-12 col-lg-4 mb-68 d-none d-lg-block">
             <div class="feature-block-orange"></div>
            </div>
            <?php
            $features_block_4 = get_field('features_block_4');
            if( $features_block_4 ):
            ?>
            <div class="col-12 col-lg-4 mb-68">
                <a class="feature-block d-flex flex-column align-items-start" href="<?php echo $features_block_4["feature_url"]; ?>">
                    <?php if ($features_block_4["feature_image"]): ?>
                    <img class="mw-100" src="<?php echo $features_block_4["feature_image"]; ?>" alt="<?php echo $features_block_4["feature_header"]; ?>" loading="lazy" />
                    <?php endif; ?>
                    <p><?php echo $features_block_4["feature_header"]; ?></p>
                    <span class="d-none d-lg-flex align-items-center">Подробнее</span>
                </a>
            </div>
            <?php endif; ?>

            <?php
            $features_block_5 = get_field('features_block_5');
            if( $features_block_5 ):
            ?>
            <div class="col-12 col-lg-4 mb-68">
                <a class="feature-block d-flex flex-column align-items-start" href="<?php echo $features_block_5["feature_url"]; ?>">
                    <?php if ($features_block_5["feature_image"]): ?>
                    <img class="mw-100" src="<?php echo $features_block_5["feature_image"]; ?>" alt="<?php echo $features_block_5["feature_header"]; ?>" loading="lazy" />
                    <?php endif; ?>
                    <p><?php echo $features_block_5["feature_header"]; ?></p>
                    <span class="d-none d-lg-flex align-items-center">Подробнее</span>
                </a>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <div class="uniqeue">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="uniqeue-h2"><?php the_field("unique_system_h"); ?></h2>
                </div>
            </div>
            <div class="row justify-content-center">
                <?php
                $unique_system_1 = get_field('unique_system_1');
                if ($unique_system_1):
                ?>
                <div class="col-lg-5">
                    <div class="uniqeue-block d-flex flex-lg-column align-items-start justify-content-end">
                        <?php if ($unique_system_1['unique_system_block_image']): ?>
                        <div class="uniqeue-image">
                            <img class="mw-100" src="<?php echo $unique_system_1['unique_system_block_image']; ?>" alt="<?php echo $unique_system_1['unique_system_block_h']; ?>" loading="lazy"/>
                        </div>
                        <?php endif; ?>
                        <div>
                            <h4><?php echo $unique_system_1['unique_system_block_h']; ?></h4>
                            <p><?php echo $unique_system_1['unique_system_block_text']; ?></p>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
                <?php
                $unique_system_2 = get_field('unique_system_2');
                if ($unique_system_2):
                ?>
                <div class="col-lg-5">
                    <div class="uniqeue-block d-flex flex-lg-column align-items-start justify-content-end">
                        <?php if ($unique_system_2['unique_system_block_image']): ?>
                        <div class="uniqeue-image">
                            <img class="mw-100" src="<?php echo $unique_system_2['unique_system_block_image']; ?>" alt="<?php echo $unique_system_2['unique_system_block_h']; ?>" loading="lazy"/>
                        </div>
                        <?php endif; ?>
                        <div>
                            <h4><?php echo $unique_system_2['unique_system_block_h']; ?></h4>
                            <p><?php echo $unique_system_2['unique_system_block_text']; ?></p>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
                
                <div class="col-lg-12 mt-125 text-center">
                    <a class="btn btn-primary btn-new btn-weight" href="<?php the_field("unique_system_url"); ?>">Подробнее</a>
                </div>
            </div>
        </div>
    </div>

    <?php
    $block_1 = get_field("block_1");
    if( $block_1 ):
    ?>      
    <div class="dob-block-1" id="anchor-1">
        <div class="container bg-md-1">
            <div class="row">
                <div class="col-lg-6">
                    <div class="dob-item-1 d-flex flex-column align-items-start">
                        <h3><?php echo $block_1["block_h"]; ?></h3>
                        <p><?php echo $block_1["block_text"]; ?></p>
                    </div>
                </div>
                <?php if ($block_1["block_image"]): ?>
                <div class="col-lg-6 text-end dots-end d-none d-lg-block">
                    <img class="mw-100" src="<?php echo $block_1["block_image"]; ?>" alt="<?php echo $block_1["block_h"]; ?>" loading="lazy"/>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>   
    <?php endif; ?>


    <?php
    $block_2 = get_field("block_2");
    if( $block_2 ):
    ?>      
    <div class="dob-block-2" id="anchor-2">
        <div class="container bg-md-2">
            <div class="row">
                <?php if ($block_2["block_image"]): ?>
                <div class="col-lg-6 dots-start d-none d-lg-block">
                    <img class="mw-100" src="<?php echo $block_2["block_image"]; ?>" alt="<?php echo $block_2["block_h"]; ?>" loading="lazy"/>
                </div>
                <?php endif; ?>
                <div class="col-lg-6 d-flex justify-content-end">
                    <div class="dob-item-2 d-flex flex-column align-items-end">
                    <h3 class="text-end"><?php echo $block_2["block_h"]; ?></h3>
                    <p class="text-end"><?php echo $block_2["block_text"]; ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php
    $block_3 = get_field("block_3");
    if( $block_3 ):
    ?>     
    <div class="dop-block-3" id="anchor-3">
        <div class="container bg-md-3">
            <div class="row">
                <div class="col-12">
                    <h2 class="dop-3-h"><?php echo $block_3["block_h"]; ?></h2>
                </div>
                <?php if ($block_3["block_image"]): ?>
                <div class="col-lg-6 dots-start-2 d-none d-lg-block">
                    <img class="mw-100" src="<?php echo $block_3["block_image"]; ?>" alt="<?php echo $block_3["block_h"]; ?>" loading="lazy"/>
                </div>
                <?php endif; ?>
                <div class="col-lg-6">
                    <div class="dob-item-3 d-flex flex-column align-items-start">
                        <h3 class="blue-block"><?php echo $block_3["block_h_2"]; ?></h3>
                        <p class="dop-3-sub-head"><?php echo $block_3["block_text_h_2"]; ?></p>
                        <p><?php echo $block_3["block_text"]; ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php
    $block_4 = get_field("block_4");
    if( $block_4 ):
    ?>   
    <div class="dop-block-3" id="anchor-4">
        <div class="container bg-md-4">
            <div class="row">
                <div class="col-12 d-flex justify-content-end">
                    <h2 class="dop-3-h text-end"><?php echo $block_4["block_h"]; ?></h2>
                </div>
                <div class="col-lg-6">
                    <div class="dob-item-3 d-flex flex-column align-items-start ml-22 all-text-md-right">
                        <h3 class="blue-block"><?php echo $block_4["block_h_2"]; ?></h3>
                        <p class="dop-3-sub-head"><?php echo $block_4["block_text_h_2"]; ?></p>
                        <p><?php echo $block_4["block_text"]; ?></p>
                    </div>
                </div>
                <?php if ($block_4["block_image"]): ?>
                <div class="col-lg-6 dots-start-3 d-none d-lg-block">
                    <img class="mw-100" src="<?php echo $block_4["block_image"]; ?>" alt="<?php echo $block_4["block_h"]; ?>" loading="lazy"/>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php
    $blue_block_1 = get_field('blue_block_1');
    if( $blue_block_1 ):
    ?>      
    <div class="container blue-snippet-margin">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-12">
                <h2 class="h2 text-center"><?php echo $blue_block_1["blue_block_h_above_block"]; ?></h2>
                <div class="blue-snippet">
                    <h4 class="text-center"><?php echo $blue_block_1["blue_block_h"]; ?></h4>
                    <p><?php echo $blue_block_1["blue_block_text"]; ?></p>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <?php
    $block_5 = get_field("block_5");
    if( $block_5 ):
    ?>
    <div class="dop-block-3" id="anchor-5">
        <div class="container bg-md-5">
            <div class="row">
                <div class="col-12">
                    <h2 class="dop-3-h"><?php echo $block_5["block_h"]; ?></h2>
                </div>
                <?php if ($block_5["block_image"]): ?>
                <div class="col-lg-6 d-none d-lg-block">
                    <img class="mw-100" src="<?php echo $block_5["block_image"]; ?>" alt="<?php echo $block_5["block_h"]; ?>" loading="lazy"/>
                </div>
                <?php endif; ?>
                <div class="col-lg-6">
                    <div class="dob-item-3 d-flex flex-column align-items-start mw-md-450">
                        <p class="dop-3-h-mini blue-block"><?php echo $block_5["block_text_instead_title"]; ?></p>
                        <p class="dop-3-sub-head"><?php echo $block_5["block_text_h_2"]; ?></p>
                        <p><?php echo $block_5["block_text"]; ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>


    <?php
    $blue_block_2 = get_field('blue_block_2');
    if ($blue_block_2):
    ?>      
    <div class="container blue-snippet-margin">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-12">
                <h2 class="h2 text-center"><?php echo $blue_block_2["blue_block_h_above_block"]; ?></h2>
                <div class="blue-snippet">
                    <h4 class="text-center"><?php echo $blue_block_2["blue_block_h"]; ?></h4>
                    <p><?php echo $blue_block_2["blue_block_text"]; ?></p>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div class="container smi-container">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-12">
                <h2 class="h2 text-center">СМИ о нас</h2>
                <div class="row align-items-center justify-content-center">
					<div class="col-6 col-md-5 text-center mt-46">
						<a href="https://bitfin.info/12720-transbithub-samaya-sovremennaya-p2p-birzha/" target="_blank">
							<img src="/wp-content/themes/toptop/assets/img/smi-1.png" loading="lazy" class="mw-100" alt="BitFin">
						</a>
					</div>
					<div class="col-6 col-md-5 text-center mt-46">
						<a href="https://bits.media/pr/transbithub-p2p-birzha-bitkoina-s-lightning-network-api-i-botami/" target="_blank">
							<img src="/wp-content/themes/toptop/assets/img/smi-2.png" loading="lazy" class="mw-100" alt="bit.media">
						</a>
					</div>
				</div>
            </div>
        </div>
    </div>

</div>
<?php get_footer(); ?>
<?php get_header(); ?>
<div class="container">
    <div class="row">
        <div class="col-12 col-lg-8">
            <div class="page-content">
                <h1><?php the_title(); ?></h1>
                <?php
                if ( function_exists( 'yoast_breadcrumb' ) ) :
                yoast_breadcrumb( '<div id="breadcrumbs">', '</div>' );
                endif;
                ?>
                <?php if ($thumbnail = get_the_post_thumbnail_url( $post, 'large' )): ?>
                <img src="<?php echo $thumbnail; ?>" alt="<?php the_title(); ?>" loading="lazy" class="mw-100 page-thumbnail">
                <?php endif; ?>
                <?php the_content(); ?>
            </div>
        </div>
    </div>
</div>
<?php get_footer(); ?>
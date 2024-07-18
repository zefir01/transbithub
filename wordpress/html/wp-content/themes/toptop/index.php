<?php get_header(); ?>
<div class="container">
    <div class="row">
        <div class="col-12 col-lg-8">
            <div class="page-content">
                <h1>Блог</h1>
                <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); ?>
                <div class="row mb-4">
                    <div class="col-12 col-md-4">
                        <?php if ($thumbnail = get_the_post_thumbnail_url( $post, 'large' )): ?>
                        <img src="<?php echo $thumbnail; ?>" alt="<?php the_title(); ?>" loading="lazy" class="mw-100 page-thumbnail">
                        <?php endif; ?>
                    </div>
                    <div class="col-12 col-md-8">
                        <h2 class="blog-while-link"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			            <?php the_excerpt(); ?>
                    </div>
                </div>
                <?php endwhile; ?>
                <div class="text-center">
                    <?php the_posts_pagination(["screen_reader_text" => " "]); ?> 
                </div>
                <?php endif; ?>
                
            </div>
        </div>
    </div>
</div>
<?php get_footer(); ?>
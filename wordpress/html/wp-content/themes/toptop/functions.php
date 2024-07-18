<?php
add_theme_support("menus");
add_theme_support("title-tag");
add_theme_support("custom-logo");
add_theme_support("post-thumbnails");
register_nav_menu("header", "Меню в шапке сайта");


add_action("wp_enqueue_scripts", function () {
    wp_enqueue_style("bootstrap", get_template_directory_uri() . "/assets/css/bootstrap.min.css");
    wp_enqueue_style("main", get_template_directory_uri() . "/assets/css/main.css", array(), "1.0.6");

    wp_deregister_script("jquery");
    wp_register_script("jquery", get_template_directory_uri() . "/assets/js/jquery-3.5.1.min.js");
    wp_enqueue_script("jquery");

    wp_register_script("scripts", get_template_directory_uri() . "/assets/js/scripts.js");
    wp_enqueue_script("scripts");

});


function get_menu_items ($location_id) {
    $menus = wp_get_nav_menus();
    $menu_locations = get_nav_menu_locations();

    if (isset($menu_locations[ $location_id ]) && $menu_locations[ $location_id ]!=0) {
        foreach ($menus as $menu) {
            if ($menu->term_id == $menu_locations[ $location_id ]) {
                $menu_items = wp_get_nav_menu_items($menu);
                break;
            }
        }
        return $menu_items;
    }
}

if ("disable_gutenberg") {
	remove_theme_support("core-block-patterns");
	add_filter("use_block_editor_for_post_type", "__return_false", 100 );
	remove_action("wp_enqueue_scripts", "wp_common_block_scripts_and_styles");
	add_action("admin_init", function() {
		remove_action("admin_notices", ["WP_Privacy_Policy_Content", "notice"]);
		add_action("edit_form_after_title", ["WP_Privacy_Policy_Content", "notice"]);
	});
}

add_filter("upload_mimes", function ($mimes) {
	$mimes["svg"]  = "image/svg+xml";
	return $mimes;
});


add_filter( "wp_check_filetype_and_ext", function ($data, $file, $filename, $mimes, $real_mime = '') {

	if (version_compare($GLOBALS["wp_version"], "5.1.0", "" >= "")) {
		$dosvg = in_array( $real_mime, ["image/svg", "image/svg+xml"]);
    }
	else {
		$dosvg = (".svg" === strtolower(substr($filename, -4)));
    }

	if ($dosvg) {
		if (current_user_can("manage_options")) {
			$data["ext"]  = "svg";
			$data["type"] = "image/svg+xml";
		}else {
			$data["ext"] = $type_and_ext["type"] = false;
		}

	}
	return $data;
}, 10, 5 );

?>
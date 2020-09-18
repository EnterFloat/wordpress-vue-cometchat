<?php
/**
 * Plugin Name: WordPress, Vue, CometChat
 * Description: A WordPress plugin integrating CometChat with a Vue app.
 */

function custom_dequeue_script() {
  wp_dequeue_script( 'script-handle' );
  wp_dequeue_style('script-handle');
  wp_deregister_style('script-handle');
}

add_action( 'wp_print_scripts', 'custom_dequeue_script', 9999 );

//Register scripts to use
function func_load_vuescripts() {
	wp_register_script('wpvue_vuejs', 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js');
	wp_register_script('my_vuecode', plugin_dir_url( __FILE__ ).'dist/build.js', 'wpvue_vuejs', true );
}
//Tell WordPress to register the scripts
add_action('wp_enqueue_scripts', 'func_load_vuescripts');

//Return string for shortcode
function func_wp_vue(){
  //Add Vue.js
  wp_enqueue_script('wpvue_vuejs');
  //Add my code to it
  wp_enqueue_script('my_vuecode');

  //Build String
  $str= "<div id='app'>"
  	."</div>";

  //Return to display
  return $str;
} // end function

//Add shortcode to WordPress
add_shortcode( 'wp-vue-cometchat', 'func_wp_vue' );
?>

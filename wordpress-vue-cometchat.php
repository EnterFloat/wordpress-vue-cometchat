<?php
/**
 * Plugin Name: WordPress, Vue, CometChat
 * Description: A WordPress plugin integrating CometChat with a Vue app.
 */

 // Register cometchat meta get endpoint
add_action( 'rest_api_init', 'get_cometchat_meta_rest_route' );
function get_cometchat_meta_rest_route() {
    register_rest_route( 'wordpress-vue-cometchat/meta', '/get', [
        'methods'  => 'POST',
        'callback' => function ( $request ) {
        $user_id = apply_filters( 'determine_current_user', false );
        wp_set_current_user( $user_id );
        $current_user_id = get_current_user_id();
        $return_obj = array("blinddaters_id" => $current_user_id, "user_meta" => get_user_meta($current_user_id, 'cometchat_data', true));               
        return json_encode($return_obj);
            // return '"{\"get_user_meta\"\: ' . json_encode(get_user_meta($current_user_id, 'cometchat_data', true)) . ', \"blinddaters_id\"\: ' . $current_user_id . "}";
        },
    ] );
}

 // Register cometchat meta update endpoint
 add_action( 'rest_api_init', 'update_cometchat_meta_rest_route' );
 function update_cometchat_meta_rest_route() {
     register_rest_route( 'wordpress-vue-cometchat/meta', '/update', [
         'methods'  => 'POST',
         'callback' => function ( $request ) {
          $user_id = apply_filters( 'determine_current_user', false );
          wp_set_current_user( $user_id );
          $current_user_id = get_current_user_id();
          $cometchat_data = $request->get_param('cometchat_data');          
          update_user_meta($current_user_id, 'cometchat_data', $cometchat_data);
             return [
                  'current_user_id: ' . $current_user_id,          
                  'update_user_meta: ' . json_encode(get_user_meta($current_user_id, 'cometchat_data', true)),          
             ];
         },
     ] );
 }

// add_action( 'wp_enqueue_scripts', 'my_enqueue_scripts' );
// function my_enqueue_scripts() {
//     // Enqueue the script which makes the AJAX call to /wp-json/my-plugin/v1/foo.
//     wp_enqueue_script( 'my-script', 'my-script.js', [ 'jquery' ] );

//     // Register custom variables for the AJAX script.
//     wp_localize_script( 'my-script', 'myScriptVars', [
//         'root'  => esc_url_raw( rest_url() ),
//         'nonce' => wp_create_nonce( 'wp_rest' ),
//     ] );
// }

// function custom_dequeue_script() {
//   wp_dequeue_script( 'script-handle' );
//   wp_dequeue_style('script-handle');
//   wp_deregister_style('script-handle');
// }

// add_action( 'wp_print_scripts', 'custom_dequeue_script', 9999 );

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
  //Localize with 'myScriptVars
  wp_localize_script( 'my_vuecode', 'myScriptVars', [
    'root'  => esc_url_raw( rest_url() ),
    'nonce' => wp_create_nonce( 'wp_rest' ),
] );

  //Build String
  $str= "<div id='app'>"
  	."</div>";

  //Return to display
  return $str;
} // end function

//Add shortcode to WordPress
add_shortcode( 'wp-vue-cometchat', 'func_wp_vue' );
?>

<?php
require plugin_dir_path(__FILE__) . 'partials/raptive-chatbot-template.php';
require plugin_dir_path(__FILE__) . 'partials/raptive-chatbot-notice-template.php';

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://raptive.com/
 * @since      1.0.0
 *
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/public
 * @author     Raptive <support@raptive.com>
 */
class Raptive_Chatbot_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Raptive_Chatbot_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Raptive_Chatbot_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// NOTE: We are also manually adding a cachebuster below because we have found that some sites
		// do not correctly handle the 3rd "version" parameter correctly
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/raptive-chatbot-public.css?cb=' . urlencode($this->version), array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Raptive_Chatbot_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Raptive_Chatbot_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// We are not using wp_enqueue_script because it does not work on staging.pinchofyum.com (logged out)
		// I suspect that this is because of install-specific configurations or a security plugin - Ryo
		
		// Note on local testing:
		// Also, you can toggle this on instead of the raptive-chatbot-insert-js.php to easily test js locally
		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/raptive-chatbot-public.js', array(), $this->version, true );

		// So, instead of wp_enqueue_script, we will insert a script tag onto the page
		require 'partials/raptive-chatbot-insert-js.php';

	}

	public function raptive_template_include($template) {
		global $wp_query;

		// Short code for CreatorBot and Notice
		function init_raptive_creatorbot(){
			return raptive_creatorbot_iframe_template();
		}

		function init_raptive_creatorbot_notice(){
			return raptive_creatorbot_notice_template();
		} 
		add_shortcode('raptive_creatorbot', 'init_raptive_creatorbot');
		add_shortcode('raptive_creatorbot_notice', 'init_raptive_creatorbot_notice');

	    return $template;
	}

}

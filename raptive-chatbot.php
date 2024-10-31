<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://raptive.com/
 * @since             1.0.0
 * @package           Raptive_Creatorbot
 *
 * @wordpress-plugin
 * Plugin Name:       Raptive Creatorbot
 * Description:       An interactive chatbot to increase engagement on your site.
 * Version:           1.0.17
 * Author:            Raptive
 * Author URI:        https://raptive.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       raptive-creatorbot
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'RAPTIVE_CHATBOT_VERSION', '1.0.17' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-raptive-chatbot-activator.php
 */
function raptive_chatbot_activate() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-raptive-chatbot-activator.php';
	Raptive_Chatbot_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-raptive-chatbot-deactivator.php
 */
function raptive_chatbot_deactivate() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-raptive-chatbot-deactivator.php';
	Raptive_Chatbot_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'raptive_chatbot_activate' );
register_deactivation_hook( __FILE__, 'raptive_chatbot_deactivate' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-raptive-chatbot.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function raptive_chatbot_run() {
	$plugin = new Raptive_Chatbot();
	$plugin->run();
}
raptive_chatbot_run();

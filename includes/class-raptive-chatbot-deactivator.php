<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://raptive.com/
 * @since      1.0.0
 *
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/includes
 * @author     Raptive <support@raptive.com>
 */
class Raptive_Chatbot_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		wp_clear_scheduled_hook('raptive_chatbot_daily_event');
	}

}

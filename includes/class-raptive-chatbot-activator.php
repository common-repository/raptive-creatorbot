<?php

/**
 * Fired during plugin activation
 *
 * @link       https://raptive.com/
 * @since      1.0.0
 *
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/includes
 * @author     Raptive <support@raptive.com>
 */
class Raptive_Chatbot_Activator {
    /**
     * Activate the plugin.
     *
     * Schedule a daily event.
     * The event currently triggers an action that sends the site's plugin version to the creatorbot API.
     *
     * @since    1.0.0
     */
    public static function activate() {
        if (!wp_next_scheduled('raptive_chatbot_daily_event')) {
            wp_schedule_event(time(), 'daily', 'raptive_chatbot_daily_event');
        }
        do_action('raptive_chatbot_daily_event');
    }
}

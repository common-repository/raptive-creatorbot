<?php

/**
 * Registers actions related to the cron functionality of the plugin.
 *
 * @since      1.0.14
 * @package    Raptive_Chatbot
 * @subpackage Raptive_Chatbot/includes
 * @author     Raptive <support@raptive.com>
 */
class Raptive_chatbot_Cron {
    /**
     * The version of this plugin.
     *
     * @since    1.0.14
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.14
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $version ) {
        $this->version = $version;
    }

    /**
     * Send the site's plugin version to the creatorbot API.
     * Daily event.
     *
     * @since    1.0.14
     */
    public function raptive_chatbot_log_version() {
        $origin = "https://chat.raptive.ai";
        $site_url = get_bloginfo('url');

        $endpoint = add_query_arg( array(
            'url' => $site_url,
            'version' => $this->version,
        ), $origin . "/api/plugin" );

        wp_remote_post($endpoint);
    }
}

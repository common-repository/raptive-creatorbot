<?php
/**
 * This view is responsible for adding JS that will insert a <script> tag
 * that pulls the primary javascript down from our S3 bucket / CDN
 *
 * sandbox - https://d1v7vw3nuzivov.cloudfront.net
 * dev     - https://chat-cdn.development.raptive.ai
 * staging - https://chat-cdn.stage.raptive.ai
 * prod    - https://chat-cdn.production.raptive.ai
 * 
 * Parameters:
 * raptive_dev (optional) - this forces the script to be loaded from the development CDN with a cachebuster
 * 
 * Note: We want to load the JS from the CDN asynchronously for performance reasons 
 * and also because we have found that `wp_enqueue_scripts` does not work reliably for
 * many of our customers. Note that the script here is built from the same file in the plugin repository.
 * 
 * 
 */
?>

<script>
const LOAD_DELAY_INTERVAL_IN_MS = 500;
const LOAD_MAX_ATTEMPTS = 20;

const Environments = {
    Prod: "production",
    Stage: "stage",
    Dev: "development"
}

function loadExternalJs() {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    const creatorbotScriptTag = document.createElement('script');

    let env = Environments.Prod;
    if (params.has('raptive_dev')) {
        env = Environments.Dev;
    } else if (params.has('raptive_staging')) {
        env = Environments.Stage;
    }

    const shouldAppendCacheBuster = env === Environments.Stage || env === Environments.Dev;
    const cachebuster = "?cachebuster=" + Math.floor(Math.random() * 100000);

    const src =
        `https://chat-cdn.${env}.raptive.ai/js/raptive-chatbot-public.js` +
        (shouldAppendCacheBuster ? cachebuster : "");

    creatorbotScriptTag.async = true;
    creatorbotScriptTag.referrerpolicy = 'no-referrer-when-downgrade';
    creatorbotScriptTag.src = src;

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(creatorbotScriptTag, firstScriptTag);
}

(function() {
    let attempts = 0;
    const intervalId = setInterval(() => {
        attempts++;
        if (window.adthrive || attempts >= LOAD_MAX_ATTEMPTS) {
            clearInterval(intervalId);
            loadExternalJs();
        }
    }, LOAD_DELAY_INTERVAL_IN_MS);
})();
</script>

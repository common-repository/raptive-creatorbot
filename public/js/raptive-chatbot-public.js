(function() {
    'use strict';

    // Raptive Chatbot
    // optional URL parameters
    // * raptive_debug - forces a plugin to be shown
    // * raptive_iframe_local - if present, then uses localhost for chatbot
    // # raptive_iframe_staging - if present, then uses vercel app for chatbot
    const MAINTENANCE_MODE_GLOBAL_SETTING_KEY = "maintenanceMode";

    const ClickstreamEventName = {
        BotOpened: 'bot_opened',
        BotClosed: 'bot_closed',
    };

    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    let isMobile = false;
    if (navigator.userAgent.match(/(iPhone|Android|BlackBerry|Windows Phone)/)) {
      isMobile = true;
    }

    const global_flags = {
        [MAINTENANCE_MODE_GLOBAL_SETTING_KEY]: false,
    };

    function setGlobalFlags(config){
        if(config && config[MAINTENANCE_MODE_GLOBAL_SETTING_KEY]){
            global_flags[MAINTENANCE_MODE_GLOBAL_SETTING_KEY] = config[MAINTENANCE_MODE_GLOBAL_SETTING_KEY];
        }
    }

    const isNonProdEnv =
        params.has("raptive_debug") ||
        params.has("raptive_iframe_local") ||
        params.has("raptive_iframe_vercel") ||
        params.has("raptive_iframe_dev") ||
        params.has("raptive_iframe_staging");

    const siteURL = window.location.origin;
    let chatbotDomain = 'https://chat.raptive.ai';
    if(params.has("raptive_iframe_local")){
        chatbotDomain = 'http://localhost:3000';
    } else if(params.has("raptive_iframe_vercel")){
        chatbotDomain = 'https://creatorbot.vercel.app';
    } else if(params.has("raptive_iframe_dev")){
        chatbotDomain = 'https://chat-raptive-ai.development.cafemedia.com';
    } else if(params.has("raptive_iframe_staging")){
        chatbotDomain = 'https://chat-raptive-ai.stage.cafemedia.com';
    }
    const siteConfigEndpoint = `${chatbotDomain}/api/site/foo?domain=${siteURL}`;
    let isOnChatPage = (document.querySelector('iframe.raptive-chatbot-shortcode-iframe') !== null) ? true : false;

    var raptiveConfig = null;

    function trackEventInUAandGA4(eventAction, eventLabel){
        if(typeof gtag === 'function'){
            // ga4
            gtag('event', eventAction);
        }
    }

    function shouldShowChatbotOnPage(config){
        if(params.has('raptive_debug')) {
            return true;
        }

        return config && config.trafficPercent && Math.random() < parseFloat(config.trafficPercent);
    }

    // Set Chatbot Styling & other properties
    function setProperties(config){
        setGlobalFlags(config);

        const currentURL = window.location.href;
        const currentTitle = document.title;
        const adthriveSiteId = window.adthrive?.config?.site?.id;
        const adthriveSessionKey = window.adthrive?.config?.context?.sessionKey;
        const adthrivePageviewKey = window.adthrive?.config?.context?.pageviewKey;

        let iframeSrcUrl = encodeURI(`${chatbotDomain}/${config.slug}?pageURL=${currentURL}&title=${currentTitle}`);
        // do not send adthrive keys if they are not present
        if(adthrivePageviewKey && adthriveSessionKey && adthriveSiteId) {
            iframeSrcUrl += `&siteId=${adthriveSiteId}&sessionKey=${adthriveSessionKey}&pageviewKey=${adthrivePageviewKey}`;
        }
        const encodedIframeSrcUrl = encodeURI(iframeSrcUrl);

        if(!isOnChatPage){
            trackEventInUAandGA4('show_chatbot_button', 'Show Chatbot Button');
            let chatButton = document.querySelector('.raptive-chat-button');
            chatButton.style.backgroundColor = config.colorBg;
            chatButton.style.color = config.colorText;
            chatButton.style.display = "block";
            if(global_flags[MAINTENANCE_MODE_GLOBAL_SETTING_KEY]){
                chatButton.style.display = "none";
            }
            document.getElementById('raptiveChatFrame').src = encodedIframeSrcUrl;
        } else {
            let chatbotIframe = document.querySelector('.raptive-chatbot-shortcode-iframe');
            chatbotIframe.src = encodedIframeSrcUrl;
            if(global_flags[MAINTENANCE_MODE_GLOBAL_SETTING_KEY]){
                chatbotIframe.src = encodeURI(`${chatbotDomain}/maintenance`);
            }
            chatbotIframe.classList.add('raptive-chatbot-shortcode-iframe-active');
        }
        raptiveConfig = config;
    }

    function insertChatButtonDOM(){
        // Append the chat button and chat modal to the DOM
        let buttonDom = `<div class="raptive-chat-button" data-stormbeam-creatorbot="${ClickstreamEventName.BotOpened}">Talk to our AI Chatbot</div>
        <div class="raptive-chat-holder">
            <div class="raptive-chat-powered-by-link-holder">
                <a class="raptive-chat-powered-by-link" href="https://raptive.com/" target="_blank"><svg viewBox="0 0 236 28" xmlns="http://www.w3.org/2000/svg"><path d="M145.404 14.1414C147.632 14.7904 148.196 15.5354 148.196 17.793V20.4355H152.551V16.3509C152.551 14.1654 151.501 12.9153 149.221 12.4116L146.377 11.7626C150.887 11.5947 153.141 9.91285 153.141 6.7171V6.57318C153.141 3.20952 150.604 1 145.532 1H137V20.4355H141.356V12.9648L145.404 14.1414ZM145.429 3.97989C147.658 3.97989 148.734 5.01269 148.734 6.81445V6.95836C148.734 8.76012 147.658 9.79293 145.429 9.79293H141.356V3.97847H145.429V3.97989ZM201.742 3.4268V3.33086C201.742 2.15415 200.845 1.24127 199.386 1.24127C197.926 1.24127 197.028 2.15415 197.028 3.33086V3.4268C197.028 4.60351 197.925 5.5164 199.386 5.5164C200.847 5.5164 201.742 4.60351 201.742 3.4268ZM185.422 9.09593H187.523V15.8952C187.523 19.2589 188.624 20.4355 192.314 20.4355H195.799V17.793H193.134C192.007 17.793 191.622 17.4331 191.622 16.4723V9.09734H195.669V6.45467H191.622V2.12875H187.523V6.45325H185.422V9.09593ZM153.475 13.5163C153.475 17.553 156.063 20.6275 159.778 20.6275C162.057 20.6275 163.749 19.5467 164.62 17.7449V20.4355H168.719V6.45325H164.62V9.14389C163.749 7.34214 162.057 6.26137 159.778 6.26137C156.063 6.26137 153.475 9.33579 153.475 13.3724V13.5163ZM185.807 13.5163V13.3724C185.807 9.33719 183.219 6.26137 179.504 6.26137C177.225 6.26137 175.533 7.34214 174.662 9.14389V6.45325H170.563V25H174.662V17.7449C175.533 19.5467 177.225 20.6275 179.504 20.6275C183.219 20.6275 185.807 17.553 185.807 13.5163ZM230 16.0391H226.311C225.797 17.2159 224.723 17.9368 223.494 17.9368C221.547 17.9368 220.292 16.7121 220.062 14.2374H230V13.6603C230 9.07194 227.234 6.26137 222.904 6.26137C218.831 6.26137 215.885 9.3118 215.885 13.3724V13.5163C215.885 17.7689 218.907 20.6275 223.288 20.6275C226.643 20.6275 229.18 18.9936 229.999 16.0391M216.678 6.45325H213.09L209.812 16.5908L206.533 6.45325H202.153L207.276 20.4355H211.554L216.678 6.45325ZM201.434 6.45325H197.335V20.4355H201.434V6.45325ZM223.185 8.95201C224.774 8.95201 225.9 10.0088 226.183 11.9305H220.241C220.599 9.96083 221.675 8.95201 223.187 8.95201M157.625 13.5163V13.3724C157.625 10.7778 159.06 9.19187 161.186 9.19187C163.312 9.19187 164.748 10.7778 164.748 13.3724V13.5163C164.748 16.1111 163.312 17.697 161.186 17.697C159.06 17.697 157.625 16.1111 157.625 13.5163ZM181.656 13.5163C181.656 16.1111 180.221 17.697 178.094 17.697C175.968 17.697 174.533 16.1111 174.533 13.5163V13.3724C174.533 10.7778 175.968 9.19187 178.094 9.19187C180.221 9.19187 181.656 10.7778 181.656 13.3724V13.5163Z" fill="black"/>
<path d="M11.475 14.168C11.475 12.611 11.124 11.423 10.422 10.604C9.72 9.776 8.784 9.362 7.614 9.362C7.092 9.362 6.597 9.4115 6.129 9.5105C5.661 9.6005 5.2155 9.7445 4.7925 9.9425C4.3785 10.1315 3.987 10.3745 3.618 10.6715L3.591 9.8345C4.113 9.4655 4.6035 9.155 5.0625 8.903C5.5305 8.651 5.967 8.4485 6.372 8.2955C6.786 8.1335 7.173 8.0165 7.533 7.9445C7.893 7.8725 8.2305 7.8365 8.5455 7.8365C9.6885 7.8365 10.647 8.075 11.421 8.552C12.204 9.02 12.798 9.677 13.203 10.523C13.608 11.36 13.8105 12.3365 13.8105 13.4525C13.8105 14.8565 13.518 16.0715 12.933 17.0975C12.348 18.1145 11.5605 18.8975 10.5705 19.4465C9.5895 19.9955 8.5005 20.27 7.3035 20.27C6.8625 20.27 6.4215 20.234 5.9805 20.162C5.5485 20.09 5.103 19.9775 4.644 19.8245C4.194 19.6715 3.7215 19.469 3.2265 19.217H4.482V25.6565L6.7635 26.264V26.7365H0.3915V26.264L2.4165 25.6565V10.496C2.2995 10.379 2.151 10.271 1.971 10.172C1.791 10.064 1.5705 9.956 1.3095 9.848C1.0575 9.731 0.765 9.6095 0.432 9.4835V9.173L3.9015 7.8095H4.1445L4.482 9.5645V16.5575C4.482 17.0615 4.617 17.5205 4.887 17.9345C5.157 18.3395 5.5395 18.659 6.0345 18.893C6.5295 19.118 7.1055 19.2305 7.7625 19.2305C8.5455 19.2305 9.2115 19.028 9.7605 18.623C10.3095 18.209 10.7325 17.624 11.0295 16.868C11.3265 16.103 11.475 15.203 11.475 14.168ZM21.8377 19.3115C22.5397 19.3115 23.1607 19.1315 23.7007 18.7715C24.2497 18.4115 24.6772 17.867 24.9832 17.138C25.2892 16.4 25.4422 15.464 25.4422 14.33C25.4422 13.124 25.2892 12.1115 24.9832 11.2925C24.6862 10.4735 24.2632 9.857 23.7142 9.443C23.1652 9.02 22.5172 8.8085 21.7702 8.8085C21.0592 8.8085 20.4337 8.9885 19.8937 9.3485C19.3537 9.6995 18.9307 10.244 18.6247 10.982C18.3187 11.72 18.1657 12.6515 18.1657 13.7765C18.1657 14.9735 18.3142 15.986 18.6112 16.814C18.9172 17.633 19.3447 18.254 19.8937 18.677C20.4427 19.1 21.0907 19.3115 21.8377 19.3115ZM21.7567 20.27C20.6137 20.27 19.5967 20.0135 18.7057 19.5005C17.8147 18.9785 17.1172 18.2585 16.6132 17.3405C16.1092 16.4135 15.8572 15.356 15.8572 14.168C15.8572 12.944 16.1182 11.855 16.6402 10.901C17.1622 9.947 17.8732 9.2 18.7732 8.66C19.6822 8.111 20.7037 7.8365 21.8377 7.8365C22.9987 7.8365 24.0202 8.0975 24.9022 8.6195C25.7932 9.1325 26.4907 9.848 26.9947 10.766C27.4987 11.684 27.7507 12.7415 27.7507 13.9385C27.7507 15.1625 27.4852 16.2515 26.9542 17.2055C26.4322 18.1595 25.7167 18.911 24.8077 19.46C23.9077 20 22.8907 20.27 21.7567 20.27ZM45.0455 9.146L43.25 8.6735V8.1065H47.651V8.6735L46.1525 9.146L42.629 20.2835H42.0215L37.796 10.577H38.3495L34.2995 20.2835H33.692L30.02 9.281L28.3325 8.6735V8.1065H33.962V8.6735L32.18 9.227L34.934 17.597L34.4075 17.6915L38.39 7.823H38.849L43.088 17.57L42.5615 17.6915L45.0455 9.146ZM53.8509 7.8365C54.7419 7.8365 55.5114 8.03 56.1594 8.417C56.8074 8.804 57.3249 9.371 57.7119 10.118C58.0989 10.865 58.3374 11.7785 58.4274 12.8585H50.0574L50.0709 11.9675L57.1044 11.6975L56.1594 12.2645C56.0964 11.5625 55.9614 10.955 55.7544 10.442C55.5564 9.929 55.2819 9.533 54.9309 9.254C54.5889 8.975 54.1524 8.8355 53.6214 8.8355C52.9734 8.8355 52.4064 9.0155 51.9204 9.3755C51.4344 9.7355 51.0564 10.262 50.7864 10.955C50.5254 11.639 50.3949 12.4805 50.3949 13.4795C50.3949 14.5595 50.5884 15.482 50.9754 16.247C51.3714 17.012 51.9249 17.597 52.6359 18.002C53.3469 18.398 54.1794 18.596 55.1334 18.596C55.5024 18.596 55.8624 18.5465 56.2134 18.4475C56.5644 18.3485 56.9109 18.2045 57.2529 18.0155C57.5949 17.8175 57.9189 17.5745 58.2249 17.2865L58.5354 17.624C58.0674 18.236 57.5904 18.74 57.1044 19.136C56.6274 19.523 56.1189 19.811 55.5789 20C55.0389 20.18 54.4584 20.27 53.8374 20.27C52.7754 20.27 51.8259 20.0135 50.9889 19.5005C50.1519 18.9875 49.4904 18.281 49.0044 17.381C48.5274 16.472 48.2889 15.4235 48.2889 14.2355C48.2889 13.0655 48.5094 11.999 48.9504 11.036C49.4004 10.064 50.0394 9.29 50.8674 8.714C51.7044 8.129 52.6989 7.8365 53.8509 7.8365ZM68.0999 7.9175C68.5499 7.9175 68.8784 8.03 69.0854 8.255C69.3014 8.471 69.4094 8.759 69.4094 9.119C69.4094 9.533 69.2744 9.8705 69.0044 10.1315C68.7434 10.3835 68.3834 10.5095 67.9244 10.5095C67.7264 10.5095 67.5284 10.4735 67.3304 10.4015C67.1324 10.3295 66.9209 10.2575 66.6959 10.1855C66.4799 10.1135 66.2369 10.0775 65.9669 10.0775C65.7509 10.0775 65.5169 10.1135 65.2649 10.1855C65.0219 10.2485 64.7789 10.3385 64.5359 10.4555C64.3019 10.5725 64.0859 10.7075 63.8879 10.8605L63.6449 10.3745C64.2029 9.9245 64.7024 9.5465 65.1434 9.2405C65.5934 8.9255 65.9984 8.6735 66.3584 8.4845C66.7184 8.2865 67.0424 8.1425 67.3304 8.0525C67.6184 7.9625 67.8749 7.9175 68.0999 7.9175ZM64.1309 10.307V18.92L66.2504 19.5275V20H60.0404V19.5275L62.0789 18.92V10.496C61.9619 10.379 61.8089 10.271 61.6199 10.172C61.4399 10.064 61.2239 9.956 60.9719 9.848C60.7199 9.731 60.4274 9.6095 60.0944 9.4835V9.173L63.7799 7.8095H64.0229L64.1309 10.307ZM75.7884 7.8365C76.6794 7.8365 77.4489 8.03 78.0969 8.417C78.7449 8.804 79.2624 9.371 79.6494 10.118C80.0364 10.865 80.2749 11.7785 80.3649 12.8585H71.9949L72.0084 11.9675L79.0419 11.6975L78.0969 12.2645C78.0339 11.5625 77.8989 10.955 77.6919 10.442C77.4939 9.929 77.2194 9.533 76.8684 9.254C76.5264 8.975 76.0899 8.8355 75.5589 8.8355C74.9109 8.8355 74.3439 9.0155 73.8579 9.3755C73.3719 9.7355 72.9939 10.262 72.7239 10.955C72.4629 11.639 72.3324 12.4805 72.3324 13.4795C72.3324 14.5595 72.5259 15.482 72.9129 16.247C73.3089 17.012 73.8624 17.597 74.5734 18.002C75.2844 18.398 76.1169 18.596 77.0709 18.596C77.4399 18.596 77.7999 18.5465 78.1509 18.4475C78.5019 18.3485 78.8484 18.2045 79.1904 18.0155C79.5324 17.8175 79.8564 17.5745 80.1624 17.2865L80.4729 17.624C80.0049 18.236 79.5279 18.74 79.0419 19.136C78.5649 19.523 78.0564 19.811 77.5164 20C76.9764 20.18 76.3959 20.27 75.7749 20.27C74.7129 20.27 73.7634 20.0135 72.9264 19.5005C72.0894 18.9875 71.4279 18.281 70.9419 17.381C70.4649 16.472 70.2264 15.4235 70.2264 14.2355C70.2264 13.0655 70.4469 11.999 70.8879 11.036C71.3379 10.064 71.9769 9.29 72.8049 8.714C73.6419 8.129 74.6364 7.8365 75.7884 7.8365ZM91.6709 11.5625C91.6709 10.7885 91.3964 10.1495 90.8474 9.6455C90.2984 9.1325 89.5154 8.876 88.4984 8.876C87.6884 8.876 86.9954 9.083 86.4194 9.497C85.8524 9.902 85.4204 10.4825 85.1234 11.2385C84.8264 11.9945 84.6779 12.8945 84.6779 13.9385C84.6779 14.9825 84.8354 15.8645 85.1504 16.5845C85.4744 17.2955 85.9244 17.8355 86.5004 18.2045C87.0854 18.5645 87.7649 18.7445 88.5389 18.7445C89.2499 18.7445 89.9204 18.632 90.5504 18.407C91.1894 18.182 91.8104 17.8175 92.4134 17.3135L92.4539 18.164C91.8149 18.596 91.2659 18.9515 90.8069 19.2305C90.3569 19.5005 89.9519 19.712 89.5919 19.865C89.2409 20.018 88.9079 20.1215 88.5929 20.1755C88.2869 20.2385 87.9674 20.27 87.6344 20.27C86.5004 20.27 85.5374 20.036 84.7454 19.568C83.9624 19.091 83.3639 18.4295 82.9499 17.5835C82.5449 16.7375 82.3424 15.7655 82.3424 14.6675C82.3424 13.5965 82.5134 12.6425 82.8554 11.8055C83.1974 10.9595 83.6654 10.244 84.2594 9.659C84.8624 9.065 85.5554 8.615 86.3384 8.309C87.1214 7.994 87.9584 7.8365 88.8494 7.8365C89.2994 7.8365 89.7404 7.8725 90.1724 7.9445C90.6044 8.0165 91.0454 8.129 91.4954 8.282C91.9544 8.435 92.4314 8.6375 92.9264 8.8895L91.6709 9.5915V3.017C91.5629 2.9 91.4144 2.783 91.2254 2.666C91.0454 2.549 90.8384 2.432 90.6044 2.315C90.3794 2.198 90.1364 2.0855 89.8754 1.9775V1.7345L93.6419 0.694999H93.8714L93.7364 2.8685V18.2045C93.8174 18.2855 93.9254 18.3665 94.0604 18.4475C94.2044 18.5285 94.3619 18.6095 94.5329 18.6905C94.7039 18.7715 94.8749 18.8435 95.0459 18.9065C95.2169 18.9605 95.3744 19.001 95.5184 19.028V19.4195L92.0759 20.243H91.8329L91.6709 18.218V11.5625ZM104.743 19.217L106.201 19.163L103.987 20.2565L103.595 20.108L103.933 17.192V3.368C103.816 3.242 103.663 3.1115 103.474 2.9765C103.285 2.8325 103.055 2.684 102.785 2.531C102.515 2.378 102.205 2.225 101.854 2.072V1.802L105.877 0.694999H106.133L105.985 2.8685V16.5575C105.985 17.0525 106.12 17.507 106.39 17.921C106.66 18.326 107.038 18.6455 107.524 18.8795C108.019 19.1135 108.604 19.2305 109.279 19.2305C110.062 19.2305 110.728 19.028 111.277 18.623C111.826 18.209 112.244 17.624 112.532 16.868C112.829 16.103 112.978 15.203 112.978 14.168C112.978 13.124 112.816 12.2465 112.492 11.5355C112.177 10.8155 111.731 10.2755 111.155 9.9155C110.579 9.5465 109.9 9.362 109.117 9.362C108.595 9.362 108.095 9.4115 107.618 9.5105C107.141 9.6005 106.696 9.7445 106.282 9.9425C105.877 10.1315 105.494 10.3745 105.134 10.6715L105.094 9.8345C105.598 9.4835 106.075 9.182 106.525 8.93C106.984 8.678 107.416 8.4755 107.821 8.3225C108.226 8.1605 108.613 8.039 108.982 7.958C109.36 7.877 109.715 7.8365 110.048 7.8365C111.191 7.8365 112.154 8.075 112.937 8.552C113.72 9.02 114.314 9.677 114.719 10.523C115.124 11.36 115.327 12.3365 115.327 13.4525C115.327 14.4785 115.16 15.41 114.827 16.247C114.503 17.084 114.044 17.804 113.45 18.407C112.856 19.01 112.154 19.4735 111.344 19.7975C110.534 20.1125 109.652 20.27 108.698 20.27C108.293 20.27 107.879 20.234 107.456 20.162C107.042 20.09 106.61 19.9775 106.16 19.8245C105.71 19.6715 105.238 19.469 104.743 19.217ZM123.81 17.9075L122.717 20.4725L117.573 9.281L115.886 8.6735V8.1065H121.583V8.6735L119.787 9.227L123.81 17.9075ZM118.829 27.0065C118.352 27.0065 117.951 26.876 117.627 26.615C117.312 26.354 117.155 25.994 117.155 25.535C117.155 25.292 117.2 25.085 117.29 24.914C117.389 24.743 117.515 24.6035 117.668 24.4955C117.83 24.3965 117.996 24.347 118.167 24.347C118.347 24.347 118.514 24.3875 118.667 24.4685C118.82 24.5585 118.986 24.644 119.166 24.725C119.346 24.815 119.549 24.86 119.774 24.86C119.999 24.86 120.201 24.815 120.381 24.725C120.57 24.644 120.75 24.4865 120.921 24.2525C121.101 24.0185 121.277 23.6855 121.448 23.2535L122.946 19.46L123.581 17.786L126.672 9.146L124.863 8.6735V8.1065H129.305V8.6735L127.833 9.146L122.636 22.8215C122.222 23.9015 121.821 24.743 121.434 25.346C121.047 25.958 120.642 26.3855 120.219 26.6285C119.796 26.8805 119.333 27.0065 118.829 27.0065Z" fill="black"/></svg></a>
            </div>
            <div class="raptive-chat-notice-link-holder">
                <a class="raptive-chat-notice-link" href="/raptive-chatbot-notice" target="_blank">Notice to Users</a>
            </div>
            <div class="raptive-chat-popup" id="raptiveChatModal">
                <iframe src="#"  id="raptiveChatFrame" frameborder="0"></iframe>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', buttonDom);
        document.querySelector('.raptive-chat-button').addEventListener('click', window.toggleBotVisibility);
    }

    function initializePage() {
        const pageURL = window.location.href;
        const crawlPageEndpoint = encodeURI(`${chatbotDomain}/api/page?url=${pageURL}`);

        // Gracefully degrade (ie. don't throw an error) if fetch is not supported
        if(fetch) {
            fetch(crawlPageEndpoint)
                .catch(err => {
                    if(isNonProdEnv){
                        console.log(err);
                    }
                });
        }
    }

    // Query the endpoint for relevant style & other meta data about the site. 
    // This will be used to customize the chatbot experience.
    // Dummy function here to emulate the dummy data that we get from the endpoint above
    function InitializeChatbot(callback) {
        const localStorageKey = 'raptiveChatBotData';
        const raptiveChatbotData = localStorage.getItem(localStorageKey);

        // remove the site config data from local storage for any browsers that have it from before
        if(raptiveChatbotData) {
            localStorage.removeItem(localStorageKey);
        }

        if(fetch) {
            fetch(siteConfigEndpoint)
                .then(response => response.json())
                .then(config => {
                    config.enabled = isOnChatPage || shouldShowChatbotOnPage(config);
                    if(config.enabled) {
                        if(!isOnChatPage){
                            insertChatButtonDOM();
                        }
                        setProperties(config);
                    }
                    if(typeof callback === 'function') {
                        callback();
                    }
                })
                .catch((err) => {
                    if(isNonProdEnv){
                        console.log(err);
                    }
                });
        }
    }

    // Most pages have a video ad that moves from being in the body of the page
    // to being in the bottom right corner of the page. 

    // This logic handles moving the chat button to accomodate the video moving.
    function handleVideoAdLayout() {
        // for the first 10 seconds, poll to check whether or not 
        // there is a video element on the page, if not then clear polling
        let secondsToWatch = 10;
        let counter = 0;

        // videoPlayerSelector - the class of the video element to attach a mutationObserver on
        // activeClass - the class that signifies that the video element is "active"
        function watchAndHandleVideoElement(videoPlayerSelector, activeClass) {
            let videoPollInterval = setInterval(() => {
                counter++;
                if (counter >= secondsToWatch) {
                    clearInterval(videoPollInterval);
                }
                let videoPlayer = document.querySelector(videoPlayerSelector);
                if (videoPlayer) {
                    // if we find the video player, then observe it so that
                    // we can adapt the chat button depending on the video's position
                    let observer = new MutationObserver((mutationsList, observer) => {
                        let videoIsInBottomRight = videoPlayer.classList.contains(activeClass);
                        let chatDOMPresent = document.querySelector('.raptive-chat-holder') !== null;
                        if(chatDOMPresent){
                            if (videoIsInBottomRight) {
                                document.querySelector('.raptive-chat-holder').classList.add('raptive-chat-holder-with-video');
                                document.querySelector('.raptive-chat-button').classList.add('raptive-chat-button-with-video');
                            } else {
                                document.querySelector('.raptive-chat-holder').classList.remove('raptive-chat-holder-with-video');
                                document.querySelector('.raptive-chat-button').classList.remove('raptive-chat-button-with-video');
                            }
                        }
                    });
                    observer.observe(videoPlayer, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    clearInterval(videoPollInterval);
                }
            }, 1000);
        }

        watchAndHandleVideoElement('.adthrive-player-position', 'adthrive-collapse-bottom-right');
        watchAndHandleVideoElement('.adthrive-sticky-outstream', 'adthrive-sticky-outstream-active');
    }

    // this logic handles moving the chat button to accomodate the slickstream plugin buttons
    function handleSlickstreamLayout(){
        var hasSlickstream = document.querySelector('meta[property="slick:wpversion"]') !== null;
        let chatDOMPresent = document.querySelector('.raptive-chat-holder') !== null;
        if(hasSlickstream && chatDOMPresent){
            document.querySelector('.raptive-chat-holder').classList.add('raptive-chat-holder-with-slickstream');
            document.querySelector('.raptive-chat-button').classList.add('raptive-chat-button-with-slickstream');
        }
    }

    window.toggleBotVisibility = () => {
        const chatButtonElement = document.querySelector('.raptive-chat-button');
        const chatHolderElement = document.querySelector('.raptive-chat-holder');
        
        if (!chatHolderElement.classList.contains('show-chat-popup')) {
            trackEventInUAandGA4('open_chatbot', 'Open Chatbot');
            let chevronColor = raptiveConfig ? raptiveConfig.colorText : 'white';
            chatButtonElement.innerHTML = `<svg data-stormbeam-creatorbot="${ClickstreamEventName.BotClosed}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z" fill="${chevronColor}"></path></svg>`;
            chatButtonElement.setAttribute('data-stormbeam-creatorbot', ClickstreamEventName.BotClosed);
        } else {
            chatButtonElement.innerHTML = 'Talk to our AI Chatbot';
            chatButtonElement.setAttribute('data-stormbeam-creatorbot', ClickstreamEventName.BotOpened);
        }
        chatHolderElement.classList.toggle('show-chat-popup');
        chatButtonElement.classList.toggle('raptive-chat-button-active');
    }

    // * SEPARATE CHAT PAGE CODE * //

    // chat iframe should fill available space between header and footer
    function resizeSeparateChatIframe() {
        const spaceBuffer = 200; // pixel buffer to accomodate the admin bar
        const minHeight = 400;
        const chatbotIframeElement = document.querySelector('.raptive-chatbot-shortcode-iframe');
        let heightToFillAvailableArea = window.innerHeight - chatbotIframeElement.getBoundingClientRect().top - spaceBuffer;
        heightToFillAvailableArea = (heightToFillAvailableArea < minHeight) ? minHeight : heightToFillAvailableArea;
        chatbotIframeElement.style.height = heightToFillAvailableArea + 'px';
    }

    function initializeSeparateChatPageResizing(){
        let stabilizationTime = 1000;
        let lastHeight = document.body.clientHeight;
        let timeoutId;

        const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                const newHeight = entry.contentRect.height;
                if (newHeight !== lastHeight) {
                    lastHeight = newHeight;
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(() => {
                        // This code will run if the height has not changed for stabilizationTime
                        ro.unobserve(document.body);
                        resizeSeparateChatIframe();
                        document.querySelector('.raptive-chatbot-separate-page-extra-links').style.opacity = 1;
                    }, stabilizationTime);
                }
            }
        });

        ro.observe(document.body);
    }

    function initializeChatButton() {
        InitializeChatbot(() => {
            handleSlickstreamLayout();
        });
        handleVideoAdLayout();
    }

    function initializeSeparateChatPage() {
        InitializeChatbot();
        initializeSeparateChatPageResizing();
        window.addEventListener('resize', resizeSeparateChatIframe);
        setTimeout(resizeSeparateChatIframe, 1000); // safari bug
    }

    function initialize(){
        if (isOnChatPage) {
            initializeSeparateChatPage();
        } else if(!isMobile) {
            initializePage();
            initializeChatButton();
        }
    }

    if (document.readyState === "loading") {  // Loading hasn't finished yet
        document.addEventListener("DOMContentLoaded", function() {
            initialize();
        });
    } else {  // `DOMContentLoaded` has already fired
        initialize();
    }
})();

<?php

function raptive_creatorbot_notice_template(){ 
    return '
<style>
    .raptive-chatbot-notice h2{
        font-weight: bold;
        margin-top:20px;
    }

    .raptive-chatbot-notice ul{
        margin-left: 15px;
        list-style: disc;
    }

    .raptive-chatbot-notice p{
        margin-top: 10px;
    }
</style>

<div class="raptive-chatbot-notice-holder">
    <div class="raptive-chatbot-notice">
       <p>This application is a prototype developed by <a href="https://raptive.com/">Raptive</a> in partnership with my site to use artificial intelligence (AI) to enhance your experience as a reader. Feel free to ask it questions you have about any of the following topics:</p>
       <ul>
          <li>General recipe questions</li>
          <li>My suggestions for ingredient substitutions or ways to customize a recipe to your liking</li>
          <li>Ideas for what to make next</li>
          <li>Recipes to make based on the ingredients you have on hand</li>
       </ul>
       <p></p>
       <p>The results are all based on the content of my site, but might not be perfect. Given that this product uses AI, some results could be confusing or, at times, inappropriate and do not always represent my views. Please do not use this application as a source for health or dietary advice and always check with a healthcare provider if there is information you disagree with or have questions about. We are continuing to refine this prototype to improve the quality of results, but please be cognizant of the questions you are asking in order to avoid inappropriate use.</p>
       <p></p>
       <p>The conversations conducted using the application will be stored for 90 days in order to continue making the product experience better. No conversation data will be connected with any other identifying information, even if you are logged in to the site. Please avoid using personal information in your conversations with the product. Your personal information will be subject to use as outlined in our Privacy Policy. Your conversations will be stored separately and deleted after 30 days.</p>
       <p></p>
       <p>California residents have additional rights to access or delete personal information collected from use of this application. Those rights under the California Consumer Protection Act ("CCPA") are detailed in our Privacy Policy.</p>
    </div>
</div>';
}

<?php 
// Your App Client Secret
define('APP_SECRET','hush');


if(authRequest() === false){
    exit('Unauthorized Request');
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Shopify Calculate Digital Signature
 *
 * Example: https://shopify.dev/docs/apps/online-store/app-proxies#calculate-a-digital-signature
 * 
 * @return Boolen ( true/false)
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
function authRequest(){
    $shared_secret = APP_SECRET;
    $query_string = $_SERVER['QUERY_STRING'];
    
    // $query_string = 'extra=1&extra=2&shop=shop-name.myshopify.com&logged_in_customer_id=&path_prefix=%2Fapps%2Fawesome_reviews&timestamp=1317327555&signature=e072b6d7e6622d85912a5214b860d3100dc1e73d9bc29f43796ac8c9ff8093cb';
    
    parse_str($query_string, $query_array);
    // $query_array = [
    //     "extra" => ["1", "2"],
    //     "shop" => "shop-name.myshopify.com",
    //     "logged_in_customer_id" => "",
    //     "path_prefix" => "/apps/awesome_reviews",
    //     "timestamp" => "1317327555",
    //     "signature" => "e072b6d7e6622d85912a5214b860d3100dc1e73d9bc29f43796ac8c9ff8093cb",
    // ];
    
    // Remove and save the "signature" entry
    $signature = $query_array['signature'];
    unset($query_array['signature']);
    
    
    // Create a new array to store combined parameters
    $combinedParams = [];
    
    // Combine duplicate parameters into a single parameter with comma-separated values
    foreach ($query_array as $key => $value) {
        if (!isset($combinedParams[$key])) {
            $combinedParams[$key] = $value;
        } else {
            $combinedParams[$key] .= ',' . $value;
        }
    }
    
    ksort($combinedParams);
    
    $sorted_params = urldecode(http_build_query($combinedParams, '', ''));
    // $sorted_params = 'extra=1,2logged_in_customer_id=path_prefix=/apps/awesome_reviewsshop=shop-name.myshopify.comtimestamp=1317327555';

    $calculated_signature = hash_hmac('sha256', $sorted_params, $shared_secret);
    if (!hash_equals($signature, $calculated_signature)) {
        return false;
    }
    return true;
}


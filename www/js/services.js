angular.module('app.services', [])
    .service('WC', function() {
        return {
            WC: function() {
                var Woocommerce = new WooCommerceAPI.WooCommerceAPI({
                    url: 'http://blogger.amanraikwar.in',
                    consumerKey: 'ck_6948eb0605a0e72472182c352af4492f6dd2c71a',
                    consumerSecret: 'cs_e5b6f3c58aca6de05c2ccf1fbc476753aae9cb01'
                });
                return Woocommerce;
            }
        }
    });

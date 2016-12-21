angular.module('starter', ['ionic', 'ngStorage', 'starter.controllers', 'app.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.bloggerServiceUrl = 'http://blogger.amanraikwar.in/api/';

    $rootScope.showLoader = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };

    $rootScope.hideLoader = function() {
        $ionicLoading.hide();
    }

    $rootScope.show = function(text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading..',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };

    $rootScope.hide = function() {
        $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
        $rootScope.show(text);
        $timeout(function() {
            $rootScope.hide();
        }, 1999);
    };
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'MenuCtrl'
        })
        .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/woocommerce/browse.html',
                    controller: 'BrowseCtrl'
                }
            }
        })
        .state('app.products', {
            url: '/products',
            views: {
                'menuContent': {
                    templateUrl: 'templates/woocommerce/products.html',
                    controller: 'ProductsCtrl'
                }
            }
        })
        .state('app.productDetail', {
            url: '/products/:productId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/woocommerce/product-detail.html',
                    controller: 'ProductsCtrl'
                }
            }
        })
        .state('app.checkout', {
            url: '/checkout',
            views: {
                'menuContent': {
                    templateUrl: 'templates/woocommerce/checkout.html',
                    controller: 'CheckoutCtrl'
                }
            }
        })
        .state('app.categories', {
            url: '/categories',
            views: {
                'menuContent': {
                    templateUrl: 'templates/woocommerce/categories.html',
                    controller: 'CategoryCtrl'
                }
            }
        })
        .state('app.faqs', {
            url: '/faqs',
            views: {
                'menuContent': {
                    templateUrl: 'templates/faqs/index.html',
                    controller: 'FaqsCtrl'
                }
            }
        })
        .state('app.signup', {
            url: '/signup',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup.html',
                    controller: 'SignUpCtrl'
                }
            }
        })
        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/products');
});

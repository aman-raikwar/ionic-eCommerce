angular.module('starter.controllers', ['app.productsController', 'app.categoriesController', 'app.faqsController', 'app.Auth'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('MenuCtrl', function($scope, $state, $stateParams, $localStorage, $rootScope, $ionicModal, $ionicPopup, WC) {

    $localStorage.cart = [];

    $scope.$on('$ionicView.enter', function(e) {
        console.log("userData", $localStorage.userData);
        if ($localStorage.userData) {
            $rootScope.userData = $localStorage.userData
        }
    });

    $scope.logout = function() {
        $localStorage.userData = undefined;
        $rootScope.userData = undefined;
        $state.go('app.products');
    }

    if ($localStorage.cart) {
        $rootScope.cartCount = $localStorage.cart.length;
    } else {
        $rootScope.cartCount = 0;
    }

    $scope.showCartModal = function() {

        $scope.cartItems = $localStorage.cart;

        if (!$scope.cartItems || $scope.cartItems.length == 0) {
            console.log("no items in the cart!");
            $ionicPopup.show({
                title: 'No items in Cart!',
                //template: '<center>No items in Cart!</center>',
                buttons: [{
                    text: 'OK',
                    type: 'button-assertive'
                }]
            })
            return;
        }

        $scope.costSum = 0;

        $scope.cartItems.forEach(function(element, index) {
            $scope.costSum += Number(element.price);
        });

        $scope.costSum = $scope.costSum.toFixed(2);


        $scope.modal = {};

        $ionicModal.fromTemplateUrl('templates/woocommerce/cart.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.handleCheckout = function() {
        console.log("Handle Checkout Called!");
        $scope.modal.hide();
        if ($localStorage.userData)
            $state.go("app.checkout")
        else
            $state.go("app.login")
    }

    var Woocommerce = WC.WC();

    Woocommerce.get('products/categories', function(err, data, res) {
        //console.log(res);
        $scope.categories = (JSON.parse(res)).product_categories;

        $scope.mainCategories = [];
        $scope.categories.forEach(function(element, index) {
            if (element.parent == 0) {
                $scope.mainCategories.push(element);
            }
        })
    });

})

.controller('CheckoutCtrl', function($scope, $localStorage, $ionicPopup, $ionicHistory, WC, $state) {

    $scope.newOrder = {};

    $scope.paymentMethods = [
        { method_id: "bacs", method_title: "Direct Bank Transfer" },
        { method_id: "cheque", method_title: "Cheque Payment" },
        { method_id: "cod", method_title: "Cash on Delivery" }
    ];

    $scope.switchBillingToShipping = function() {
        console.log($scope.newOrder);
        $scope.newOrder.shipping = $scope.newOrder.billing;
    };

    $scope.placeOrder = function(newOrder) {

        $scope.orderItems = [];

        if ($localStorage.cart) {
            $localStorage.cart.forEach(function(element, index) {
                $scope.orderItems.push({ product_id: element.id, quantity: element.count });
            });
            console.log($scope.orderItems);
        } else {
            console.log("No products added! Returning!");
            return;
        }

        var paymentData = {};

        $scope.paymentMethods.forEach(function(element, index) {
            if (element.method_title == newOrder.paymentMethod) {
                paymentData = element;
            }
        });

        var data = {
            payment_details: {
                method_id: paymentData.method_id,
                method_title: paymentData.method_title,
                paid: true
            },
            billing_address: {
                first_name: newOrder.billing.first_name,
                last_name: newOrder.billing.last_name,
                address_1: newOrder.billing.address_1,
                address_2: newOrder.billing.address_2,
                city: newOrder.billing.city,
                state: newOrder.billing.state,
                postcode: newOrder.billing.postcode,
                country: newOrder.billing.country,
                email: $localStorage.userData.data.user.email,
                phone: newOrder.billing.phone
            },
            shipping_address: {
                first_name: newOrder.shipping.first_name,
                last_name: newOrder.shipping.last_name,
                address_1: newOrder.shipping.address_1,
                address_2: newOrder.shipping.address_2,
                city: newOrder.shipping.city,
                state: newOrder.shipping.state,
                postcode: newOrder.shipping.postcode,
                country: newOrder.shipping.country
            },
            customer_id: $localStorage.userData.data.user.id || '',
            line_items: $scope.orderItems
        };

        var orderData = {};

        orderData.order = data;

        var Woocommerce = WC.WC();

        Woocommerce.post('orders', orderData, function(err, data, res) {
            if (err) {
                console.log(err);
            }

            console.log(JSON.parse(res));
            if (JSON.parse(res).order) {
                $ionicPopup.show({
                    title: 'Congratulations',
                    template: '<center>You order has been placed successfully. Your order number is ' + JSON.parse(res).order.order_number + '.</center>',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive',
                        onTap: function(e) {
                            $localStorage.cart = undefined;
                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true
                            });
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            $state.go('app.products');
                        }
                    }]
                });
            }
        });
    }

})

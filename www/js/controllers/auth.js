angular.module('app.Auth', [])

.controller('SignUpCtrl', function($scope, $ionicPopup, $state, WC) {

    $scope.newUser = {};
    $scope.newUser.isValid = true;

    $scope.checkUserEmail = function(email) {

        var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) {
            $scope.newUser.isValid = false;
            $ionicPopup.show({
                template: "<center>Invalid Email! Please Check!</center>",
                buttons: [{
                    text: 'OK',
                    type: 'button-assertive'
                }]
            });
            return;
        }

        var Woocommerce = WC.WC();
        Woocommerce.get('customers/email/' + email, function(err, data, res) {
            if (err) {
                console.log(err);
            }

            if (JSON.parse(res).customer) {
                $scope.newUser.isValid = false;
                $ionicPopup.show({
                    template: "<center>This e-Mail is already registered. Please login or use another email address.</center>",
                    buttons: [{
                        text: "Login",
                        type: 'button-assertive',
                        onTap: function(e) {
                            $state.go("app.login");
                        }
                    }, {
                        text: "OK",
                        type: 'button-positive'
                    }]
                });
            } else {
                $scope.newUser.isValid = true;
            }
        });
    }


    $scope.switchBillingToShipping = function() {
        $scope.newUser.shipping_address = $scope.newUser.billing_address;
    };


    $scope.signUp = function(newUser) {

        var customerData = {};

        customerData.customer = {
            "email": newUser.email,
            "first_name": newUser.first_name,
            "last_name": newUser.last_name,
            "username": newUser.email.split("@")[0],
            "password": newUser.password,
            "billing_address": {
                "first_name": newUser.first_name,
                "last_name": newUser.last_name,
                "company": "",
                "address_1": newUser.billing_address.address_1,
                "address_2": newUser.billing_address.address_2,
                "city": newUser.billing_address.city,
                "state": newUser.billing_address.state,
                "postcode": newUser.billing_address.postcode,
                "country": newUser.billing_address.country,
                "email": newUser.email,
                "phone": newUser.billing_address.phone
            },
            "shipping_address": {
                "first_name": newUser.first_name,
                "last_name": newUser.last_name,
                "company": "",
                "address_1": newUser.shipping_address.address_1,
                "address_2": newUser.shipping_address.address_2,
                "city": newUser.shipping_address.city,
                "state": newUser.shipping_address.state,
                "postcode": newUser.shipping_address.postcode,
                "country": newUser.shipping_address.country
            }
        };

        var Woocommerce = WC.WC();

        Woocommerce.post('customers', customerData, function(err, data, res) {
            if (err)
                console.log(err);

            if (JSON.parse(res).customer) {
                $ionicPopup.show({
                    title: "Congratulations",
                    template: "Your account has been created successfully. Please login.",
                    buttons: [{
                        text: "Login",
                        type: "button-assertive",
                        onTap: function(e) {
                            $state.go('app.login');
                        }
                    }]
                });
            } else {
                $ionicPopup.show({
                    title: "OOPS",
                    template: JSON.parse(res).errors[0].message,
                    buttons: [{
                        text: "OK",
                        type: "button-assertive"
                    }]
                });
            }
        });

    };


})

.controller('LoginCtrl', function($scope, $rootScope, $http, $localStorage, $ionicPopup, $state, WC, $ionicHistory) {

    $scope.login = function(userData) {

        $http.get($rootScope.bloggerServiceUrl + 'user/generate_auth_cookie/?insecure=cool&username=' + userData.username + '&password=' + userData.password)
            .then(function(response) {
                console.log(response);

                if (response.data.user) {
                    $localStorage.userData = response;
                    $ionicPopup.show({
                        title: 'Welcome ' + response.data.user.firstname,
                        template: '<center>You have logged in successfully.</center>',
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive',
                            onTap: function(e) {
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
                } else {
                    $ionicPopup.show({
                        title: 'Something is wrong!',
                        template: '<center>Please check your username and password.</center>',
                        buttons: [{
                            text: 'Retry',
                            type: 'button-assertive'
                        }]
                    });
                }
            });

    }
})

.controller('ProfileCtrl', function($scope, $rootScope, $http, $localStorage, $ionicPopup, $state, WC, $ionicHistory) {

})

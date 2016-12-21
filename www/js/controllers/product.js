angular.module('app.productsController', [])

.controller('ProductsCtrl', function($scope, $stateParams, $localStorage, $rootScope, $ionicSlideBoxDelegate, WC) {
    console.log('Product Controller');

    $scope.offset = 0;

    $scope.getProducts = function() {
        var Woocommerce = WC.WC();

        Woocommerce.get('products', function(err, data, res) {
            if (err) {
                console.log(err);
            }

            console.log(JSON.parse(res));

            JSON.parse(res).products.forEach(function(element, index) {
                element.count = 0;
            })

            $scope.products = JSON.parse(res).products;
            $scope.offset = $scope.offset + 10;
            $scope.canLoadMore = true;
            $scope.$apply();
        })
    };

    $scope.doRefresh = function() {
        $scope.getProducts();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.loadMore = function() {
        var Woocommerce = WC.WC();

        Woocommerce.get('products?filter[offset]=' + $scope.offset, function(err, data, res) {
            if (err) {
                console.log(err);
            }

            JSON.parse(res).products.forEach(function(element, index) {
                element.count = 0;
                $scope.products.push(element);
            })

            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (JSON.parse(res).products.length < 10) {
                $scope.canLoadMore = false;
                console.log("no more products!");
                return;
            } else {
                $scope.offset = $scope.offset + 10;
            }
        })
    };

    $scope.addToCart = function(product) {
        var countIncreased = false;
        $localStorage.cart.forEach(function(item, index) {
            if (item.id == product.id && !countIncreased) {
                console.log(item.id + " == " + product.id);
                item.count += 1;
                console.log("Count increased by 1");
                countIncreased = true;
            }
        });

        if (!countIncreased) {
            product.count = 1;
            $localStorage.cart.push(product);
        }

        console.log($localStorage.cart);
        console.log($localStorage.cart.length);
        $rootScope.cartCount = $localStorage.cart.length;
    };

    $scope.getProduct = function(productId) {
        var Woocommerce = WC.WC();
        Woocommerce.get('products/' + productId, function(err, data, res) {
            if (err) {
                console.log(err);
            }

            $scope.product = JSON.parse(res).product;
            $scope.images = JSON.parse(res).product.images;
            console.log($scope.product);
            $scope.$apply();

            $ionicSlideBoxDelegate.update();
            $ionicSlideBoxDelegate.loop(true);

            Woocommerce.get('products/' + productId + '/reviews', function(error, dat, response) {
                if (error) {
                    console.log(error);
                }

                $scope.reviews = JSON.parse(response).product_reviews;
            })
        })
    }

    if ($stateParams.productId != '' && $stateParams.productId != undefined) {
        $scope.getProduct($stateParams.productId);
    }

})

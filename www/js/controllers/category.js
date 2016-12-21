angular.module('app.categoriesController', [])

    .controller('CategoryCtrl', function ($scope, $stateParams, WC) {
        console.log('Category Controller');

        var Woocommerce = WC.WC();
        $scope.categories = [];

        Woocommerce.get('products/categories', function (err, data, res) {
            if (err) {
                console.log(err);
            }
            //console.log(JSON.parse(res));            
            $scope.categories = (JSON.parse(res)).product_categories;

            $scope.mainCategories = [];
            $scope.categories.forEach(function (element, index) {
                if (element.parent == 0) {
                    $scope.mainCategories.push(element);
                }
            });
            console.log($scope.mainCategories);
        });

        $scope.demo = 'clothing';
        $scope.setPlatform = function (p) {
            $scope.demo = p;
        }
    })    
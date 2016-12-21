angular.module('app.faqsController', [])

    .controller('FaqsCtrl', function ($scope, $http, $rootScope, $ionicPopover, $ionicModal) {
        $scope.faqs = [];
        $scope.limit = 10;
        $scope.pages = 0;
        $scope.count = 0;
        $scope.previousExists = false;
        $scope.nextExists = false;
        $scope.currentPage = 1;

        $scope.getAll = function (limit, currentPage) {

            $rootScope.showLoader();

            const currentUrl = $rootScope.bloggerServiceUrl + 'get_posts/?count=' + limit + '&page=' + currentPage + '&post_type=faqs';

            $http.get(currentUrl).success(function (response) {
                $scope.faqs = response.posts;
                $scope.pages = response.pages;
                $scope.count = response.count_total;

                if ($scope.count > $scope.limit) {
                    if ($scope.currentPage >= 1) {
                        $scope.nextExists = true;
                    }
                    if ($scope.pages == $scope.currentPage) {
                        $scope.nextExists = false;
                    }
                }

            }).error(function (error) {
                console.log('Fail to load All Posts under FAQs!');
            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
                $rootScope.hideLoader();
            });
        };

        $scope.doRefresh = function () {
            $scope.getAll($scope.limit, $scope.currentPage);
        };

        $scope.showNextRecords = function () {
            if ($scope.pages > $scope.currentPage) {
                $scope.currentPage += 1;
                $scope.previousExists = true;
            }

            if ($scope.pages == $scope.currentPage) {
                $scope.nextExists = false;
                $scope.previousExists = true;
            }

            console.log($scope.pages, $scope.currentPage);
            $scope.getAll($scope.limit, $scope.currentPage);
        }

        $scope.showPreviousRecords = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage -= 1;
                $scope.previousExists = true;
            }

            if ($scope.currentPage == 1) {
                $scope.nextExists = true;
                $scope.previousExists = false;
            }

            $scope.getAll($scope.limit, $scope.currentPage);
        }

        $scope.getAll($scope.limit, $scope.currentPage);

        var template = '<ion-popover-view style="top: 80px !important;margin-left: 0px;opacity: 1;width: 165px;left: 180px;height: 80px;">' +
            '<ion-content>' +
            '<div class="list">' +
            '<a style="padding: 6px 10px;" class="item" href="http://learn.ionicframework.com/" target="_blank">Learn Ionic</a>' +
            '<a style="padding: 6px 10px;" class="item" href="https://github.com/driftyco/ionic" target="_blank">Github Repo</a>' +
            '</div>' +
            '</ion-content>' +
            '</ion-popover-view>';
        $scope.settingsPopover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });

        $scope.showSettings = function ($event) {
            $scope.settingsPopover.show($event);
        };

        $scope.closeSettings = function () {
            $scope.settingsPopover.hide();
        };

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.settingsPopover.remove();
        });


        var template = '<ion-modal-view>' +
            '<ion-header-bar align-title="center">' +
            '<h1 class="title">My Modal title</h1>' +
            '</ion-header-bar>' +
            '<ion-content>' +
            'Hello!' +
            '</ion-content>' +
            '<ion-footer-bar align-title="center">' +
            '<button class="button button-assertive" ng-click="closeModal()">Close</button>' +
            '</ion-footer-bar>' +
            '</ion-modal-view>';
        $scope.modal = $ionicModal.fromTemplate(template, {
            scope: $scope,
            animation: 'slide-in-up'
        })

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    })
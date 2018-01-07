/**
 * Created by nauman on 11/24/16.
 */
/**
 * LoginController
 */
(function () {
  'use strict';

  angular
      .module('authentication')
      .controller('logInController', function ($scope, $http, Authentication) {
        $scope.user_name = "nauman@gmail.com";
        $scope.password = "";
        $scope.pledge_btn = true;
        $scope.search_btn = true;
        $scope.login_error = false;
        if (!Authentication.isAuthenticated()) {
          Authentication.getUserAccount().then(function (data) {
            if (!data.data.not_active == true) {
              Authentication.setAuthenticatedAccount({
                is_admin: data.data.is_admin,
                name: data.data.first_name + " " + data.data.last_name,
                email: data.data.email,
                avatar: data.data.avatar
              });
              $scope.pledge_btn = false;
              $scope.search_btn = false;
              $scope.login_error = false;
              $scope.isAdmin = Authentication.isAdminUser();
              $scope.isAuthenticated = Authentication.isAuthenticated();
              if (Authentication.isAuthenticated()) {
                var account = Authentication.getAuthenticatedAccount();
                $scope.full_name = $.parseJSON(account).name
              }
            }

          });
        }
        if (Authentication.isAuthenticated()) {
          $scope.pledge_btn = false;
          $scope.search_btn = false;
          $scope.login_error = false;
        }
        $scope.isAdmin = Authentication.isAdminUser();
        $scope.isAuthenticated = Authentication.isAuthenticated();
        $scope.login = function () {
          Authentication.socialLogin().then(function (response) {
            var res = response;
          })
        };
        $scope.submit = function (signinForm) {
          Authentication.login($scope.user_name, $scope.password).then(loginSuccessFn, loginErrorFn);
          /**
           * @name loginSuccessFn
           * @desc Set the authenticated account and redirect to index
           */
          function loginSuccessFn(data, status, headers, config) {
            Authentication.setAuthenticatedAccount({
              is_admin: data.data.is_admin,
              name: data.data.first_name + " " + data.data.last_name,
              email: data.data.email,
              avatar: data.data.avatar
            });
            if (Authentication.isAdminUser()) {
              $scope.isAdmin = true;
            }
            if (Authentication.isAuthenticated()) {
              $scope.isAuthenticated = true;
            }
            $scope.pledge_btn = false;
            $scope.search_btn = false;
            $scope.login_error = false;
            window.location = '';
          }

          /**
           * @name loginErrorFn
           * @desc Log "Epic failure!" to the console
           */
          function loginErrorFn(data, status, headers, config) {
            $scope.login_error = true;
          }

        };
      });
})();
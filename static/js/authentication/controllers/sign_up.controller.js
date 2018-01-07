/**
 * Created by nauman on 11/25/16.
 */
(function () {
  'use strict';

  angular
      .module('authentication')
      .controller('signUpControler', function ($scope, $stateParams, $http, Authentication) {
        $scope.is_support_user = false;
        if($stateParams.user_type == 'be_a_support'){
          $scope.is_support_user = true;
        }
        $scope.emailMatchError = false;
        $scope.emailError = false;
        $scope.pwdMatchError = false;
        $scope.user = {};
        $scope.checkPassword = function (keyEvent) {
          if (!($scope.user.password === $scope.user.password2)) {
            $scope.pwdMatchError = true;
          } else {
            $scope.pwdMatchError = false;
          }

        };
        $scope.checkEmail = function (keyEvent) {
          if ($scope.signupForm.email.$valid) {
            $scope.emailError = false;
            var formdata = {
              email: $scope.user.email,
              csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
            };
            $http.post('/check_email_exist/', formdata).then(function (response) {
              if (response.data == "True") {
                $scope.emailMatchError = true;
              } else {
                $scope.emailMatchError = false;
              }
            }, function (response) {
            });
          } else {
            $scope.emailError = true;
          }

        };
        $scope.submit = function () {
          if ($scope.pwdMatchError == false && $scope.emailMatchError == false &&
              $scope.user.first_name.trim() != "" && $scope.user.last_name.trim() != "" && $scope.user.email.trim() != "" &&
              $scope.user.password.trim() != "" ) {
            if (!$scope.user.moderation) {
              $scope.user.moderation = false;
            }
            if (!$scope.user.anonymity) {
              $scope.user.anonymity = false;
            }
            Authentication.register($scope.user);

          }
        }
      });
})();
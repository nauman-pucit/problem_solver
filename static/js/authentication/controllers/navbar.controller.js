/**
 * NavbarController
 * created by nauman
 */
(function () {
  'use strict';

  angular
      .module('authentication')
      .controller('NavbarController', NavbarController);
  

  NavbarController.$inject = ['$scope', '$state', 'Authentication'];

  /**
   * @namespace NavbarController
   */
  function NavbarController($scope, $state, Authentication) {
    var vm = this;

    vm.logout = logout;
    if (!Authentication.isAuthenticated()) {
      Authentication.getUserAccount().then(function (data) {
        if (!data.data.not_active == true) {
          Authentication.setAuthenticatedAccount({
            is_admin: data.data.is_admin,
            name: data.data.first_name + " " + data.data.last_name,
            email: data.data.email,
            avatar: data.data.avatar
          });
          $scope.isAdmin = Authentication.isAdminUser();
          $scope.isAuthenticated = Authentication.isAuthenticated();
          if (Authentication.isAuthenticated()) {
            var account = Authentication.getAuthenticatedAccount();
            $scope.full_name = $.parseJSON(account).name
          }
        }

      });
    }
    vm.sign_in_model = false;
    vm.show_sign_in_model = function () {
      vm.sign_in_model = true;
      $state.go('sign_in');
    };
    vm.close_sign_in_model = function () {
      vm.sign_in_model = false;
    };
    function logout() {
      $scope.isAuthenticated = false;
      Authentication.logout();
    }

    $scope.isAdmin = Authentication.isAdminUser();
    $scope.isAuthenticated = Authentication.isAuthenticated();
    $scope.full_name = "";
    if (Authentication.isAuthenticated()) {
      var account = Authentication.getAuthenticatedAccount();
      $scope.full_name = $.parseJSON(account).name

    }
    function isAdmin() {
      return Authentication.isAdminUser();
    }
  }

})();
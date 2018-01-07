/**
 * created by nauman
 *
 * UserProfileController
 */
(function () {
  'use strict';

  angular
      .module('authentication')
      .controller('UsersListController', UsersListController);

  UsersListController.$inject = ['$scope', '$state', 'Authentication', 'Notification'];

  /**
   * @namespace UserProfileController
   */
  function UsersListController($scope, $state, Authentication,Notification) {

    var vm = this;
    vm.user = {};
    vm.users_collection = [];
    vm.user_detail_modal = false;
    vm.status = "";
    vm.is_admin=false;
    if (Authentication.isAdminUser()) {
      Authentication.allUsers().then(function (response) {
        vm.users_collection = response.data;
      });
    }
    vm.user_detail = function (user) {
      vm.status = "";
      vm.user = user;
      vm.user_detail_modal = true;
    };
    vm.close_model = function () {
      vm.user_detail_modal = false;
    };
    vm.change_role = function (user, status) {
      if (user.is_admin != status) {
        vm.is_admin = user.is_admin;
        Authentication.changeRole(user).then(function () {
              user.is_admin = status;
              if (status) {
                Notification("Admin Permissions Granted");
                vm.status = "admin permissions granted"
              } else {
                Notification("Permissions Changed");
              }
            },
            function () {
              vm.status = "";
            })
      }

    }
  }
})();
/**
 * created by nauman
 * UserProfileController
 */
(function () {
  'use strict';

  angular
      .module('authentication')
      .controller('UserProfileEditController', UserProfileEditController);

  UserProfileEditController.$inject = ['$scope', '$state', 'Authentication', 'SocialImpactNetwork', 'Notification',
    '$log'];
  /**
   * @namespace UserProfileController
   */
  function UserProfileEditController($scope, $state, Authentication, SocialImpactNetwork, Notification,
                                     $log) {

    var vm = this;
    var tabs = [
          {title: 'Projects', content: $scope.all_projects},
          {title: 'Networks', content: $scope.all_networks}
        ],
        selected = null,
        previous = null;
    $scope.tabs = tabs;
    $scope.selectedIndex = 0;


    $scope.full_name = "";
    $scope.is_social_account = false;
    $scope.avatar = {};
    $scope.profile_update_success_message = false;
    $scope.profile_update_failure_message = false;
    $scope.profile_update_password_failure = false;
    $scope.currnet_password_field = false;
    $scope.new_password_field = false;
    $scope.confirm_password_field = false;
    $scope.pwdMatchError = false;
    $scope.user = {};
    $scope.all_projects = [];
    $scope.all_networks = [];
    $scope.all_skills = [];
    SocialImpactNetwork.allUserSkills().then(function (skills) {
      $scope.all_skills = skills.data;
    });
    SocialImpactNetwork.getProjects().then(function (projects) {
      $scope.all_projects = projects.data;
    });
    SocialImpactNetwork.getNetworks().then(function (networks) {
      $scope.all_networks = networks.data;
    });

    if (Authentication.isAuthenticated()) {
      var account = Authentication.getAuthenticatedAccount();
      $scope.full_name = $.parseJSON(account).name
    }

    Authentication.isSocialAccount().then(function (response) {
      $scope.is_social_account = response.data.is_social_account;
    });
    $scope.validate_form = function (userProfileForm) {
      if (!userProfileForm.first_name.$valid || !userProfileForm.last_name.$valid
          || !userProfileForm.phone.$valid || !userProfileForm.orgnaization.$valid
          || !userProfileForm.designamtion.$valid || !userProfileForm.address1.$valid
          || !userProfileForm.country.$valid || !userProfileForm.state.$valid
          || !userProfileForm.city.$valid || !userProfileForm.zip.$valid
          || !userProfileForm.geographical_area.$valid) {
        return false;
      }
      return true;

    };
    $scope.submit = function (userProfileForm) {
      var formdata = new FormData();
      for (var key in $scope.user) {
        formdata.append(key, $scope.user[key]);
      }
      formdata.append('image', $scope.avatar);
      if (!$scope.user.current_password) {
        formdata.append('current_password', '');
        if ($scope.validate_form(userProfileForm)) {
          $scope.user.current_password = null;
          Authentication.updateUserProfile(formdata).then(function (account) {
            $scope.user = account.data;
            Authentication.setAuthenticatedAccount({
              is_admin: account.data.is_admin,
              name: account.data.first_name + " " + account.data.last_name,
              email: account.data.email
            });
            $scope.full_name = account.data.first_name + " " + account.data.last_name;
            Notification("Profile Updated");
          }, function (response) {
            Notification("Something Went Wrong");
          });
        } else {
          Notification("Please Fill Form Properly");
        }

      } else {
        if ($scope.user.new_password && $scope.user.password2) {
          if ($scope.user.new_password.trim() != "" && $scope.user.password2.trim() != "" &&
              $scope.validate_form(userProfileForm)) {
            formdata.append('new_password', $scope.user.new_password);
            formdata.append('password2', $scope.user.password2);
            Authentication.updateUserProfile(formdata).then(function (account) {
              $scope.user = account.data;
              Authentication.setAuthenticatedAccount({
                is_admin: account.data.is_admin,
                name: account.data.first_name + " " + account.data.last_name,
                email: account.data.email,
                avatar: account.data.avatar
              });
              $scope.change_password();
              $scope.full_name = account.data.first_name + " " + account.data.last_name;
              Notification("Profile Updated");
            }, function (response) {
              Notification("Wrong Password");
            });
          } else if (!$scope.validate_form(userProfileForm)) {
            Notification("Please Fill Form Properly");
          }
        }

      }


    };
    $scope.change_password = function () {
      debugger;
      $scope.pwdMatchError = false;
      $scope.currnet_password_field = !$scope.currnet_password_field;
      $scope.new_password_field = !$scope.new_password_field;
      $scope.confirm_password_field = !$scope.confirm_password_field;

      if ($scope.user.current_password) {
        $scope.user.current_password = null;
      }
      if ($scope.user.new_password) {
        $scope.user.new_password = null;
      }
      if ($scope.user.password2) {
        $scope.user.password2 = null;
      }

    };
    $scope.checkPassword = function () {
      if (!($scope.user.new_password === $scope.user.password2)) {
        $scope.pwdMatchError = true;
      } else {
        $scope.pwdMatchError = false;
      }
    };
    Authentication.getUserAccount().then(function (account) {
      $scope.user = account.data;
    });

  }
})();
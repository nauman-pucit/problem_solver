/**
 * Created by nauman on 12/9/16.
 */

(function () {
  'use strict';

  angular
      .module('authentication')
      .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  /**
   * @namespace Authentication
   * @returns {Factory}
   */
  function Authentication($cookies, $http) {

    var Authentication = {
      socialLogin: socialLogin,
      login: login,
      register: register,
      logout: logout,
      allUsers: allUsers,
      changeRole: changeRole,
      getUserAccount: getUserAccount,
      updateUserProfile: updateUserProfile,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      isAdminUser: isAdminUser,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      isSocialAccount: isSocialAccount

    };

    return Authentication;

    function login(email, password) {
      var formdata = {
        user_name: email,
        password: password,
        csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
      };
      return $http.post('/sign_in_authenticate/', formdata);
    }

    function socialLogin() {
      return $http.get('/accounts/google/login/?process=login', {
            headers: {Origin: 'http://localhost:8000'}
        });
    }
    function getUserAccount() {
      return $http.post('/user_account/');
    }

    function allUsers() {
      return $http.get('/all_user_accounts/')
    }

    function changeRole(user) {
      return $http.post('/change_role/', user);
    }

    function updateUserProfile(data) {
      return $http.post('/update_user_account/', data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }

    function register(form_data) {

      return $http.post('/sign_up/', form_data).then(registerSuccessFn, registerErrorFn);

      /**
       * @name registerSuccessFn
       * @desc Log the new user in
       */
      function registerSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount({
          is_admin: data.data.is_admin,
          name: data.data.first_name + " " + data.data.last_name,
          email:data.data.email,
          avatar: data.data.avatar
        });
        window.location.replace("/social_network/");
      }

      /**
       * @name registerErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function registerErrorFn(data, status, headers, config) {
        alert('Epic failure!');
      }
    }

    function logout() {
      return $http.post('/log_out/')
          .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        alert('Epic failure!');
      }
    }

    function getAuthenticatedAccount() {
      if (!$cookies.get("user_data")) {
        return;
      }

      return $cookies.get("user_data");
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     *
     */
    function isAuthenticated() {
      // return !!$cookies.authenticatedAccount;
      return $cookies.get("user_data")
    }

    function  isAdminUser() {
      if ($cookies.get("user_data")) {
        return $.parseJSON($cookies.get("user_data")).is_admin;
      } else {
        return false;
      }
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     *
     */
    function setAuthenticatedAccount(name) {
      $cookies.put("user_data", JSON.stringify(name));
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     *
     */
    function unauthenticate() {
      // delete $cookies.authenticatedAccount;
      $cookies.remove("user_data")
    }
    function isSocialAccount(formData) {
      return $http.post('/social_network/is_social_account/');
    }
  }
})();
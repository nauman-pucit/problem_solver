/**
 * Created by waqas on 11/27/16.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', '$scope', 'SocialImpact', 'Authentication'];

  function HomeController($state, $scope, SocialImpact, Authentication) {

    var vm = this;
    vm.homes = [1, 2, 3];


  }

})();
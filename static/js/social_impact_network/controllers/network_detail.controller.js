/**
 * Created by waqas on 11/27/16.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('NetworkDetailController', NetworkDetailController);

  NetworkDetailController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpact', 'Authentication'];

  function NetworkDetailController($state, $scope, $stateParams, SocialImpact, Authentication) {
    var vm = this;
    if(Authentication.isAuthenticated()){
      vm.authenticated_account = $.parseJSON(Authentication.getAuthenticatedAccount());
    }
    vm.messages = [];
    vm.username = 'username1';
    vm.networkId = {};
    vm.visible = true;
    vm.expandOnNew = true;

    vm.networkName = "";
    vm.networkDescription = "";
    vm.answers = [];
    vm.networkId = null;
    vm.mailSent = false;
    vm.countries = [];
    vm.cities = [];
    vm.contact = {};
    if ($stateParams.networkId) {
      SocialImpact.networkDetail($stateParams.networkId)
          .then(function (network) {
            SocialImpact.getCountries(network.data.geographical_countries).then(function (response) {
              vm.countries = response.data;
            });
            SocialImpact.getCities(network.data.geographical_cities).then(function (response) {
              vm.cities = response.data;
            });
            SocialImpact.getContact({networkId: network.data.id, projectId:null}).then(function (response) {
              vm.contact = response.data;
              SocialImpact.getAffiliations(vm.contact.id).then(function (response) {
                vm.organizations = response.data;
              });
            });
            var answers = [];
            vm.networkName = network.data.network_name;
            vm.networkDescription = network.data.network_description;
            vm.networkId = network.data.id;
            vm.first_name = network.data.resource.resource_user.first_name;
            vm.last_name = network.data.resource.resource_user.last_name;
            vm.anonymity = network.data.resource.resource_user.anonymity;
            vm.designation = network.data.resource.resource_user.designation;
            vm.phone = network.data.resource.resource_user.phone;
            vm.email = network.data.resource.resource_user.email;
            vm.city = network.data.resource.resource_user.city;
            vm.state = network.data.resource.resource_user.state;
            vm.country = network.data.resource.resource_user.country;
            vm.areaOfWork = network.data.area_of_work;
            vm.countryRegion = network.data.country_or_region;
          })
    }

  }

})();

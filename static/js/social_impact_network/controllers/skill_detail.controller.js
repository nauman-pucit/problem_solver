/**
 * Created by nauman on 3/13/17.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('SkillDetailController', SkillDetailController);

  SkillDetailController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpact', 'Authentication'];

  function SkillDetailController($state, $scope, $stateParams, SocialImpact, Authentication) {
    var vm = this;
    if(Authentication.isAuthenticated()){
      vm.authenticated_account = $.parseJSON(Authentication.getAuthenticatedAccount());
    }
    vm.messages = [];
    vm.username = 'username1';
    vm.skillId = {};
    vm.visible = true;
    vm.expandOnNew = true;

    vm.skill_name = "";
    vm.skill_description = "";
    vm.skill_level = "";
    vm.answers = [];
    vm.skillId = null;
    vm.mailSent = false;
    vm.countries = [];
    vm.cities = [];
    vm.contact = {};
    if ($stateParams.skillId) {
      SocialImpact.skillDetail($stateParams.skillId)
          .then(function (skill) {
            SocialImpact.getCountries(skill.data.skill.geographical_countries).then(function (response) {
              vm.countries = response.data;
            });
            SocialImpact.getCities(skill.data.skill.geographical_cities).then(function (response) {
              vm.cities = response.data;
            });
            SocialImpact.getContact({skillId: skill.data.skill.id, projectId:null, networkId:null}).then(function (response) {
              vm.contact = response.data;
              SocialImpact.getAffiliations(vm.contact.id).then(function (response) {
                vm.organizations = response.data;
              });
            });
            var answers = [];
            vm.skill_name = skill.data.skill.skill_name;
            vm.skill_description = skill.data.skill.skill_description;
            vm.skill_level = skill.data.skill.skill_level;
            vm.skillId = skill.data.skill.id;
            vm.first_name = skill.data.user.first_name;
            vm.last_name = skill.data.user.last_name;
            vm.anonymity = skill.data.user.anonymity;
            vm.designation = skill.data.user.designation;
            vm.phone = skill.data.user.phone;
            vm.email = skill.data.user.email;
            vm.city = skill.data.user.city;
            vm.state = skill.data.user.state;
            vm.country = skill.data.user.country;
            vm.areaOfWork = skill.data.user.area_of_work;
            vm.countryRegion = skill.data.user.country_or_region;
          });
    }
  }
})();

/**
 * Created by waqas on 11/27/16.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('ProjectDetailController', ProjectDetailController);

  ProjectDetailController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpact', 'Authentication',
    'SocialImpactNetwork', 'Notification'];

  function ProjectDetailController($state, $scope, $stateParams, SocialImpact, Authentication, SocialImpactNetwork,
  Notification) {
    var vm = this;
    if (Authentication.isAuthenticated()) {
      vm.authenticated_account = $.parseJSON(Authentication.getAuthenticatedAccount());
    }

    var x = $(window).width();
          var platform = navigator.platform;
    vm.is_mobile_device = false;
    if (x < 1000) {
      vm.is_mobile_device = true;
    } else {
      vm.is_mobile_device = false;
    }
    vm.messages = [];
    vm.username = 'username1';
    vm.projectId = {};
    vm.sendMessage = function (message, username) {
      if (message && message !== '' && username) {
        var data = {
          loungeAreaId: null,
          projectId: vm.projectId,
          message: message
        };
        SocialImpact.sendMessage(data).then(function (message) {
          vm.messages.push({
            'username': message.data.sent_by.first_name + " " + message.data.sent_by.last_name,
            'content': message.data.message
          });
        });
      }
    };
    vm.visible = true;
    vm.expandOnNew = true;

    vm.projectName = "";
    vm.projectDescription = "";
    vm.answers = [];
    vm.projectId = null;
    vm.mailSent = false;
    vm.countries = [];
    vm.cities = [];
    vm.contact = {};
    vm.answers = [];
    if ($stateParams.projectId) {
      SocialImpact.projectDetail($stateParams.projectId)
          .then(function (project) {
            SocialImpact.getChat({projectId: project.data.id, loungeAreaId:null}).then(function (chat) {
              chat.data.forEach(function (message) {
                vm.messages.push({
                  'username': message.sent_by.first_name + " " + message.sent_by.last_name,
                  'content': message.message
                });
              })

            });
            SocialImpact.getCountries(project.data.geographical_countries).then(function (response) {
              vm.countries = response.data;
            });
            SocialImpact.getCities(project.data.geographical_cities).then(function (response) {
              vm.cities = response.data;
            });
            SocialImpact.getContact({networkId: null, projectId: project.data.id}).then(function (response) {
              vm.contact = response.data;
              SocialImpact.getAffiliations(vm.contact.id).then(function (response) {
                vm.organizations = response.data;
              });
            });
            var answers = [];
            vm.projectName = project.data.project_name;
            vm.projectDescription = project.data.project_description;
            vm.projectDescription = project.data.project_description;
            vm.projectId = project.data.id;
            vm.first_name = project.data.resource.resource_user.first_name;
            vm.last_name = project.data.resource.resource_user.last_name;
            vm.anonymity = project.data.resource.resource_user.anonymity;
            vm.designation = project.data.resource.resource_user.designation;
            vm.phone = project.data.resource.resource_user.phone;
            vm.email = project.data.resource.resource_user.email;
            vm.city = project.data.resource.resource_user.city;
            vm.state = project.data.resource.resource_user.state;
            vm.country = project.data.resource.resource_user.country;
            vm.areaOfWork = project.data.area_of_work;
            vm.countryRegion = project.data.country_or_region;
            // vm.questions = project.data.questions;
            project.data.questions.forEach(function (question) {
              answers.push(question[1])
            });
            vm.questions = answers;
            vm.questionObjects = project.data.questions;
            vm.projectId = project.data.id;
            SocialImpactNetwork.contactRequestDetail(project.data.id,
                '').then(function (answers) {
              vm.answers = answers.data;
            });
          })
    }

    vm.submit = function () {
      var formData = {};
      vm.questionObjects.map(function (question, index) {
        formData[question[0]] = vm.answers[index] || ''
      });
      formData['projectId'] = vm.projectId;
      SocialImpact.submitAnswers(formData)
          .then(function (response) {
            Notification(response.data.message)
          })
    }


  }

})();

/**
 * Created by nauman on 11/25/16.
 */
(function () {
  'use strict';
  angular
      .module('problem_solver_central', [
        'authentication',
        'social_impact_network',
        'ui.router',
        'ngCookies',
        'ui.bootstrap.modal',
        'angular-loading-bar',
        'ngAnimate',
        'ui-notification',
        'validation',
        'validation.rule',
        'angularjs-dropdown-multiselect',
        'irontec.simpleChat',
        'ngMaterial'
      ])
      .config(config)
      .run(run);

  run.$inject = ['$http'];
  /**
   * @name run
   * @desc Update xsrf $http headers to align with Django's defaults
   */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/static/templates/social_impact_home.html',
          controller: 'HomeController'
        })
        .state('sign_up', {
          url: '/sign_up/:user_type',
          templateUrl: '/static/templates/authentication/sign_up.html',
          controller: 'signUpControler'
        })
        .state('sign_in', {
          url: '/sign_in',
          templateUrl: '/static/templates/authentication/sign_in.html',
          controller: 'logInController'
        })
        .state('user_list', {
          url: '/user_list',
          templateUrl: '/static/templates/authentication/users_list.html',
          controller: 'UsersListController'
        })
        .state('edit_user_profile', {
          url: '/edit_user_profile',
          templateUrl: '/static/templates/authentication/user_profile_edit.html',
          controller: 'UserProfileEditController'
        })
        .state('user_profile', {
          url: '/user_profile',
          templateUrl: '/static/templates/authentication/user_profile.html',
          controller: 'UserProfileEditController'
        })
        .state('all_user_pledges', {
          url: '/all_user_pledges',
          templateUrl: '/static/templates/pledge_resources.html',
          controller: 'my_pledges_controller'
        })
        .state('all_user_networks', {
          url: '/all_user_networks',
          templateUrl: '/static/templates/pledge_networks.html',
          controller: 'pledge_network_controller'
        })
        .state('all_user_contacts', {
          url: '/all_user_contacts',
          templateUrl: '/static/templates/pledge_contacts.html',
          controller: 'pledge_contact_controller'
        })
        .state('all_user_projects.affiliation', {
          url: '/affiliations/:contactId',
          templateUrl: '/static/templates/pledge_affiliation.html',
          controller: 'AffiliationController'
        })
        .state('all_user_projects.field_of_work', {
          url: '/field_of_work/:networkId',
          templateUrl: '/static/templates/pledge_field_of_work.html',
          controller: 'FieldOfWorkController'
        })
        .state('search', {
          url: '/search',
          templateUrl: '/static/templates/social_impact_search.html',
          controller: 'SearchController'
        })
        .state('add_resources', {
          url: '/add_resources',
          templateUrl: '/static/templates/add_resources.html',
          controller: 'AddResourceController'
        })
        .state('add_skills', {
          url: '/add_skills',
          templateUrl: '/static/templates/add_skills.html',
          controller: 'AddSkillController'
        })
        .state('create_solutions_hub', {
          url: '/create_solutions_hub',
          templateUrl: '/static/templates/add_lounge_area.html',
          controller: 'AddSkillController'
        })
        .state('skills', {
          url: '/skills',
          templateUrl: '/static/templates/skills.html',
          controller: 'AddSkillController'
        })
        .state('projectDetail', {
          url: '/project/:projectId',
          templateUrl: '/static/templates/social_impact_project_details.html',
          controller: 'ProjectDetailController'
        })
        .state('networkDetail', {
          url: '/network/:networkId',
          templateUrl: '/static/templates/social_impact_network_details.html',
          controller: 'NetworkDetailController'
        })
        .state('loungeArea', {
          url: '/solutions_hub/:loungeAreaId',
          templateUrl: '/static/templates/lounge_area.html',
          controller: 'LoungeAreaController'
        })
        .state('skillDetail', {
          url: '/skill/:skillId',
          templateUrl: '/static/templates/social_impact_skill_details.html',
          controller: 'SkillDetailController'
        })
        .state('view_contact_requests', {
          url: '/contact_requests',
          templateUrl: '/static/templates/admin_contact_requests.html',
          controller: 'ModerateController'
        })
        .state('moderate_contact_requests', {
          url: '/moderate',
          templateUrl: '/static/templates/admin_contact_requests.html',
          controller: 'ModerateController'
        })
        .state('moderate_contact_requests.detail', {
          // url: '/moderate/:projectId/:userId',
          params: {projectId: {}, userId: {}},
          templateUrl: '/static/templates/admin_contact_request_detail.html',
          controller: 'ModerateController'
        });
    $urlRouterProvider.otherwise("/");

  }
})();
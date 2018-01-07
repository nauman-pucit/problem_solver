/**
 * Created by nauman on 11/27/16.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .factory('SocialImpactNetwork', SocialImpactNetwork);

  SocialImpactNetwork.$inject = ['$cookies', '$http'];

  /**
   * @namespace SocialImpactNetwork
   */
  function SocialImpactNetwork($cookies, $http) {

    var SocialImpactNetwork = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      pledgeProject: pledgeProject,
      updateProject: updateProject,
      deleteProject: deleteProject,
      pledgeNetwork: pledgeNetwork,
      updateNetwork: updateNetwork,
      deleteNetwork: deleteNetwork,
      deleteSkill: deleteSkill,
      pledgeSkill: pledgeSkill,
      updateSkill: updateSkill,
      getAllCountries: getAllCountries,
      getCities: getCities,
      allResourceTypes: allResourceTypes,
      allCategories: allCategories,
      allUserCategories: allUserCategories,
      userCategoryProjects: userCategoryProjects,
      projectDetail: projectDetail,
      userCategoryNetworks: userCategoryNetworks,
      getProjects: getProjects,
      getNetworks: getNetworks,
      allUserProjects: allUserProjects,
      allUserNetworks: allUserNetworks,
      allUserSkills: allUserSkills,
      allUserContacts: allUserContacts,
      getAffiliations: getAffiliations,
      isAdminUser: isAdminUser,
      contactResponses: contactResponses,
      loungeAreaRequests: loungeAreaRequests,
      loungeAreaRequest: loungeAreaRequest,
      updateLoungeAreaRequest: updateLoungeAreaRequest,
      addLoungeAreaMember: addLoungeAreaMember,
      contactRequestDetail: contactRequestDetail

    };

    return SocialImpactNetwork;

    function isAdminUser() {
      if ($cookies.get("user_data")) {
        return $.parseJSON($cookies.get("user_data")).is_admin;
      } else {
        return false;
      }
    }

    function contactResponses() {
      return $http.get('/social_network/answers/');
    }

    function loungeAreaRequests(data) {
      return $http.post('/social_network/lounge_area_requests/', data);
    }
    function loungeAreaRequest(data) {
      return $http.post('/social_network/lounge_area_request/', data);
    }

    function updateLoungeAreaRequest(data) {
      return $http.post('/social_network/update_lounge_area_requests/', data);
    }

    function addLoungeAreaMember(data) {
      return $http.post('/social_network/create_lounge_area_member/', data);
    }

    function contactRequestDetail(projectId, userId) {
      return $http.get('/social_network/answers/' + projectId + '?userId=' + userId);
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


    function pledgeProject(form_data) {
      return $http.post('/social_network/pledge_project/', form_data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }

    function updateProject(form_data) {
      return $http.post('/social_network/update_project/', form_data);
    }

    function deleteProject(form_data) {
      return $http.post('/social_network/delete_project/', form_data);
    }

    function pledgeNetwork(form_data) {
      return $http.post('/social_network/pledge_network/', form_data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }
      );
    }

    function updateNetwork(form_data) {
      return $http.post('/social_network/update_network/', form_data);
    }

    function updateSkill(form_data) {
      return $http.post('/social_network/update_skill/', form_data);
    }

    function deleteNetwork(form_data) {
      return $http.post('/social_network/delete_network/', form_data);
    }
    function deleteSkill(form_data) {
      return $http.post('/social_network/delete_skill/', form_data);
    }
    function pledgeSkill(form_data) {
      return $http.post('/social_network/pledge_skill/', form_data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }
    function allUserCategories() {
      return $http.get('/social_network/all_user_categories/');
    }

    function getAllCountries() {
      return $http.get('/social_network/get_all_countries/');
    }

    function getCities(country) {
      return $http.get('/social_network/get_all_cities/', {
        params: {country_id: country.id}
      });
    }

    function allResourceTypes() {
      return $http.get('/social_network/all_resource_types/')
    }

    function allCategories() {
      return $http.get('/social_network/all_categories/')
    }

    function userCategoryProjects(category) {
      return $http.get('/social_network/all_user_projects/', {
        params: {category: category}
      })
    }

    function userCategoryNetworks(category) {
      return $http.get('/social_network/all_user_networks/', {
        params: {category: category}
      })
    }

    function projectDetail(projectId) {
      return $http.get('/social_network/projects/' + projectId)
    }

    function allUserProjects() {
      return $http.get('/social_network/all_user_projects/')
    }

    function allUserNetworks() {
      return $http.get('/social_network/all_user_networks/')
    }
    function allUserSkills() {
      return $http.get('/social_network/all_user_skills/')
    }

    function allUserContacts() {
      return $http.get('/social_network/all_user_contacts/')
    }

    function getAffiliations(contactId) {
      return $http.get('/social_network/affiliations/' + contactId)
    }

    function getProjects() {
      return $http.post('/social_network/get_user_projects/');
    }

    function getNetworks() {
      return $http.post('/social_network/get_user_networks/');
    }

    ////////////////////


  }
})();
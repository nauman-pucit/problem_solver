/**
 * Created by waqas on 11/27/16.
 */

(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .factory('SocialImpact', SocialImpact);

  SocialImpact.$inject = ['$http'];

  function SocialImpact($http) {
    /**
     * @name SocialImpact
     * @desc The Factory to be returned
     */
    var SocialImpact = {
      search: search,
      all_resources_search: all_resources_search,
      getChat: getChat,
      getLoungeArea: getLoungeArea,
      createLoungeArea: createLoungeArea,
      getQuestions: getQuestions,
      getCountries: getCountries,
      getCities: getCities,
      getContact: getContact,
      getAffiliations: getAffiliations,
      sendMessage: sendMessage,
      projectDetail: projectDetail,
      networkDetail: networkDetail,
      skillDetail: skillDetail,
      submitAnswers: submitAnswers,
      all_categories: all_categories
    };

    return SocialImpact;

    function all_categories() {
      return $http.get('/social_network/all_categories/');
    }

    function search(searchText, category, country_model, city_model) {
      return $http.post('/social_network/search/', {
        searchText: searchText, category: category, city_model: city_model,
        country_model: country_model
      });
    }
    function all_resources_search() {
      return $http.get('/social_network/search/');
    }
    function getChat(data) {
      return $http.post('/social_network/get_chat/', data);
    }
    function createLoungeArea(data) {
      return $http.post('/social_network/create_lounge_area/', data);
    }
    function getLoungeArea(id) {
      return $http.post('/social_network/get_lounge_area/', id);
    }
    function getQuestions() {
      return $http.post('/social_network/get_questions/');
    }
    function getCountries(countries) {
      return $http.post('/social_network/get_countries/', countries);
    }
    function getCities(cities) {
      return $http.post('/social_network/get_cities/', cities);
    }
    function getContact(data) {
      return $http.post('/social_network/get_contact/', data);
    }
    function getAffiliations(contactId) {
      return $http.get('/social_network/affiliations/' + contactId)
    }
    function sendMessage(message) {
      return $http.post('/social_network/add_message/', message);
    }
    function projectDetail(projectId) {
      return $http.get('/social_network/projects/' + projectId);
    }
    function networkDetail(networkId) {
      return $http.get('/social_network/networks/' + networkId);
    }
    function skillDetail(skillId) {
      return $http.get('/social_network/skills/' + skillId);
    }

    function submitAnswers(formData) {
      return $http.post('/social_network/submit_contact_form/', formData);
    }
  }


})();
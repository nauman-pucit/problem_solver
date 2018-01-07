/**
 * Created by nauman on 11/29/16.
 */

(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('AffiliationController', AffiliationController);

  AffiliationController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpactNetwork'];

  function AffiliationController($state, $scope, $stateParams, SocialImpactNetwork) {
    var vm = this;
    vm.organizations = [];

    if ($stateParams.contactId) {
      SocialImpactNetwork.get_affiliations($stateParams.contactId)
          .then(function (affiliations) {
            vm.organizations = affiliations.data;

          })
    }


  }

})();

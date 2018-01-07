/**
 * Created by nauman on 11/29/16.
 */

(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('FieldOfWorkController', FieldOfWorkController);

  FieldOfWorkController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpactNetwork'];

  function FieldOfWorkController($state, $scope, $stateParams, SocialImpactNetwork) {
    var vm = this;
    vm.fields_of_work_collection = [];
    if ($stateParams.networkId) {
      SocialImpactNetwork.get_fields_of_work($stateParams.networkId)
          .then(function (fields_of_work) {
            vm.fields_of_work_collection = fields_of_work.data;

          })
    }

  }

})();

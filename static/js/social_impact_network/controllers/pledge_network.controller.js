/**
 * Created by nauman on 11/29/16.
 */
(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('pledge_network_controller', function ($state, $scope, $stateParams, $http, SocialImpactNetwork) {
        var vm = this;
        vm.all_user_networks = [];
        vm.switch_tab = function (tab_type) {
          if (tab_type == "project") {
            $state.go('all_user_projects')
          } else if (tab_type == "network") {
          } else {
            $state.go('all_user_contacts')
          }
        }
        vm.showModal = false;
        vm.fields_of_work = function (network) {
          vm.showModal = true;
          $state.go('all_user_networks.field_of_work', {networkId: network.id})
        };
        vm.close = function () {
          vm.showModal = false;
        };
        SocialImpactNetwork.all_user_networks().then(function (all_user_network) {
          vm.all_user_networks = all_user_network.data;
        });


        $scope.network_add_success = "";
        $scope.network_name = "";
        $scope.network_description = "";
        $scope.fields = [{id: 'field1'}];
        $scope.networks = [];
        $scope.addNetwork = function (network) {
          vm.all_user_networks.unshift(network);
        }
        $scope.addNewField = function () {
          var newItemNo = $scope.fields.length + 1;
          $scope.fields.push({'id': 'field' + newItemNo});
        };
        $scope.removeField = function () {
          var lastItem = $scope.fields.length - 1;
          $scope.fields.splice(lastItem);
        };
        $scope.add_network = function () {
          var fields_of_work = $scope.fields.map(function (a) {
            return a.name;
          });
          var formdata = {
            network_name: $scope.network_name,
            network_description: $scope.network_description,
            fields_of_work: fields_of_work,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          }
          if (formdata.network_name.trim() != "" && formdata.network_description.trim() != "") {
            // SocialImpactNetwork.pledge_network(formdata)
            $http.post('/social_network/pledge_network/', formdata).then(function (response) {
              $scope.addNetwork(response.data);
              $scope.network_add_success = "Added Successfully";
              $scope.network_name = null;
              $scope.network_description = null;
              $scope.fields = [{id: 'field1'}];

            }, function (response) {
              $scope.contact_add_success = "";
            });

          }

        };

      });
})();
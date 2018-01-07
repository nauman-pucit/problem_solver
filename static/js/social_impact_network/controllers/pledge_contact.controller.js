/**
 * Created by nauman on 11/29/16.
 */

(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('pledge_contact_controller', function ($state, $scope, $stateParams, $http, SocialImpactNetwork) {
        var vm = this;

        vm.all_user_contacts = [];
        vm.switch_tab = function (tab_type) {
          if (tab_type == "project") {
            $state.go('all_user_projects')
          } else if (tab_type == "network") {
            $state.go('all_user_networks')
          } else {
          }
        }
        vm.showModal = false;
        vm.affiliations = function (contact) {
          vm.showModal = true;
          $state.go('all_user_contacts.affiliation', {contactId: contact.id})
        };
        vm.close = function () {
          vm.showModal = false;
        };
        SocialImpactNetwork.allUserContacts().then(function (all_user_contact) {
          vm.all_user_contacts = all_user_contact.data;
        });
        $scope.contact_add_success = "";
        $scope.contact_name = "";
        $scope.contact_description = "";
        $scope.contacts = [];
        $scope.orgnaizations = [{id: 'orgnaization1'}];
        $scope.addContact = function (contact) {
          vm.all_user_contacts.unshift(contact);
        }
        $scope.addNewOrgnaization = function () {
          var newItemNo = $scope.orgnaizations.length + 1;
          $scope.orgnaizations.push({'id': 'orgnaization' + newItemNo});
        };
        $scope.removeOrgnaization = function () {
          var lastItem = $scope.orgnaizations.length - 1;
          $scope.orgnaizations.splice(lastItem);
        };
        $scope.add_contact = function () {
          // debugger;
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            contact_name: $scope.contact_name,
            contact_description: $scope.contact_description,
            orgnaizations: organizations,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          }
          if (formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "") {
            // SocialImpactNetwork.pledge_contact(formdata)
            $http.post('/social_network/pledge_contact/', formdata).then(function (response) {
              $scope.addContact(response.data);
              $scope.contact_add_success = "Added Successfully";
              $scope.contact_name = null;
              $scope.contact_description = null;
              $scope.orgnaizations = [{id: 'orgnaization1'}];

            }, function (response) {
              $scope.contact_add_success = "";
            });
          }

        };

      });
})();
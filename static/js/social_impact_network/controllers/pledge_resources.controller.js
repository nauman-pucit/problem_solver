/**
 * Created by nauman on 11/25/16.
 */
(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('pledge_resources_controller', function ($state, $scope, $stateParams, $http, SocialImpactNetwork) {
        var vm = this;
        vm.all_user_projects = [];
        vm.all_user_networks = [];
        vm.all_user_contacts = [];
        vm.switch_tab = function (tab_type) {
          if (tab_type == "project") {
            SocialImpactNetwork.allUserProjects().then(function (all_user_project) {
              vm.all_user_projects = all_user_project.data;
            });
          } else if (tab_type == "network") {
            SocialImpactNetwork.allUserNetworks().then(function (all_user_network) {
              vm.all_user_networks = all_user_network.data;
            });
          } else {
            SocialImpactNetwork.allUserContacts().then(function (all_user_contact) {
              vm.all_user_contacts = all_user_contact.data;
            });
          }
        };
        SocialImpactNetwork.allUserProjects().then(function (all_user_project) {
          vm.all_user_projects = all_user_project.data;
        });

        $scope.project_name = "";
        $scope.project_description = "";
        $scope.project_add_success = "";
        $scope.network_add_success = "";
        $scope.contact_add_success = "";
        $scope.contact_name = "";
        $scope.contact_description = "";
        $scope.area_of_work = "";
        $scope.country_or_region = "";
        $scope.network_name = "";
        $scope.network_description = "";
        $scope.fields = [{id: 'field1'}];
        $scope.projects = [];
        $scope.contacts = [];
        $scope.networks = [];
        $scope.orgnaizations = [{id: 'orgnaization1'}];
        $scope.addProject = function (project) {
          vm.all_user_projects.unshift(project);
        };
        $scope.addNetwork = function (network) {
          vm.all_user_networks.unshift(network);
        };
        $scope.addContact = function (contact) {
          vm.all_user_contacts.unshift(contact);
        };
        $scope.addNewOrgnaization = function () {
          var newItemNo = $scope.orgnaizations.length + 1;
          $scope.orgnaizations.push({'id': 'orgnaization' + newItemNo});
        };
        $scope.removeOrgnaization = function (orgnaization) {
          var lastItem = $scope.orgnaizations.length - 1;
          $scope.orgnaizations.splice(lastItem);
        };

        $scope.addNewField = function () {
          var newItemNo = $scope.fields.length + 1;
          $scope.fields.push({'id': 'field' + newItemNo});
        };
        $scope.removeField = function () {
          var lastItem = $scope.fields.length - 1;
          $scope.fields.splice(lastItem);
        };
        $scope.submitForm = function () {
          var formdata = {
            field_name: $('#id_field_name').val(),
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.field_name.trim() != "") {

            $.ajax({
              url: '/social_network/pledge_resources/',
              data: formdata,
              type: "POST"
            }).done(function (data) {
              $('#id_field_name').val("");
              if ($('#success_btn_field_of_work').hasClass('hide')) {
                $('#success_btn_field_of_work').removeClass('hide');
                $('#success_btn_field_of_work').addClass('show');
              }

            }).fail(function () {
              if ($('#success_btn_field_of_work').hasClass('show')) {
                $('#success_btn_field_of_work').removeClass('show');
                $('#success_btn_field_of_work').addClass('hide');
              }
            })
          }

        };
        $scope.submit = function () {
          var formdata = {
            organization: $('#id_organization').val(),
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.organization.trim() != "") {

            $.ajax({
              url: '/social_network/pledge_resources/',
              data: formdata,
              type: "POST"
            }).done(function (data) {
              $('#id_organization').val("");

              if ($('#success_btn_affiliation').hasClass('hide')) {
                $('#success_btn_affiliation').removeClass('hide');
                $('#success_btn_affiliation').addClass('show');
              }


            }).fail(function () {
              if ($('#success_btn_affiliation').hasClass('show')) {
                $('#success_btn_affiliation').removeClass('show');
                $('#success_btn_affiliation').addClass('hide');
              }
            })
          }

        };
        $scope.add_project = function () {
          var formdata = {
            project_name: $scope.project_name,
            project_description: $scope.project_description,
            area_of_work: $scope.area_of_work,
            country_or_region: $scope.country_or_region,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          }
          if (formdata.project_name.trim() != "" && formdata.project_description.trim() != "" &&
              formdata.area_of_work.trim() != "" && formdata.country_or_region.trim() != "") {
            // SocialImpactNetwork.pledge_project(formdata)
            $http.post('/social_network/pledge_project/', formdata).then(function (response) {
              $scope.addProject(response.data);
              $scope.project_add_success = "Added Successfully";
              $scope.project_name = null;
              $scope.project_description = null;
              $scope.area_of_work = null;
              $scope.country_or_region = null;
            }, function (response) {
              $scope.contact_add_success = "";
            });
          }

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
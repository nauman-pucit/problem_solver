/**
 * Created by nauman on 11/29/16.
 */

(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('AddResourceController', function ($state, $scope, $stateParams, $http, SocialImpactNetwork,
                                                     SocialImpact, Authentication, Notification) {
        var vm = this;
        $scope.contact_person_name = '';
        $scope.contact_person_email = '';
        $scope.categorymodel = [];
        $scope.categorydata = [];
        $scope.categorysettings = {
          smartButtonMaxItems: 7,
          scrollableHeight: '250px'
        };

        $scope.country_model = [];
        $scope.country_data = [];
        $scope.city_model = [];
        $scope.city_data = [];
        $scope.worldwide = false;
        $scope.citywide = false;
        $scope.country_settings = {
          scrollableHeight: '230px',
          scrollable: true,
          enableSearch: true,
          smartButtonMaxItems: 1
        };
        $scope.country_settings_text = {
          buttonDefaultText: 'Country',
          checkAll: 'Worldwide'
        };
        $scope.city_settings = {
          scrollableHeight: '230px',
          scrollable: true,
          enableSearch: true,
          smartButtonMaxItems: 1
        };
        $scope.city_settings_text = {
          buttonDefaultText: 'City',
          checkAll: 'Nationwide'
        };
        $scope.project_form = false;
        $scope.cities_drop_down = false;
        $scope.network_form = false;
        $scope.contact_form = false;
        vm.resource_type = [];
        vm.current_category = [];
        vm.current_category_object = {};
        vm.category_type = [];
        vm.all_user_projects = [];
        vm.all_resource_types = null;
        vm.all_categories = [];
        vm.all_user_categories = [];
        vm.all_user_category_projects = [];
        vm.all_user_category_networks = [];
        vm.all_user_category_contacts = [];
        $scope.orgnaizations = [{id: 'orgnaization1'}];
        $scope.addNewOrgnaization = function (resource) {
          var newItemNo = $scope.orgnaizations.length + 1;
          resource.orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.removeOrgnaization = function (resource) {
          var lastItem = resource.orgnaizations.length - 1;
          resource.orgnaizations.splice(lastItem, 1);
        };
        vm.change_form = function (resource) {
          if (resource.resource_type == 'Projects') {
            resource.project_form = true;
            resource.network_form = false;
          }
          if (resource.resource_type == 'Networks') {
            resource.project_form = false;
            resource.network_form = true;
          }
        };
        if (Authentication.isAuthenticated()) {
          var account = $.parseJSON(Authentication.getAuthenticatedAccount());
          $scope.contact_person_name = account.name;
          $scope.contact_person_email = account.email;
        }
        vm.all_countries = [];
        SocialImpactNetwork.getAllCountries().then(function (all_countries) {
          vm.all_countries = all_countries.data;
          $scope.country_data = [];
          vm.all_countries.forEach(function (country) {
            $scope.country_data.push({id: country.id, label: country.name})
          });
        });
        $scope.get_cities = {
          onItemSelect: function (country) {
            SocialImpactNetwork.getCities(country).then(function (cities) {
              vm.cities = cities.data;
              vm.cities.forEach(function (city) {
                $scope.city_data.push({id: city.id, label: city.name, country: city.country})
              });
            });
          }, onItemDeselect: function (country) {
            $scope.city_model = [];
            $scope.city_data = $scope.city_data.filter(function (city) {
              return city.country !== country.id;
            });
            console.log(country);
          }, onDeselectAll: function () {
            $scope.worldwide = false;
            $scope.city_model = [];
            $scope.city_data = [];
            $scope.cities_drop_down = false;
          }, onSelectAll: function () {
            $scope.worldwide = true;
            $scope.city_model = [];
            $scope.city_data = [];
            $scope.cities_drop_down = true;
          }
        };
        $scope.cities_event = {
          onDeselectAll: function () {
            $scope.citywide = false;
          }, onSelectAll: function () {
            $scope.citywide = true;
          }
        };
        // get all categories of resources that user can pledge
        SocialImpactNetwork.allCategories().then(function (all_categories) {
          vm.all_categories = all_categories.data;
          $scope.categorydata = [];
          vm.all_categories.forEach(function (category) {
            $scope.categorydata.push({id: category.id, label: category.category_name})
          });
          // vm.category_type = vm.all_categories.map(function (category) {
          //   return category.id;
          // })
        });

        // get all resource type of the user the a user can pledge
        SocialImpactNetwork.allResourceTypes().then(function (all_resource_types) {
          vm.all_resource_types = all_resource_types.data;
          $scope.resources = [{
            id: 1,
            resource_type: '',
            all_resource_types: vm.all_resource_types,
            project_name: '',
            project_description: '',
            questions: [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}],
            duplicate_questions: false,
            network_name: '',
            network_description: '',
            contact_name: '',
            contact_email: '',
            contact_description: '',
            contact_anonymity: false,
            image: "",
            orgnaizations: [{id: 'orgnaization1'}],
            project_form: false,
            network_form: false,
            show_more_resource_btn: true
          }];
        });
        $scope.get_questions = function (resource) {
          if (resource.duplicate_questions) {
            SocialImpact.getQuestions().then(function (questions) {

              resource.questions = [];
              questions.data.forEach(function (question) {
                resource.questions.push({'id': question.id, 'name': question.question});
              });
            });
          } else {
            resource.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];
          }
        };

        // id or resource that needs to edit
        $scope.contactId = "";
        $scope.networkId = "";
        $scope.projectId = "";

        $scope.contact_name = "";
        $scope.contact_email = "";
        $scope.contact_description = "";
        $scope.contact_anonymity = false;

        $scope.project_name = "";
        $scope.project_description = "";
        $scope.project_add_success = "";
        $scope.duplicate_questions = false;
        $scope.projects = [];
        $scope.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];

        $scope.addNewQuestion = function (resource) {
          var newItemNo = resource.questions.length + 1;
          resource.questions.push({'id': 'field' + newItemNo});
        };
        $scope.removeQuestion = function (resource) {
          var lastItem = resource.questions.length - 1;
          resource.questions.splice(lastItem, 1);
        };
        $scope.resources = [];
        $scope.add_resource_form = function (resource) {
          resource.show_more_resource_btn = false;
          var newResourceNo = $scope.resources.length + 1;
          $scope.resources.push({
            id: newResourceNo,
            resource_type: '',
            all_resource_types: vm.all_resource_types,
            project_name: '',
            project_description: '',
            questions: [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}],
            duplicate_questions: false,
            network_name: '',
            network_description: '',
            contact_name: '',
            contact_email: '',
            contact_description: '',
            contact_anonymity: false,
            image: '',
            orgnaizations: [{id: 'orgnaization1'}],
            project_form: false,
            network_form: false,
            show_more_resource_btn: true
          });
        };
        $scope.removeResource = function (resource) {
          var index = $scope.resources.indexOf(resource);
          $scope.resources.splice(index, 1);
        };
        // this function saves new resource
        $scope.add_resource = function () {
          var categories_selected = [];
          $scope.categorymodel.forEach(function (category) {
            vm.all_categories.forEach(function (category_object) {
              if (category_object.id == category.id) {
                categories_selected.push(category_object);
              }
            })
          });
          $scope.resources.forEach(function (resource) {
            var organizations = resource.orgnaizations.map(function (a) {
              if (a.name != "") {
                return a.name;
              }
            });
            if (resource.resource_type == 'Projects' && categories_selected.length != 0) {
              var all_questions = resource.questions.map(function (a) {
                return a.name;
              });
              var formdata = new FormData();
              formdata.append('file', resource.image);
              formdata.append('categories_selected', JSON.stringify(categories_selected));
              formdata.append('worldwide', $scope.worldwide);
              formdata.append('citywide', $scope.citywide);
              formdata.append('country_model', JSON.stringify($scope.country_model));
              formdata.append('city_model', JSON.stringify($scope.city_model));
              formdata.append('category', vm.category_type);
              formdata.append('resource_type', resource.resource_type);
              formdata.append('project_name', resource.project_name);
              formdata.append('project_description', resource.project_description);
              formdata.append('questions', JSON.stringify(all_questions));
              formdata.append('contact_name', resource.contact_name);
              formdata.append('contact_email', resource.contact_email);
              formdata.append('anonymity', resource.contact_anonymity);
              formdata.append('contact_description', resource.contact_description);
              formdata.append('orgnaizations', JSON.stringify(organizations));
              formdata.append('file', resource.image);
              if (resource.project_name.trim() != "" && resource.project_description.trim() != "" &&
                  $scope.country_model.length != 0 && ($scope.city_model.length != 0 || $scope.worldwide) &&
                  resource.contact_name.trim() != "" && resource.contact_email.trim() != "" &&
                  resource.contact_description.trim() != "") {
                SocialImpactNetwork.pledgeProject(formdata).then(function (response) {
                  Notification("Project Added Successfully");
                  resource.resource_type = '';
                  resource.project_name = '';
                  resource.project_description = '';
                  resource.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];
                  resource.duplicate_questions = '';
                  resource.network_name = '';
                  resource.network_description = '';
                  resource.contact_name = '';
                  resource.contact_email = '';
                  resource.contact_description = '';
                  resource.contact_anonymity = '';
                  resource.orgnaizations = [{id: 'orgnaization1'}];
                  resource.project_form = false;
                  resource.network_form = false;
                  resource.show_more_resource_btn = true;
                }, function (response) {
                  Notification("Something went wrong");
                });
              } else if ($scope.country_model.length == 0) {
                Notification("Please select a geographical country / countries");
              } else if ($scope.city_model.length != 0 && !$scope.worldwide) {
                Notification("Please select a geographical city / cities");
              } else if (resource.project_name.trim() == "") {
                Notification("Please enter project name");
              } else if (resource.project_description.trim() == "") {
                Notification("Please enter project description");
              } else if (resource.contact_name.trim() == "") {
                Notification("Please enter contact person name");
              } else if (resource.contact_email.trim() == "") {
                Notification("Please enter contact person email");
              } else if (resource.contact_description.trim() == "") {
                Notification("Please write information about contact person (About me)");
              }
            }

            if (resource.resource_type == 'Networks' && categories_selected.length != 0) {
              var formdata = new FormData();
              formdata.append('file', resource.image);
              formdata.append('categories_selected', JSON.stringify(categories_selected));
              formdata.append('worldwide', $scope.worldwide);
              formdata.append('citywide', $scope.citywide);
              formdata.append('country_model', JSON.stringify($scope.country_model));
              formdata.append('city_model', JSON.stringify($scope.city_model));
              formdata.append('category', vm.category_type);
              formdata.append('resource_type', resource.resource_type);
              formdata.append('network_name', resource.network_name);
              formdata.append('network_description', resource.network_description);
              formdata.append('contact_name', resource.contact_name);
              formdata.append('contact_email', resource.contact_email);
              formdata.append('anonymity', resource.contact_anonymity);
              formdata.append('contact_description', resource.contact_description);
              formdata.append('orgnaizations', JSON.stringify(organizations));
              if (resource.network_name.trim() != "" && resource.network_description.trim() != "" &&
                  $scope.country_model.length != 0 && ($scope.city_model.length != 0 || $scope.worldwide) &&
                  resource.contact_name.trim() != "" && resource.contact_email.trim() != "" &&
                  resource.contact_description.trim() != "") {
                SocialImpactNetwork.pledgeNetwork(formdata).then(function (response) {
                  Notification("Network Added Successfully");
                  resource.resource_type = '';
                  resource.project_name = '';
                  resource.project_description = '';
                  resource.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];
                  resource.duplicate_questions = '';
                  resource.network_name = '';
                  resource.network_description = '';
                  resource.contact_name = '';
                  resource.contact_email = '';
                  resource.contact_description = '';
                  resource.contact_anonymity = '';
                  resource.orgnaizations = [{id: 'orgnaization1'}];
                  resource.project_form = false;
                  resource.network_form = false;
                  resource.show_more_resource_btn = true;
                }, function (response) {
                  Notification("Something went wrong");
                });

              } else if ($scope.country_model.length == 0) {
                Notification("Please select a geographical country / countries");
              } else if ($scope.city_model.length == 0 && !$scope.worldwide) {
                Notification("Please select a geographical city / cities");
              } else if (resource.network_name.trim() == "") {
                Notification("Please enter network name");
              } else if (resource.network_description.trim() == "") {
                Notification("Please enter network description");
              } else if (resource.contact_name.trim() == "") {
                Notification("Please enter contact person name");
              } else if (resource.contact_email.trim() == "") {
                Notification("Please enter contact person email");
              } else if (resource.contact_description.trim() == "") {
                Notification("Please write information about contact person (About me)");
              }
            } else if (categories_selected.length == 0) {
              Notification("Please select resource category / categories");
            }
          });

        };
      });
})();
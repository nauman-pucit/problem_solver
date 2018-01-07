/**
 * Created by nauman on 11/29/16.
 */

(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('my_pledges_controller', function ($state, $scope, $stateParams, $http, SocialImpactNetwork,
                                                         SocialImpact, Authentication, Notification) {
        var vm = this;
        vm.loading = true;
        var tabs = [
              {title: 'Resources', content: []},
              {title: 'Skills', content: []}
            ],
            selected = null,
            previous = null;
        $scope.tabs = tabs;
        $scope.selectedIndex = 0;

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
        $scope.Citywide = false;
        $scope.country_city_settings = {
          scrollableHeight: '300px',
          scrollable: true,
          enableSearch: true,
          smartButtonMaxItems: 3
        };
        vm.change_screen_size = function (resources_count, skills_count) {
          var max_value = 0;
          if(resources_count > skills_count){
            max_value = resources_count;
          }else {
            max_value = skills_count;
          }

          var x = $(window).width();
          var platform = navigator.platform;

          if (x < 1000) {
            var height = max_value*330;
            $("#content").css("min-height", height);
          }else {
            if (max_value > 6){
            max_value = Math.ceil(max_value / 3);
            $("#content").css("min-height", max_value*350);
            }
          }
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
        $scope.addProject = function (project) {
          vm.all_user_category_projects.push(project);
        };
        $scope.orgnaizations = [{id: 'orgnaization1'}];
        $scope.addContact = function (contact) {
          vm.all_user_category_contacts.push(contact);
        };
        $scope.addNewOrgnaization = function () {
          var newItemNo = $scope.orgnaizations.length + 1;
          $scope.orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.removeOrgnaization = function (orgnaization) {
          var index = $scope.orgnaizations.indexOf(orgnaization);
          $scope.orgnaizations.splice(index, 1);
        };

        $scope.fields = [{id: 'field1'}];
        $scope.addNetwork = function (network) {
          vm.all_user_category_networks.push(network);
        };
        $scope.addNewField = function () {
          var newItemNo = $scope.fields.length + 1;
          $scope.fields.push({'id': 'field' + newItemNo, 'name': ''});
        };
        $scope.removeField = function (field) {
          var index = $scope.fields.indexOf(field);
          // var lastItem = $scope.questions.length - 1;
          $scope.fields.splice(index, 1);
          // var lastItem = $scope.fields.length - 1;
          // $scope.fields.splice(lastItem);
        };

        vm.change_form = function () {
          if (vm.resource_type == 'Projects') {
            $scope.project_form = true;
            $scope.network_form = false;
            $scope.contact_form = false;
          }
          if (vm.resource_type == 'Networks') {
            $scope.project_form = false;
            $scope.network_form = true;
            $scope.contact_form = false;
          }
          if (vm.resource_type == 'Contacts') {
            $scope.project_form = false;
            $scope.network_form = false;
            $scope.contact_form = true;
          }
        };
        if (Authentication.isAuthenticated()) {
          var account = $.parseJSON(Authentication.getAuthenticatedAccount());
          $scope.contact_person_name = account.name;
          $scope.contact_person_email = account.email;
        }

        vm.switch_tab = function (category) {
          vm.loading = true;
          vm.current_category = category.category_name;
          vm.current_category_object = category;
          SocialImpactNetwork.userCategoryProjects(category).then(function (all_user_category_projects) {
            vm.all_user_category_projects = all_user_category_projects.data;
          });
          SocialImpactNetwork.userCategoryNetworks(category).then(function (all_user_category_networks) {
            vm.loading = false;
            vm.all_user_category_networks = all_user_category_networks.data;
          });
        };
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
            $scope.Citywide = false;
          }, onSelectAll: function () {
            $scope.Citywide = true;
          }
        };
        //get all categories of resources that user pledged
        SocialImpactNetwork.allUserCategories().then(function (all_user_categories) {
          vm.all_user_categories = all_user_categories.data;
          vm.all_user_categories.unshift({category_name: 'All', id: 0});
          if (vm.all_user_categories.length != 0) {
            vm.current_category = vm.all_user_categories[0].category_name;
            vm.current_category_object = vm.all_user_categories[0];
            SocialImpactNetwork.userCategoryProjects(vm.all_user_categories[0]).then(
                function (all_user_category_projects) {
                  vm.loading = false;
                  vm.all_user_category_projects = all_user_category_projects.data;
                });
            SocialImpactNetwork.userCategoryNetworks(vm.all_user_categories[0]).then(
                function (all_user_category_networks) {
                  vm.all_user_category_networks = all_user_category_networks.data;
                  vm.change_screen_size(vm.all_user_category_projects.length +
                  vm.all_user_category_networks.length, vm.all_user_skills.length);
                });
          }
        });

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
        });
        $scope.get_questions = function () {
          if ($scope.duplicate_questions) {
            SocialImpact.getQuestions().then(function (questions) {
              $scope.questions = [];
              questions.data.forEach(function (question) {
                $scope.questions.push({'id': question.id, 'name': question.question});
              });
            });
          } else {
            $scope.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];
          }
        };
        // dialog box to confirm project deletion
        vm.confirmDeleteProjectModal = false;
        $scope.project_to_delete = {};
        vm.showDeleteProjectModal = function (project) {
          $scope.project_to_delete = project;
          vm.confirmDeleteProjectModal = true;
        };
        vm.closeDeleteProjectModal = function () {
          vm.confirmDeleteProjectModal = false;
        };

        // dialog box to confirm contact deletion
        vm.confirmDeleteContactModal = false;
        $scope.contact_to_delete = {};
        vm.showDeleteContactModal = function (contact) {
          $scope.contact_to_delete = contact;
          vm.confirmDeleteContactModal = true;
        };
        vm.closeDeleteContactModal = function () {
          vm.confirmDeleteContactModal = false;
        };

        // dialog box to confirm network deletion
        vm.confirmDeleteNetworkModal = false;
        $scope.network_to_delete = {};
        vm.showDeleteNetworkModal = function (network) {
          $scope.network_to_delete = network;
          vm.confirmDeleteNetworkModal = true;
        };
        vm.closeDeleteNetworkModal = function () {
          vm.confirmDeleteNetworkModal = false;
        };

        // affiliations model
        vm.showModalAffiliation = false;
        vm.organizations_collection = [];
        vm.affiliations = function (contact) {
          vm.showModalAffiliation = true;
          SocialImpactNetwork.getAffiliations(contact.id)
              .then(function (affiliations) {
                vm.organizations_collection = affiliations.data;
              });
          //$state.go('all_user_projects.affiliation', {contactId: contact.id})
        };
        vm.close = function () {
          vm.organizations_collection = [];
          vm.showModalAffiliation = false;
        };

        // field of work model
        vm.showModal = false;
        vm.fields_of_work_collection = [];
        vm.fields_of_work = function (network) {
          vm.showModal = true;
          SocialImpactNetwork.get_fields_of_work(network.id)
              .then(function (fields_of_work) {
                vm.fields_of_work_collection = fields_of_work.data;
              });
          //$state.go('all_user_projects.field_of_work', {networkId: network.id})
        };
        vm.closeModel = function () {
          vm.fields_of_work_collection = [];
          vm.showModal = false;
        };

        // models for editing resources
        vm.ModalEditProject = false;
        vm.ModalEditNetwork = false;
        vm.ModalEditContact = false;
        vm.showModalEditProject = function (project) {
          $scope.country_model = [];
          $scope.city_model = [];
          vm.ModalEditProject = true;
          $scope.projectId = project.id;
          $scope.questions = [];
          SocialImpactNetwork.projectDetail(project.id).then(function (project) {
            $scope.project_name = project.data.project_name;
            $scope.project_description = project.data.project_description;
            if (project.data.geographical_countries.length != 0) {
              SocialImpact.getCountries(project.data.geographical_countries).then(function (response) {
                $scope.country_model = [];
                response.data.forEach(function (country) {
                  SocialImpactNetwork.getCities(country).then(function (cities) {
                    vm.cities = cities.data;
                    vm.cities.forEach(function (city) {
                      $scope.city_data.push({id: city.id, label: city.name, country: city.country})
                    });
                  });
                  $scope.country_model.push({id: country.id});
                });
              });
            }
            if (project.data.geographical_cities.length != 0) {
              SocialImpact.getCities(project.data.geographical_cities).then(function (response) {
                $scope.city_model = [];
                response.data.forEach(function (city) {
                  $scope.city_model.push({id: city.id});
                });
              });
            }

            SocialImpact.getContact({networkId: null, projectId: project.data.id}).then(function (response) {
              vm.contact = response.data;
              $scope.contactId = vm.contact.id;
              $scope.contact_name = vm.contact.contact_name;
              $scope.contact_email = vm.contact.contact_email;
              $scope.contact_description = vm.contact.contact_description;
              $scope.contact_anonymity = vm.contact.anonymity;
              SocialImpact.getAffiliations(vm.contact.id).then(function (response) {
                $scope.orgnaizations = [];
                for (var i = 0; i < response.data.length; i++) {
                  $scope.orgnaizations.push({'id': response.data[i].id, 'name': response.data[i].affiliation});
                }
              });
            });
            for (var i = 0; i < project.data.questions.length; i++) {
              $scope.questions.push({'id': project.data.questions[i][0], 'name': project.data.questions[i][1]});
            }
          })

        };
        vm.closeModalEditProject = function () {
          $scope.country_model = [];
          $scope.city_model = [];
          $scope.city_data = [];
          $scope.project_name = "";
          $scope.project_description = "";
          $scope.country_or_region = "";
          $scope.project_add_success = "";
          $scope.contactId = "";
          $scope.contact_name = "";
          $scope.contact_email = "";
          $scope.contact_description = "";
          $scope.contact_anonymity = false;
          vm.ModalEditProject = false;
          $scope.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];
        };
        vm.showModalEditNetwork = function (network) {
          $scope.country_model = [];
          $scope.city_model = [];
          $scope.networkId = network.id;
          vm.ModalEditNetwork = true;
          $scope.network_name = network.network_name;
          $scope.network_description = network.network_description;
          if (network.geographical_countries.length != 0) {
            SocialImpact.getCountries(network.geographical_countries).then(function (response) {
              $scope.country_model = [];
              response.data.forEach(function (country) {
                SocialImpactNetwork.getCities(country).then(function (cities) {
                  vm.cities = cities.data;
                  vm.cities.forEach(function (city) {
                    $scope.city_data.push({id: city.id, label: city.name, country: city.country})
                  });
                });
                $scope.country_model.push({id: country.id});
              });
            });
          }
          if (network.geographical_cities.length != 0) {
            SocialImpact.getCities(network.geographical_cities).then(function (response) {
              $scope.city_model = [];
              response.data.forEach(function (city) {
                $scope.city_model.push({id: city.id});
              });
            });
          }
          SocialImpact.getContact({networkId: network.id, projectId: null}).then(function (response) {
            vm.contact = response.data;
            $scope.contactId = vm.contact.id;
            $scope.contact_name = vm.contact.contact_name;
            $scope.contact_email = vm.contact.contact_email;
            $scope.contact_description = vm.contact.contact_description;
            $scope.contact_anonymity = vm.contact.anonymity;
            SocialImpact.getAffiliations(vm.contact.id).then(function (response) {
              $scope.orgnaizations = [];
              for (var i = 0; i < response.data.length; i++) {
                $scope.orgnaizations.push({'id': response.data[i].id, 'name': response.data[i].affiliation});
              }
            });
          });
        };
        vm.closeModalEditNetwork = function () {
          $scope.country_model = [];
          $scope.city_model = [];
          $scope.city_data = [];
          $scope.project_add_success = "";
          $scope.fields = [{id: 'field1'}];
          $scope.network_name = "";
          $scope.network_description = "";
          vm.ModalEditNetwork = false;
        };
        vm.showModalEditContact = function (contact) {
          $scope.contactId = contact.id;
          $scope.orgnaizations = [];
          vm.ModalEditContact = true;
          $scope.contact_name = contact.contact_name;
          $scope.contact_description = contact.contact_description;
          SocialImpactNetwork.getAffiliations(contact.id).then(function (affiliations) {
            for (var i = 0; i < affiliations.data.length; i++) {
              $scope.orgnaizations.push({'id': affiliations.data[i].id, 'name': affiliations.data[i].affiliation});
            }
          })
        };
        vm.closeModalEditContact = function () {
          $scope.project_add_success = "";
          $scope.orgnaizations = [{id: 'orgnaization1'}];
          $scope.contact_name = "";
          $scope.contact_description = "";
          vm.ModalEditContact = false;
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
        $scope.country_or_region = "";
        $scope.duplicate_questions = false;
        $scope.projects = [];
        $scope.questions = [{id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}, {id: 'field1'}];

        $scope.addNewQuestion = function () {
          var newItemNo = $scope.questions.length + 1;
          $scope.questions.push({'id': 'field' + newItemNo});
        };
        $scope.removeQuestion = function (question) {
          var index = $scope.questions.indexOf(question);
          // var lastItem = $scope.questions.length - 1;
          $scope.questions.splice(index, 1);
        };

        // resource editing functions
        $scope.edit_project = function () {
          var all_questions = $scope.questions.map(function (a) {
            return a.name;
          });
          all_questions = $scope.questions;
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            worldwide: JSON.stringify($scope.worldwide),
            citywide: JSON.stringify($scope.Citywide),
            country_model: JSON.stringify($scope.country_model),
            city_model: JSON.stringify($scope.city_model),
            contactId: $scope.contactId,
            contact_name: $scope.contact_name,
            contact_email: $scope.contact_email,
            contact_description: $scope.contact_description,
            anonymity: $scope.contact_anonymity,
            orgnaizations: $scope.orgnaizations,
            projectId: $scope.projectId,
            project_name: $scope.project_name,
            project_description: $scope.project_description,
            questions: all_questions,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.project_name.trim() != "" && formdata.project_description.trim() != "" &&
              formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "" &&
              formdata.contact_email.trim() != "") {
            SocialImpactNetwork.updateProject(formdata).then(function (response) {

              SocialImpactNetwork.userCategoryProjects(vm.current_category_object).then(function (all_user_category_projects) {
                vm.all_user_category_projects = all_user_category_projects.data;
              });
              $scope.questions = [];
              SocialImpactNetwork.projectDetail($scope.projectId).then(function (project) {
                $scope.project_name = project.data.project_name;
                $scope.project_description = project.data.project_description;
                $scope.country_or_region = project.data.country_or_region;
                for (var i = 0; i < project.data.questions.length; i++) {
                  $scope.questions.push({'id': project.data.questions[i][0], 'name': project.data.questions[i][1]});
                }
              });
              Notification("Updated Successfully");
              $scope.project_add_success = "";
            }, function (response) {
              $scope.contact_add_success = "";
            });
          }
        };
        $scope.deleteProject = function () {
          var project = $scope.project_to_delete;
          var formdata = {
            projectId: project.id,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          SocialImpactNetwork.deleteProject(formdata).then(function (response) {
            SocialImpactNetwork.userCategoryProjects(vm.current_category_object).then(function (all_user_category_projects) {
              vm.all_user_category_projects = all_user_category_projects.data;
            });
            vm.confirmDeleteProjectModal = false;
          }, function (response) {
            $scope.project_add_success = "";
          });
        };
        $scope.edit_network = function () {
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            worldwide: JSON.stringify($scope.worldwide),
            citywide: JSON.stringify($scope.Citywide),
            country_model: JSON.stringify($scope.country_model),
            city_model: JSON.stringify($scope.city_model),
            networkId: $scope.networkId,
            network_name: $scope.network_name,
            network_description: $scope.network_description,
            contactId: $scope.contactId,
            contact_name: $scope.contact_name,
            contact_email: $scope.contact_email,
            contact_description: $scope.contact_description,
            anonymity: $scope.contact_anonymity,
            orgnaizations: $scope.orgnaizations,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.network_name.trim() != "" && formdata.network_description.trim() != "" &&
              formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "" &&
              formdata.contact_email.trim() != "") {
            SocialImpactNetwork.updateNetwork(formdata).then(function (response) {
              SocialImpactNetwork.userCategoryNetworks(vm.current_category_object).then(function (all_user_category_networks) {
                vm.all_user_category_networks = all_user_category_networks.data;
              });
              Notification("Updated Successfully");
            }, function (response) {
              $scope.project_add_success = "";
            });

          }

        };
        $scope.deleteNetwork = function () {
          var network = $scope.network_to_delete;
          var formdata = {
            networkId: network.id,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          SocialImpactNetwork.deleteNetwork(formdata).then(function (response) {
            SocialImpactNetwork.userCategoryNetworks(vm.current_category_object).then(function (all_user_category_networks) {
              vm.all_user_category_networks = all_user_category_networks.data;
            });
            vm.confirmDeleteNetworkModal = false;
          }, function (response) {
            $scope.project_add_success = "";
          });
        };
        $scope.edit_contact = function () {
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            contactId: $scope.contactId,
            contact_name: $scope.contact_name,
            contact_description: $scope.contact_description,
            orgnaizations: $scope.orgnaizations,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "") {
            SocialImpactNetwork.update_contact(formdata).then(function (response) {
              SocialImpactNetwork.user_category_contacts(vm.current_category_object).then(function (all_user_category_contacts) {
                vm.all_user_category_contacts = all_user_category_contacts.data;
              });
              SocialImpactNetwork.getAffiliations($scope.contactId).then(function (affiliations) {
                $scope.orgnaizations = [];
                for (var i = 0; i < affiliations.data.length; i++) {
                  $scope.orgnaizations.push({'id': affiliations.data[i].id, 'name': affiliations.data[i].affiliation});
                }
              });
              Notification("Updated Successfully");
              $scope.project_add_success = "";


            }, function (response) {
              $scope.contact_add_success = "";
            });
          }


        };
        $scope.deleteContact = function () {
          var contact = $scope.contact_to_delete;
          var formdata = {
            contactId: contact.id,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          SocialImpactNetwork.delete_contact(formdata).then(function (response) {
            SocialImpactNetwork.user_category_contacts(vm.current_category_object).then(function (all_user_category_contacts) {
              vm.all_user_category_contacts = all_user_category_contacts.data;
            });
            vm.confirmDeleteContactModal = false;

          }, function (response) {
            $scope.contact_add_success = "";
          });
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
          var organizations = $scope.orgnaizations.map(function (a) {
            if (a.name != "") {
              return a.name;
            }
          });
          if (vm.resource_type == 'Projects' && categories_selected.length != 0) {
            var all_questions = $scope.questions.map(function (a) {
              return a.name;
            });

            var formdata = {
              categories_selected: categories_selected,
              worldwide: $scope.worldwide,
              citywide: $scope.Citywide,
              country_model: $scope.country_model,
              city_model: $scope.city_model,
              category: vm.category_type,
              project_name: $scope.project_name,
              project_description: $scope.project_description,
              questions: all_questions,
              contact_name: $scope.contact_name,
              contact_email: $scope.contact_email,
              anonymity: $scope.contact_anonymity,
              contact_description: $scope.contact_description,
              orgnaizations: organizations,
              csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
            };
            if (!formdata.contact_email) {
              Notification("Provide contact email");
            } else if (formdata.project_name.trim() != "" && formdata.project_description.trim() != "" &&
                formdata.country_model.length != 0 && (formdata.city_model.length != 0 || formdata.worldwide) &&
                formdata.contact_name.trim() != "" && formdata.contact_email.trim() != "" &&
                formdata.contact_description.trim() != "") {
              SocialImpactNetwork.pledge_project(formdata).then(function (response) {
                var isCategoryExist = false;
                var isCategoryExistOuter = true;
                var tempCategories = [];
                for (var j = 0; j < response.data.resource.resource_category.length; j++) {
                  isCategoryExist = false;
                  for (var i = 0; i < vm.all_user_categories.length; i++) {
                    if (vm.all_user_categories[i].category_name == response.data.resource.resource_category[j].category_name) {
                      isCategoryExist = true;
                    }
                  }
                  if (!isCategoryExist) {
                    isCategoryExistOuter = false;
                    tempCategories.push(response.data.resource.resource_category[j]);
                  }

                }
                if (!isCategoryExistOuter) {
                  if (vm.all_user_categories.length == 0) {
                    vm.current_category = response.data.resource.resource_category[0].category_name;
                  }
                  var flag = false;
                  tempCategories.forEach(function (tempCategory) {
                    flag = false;
                    vm.all_user_categories.forEach(function (all_user_category) {
                      if (all_user_category == tempCategory) {
                        flag = true;
                      }
                    });
                    if (!flag) {
                      vm.all_user_categories.push(tempCategory)
                    }
                  });
                }


                response.data.resource.resource_category.forEach(function (category) {
                  if (category.category_name == vm.current_category) {
                    $scope.addProject(response.data);
                  }
                });
                Notification("Added Successfully");
                $scope.project_add_success = "";
                $scope.project_name = null;
                $scope.project_description = null;
                $scope.country_or_region = null;
                $scope.questions = []
              }, function (response) {
                $scope.contact_add_success = "";
              });
            } else {
              Notification("Please fill form properly");
            }
          }
          if (vm.resource_type == 'Networks' && categories_selected.length != 0) {
            var fields_of_work = $scope.fields.map(function (a) {
              if (a.name != "") {
                return a.name;
              }

            });
            var formdata = {
              categories_selected: categories_selected,
              worldwide: $scope.worldwide,
              citywide: $scope.Citywide,
              country_model: $scope.country_model,
              city_model: $scope.city_model,
              category: vm.category_type,
              network_name: $scope.network_name,
              network_description: $scope.network_description,
              contact_name: $scope.contact_name,
              contact_email: $scope.contact_email,
              anonymity: $scope.contact_anonymity,
              contact_description: $scope.contact_description,
              orgnaizations: organizations,
              csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
            };
            if (!formdata.contact_email) {
              Notification("Provide contact email");
            } else if (formdata.network_name.trim() != "" && formdata.network_description.trim() != "" &&
                formdata.country_model.length != 0 && (formdata.city_model.length != 0 || formdata.worldwide) &&
                formdata.contact_name.trim() != "" && formdata.contact_email.trim() != "" &&
                formdata.contact_description.trim() != "") {
              SocialImpactNetwork.pledge_network(formdata).then(function (response) {
                var isCategoryExist = false;
                var isCategoryExistOuter = true;
                var tempCategories = [];
                for (var j = 0; j < response.data.resource.resource_category.length; j++) {
                  isCategoryExist = false;
                  for (var i = 0; i < vm.all_user_categories.length; i++) {
                    if (vm.all_user_categories[i].category_name == response.data.resource.resource_category[j].category_name) {
                      isCategoryExist = true;
                    }
                  }
                  if (!isCategoryExist) {
                    isCategoryExistOuter = false;
                    tempCategories.push(response.data.resource.resource_category[j]);
                  }

                }
                if (!isCategoryExistOuter) {
                  if (vm.all_user_categories.length == 0) {
                    vm.current_category = response.data.resource.resource_category[0].category_name;
                  }
                  var flag = false;
                  tempCategories.forEach(function (tempCategory) {
                    flag = false;
                    vm.all_user_categories.forEach(function (all_user_category) {
                      if (all_user_category == tempCategory) {
                        flag = true;
                      }
                    });
                    if (!flag) {
                      vm.all_user_categories.push(tempCategory)
                    }
                  });
                }


                response.data.resource.resource_category.forEach(function (category) {
                  if (category.category_name == vm.current_category) {
                    $scope.addNetwork(response.data);
                  }
                });
                Notification("Added Successfully");
                $scope.project_add_success = "";
                $scope.network_name = null;
                $scope.network_description = null;
                $scope.fields = [{id: 'field1'}];

              }, function (response) {
                $scope.contact_add_success = "";
              });

            } else {
              Notification("Please fill form properly");
            }
          }
          if (vm.resource_type == 'Contacts' && categories_selected.length != 0) {
            var organizations = $scope.orgnaizations.map(function (a) {
              if (a.name != "") {
                return a.name;
              }
            });
            var formdata = {
              categories_selected: categories_selected,
              category: vm.category_type,
              contact_name: $scope.contact_name,
              contact_description: $scope.contact_description,
              orgnaizations: organizations,
              csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
            };
            if (formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "") {
              SocialImpactNetwork.pledge_contact(formdata).then(function (response) {
                var isCategoryExist = false;
                var isCategoryExistOuter = true;
                var tempCategories = [];
                for (var j = 0; j < response.data.resource.resource_category.length; j++) {
                  isCategoryExist = false;
                  for (var i = 0; i < vm.all_user_categories.length; i++) {
                    if (vm.all_user_categories[i].category_name == response.data.resource.resource_category[j].category_name) {
                      isCategoryExist = true;
                    }
                  }
                  if (!isCategoryExist) {
                    isCategoryExistOuter = false;
                    tempCategories.push(response.data.resource.resource_category[j]);
                  }

                }
                if (!isCategoryExistOuter) {
                  if (vm.all_user_categories.length == 0) {
                    vm.current_category = response.data.resource.resource_category[0].category_name;
                  }
                  var flag = false;
                  tempCategories.forEach(function (tempCategory) {
                    flag = false;
                    vm.all_user_categories.forEach(function (all_user_category) {
                      if (all_user_category == tempCategory) {
                        flag = true;
                      }
                    });
                    if (!flag) {
                      vm.all_user_categories.push(tempCategory)
                    }
                  });
                }


                response.data.resource.resource_category.forEach(function (category) {
                  if (category.category_name == vm.current_category) {
                    $scope.addContact(response.data);
                  }
                });
                Notification("Added Successfully");
                $scope.project_add_success = "";
                $scope.contact_name = null;
                $scope.contact_description = null;
                $scope.orgnaizations = [{id: 'orgnaization1'}];

              }, function (response) {
                $scope.contact_add_success = "";
              });
            }
          }


        };

        //============================== Skills Controller's Data ====================================

        $scope.skill_contact_person_name = '';
        $scope.skill_contact_person_email = '';

        $scope.skill_country_model = [];
        $scope.skill_country_data = [];
        $scope.skill_city_model = [];
        $scope.skill_city_data = [];
        $scope.skill_worldwide = false;
        $scope.skill_citywide = false;
        $scope.skill_country_settings = {
          scrollableHeight: '230px',
          scrollable: true,
          enableSearch: true,
          smartButtonMaxItems: 1
        };
        $scope.skill_country_settings_text = {
          buttonDefaultText: 'Country',
          checkAll: 'Worldwide'
        };
        $scope.skill_city_settings = {
          scrollableHeight: '230px',
          scrollable: true,
          enableSearch: true,
          smartButtonMaxItems: 1
        };
        $scope.skill_city_settings_text = {
          buttonDefaultText: 'City',
          checkAll: 'Nationwide'
        };
        $scope.skill_cities_drop_down = false;
        $scope.skill_orgnaizations = [{id: 'orgnaization1'}];
        $scope.skill_addNewOrgnaization = function (skill) {
          var newItemNo = $scope.skill_orgnaizations.length + 1;
          skill.orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.skill_removeOrgnaization = function (skill) {
          var lastItem = skill.orgnaizations.length - 1;
          skill.orgnaizations.splice(lastItem, 1);
        };
        $scope.skillAddNewEditOrgnaization = function () {
          var newItemNo = $scope.skill_orgnaizations.length + 1;
          $scope.skill_orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.skill_removeEditOrgnaization = function (orgnaization) {
          var index = $scope.skill_orgnaizations.indexOf(orgnaization);
          $scope.skill_orgnaizations.splice(index, 1);
        };

        if (Authentication.isAuthenticated()) {
          var account = $.parseJSON(Authentication.getAuthenticatedAccount());
          $scope.skill_contact_person_name = account.name;
          $scope.skill_contact_person_email = account.email;
        }
        vm.skill_all_countries = [];
        SocialImpactNetwork.getAllCountries().then(function (all_countries) {
          vm.skill_all_countries = all_countries.data;
          $scope.skill_country_data = [];
          vm.skill_all_countries.forEach(function (country) {
            $scope.skill_country_data.push({id: country.id, label: country.name})
          });
        });
        $scope.skill_get_cities = {
          onItemSelect: function (country) {
            SocialImpactNetwork.getCities(country).then(function (cities) {
              vm.skill_cities = cities.data;
              vm.skill_cities.forEach(function (city) {
                $scope.skill_city_data.push({id: city.id, label: city.name, country: city.country})
              });
            });
          }, onItemDeselect: function (country) {
            $scope.skill_city_model = [];
            $scope.skill_city_data = $scope.skill_city_data.filter(function (city) {
              return city.country !== country.id;
            });
            console.log(country);
          }, onDeselectAll: function () {
            $scope.skill_worldwide = false;
            $scope.skill_city_model = [];
            $scope.skill_city_data = [];
            $scope.skill_cities_drop_down = false;
          }, onSelectAll: function () {
            $scope.skill_worldwide = true;
            $scope.skill_city_model = [];
            $scope.skill_city_data = [];
            $scope.skill_cities_drop_down = true;
          }
        };
        $scope.skill_cities_event = {
          onDeselectAll: function () {
            $scope.skill_citywide = false;
          }, onSelectAll: function () {
            $scope.skill_citywide = true;
          }
        };
        vm.showDeleteSkillModal = function (skill) {
          $scope.skill_to_delete = skill;
          vm.confirmDeleteSkillModal = true;
        };
        vm.closeDeleteSkillModal = function () {
          vm.confirmDeleteSkillModal = false;
        };
        $scope.deleteSkill = function () {
          var skill = $scope.skill_to_delete;
          var formdata = {
            skillId: skill.id,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          SocialImpactNetwork.deleteSkill(formdata).then(function (response) {
            SocialImpactNetwork.allUserSkills().then(function (response) {
              vm.all_user_skills = response.data;
            });
            vm.confirmDeleteSkillModal = false;
          });
        };
        vm.showModalEditSkill = function (skill) {
          $scope.skill_country_model = [];
          $scope.skill_city_model = [];
          $scope.skillId = skill.id;
          vm.ModalEditSkill = true;
          $scope.skill_name = skill.skill_name;
          $scope.skill_description = skill.skill_description;
          $scope.skill_level = skill.skill_level;
          if (skill.geographical_countries.length != 0) {
            SocialImpact.getCountries(skill.geographical_countries).then(function (response) {
              $scope.skill_country_model = [];
              response.data.forEach(function (country) {
                SocialImpactNetwork.getCities(country).then(function (cities) {
                  vm.skill_cities = cities.data;
                  vm.skill_cities.forEach(function (city) {
                    $scope.skill_city_data.push({id: city.id, label: city.name, country: city.country})
                  });
                });
                $scope.skill_country_model.push({id: country.id});
              });
            });
          }
          if (skill.geographical_cities.length != 0) {
            SocialImpact.getCities(skill.geographical_cities).then(function (response) {
              $scope.skill_city_model = [];
              response.data.forEach(function (city) {
                $scope.skill_city_model.push({id: city.id});
              });
            });
          }
          SocialImpact.getContact({skillId: skill.id, projectId: null, networkId: null}).then(function (response) {
            vm.skill_contact = response.data;
            $scope.skill_contactId = vm.skill_contact.id;
            $scope.skill_contact_name = vm.skill_contact.contact_name;
            $scope.skill_contact_email = vm.skill_contact.contact_email;
            $scope.skill_contact_description = vm.skill_contact.contact_description;
            $scope.skill_contact_anonymity = vm.skill_contact.anonymity;
            SocialImpact.getAffiliations(vm.skill_contact.id).then(function (response) {
              $scope.skill_orgnaizations = [];
              for (var i = 0; i < response.data.length; i++) {
                $scope.skill_orgnaizations.push({'id': response.data[i].id, 'name': response.data[i].affiliation});
              }
            });
          });
        };
        vm.closeModalEditSkill = function () {
          $scope.skill_country_model = [];
          $scope.skill_city_model = [];
          $scope.skill_city_data = [];
          $scope.skill_project_add_success = "";
          $scope.skill_fields = [{id: 'field1'}];
          $scope.skill_name = "";
          $scope.skill_description = "";
          $scope.skill_level = "";
          vm.ModalEditSkill = false;
        };

        SocialImpactNetwork.allUserSkills().then(function (response) {
          vm.all_user_skills = response.data;
          vm.change_screen_size(vm.all_user_category_projects.length +
          vm.all_user_category_networks.length, vm.all_user_skills.length);
        });
        // id of skill that needs to edit
        $scope.projectId = "";

        $scope.skill_contact_name = "";
        $scope.skill_contact_email = "";
        $scope.skill_contact_description = "";
        $scope.skill_contact_anonymity = false;

        $scope.skill_name = "";
        $scope.skill_description = "";
        $scope.skill_level = "";
        // this function edit skill
        $scope.edit_skill = function () {
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            worldwide: JSON.stringify($scope.skill_worldwide),
            citywide: JSON.stringify($scope.skill_citywide),
            country_model: JSON.stringify($scope.skill_country_model),
            city_model: JSON.stringify($scope.skill_city_model),
            skillId: $scope.skillId,
            skill_name: $scope.skill_name,
            skill_description: $scope.skill_description,
            skill_level: $scope.skill_level,
            contactId: $scope.skill_contactId,
            contact_name: $scope.skill_contact_name,
            contact_email: $scope.skill_contact_email,
            contact_description: $scope.skill_contact_description,
            anonymity: $scope.skill_contact_anonymity,
            orgnaizations: $scope.skill_orgnaizations,
            csrfmiddlewaretoken: $('input[name = csrfmiddlewaretoken]').val()
          };
          if (formdata.skill_name.trim() != "" && formdata.skill_description.trim() != "" &&
              formdata.contact_name.trim() != "" && formdata.contact_description.trim() != "" &&
              formdata.contact_email.trim() != "") {
            SocialImpactNetwork.updateSkill(formdata).then(function (response) {
              SocialImpactNetwork.allUserSkills().then(function (skills) {
                vm.all_user_skills = skills.data;
              });
              Notification("Updated Successfully");
            });
          }
        };
      });
})();
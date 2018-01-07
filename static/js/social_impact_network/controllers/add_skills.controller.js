/**
 * Created by nauman on 3/10/17.
 */

(function () {
  'use strict';
  angular
      .module('social_impact_network')
      .controller('AddSkillController', function ($state, $scope, $stateParams, $http, SocialImpactNetwork,
                                                  SocialImpact, Authentication, Notification) {
        var vm = this;
        $scope.contact_person_name = '';
        $scope.contact_person_email = '';

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
        $scope.cities_drop_down = false;
        $scope.orgnaizations = [{id: 'orgnaization1'}];
        $scope.addNewOrgnaization = function (skill) {
          var newItemNo = $scope.orgnaizations.length + 1;
          skill.orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.removeOrgnaization = function (skill) {
          var lastItem = skill.orgnaizations.length - 1;
          skill.orgnaizations.splice(lastItem, 1);
        };
        $scope.addNewEditOrgnaization = function () {
          var newItemNo = $scope.orgnaizations.length + 1;
          $scope.orgnaizations.push({'id': 'orgnaization' + newItemNo, 'name': ''});
        };
        $scope.removeEditOrgnaization = function (orgnaization) {
          var index = $scope.orgnaizations.indexOf(orgnaization);
          $scope.orgnaizations.splice(index, 1);
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
          $scope.country_model = [];
          $scope.city_model = [];
          $scope.skillId = skill.id;
          vm.ModalEditSkill = true;
          $scope.skill_name = skill.skill_name;
          $scope.skill_description = skill.skill_description;
          $scope.skill_level = skill.skill_level;
          if (skill.geographical_countries.length != 0) {
            SocialImpact.getCountries(skill.geographical_countries).then(function (response) {
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
          if (skill.geographical_cities.length != 0) {
            SocialImpact.getCities(skill.geographical_cities).then(function (response) {
              $scope.city_model = [];
              response.data.forEach(function (city) {
                $scope.city_model.push({id: city.id});
              });
            });
          }
          SocialImpact.getContact({skillId: skill.id, projectId: null, networkId: null}).then(function (response) {
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
        vm.closeModalEditSkill = function () {
          $scope.country_model = [];
          $scope.city_model = [];
          $scope.city_data = [];
          $scope.project_add_success = "";
          $scope.fields = [{id: 'field1'}];
          $scope.skill_name = "";
          $scope.skill_description = "";
          $scope.skill_level = "";
          vm.ModalEditSkill = false;
        };
        $scope.skills = [{
          id: 1,
          skill_name: '',
          skill_description: '',
          skill_level: '',
          contact_name: '',
          contact_email: '',
          contact_description: '',
          contact_anonymity: false,
          image: "",
          orgnaizations: [{id: 'orgnaization1'}],
          show_more_skill_btn: true
        }];
        SocialImpactNetwork.allUserSkills().then(function (response) {
          vm.all_user_skills = response.data;
        });
        // id of skill that needs to edit
        $scope.projectId = "";

        $scope.contact_name = "";
        $scope.contact_email = "";
        $scope.contact_description = "";
        $scope.contact_anonymity = false;

        $scope.skill_name = "";
        $scope.skill_description = "";
        $scope.skill_level = "";
        $scope.add_skill_form = function (skill) {
          skill.show_more_skill_btn = false;
          var newSkillNo = $scope.skills.length + 1;
          $scope.skills.push({
            id: newSkillNo,
            skill_name: '',
            skill_description: '',
            skill_level: '',
            contact_name: '',
            contact_email: '',
            contact_description: '',
            contact_anonymity: false,
            image: '',
            orgnaizations: [{id: 'orgnaization1'}],
            show_more_skill_btn: true
          });
        };
        $scope.removeSkill = function (skill) {
          var index = $scope.skills.indexOf(skill);
          $scope.skills.splice(index, 1);
        };
        // this function edit skill
        $scope.edit_skill = function () {
          var organizations = $scope.orgnaizations.map(function (a) {
            return a.name;
          });
          var formdata = {
            worldwide: JSON.stringify($scope.worldwide),
            citywide: JSON.stringify($scope.citywide),
            country_model: JSON.stringify($scope.country_model),
            city_model: JSON.stringify($scope.city_model),
            skillId: $scope.skillId,
            skill_name: $scope.skill_name,
            skill_description: $scope.skill_description,
            skill_level: $scope.skill_level,
            contactId: $scope.contactId,
            contact_name: $scope.contact_name,
            contact_email: $scope.contact_email,
            contact_description: $scope.contact_description,
            anonymity: $scope.contact_anonymity,
            orgnaizations: $scope.orgnaizations,
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
        // this function saves new skill
        $scope.add_skill = function () {
          $scope.skills.forEach(function (skill) {
            var organizations = skill.orgnaizations.map(function (a) {
              if (a.name != "") {
                return a.name;
              }
            });

            var formdata = new FormData();
            formdata.append('file', skill.image);
            formdata.append('worldwide', $scope.worldwide);
            formdata.append('citywide', $scope.citywide);
            formdata.append('country_model', JSON.stringify($scope.country_model));
            formdata.append('city_model', JSON.stringify($scope.city_model));
            formdata.append('category', vm.category_type);
            formdata.append('skill_name', skill.skill_name);
            formdata.append('skill_description', skill.skill_description);
            formdata.append('skill_level', skill.skill_level);
            formdata.append('contact_name', skill.contact_name);
            formdata.append('contact_email', skill.contact_email);
            formdata.append('anonymity', skill.contact_anonymity);
            formdata.append('contact_description', skill.contact_description);
            formdata.append('orgnaizations', JSON.stringify(organizations));
            formdata.append('file', skill.image);
            if (skill.skill_name.trim() != "" && skill.skill_description.trim() != "" &&
                $scope.country_model.length != 0 && ($scope.city_model.length != 0 || $scope.worldwide) &&
                skill.contact_name.trim() != "" && skill.contact_email.trim() != "" &&
                skill.contact_description.trim() != "") {
              SocialImpactNetwork.pledgeSkill(formdata).then(function (response) {
                Notification("Skill Added Successfully");
                skill.skill_name = '';
                skill.skill_description = '';
                skill.skill_level = '';
                skill.contact_name = '';
                skill.contact_email = '';
                skill.contact_description = '';
                skill.contact_anonymity = '';
                skill.orgnaizations = [{id: 'orgnaization1'}];
                skill.show_more_skill_btn = true;
              }, function (response) {
                Notification("Something went wrong");
              });
            } else if ($scope.country_model.length == 0) {
              Notification("Please select a geographical country / countries");
            } else if ($scope.city_model.length != 0 && !$scope.worldwide) {
              Notification("Please select a geographical city / cities");
            } else if (skill.skill_name.trim() == "") {
              Notification("Please enter skill name");
            } else if (skill.skill_description.trim() == "") {
              Notification("Please enter skill description");
            } else if (skill.contact_name.trim() == "") {
              Notification("Please enter contact person name");
            } else if (skill.contact_email.trim() == "") {
              Notification("Please enter contact person email");
            } else if (skill.contact_description.trim() == "") {
              Notification("Please write information about contact person (About me)");
            }

          });

        };
      });
})();
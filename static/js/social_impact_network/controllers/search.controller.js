/**
 * Created by waqas on 11/27/16.
 */

(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('SearchController', SearchController);

  SearchController.$inject = ['$state', '$scope', 'SocialImpact', 'SocialImpactNetwork'];

  /**
   * @namespace SearchController
   */
  function SearchController($state, $scope, SocialImpact, SocialImpactNetwork) {
    var vm = this;
    vm.loading = true;
    vm.mobile_device = false;
    var max_value = 0;

    var x = $(window).width();
    var platform = navigator.platform;

    if (x < 1000) {
      vm.mobile_device = true;
    } else {
      vm.mobile_device = false;
    }
    window.onresize = function (event) {
      var x = $(window).width();
      var platform = navigator.platform;
      if (x < 1000) {
        location.reload();
        vm.mobile_device = true;
      } else {
        vm.mobile_device = false;
      }
    };
    $scope.categorymodel = [];
    $scope.categorydata = [];
    $scope.categorysettings = {
      scrollableHeight: '230px',
      scrollable: true,
      enableSearch: true,
      smartButtonMaxItems: 1
    };
    $scope.search_type = 'Resources';
    $scope.category_settings_text = {buttonDefaultText: 'Category'};
    $scope.country_model = [];
    $scope.country_data = [];
    $scope.worldwide = false;
    $scope.city_model = [];
    $scope.city_data = [];
    $scope.Citywide = false;
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
    vm.all_countries = [];
    SocialImpactNetwork.getAllCountries().then(function (all_countries) {
      vm.all_countries = all_countries.data;
      $scope.country_data = [];
      vm.all_countries.forEach(function (country) {
        $scope.country_data.push({id: country.id, label: country.name})
      });
    });
    if (SocialImpactNetwork.isAuthenticated()) {
      SocialImpact.all_resources_search().then(function (response) {
        vm.loading = false;
        vm.result_categories = [];
        vm.projects = response.data.projects;
        vm.networks = response.data.networks;
        vm.skills = response.data.skills;
        vm.projects.forEach(function (project) {
          project.resource.resource_category.forEach(function (category) {
            if (vm.result_categories.indexOf(category.category_name) == -1) {
              vm.result_categories.push(category.category_name);
            }
          });
        });
        vm.networks.forEach(function (network) {
          network.resource.resource_category.forEach(function (category) {
            if (vm.result_categories.indexOf(category.category_name) == -1) {
              vm.result_categories.push(category.category_name);
            }
          });
        });
      });
    }
    $scope.get_cities = {
      onItemSelect: function (country) {
        search();
        SocialImpactNetwork.getCities(country).then(function (cities) {
          vm.cities = cities.data;
          vm.cities.forEach(function (city) {
            $scope.city_data.push({id: city.id, label: city.name, country: city.country})
          });
        });
      }, onItemDeselect: function (country) {
        search();
        $scope.city_model = [];
        $scope.city_data = $scope.city_data.filter(function (city) {
          return city.country !== country.id;
        });
      }, onDeselectAll: function () {
        $scope.worldwide = false;
        $scope.city_model = [];
        $scope.city_data = [];
        $scope.cities_drop_down = false;
        $scope.country_model = [];
        search();
      }, onSelectAll: function () {
        $scope.worldwide = true;
        $scope.city_model = [];
        $scope.city_data = [];
        $scope.cities_drop_down = true;
        search();
      }
    };
    $scope.cities_event = {
      onItemSelect: function () {
        search();
      }, onItemDeselect: function () {
        search();
      },
      onDeselectAll: function () {
        $scope.Citywide = false;
        $scope.city_model = [];
        search()
      }, onSelectAll: function () {
        $scope.Citywide = true;
        search()
      }
    };
    $scope.category_event = {
      onItemSelect: function () {
        search();
      }, onItemDeselect: function () {
        search();
      },
      onDeselectAll: function () {
        $scope.categorymodel = [];
        search()
      }, onSelectAll: function () {
        search()
      }
    };
    vm.search = search;
    vm.categories = [];
    SocialImpactNetwork.allCategories().then(function (all_categories) {
      vm.categories = all_categories.data;
      $scope.categorydata = [];
      vm.categories.forEach(function (category) {
        $scope.categorydata.push({id: category.id, label: category.category_name})
      });
      vm.categories.unshift({
        category_name: 'All'
      });
      vm.category = vm.categories[0];
    });

    vm.projects = [];
    vm.networks = [];
    vm.result_categories = [];
    vm.showModal = false;
    vm.searchText = "";
    vm.projectDetail = function (project) {
      vm.showModal = true;
      $state.go('search.projectDetail', {projectId: project.id})
    };

    vm.close = function () {
      vm.showModal = false;
    };

    /**
     * @name search
     * @desc search for a resource
     */
    function search() {
      vm.loading = true;
      var categories_selected = [];
      $scope.categorymodel.forEach(function (category) {
        vm.categories.forEach(function (category_object) {
          if (category_object.id == category.id) {
            categories_selected.push(category_object);
          }
        })
      });
      SocialImpact.search(vm.searchText, JSON.stringify(categories_selected), JSON.stringify($scope.country_model),
          JSON.stringify($scope.city_model))
          .then(function (response) {
            vm.loading = false;
            vm.result_categories = [];
            vm.projects = response.data.projects;
            vm.networks = response.data.networks;
            vm.skills = response.data.skills;
            vm.projects.forEach(function (project) {
              project.resource.resource_category.forEach(function (category) {
                if (vm.result_categories.indexOf(category.category_name) == -1) {
                  vm.result_categories.push(category.category_name);
                }
              });
            });
            vm.networks.forEach(function (network) {
              network.resource.resource_category.forEach(function (category) {
                if (vm.result_categories.indexOf(category.category_name) == -1) {
                  vm.result_categories.push(category.category_name);
                }
              });
            });
          });
    }
  }
})();
/**
 * Created by waqas on 12/8/16.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('ModerateController', ModerateController);

  ModerateController.$inject = ['$state', '$scope', '$stateParams',
    'SocialImpact', 'SocialImpactNetwork', 'Notification'];

  function ModerateController($state, $scope, $stateParams,
                              SocialImpact, SocialImpactNetwork, Notification) {
    var vm = this;
    vm.contact_responses = [];
    vm.lounge_area_requests = [];
    vm.contactResponse = {};
    vm.projectDetail = {};
    vm.answers = [];
    vm.questions = [];
    $scope.showModal = false;
    vm.goToContactRequestDetail = function (contactRequest) {
      $scope.showModal = true;
      SocialImpactNetwork.contactRequestDetail(contactRequest.question.project.id,
          contactRequest.user.id)
          .then(function (contactRequest) {
            vm.contactResponse = contactRequest.data;
            vm.projectDetail = contactRequest.data[0] || {};
            contactRequest.data.forEach(function (response) {
              vm.answers.push(response.answer);
            });
            contactRequest.data.forEach(function (response) {
              vm.questions.push([response.question.id, response.question.question])
            })
          });
    };

    $scope.close = function () {
      $scope.showModal = false;
    };

    /**
     * @name contactResponses
     * @desc Displays all the contact requests
     */
    SocialImpactNetwork.contactResponses()
        .then(function (response) {
          vm.contact_responses = response.data;
        });
    SocialImpactNetwork.loungeAreaRequests({'loungeAreaId': false}).then(function (response) {
      vm.lounge_area_requests = response.data;
    });
    /**
     * @name contactRequestDetail
     * @desc Displays detail for a particular contact request
     */
    vm.acceptRequest = function (request) {
      var data = {
        email: request.email,
        status: 'Joined',
        requestId: request.id
      };
      SocialImpactNetwork.updateLoungeAreaRequest(data).then(function (response) {
        request.status = 'Joined';
      });

    };
    vm.rejectRequest = function (request) {
      var data = {
        email: request.email,
        status: 'Reject',
        requestId: request.id
      };
      SocialImpactNetwork.updateLoungeAreaRequest(data).then(function (response) {
        request.status = 'Reject';
      });

    };
    vm.submit = function (status) {

      var formData = {};

      vm.questions.map(function (question, index) {
        formData[question[0]] = vm.answers[index] || ''
      });

      formData['projectId'] = vm.projectDetail.question.project.id;
      formData['moderate'] = true;
      formData['submittingUser'] = vm.projectDetail.user.id;
      formData['status'] = status;
      SocialImpact.submitAnswers(formData)
          .then(function (response) {

            SocialImpactNetwork.contactResponses()
                .then(function (request_response) {
                  vm.contact_responses = request_response.data;
                });
            $scope.showModal = false;
            Notification(response.data.message);
          })
    };

    vm.isAdmin = SocialImpactNetwork.isAdminUser();

  }

})();

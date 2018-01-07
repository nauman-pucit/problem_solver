/**
 * Created by nauman on 3/15/17.
 */
(function () {
  'use strict';

  angular
      .module('social_impact_network')
      .controller('LoungeAreaController', LoungeAreaController);

  LoungeAreaController.$inject = ['$state', '$scope', '$stateParams', 'SocialImpact', 'Authentication', 'Notification',
    'SocialImpactNetwork', '$interval', '$timeout'];

  function LoungeAreaController($state, $scope, $stateParams, SocialImpact, Authentication, Notification,
                                SocialImpactNetwork, $interval, $timeout) {
    var vm = this;
    vm.messages = [];
    vm.username = 'username1';
    vm.visible = true;
    vm.expandOnNew = true;
    vm.loungeAreaId = $stateParams.loungeAreaId;
    vm.loungeAreaName = "";
    vm.loungeAreaDescription = "";
    vm.lounge_area_members = [];
    vm.is_restricted = "";
    vm.name = "";
    vm.description = "";
    vm.not_found = false;
    vm.model_create_lounge = false;
    vm.emails = [{id: 'email'}];
    vm.user = {};
    vm.lounge_area_request = {};
    vm.is_admin_user = false;
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
        vm.mobile_device = true;
        location.reload();
      } else {
        vm.mobile_device = false;
      }
    };
    $scope.addNewEmail = function () {
      var newItemNo = vm.emails.length + 1;
      vm.emails.push({'id': 'email' + newItemNo, 'email': ''});
    };
    $scope.removeEmail = function (email) {
      var index = vm.emails.indexOf(email);
      vm.emails.splice(index, 1);
    };
    if (Authentication.isAuthenticated()) {
      vm.authenticated_account = $.parseJSON(Authentication.getAuthenticatedAccount());
    }
    SocialImpact.getLoungeArea($stateParams.loungeAreaId).then(function (response) {

      vm.loungeAreaName = response.data.name;
      vm.loungeAreaDescription = response.data.description;
      vm.is_restricted = response.data.is_restricted;

      if (vm.is_restricted) {
        if (vm.user.email == response.data.created_by.email) {
          vm.is_admin_user = true;
        }
        SocialImpactNetwork.loungeAreaRequests({'loungeAreaId': vm.loungeAreaId}).then(function (response) {
          vm.lounge_area_members = response.data;
        });
        SocialImpactNetwork.loungeAreaRequest({
          email: vm.user.email,
          loungeAreaId: vm.loungeAreaId
        }).then(function (response) {
          vm.lounge_area_request = response.data;
        });
      }
      vm.getChat();
    }, function (resonse) {
      vm.not_found = true;
    });

    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    // var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + window.location.pathname +vm.loungeAreaId);
    var chatsock = new WebSocket('ws://' + window.location.host + window.location.pathname + vm.loungeAreaId);
    chatsock.onmessage = function (message) {
      $timeout(function () {
        var data = JSON.parse(message.data);
        vm.messages.push({
          'username': data.sent_by.first_name + " " + data.sent_by.last_name,
          'content': data.message,
          'date': data.sent_time,
          'imageUrl': data.sent_by.avatar
        });
      });
    };

    vm.getChat = function () {
      SocialImpact.getChat({projectId: null, loungeAreaId: $stateParams.loungeAreaId}).then(function (chat) {

        chat.data.forEach(function (message) {
          vm.messages.push({
            'username': message.sent_by.first_name + " " + message.sent_by.last_name,
            'content': message.message,
            'date': message.sent_time,
            'imageUrl': message.sent_by.avatar
          });
        });
      });
    };

    if (Authentication.isAuthenticated()) {
      vm.user = $.parseJSON(Authentication.getAuthenticatedAccount());
    }

    vm.acceptRequest = function (request) {
      var data = {
        email: vm.lounge_area_request.email,
        status: 'Joined',
        requestId: vm.lounge_area_request.id
      };
      SocialImpactNetwork.updateLoungeAreaRequest(data).then(function (response) {
        vm.lounge_area_request.status = 'Joined';
        vm.lounge_area_members.push({
          'name': vm.user.name,
          'avatar': vm.user.avatar
        });
      });

    };
    vm.rejectRequest = function (request) {
      var data = {
        email: vm.lounge_area_request.email,
        status: 'Reject',
        requestId: vm.lounge_area_request.id
      };
      SocialImpactNetwork.updateLoungeAreaRequest(data).then(function (response) {
        vm.lounge_area_request.status = 'Reject';
        vm.lounge_area_requests = vm.lounge_area_requests.filter(function (el) {
          return el.lounge_area.id != vm.loungeAreaId;
        });
      });
    };
    vm.sendMessage = function (message, username) {
      if (message && message !== '' && username) {
        var data = {
          loungeAreaId: vm.loungeAreaId,
          projectId: null,
          message: message,
          email: vm.user.email
        };

        if (!vm.is_restricted || vm.lounge_area_request.status == 'Joined') {
          chatsock.send(JSON.stringify(data));
          // SocialImpact.sendMessage(data).then(function (message) {
          //   vm.messages.push({
          //     'username': message.data.sent_by.first_name + " " + message.data.sent_by.last_name,
          //     'content': message.data.message,
          //     'imageUrl': vm.user.avatar,
          //     'date': new Date()
          //   });
          // });
        } else if (vm.lounge_area_request.status == 'Pending') {
          Notification('Please join ' + vm.loungeAreaName + ' to start conversation');
        } else {
          Notification('You Cannot Join This Solutions Hub');
        }

      }
    };
    vm.add_member = "";
    vm.addMember = function () {
      SocialImpactNetwork.addLoungeAreaMember({'email': vm.add_member, 'loungeAreaId': vm.loungeAreaId})
          .then(function (response) {
            Notification("Join Request Sent Successfully");
            vm.add_member = "";
          });
    };
    SocialImpactNetwork.loungeAreaRequests({'loungeAreaId': false}).then(function (response) {
      vm.lounge_area_requests = response.data;
    });
    vm.showModelCreateLounge = function () {
      vm.model_create_lounge = true;
    };
    vm.closeModelCreateLounge = function () {
      vm.model_create_lounge = false;
    };
    vm.create = function () {
      if (vm.name.trim() == "") {
        Notification('Please Enter Solutions Hub Name');
      } else if (vm.description.trim() == "") {
        Notification('Please Enter Solutions Hub Description');
      } else {
        vm.emails = vm.emails.filter(function (el) {
          return el.email !== vm.user.email;
        });
        var data = {
          name: vm.name,
          description: vm.description,
          emails: vm.emails
        };
        SocialImpact.createLoungeArea(data).then(function (response) {
          Notification('Created Successfully');
          vm.name = "";
          vm.description = "";
          vm.model_create_lounge = false;
          vm.emails = [{id: 'email'}];
          SocialImpactNetwork.loungeAreaRequests({'loungeAreaId': false}).then(function (response) {
            vm.lounge_area_requests = response.data;
          });
        });
      }
    }
  }

})();

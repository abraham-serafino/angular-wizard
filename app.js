angular.module('wizardApp', ['ngMaterial', 'wizardExample'])

  .controller('wizardButtonCtrl', ['$mdDialog', '$scope',
      function ($mdDialog, $scope) {

    $scope.clients = [];

    $scope.showDialog = function () {

      $scope.client = { sex: '' };

      $mdDialog.show({
        parent: angular.element(document.body),
        autoWrap: false,
        scope: $scope,
        preserveScope: true,

        template:
          '<example-wizard height="195px" width="750px" datamodel="client">' +

          '  <wizard-step title="Client Name" name="name" next="sex"' +
          '      next-title="Change Sex">' +

          '    <md-input-container>' +
          '      <md-label>First Name</md-label>' +
          '      <input type="text" aria-label="first name"' +
          '        ng-model="client.firstName">' +
          '    </md-input-container>' +

          '    <md-input-container>' +
          '      <md-label>Last Name</md-label>' +
          '      <input type="text" aria-label="last name"' +
          '        ng-model="client.lastName">' +
          '    </md-input-container>' +
          '  </wizard-step>' +

          '  <wizard-step title="Client Sex" name="sex" previous="name"' +
          '      previous-title="Change Name" next="age"' +
          '      next-title="Change Age">' +

          '    <md-input-container>' +
          '      <md-select aria-label="sex" ng-model="client.sex">' +
          '        <md-select-header><span> Choose one - </span>' +
          '        </md-select-header>' +

          '        <md-option value="Male">Male</md-option>' +
          '        <md-option value="Female">Female</md-option>' +
          '      </md-select>' +
          '    </md-input-container>' +
          '  </wizard-step>' +

          '  <wizard-step title="Client Age" name="age" previous="sex"' +
          '      previous-title="Change Sex" include-finish="Save Client">' +

          '  <div layout="row">' +
//          '    <div layout="column">' +
          '      <input type="number" aria-label="age" min="0" max="130"' +
          '        ng-model="client.age">' +
//          '    </div>' +
          '  </div>' +

          '  </wizard-step>' +
          '</example-wizard>'

      }).then(function (data) {
        $scope.clients.push(data);

        console.log(data.firstName + ' ' + data.lastName);
        console.log($scope.clients[0].firstName + ' '
          + $scope.clients[0].lastName);
      });
    };

  }]);

angular.module('wizardExample', ['ngMaterial'])

  .component('exampleWizard', {
    transclude: true,

    bindings: {
      width: '@',
      height: '@',
      datamodel: '='
    },

    controller: function () {
      var steps = this.steps = [];

      console.log(this);

      this.select = function (name) {
        angular.forEach(steps, function (step) {
          step.selected = step.name === name;
        });
      };

      this.addStep = function (step) {

        if (steps.length === 0) {
          step.selected = true;
        }

        steps.push(step);
      };
    },

    template:
      '<md-dialog style="height: {{$ctrl.height}}; width: {{$ctrl.width}};"' +
      '  ng-transclude></md-dialog>'
  })

  .component('wizardStep', {
    transclude: true,

    require: {
      wizardCtrl: '^exampleWizard'
    },

    bindings: {
      name: '@',
      title: '@',
      next: '@',
      nextTitle: '@',
      previous: '@',
      previousTitle: '@',
      includeFinish: '@'
    },

    controller: ['$mdDialog', function ($mdDialog) {

      this.$onInit = function () {
        this.nextTitle = this.nextTitle || 'Next';
        this.previousTitle = this.previousTitle || 'Previous';
        this.finishText = this.includeFinish || 'Finish';

        this.hasNext = function() { return this.next !== undefined; };
        this.hasPrevious = function() { return this.previous !== undefined; };

        this.hasFinish = function() {
          return this.includeFinish !== undefined;
        };

        this.finish = function() {
          $mdDialog.hide(this.wizardCtrl.datamodel);
        };

        this.cancel = function() {
          $mdDialog.cancel(this.wizardCtrl.datamodel);
        };

        this.wizardCtrl.addStep(this);
      };
    }],

    template:
      '<h4 style="padding-left: 4%;" ng-show="$ctrl.selected" >' +
      '  {{$ctrl.title}}</h4>' +

      '<md-dialog-content class="wizard-content" ng-show="$ctrl.selected">' +
      '  <div style="padding-left: 4%;" ng-transclude></div>' +
      '</md-dialog-content>' +

      '<md-dialog-actions style="position: fixed; bottom: 10px;"' +
      '  ng-show="$ctrl.selected">' +

      '  <md-button ng-click="$ctrl.wizardCtrl.select($ctrl.previous)"' +
      '      ng-show="$ctrl.hasPrevious()">' +

      '    << {{$ctrl.previousTitle}}' +
      '  </md-button>' +

      '  <md-button ng-click="$ctrl.wizardCtrl.select($ctrl.next)"' +
      '      ng-show="$ctrl.hasNext()">' +

      '    {{$ctrl.nextTitle}} >>' +
      '  </md-button>' +

      '  <div style="position: fixed; right: 20px;">' +
      '    <md-button ng-click="$ctrl.cancel()"' +
      '      class="md-raised">Cancel</md-button>' +

      '    <md-button ng-show="$ctrl.hasFinish()"' +
      '        class="md-raised md-primary"' +
      '        ng-click="$ctrl.finish()">' +

      '      {{$ctrl.finishText}}' +
      '    </md-button>' +
      '  </div>' +

      '</md-dialog-actions>'
  });

angular.module('wizardApp', ['ngMaterial', 'wizardDirective'])

  .controller('wizardButtonCtrl', ['$mdDialog', '$scope',
      function ($mdDialog, $scope) {

    $scope.clients = [];

    $scope.showDialog = function () {

      $scope.client = { sex: 'Male' };

      $mdDialog.show({
        autoWrap: false,
        scope: $scope,
        preserveScope: true,

        template:
          '<wizard>' +

          '  <step title="Client Name" name="name" next="sex"' +
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
          '  </step>' +

          '  <step title="Client Sex" name="sex" previous="name"' +
          '      previous-title="Change Name" next="age"' +
          '      next-title="Change Age">' +

          '    <md-input-container>' +
          '      <md-label>Choose one -</md-label>' +
          '      <md-select aria-label="sex" ng-model="client.sex">' +
          '        <md-option value="Male">Male</md-option>' +
          '        <md-option value="Female">Female</md-option>' +
          '      </md-select>' +
          '    </md-input-container>' +
          '  </step>' +

          '  <step title="Client Age" name="age" previous="sex"' +
          '      previous-title="Change Sex" include-finish="Save Client">' +

          '    <md-input-container>' +
          '      <md-label>Age (enter a value between 0-130)</md-label>' +
          '      <input type="number" aria-label="age" min="0" max="130"' +
          '        ng-model="client.age">' +
          '    </md-input-container>' +

          '  </step>' +
          '</wizard>'

      }).then(function () {
        $scope.clients.push($scope.client);
      });

    };
  }]);

angular.module('wizardDirective', ['ngMaterial'])

  .component('wizard', {
    transclude: true,

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
      '<md-dialog flex="100" ng-transclude></md-dialog>'
  })

  .component('step', {
    transclude: true,

    require: {
      wizardCtrl: '^wizard'
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

        this.finish = $mdDialog.hide;
        this.cancel = $mdDialog.cancel;

        this.wizardCtrl.addStep(this);
      };
    }],

    template:
      '<md-dialog-content ng-show="$ctrl.selected">' +
        '<h4 layout="row" layout-align="center center">{{$ctrl.title}}</h4>' +
        '<md-divider></md-divider>' +
        '<div ng-transclude></div>' +
      '</md-dialog-content>' +

      '<md-dialog-actions ng-show="$ctrl.selected">' +
        '<md-button ng-click="$ctrl.wizardCtrl.select($ctrl.previous)"' +
            'ng-show="$ctrl.hasPrevious()">' +

          '<< {{$ctrl.previousTitle}}' +
        '</md-button>' +

        '<md-button ng-click="$ctrl.wizardCtrl.select($ctrl.next)"' +
            'ng-show="$ctrl.hasNext()">' +

          '{{$ctrl.nextTitle}} >>' +
        '</md-button>' +

        '<md-button ng-click="$ctrl.cancel()" class="md-raised">' +
          'Cancel</md-button>' +

        '<md-button ng-show="$ctrl.hasFinish()" class="md-raised md-primary"' +
            'ng-click="$ctrl.finish()">' +

          '{{$ctrl.finishText}}' +
        '</md-button>' +
      '</md-dialog-actions>'
  });

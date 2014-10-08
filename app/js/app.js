angular.module('app', [
    'resizer'
])

    .controller('AppCtrl', function AppCtrl($scope, $timeout, resizerService) {

        // get current values
        var params = resizerService.getParams(),
        lang = {
            register : 'Register listener',
            registered : 'Listener registered!',
            deregister : 'Deregister listener',
            deregistered : 'Listener deregistered!'
        },
        onResize = function (data) {
              
            $timeout(function(){
                $scope.breakpoint = data.breakpoint;
                $scope.orientation = data.orientation;
                $scope.directionX = data.direction.x;
                $scope.directionY = data.direction.y;    
            }, 1);

        };

        // $scope
        $scope.registered = false;
        $scope.registerButtonText = lang.register;
        $scope.deregisterButtonText = lang.deregistered;
        $scope.breakpoint = params.breakpoint;
        $scope.orientation = params.orientation;
        $scope.directionX = params.direction.x || 0;
        $scope.directionY = params.direction.y || 0;

        $scope.register = function(){
            resizerService.register('updateVars', onResize);
            $scope.registerButtonText = lang.registered;
            $scope.deregisterButtonText = lang.deregister;
            $scope.registered = true;
        };
        $scope.deregister = function(){
            resizerService.deregister('updateVars', onResize);
            $scope.registerButtonText = lang.register;
            $scope.deregisterButtonText = lang.deregistered;
            $scope.registered = false;
        };

        // update on resize
        $scope.register();


    });


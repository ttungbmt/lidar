var myApp;

myApp = angular.module('myApp', [
  'ngAutocomplete',
  'ui-leaflet'
]);

myApp.controller('myController', ['$scope', 'leafletData', '$timeout', function($scope, leafletData, $timeout){
  angular.extend($scope, {
    hcm: {
      lat: 10.792489,
      lng: 106.656661,
      zoom: 10
    },
    maxbounds: {
      northEast: {
        lat: 11.236193,
        lng: 107.266673
      },
      southWest: {
        lat: 10.349058,
        lng: 106.226371
      }
    },
    defaults: {
      minZoom: 10,
      zoomControlPosition: 'bottomright'
    },
    layers: {
      baselayers: {
        gray: {
          name: "Bản đồ Gray",
          type: "agsBase",
          layer: "Gray",
          visible: true
        }
      },
      overlays: {
        basegis: {
          name: "Bản đồ nền TP.HCM",
          type: "agsDynamic",
          url: "http://hcmgisportal.vn:6080/arcgis/rest/services/BaseMap_HCM/MapServer",
          visible: true
        },
        qtiles: {
          name: "Ảnh hàng không (Cache)",
          type: "xyz",
          url: "http://hcmgisportal.vn/basemap/cache_lidar/{z}/{x}/{y}.jpg",
          visible: false
        },
        trueorthor: {
          name: "Ảnh hàng không",
          type: "agsImage",
          url: "http://hcmgisportal.vn:6080/arcgis/rest/services/TRUEORTHOR_LIDAR/ImageServer",
          visible: false,
        }
      }
    }
  });





  leafletData.getMap().then(function(map){

    leafletData.getLayers().then(function(layers){
      var gray = layers.baselayers.gray;
      $scope.$watch('hcm.zoom', function(newValue){
        if (newValue > 13) {
          map.removeLayer(gray);
        } else {
          map.addLayer(gray);
        }
      });

    })
  })


  $scope.googleAutocomplete = {
    options: {
      country: 'vn',
      watchEnter: true
    }
  }

  $scope.findGoogle = function(){
    leafletData.getMap().then(function(map){
      if($scope.googleAutocomplete.result == ''){
        $scope.googleAutocomplete.details = null;
        //$rootScope.markers.geocode.geolocation = {};
        return;
      }

      if(!$scope.googleAutocomplete.details){
        return false;
      }
      var detail = $scope.googleAutocomplete.details;
      var location = detail.geometry.location;

      $scope.markers = {
        geolocation: {
          lat:location.lat(),
          lng:location.lng(),
          icon: {
            type: 'div',
            iconSize: [32,32],
            html: '<div class="pin1"><span class="circle-radar"></span><span class="circle-pin"></span></div>'
          },
        }
      }

      $timeout(function(){
        $scope.markers = {};
      },8000)

      map.setView([location.lat(), location.lng()], 16);
    })
  }




}])


angular.module('myApp').directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

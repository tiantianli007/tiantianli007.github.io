angular.module("app",['ui.directives', 'ui.filters', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngRoute']).
directive('myBackgroundImage', function () {
        return function (scope, body, attrs) {
            body.css({
                'background-image': 'url(' + attrs.myBackgroundImage + ')',
                    'background-size': 'cover',
                    'background-repeat': 'repeat-y',
                    'background-position': 'center center',
                    'height':'100%'
            });
        };
    }).
config(function($routeProvider){

})
.controller("ctrl",function($scope){
	$scope.type = ["Single Dwelling", "Apartment", "Townhouse"];
    $scope.occupancies = ["Store, Restaurant", "Office", "Industrial and Commercial", "Church", "Garage", "Storage Warehouse", "Theatre", "Armouries and Auditoriums", "Banks", "Barbershops and Beauty Parlours", "Clubs", "Courthouses", "Lodges"];
    $scope.voltages = [{ type: "120v/240v", val: 0.24 }, { type: "120v/208v", val: 0.208 }, { type: "347v/600v", val: 0.6 }];
    $scope.faces = [{ type: "single", val: 1 }, { type: "three", val: Math.sqrt(3) }];
    $scope.face = 1;
    $scope.voltage = 0.24;
    $scope.choice;
    $scope.apt_load = 0;
    $scope.apt_amp=0;
    $scope.range = false;
    $scope.area = 0;
    $scope.heating = 0;
    $scope.cooling = 0;
    $scope.range_power = 6;
    $scope.water_heater = 0;
    $scope.electric_vehicle = 0;
    $scope.additional = 0;
    $scope.apt_units = 0;
    $scope.space_load = 0;
    $scope.space_units = 0;
    $scope.kitchen = 0;
    $scope.elevator = 0;
    $scope.occupancy;
    $scope.external_power = 0;
    $scope.calculated = false;
    $scope.selection = false;
    $scope.suite_load;
    $scope.printer = false;
    $scope.address;
    $scope.building;
    $scope.details;
    $scope.other_factor = "Service";

    $scope.area_load = function() {
        if ($scope.area < 45 && $scope.choice == "Apartment") {
            return 3.5;
        } else if($scope.area < 90){
            return 5;
        }
        return 5 + Math.ceil(($scope.area-90) / 90);
    }

    $scope.occ_load = function() {
        if($scope.occupancy=="Store, Restaurant"){
            return $scope.area*0.03;
        } else if($scope.occupancy=="Office"){
            if($scope.area<=930){
                if($scope.other_factor == "Service"){
                    return $scope.area*0.05*0.9;
                } else {
                    return $scope.area*0.05;
                }
            } else {
                if($scope.other_factor == "Service"){
                    return 930*0.05*0.9 + ($scope.area-930)*0.05*0.7;
                } else {
                    return 930*0.05 + ($scope.area-930)*0.05;
                }
            }
        } else if($scope.occupancy=="Industrial and Commercial"){
            return $scope.area*0.025;
        } else if($scope.occupancy=="Church"){
            return $scope.area*0.01;
        } else if($scope.occupancy=="Garage"){
            return $scope.area*0.01;
        } else if($scope.occupancy=="Storage Warehouse"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.005*0.7;
            } else {
                return $scope.area*0.005*0.9;
            }   
        } else if($scope.occupancy=="Theatre"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.03*0.75;
            } else {
                return $scope.area*0.03*0.95;
            }
        } else if($scope.occupancy=="Armouries and Auditoriums"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.01*0.8;
            } else {
                return $scope.area*0.01;
            }
        } else if($scope.occupancy=="Banks"){
            return $scope.area*0.05;
        } else if($scope.occupancy=="Barbershops and Beauty Parlours"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.03*0.9;
            } else {
                return $scope.area*0.03;
            }
        } else if($scope.occupancy=="Clubs"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.02*0.8;
            } else {
                return $scope.area*0.02;
            }
        } else if($scope.occupancy=="Courthouses"){
            return $scope.area*0.02;
        } else if($scope.occupancy=="Lodges"){
            if($scope.other_factor == "Service"){
                return $scope.area*0.015*0.8;
            } else {
                return $scope.area*0.015;
            }
        } else {
            return 0;
        }
    }

    function heating_load() {
        if ($scope.heating > 10) {
            return 10 + ($scope.heating - 10) * 0.75;
        } else {
            return $scope.heating;
        }
    }

    function range_load() {
        if ($scope.range) {
            if ($scope.range_power > 12) {
                return 6 + ($scope.range_power - 12) * 0.4;
            } else {
                return 6;
            }
        } else {
            return 0;
        }
    }

    function additional_load() {
        if ($scope.range) {
            return $scope.additional * 0.25;
        } else {
            if ($scope.additional > 6) {
                return 6 + ($scope.additional - 6) * 0.25;
            } else {
                return $scope.additional;
            }
        }
    }

    function electric_vehicle() {
        if ($scope.space_units >= 1 && $scope.space_units <= 4) {
            return $scope.space_load * $scope.space_units;
        } else if ($scope.space_units >= 5 && $scope.space_units <= 8) {
            if ($scope.space_load<=4) {
                return $scope.space_load * $scope.space_units;
            } else {
                return $scope.space_load*0.9 * $scope.space_units;
            }
        } else if ($scope.space_units >= 9 && $scope.space_units <= 12) {
            if ($scope.space_load <= 2) {
                return $scope.space_load * $scope.space_units;
            } else if ($scope.space_load <= 6) {
                return $scope.space_load * 0.9 * $scope.space_units;
            } else {
                return $scope.space_load * 0.8 * $scope.space_units;
            }
        } else if ($scope.space_units >= 13 && $scope.space_units <= 16) {
            if ($scope.space_load <= 2) {
                return $scope.space_load * $scope.space_units;
            } else if ($scope.space_load <= 4) {
                return $scope.space_load * 0.9 * $scope.space_units;
            } else {
                return $scope.space_load * 0.8 * $scope.space_units;
            }
        } else if ($scope.space_units >= 17 && $scope.space_units <= 24) {
            if ($scope.space_load <= 2) {
                return $scope.space_load * $scope.space_units;
            } else if ($scope.space_load <= 4) {
                return $scope.space_load * 0.9 * $scope.space_units;
            } else if ($scope.space_load <= 6) {
                return $scope.space_load * 0.8 * $scope.space_units;
            } else {
                return $scope.space_load * 0.7 * $scope.space_units;
            }
        } else if ($scope.space_units >= 25) {
            if ($scope.space_load <= 2) {
                return $scope.space_load * $scope.space_units;
            } else if ($scope.space_load <= 4) {
                return $scope.space_load * 0.9 * $scope.space_units;
            } else {
                return $scope.space_load * 0.7 * $scope.space_units;
            }
        } else {
            return 0;
        }
    }

    $scope.calculate = function () {
        if($scope.choice=="Single Dwelling"){
            calculate_single_dwelling();
        } else if($scope.choice=="Apartment"){
            calculate_apt();
        } else if($scope.choice=="Townhouse"){
            calculate_townhouse();
        } else if($scope.choice=="Other"){
            calculate_other();
        }
    }

    function calculate_single_dwelling() {
        $scope.total = $scope.electric_vehicle + $scope.water_heater + additional_load() + range_load() + $scope.area_load() + Math.max(heating_load(),$scope.cooling);

        if ($scope.area >= 80) {
            $scope.total = Math.max($scope.total, 24);
        } else {
            $scope.total = Math.max($scope.total, 14.4);
        }
        $scope.calculated = true;
    }

    function calculate_apt() {
        $scope.total = $scope.water_heater + additional_load() + range_load() + $scope.area_load();

        if ($scope.apt_units < 1) {
            console.log("error");
        } else if ($scope.apt_units < 3) {
            $scope.apt_load = $scope.total + $scope.total * ($scope.apt_units - 1) * 0.65;
        } else if ($scope.apt_units < 5) {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * ($scope.apt_units - 3) * 0.4;
        } else if ($scope.apt_units < 20) {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * 2 * 0.40 + $scope.total * ($scope.apt_units - 5) * 0.25;
        } else {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * 2 * 0.40 + $scope.total * 15 * 0.25 + $scope.total * ($scope.apt_units - 20) * 0.1;
        }

        $scope.suite_load = ($scope.apt_load + Math.max(heating_load(), $scope.cooling) * $scope.apt_units)/($scope.voltage*$scope.face);
        $scope.apt_load += Math.max(heating_load(), $scope.cooling) * $scope.apt_units + $scope.external_power * 0.75 + electric_vehicle();
        $scope.apt_amp = $scope.apt_load/($scope.voltage*$scope.face);
        $scope.total += Math.max(heating_load(), $scope.cooling);
        $scope.total = $scope.total/($scope.voltage*$scope.face);

        if ($scope.total < 60) {
            $scope.total = 60;
        }
        $scope.calculated = true;
    }

    function calculate_townhouse() {
        $scope.total = $scope.electric_vehicle + $scope.water_heater + additional_load() + range_load() + $scope.area_load() + Math.max(heating_load(),$scope.cooling);

        if ($scope.area >= 80) {
            $scope.total = Math.max($scope.total, 24);
        } else {
            $scope.total = Math.min($scope.total, 14.4);
        }

        $scope.total -= Math.max(heating_load(),$scope.cooling);

        if ($scope.apt_units < 1) {
            console.log("error");
        } else if ($scope.apt_units < 3) {
            $scope.apt_load = $scope.total + $scope.total * ($scope.apt_units - 1) * 0.65;
        } else if ($scope.apt_units < 5) {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * ($scope.apt_units - 3) * 0.4;
        } else if ($scope.apt_units < 20) {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * 2 * 0.40 + $scope.total * ($scope.apt_units - 5) * 0.25;
        } else {
            $scope.apt_load = $scope.total + $scope.total * 2 * 0.65 + $scope.total * 2 * 0.40 + $scope.total * 15 * 0.25 + $scope.total * ($scope.apt_units - 20) * 0.1;
        }

        $scope.suite_load = ($scope.apt_load + Math.max(heating_load(), $scope.cooling) * $scope.apt_units)/($scope.voltage*$scope.face);
        $scope.apt_load += Math.max(heating_load(), $scope.cooling) * $scope.apt_units + $scope.external_power * 0.75 + electric_vehicle();
        $scope.apt_amp = $scope.apt_load/($scope.voltage*$scope.face);
        $scope.total += Math.max(heating_load(), $scope.cooling);
        $scope.total = $scope.total/($scope.voltage*$scope.face);

        $scope.calculated = true;
    }

    function calculate_other(){
        $scope.apt_load = ($scope.elevator + $scope.kitchen + $scope.additional)*0.8 + electric_vehicle() + $scope.occ_load() + Math.max(heating_load(),$scope.cooling);
        $scope.apt_amp = $scope.apt_load/($scope.voltage*$scope.face);

        $scope.calculated = true;
    }

    $scope.total_load = function() {
        return $scope.elevator + $scope.kitchen + $scope.additional + $scope.occ_load() + Math.max(heating_load(),$scope.cooling);
    }

    $scope.change = function (style) {
        $scope.choice = style;
        $scope.selection = true;

    }

    $scope.back = function () {
        $scope.selection = false;
        $scope.calculated=false;
    }

    // $scope.printer = function () {
    //     if($scope.choice=="Single Dwelling"){
    //         printlayer('single_dwelling_div');
    //     } else if($scope.choice=="Apartment"){
    //         printlayer('apt_div');
    //     } else if($scope.choice=="Townhouse"){
    //         printlayer('townhouse_div');
    //     } else if($scope.choice=="Other"){
    //         printlayer('other_div');
    //     }
    // }

    $scope.export = function(){
        if($scope.choice=="Single Dwelling"){
            exportHTML('single_dwelling_div');
        } else if($scope.choice=="Apartment"){
            exportHTML('apt_div');
        } else if($scope.choice=="Townhouse"){
            exportHTML('townhouse_div');
        } else if($scope.choice=="Other"){
            exportHTML('other_div');
        }
    }

    // function printlayer(layer){
    //     var generator=window.open(",'name,");
    //     var layetext= document.getElementById(layer);
    //     generator.document.write(layetext.innerHTML.replace("print Me"));

    //     generator.document.close();
    //     generator.print();
    //     generator.close();
    // }
    document.getElementById("date").innerHTML = Date();


    function exportHTML(element){
       var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
       var footer = "</body></html>";
       var sourceHTML = header+document.getElementById(element).innerHTML+footer;
       
       var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
       var fileDownload = document.createElement("a");
       document.body.appendChild(fileDownload);
       fileDownload.href = source;
       fileDownload.download = 'document.doc';
       fileDownload.click();
       document.body.removeChild(fileDownload);
    }
});

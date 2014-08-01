app.controller('graphsCtrl',function($scope,$http){

	// $http.get('js/data.json').success(function(data){

	// $scope.symptoms = data;

	// });


	window.scope = $scope;

	var multiplier = {
		stroke : {
			noTherapy : 1,
			aspirin : 0.81,
			vka : 0.36,
			noak : 0.29
		},
		ich : {
			noTherapy : 0.57,
			aspirin : 1.05,
			vka : 1,
			noak : 0.48
		},
		bleed : {
			noTherapy : 0.5,
			aspirin : 1.1,
			vka : 1,
			noak : 0.86
		}
	};

	

	//Conditions
	$scope.conditions = [
		{name : 'Age 65-74', selected : false, cha : 1, bleed : 1},
		{name : 'Age > 75', selected : false, cha : 2, bleed : 1},
		{name : 'Congestive Heart Failure', selected : false, cha : 1, bleed : 0},
		{name : 'Hypertension', selected : false, cha : 1, bleed : 1},
		{name : 'Diabetes', selected : false, cha : 1, bleed : 0},
		{name : 'Prior Stroke/TIA/Thromboembolism', selected : false, cha : 2, bleed : 1},
		{name : 'Vasculor Disease', selected : false, cha : 1, bleed : 0},
		{name : 'Female', selected : false, cha : 1, bleed : 0},
		{name : 'Abmormal renal function', selected : false, cha : 0, bleed : 1},
		{name : 'Abnormal liver function', selected : false, cha : 0, bleed : 1},
		{name : 'Prior major bleeding', selected : false, cha : 0, bleed : 1},
		{name : 'Hx of labile INR', selected : false, cha : 0, bleed : 1},
		{name : 'Current Excess of alcohol', selected : false, cha : 0, bleed : 1},
		{name : 'Taking antiplatelets or NSAIDs', selected : false, cha : 0, bleed : 1}
	];

	//Selected Conditions

	$scope.selection = [];


	// helper method to get selected conditions
	$scope.selectedConditions = function selectedCondtions() {
		return filterFilter($scope.conditions, { selected: true });
	};


	// watch conditions for changes
	$scope.$watch('conditions|filter:{selected:true}', function (nv) {

		if($scope.conditions[1].selected){
			$scope.conditions[0].selected = false;
		}

		$scope.selection = nv.map(function (condition) {
			return condition;
		});

		$scope.cha = 0;
		$scope.bleed = 0;

		for (var i = 0; i < $scope.selection.length; i++) {

			$scope.cha += $scope.selection[i].cha;
			$scope.bleed += $scope.selection[i].bleed;
		}
	}, true);


	var arrStrokeAndSEE = [0.69,1.51,3.01,4.41,6.69,10.42,12.85,13.92,14.07,16.08];
	var arrICHRate = [0.1,0.2,0.6,0.7,1.2,1.6];
	var arrMajorBleedRate = [0.37,0.6,1.15,1.73,2.7,3.233];

	$scope.$watch('selection',function(){
		// $scope.strokeRiskScore = $scope.selection.length;
		// $scope.bleedRiskScore = $scope.selection.length < 6 ? $scope.selection.length : 5;
		// $scope.ichRiskScore = $scope.selection.length < 6 ? $scope.selection.length : 5;

		var strokeBase = arrStrokeAndSEE[$scope.cha] * 5;
		// var ichBase = arrICHRate[$scope.bleed] * 5;
		var ichBase = $scope.bleed < 6 ? arrICHRate[$scope.bleed] * 5 : arrICHRate[4] * 5 ;
		// var bleedBase = arrMajorBleedRate[$scope.bleed] * 5;
		var bleedBase =  $scope.bleed < 6 ? arrMajorBleedRate[$scope.bleed] * 5 : arrMajorBleedRate[4] * 5 ;

		console.log(bleedBase+" "+ichBase);
		

		$scope.probabilityStroke = {
			noTherapy : strokeBase * multiplier.stroke.noTherapy + ichBase * multiplier.ich.noTherapy,
			aspirin : strokeBase * multiplier.stroke.aspirin + ichBase * multiplier.ich.aspirin,
			vka : strokeBase * multiplier.stroke.vka + ichBase * multiplier.ich.vka,
			noak : strokeBase * multiplier.stroke.noak + ichBase * multiplier.ich.noak
		};

		$scope.probabilityBleed = {
			noTherapy : 0,
			aspirin : 0,
			vka : 0,
			noak : 0
		};

		// console.log("strokebase: "+ strokeBase);
		// console.log("bleedbase: "+ bleedBase);
		// console.log("ichbase: "+ ichBase);

		// console.log(multiplier.ich.noTherapy);


		$scope.aspirinRadius = (120 * $scope.probabilityStroke.aspirin) / $scope.probabilityStroke.noTherapy;

		$scope.vkaRadius = (120 * $scope.probabilityStroke.vka) / $scope.probabilityStroke.noTherapy;

		$scope.noakRadius = (120 * $scope.probabilityStroke.noak) / $scope.probabilityStroke.noTherapy;

		console.log(Math.round($scope.probabilityStroke.noTherapy));

		_.each($scope.probabilityStroke, function(obj){
			console.log(Math.round(obj));
		});


		$scope.populationClass = {
			noTherapy : Math.round($scope.probabilityStroke.noTherapy),
			aspirin : Math.round($scope.probabilityStroke.aspirin),
			vka : Math.round($scope.probabilityStroke.vka),
			noak : Math.round($scope.probabilityStroke.noak)
		};



		// angular.element(document.querySelectorAll('.population')).addClass('hello');

		$('.population svg.no-therapy-man').attr('class','no-therapy-man');
		$('.population svg.aspirin-man').attr('class','aspirin-man');
		$('.population svg.vka-man').attr('class','vka-man');
		$('.population svg.noak-man').attr('class','noak-man');

		_.each(_.sample($('.population svg.no-therapy-man'),$scope.populationClass.noTherapy), function(num){
			num.setAttribute('class','no-therapy-man active');
		});

		_.each(_.sample($('.population svg.aspirin-man'),$scope.populationClass.aspirin), function(num){
			num.setAttribute('class','no-therapy-man active');
		});

		_.each(_.sample($('.population svg.vka-man'),$scope.populationClass.vka), function(num){
			num.setAttribute('class','no-therapy-man active');
		});

		_.each(_.sample($('.population svg.noak-man'),$scope.populationClass.noak), function(num){
			num.setAttribute('class','no-therapy-man active');
		});

	});


	

	


	$scope.number = 100;
	$scope.getNumber = function(num) {
	    return new Array(num);
	};

});
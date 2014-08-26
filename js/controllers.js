app.controller('graphsCtrl',function($scope,$http,$rootScope,$timeout){

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



	



	// $(".selections-toggle").click(function(){
	// 	alert("hello");
	// },false);

	

	//Conditions
	$scope.conditions = [
		{name : 'Congestive Heart Failure', selected : false, cha : 1, bleed : 0,cla:'congestive'},
		{name : 'Hypertension', selected : false, cha : 1, bleed : 1,cla:'hypertension'},
		{name : 'Age 65-74', selected : false, cha : 1, bleed : 1,cla:'betw'},
		{name : 'Age > 75', selected : false, cha : 2, bleed : 1,cla:'upto'},
		{name : 'Diabetes', selected : false, cha : 1, bleed : 0,cla:'diabetes'},
		{name : 'Prior Stroke/TIA/Thromboembolism', selected : false, cha : 2, bleed : 1,cla:'prior-stroke'},
		{name : 'Vascular Disease', selected : false, cha : 1, bleed : 0,cla:'vascular'},
		{name : 'Female', selected : false, cha : 1, bleed : 0,cla:'female'},
		{name : 'Abmormal renal function', selected : false, cha : 0, bleed : 1,cla:'abnormal-renal'},
		{name : 'Abnormal liver function', selected : false, cha : 0, bleed : 1,cla:'abnormal-liver'},
		{name : 'Prior major bleeding', selected : false, cha : 0, bleed : 1,cla:'prior-major'},
		{name : 'Hx of labile INR', selected : false, cha : 0, bleed : 1,cla:'hx'},
		{name : 'Current Excess of alcohol', selected : false, cha : 0, bleed : 1,cla:'current'},
		{name : 'Taking antiplatelets or NSAIDs', selected : false, cha : 0, bleed : 1,cla:'taking'}
	];

	//Selected Conditions

	$scope.selection = [];



	// helper method to get selected conditions
	$scope.selectedConditions = function selectedCondtions() {
		return filterFilter($scope.conditions, { selected: true });
	};


	// watch conditions for changes
	$scope.$watch('conditions|filter:{selected:true}', function (nv) {

		if($scope.conditions[3].selected){
			$scope.conditions[2].selected = false;
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

		// console.log(bleedBase+" "+ichBase);
		

		$scope.probabilityStroke = {
			noTherapy : strokeBase * multiplier.stroke.noTherapy + ichBase * multiplier.ich.noTherapy,
			aspirin : strokeBase * multiplier.stroke.aspirin + ichBase * multiplier.ich.aspirin,
			vka : strokeBase * multiplier.stroke.vka + ichBase * multiplier.ich.vka,
			noak : strokeBase * multiplier.stroke.noak + ichBase * multiplier.ich.noak
		};

		$scope.probabilityBleed = {
			noTherapy : bleedBase * 0.5,
			aspirin : bleedBase * 1.1,
			vka : bleedBase,
			noak : bleedBase * 0.86
		};



		$scope.radius = {
			stroke : {
				aspirin : (120 * $scope.probabilityStroke.aspirin) / $scope.probabilityStroke.noTherapy,
				vka : (120 * $scope.probabilityStroke.vka) / $scope.probabilityStroke.noTherapy,
				noak : (120 * $scope.probabilityStroke.noak) / $scope.probabilityStroke.noTherapy
			},
			bleed : {
				aspirin : (40 * $scope.probabilityBleed.aspirin) / $scope.probabilityBleed.noTherapy,
				vka : (40 * $scope.probabilityBleed.vka) / $scope.probabilityBleed.noTherapy,
				noak : (40 * $scope.probabilityBleed.noak) / $scope.probabilityBleed.noTherapy
			}
		};






		$scope.populationClass = {
			stroke : {
				noTherapy : Math.round($scope.probabilityStroke.noTherapy),
				aspirin : Math.round($scope.probabilityStroke.aspirin),
				vka : Math.round($scope.probabilityStroke.vka),
				noak : Math.round($scope.probabilityStroke.noak)
			},
			bleed : {
				noTherapy : Math.round($scope.probabilityBleed.noTherapy),
				aspirin : Math.round($scope.probabilityBleed.aspirin),
				vka : Math.round($scope.probabilityBleed.vka),
				noak : Math.round($scope.probabilityBleed.noak)
			}		
		};

	



		$scope.randomPopulation();


		

		// console.log(bleedBase * 0.5);
		// console.log(bleedBase * 1.1);
		// console.log(bleedBase);
		// console.log(bleedBase * 0.86);

	});

	


	$scope.randomPopulation = function(){
		

		(function(){
			

			var active = $('.stroke-population .population .no-therapy-man.active').length;
			var notActive = $('.stroke-population .population .no-therapy-man:not(.active)').length;

			var difference = $scope.populationClass.stroke.noTherapy - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomTherapy = _.sample($('.stroke-population .population .no-therapy-man:not(.active)'),difference);

				for (var i = 0; i < randomTherapy.length; i++) {
					randomTherapy[i].setAttribute('class','no-therapy-man active');
				}
			}else if(difference < 0){
				var randomTherapy = _.sample($('.stroke-population .population .no-therapy-man.active'),Math.abs(difference));

				for (var i = 0; i < randomTherapy.length; i++) {
					randomTherapy[i].setAttribute('class','no-therapy-man');
				}
			}

		})();


		(function(){
			

			var active = $('.stroke-population .population .aspirin-man.active').length;
			var notActive = $('.stroke-population .population .aspirin-man:not(.active)').length;

			window.difference = $scope.populationClass.stroke.aspirin - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomAspirin = _.sample($('.stroke-population .population .aspirin-man:not(.active)'),difference);

				for (var i = 0; i < randomAspirin.length; i++) {
					randomAspirin[i].setAttribute('class','aspirin-man active');
				}
			}else if(difference < 0){
				var randomAspirin = _.sample($('.stroke-population .population .aspirin-man.active'),Math.abs(difference));

				for (var i = 0; i < randomAspirin.length; i++) {
					randomAspirin[i].setAttribute('class','aspirin-man');
				}
			}

		})();


		(function(){
			

			var active = $('.stroke-population .population .vka-man.active').length;
			var notActive = $('.stroke-population .population .vka-man:not(.active)').length;

			var difference = $scope.populationClass.stroke.vka - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomVka = _.sample($('.stroke-population .population .vka-man:not(.active)'),difference);

				for (var i = 0; i < randomVka.length; i++) {
					randomVka[i].setAttribute('class','vka-man active');
				}
			}else if(difference < 0){
				var randomVka = _.sample($('.stroke-population .population .vka-man.active'),Math.abs(difference));

				for (var i = 0; i < randomVka.length; i++) {
					randomVka[i].setAttribute('class','vka-man');
				}
			}

		})();


		(function(){
			

			var active = $('.stroke-population .population .noak-man.active').length;
			var notActive = $('.stroke-population .population .noak-man:not(.active)').length;

			var difference = $scope.populationClass.stroke.noak - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomNoak = _.sample($('.stroke-population .population .noak-man:not(.active)'),difference);

				for (var i = 0; i < randomNoak.length; i++) {
					randomNoak[i].setAttribute('class','noak-man active');
				}
			}else if(difference < 0){
				var randomNoak = _.sample($('.stroke-population .population .noak-man.active'),Math.abs(difference));

				for (var i = 0; i < randomNoak.length; i++) {
					randomNoak[i].setAttribute('class','noak-man');
				}
			}

		})();



		(function(){
			

			var active = $('.bleed-population .population .no-therapy-man.active').length;
			var notActive = $('.bleed-population .population .no-therapy-man:not(.active)').length;

			var difference = $scope.populationClass.bleed.noTherapy - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomTherapy = _.sample($('.bleed-population .population .no-therapy-man:not(.active)'),difference);

				for (var i = 0; i < randomTherapy.length; i++) {
					randomTherapy[i].setAttribute('class','no-therapy-man active');
				}
			}else if(difference < 0){
				var randomTherapy = _.sample($('.bleed-population .population .no-therapy-man.active'),Math.abs(difference));

				for (var i = 0; i < randomTherapy.length; i++) {
					randomTherapy[i].setAttribute('class','no-therapy-man');
				}
			}

		})();


		(function(){
			

			var active = $('.bleed-population .population .aspirin-man.active').length;
			var notActive = $('.bleed-population .population .aspirin-man:not(.active)').length;

			window.difference = $scope.populationClass.bleed.aspirin - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomAspirin = _.sample($('.bleed-population .population .aspirin-man:not(.active)'),difference);

				for (var i = 0; i < randomAspirin.length; i++) {
					randomAspirin[i].setAttribute('class','aspirin-man active');
				}
			}else if(difference < 0){
				var randomAspirin = _.sample($('.bleed-population .population .aspirin-man.active'),Math.abs(difference));

				for (var i = 0; i < randomAspirin.length; i++) {
					randomAspirin[i].setAttribute('class','aspirin-man');
				}
			}

		})();


		(function(){
			

			var active = $('.bleed-population .population .vka-man.active').length;
			var notActive = $('.bleed-population .population .vka-man:not(.active)').length;

			var difference = $scope.populationClass.bleed.vka - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomVka = _.sample($('.bleed-population .population .vka-man:not(.active)'),difference);

				for (var i = 0; i < randomVka.length; i++) {
					randomVka[i].setAttribute('class','vka-man active');
				}
			}else if(difference < 0){
				var randomVka = _.sample($('.bleed-population .population .vka-man.active'),Math.abs(difference));

				for (var i = 0; i < randomVka.length; i++) {
					randomVka[i].setAttribute('class','vka-man');
				}
			}

		})();


		(function(){
			

			var active = $('.bleed-population .population .noak-man.active').length;
			var notActive = $('.bleed-population .population .noak-man:not(.active)').length;

			var difference = $scope.populationClass.bleed.noak - active;


			//if number is positive loop through the non-active else if negative loop through the active
			if (difference > 0) {
				var randomNoak = _.sample($('.bleed-population .population .noak-man:not(.active)'),difference);

				for (var i = 0; i < randomNoak.length; i++) {
					randomNoak[i].setAttribute('class','noak-man active');
				}
			}else if(difference < 0){
				var randomNoak = _.sample($('.bleed-population .population .noak-man.active'),Math.abs(difference));

				for (var i = 0; i < randomNoak.length; i++) {
					randomNoak[i].setAttribute('class','noak-man');
				}
			}

		})();


	}


	$scope.number = 100;
	$scope.getNumber = function(num) {
		return new Array(num);
	};

	$rootScope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){

		if (toState.name === 'graphs.population') {
			$timeout($scope.randomPopulation,500);
		}

	});



});
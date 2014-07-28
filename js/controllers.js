app.controller('testCtrl',function($scope,$http){

	// $http.get('js/data.json').success(function(data){

	// $scope.symptoms = data;

	// });


	window.scope = $scope;

	

	//Conditions
	$scope.conditions = [
		{name : 'Age 65-74', selected : false},
		{name : 'Age > 75', selected : false},
		{name : 'Congestive Heart Failure', selected : false},
		{name : 'Hypertension', selected : false},
		{name : 'Diabetes', selected : false},
		{name : 'Prior Stroke/TIA/Thromboembolism', selected : false},
		{name : 'Vasculor Disease', selected : false},
		{name : 'Female', selected : false},
		{name : 'Abmormal renal function', selected : false},
		{name : 'Abnormal liver function', selected : false},
		{name : 'Prior major bleedinge', selected : false},
		{name : 'Prior major bleeding', selected : false},
		{name : 'Hx of labile INR', selected : false},
		{name : 'Current Excess of alcohol', selected : false},
		{name : 'Taking antiplatelets or NSAIDs', selected : false}
	];

	//Selected Conditions

	$scope.selection = [];


	// helper method to get selected conditions
	$scope.selectedConditions = function selectedCondtions() {
		return filterFilter($scope.conditions, { selected: true });
	};


	// watch conditions for changes
	$scope.$watch('conditions|filter:{selected:true}', function (nv) {
		$scope.selection = nv.map(function (condition) {
			return condition.name;
		});
	}, true);


	

	$scope.$watch('selection',function(){
		$scope.CHA = $scope.selection.length;
	});

	var arrStrokeAndSEE = [0.69,1.51,3.01,4.41,6.69,10.42,12.85,13.92,14.07,16.08];
	var arrICHRate = [0.1,0.2,0.6,1.15,1.73];


});
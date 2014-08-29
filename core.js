(function(){
var app = angular.module('myApp',[]);

app.controller('GetController',['$scope','$http',function($scope,$http) {
loadData();

	$scope.refresh=function(){
	loadData();
	}
    function loadData(){
    $scope.newEvent={
		title: '',
		location:'',
		description:'',
		to: '',
		from: '',
		owner: 'Oluwatoni F.',
		participants: ''
		};
    $scope.evtry=false;
    $scope.filled=false;
    $http.get('http://localhost:7000/events') 
        .success(function(data){ 
        $scope.events=data;
        //text box
		var finalData =$.map($scope.events, function(item) {
			  return {
				   label:item.title,
				   value:item.title,
				   title:item.title,
				   location:item.location,
				   to:item.to,
				   from:item.from,
				   description:item.description,
				   participants:item.participants,
				   id_num: item._id  	   	   
			}
		   });
		$("#search").autocomplete({
				  source: finalData,
				  select: function(event, ui) {
				  $scope.$apply(function(){
				  	  $scope.filled=true;
					  $scope.title=ui.item.title;
					  $scope.location=ui.item.location;
					  $scope.from=ui.item.from;
					  $scope.to=ui.item.to;
					  $scope.description=ui.item.description;
					  $scope.participants=ui.item.participants;
					  $scope.id_num=ui.item.id_num;
					})
						 }
					});
		})
		.error(function(data){ alert("Angular Cannot Connect to REST API Server"); });
		}
	
	  $('#post').click(function() {
	   $scope.$apply(function(){
	  $scope.evtry=true;
	  $scope.filled=false;
	  });
});

  $('#delete').click(function() {
 $http.delete('http://localhost:7000/events/'+$scope.id_num)
        .success(function(data){ 
        alert("You have successfully deleted an event");
		})
		.error(function(data){ alert("Angular Cannot Connect to REST API Server"); });
	  loadData();
});

$scope.create = function () {
$http.post('http://localhost:7000/events',$scope.newEvent)
        .success(function(data){ 
        alert("You have successfully created an event");
        $scope.evtry=false;
	  	$scope.filled=false;
	  	$scope.refresh();
		})
		.error(function(data){ alert("Angular Cannot Connect to REST API Server"); });
};


}]);


app.controller('Change',['$scope','$http',function($scope,$http){

    

}]);



})();
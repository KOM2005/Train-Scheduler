  // Initialize Firebase
  var config = {
  	apiKey: "AIzaSyB7KmbQkeaTff6nykKIq08tJDBUcLZzga8",
  	authDomain: "train-scheduler-20b27.firebaseapp.com",
  	databaseURL: "https://train-scheduler-20b27.firebaseio.com",
  	projectId: "train-scheduler-20b27",
  	storageBucket: "",
  	messagingSenderId: "881430495281"
  };
  firebase.initializeApp(config);

// reference the database
var database = firebase.database();

//  Button Click
$("#submitTrain").on("click", function() {

	//variables to hold user input
	var trainNameInput = $('#trainNameInput').val().trim();
	var destinationInput = $('#destinationInput').val().trim();
	var startTimeInput = $('#startTimeInput').val().trim();
	var frequencyInput = $('#frequencyInput').val().trim();


	//if the input is not empty
	if( trainNameInput != "" &&
		destinationInput != "" &&
		startTimeInput != "" &&
		frequencyInput != "" ){
	//push the data to firebase
database.ref().push({
	trainName: trainNameInput,
	destination: destinationInput,
	startTime: startTimeInput,
	frequency: frequencyInput
});  
$("#submitTrain").value = '';
}
	//otherwise don't submit
	else {
		return false;
	}

	// Don't refresh the page!
	return false;
});

// auto-refresh page every 1 min
function AutoRefresh( t ) {
	setTimeout("location.reload(true);", t);
}

//Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function(childSnapshot) {

	//create rows to display the database values
	var $trainBody = $('#trainRows');
	var $trainRow = $('<tr>');
	var $trainName = $('<td>').html(childSnapshot.val().trainName).appendTo($trainRow);
	var $destination = $('<td>').html(childSnapshot.val().destination).appendTo($trainRow);
	var $frequency = $('<td>').html(childSnapshot.val().frequency).appendTo($trainRow);	
	
	var frequency = childSnapshot.val().frequency;
	var startTime = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");		
	var minAway = frequency - (moment().diff(moment(startTime), "minutes") % frequency);
	
	var nextTrain = $('<td>').html(moment(moment().add(minAway, "minutes")).format("hh:mm")).appendTo($trainRow);
	var minutesAway = $('<td>').html(minAway).appendTo($trainRow);
	
	$trainRow.appendTo($trainBody);


// Handle the errors
}, function(errorObject) {

	console.log("Errors handled: " + errorObject.code);
});
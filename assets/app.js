$(document).ready(function() {
// firebase setup
    var config = {
        apiKey: "AIzaSyD3qaeVm3kGkHbpae_154O8FVNSya1QB5w",
        authDomain: "train-activity-ed2f6.firebaseapp.com",
        databaseURL: "https://train-activity-ed2f6.firebaseio.com",
        projectId: "train-activity-ed2f6",
        storageBucket: "train-activity-ed2f6.appspot.com",
        messagingSenderId: "521413907469"
      };
      firebase.initializeApp(config);

// variable to reference database
var database = firebase.database();

// collect input from form   
$('#submit-info').on('click', function(event) {
    event.preventDefault();
    var trainNameInput = $('#train-name').val().trim();
    var destinationInput = $('#train-dest').val().trim();
    var timeInput = $('#train-time').val().trim();
    var frequencyInput = $('#frequency').val().trim();

// create object for new info
    var newTrain = {
        name: trainNameInput,
        destination: destinationInput,
        time: timeInput,
        frequency: frequencyInput,
    };
    
// send data to firebase
database.ref().push(newTrain);

console.log("OBJECT TRAIN: " + newTrain.name);
console.log("OBJECT DEST: " + newTrain.destination);
console.log("OBJECT TIME: " + newTrain.time);
console.log("OBJECT FREQ: " + newTrain.frequency);

alert("New train added");

$("#train-name").val("");
  $("#train-dest").val("");
  $("#train-time").val("");
  $("#frequency").val("");
});

// Add info to the train table using firebase
  database.ref().on("child_added", function(childSnapshot) {
    console.log("childsnapshot: " + childSnapshot.val());

    var trainNameInput = childSnapshot.val().name;
    var destinationInput = childSnapshot.val().destination;
    var timeInput = childSnapshot.val().time;
    var frequencyInput = childSnapshot.val().frequency;

    console.log("TRAIN INPUT: " + trainNameInput);
    console.log("DESTINATION INPUT: " + destinationInput);
    console.log("START TIME: " + timeInput);
    console.log("FREQUENCY INPUT: " + frequencyInput);

// math for next arrival
// first train time + frequncy in relation to current time equals next arrival
var newStartTime = moment(timeInput, "hh:mm").subtract(1, "years");
console.log("NEW START TIME: " + newStartTime);
console.log("TRAIN TIME: " + timeInput);


// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(newStartTime), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % frequencyInput;
console.log('TIME APART REMAINDER ' + tRemainder);

// Minute Until Train
var tMinutesTillTrain = frequencyInput - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train

var catchTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(catchTrain).format("hh:mm"));
var nextTrain = moment(catchTrain).format("HH:mm");

// Create the new rows
var newRow = $("<tr>").append(
    $('<td>').text(trainNameInput),
    $('<td>').text(destinationInput),
    $('<td>').text(frequencyInput),
    $('<td>').text(nextTrain),
    $('<td>').text(tMinutesTillTrain),
);
$("#train-table > tbody").append(newRow);
  });

});

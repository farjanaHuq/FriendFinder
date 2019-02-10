$( document ).ready(function() {
    console.log("Survey");

      
  var possibleFriends = [];
  var userScoreArr = [];
  var scoreDiff = [];
  
  //getting JSON data using AJAX library
  $.ajax({ url: "/api/friends", method: "GET" })
         .then(function(data) {
        // console.log(data);
       
        //looping through friends data
         data.forEach(elem => {
             possibleFriends.push(elem);
        });     
  }); 

  //event listener for submit button
  $("#submit-survey").on("click", function(event) {
      event.preventDefault();

      // The newFriend object stores the form elements
      var newFriend = {
         name: $("#name").val().trim(),
         photo: $("#photo").val().trim(),
         scores: []
         }
         for (var i = 0; i < 10; i++) {
               newFriend.scores.push($(`#answer-${i}`).val().trim())
         }
         console.log("-----------------------------------");
         console.log(newFriend);
      
      //Storing user answers to the userScoreArr
      for(var i = 0; i<10; i++){
            var answer = (Number($(`#answer-${i}`).val()));
            userScoreArr.push(answer);
         }
         
      //callback getScore function
      getScore(userScoreArr);
      
      //sorting the scoreDiff array by ascending order of friend with lowest score difference
      scoreDiff.sort(compare);
       
       // set user with the lowest difference  to  a new variable 'selectedFriend'
       var selectedFriend = scoreDiff[0].name;

      // find the index in the potentialFriends array with that user's name
       var i = possibleFriends.findIndex(elem => elem.name === selectedFriend);

      // show the modal and set its html content to the chosen friend's name/picture
       $('#suggested-friend-modal-body').html(`
           <p>${possibleFriends[i].name}!</p>
           <img id= "img-id" src="${possibleFriends[i].photo}" alt="${possibleFriends[i].name}">
       `);
       $('#suggested-friend-modal').modal('show');

      //posts data that has been submitted to the survey on the api/friends route
       $.post("/api/friends", newFriend,
            function(data) {

            // If a friends data is available, then updates the friend data log.
            if (data) {
               alert("Data has been updated!");
            }
            else {
               alert("Unable to post data :-(");
            }
            // Clear the form when submitting
            $("#name-input").val("");
            $("#photo-input").val("");
            for (var i = 0; i < 10; i++) {
                  $(`#answer-${i}`).val("1");
               }
        });
       
     });


 

    //callback function to calculate the difference in scores between new user and friend from friendlist array.
    function getScore(userScoreArr){
       
      console.log("-----------------------------------");
      console.log("User Score Array: " +userScoreArr);

      //looping through friends data
      possibleFriends.forEach(elem => {
        // push a new object to scoreDiffs array with a name key and totalDiff key
              scoreDiff.push({
                 name: elem.name,
                 totalDiff: 0
             });
       //Calculating the difference between userAnswer and the answer from friendsArray
        for(var i=0; i<elem.scores.length; i++){
                    var friendScore = Number(elem.scores[i]);
                    var userScore = Number(userScoreArr[i]);
                    //console.log("Scores: " + friendScore, userScore);
                    var difference = Math.abs(friendScore - userScore);
                   // console.log("Difference type : " + typeof (difference)+ difference);
                    scoreDiff[scoreDiff.length-1].totalDiff += difference;
              }     
         }); 
      }
     
     
      //call back function to compare the string properties betweem arrays
      function compare(a,b){
            var x = a.totalDiff;
            var y = b.totalDiff;
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
      }
      
       

       // show the modal and set its html content to the chosen friend's name/picture
      //  $('#suggested-friend-modal-body').html(`
      //      <p>${potentialFriends[i].name}!</p>
      //      <img src="${potentialFriends[i].photo}" alt="${potentialFriends[i].name}">
      //  `);
      //  $('#suggested-friend-modal').modal('show');
         
  });
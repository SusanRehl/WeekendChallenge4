$( document ).ready(function(){  // sets document for jQuery
  showList();  // calls showlist function to get tasks from database and send to DOM

  $('#addButton').on('click', function(){  // get task name from input
    var taskName = $('#taskIn').val();
    var taskStatus = false;  // sets taskstatus to false (not completed)
    var newTask = {  // creates object to send
      "taskname": taskName,
      "taskstatus": taskStatus,
    }; // end object
    $.ajax({    //send new task to database
      type: 'POST',
      url: '/addTask',
      data: newTask,
      success: function(data){
            showList();  // calling showList function to refresh DOM
      }
    }); //end ajax
    clearInput(); // calls clearInput function to clear value of text input box
  }); //end button on click function

  function clearInput() {  // clears data from input box
      document.getElementById('taskIn').value='';
    }   // end of clearinput box

function showList(){ // get to do list from database and appends to outputDiv
    $.ajax({
      type: 'GET',
      url: '/getList',
      success: function(dataIn){
        $('#outputDiv').empty();  // resets div to empty
        for(i=0; i<dataIn.length; i++) {  //loop thru database
          var completedButton = "";
          var taskOut = "";
          var deleteButton = "<button class='delete' data-id='" + dataIn[i].id + "'>&#10006;" + "</button>";
          if (dataIn[i].taskstatus === true) {  // adds class done and disables to completed tasks
            completedButton = "<button class='complete done' disabled data-id='" + dataIn[i].id + "'>&#10003;" + "</button>";
            taskOut = "<p class='doneTask'>" + dataIn[i].taskname;  // adds class doneTask to taskname
            } else {
            completedButton = "<button class='complete' data-id='" + dataIn[i].id + "'>&#10003;" + "</button>";
            taskOut = "<p>" + dataIn[i].taskname;
            }
          $('#outputDiv').append(completedButton);  // sends all to DOM
          $('#outputDiv').append(deleteButton);
          $('#outputDiv').append(taskOut);
        }
      } // end success
    }); //end ajax call to get list
  }// end show list function

  $('body').on('click', '.delete', function() {  // delete task function
    var delClick = confirm('Are you sure?');  // alert box if completed box is checked
      if(delClick === true) {
    $('#outputDiv').empty();  // if yes, then proceeds with function
    var taskID = {
      "id": $(this).data('id')
    };
    $.ajax({  // sends to delete from database
      type: 'POST',
      url: '/deleteTask',
      data: taskID,
      success: function(data) {
        showList(data);
      }
    });
  } else {  // if no, stops function
  }
  });
  $('body').on('click', '.complete', function() {  // complete task function
    // $('#outputDiv').empty();
    console.log($(this).data('id'));
    $('#outputDiv').empty();
    var taskID = {
      "id": $(this).data('id')
    };
    $.ajax({  // sends to delete from database
      type: 'POST',
      url: '/statusComplete',
      data: taskID,
      success: function(data) {
        showList(data);
      }
    });
  });

}); // end document ready

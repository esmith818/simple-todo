Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // Show newest tasks first
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date(), 				// current time
        owner: Meteor.userId(),           	// _id of logged in user
  		  username: Meteor.user().username 	// username of logged in user
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
	  Session.set("hideCompleted", event.target.checked);
	},
	"click .selectall-checked": function (event) {
      Tasks.find().collection.update({}, {$set: {checked: event.target.checked}},{multi: true});
  }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.find().collection.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  Template.body.helpers({
  	tasks: function () {
	    if (Session.get("hideCompleted")) {
	      // If hide completed is checked, filter tasks
	      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
	    } else {
	      // Otherwise, return all of the tasks
	      return Tasks.find({}, {sort: {createdAt: -1}});
	    }
	  },
   	hideCompleted: function () {
	    return Session.get("hideCompleted");
	},
	doneCount: function () {
		var checked = Tasks.find({checked: true});
		var done = 0;
		done = checked.count();
		return done;
	},
	incompleteCount: function () {
		var result = Tasks.find({}).count();
		var incompleteCount = Tasks.find({checked: false});
		result = incompleteCount.count();
		return result;
	}
	});

  Template.task.helpers({
      date: function(){
      	function pad(num,pad){
      		var num = num.toString().split('');
      		while (num.length < pad){
      			num.unshift('0');
      		}
      		return num.join('');
      	}
        var date = this.createdAt;
        // date
        var month = ["January",
                     "February",
                     "March",
                     "April",
                     "May",
                     "June",
                     "July",
                     "August",
                     "September",
                     "October",
                     "November",
                     "December"][date.getMonth()];
        var result = [month, date.getDay(), date.getFullYear()].join(" ");
        
        // time
        var hr = date.getHours();
        var md = (hr > 11) ? "PM" : "AM";
        hr = hr%12 || 12;
        var min = pad(date.getMinutes(),2);
        var time = hr + ":" + min + ' ' + md;
        
        result += " at " + time;
        return result;
      }
  });

	Accounts.ui.config({
	  passwordSignupFields: "USERNAME_ONLY"
	});
}
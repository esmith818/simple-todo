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
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  Template.task.helpers({
      date: function(){
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
        var day = date.getDay();
        var year = date.getFullYear();
        var result = [month, day, year].join(" ");
        // time
        var hr = date.getHours();
        var md = (hr > 11) ? "PM" : "AM";
        hr = hr%12 || 12;
        var min = date.getMinutes();
        var time = hr + ":" + min + ' ' + md;
        
        result += " at " + time;
        return result;
      }
  });
}
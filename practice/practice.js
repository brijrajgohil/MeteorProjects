this.Documents = new Mongo.Collection("documents");



if (Meteor.isClient) {
  // counter starts at 0
  Template.editor.helpers({
      docid: function() {
          return Documents.findOne()._id;
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(!Documents.findOne) {
        Documents.insert({ title: "my new document"});
    }
  });
}

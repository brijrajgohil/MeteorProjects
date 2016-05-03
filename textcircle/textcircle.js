this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

if (Meteor.isClient) {

    Template.editor.helpers({
        docid: function() {
            setupCurrentDocument();
            return Session.get("docid");
        },

        config: function() {
            return function(editor) {
                editor.setOption("lineNumbers", true);
                editor.setOption("theme", "cobalt");
                editor.on("change", function(cm_editor, info) {
                    $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
                    Meteor.add("addEditingUser");
                });
            }
        }

    });

    Template.editingUsers.helpers({
        users: function() {
            var doc, eusers, users;
            doc = Documents.findOne();
            if(!doc) {return;}
            eusers = EditingUsers.findOne({docid: doc._id});
            if(!eusers) {return;}
            var users = new Array();
            var i = 0;
            for(var user_id in eusers.users) {
                users[i] = fixedObjectKeys(eusers.users[user_id]);
                i++;
            }
            return users;
        }
    });

    Template.navbar.helpers({
        documents: function() {
            return Documents.find();
        }
    });


    /////////////
    // EVENTS //
    ////////////

    Template.navbar.events({
        "click .js-add-doc": function(event) {
            event.preventDefault();
            if(!Meteor.user()) {
                alert("You need to login");
            }
            else {
                var id = Meteor.call("addDoc", function(err, res) {
                    if(!err) {
                        Session.set("docid", res);
                    }
                });

            }
        },

        "click .js-load.doc": function(event) {
            Session.set("docid", this._id);
        }
    });

    Template.docMeta.events({
        "click .js-tog-private": function(event) {
            var doc = {
                _id: Session.get("docid"),
                isPrivate: event.target.checked
            };
            Meteor.call("updateDocPrivacy", doc);
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(!Documents.findOne()) { //no documents
        Documents.insert({
            title: "my new Document"
        });
    }
  });
}

Meteor.methods({

    addDoc: function() {
        var doc;
        if(!this.userId) {// not logged in
            return;
        }
        else {
            doc = {
                owner: this.userId,
                createdOn: new Date(),
                title: "My new Doc",

            };
            var id = Documents.insert(doc);
            return id;
        }
    },

    addEditingUser: function() {
        var doc, user, eusers;
        doc = Documents.findOne();
        if(!doc) { //no doc
            return;
        }
        if(!this.userId) { //no user logged in
            return;
        }
        user = Meteor.user().profile;
        euser = EditingUsers.findOne({docid: doc._id});
        if(!eusers) {
            eusers = {
                docid: doc._id,
                users: {}
            };
        }
        user.lastEdit = new Date();
        eusers.users.[this.userId] = user;
        EditingUsers.upsert({_id: eusers._id}, eusers);
    },

    updateDocPrivacy: function(doc) {
        var realDoc = Documents.findOne({_id: doc._id, owner: this.userId});
        if(realDoc) {
            realDoc.isPrivate = doc.isPrivate;
            Documents.update({_id: doc._id}, realDoc);
        }
    }
});

function fixedObjectKeys(obj) {
    var newObj = {};
    for(key in obj) {
        var key2 = key.replace("-", "");
        newObj[key2] = obj[key]
    }
    return newObj;
}

function setupCurrentDocument() {
    var doc;
    if(!Session.get("docid")) {
        doc = Documents.findOne();
        if(doc) {
            Session.set("docid", doc._id);
        }
    }
}

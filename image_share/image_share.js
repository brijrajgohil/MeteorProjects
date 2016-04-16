Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
    Template.images.helpers({images:Images.find()});

    Template.images.events({
        'click .js-image': function(event) {
            $(event.target).css("width", "50px");
        },
        'click .js-del-image': function(event) {
            var image_id = this._id;
            console.log(image_id);
            $("#"+image_id).hide('slow', function() {
                Image.remove({"_id": image_id});
            });

        }
    });
}

if (Meteor.isServer) {
    console.log("I am the Server");
}

Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
    console.log("I am the Client");
    var img_data = [
        {
            img_src: "2.jpg",
            img_alt: "my picture"
        },
        {
            img_src: "3.jpg",
            img_alt: "nature"
        },
        {
            img_src: "1.jpg",
            img_alt: "Green"
        }
    ];

    Template.images.helpers({images:img_data});

    Template.images.events({
        'click .js-image': function(event) {
            $(event.target).css("width", "50px");
        }
    });

}

if (Meteor.isServer) {
    console.log("I am the Server");
}

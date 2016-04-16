if(Meteor.isServer) {
    Meteor.startup(function() {
        if(Images.find().count() == 0) {
            Images.insert(
                {
                    img_src: "1.jpg",
                    img_alt: "It's me haha"
                }
            );
        }
    });
}

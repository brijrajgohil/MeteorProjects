if(Meteor.isServer) {
    Meteor.startup(function() {
        if(Images.find().count() == 0) {
            Images.insert(
                {
                    img_src: "1.jpg",
                    img_alt: "It's me haha"
                }
            );

            Images.insert(
                {
                    img_src: "2.jpg",
                    img_alt: "Nature"
                }
            );

            Images.insert(
                {
                    img_src: "3.jpg",
                    img_alt: "Green"
                }
            );

        }
    });
}

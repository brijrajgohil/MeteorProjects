Images = new Mongo.Collection("images");

//Set up security on Images Collection
Images.allow({
    insert: function(userId, doc) {
        console.log("Testing security on Image Insert");
        if(Meteor.user()) {
            if(userId != doc.createdBy) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    remove: function(userId, doc) {
        return true;
    }
});

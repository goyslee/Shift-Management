var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
	text: String,
    time : { type : Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Colleague"
		},
		username: String

	}
}, { usePushEach: true });

module.exports = mongoose.model("Comment", commentSchema);
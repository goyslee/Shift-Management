var mongoose = require("mongoose");

var rbSchema = mongoose.Schema({
	text: String,
	colleagueId: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Allocator"
		},
	}
}, { usePushEach: true });

module.exports = mongoose.model("Rb", rbSchema);
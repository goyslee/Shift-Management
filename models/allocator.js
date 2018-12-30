var mongoose = require("mongoose");
var AllocatorSchema = new mongoose.Schema({
    pickTarget: Number,
    tipTarget: Number,
    loadTarget: Number,
    outage: Boolean,
    outageTime: Number,
    hours: Number,
    allocatedMts: Number,
    allocatedRtDriver: Number,
    allocatedDrivers: Number,
    allocatedTippers: Number,
    allocatedLoaders: Number,
    allocatedRts: Number,
    allocatedRunners: Number,
    allocatedRebadge: Number,
    allocatedPickers: Number,
    allocatedChuteMen: Number,
    isAllocated: {
        type: Boolean,
        default: false
    },
    allocatedSheet: {
        type: Boolean,
        default: false
    },
    time: {
        type: Date,
        unique: true,
        dropDups: true
    },
    chutes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chute"
    }],
    pickers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picker"
    }],
    trucks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    }],
    loading: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loader"
    }],
    tip: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tipper"
    }],
    mts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mts"
    }],
    csc: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Csc"
    }],
    rt: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rt"
    }],
    rb: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rb"
    }],
    yard: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Yard"
    }],
    racking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Racking"
    }],
    manual_pick: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManualPick"
    }],
    baler: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Baler"
    }],
    training: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
    }],
    union: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Union"
    }],
    hygiene: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hygiene"
    }],
    runner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Runner"
    }],
    vls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vls"
    }],
    pickmanager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pickmanager"
    }],
    chutemanager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chutemanager"
    }],
    truckmanager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truckmanager"
    }],
    office: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office"
    }],
    rebadge: {
        type: Boolean,
        default: false
    }
}, {
    usePushEach: true
});
module.exports = mongoose.model("Allocator", AllocatorSchema);
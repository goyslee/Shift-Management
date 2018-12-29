var mongoose = require("mongoose");

var ColleagueSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    userNumber: String,
    startDate: {
        type: Date,
        default: () => 60 * 60 * 1000,
        dropDups : true
    },
    position: String,
    organization: String,
    shift: String,
    team: Number, // team 10 is Agency
    colleagueinfo: String,
    roles: [{
            trucks: { type:Boolean, default: false },
            chutes: { type:Boolean, default: false },
            sd: { type:Boolean, default: false },
            pick: { type:Boolean, default: false },
            loading: { type:Boolean, default: false },
            tip: { type:Boolean, default: false },
            mts: { type:Boolean, default: false },
            csc: { type:Boolean, default: false },
            rt: { type:Boolean, default: false },
            rb: { type:Boolean, default: false },
            yard: { type:Boolean, default: false },
            racking: { type:Boolean, default: false }, //**
            manual_pick: { type:Boolean, default: false }, //**
            baler: { type:Boolean, default: false },
            training: { type:Boolean, default: false }, //**
            union: { type:Boolean, default: false }, //**
            runner: {type:Boolean, default: false},
            hygiene: {type:Boolean, default: false},//*changed to false(was true in elstree) in Pineham database
            vls: {type:Boolean, default: false},
            sd:  {type:Boolean, default: false},
            marshalling: {type:Boolean, default: false},
            check: {type:Boolean, default: false}
        }],

     rating: [{
            trucks: {type: Number, default: 1 }, //1-10 gives you priority on task
            chutes: {type: Number, default: 1 },
            sd: {type: Number, default: 1 },
            pick: {type: Number, default: 1 },
            loading: {type: Number, default: 1 },
            tip: {type: Number, default: 1 },
            mts: {type: Number, default: 1 },
            csc: {type: Number, default: 1 },
            rt: {type: Number, default: 1 },
            rb: {type: Number, default: 1 },
            yard: {type: Number, default: 1 },
            racking: {type: Number, default: 1 },
            manual_pick: {type: Number, default: 1 },
            baler: {type: Number, default: 1 },
            training: {type: Number, default: 1 }, 
            union: {type: Number, default: 1 },
            marshalling: {type: Number, default: 1},
            check: {type: Number, default: 1},
        }],

      allocatedOnTraining: {type: Boolean, default: false},
      allocatedOnUnion: {type: Boolean, default: false},
      allocatedOnHygiene: {type: Boolean, default: false},
      allocatedOnRacking: {type: Boolean, default: false},
      allocatedOnManualPick: {type: Boolean, default: false}, 
      allocatedTo: String,
      isAllocated: Boolean,   
      isIn: {type: Boolean, default: false}, 
      holiday: {type: Boolean, default: false},
      absence: {type: Boolean, default: false},
      attended: {type: Boolean, default: false},
      allocatedLeader: Boolean,
      baseHours: {type: Number, default: 8},
      actualHours: {type: Number, default: 8},
      loadingTrained: {type: Boolean, default: false},
      rtTrained: {type: Boolean, default: false},
      chillPickTrained: {type: Boolean, default: false},
      marshallingTrained: {type: Boolean, default: false},
      checkTrained: {type: Boolean, default: false},
      tipTrained: {type: Boolean, default: false},
      produceTrained: {type: Boolean, default: false},
      pickTrained: {type: Boolean, default: false},
      mtsTrained: {type: Boolean, default: false}, 
      comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
    }, { usePushEach: true });
    

module.exports = mongoose.model("Colleague", ColleagueSchema);


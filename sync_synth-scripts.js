function SyncSynth() {
  // Define your plugin properties here
  this.vendor = "Generic MIDI Device";
  this.name = "Sync Synth";
  this.description = "Sync an external synth to Mixxx's BPM.";
}

var beatTimer; // Declare the beat timer variable
var ppqn = 24; // Pulses per quarter note
var midiClockActive = false;

// Initialize the plugin
SyncSynth.prototype.init = function() {
  // Add initialization code here
  engine.connectControl("[Channel1]", "play", "onPlayStateChange");
  engine.connectControl("[Channel1]", "beat_active", "onBeat");
  
};

// Handle MIDI input (if needed)
SyncSynth.prototype.receiveMidi = function(channel, control, value, status, group) {
  // Add MIDI message handling code here
};

// Add other methods as needed

// Instantiate and initialize the plugin
var syncSynth = new SyncSynth();
syncSynth.init();


function onPlayStateChange(value) {
    // Check if Channel 1 starts or stops
    if (value === 1) {
        // Channel 1 has started, send MIDI Clock Start (0xFA)
        midi.sendShortMsg(0xFA, 0x00, 0x00);
        console.log("-------MIDI Start-------");
    } else {
        // Channel 1 has stopped, send MIDI Clock Stop (0xFC)
        midi.sendShortMsg(0xFC, 0x00, 0x00);
        // Reset the MIDI Clock state
        console.log("-------MIDI Stop-------");
    }
}

function onBeat(value) {
    // When beat_active control changes, value will be 1 during a beat
    if (value === 1) {
        // Send 24 MIDI Clock ticks (0xF8) at once
        for (var i = 0; i < ppqn; i++) {
         midi.sendShortMsg(0xF8, 0x00, 0x00);
        }        

        // Set the flag to prevent sending multiple MIDI Clock messages during a single beat
        midiClockActive = true;
    } else if (value === 0) {
        // Reset the flag at the end of the beat
        midiClockActive = false;
    }
}

function shutdown() {
    // Clean up when Mixxx is closed
    engine.disconnectControl("[Channel1]", "play", "onPlayStateChange");
    engine.stopTimer(onBeat);
}

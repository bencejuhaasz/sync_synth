function SyncSynth() {
  // Define your plugin properties here
  this.vendor = "Your Vendor Name";
  this.name = "Sync Synth";
  this.description = "Sync an external synth to Mixxx's BPM.";
}

var beatTimer; // Declare the beat timer variable
var ppqn = 24; // Pulses per quarter note


// Initialize the plugin
SyncSynth.prototype.init = function() {
  // Add initialization code here
  engine.connectControl("[Channel1]", "play", "onPlayStateChange");
  //engine.connectControl("[Channel1]", "beat_active", "onBeat");
  beatTimer = engine.beginTimer(1000 / (engine.getValue("[Channel1]", "bpm") / 60 * ppqn), "SyncSynth.onBeat()");
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
        console.log("-------MIDI Stop-------");
    }
}

SyncSynth.onBeat = function() {
    // Send MIDI Clock tick (0xF8) on each beat
    midi.sendShortMsg(0xF8, 0x00, 0x00);
    console.log("-------MIDI Clock-------");
}

function shutdown() {
    // Clean up when Mixxx is closed
    engine.disconnectControl("[Channel1]", "play", "onPlayStateChange");
    engine.stopTimer(onBeat);
}

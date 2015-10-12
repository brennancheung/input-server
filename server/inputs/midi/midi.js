$(document).ready(function() {
    var client = new Faye.Client("/events");

    function onMidiSuccess(midi) {
        console.log('Got MIDI.  Success!');
        console.log(midi);
        listMidiInputs(midi);
    }

    function onMidiError(err) {
        console.log('Error getting MIDI');
    }

    function listMidiInputs(midi) {
        for (var entry of midi.inputs) {
            var input = entry[1];
            // console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
              // "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
              // "' version:'" + input.version + "'" );
            if (input.name == "MPK mini") {
                console.log("binding");
                input.onmidimessage = listenMidiEvents;
            }
    }
    }

    function listenMidiEvents(event) {
        var data = event.data;
        var dataDec = [];
        var dataHex = [];
        var dataBin = [];
        // var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
        for (var i=0; i<event.data.length; i++) {
            dataDec.push(event.data[i]);
            dataHex.push("0x" + event.data[i].toString(16));
            dataBin.push(event.data[i].toString(2));
        }
        var message = data[0] & 0xF0;
        var channel = data[0] & 0x0F;

        if (message == 0xB0) {
            var status = "control change";
            var controller = data[1] & 0x7F;
            var value = data[2] & 0x7F;
            client.publish("/events", {device: "midi", status: "control change", controller: controller, value: value});
        }

        // client.publish("/events", {device: "midi", status: status, channel: channel, ts: event.timestamp, dec: dataDec, hex: dataHex, bin: dataBin});
    }

    window.navigator.requestMIDIAccess({sysex: true}).then(onMidiSuccess, onMidiError);

    client.subscribe("/midi", function(e) {
        console.log(e);
    });
});

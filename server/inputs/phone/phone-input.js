$(document).ready(function() {
    var client = new Faye.Client("/events");

    client.subscribe("/heartbeart", function (event) {
        console.log(event);
    });

    $("#button-1").click( function() {
        client.publish("/events", {device: 'phone', button: 1});
    });
    
    $("#button-2").click( function() {
        client.publish("/events", {device: 'phone', button: 2});
    });

    $("#button-3").click( function() {
        client.publish("/events", {device: 'phone', button: 3});
    });

    $("#button-4").click( function() {
        client.publish("/events", {device: 'phone', button: 4});
    });
});

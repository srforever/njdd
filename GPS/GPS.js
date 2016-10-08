var gps = {
    
    // Application Constructor
    initialize: function () {

        //alert('GPS Initialized');

        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);

    },
    // Called when a photo is successfully retrieved
    //
    onSuccess: function (position) {

        var element = document.getElementById('geolocation');

        element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
                            'Longitude: ' + position.coords.longitude + '<br />' +
                            'Altitude: ' + position.coords.altitude + '<br />' +
                            'Accuracy: ' + position.coords.accuracy + '<br />' +
                            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                            'Heading: ' + position.coords.heading + '<br />' +
                            'Speed: ' + position.coords.speed + '<br />' +
                            'Timestamp: ' + position.timestamp + '<br />';
    },
    // Called if something bad happens.
    //
    onError: function(message) {
        //alert('Failed because: ' + message);
    }

};


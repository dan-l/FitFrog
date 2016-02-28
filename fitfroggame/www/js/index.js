/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var mAccel = mAccel || 0;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // console.log(navigator.camera);
        // console.log(Clarifai);
        // navigator.camera.getPicture(function cameraCallback(imageData) {
        //    var image = imageData;
        //    Clarifai.run(image,
        //    function(tags) {
        //        console.log(tags);
        //    });
        // }, function error(err) {
        //     console.log(err);
        // }, {
        //     destinationType: Camera.DestinationType.DATA_URL
        // });

        var options = { frequency: 200 };  // Update every 3 seconds

        //var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

        function onSuccess(acceleration) {
            var x = acceleration.x;
            var y = acceleration.y;
            var z = acceleration.z;

            var mAccelCurrent = Math.sqrt(x*x + y*y + z*z);
            mAccel = mAccel * 0.9 + mAccelCurrent * 0.1;
            var element = document.getElementById('accelerometer');
            element.innerHTML = 'Acceleration X: ' + acceleration.x         + '<br />' +
                                'Acceleration Y: ' + acceleration.y         + '<br />' +
                                'Acceleration Z: ' + acceleration.z         + '<br />' +
                                'mAccel: '      + mAccel + '<br />';
        }
        // onError: Failed to get the acceleration
        //
        function onError() {
            alert('onError!');
        }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
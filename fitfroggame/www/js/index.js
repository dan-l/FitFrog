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

var speed = speed || 0;
var oldLat = 0;
var oldLon = 0;
var oldTime = 0;
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

        window.open = cordova.InAppBrowser.open;


        navigator.geolocation.getCurrentPosition(function(c){
            console.log('CALLBACK' + c);
        });
        var bgLocationServices =  window.plugins.backgroundLocationServices;
        bgLocationServices.configure({
             //Both
             desiredAccuracy: 10, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
             distanceFilter: 1, // (Meters) How far you must move from the last point to trigger a location update
             debug: true, // <-- Enable to show visual indications when you receive a background location update
             interval: 1000, // (Milliseconds) Requested Interval in between location updates.
             //Android Only
             notificationTitle: 'BG Plugin', // customize the title of the notification
             notificationText: 'Tracking', //customize the text of the notification
             fastestInterval: 500, // <-- (Milliseconds) Fastest interval your app / server can handle updates
             useActivityDetection: true // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)

        });

        //Register a callback for location updates, this is where location objects will be sent in the background
        bgLocationServices.registerForLocationUpdates(function(location) {
            console.log("We got an BG Update" + JSON.stringify(location));
            var newLat = location.latitude;
            var newLon = location.longitude;
            var newTime = location.timestamp;

            // First update.
            if (oldLat == 0 && oldLon == 0 && oldTime == 0) {
                oldLat = newLat;
                oldLon = newLon;
                oldTime = newTime;
                return;
            }

            var distance = getDistanceFromLatLonInKm(newLat, newLon, oldLat, oldLon)*1000;
            var time = (newTime - oldTime)/1000;
            speed = distance / time;

            // Update for next iteration.
            oldLat = newLat;
            oldLon = newLon;
            oldTime = newTime;

            // Update display.
            var element = document.getElementById('accelerometer');
            element.innerHTML = 'speed: ' + speed;
        }, function(err) {
             console.log("Error: Didnt get an update", err);
        });


        bgLocationServices.registerForActivityUpdates(function(activities) {
             console.log("We got an BG Update" + JSON.stringify(activities));
        }, function(err) {
             console.log("Error: Something went wrong", err);
        });

        bgLocationServices.start();


        bgLocationServices.registerForActivityUpdates(function(activities) {
             console.log("We got an BG Update" + JSON.stringify(activities));
        }, function(err) {
             console.log("Error: Something went wrong", err);
        });

        bgLocationServices.start();
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

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
};

function deg2rad(deg) {
  return deg * (Math.PI/180)
};

app.initialize();
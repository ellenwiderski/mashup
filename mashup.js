//FACEBOOK

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    testAPI();
    var count = 0;

    FB.api("/me/home?limit=50",
          function(response) {
            if (response && !response.error) {

              var markers = []

              for (var i in response['data']) {
                if (response['data'][i].hasOwnProperty('place')) {

                  friendlocation = {
                    lat: response.data[i].place.location.latitude,
                    lng: response.data[i].place.location.longitude,
                    friendname: response.data[i].from.name,
                    friendid: response.data[i].from.id,
                    message: response.data[i].message,
                    placename: response.data[i].place.name
                  }

                  markers.push(friendlocation);
                }
              }
            }
            loadMarkers(markers);
          }
      );

  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1396726507284343',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    console.log(response);
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
  });
}


// GOOGLE MAPS

function initialize() {
  var mapOptions = {
    center: { lat: 43.076073222273, lng: -89.376661651794},
    zoom: 8
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function loadMarkers(markers) {

  var bounds = new google.maps.LatLngBounds();
    
// Display multiple markers on a map
var infoWindow = new google.maps.InfoWindow(), marker, i;
var infoWindowContent = [];

for (i = 0; i < markers.length; i++) {

  if (markers[i].hasOwnProperty('message')) {
    infoWindowContent.push('<div class="info_content">' +
          '<img src="https://graph.facebook.com/'+markers[i].friendid+'/picture">'+
          '<h3>'+markers[i].friendname+'</h3>' +
          '<p> "'+markers[i].message+'"</p>' + '</div>');
  }
}

// Loop through our array of markers & place each one on the map  
for( i = 0; i < markers.length; i++ ) {

    var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
    bounds.extend(position);

    marker = new google.maps.Marker({
        position: position,
        map: map,
        title: markers[i].placename
    });
    
    // Allow each marker to have an info window    

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
              infoWindow.setContent(infoWindowContent[i]);
              infoWindow.open(map, marker);
          }
      })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }
}

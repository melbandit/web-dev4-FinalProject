var FlickrApi = (function(options){
    var shared = {},
        options = options || {};

    var access_token = "228523518.e6e158d.43e428c17026491294d002bcadba0e7f";

    jsonFlickrApi({ "auth": { 
    "access_token": { "oauth_token": "72157673503944383-01c25c5186559773", "oauth_token_secret": "a0a0ec5638b7a98c" } }, "stat": "ok" })
    //https://api.instagram.com/oauth/authorize/?client_id=e6e158d6b61547739924dffdf92113b9&redirect_uri=https://localhost:8888/wd4-googlemapsinstagram/&response_type=token&scope=basic+public_content+follower_list+comments+relationships+likes

    var CLIENT_KEY: '31e6e9b04bc6d7b28cd6a11cbb734302';
    var CLIENT_SECRET = '5138b078ed278e1f';
    var redirect_url = 'https://localhost:8888/wd4-googlemapsinstagram/';

    function setupListeners(){
        setUpInstaLocation();
    }

    function setUpInstaLocation( name, callback ){

        $('form[name=instagram] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('#instagram ul'),
                keyword = $form.find('input[name=q]').val();

            // params['op'] = 'search_instagram'; // which PHP function to run
            // params['q'] = keyword; // argument for the Twitter search API
            // var $count_f = $form.find('input[name=count]');
            // if ($count_f) {
            //     params['count'] = $count_f.val();// argument for the Twitter search API
            // }
            // var $result_type_f = $form.find('select[name=result_type]');
            // if ($result_type_f) {
            //     params['result_type'] = $result_type_f.val();// argument for the Twitter search API
            // }
            //786 New Bushy Branch Road
            //Manchester, TN 37355
            // var keyword = [
            //     lat: 35.475123,
            //     log:-86.051883
            // ]
            //var bonarooLoc = 'lat=35.475123&lng=-86.051883';
            //var endpoint = 'https://api.instagram.com/v1/media/search?' + bonarooLoc + '&access_token=' + access_token;
            
            //lollapalooza id = 44095688, 228523518, 44095688
            //bonnaroo id = 13203488

            //window._sharedData.entry_data.ProfilePage[0].user.id
            //tag-name
            //works var endpoint = 'https://api.instagram.com/v1/tags/search?q=' + keyword + '&access_token=' + access_token;
            
            //try to make work
            var endpoint = 'https://api.flickr.com/services/feeds/photos_public' + keyword + '/media/recent?access_token='+ access_token ;

            //user 228523518 work 
            //var endpoint ='https://api.instagram.com/v1/users/'+ keyword + '/media/recent/?access_token=' + access_token;

            //var endpoint ='https://api.instagram.com/v1/locations/' + keyword + '/media/recent?access_token=' + access_token;
            //https://api.instagram.com/v1/media/search?
            //var endpoint = 'https://api.instagram.com/v1/locations/search?' + keyword + '&access_token=' + access_token;
            //var endpoint = 'https://api.instagram.com/v1/tags/'+keyword+'/media/recent?access_token=' + access_token;
            $.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: endpoint,
                resultElements: $results,
                data: params//,
                // keyword: keyword
            }).done(function(response) {
                //if(typeof callback === 'function') callback (response);
                console.log(response.stat);
                // $results.empty();
                if (response.stat != "ok"){
                    console.log('something broke!');
                    return;
                }

                // for (var i=0; i < response.blogs.blog.length; i++){

                //     var blog = response.blogs.blog[i];

                //     var div = document.createElement('div');
                //     var txt = document.createTextNode(blog.name);

                //     div.appendChild(txt);
                //     document.body.appendChild(div);
                // }
}

                for (var i = response.data.length - 1; i >= 0; i--) {
                    var status = response.data[i];
                    var imageUrl = '<img src="' + status.images.low_resolution.url + '"/>';
                    var imageDisplay = '<a href="' + status.link +'" target="_blank">'+ imageUrl + '</a>';
                    $results.append(imageUrl);
                    $results.append(highlightedUrl);
                    var highlightedUrl = RegExModule.highlightKeyword(status.link);

                    console.log(status);
                    if ( status.location ) {
                    GoogleMapApi.createMarker({
                        lat: status.location.latitude, // use real data instead
                        lng: status.location.longitude, // use real data instead
                        name: status.location.name, // use real data instead
                        //image: imageDisplay,
                        content: imageDisplay
                });
                    //$results.append('')

                }
                
            }
                //displayTweets($results, response.statuses, keyword);
                //displayTweetsOnMap($results, response.statuses, keyword);
            });
                return false;
        });
    }

    function urlString( string ){
        var newHighlightedString = string.replace(newString, '<a class="highlight" href="' + newString + '">' + newString + '</a>');
        // (fill in code here)
        //and then return the new string:
        return newHighlightedString;
    }

    var init = function() {
        console.log('init()');
        setupListeners();
    };
    shared.init = init;

    return {
        init: init,
        setUpInstaLocation: setUpInstaLocation,
        urlString: urlString
    }
}());

FlickrApi.init({
    // client_id: 'e6e158d6b61547739924dffdf92113b9';
});
// InstagramApi.setUpInstaLocation('cat', function(r) {
//     console.log(r);
// });

    
var RegExModule = (function() {
    function matchURL(string) {
        //console.log("matchURL:", string.text);
        var urlRE = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
        ///[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
        var matched = string.match(urlRE);
        return matched;
    }
    function highlightTweet(tweet, keyword){
        //console.log("tweet:", tweet, "keyword", keyword);
        var processed = highlightURL(tweet);
        //console.log("processed1:", processed);
        var processed = highlightTwitterHandle(processed);
        //console.log("processed2:", processed);
        var processed = highlightKeyword(processed, keyword);
        //console.log("processed3:", processed);
        return processed;
    }
    function highlightKeyword(string, keyword){
        //console.log("string:", tweet, "keyword:", keyword);
        //var newString = tweet.replace(keyword, '<span class="highlight">'+ keyword + '</span>');
        //return newString;
        var keywordRE = new RegExp("("+keyword+")", "gi");
        var newString = string.replace(keywordRE,'<span class="highlight">$1</span>');

        return newString;
    }
    function highlightTwitterHandle(tweet){
        // var twitterHandleRE = /(^|[^@\w])@(\w{1,15})\b/; /([@][A-z0-9]+)|([#][A-z0-9]+)/g
        var twitterHandleRE = /([@][A-z0-9]+)/g;

        var matched = tweet.match(twitterHandleRE);

        if (matched) {
            for (var i = 0; i < matched.length; i++) {
                tweet = tweet.replace(matched[i], '<a class="highlight" href="http://twitter.com/' + matched[i] + '" target="_blank">' + matched[i] + '</a>');
            }
        }

        return tweet;
    }
    function highlightURL(string) {
        //match a URL in the string, and then modify the strong to turn the URL into a hyperlink
        var newString = matchURL(string);
        //process the matched URL...
        var newHighlightedString = string.replace(newString, '<a class="highlight" href="' + newString + '">' + newString + '</a>');
        // (fill in code here)
        //and then return the new string:
        return newHighlightedString;
    }
    function matchEmail(string){
        var emailRE = /(.+@.+\..+)/;
        var matched = string.match(emailRE);
        //"bob@bob.com".match(emailRE);
        return matched;
    }
    function init(){

    }
    return {
        init: init,
        matchEmail: matchEmail,
        matchURL: matchURL,
        highlightTweet: highlightTweet,
        highlightKeyword: highlightKeyword
    }

})();
//$document.ready(function() {
    RegExModule.init();
//});

var GoogleMapApi = (function(options){
    var map;
    var service;

    var centerPoint = {
      lat: 33.734088, 
      lng: -84.372260, 
      name: 'Zoo Atlanta', 
      content: '800 Cherokee Ave SE, Atlanta, GA 30315'
    };
    //var centerPoint = {lat: 33.833935, lng: -84.357232};

    var $searchField = document.getElementById('search-input');
    var $searchButton = document.getElementById('search-submit-button');
    var $placesList = document.getElementById('search-list');


    function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: centerPoint,
            zoom: 15,
            styles: [
              {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#365e44'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#a65bc2'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#5b78c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
              }
            ]
        });
        // createMarker(centerPoint);
        $searchButton.addEventListener("click", doSearch);
    }

    function createMarker(aLatLng){
        //console.log("createMarker:", aLatLng);
        // var geo = aLatLng.coordinates;

        // if(geo && geo.type === 'Point'){
        //     var marker = new google.maps.Marker({
        //         position: new google.maps.LatLng(geo[1], geo[0]),
        //         map: map,
        //         title: '@' + aLatLng.user.screen_name + ': ' + aLatLng.text
        //     })
        // }
        //marker.empty();
        var marker = new google.maps.Marker({
            position: aLatLng,
            map: map,
            title: aLatLng.name,
            content: aLatLng.content
        });
        createInfoWindow(marker);
    }

    function createInfoWindow(marker){
        //console.log("createInfoWindow", marker);
        //var contentString = '<h4>'+ "hey"+'</h4>';
        var place = marker.title;
        var image = marker.url;
        var address = marker.content;

        //var imageString = '<img src="' + image +'>';

        var contentString = '<h4>'+ place +'</h4>' + address; 
        //var contentString = '<h4>'+ marker.user.screen_name +'</h4>' + marker.text;
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function(){
            infowindow.open(map, marker);
        });
    }

    function processPlacesResults(results, status){
        //console.log('results',results);
        //console.log('status', status);
        //console.log('name', result.name);
        $placesList.innerHTML = ' ';

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                // window.result = result; //to make it a global variabl, console
                //console.log('result', result);
                //console.log(result.geometry.location);

                var newMarker = {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                    name: result.name,
                    content: result.formatted_address
                };
                createMarker(newMarker);
                $placesList.innerHTML += '<li>' + result.name + '</li>';
                //place.geometry.location.lat()
                //place.geometry.location.lng()
            }
        }
    }
    function doSearch(event){

        event.preventDefault();

        var request = {
            location: centerPoint,
            radius: '100',
            // name: aLatLng,
            query: $searchField.value
        };
        var service = new google.maps.places.PlacesService(map);
        // service.nearbySearch(request, callback);
        service.textSearch(request, processPlacesResults);
    }

    return{
        initMap: initMap,
        createMarker: createMarker
    };

}());
    //GoogleMapApi.initMap();
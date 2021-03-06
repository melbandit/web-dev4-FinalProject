var GiphyApi = (function(options) {
    var shared = {},
    options = options || {};

    function giphyImages(name){
        var $results = $('#giphy');
        var $trends_results = $('.trends');
        $results.empty();
        $trends_results.empty();
        if (!name) {
            return;
        }
        name = name.replace("#", "");

        var endpoint = 'http://api.giphy.com/v1/gifs/search?q='+ name + '&limit=1&api_key=dc6zaTOxFJmzC';
        //console.log("do giphy images search for ", name)
        $.ajax({
            dataType: "json",
            url: endpoint
        }).done(function(response) {

            for (var i = 0; i < response.data.length; i++) {
                var status = response.data[i];
                var smallUrl = status.images.fixed_height.url;
                var largerUrl = status.embed_url;
                var postUrl = $('<li class="giphy_list" style="background-image: url('+smallUrl+'); background-size: 20%;">'+'<p class="trends_title--lg">' + name + '</p>'+'<a href="'+ status.embed_url +'" target="_blank">'+'<img class="trends_img" src="' + smallUrl + '">'+'</a>'+'<div>'+'<form name="tweetSearch">'+'<input name="q" type="hidden" value="' + name + '"/>'+'<button class="tweetButton" type="submit">'+ 'Search' +'<img class="logo-size--md" src="images/tweet-logo.png">'+ 'for #' +name+'</button>'+ '</form>'+'</div>'+'</li>');
                $results.append(postUrl);

            }
            var $searchButtons = document.querySelectorAll('.tweetButton');

            for (var j = 0; j < $searchButtons.length; j++) {
                $searchButtons[j].addEventListener("click", TwitterApi.searchTweets);
            }
        });
        
    }

    var init = function() {
        console.log('Giphy init()');
        //setupListeners();
    };

    shared.init = init;

    return {
        init: init,
        giphyImages: giphyImages
    }
}());
GiphyApi.init();


var TwitterApi = (function(options) {
    var startLat = 33.7490,
        startLng = -84.3880;
    var shared = {},
        options = options || {};


    function setupListeners() {
        //console.log('setupListeners()');
        // setupTrends();
        //setupSearch();
        // displayTweets();
        // searchTweets();

    }

    function setStartingPoint( lat, lng ){
        console.log("working");
        startLat = lat;
        startLng = lng;
    }

    function setupTrends() {
        $results = $('.results ul'),
        keyword = $('input[name=trend_search]').val();

        params = {};

        params['op'] = 'trend_search';
        params['lat'] = startLat;
        params['long'] = startLng;
        $.ajax({
            dataType: "json",
            url: 'twitter-proxy.php',
            resultElements: $results,
            data: params//,
            //keyword: screen_name
        }).done(function(response) {
            console.log(response[0].woeid);
            //console.log(response);
            trendSearch(response[0].woeid);
        });
            return false;
    }


    function trendSearch(woeid) {
        var $results = document.querySelector('.trends ul');
        var params = {};
        params['op'] = 'user_place_search';
        params['id'] = woeid;
        $.ajax({
            dataType: "json",
            url: 'twitter-proxy.php',
            resultElements: $results,
            data: params//,
            //keyword: screen_name
        }).done(function(response) {
            //console.log(response[0].trends);
            //$results.empty();
            var trend = response[0].trends;

            for (var i = 0; i < trend.length; i++) {
                var status = trend[i];
                //var name = '<a href="'+status.url+ '">' +status.name+ '</a>';
                //var name = '<p>'+ status.name+ '</p>';
                var name = status.name;
                GiphyApi.giphyImages(name);
            }
        });
            return false;
        
    }


    function setupSearch() {

        $('form[name=tweetSearch] button').click(function(event) {
            console.log("working");
            event.preventDefault();

            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('#tweets ul'),
                keyword = $form.find('input[name=q]').val();

            params['op'] = 'search_tweets'; // which PHP function to run
            params['q'] = keyword; // argument for the Twitter search API
            var $count_f = $form.find('input[name=count]');
            if ($count_f) {
                params['count'] = $count_f.val();// argument for the Twitter search API
            }
            var $result_type_f = $form.find('select[name=result_type]');
            if ($result_type_f) {
                params['result_type'] = $result_type_f.val();// argument for the Twitter search API
            }
        $.ajax({
            dataType: "json",
            url: 'twitter-proxy.php',
            resultElements: $results,
            data: params,
            keyword: keyword
        }).done(function(response) {
            console.log("Response", response.statuses);
            displayTweets($results, response.statuses, keyword);
        });
            return false;
        });
    }

    function searchTweets(event){
        event.preventDefault();

        var $e = $(event.currentTarget),
            $form = $e.closest('form'),
            params = {},
            $results = $('.tweets ul'),
            keyword = $form.find('input[name=q]').val();

        params['op'] = 'search_tweets'; // which PHP function to run
        params['q'] = keyword; // argument for the Twitter search API
        var $count_f = $form.find('input[name=count]');
        if ($count_f) {
            params['count'] = $count_f.val();// argument for the Twitter search API
        }
        var $result_type_f = $form.find('select[name=result_type]');
        if ($result_type_f) {
            params['result_type'] = $result_type_f.val();// argument for the Twitter search API
        }
    $.ajax({
        dataType: "json",
        url: 'twitter-proxy.php',
        resultElements: $results,
        data: params,
        keyword: keyword
    }).done(function(response) {
        //console.log("Response", response.statuses);
        displayTweets($results, response.statuses, keyword);
    });
        return false;

    }

    function displayTweets($results, data, keyword) {
    
        $results.empty();
        if(!data){
            return;
        }
        for (var s in data) {
            var status = data[s];
            console.log(status.text);
            var li = document.createElement('li');
            var screen_name = status.user.screen_name;
            var txt = status.text;
            var txtNode_SN = document.createElement('p');
            var txtNode = document.createElement('span');
            var highlightedKeyword = RegExModule.highlightTweet(status.text, keyword);
            txtNode.innerHTML = highlightedKeyword;
            txtNode_SN.innerHTML = screen_name;
            //txtNode.innerHTML = txt;
            li.appendChild(txtNode_SN);
            li.appendChild(txtNode);
            $results.append(li);
            //console.log(status.text);
        }

    }

    var init = function() {
        console.log('Twitter init()');
        setupListeners();
    };
    return {
        init: init,
        setStartingPoint: setStartingPoint,
        searchTweets: searchTweets,
        setupTrends: setupTrends,
        displayTweets: displayTweets
    };
}());
TwitterApi.init();


var RegExModule = (function(options) {
    var shared = {},
        options = options || {};

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
        console.log('RegExp init');
    }
    shared.init = init;

    return {
        init: init,
        matchEmail: matchEmail,
        matchURL: matchURL,
        highlightTweet: highlightTweet,
        highlightKeyword: highlightKeyword
    }

})();
// $document.ready(function() {
    RegExModule.init();
// });

var GoogleMapApi = (function(options){
    var map;
    var service;

    var shared = {},
        options = options || {};

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

    function setupListeners() {
        //console.log('setupListeners()');
        getLatLng();
    }

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
        //$searchButton.addEventListener("click", doSearch);
    }

    function createMarker(aLatLng){
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
        var place = marker.title;
        var image = marker.url;
        var address = marker.content;
        var contentString = '<h4>'+ place +'</h4>' + address; 
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

                var newMarker = {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                    name: result.name,
                    content: result.formatted_address
                };
                createMarker(newMarker);
                $placesList.innerHTML += '<li>' + result.name + '</li>';
      
            }
        }
    }

    function getLatLng(){
        
        $('form[name=location-search] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                // screen_name = $form.find('input[type=text]').val(),
                $results = $form.find('.results ul'),
                address = $form.find('input[name=q]').val();
                params = {};

            var key = 'AIzaSyAcLGWpqaelBOUSGmNWPShmfjFaIxkISSs';
            $.ajax({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + key,
                type: 'GET',
                dataType: 'json'
            }).done(function(response) {
                // console.log("success=", response.status);
                var $info_results = $('.info-container');
                $info_results.empty();

                if(response.status === "ZERO_RESULTS"){
                    var $nothing = $('<p class="info">Nothing going on here, type a State or Country.</p>');
                    $info_results.append($nothing);
                } else {
                    // var $nothing = $('<p class="info">Location submitted. Now get your trends from Giphy.</p>');
                    // $info_results.append($nothing);
                    // console.log("lat", response.results[0].geometry.location.lat);
                    // console.log("lng", response.results[0].geometry.location.lng);
                    $results.empty();
                    TwitterApi.setStartingPoint(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng );
                    TwitterApi.setupTrends();
                }

            });
            return false;
        });
        
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
        service.textSearch(request, processPlacesResults);
    }

    var init = function() {
        console.log('Google Maps init()');
        setupListeners();
    };
    return{
        init: init,
        initMap: initMap,
        createMarker: createMarker,
        getLatLng: getLatLng
    };

}());
GoogleMapApi.init();
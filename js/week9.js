var GiphyApi = (function(options) {
    var shared = {},
    options = options || {};

    function giphyImages(name){
        //if there is a search return{
            //loop through the images and display them
        //}
        //else do nothing
        //var name = 'cat';
        var $results = $('#giphy');
        if (!name) {
            return;
        }
        name = name.replace("#", "");

        var endpoint = 'http://api.giphy.com/v1/gifs/search?q='+ name + '&limit=1&api_key=dc6zaTOxFJmzC';
        console.log("do giphy images search for ", name)
        $.ajax({
            dataType: "json",
            url: endpoint
            //resultElements: $results//,
            //data: params//,
            //keyword: screen_name
        }).done(function(response) {
            //console.log(name, response);
            for (var i = 0; i < response.data.length; i++) {
                var status = response.data[i];
                var url = status.images.fixed_height.url;
                var postUrl = $('<li><img src="' + url + '"><p>' + name + '</p></li>');
                $results.append(postUrl);
            }
        });
    }

    var init = function() {
        console.log('init()');
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

        setupTimeline();
        setupSearch();
        // displayTweets();
    }

    function setStartingPoint( lat, lng ){
        startLat = lat;
        startLng = lng;
    }

    function setupTimeline() {
        $('form[name=timeline] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                // screen_name = $form.find('input[type=text]').val(),
                $results = $form.find('.results ul'),
                keyword = $form.find('input[name=trend_search]').val();

                params = {};

                params['op'] = 'trend_search';
                params['lat'] = startLat;
                params['long'] = startLng;

                // params['lat'] = keyword.coordinates.coordinates[1];
                // params['long'] = keyword.coordinates.coordinates[0];
                // params['screen_name'] = screen_name;
        $.ajax({
            dataType: "json",
            url: 'twitter-proxy.php',
            resultElements: $results,
            data: params//,
            //keyword: screen_name
        }).done(function(response) {
            console.log(response[0].woeid);
            console.log(response);

            // params['lat'] = response.coordinates.coordinates[1];
            // params['long'] = response.coordinates.coordinates[0];

            trendSearch(response[0].woeid);

            //displayTweets($results, response);  //correct
        });
            return false;
        });
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
            console.log(response[0].trends);
            var trend = response[0].trends;

            for (var i = 0; i < trend.length; i++) {
                var status = trend[i];
                //var name = '<a href="'+status.url+ '">' +status.name+ '</a>';
                //var name = '<p>'+ status.name+ '</p>';
                var name = status.name;
                GiphyApi.giphyImages(name);
            }

            // displayTweets($results, response);  //correct
        });
            return false;
        
    }

    function setupSearch() {

        $('form[name=search] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('.results ul'),
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
            displayTweets($results, response.statuses, keyword);
            //displayTweetsOnMap($results, response.statuses, keyword);

        });
            return false;
        });
    }
    function displayTweets($results, data, keyword) {
        //console.log("displayTweets", $results);
        $results.empty();
        for (var s in data) {
            var status = data[s];
            console.log(status)
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
            //console.log("Geo", status.coordinates);

            // if ( status.coordinates ) {
            //     console.log(status.coordinates);
            //     GoogleMapApi.createMarker({
            //         lat: status.coordinates.coordinates[1], // use real data instead
            //         lng: status.coordinates.coordinates[0], // use real data instead
            //         name: screen_name, // use real data instead
            //         content: highlightedKeyword
            //     });
            // }
            // mapNode.innerHTML = displayTweetsOnMap;

            // if( status.coordinates){
            //     GoogleMapApi.createInfoWindow({

            //     });
            // }
        }

        // // var keyword = $form.find('input[name=q]').val();

        // for(tweet = ;tweet++;) {
        //   var highlightedTweet = RegExModule.highlightTweet(tweet, keyword)  
        // }
        // return highlightTweet;
    }

    var init = function() {
        //console.log('init()');
        setupListeners();
    };
    shared.init = init;

    return shared;
}());

TwitterApi.init();


var TumblrApi = (function(options){
    var shared = {},
        options = options || {};

    function setupListeners(){
        setUpTumblrLocation();
    }

    function setUpTumblrLocation( name, callback ){

        $('form[name=tumblr] button').click(function(event) {
            var $e = $(event.currentTarget),
                $form = $e.closest('form'),
                params = {},
                $results = $form.find('#tumblr ul'),
                keyword = $form.find('input[name=q]').val();
            //var bonarooLoc = 'lat=35.475123&lng=-86.051883';
            var api_key = 'BwkzzWwmg2RhNRzcTf1JijrEEInZJ26MsutEJYysJpy5x6tiXr';
           // Authenticate via API Key
            var endpoint = 'https://api.tumblr.com/v2/blog/' + keyword + '.tumblr.com/posts?api_key=' + api_key;

            $.ajax({
                type: 'GET',
                dataType: "jsonp",
                url: endpoint//,
                //resultElements: $results,
                //data: params//,
                // keyword: keyword
            }).done(function(rsp) {
                //if(typeof callback === 'function') callback (response);
                console.log(rsp.response.posts);
                $results.empty();
                // results.response.posts[i].photos[0].alt_sizes[i].url
                console.log(rsp);

                    if ( rsp.meta.msg === 'OK' ) {

                        for (var i = 0; i < rsp.response.posts.length; i++) {
                            var status = rsp.response.posts[i];
                            if(status.photos){
                                var photo = status.photos[0];
                                var imageUrl = '<img src="' + photo.alt_sizes[3].url + '"/>';
                                //var imageDisplay = '<a href="' + status.link +'" target="_blank">'+ imageUrl + '</a>';
                                $results.append(imageUrl);
                            } else if(status.player){
                                var player = status.player[0];
                                var video = player.embed_code;
                                $results.append(video);
                            } else if(status.post_url){
                                var url = status.post_url;
                                var postUrl = '<a href="' + url + '">'+ url +'</a>';
                                $results.append(postUrl);
                            }

                            //var whatToBring = PinterestApi.searchPinterest(rsp.blog.name);

                            // for (var j = 0; j < status.photos.length; j++) {
                            //     var response = status.photos[i];
                            //     var imageUrl = '<img src="' + response.original_size.url + '"/>';
                            //     $results.append(imageUrl);
                        }
                            //$results.append(highlightedUrl);
                            //var highlightedUrl = RegExModule.highlightKeyword(status.link);
                    }
                });

            //         //$results.append('')
                //displayTweets($results, response.statuses, keyword);
                //displayTweetsOnMap($results, response.statuses, keyword);
                return false;
        });
    }

    // function urlString( string ){
    //     var newHighlightedString = string.replace(newString, '<a class="highlight" href="' + newString + '">' + newString + '</a>');
    //     // (fill in code here)
    //     //and then return the new string:
    //     return newHighlightedString;
    // }

    var init = function() {
        console.log('init()');
        setupListeners();
    };
    shared.init = init;

    return {
        init: init,
        setUpTumblrLocation: setUpTumblrLocation
    }
}());

TumblrApi.init({
    // client_id: 'e6e158d6b61547739924dffdf92113b9';
});

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

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
        console.log('Tumblr init()');
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
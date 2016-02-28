"use strict"

var ClarifaiObj =  {
  init: function() {
    function getCredentials(cb) {
      var data = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
      };

      return aja()
        .method('post')
        .url('https://api.clarifai.com/v1/token')
        .data(data)
        .on('200', function(r){
             localStorage.setItem('accessToken', r.access_token);
                       localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
                       cb();
          })
        .go()
    }

    function postImage(imgurl, cb) {
      var data = {
        'url': imgurl
      };
      var accessToken = localStorage.getItem('accessToken');

      return aja()
        .method('post')
        .url('https://api.clarifai.com/v1/tag')
        .header('Authorization', 'Bearer ' + accessToken)
        .data(data)
        .on('200', function(r) {
          cb(parseResponse(r));
        })
        .go();

    }

    function parseResponse(resp) {
      var tags = [];
      if (resp.status_code === 'OK') {
        var results = resp.results;
        tags = results[0].result.tag.classes;
      } else {
        console.log('Sorry, something is wrong.');
      }

      return tags;
    }

    return {
      run: function (imgurl, cb) {
        if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
          || localStorage.getItem('accessToken') === null) {
          getCredentials(function() {
            postImage(imgurl, cb);
          });
        } else {
          postImage(imgurl, cb);
        }
      }
    }
  }
}

window.Clarifai = ClarifaiObj.init();

var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var targetUrl = "https://www.yt-download.org/api/button/mp3/";//"https://www.youtube.com/get_video_info?video_id=";
var id = "pdnmLi71mtc";

function decodeQueryString(str){
    var r = {};
    var valuePairs = String(str).split("&");
    var len = valuePairs.length;
    for(var i = 0, len = valuePairs.length; i < len; i++){
      var valuePair = valuePairs[i];
      var key = decodeURIComponent(valuePair.split("=")[0]);
      var val = decodeURIComponent(valuePair.split("=")[1] || "");
      r[key] = val;
    }
    return r;
}
console.log("asd");
$.ajax({
    url: proxyUrl+targetUrl + id,
    timeout: 3000,
    error: function(){
        console.log("timed out");
    },
}).done(function(video) {    
    if(video.status == "fail")
    {
        window.alert("invalid video url");
    }
    else{
        var vidStr = String(video);
        /*
        var index = vidStr.indexOf("https://www.yt-download.org/download/");
        var indextwo =vidStr.indexOf(" ",index);
        var v = vidStr.slice(index,indextwo);
        console.log(v);
        */
        
        var re = new RegExp("(http|https)://([\w]+(?:(?:.+)+))/(0)$", "g");
        var streamUrl = vidStr.match(re);
        //console.log(vidStr);
        console.log(streamUrl);
        console.log("done");

        /*
        var data = JSON.parse(video.player_response);
        var formats = data.streamingData.adaptiveFormats;
        //console.log(formats);
    
        /*
        var url, max = 0;
    
        formats.forEach(function(a){
            if(a.audioQuality !== undefined){
                var audio = String(a.audioQuality).slice(("AUDIO_QUALITY_").length,a.audioQuality.length).toLowerCase();
                var pow = 0;
                switch(audio){
                    case "low":
                        pow = 1;
                        break;
                    case "medium":
                        pow = 2;
                        break;
                    case "high":
                        pow = 3;
                        break;
                }
                if(pow > max){
                    max = pow;
                    url = a.url;
                }
            }
        });
        console.log(url);
        */
    }
}).catch(function(e){
    console.log(e);
});
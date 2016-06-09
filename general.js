var fullPlaylist = [];

function soitabiisi(){
    var soitto = document.getElementById("soitin");
    soitto.play();
    console.log(soitto.duration);
}

function lopetabiisi(){
    var soitto = document.getElementById("soitin");
    soitto.pause();
    console.log(soitto.duration);
}

function getPlaylistList(nextPageToken){
    console.log(nextPageToken);
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken="+nextPageToken+"&playlistId=PL5edKOlqgjC17Gd0osqaxApwF5kW738SV&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var playlist = JSON.parse(xmlhttp.responseText);
            console.log(playlist);
            for (song in playlist.items){
                fullPlaylist.push(playlist.items[song]);
            }
            
            var pageToken = playlist.nextPageToken;
            if(pageToken != null){
                getPlaylistList(pageToken);
            }
            else{
                listFullPlaylist();
            }
        }
    };
    console.log(url);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function listFullPlaylist(){
    
    var playlistContent = [];

    playlistContent.push("<ul>");
    for (song in fullPlaylist){
        
//        console.log(fullPlaylist[song].snippet);
        
        var videoId = fullPlaylist[song].snippet.resourceId.videoId;
        var songName = fullPlaylist[song].snippet.title;

        playlistContent.push("<li><div data-videoid='"+videoId+"'>'"+songName+"'</div> <a href='https://www.youtube.com/embed/"+videoId+"' target='utube1'>Paina tästä toni lol</a></li>");
    }
    playlistContent.push("</ul>");
    document.getElementById("YTplaylist").innerHTML = playlistContent.join("");
}

function addSongYTPlaylist(){
//    var xmlhttp = new XMLHttpRequest();
//    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&fields=snippet&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw&access_token=ya29.Ci_8AqkTZPMQGBjhYpeAoyZnZMHKdOs618SO4E7pGtk9SpSSThgXQ9a1glvCePDkyw";
//
//    xmlhttp.onreadystatechange = function() {
//        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            var playlist = JSON.parse(xmlhttp.responseText);
//            console.log(playlist);
////            for (song in playlist.items){
////                fullPlaylist.push(playlist.items[song]);
////            }
//            
////            var pageToken = playlist.nextPageToken;
////            if(pageToken != null){
////                getPlaylistList(pageToken);
////            }
////            else{
////                listFullPlaylist();
////            }
//        }
//    };
    
    window.location = "https://accounts.google.com/o/oauth2/auth"+
    "?client_id=1084945748469-eg34imk572gdhu83gj5p0an9fut6urp5.apps.googleusercontent.com"+
    "&redirect_uri=http://vsmol.github.io/USMS_OST/"+
    "&scope=https://www.googleapis.com/auth/youtube&response_type=token";
    
//    console.log(url);
//    xmlhttp.open("POST", url, true);
//    xmlhttp.setRequestHeader("Authorization", "Bearer ya29.Ci_8Ajirt9LgT2X-IYGqsAs4WVw1gXilAEUEd5TAZeKJUFA6Lr-lsReYltPJKFd6Fg");
//    xmlhttp.send();
}


var fullPlaylist = [];
var weeklyTheme = ["joku", "joku toine", "joku kolmas"];
var accessToken;

var vidId;

var songIndex = 0;

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: { 'controls': 2, 'color':'white' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.cueVideoById(vidId, 0, "Large");
//    event.target.playVideo();
    songIndex += 1;

//    getPlaylistList('');
}

var done = false;
function onPlayerStateChange(event) {
    console.log(event);
    if (event.data == YT.PlayerState.PLAYING && !done) {
      
    }
    else if (event.data == YT.PlayerState.ENDED && !done) {
        changeSong();
    }
}
function stopVideo() {
    player.stopVideo();
}

function changeSong(){
    vidId = fullPlaylist[songIndex].snippet.resourceId.videoId
    player.loadVideoById(vidId, 0, "Large");
//    player.playVideo();
    songIndex += 1;

}

function randomizePlaylist(){
    songIndex = 0;
    fullPlaylist = shuffle(fullPlaylist);
    listFullPlaylist();
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function getPlaylistList(nextPageToken){
    fullPlaylist = [];
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken="+nextPageToken+"&playlistId=PL5edKOlqgjC0nWXzKtua0eTdXQhMvnCvZ&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var playlist = JSON.parse(xmlhttp.responseText);
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
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function listFullPlaylist(){
    
    var playlistContent = [];

    playlistContent.push("<ul>");
    for (song in fullPlaylist){
        if (fullPlaylist[song].snippet.description != "This video is unavailable."){

            var videoId = fullPlaylist[song].snippet.resourceId.videoId;
            var songName = fullPlaylist[song].snippet.title;
            var videoImgURL = fullPlaylist[song].snippet.thumbnails.default.url;

            playlistContent.push("<li><div data-videoid='"+videoId+"'>'"+songName+"'</div> <a href='https://www.youtube.com/embed/"+videoId+"?enablejsapi=1' target='utube1'><img src='"+videoImgURL+"' /></a></li>"); 
        }
    }
    playlistContent.push("</ul>");
    document.getElementById("YTplaylist").innerHTML = playlistContent.join("");
    
    vidId = fullPlaylist[0].snippet.resourceId.videoId;
}

function addSongYTPlaylist(){
    
    console.log();
    
    var video_id = document.getElementById("ytLink").value.split('v=')[1];
    var weeklyRBtn = document.getElementById("weekly").checked;
    var themeRBtn = document.getElementById("theme").checked;
    
    if(video_id == null || (!weeklyRBtn && !themeRBtn)){
        alert('Anna youtube link tai tyyppi');
    }  
    else{
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        console.log(video_id);
        
        var xmlhttp = new XMLHttpRequest();
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&part=snippet&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";
    
        var config = {
             "snippet": {
              "playlistId": "PL5edKOlqgjC0nWXzKtua0eTdXQhMvnCvZ",
              "resourceId": {
               "kind": "youtube#video",
               "videoId": video_id
              },
             }
            }
            
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var playlist = JSON.parse(xmlhttp.responseText);
                getPlaylistList('');
                $("#myModal").hide();
                if(weeklyRBtn){
                    localStorage.setItem("weeklySongGiven", true);
                    localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
                }
                else if(themeRBtn){
                    localStorage.setItem("themeSongGiven", true);
                    localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
//                    localStorage.setItem("dayAddedSong", Date.today().toString('dd.MM.yyyy'))
                }
            }
            if (xmlhttp.readyState == 4 && xmlhttp.status == 401) {
                alert("Bad Login");
                window.location = location.href.replace(location.hash,"");
            }
        };
        
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Authorization", "Bearer " + accessToken);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(config));
    }
}

function googleAccAuth(){      
    window.location = "https://accounts.google.com/o/oauth2/auth"+
    "?client_id=528931390081-dqk00d0834e840k53n5dg76ibq3bc7s0.apps.googleusercontent.com"+
//    "&redirect_uri=http://vsmol.github.io/USMS_OST/"+
    "&redirect_uri="+location.href.replace(location.hash,"")+
    "&scope=https://www.googleapis.com/auth/youtube&response_type=token";
}

function getAuth(){
    var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    accessToken = params.access_token;
    console.log(accessToken);
    
    if(accessToken == null){
        googleAccAuth();
    }
    else{
        openAddPlaylist();
    }
}
$(document).ready(function() {
    $(".close").click(function(){
        $("#myModal").hide();
    });
//    if((localStorage.getItem("dayAddedSong") == Date.today()){
//        localStorage.removeItem("themeSongGiven");
//        localStorage.removeItem("weeklySongGiven");
//    }
    console.log((Date.today() - Date.today().next().tuesday()) / (1000 * 3600 * 24));

});

function openAddPlaylist(){
    $("#myModal").show();
    
    if(localStorage.getItem("dayAddedSong") == Date.next().monday().toString('dd.MM.yyyy')){
        localStorage.removeItem("themeSongGiven");
        localStorage.removeItem("weeklySongGiven");
        localStorage.removeItem("dayAddedSong");
    }
    if(localStorage.getItem("weeklySongGiven") && localStorage.getItem("themeSongGiven")){
        $("#ytLink").attr('disabled',true);
        $("#weekly").attr('disabled',true);
        $("#theme").attr('disabled',true);
        $("#submitYTPLsong").attr('disabled',true);
        
        $("#weeklyText").append(" (Avautuu: " + localStorage.getItem("dayAddedSong")+")");
        $("#themeText").append(" (Avautuu: " + localStorage.getItem("dayAddedSong")+")");
    }
    else if(localStorage.getItem("weeklySongGiven")){
        $("#weekly").attr('disabled',true);
        $("#weeklyText").append(" (Avautuu: " + localStorage.getItem("dayAddedSong")+")");
    }
    else if(localStorage.getItem("themeSongGiven")){
        $("#theme").attr('disabled',true);
        $("#themeText").append(" (Avautuu: " + localStorage.getItem("dayAddedSong")+")");
    }
}
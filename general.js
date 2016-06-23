var fullPlaylist = [];
var weeklyTheme = ["Boss Battle", "Main Menu", "Car game", "Nintendo", "Opening", "Space Theme", "Over 10 years old", "Ending", "Funny", "Sport game", "Horror game", "Arcade game", "Bad OST, but one good song", "Final Fantasy", "Fast-paced", "Fantasy", "Song you never forget", "Happy to go sleep after listening", "Horror"];
var weeklyRandomNumber;
var accessToken;

var vidId;

var songIndex = 0;

var tag = document.createElement('script');

var dbThemeIndex;
var dbThemeDate

google.load('visualization', '1');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: { 'controls': 2, 'color':'red' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.cueVideoById(vidId, 0, "Large");
    getComments(vidId);
//    event.target.playVideo();
//    getPlaylistList('');
}

var done = false;
function onPlayerStateChange(event) {
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
    songIndex += 1;
    if(songIndex >= fullPlaylist.length){
        songIndex = 0;
    }
    vidId = fullPlaylist[songIndex].snippet.resourceId.videoId;
    player.loadVideoById(vidId, 0, "Large");
    player.playVideo();
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

            playlistContent.push("<li><div id='YTvideo' data-listIndex="+song+" data-videoid='"+videoId+"'>'"+songName+"'</div><img src='"+videoImgURL+"' /></a></li>"); 
        }
    }
    playlistContent.push("</ul>");
    document.getElementById("YTplaylist").innerHTML = playlistContent.join("");
    
    vidId = fullPlaylist[0].snippet.resourceId.videoId;
    
    $("#YTplaylist ul li").click(function(){
        var pressedVideoId = $(this).children().attr("data-videoid");
        songIndex = parseInt($(this).children().attr("data-listIndex"));
        player.loadVideoById(pressedVideoId, 0, "Large");
    });
}

function addSongYTPlaylist(){
    var video_id = document.getElementById("ytLink").value.split('v=')[1];
    var weeklyRBtn = document.getElementById("weekly").checked;
    var themeRBtn = document.getElementById("theme").checked;
    if(localStorage.getItem("senderName") != null){
        var videoSender = localStorage.getItem("senderName");
    }
    else{
        var videoSender = document.getElementById("videoSender").value;
    }
    
    if((video_id == null || (!weeklyRBtn && !themeRBtn)) || (videoSender == "" && localStorage.getItem("senderName") == null)){
        alert('Anna youtube link, tyyppi ja lähettäjä');
    }  
    else{
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        console.log(video_id);
        
        var xmlhttp = new XMLHttpRequest();
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";
        var videoNote;
        
        if(weeklyRBtn){
            videoNote = "Weekly - "+ videoSender;
        }
        else if(themeRBtn){
            videoNote = weeklyTheme[weeklyRandomNumber] + " - " + videoSender;
        }
    
        var config = {
             "contentDetails":{
                 "note": videoNote
             },
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
                localStorage.setItem("senderName", videoSender);
                if(weeklyRBtn){
                    localStorage.setItem("weeklySongGiven", true);
                    localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
                }
                else if(themeRBtn){
                    localStorage.setItem("themeSongGiven", true);
                    localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
                }
            }
            if (xmlhttp.readyState == 4 && (xmlhttp.status == 401 || xmlhttp.status == 403)) {
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
    $("#changeSender").click(function(){
        $("#pickSender").show();
        $("#savedSender").hide();
        localStorage.removeItem("senderName");
    });
    $("#submitComment").click(function(){
        var comment = document.getElementById("commentField").value;
        if(comment != null && localStorage.getItem("senderName") != null && vidId != null){
            postComment(localStorage.getItem("senderName"), comment ,vidId);
        }
        else{
            alert('Valitse nimi, lisää kommentti tai video');                      
        }
    });
    
    
    //localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
    console.log(Date.today().toString('dd.MM.yyyy'));
    console.log(localStorage.getItem("dayAddedSong"));
    
    console.log(Date.today().compareTo(Date.parse(localStorage.getItem("dayAddedSong") || Date.today())));
    if(Date.today().compareTo(Date.parse(localStorage.getItem("dayAddedSong") || Date.today())) >= 0){
        localStorage.removeItem("themeSongGiven");
        localStorage.removeItem("weeklySongGiven");
        localStorage.removeItem("dayAddedSong");
    }
    Math.seedrandom(new Date().getWeek());
    weeklyRandomNumber = Math.floor(Math.random() * (weeklyTheme.length - 0 + 1)) + 0;
});

function openAddPlaylist(){
    $("#myModal").show();
    $("#ytLink").val('');
    
    if(localStorage.getItem("senderName") != null){
        $("#senderName").html(localStorage.getItem("senderName"));
        $("#pickSender").hide();
        $("#savedSender").show();
    }
    else{
        $("#savedSender").hide();
    }
    
    $("#weeklyRandomNumber").html("This week theme: " + weeklyTheme[weeklyRandomNumber]);
    
    if(localStorage.getItem("weeklySongGiven") && localStorage.getItem("themeSongGiven")){
        $("#ytLink").attr('disabled',true);
        $("#weekly").attr('disabled',true);
        $("#theme").attr('disabled',true);
        $("#submitYTPLsong").attr('disabled',true);
        
        $("#weeklyText span").html(" (Unlocks: " + localStorage.getItem("dayAddedSong")+")");
        $("#themeText span").html(" (Unlocks: " + localStorage.getItem("dayAddedSong")+")");
    }
    else if(localStorage.getItem("weeklySongGiven")){
        $("#weekly").attr('disabled',true);
        $("#weeklyText span").html(" (Unlocks: " + localStorage.getItem("dayAddedSong")+")");
    }
    else if(localStorage.getItem("themeSongGiven")){
        $("#theme").attr('disabled',true);
        $("#themeText span").html(" (Unlocks: " + localStorage.getItem("dayAddedSong")+")");
    }
}

function getComments(ytid){
    var xmlhttp = new XMLHttpRequest();
    var params = "ytid="+ytid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.response);
            var arrayUser = xmlhttp.response.split('#');
            arrayUser.shift();
            console.log(arrayUser);
            
            var commentContent = [];
            commentContent.push('<ul>');
            for (var x in arrayUser){
                var splitContent = arrayUser[x].split("$");
                commentContent.push('<li><div id="commentorName">'+splitContent[0]+':&nbsp;</div><div id="commentComment">'+splitContent[1]+'</div></li>');
            }
            commentContent.push('</ul>');
            document.getElementById("commentContent").innerHTML = commentContent.join("");
        }
        else {
//            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/getComments.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function postComment(user, comment, ytid){
    var xmlhttp = new XMLHttpRequest();
    
    var params = "user="+user+"&comment="+comment+"&ytid="+ytid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getComments(vidId);
        }
        else {
//            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/postComments.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

var fullPlaylist = [];
var weeklyTheme = ["Boss Battle", "Main Menu", "Car game", "Nintendo", "Opening", "Space Theme", "Over 10 years old", "Ending", "Funny", "Sport game", "Horror game", "Arcade game", "Bad game", "Final Fantasy", "Fast-paced", "Fantasy", "Song you never forget", "Happy to go sleep after listening", "Vocal", "Battle Theme", "Most EPIC song ever", "Stage theme", "Your boss theme", "Feels", "Character Theme", "Stealth", "Awesome Electric Guitar Riff", "Desperate", "Song That Makes you Feel Invicisble", "Toni kävelemäs siwas ympyrää"];

var weeklyThemeDesc = ["Music played during a Boss Battle.", 
                       "Music playing while idling in the Main Menu.", 
                       "Music that belongs in a game of Car Game genre.", 
                       "Music played in Nintendo franchise games.", 
                       "Music that plays on opening cinematic in a game.", 
                       "Music that belongs in a game of Space genre.", 
                       "Music from games that are over 10 years old.", 
                       "Music playing when a game ends.", 
                       "Music that contains funny lyrics and/or funny tune that will surely make someone laugh.", 
                       "Music that belongs in a game of Sport genre.", 
                       "Music that belongs in a game of Horror genre.", 
                       "Music from a game that can be played with Arcade Machines!", 
                       "Music from a bad game you know / have played.", 
                       "Music from the Final Fantasy series.", 
                       "Music containing fast beats that wants you to go FAST!", 
                       "Music that belongs in a game of Fantasy genre.", 
                       "Music that makes you get goosebumps everytime you hear it!", 
                       "Listening to this song will surely make you fall asleep!", 
                       "Music containing lyrics with a vocal singer.", 
                       "Music that plays during a battle.", 
                       "THE MOST EPIC MUSIC MASTERPIECE YOU HAVE EVER WITNESSED", 
                       "Music that plays during a stage in eg. Arcade games.", 
                       "What music would play in the background if you were a boss?", 
                       "Music that WILL make someone cry like a little girl.", 
                       "Music of a specific character.", 
                       "Music that belongs in a game of Stealth genre.", 
                       "Music with unbelieveable riff that will make Through Fire and Flames cry!", 
                       "Music during desperate situations.",
                       "Music that makes you feel you could defeat someone with only one punch!", 
                       "What music would play in the background if you saw Toni walk around Siwa?"];

var weeklyRandomNumber;
var accessToken;

var vidId;

var songIndex = 0;

var tag = document.createElement('script');

var dbThemeIndex;
var dbThemeDate

var thumbGiven = false;

google.load('visualization', '1');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    console.log("onYouTubeIframeAPIReady");
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: { 'controls': 2, 'color':'red' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    fullPlaylist = [];
    getPlaylistList('');
}

function onPlayerReady(event) {
    console.log("onPlayerReady");
    player.cueVideoById(vidId, 0, "Large");
//    getComments();
    getTotalThumbsUserHave();
    getTotalThumbsUserGiven();
    nowPlayingText(vidId);
//    getRatings(vidId);
//    event.target.playVideo();
//    getPlaylistList('');
}

var done = false;
function onPlayerStateChange(event) {
    console.log("onPlayerStateChange");
    if (event.data == YT.PlayerState.PLAYING && done) {
//        nowPlayingText(vidId);
    }
    else if (event.data == YT.PlayerState.ENDED && !done) {
        changeSong();
    }
}
function stopVideo() {
    player.stopVideo();
}

function changeSong(){
    console.log("changeSong");
    songIndex += 1;
    if(songIndex >= fullPlaylist.length){
        songIndex = 0;
    }
    vidId = fullPlaylist[songIndex].snippet.resourceId.videoId;
    getComments();
    getTotalThumbs(vidId);
    nowPlayingText(vidId);
//    getRatings(vidId);
    player.loadVideoById(vidId, 0, "Large");
    player.playVideo();
    
    $("#rateContent ul li div label").removeClass("rateSelected");
    $("#rateContent ul li div input").prop('checked', false);
    
    console.log(songIndex);
    
    $("#YTplaylist").scrollTo("#YTplaylist ul li:nth-child("+(songIndex + 1)+")");
}

jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
    }, speed == undefined ? 1000 : speed); 
    return this; 
};

function randomizePlaylist(){
    console.log("randomizePlaylist");
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
    console.log("getPlaylistList");
//    fullPlaylist = [];
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&maxResults=50&pageToken="+nextPageToken+"&playlistId=PL5edKOlqgjC0nWXzKtua0eTdXQhMvnCvZ&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";

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
    console.log("listFullPlaylist");
    var playlistContent = [];

//    playlistContent.push("<img src='img/playlistBG.png'/>");
    
    playlistContent.push("<ul id='YTListUL'>");
    
    for (song in fullPlaylist){
        console.log(fullPlaylist[song])
        if (fullPlaylist[song].snippet.description != "This video is unavailable." && fullPlaylist[song].snippet.description != "This video is private."){

            var videoId = fullPlaylist[song].snippet.resourceId.videoId;
            var songName = fullPlaylist[song].snippet.title;
            var videoImgURL = fullPlaylist[song].snippet.thumbnails.default.url;
            var senderName = fullPlaylist[song].contentDetails.note.split(" - ");
            var themeSong = "";
            if(senderName[0] != "Weekly"){
                themeSong = "<span style='color: #FFA449'>&#9733</span>";
            }
            playlistContent.push("<li><div id='YTvideo' data-listIndex="+song+" data-videoid='"+videoId+"'>"+songName+" "+themeSong+"<br /> - <span style='color: #EF5682;'>"+senderName[1]+"</span></div><img src='"+videoImgURL+"' /></a></li>");
        }
        //CUSTOM ADD SONGS HERE
        
    }
    playlistContent.push("</ul>");
    document.getElementById("YTplaylist").innerHTML = playlistContent.join("");

    vidId = fullPlaylist[0].snippet.resourceId.videoId;

    $("#YTplaylist ul li").click(function(){
        console.log("#YTplaylist ul li).click");
        vidId = $(this).children().attr("data-videoid");
        songIndex = parseInt($(this).children().attr("data-listIndex"));
        player.loadVideoById(vidId, 0, "Large");
        getComments();
        nowPlayingText(vidId)
        getTotalThumbs(vidId);

//        getRatings(vidId);
        
        $("#rateContent ul li div label").removeClass("rateSelected");
        $("#rateContent ul li div input").prop('checked', false);
    });
}

function addSongYTPlaylist(){
    console.log("addSongYTPlaylist");
    showSpinner();
    var video_id = document.getElementById("ytLink").value.split('v=')[1];
    var weeklyRBtn = document.getElementById("weekly").checked;
    var themeRBtn = document.getElementById("theme").checked;
    
    getUserDisplayName(localStorage.getItem("userID"), function(displayName){
       if(displayName != null){
            var videoSender = displayName;
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
                    //  "note": "free"
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
                    fullPlaylist = [];
                    getPlaylistList('');
                    $("#myAddSong").modal('hide');
                    localStorage.setItem("senderName", videoSender);
                    var weekly = 0;
                    var theme = 0;
                    var themeName = "";
                    if(weeklyRBtn){
//                        localStorage.setItem("weeklySongGiven", true);
//                        localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
                        weekly = 1;
                    }
                    else if(themeRBtn){
//                        localStorage.setItem("themeSongGiven", true);
//                        localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
                        theme = 1;
                        themeName = weeklyTheme[weeklyRandomNumber];
                    }
                    getYoutubeVideoInfo(video_id, weekly, theme, themeName);
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
    });
}

function getYoutubeVideoInfo(ytid, weekly, theme, themeName){
    console.log("getYoutubeVideoInfo");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+ytid+"&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var playlist = JSON.parse(xmlhttp.responseText);
            var sname = playlist.items[0].snippet.title;
            var vidimgurl = playlist.items[0].snippet.thumbnails.default.url;
            
            postYoutubeSong(localStorage.getItem("userID"), ytid, encodeURIComponent(sname), vidimgurl, weekly, theme, themeName);
        }
        if (xmlhttp.readyState == 4 && (xmlhttp.status == 401 || xmlhttp.status == 403)) {
//            alert("Bad Login");
//            window.location = location.href.replace(location.hash,"");
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function googleAccAuth(){
    console.log("googleAccAuth");
    window.location = "https://accounts.google.com/o/oauth2/auth"+
    "?client_id=528931390081-dqk00d0834e840k53n5dg76ibq3bc7s0.apps.googleusercontent.com"+
//    "&redirect_uri=http://vsmol.github.io/USMS_OST/"+
    "&redirect_uri="+location.href.replace(location.hash,"")+
    "&scope=https://www.googleapis.com/auth/youtube&response_type=token";
}

function getAuth(){
    console.log("getAuth");
    if(localStorage.getItem("userID") != null){
        var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        accessToken = params.access_token;

        if(accessToken == null){
            googleAccAuth();
        }
        else{
            openAddPlaylist();
        }
    }
    else{
        alert("Bad login");
    }
}
$(document).ready(function() {
    $("#closeAddSong").click(function(){
        console.log("$(.close).click");
        $("#myAddSong").modal('hide');
    });
    $("#closeSlack").click(function(){
        console.log("$(.close2).click");
        $("#mySlackList").hide();
    });
    $("#closeThumb,  #thumbList").click(function(e){
//        e.preventDefault();
//        $('#overlay, #thumbList').fadeOut(400, function() {
//            $('#thumbList').hide();
//        });
//      
////        $("#thumbList").hide();
    });
    $("#changeSender").click(function(){
        console.log("$(#changeSender).click");
        $("#pickSender").show();
        $("#savedSender").hide();
        localStorage.removeItem("senderName");
    });
    $("#submitComment").click(function(){
        console.log("$(#submitComment).click");
        var comment = document.getElementById("commentField").value;
        if(comment != "" && localStorage.getItem("userID") != null && vidId != null){
            postComment(localStorage.getItem("userID"), comment);
        }
        else{
            alert('Valitse nimi, lisää kommentti tai video');                      
        }
    });
    
    $(".radiolabel").hover(function(){
        if(!$(this).children("input").is(":checked")){
            $(this).children("label").addClass("rateHover");
            
            $(this).children("label").removeClass("rateNormal");
            $(this).children("label").removeClass("rateSelected");
        }
    });
    $(".radiolabel").mouseleave(function(){
        if(!$(this).children("input").is(":checked")){
            $(this).children("label").addClass("rateNormal");
            
            $(this).children("label").removeClass("rateHover");
            $(this).children("label").removeClass("rateSelected");
        }
    });

    $(".radiolabel").click(function(){
        $(".radiolabel").children("label").each(function(){
            $(this).addClass("rateNormal");
            
            $(this).removeClass("rateHover");
            $(this).removeClass("rateSelected");
        });

        $(this).children("label").addClass("rateSelected");
    });
    
    //localStorage.setItem("dayAddedSong", Date.next().monday().toString('dd.MM.yyyy'));
    if(Date.today().compareTo(Date.parse(localStorage.getItem("dayAddedSong") || Date.today())) >= 0){
        localStorage.removeItem("themeSongGiven");
        localStorage.removeItem("weeklySongGiven");
        localStorage.removeItem("dayAddedSong");
    }
});



//function get8PastThemes(){
//    console.log("get8PastThemes");
//    var xmlhttp = new XMLHttpRequest();
//    xmlhttp.onreadystatechange = function() {
//        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            var array = xmlhttp.response.split('@');
//            array.shift();
//            
//            if(array.length <= 8){
//                postNewTheme(array);
//            }
//            else{
//            }
//        }
//        else {
////            console.log(xmlhttp);   
//        }
//    };
//    xmlhttp.open("POST", "php/getLast8Themes.php", true);
//    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//    xmlhttp.send();
//}

function postNewTheme(themeArray){
    console.log("postNewTheme");

    var differentNumber = 0;
    var rand;

    while(differentNumber != -1){
//    for(var i = 0; i < 50; i++){
        rand = Math.floor(Math.random() * (weeklyTheme.length - 0) + 0);
        differentNumber = jQuery.inArray(rand, themeArray )
    }
    var xmlhttp = new XMLHttpRequest();
    var params = "rnumber="+rand+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp);
            editThemeHtml();
        }
        else {
            console.log(xmlhttp);
        }
    };
    xmlhttp.open("POST", "php/postRandomTheme.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getNewestTheme(){
    console.log("getNewestTheme");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            editThemeHtml(parseInt(xmlhttp.responseText));
        }
        else {
//            console.log(xmlhttp);   
        }
    };
    xmlhttp.open("POST", "php/getNewestTheme.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}


function openAddPlaylist(){
    console.log("openAddPlaylist");
    $('#myAddSong').modal({
      backdrop: true
    })
    $("#ytLink").val('');
    
    if(localStorage.getItem("userID") != null){
        getUserDisplayName(localStorage.getItem("userID"),function(displayName){
            $("#senderName").html(displayName);
            $("#pickSender").hide();
            $("#savedSender").show();
        });
    }
    else{
        $("#savedSender").hide();
    }
    getNewestTheme();

//    get8PastThemes();
}

function editThemeHtml(themeNumber){
    $("#weeklyRandomNumber").html("This week theme: <u>" + weeklyTheme[themeNumber] + "</u><span class='tooltiptext'>"+weeklyThemeDesc[themeNumber]+"</span>");
    
    weeklyRandomNumber = themeNumber;
    
    var weekly = false;
    var theme = false;
    var unlockDate;
    
    getUserSlackList(localStorage.getItem("userID"), function(userSlack){
        var slackData = userSlack[0].split("$");
        if(slackData[0] == 1 ){
            // weekly = true;
        }
        if(slackData[1] == 1){
            theme = true;   
        }
        unlockDate = Date.today().next().friday().toString("dd.MM.yyyy");
        if(weekly && theme){
            $("#ytLink").attr('disabled',true);
            $("#weekly").attr('disabled',true);
            $("#theme").attr('disabled',true);
            $("#submitYTPLsong").attr('disabled',true);
            
            $("#weeklyText span").html(" (Unlocks: " + unlockDate+")");
            $("#themeText span").html(" (Unlocks: " + unlockDate+")");
        }
        // else if(weekly){
        //     $("#weekly").attr('disabled',true);
        //     $("#weeklyText span").html(" (Unlocks: " + unlockDate+")");
        // }
        else if(theme){
            $("#theme").attr('disabled',true);
            $("#themeText span").html(" (Unlocks: " + unlockDate+")");
        }
    });
}

function getUserSlackList(uid, userFunction){
    console.log("getUserSlackList");
    var xmlhttp = new XMLHttpRequest();
    
    var params = "user="+uid;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayUser = xmlhttp.response.split('@');
            arrayUser.shift();
            userFunction(arrayUser);
        }
        else {
            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/getUserSlackList.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getComments(){
    console.log("getComments");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayUser = xmlhttp.response.split('@');
            arrayUser.shift();
            
            var commentContent = [];
            commentContent.push('<ul>');
            for (var x in arrayUser){
                var splitContent = arrayUser[x].split("$");
                commentContent.push('<li><div id="commentorName" style="color: '+splitContent[2]+'">'+splitContent[0]+':&nbsp;</div><div id="commentComment">'+splitContent[1]+'</div></li>');
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
    xmlhttp.send();
}

function postComment(user, comment){
    console.log("postComment");
    var xmlhttp = new XMLHttpRequest();
    
    var params = "user="+user+"&comment="+comment;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.response);
            $("#commentField").val("");
            getComments();
        }
        else {
            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/postComments.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function postRating(userid, rate, ytid){
    var xmlhttp = new XMLHttpRequest();
    
    var params = "userid="+userid+"&rating="+rate+"&ytid="+ytid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            nowPlayingText(ytid);
//            getRatings(ytid);
        }
        else {
//            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/postSongRate.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function nowPlayingText(ytid){
    console.log("nowPlayingText");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+ytid+"&key=AIzaSyA17v8PuNBsIwgbxg6D78iHV-w7_dYyXPw";
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var playlist = JSON.parse(xmlhttp.responseText);
            // $("#nowPlaying > marquee > span").html(playlist.items[0].snippet.title)
            $("#YTplaylist ul li").removeClass("currentSong");
            $("#YTplaylist ul li").each(function(){
                if($(this).children().attr("data-videoid") == vidId){
                    $(this).addClass("currentSong");
                }
            });
        }
        if (xmlhttp.readyState == 4 && (xmlhttp.status == 400 || xmlhttp.status == 403 || xmlhttp.status == 404)) {
            $("#nowPlaying > span").html("Error finding song name");
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
}

//function getRatings(ytid){
//    console.log("getRatings");
//    var xmlhttp = new XMLHttpRequest();
//    var params = "ytid="+ytid+"";
//    xmlhttp.onreadystatechange = function() {
//        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            var rating = xmlhttp.response;
//            document.getElementById("averageRating").innerHTML = xmlhttp.response ? xmlhttp.response : 0;
//            if(localStorage.getItem("userID") != null){
//                getCheckRated(localStorage.getItem("userID"), ytid);
//            }
//            else{
//                document.getElementById("submitRating").innerHTML = "<div  style='margin-top: 62px;'>Log in to rate<div>";
//            }
//        }
//        else {
////            console.log(xmlhttp);   
//        }
//    };
//
//    xmlhttp.open("POST", "php/getSongRate.php", true);
//    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//    xmlhttp.send(params);
//}

function getCheckRated(userid, ytid){
    console.log("getCheckRated");
    var xmlhttp = new XMLHttpRequest();
    var params = "userid="+userid+"&ytid="+ytid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var rating = xmlhttp.response;
            if(rating >= 1){
                 document.getElementById("submitRating").innerHTML = "<div  style='margin-top: 62px;'>Arvosana annettu<div>"
            }
            else{
                document.getElementById("submitRating").innerHTML = "<button id='submitRatingBtn' style='margin-top: 20px;' onclick='submitRate()'>Rate</button>";
            }
        }
        else {
//            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/getCheckRated.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function submitRate(){
    console.log("submitRate");
    var rate = $('input[name="amount"]:checked').val();

    if(localStorage.getItem("userID") != null){
        if(rate != null){
            postRating(localStorage.getItem("userID"), rate ,vidId);
            console.log($("#rateContent ul li div input"));
            $("#rateContent ul li div label").removeClass("rateSelected");
            $("#rateContent ul li div input").prop('checked', false); 
        }
        else{
            alert('Anna arvosana');                      
        }
    }
    else{
        alert("Log in");
    }
}

function loginOST(){
    console.log("loginOST");
    var userName = $("#user").val();
    var passWord = $("#pass").val();
    
    console.log(userName);
    console.log(passWord);
    
    var xmlhttp = new XMLHttpRequest();
    var params = "user="+userName+"&pass="+passWord+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var loginInfo = xmlhttp.response;
            if(!loginInfo == ""){
                localStorage.setItem("userID", loginInfo);
                checkLogin();
            }
            else{
                alert("Bad username or password");
            }
        }
        else {
//            console.log(xmlhttp);   
        }
    };

    xmlhttp.open("POST", "php/getLogin.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getUserDisplayName(userId, userFuntion){
    console.log("getUserDisplayName");
    var userID = userId;
    
    var xmlhttp = new XMLHttpRequest();
    var params = "id="+userID;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var loginInfo = xmlhttp.response;
            userFuntion(loginInfo);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            
        }
    };
    xmlhttp.open("POST", "php/getDisplayName.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getUserTextcolor(displayName, userFuntion){
    console.log("getUserTextcolor");
    var xmlhttp = new XMLHttpRequest();
    var params = "dname="+displayName;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var textcolor = xmlhttp.response;
            userFuntion(textcolor);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            
        }
    };

    xmlhttp.open("POST", "php/getUserTextColor.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function checkLogin(){
    var userid = localStorage.getItem("userID");
    if(userid != null){
        $("#yesLogin").show();
        $("#noLogin").hide();
        getUserDisplayName(userid, function(displayName){
            document.getElementById("loginWelcome").innerHTML = "Welcome " + displayName;
        })
    }
    else{
        $("#noLogin").show();
        $("#yesLogin").hide();
    }
}

function postYoutubeSong(userid, ytid, sname, vidimgurl, weekly, theme, themeName){
    console.log("postYoutubeSong");
    var xmlhttp = new XMLHttpRequest();
    var date = Date.next().monday().toString('dd.MM.yyyy');
    var params = "user="+userid+"&ytid="+ytid+"&songname="+sname+"&unlockdate="+date+"&videoimgurl="+vidimgurl+"&weekly="+weekly+"&theme="+theme+"&themeName="+themeName+"";
    // var params = "user="+userid+"&ytid="+ytid+"&songname="+sname+"&unlockdate="+date+"&videoimgurl="+vidimgurl+"&weekly=0&theme=0&themeName=free";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            hideSpinner();
            postSlackList(userid, weekly, theme);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            hideSpinner();
        }
    };
    xmlhttp.open("POST", "php/postYoutubeVideoList.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function postSlackList(uid, week, theme){
    console.log("changeSlackList");
    console.log(week);
    console.log(theme);
    var xmlhttp = new XMLHttpRequest();
    var params = "user="+uid+"&week="+week+"&theme="+theme+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp);
        //    changeSlackList(userid, weekly, theme);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            
        }
    };
    xmlhttp.open("POST", "php/postSlackList.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getYoutubeUserSong(userid, checkSongUnlock){
    console.log("getYoutubeUserSong");
    var xmlhttp = new XMLHttpRequest();
    var params = "userID="+userid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var songList = xmlhttp.response.split("#");
            songList.shift();
            checkSongUnlock(songList);
//            checkSongUnlock(xmlhttp.response)
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            
        }
    };
    xmlhttp.open("POST", "php/getYoutubeUserSong.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function openSongChecklist(){
    $('#mySlackList').modal({
        backdrop: true,
    });
    
    getSlackList(function(userSongChecklist){
        console.log(userSongChecklist);
        checkListContent = [];
        checkListContent.push("<table style='width:100%; text-align: center; border-spacing: 0px; padding: 10px; font-size: 20px'>");
        checkListContent.push("<tr> <th>Name</th> <th>Weekly</th> <th>Theme</th> </tr>");
        for (var x in userSongChecklist){
            var arrayContent = userSongChecklist[x].split("$");
            checkListContent.push('<tr><td>'+arrayContent[0]+'</td>')
            if(arrayContent[1] == 1){
                checkListContent.push('<td style="color:#0cc700">&#9733;</td>');
            }
            else{
                checkListContent.push('<td style="color:#f10000">&#9734;</td>');
            }
            if(arrayContent[2] == 1){
                checkListContent.push('<td style="color:#0cc700">&#9733;</td>');
            }
            else{
                checkListContent.push('<td style="color:#f10000">&#9734;</td>');
            }
            checkListContent.push('</tr>');
        }
        checkListContent.push('</table>');
        document.getElementById("popupChecklist").innerHTML = checkListContent.join("");
    });
}

function getSlackList(userFuntion){
    console.log("getSlackList");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayUser = xmlhttp.response.split('@');
            arrayUser.shift();
            userFuntion(arrayUser)
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei toimi");
        }
    };
    xmlhttp.open("POST", "php/getSlackList.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

//function getUserSongPostedInfo(userFuntion){
//    console.log("getUserSongPostedInfo");
//    var xmlhttp = new XMLHttpRequest();
//    xmlhttp.onreadystatechange = function() {
//        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            var arrayUser = xmlhttp.response.split('@');
//            arrayUser.shift();
//            userFuntion(arrayUser)
//        }
//        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
//            console.log("ei toimi");
//        }
//    };
//    xmlhttp.open("POST", "php/getUserSongPostedInfo.php", true);
//    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//    xmlhttp.send();
//}

function getUserSongThumbs(userid, ytid){
    console.log("getUserSongThumbs");
    var params = "user="+userid+"&ytid="+ytid+"";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayResponse = xmlhttp.response.split('@');
            arrayResponse.shift();
            if(arrayResponse[0] > 0){
                $("#thumbsUpAdd").attr("src", "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
                $("#thumbsUp").addClass("no-events");
            }
            else if(!thumbGiven){
                $("#thumbsUpAdd").attr("src", "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
                $("#thumbsUp").removeClass("no-events");
            }
            else{
                $("#thumbsUpAdd").attr("src", "img/pokaaliPlus.png");
                $("#thumbsUp").removeClass("no-events");
            }
//            getTotalThumbs(ytid);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
//            $("#thumbsUpIcon").html("&#9744");
//            $("#thumbsUp").removeClass("no-events");
        }
    };
    xmlhttp.open("POST", "php/getUserSongThumbs.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getTotalThumbs(ytid){
    console.log("getTotalThumbs");
    var params = "&ytid="+ytid+"";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayResponse = xmlhttp.response.split('@');
            arrayResponse.shift();
//            $("#thumbsUp span").html(arrayResponse[0] + " / 8");
            if(arrayResponse[0] >= 1 && arrayResponse[0] < 3){
                $("#thumbsUpIcon").attr("src", "img/pokaaliBr.png");
                $("#thumbsUp").addClass("no-events");
                thumbGiven = true;
            }
            else if(arrayResponse[0] >= 3 && arrayResponse[0] < 5){
                $("#thumbsUpIcon").attr("src", "img/pokaaliSv.png");
                $("#thumbsUp").addClass("no-events");
                thumbGiven = true;
            }
            else if(arrayResponse[0] >= 5 && arrayResponse[0] < 7){
                $("#thumbsUpIcon").attr("src", "img/pokaaliGl.png");
                $("#thumbsUp").addClass("no-events");
                thumbGiven = true;
            }
            else if(arrayResponse[0] >= 7){
                $("#thumbsUpIcon").attr("src", "img/pokaaliDi.png");
                $("#thumbsUp").addClass("no-events");
                thumbGiven = true;
            }
            else{
                $("#thumbsUpIcon").attr("src", "img/pokaaliPlus.png");
                $("#thumbsUpAdd").attr("src", "");
                $("#thumbsUp").removeClass("no-events");
                thumbGiven = false;
            }
            if(localStorage.getItem("userID") != null){
                getUserSongThumbs(localStorage.getItem("userID"), ytid);
            }
            else{
                $("#thumbsUp").addClass("no-events");
            }
            hideSpinner();
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            $("#thumbsUp").removeClass("no-events");
            hideSpinner();
        }
    };
    xmlhttp.open("POST", "php/getTotalThumbs.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function clickPostSongThumbs(){
    postSongThumbs(vidId, localStorage.getItem("userID"));
}

function postSongThumbs(ytid, userid){
    console.log("postSongThumbs");
    showSpinner();
    var xmlhttp = new XMLHttpRequest();
    var params = "user="+userid+"&ytid="+ytid+"";
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            getUserSongThumbs(ytid, userid);
            
            getTotalThumbs(ytid);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/postSongThumbs.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function getThumbslist(){
//    $("#thumbList").show();
    
    $('#thumbList').modal({
        backdrop: true,
    });
    
    console.log("getThumbslist");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayResponse = xmlhttp.response.split('@');
            arrayResponse.shift();
            
            var thumblistContent = [];

            
            thumblistContent.push("<table style='width:100%; text-align: center; border-spacing: 0px; padding: 10px; font-size: 20px'>");
            thumblistContent.push('<col width="5%"><col width="70%"><col width="20%"><col width="5%">');
            thumblistContent.push("<tr> <th></th> <th>Song name</th> <th>Sender</th> <th></th> </tr>");
            
            
            for (thumbsong in arrayResponse){
                
                var thumbData = arrayResponse[thumbsong].split("$");
                var thumbimage = "";
                thumblistContent.push('<tr>');
                thumblistContent.push('<td data-videoid='+thumbData[2]+'><i class="material-icons">&#xE039;</i></td>');
                thumblistContent.push('<td>'+thumbData[0]+'</td>');
                thumblistContent.push('<td>'+thumbData[3]+'</td>');
                if(thumbData[1] >= 1 && thumbData[1] < 3){
                    thumbimage = "img/pokaaliBr.png";
                }
                else if(thumbData[1] >= 3 && thumbData[1] < 5){
                    thumbimage = "img/pokaaliSv.png";
                }
                else if(thumbData[1] >= 5 && thumbData[1] < 7){
                    thumbimage = "img/pokaaliGl.png";
                }
                else if(thumbData[1] >= 7){
                    thumbimage = "img/pokaaliDi.png";
                }
                
                thumblistContent.push('<td style="color:#0cc700"><img width="20px" src="'+thumbimage+'"></td>');
                thumblistContent.push('</tr>');
            }
            
            thumblistContent.push('</table>');

            
            document.getElementById("popupthumblist").innerHTML = thumblistContent.join("");
            
            $("#popupthumblist table tr td:first-child").click(function(){
                console.log("#popupthumblist table tr td");
                
                vidId = $(this).attr("data-videoid");

                for(var song in fullPlaylist){
                    if(fullPlaylist[song].contentDetails.videoId == vidId){
                       songIndex = song;
                    }
                }
                
                player.loadVideoById(vidId, 0, "Large");
                // getComments();
                nowPlayingText(vidId)
                getTotalThumbs(vidId);
                $("#YTplaylist").scrollTo("#YTplaylist ul li:nth-child("+(parseInt(songIndex) + 1)+")");
            });
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/getThumbList.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function autotest(){
    console.log("autotest");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.response);
//            getUserSongThumbs(ytid, userid);
//            getTotalThumbs(ytid);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/autoRandomTheme.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function getTotalThumbsUserHave(){
    console.log("getTotalThumbsUserHave");   
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayResponse = xmlhttp.response.split('@');
            console.log(xmlhttp.response);
                        
            arrayResponse.shift();
            var thumblistContent = [];
            
            thumblistContent.push("<ul>");
            for (var thumbuser in arrayResponse){
                var thumbData = arrayResponse[thumbuser].split("$");
                            console.log(thumbData);

                var crownSrc = "";
                
                if(thumbuser == 0){
                    crownSrc = "img/Simple_gold_crown.svg";
                }
                else if(thumbuser == 1){
                    crownSrc = "img/Simple_silver_crown.svg";
                }
                else if(thumbuser == 2){
                    crownSrc = "img/Simple_bronze_crown.svg";
                }
                else{
                    crownSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                }
                
                thumblistContent.push('<li>'+
                                    '<div style="display: flex; align-items: center; justify-content: center;">'+
                                      '<img src="'+crownSrc+'" width="20">'+
                                      '<div class="user-name">'+thumbData[1]+'</div>'+
                                    '</div>'+
                                    '<div class="user-thumbs">'+thumbData[0]+' <span class="user-thumbs" style="color: #01b501; font-weight: bold;">+'+thumbData[2]+'</span> </div>'+
                                    ''+
                                    '</li>');
            }
            thumblistContent.push("</ul>");
            document.getElementById("totalThumbsGotList").innerHTML = thumblistContent.join("");
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/getUserTotalThumbs.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function getTotalThumbsUserGiven(){
    console.log("getTotalThumbsUserGiven");   
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var arrayResponse = xmlhttp.response.split('@');
            arrayResponse.shift();

            var thumblistContent = [];
            
            thumblistContent.push("<ul>");
            for (var thumbuser in arrayResponse){
                var thumbData = arrayResponse[thumbuser].split("$");
                
                var crownSrc = "";
                
                if(thumbuser == 0){
                    crownSrc = "img/Simple_gold_crown.svg";
                }
                else if(thumbuser == 1){
                    crownSrc = "img/Simple_silver_crown.svg";
                }
                else if(thumbuser == 2){
                    crownSrc = "img/Simple_bronze_crown.svg";
                }
                else{
                    crownSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                }
                
                thumblistContent.push('<li>'+
                                    '<div style="display: flex; align-items: center; justify-content: center;">'+
                                      '<img src="'+crownSrc+'" width="20">'+
                                      '<div class="user-name">'+thumbData[1]+'</div>'+
                                    '</div>'+
                                    '<div class="user-thumbs">'+thumbData[0]+'</div>'+
                                    '</li>');
            }
            thumblistContent.push("</ul>");
            document.getElementById("totalThumbsGivenList").innerHTML = thumblistContent.join("");
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/getTotalThumbsGiven.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function autoUpdateThumbsGiven(){
    console.log("getTotalThumbsUserGiven");   
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log("okei");
            console.log(xmlhttp.response);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200){
            console.log("ei onnaa");
        }
    };
    xmlhttp.open("POST", "php/autoUpdateThumbsGiven.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function showSpinner(){
    $("#spinner").show();
}
function hideSpinner(){
    $("#spinner").hide();
}
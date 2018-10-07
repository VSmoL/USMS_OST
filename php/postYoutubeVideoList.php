<?php
    $userid = $_POST['user'];
    $ytid = $_POST['ytid'];
    $songname = $_POST['songname'];
    $unlockdate = $_POST['unlockdate'];
    $videoimgurl = $_POST['videoimgurl'];
    $weekly = $_POST['weekly'];
    $theme = $_POST['theme'];
    $themeName = $_POST['themeName'];

    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_Playlist (SendUserId, YoutubeID, SongName, VideoImageURL, WeeklySong, ThemeSong, ThemeName, Unlockdate)
                            VALUES ("'.$userid.'", "'.$ytid.'", "'.$songname.'",  "'.$videoimgurl.'", "'.$weekly.'", "'.$theme.'", "'.$themeName.'", "'.$unlockdate.'")');
?>
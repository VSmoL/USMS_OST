<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT USMS_Playlist.SongName, COUNT(USMS_Thumbs.id), USMS_Playlist.YoutubeID, USMS_Users.DisplayName 
FROM USMS_Playlist INNER JOIN USMS_Thumbs ON USMS_Playlist.YoutubeID = USMS_Thumbs.songId INNER JOIN USMS_Users ON USMS_Playlist.SendUserId =  USMS_Users.id WHERE USMS_Thumbs.senderId != 4 GROUP BY USMS_Playlist.id ORDER BY COUNT(USMS_Thumbs.id) DESC');

    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1]."$".$row[2]."$".$row[3];
    }
?>
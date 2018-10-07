<?php

    //Haetaan teemat
    //$dsn = 'sqlite:../db/USMSOST.db';
    $dsn = 'sqlite:/home/r203637/public_html/usms_ost/db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $themelist = $db->query('DELETE FROM USMS_SecondLastWeeksThumbs');
    $themelist = $db->query('INSERT INTO USMS_SecondLastWeeksThumbs SELECT * FROM USMS_LastWeeksThumbs')
    $themelist = $db->query('DELETE FROM USMS_LastWeeksThumbs');
    $themelist = $db->query('INSERT
INTO USMS_LastWeeksThumbs
SELECT USMS_Users.id, COUNT(USMS_Playlist.SendUserId)
FROM USMS_Thumbs
INNER JOIN USMS_Playlist ON USMS_Thumbs.songId = USMS_Playlist.YoutubeID
INNER JOIN USMS_Users ON USMS_Playlist.SendUserId = USMS_Users.id
GROUP BY USMS_Playlist.SendUserId
ORDER BY COUNT (USMS_Playlist.SendUserId) DESC');
    
    echo "thumbs given update";
?>



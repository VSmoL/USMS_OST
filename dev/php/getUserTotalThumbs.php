<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
//    $results = $db->query('SELECT COUNT (USMS_Playlist.SendUserId), USMS_Users.DisplayName 
//                                    FROM USMS_Thumbs
//                                    INNER JOIN USMS_Playlist ON USMS_Thumbs.songId = USMS_Playlist.YoutubeID
//                                    INNER JOIN USMS_Users ON USMS_Playlist.SendUserId = USMS_Users.id
//                                    GROUP BY USMS_Playlist.SendUserId
//                                    ORDER BY COUNT (USMS_Playlist.SendUserId) DESC');
    $results = $db->query('SELECT COUNT (USMS_Playlist.SendUserId), USMS_Users.DisplayName, 
(
SELECT SUM(USMS_LastWeeksThumbs.thumbs - USMS_SecondLastWeeksThumbs.thumbs)
FROM USMS_LastWeeksThumbs

INNER JOIN USMS_SecondLastWeeksThumbs ON USMS_LastWeeksThumbs.userId = USMS_SecondLastWeeksThumbs.userid
WHERE USMS_LastWeeksThumbs.userId = USMS_Users.id
GROUP BY USMS_LastWeeksThumbs.userId
) as TotalThumbs
                                    FROM USMS_Thumbs
                                    INNER JOIN USMS_Playlist ON USMS_Thumbs.songId = USMS_Playlist.YoutubeID
                                    INNER JOIN USMS_Users ON USMS_Playlist.SendUserId = USMS_Users.id
                                    GROUP BY USMS_Playlist.SendUserId
                                    ORDER BY COUNT (USMS_Playlist.SendUserId) DESC');
    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1]."$".$row[2];
    }
?>
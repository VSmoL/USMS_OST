<?php
    $dsn = "sqlite:../db/USMSOST.db";
    $db = new PDO($dsn, null, null);
    $results = $db->query('select USMS_Users.DisplayName, case when sum(USMS_Playlist.WeeklySong) > 0 AND DATE(USMS_Playlist.time_created) > DATE("now", "weekday 0", "-7 days")  then 1 else 0 end [weekly], case when sum(USMS_Playlist.ThemeSong) > 0 AND  DATE(USMS_Playlist.time_created) > DATE("now", "weekday 0", "-7 days") then 1 else 0 end [daily] from USMS_Playlist INNER JOIN  USMS_Users on USMS_Users.id = USMS_Playlist.SendUserId group by USMS_Playlist.SendUserId');
    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1]."$".$row[2];
    }
?>
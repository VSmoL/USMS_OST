<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT USMS_Users.DisplayName, USMS_CheckSongPosted.weekly, USMS_CheckSongPosted.theme FROM USMS_CheckSongPosted INNER JOIN USMS_Users ON USMS_Users.id = USMS_CheckSongPosted.senderId');

    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1]."$".$row[2];
    }
?>
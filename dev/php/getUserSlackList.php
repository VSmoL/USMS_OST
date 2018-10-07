<?php
    $user = $_POST['user'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT weekly, theme FROM USMS_CheckSongPosted WHERE senderId = '.$user.'');

    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1];
    }
?>
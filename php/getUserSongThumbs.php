<?php
    $userid = $_POST['user'];
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT count(id) FROM USMS_Thumbs WHERE songId = "'.$ytid.'" AND senderId = "'.$userid.'" AND senderId != 4');

    foreach ($results as $row)
    {
        echo "@".$row[0];
    }
?>
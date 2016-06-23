<?php
    $ytid = $_POST['ytid'];
//    echo $ytid;
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
//    $results = $db->query('SELECT * FROM USMS_Comment WHERE YoutubeID="'.$ytid.'"');
    $results = $db->query('SELECT * FROM USMS_Comment WHERE YoutubeID = "86IrPxjnLEA"');

    foreach ($results as $row)
    {
        echo "#".$row[1]."$".$row[2];
    }
?>
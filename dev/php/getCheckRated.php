<?php
    $userid = $_POST['userid'];
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT * FROM USMS_Ratings WHERE YoutubeID = "'.$ytid.'" AND UserID = "'.$userid.'"');

    $row = $results->fetch(PDO::FETCH_ASSOC);

    if($row){
        echo 1;
    }
    else{
        echo 0;
    }
?>
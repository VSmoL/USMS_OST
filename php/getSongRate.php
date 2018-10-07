<?php
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT * FROM USMS_Ratings WHERE YoutubeID = "'.$ytid.'"');
    $rateAverage = 0;
    $rateCnt = 0;

//    if($row){
        foreach ($results as $row)
        {
            $rateCnt += 1;
            $rateAverage += $row[2];
            
        }
        if($rateCnt != 0){
            echo round($rateAverage / $rateCnt, 1, PHP_ROUND_HALF_UP);
        }
        else{
            echo "Ei arvosanoja!";
        }
?>
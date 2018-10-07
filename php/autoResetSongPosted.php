<?php

    //Haetaan teemat
    $dsn = 'sqlite:/home/r203637/public_html/usms_ost/db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $themelist = $db->query('UPDATE USMS_CheckSongPosted SET weekly = 0, theme = 0');
    
    echo "Slacklist reset";
?>
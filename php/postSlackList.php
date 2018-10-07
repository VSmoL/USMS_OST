<?php
    $user = $_POST['user'];
    $week = $_POST['week'];
    $theme = $_POST['theme'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    echo $week;
    echo $theme;
    if($week == 1){
        $db->query('UPDATE USMS_CheckSongPosted SET weekly = '.$week.' WHERE senderId = '.$user.'');
    }
    else if($theme == 1){
        $db->query('UPDATE USMS_CheckSongPosted SET theme = '.$theme.' WHERE senderId = '.$user.'');
    }
?>
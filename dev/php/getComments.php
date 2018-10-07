<?php
//    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
//    $results = $db->query('SELECT USMS_Users.DisplayName, USMS_Comment.CommentText, USMS_Users.TextColor FROM USMS_Comment INNER JOIN USMS_Users on USMS_Comment.UserID = USMS_Users.id WHERE USMS_Comment.YoutubeID = "'.$ytid.'"');
    $results = $db->query('SELECT USMS_Users.DisplayName, USMS_Comment.CommentText, USMS_Users.TextColor FROM USMS_Comment INNER JOIN USMS_Users on USMS_Comment.UserID = USMS_Users.id ORDER BY USMS_Comment.ID DESC');

    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1]."$".$row[2];
    }
?>
<?php
    $user = $_POST['user'];
    $comment = $_POST['comment'];
//    $ytid = $_POST['ytid'];

    echo $user;

    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
//    $db->query('INSERT INTO USMS_Comment (UserID, CommentText, YoutubeID)
//                            VALUES ("'.$user.'", "'.$comment.'", "'.$ytid.'")');
    $db->query('INSERT INTO USMS_Comment (UserID, CommentText)
                            VALUES ("'.$user.'", "'.$comment.'")');
?>
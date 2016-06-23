<?php
    $user = $_POST['user'];
    $comment = $_POST['comment'];
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_Comment (UserName, CommentText, YoutubeID)
                            VALUES ("'.$user.'", "'.$comment.'", "'.$ytid.'")');
?>
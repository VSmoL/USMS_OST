<?php
    $theme = $_POST['theme'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
//    $db->query('INSERT INTO USMS_Comment (UserID, CommentText, YoutubeID)
//                            VALUES ("'.$user.'", "'.$comment.'", "'.$ytid.'")');
    $db->query('INSERT INTO USMS_ThemeList (ThemeName) VALUES ("'.$theme.'")');
?>
<?php
    $user = $_POST['userid'];
    $rating = $_POST['rating'];
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_Ratings (UserID, rating, YoutubeID)
                            VALUES ("'.$user.'", "'.$rating.'", "'.$ytid.'")');
?>
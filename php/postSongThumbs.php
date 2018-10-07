<?php
    $user = $_POST['user'];
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_Thumbs (songId, senderId) VALUES ("'.$ytid.'","'.$user.'")');
?>
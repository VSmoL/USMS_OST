<?php
    $ytid = $_POST['ytid'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT count(id) FROM USMS_Thumbs WHERE songId = "'.$ytid.'"');

    foreach ($results as $row)
    {
        echo "@".$row[0];
    }
?>
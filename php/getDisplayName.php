<?php
    $userid = $_POST['id'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT * FROM USMS_Users WHERE id = '.$userid.'');

    foreach ($results as $row)
    {
        echo $row[2];
    }
?>
<?php
    $dname = $_POST['dname'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT TextColor FROM USMS_Users WHERE DisplayName = "'.$dname.'"');

    foreach ($results as $row)
    {
        echo $row[0];
    }
?>
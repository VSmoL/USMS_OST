<?php
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT * FROM USMS_Users WHERE UserName = "'.$user.'" AND userPW = "'.$pass.'"');

    foreach ($results as $row)
    {
        echo $row[0];
    }
?>
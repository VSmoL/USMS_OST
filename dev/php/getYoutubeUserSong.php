<?php
    $userid = $_POST['userID'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);

    $results = $db->query('Select * from USMS_Playlist WHERE SendUserID = "'.$userid.'" AND time_created > DATE("now","localtime","weekday 0","-7 days")');

    foreach ($results as $row)
    {
        echo "#".$row[9]."$".$row[6]."$".$row[7];
    }
?>
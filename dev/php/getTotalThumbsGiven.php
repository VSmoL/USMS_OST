<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT COUNT (USMS_Users.id), USMS_Users.DisplayName
                                    FROM USMS_Thumbs
                                    INNER JOIN USMS_Users ON USMS_Thumbs.senderId = USMS_Users.id
                                    GROUP BY USMS_Users.id
                                    ORDER BY COUNT (USMS_Users.id) DESC');
    foreach ($results as $row)
    {
        echo "@".$row[0]."$".$row[1];
    }
?>
<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT themeId
                FROM USMS_PastThemes
                WHERE datetime(dateAdded, "localtime") > DATE("now", "weekday 1", "-63 days")
                ORDER BY dateAdded desc
                LIMIT 9;');
    foreach ($results as $row)
    {
        echo "@".$row[0];
    }
?>
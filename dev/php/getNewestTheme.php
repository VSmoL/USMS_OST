<?php
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT themeId
                FROM USMS_PastThemes
                ORDER BY id desc
                LIMIT 1;');
    foreach ($results as $row)
    {
        echo $row[0];
    }
?>
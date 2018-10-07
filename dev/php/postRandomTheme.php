<?php
    $rnumber = $_POST['rnumber'];
    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_PastThemes (themeId) VALUES ('.$rnumber.')');
?>
<?php

    //Haetaan teemat
    $dsn = 'sqlite:/home/r203637/public_html/usms_ost/db/USMSOST.db';
//    $dsn = 'sqlite:../db/USMSOST.db';
    $db = new PDO($dsn, null, null);
    $themelist = $db->query('SELECT COUNT(id) FROM USMS_ThemeList');
    $totalrow = 0;


    foreach ($themelist as $row)
    {
        $totalrow = $row[0];
    }

    //Haetaan 2kk sisällä olleet teemat
    $numberfound = false;
    $db = new PDO($dsn, null, null);
    $results = $db->query('SELECT themeId
                FROM USMS_PastThemes
                ORDER BY dateAdded desc
                LIMIT 9;');
    $listOfPastThemes = array();

    
    foreach ($results as $row)
    {
        array_push($listOfPastThemes, $row[0]);
    }
    
    //Lisätään uusi teema
    $randomNumber;
    $i = 0;
    while ($numberfound != true) {
        $i++;
        $randomNumber = rand(0, $totalrow);
        if (!in_array($randomNumber, $listOfPastThemes)) {
            $numberfound = true;
        }
    }
//    while (!$numbernotfound) {
//        $randomNumber = rand(0, count($themelist));
//        if (!in_array($randomNumber, $listOfPastThemes)) {
//            $numberfound = true;
//        }
//    }

    
    $db = new PDO($dsn, null, null);
    $db->query('INSERT INTO USMS_PastThemes (themeId) VALUES ('.$randomNumber.')');
    echo "Uusi teema lisätty!";
?>
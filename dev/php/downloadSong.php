<?php
    require('ytClass/youtube-dl.class.php');
    try {
        // Instantly download a YouTube video as MP3 (using the default settings).
        new yt_downloader('https://www.youtube.com/watch?v=tUAcDMHuC2E', TRUE, 'audio');
    }
    catch (Exception $e) {
        die($e->getMessage());
    }
?>
SELECT USMS_Users.DisplayName ,
CASE WHEN (SELECT COUNT(USMS_Thumbs.id)
FROM USMS_Playlist 
INNER JOIN USMS_Thumbs ON USMS_Playlist.YoutubeID = USMS_Thumbs.songId
INNER JOIN USMS_Users ON USMS_Playlist.SendUserId =  USMS_Users.id 
GROUP BY USMS_Playlist.id 
ORDER BY COUNT(USMS_Thumbs.id) DESC) > 8 THEN 

COUNT(SELECT COUNT(USMS_Thumbs.id)
FROM USMS_Playlist 
INNER JOIN USMS_Thumbs ON USMS_Playlist.YoutubeID = USMS_Thumbs.songId
INNER JOIN USMS_Users ON USMS_Playlist.SendUserId =  USMS_Users.id 
GROUP BY USMS_Playlist.id 
ORDER BY COUNT(USMS_Thumbs.id) DESC)

 ELSE 0 END AS "JOKU"
FROM USMS_Users

FROM USMS_Playlist 
INNER JOIN USMS_Thumbs ON USMS_Playlist.YoutubeID = USMS_Thumbs.songId 
INNER JOIN USMS_Users ON USMS_Playlist.SendUserId =  USMS_Users.id 
GROUP BY USMS_Users.DisplayName


SELECT COUNT(USMS_Thumbs.id)
FROM USMS_Playlist 
INNER JOIN USMS_Thumbs ON USMS_Playlist.YoutubeID = USMS_Thumbs.songId
INNER JOIN USMS_Users ON USMS_Playlist.SendUserId =  USMS_Users.id 
GROUP BY USMS_Playlist.id 
ORDER BY COUNT(USMS_Thumbs.id) DESC

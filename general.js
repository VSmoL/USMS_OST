function soitabiisi(){
    var soitto = document.getElementById("soitin");
    soitto.play();
    console.log(soitto.duration);
}

function lopetabiisi(){
    var soitto = document.getElementById("soitin");
    soitto.pause();
    console.log(soitto.duration);
}
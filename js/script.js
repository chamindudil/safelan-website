let images = [
"assets/dashboard3.png",
"assets/dashboard1.png",
"assets/dashboard2.png"
];

let index = 0;

function showImage(){
document.getElementById("slider").src = images[index];
}

function nextImage(){
index++;
if(index >= images.length) index = 0;
showImage();
}

function prevImage(){
index--;
if(index < 0) index = images.length - 1;
showImage();
}

/* AUTO SLIDE */
setInterval(nextImage, 4000);
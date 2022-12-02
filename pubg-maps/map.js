let img = document.querySelector('img');
let select = document.querySelector("select");

//https://npl-static-assets.pubgesports.com/wp-content/uploads/2019/04/14111358/Miramar-Esports-Vehicle-Spawns-Map.jpg
//https://npl-static-assets.pubgesports.com/wp-content/uploads/2019/04/14111320/Erangel-Esports-Vehicle-Spawns-Map.jpg


select.onchange = function(){
  img.src = "https://i.imgur.com/"+select.value+".jpg";
}

window.onresize = function(){
  img.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
  img.src = "https://i.imgur.com/"+select.value+".jpg";
  wheelzoom(img);
}

wheelzoom(img);
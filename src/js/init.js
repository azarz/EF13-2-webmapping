var optionsCarte;
var marker;
var validationBtn;


window.onload = init;


/************ Initialisation de la page ****************/

function init(){
    /**
    Initialisation de la fenêtre
    */
    initMap();
    validationBtn = document.getElementById("submitBtn");
    validationBtn.addEventListener('click', validate);

    marker = new google.maps.Marker({
        draggable: true,
        map: map,
        position: new google.maps.LatLng(42.698971,9.451943)
    });
}

function initMap() {
    /**
    Initalisation de la map, centrée sur l'ENSG
    */
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(42.698971, 9.451943),
    });
}




/************* Écouteurs d'évènements ***************/

function validate(event){
	event.preventDefault();

	var lat = marker.getPosition().lat();
	var lon = marker.getPosition().lon();

	var xhr = new XMLHttpRequest();


    // On prévient losque la mise à jour est terminée
    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText();

            if (response == ''){
            	confirm()
            } else{
            	responseJSON = JSON.parse(response);

            	var lieuxProches= document.getElementById("lieuxProches");
            	var select = document.createElement("select");
            	select.setAttribute("name","listeLieux");
            	select.setAttribute("id","listeLieux");

           		var confirmer = document.createElement("button");
            	confirmer.setAttribute("name","confirmer");
            	confirmer.setAttribute("id","confirmer");
            	confirmer.addEventListener("click",confirm);

            	

            	for(i=0; i<responseJSON.length;i++){
            		var option = document.createElement("option");
            		option.setAttribute("value",responseJSON[i].name);
            		option.innerHTML=responseJSON[i].name;

            		select.appendChild(option);
            	}

            	lieuxProches.appendChild(select);
            	lieuxProches.appendChild(confirmer);
            }
        }
    });

    // On envoie la requpete au serveur
    xhr.open('GET', 'server/update_db.php?lat=' + lat + '&lon=' + lon, true);
    xhr.send();
}

function confirm()
{
	alert('Stage ajouté');
}

/// A FAIRE PAR LA SUITE
/* CREER LES FICHIERS PHP (select, insert, update de stage
*/
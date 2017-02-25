/******** Variables globales *******/

// Le marqueur à déplacer
var marker;
// Le bouton de validation
var validationBtn;
var new_location;

//TODO: importer les champs DOM




// Fonction au lancement de la fenêtre
window.onload = init;


/************ Initialisation de la page ****************/

function init(){
    /**
    Initialisation de la fenêtre
    */
    initMap();
    validationBtn = document.getElementById("submitBtn");
    validationBtn.addEventListener('click', validateForm);

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

function validateForm(event){
	event.preventDefault();

	var lat = marker.getPosition().lat();
	var lon = marker.getPosition().lon();

	var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText();

            if (response == ''){
                new_location = true;
            	confirmLocation();
            
            } else{
                new_location = false;
            	responseJSON = JSON.parse(response);

            	var lieuxProches= document.getElementById("lieuxProches");
            	var select = document.createElement("select");
            	select.setAttribute("name","listeLieux");
            	select.setAttribute("id","listeLieux");

           		var confirmBtn = document.createElement("button");
            	confirmBtn.setAttribute("name","confirmBtn");
            	confirmBtn.setAttribute("id","confirmBtn");
            	confirmBtn.addEventListener("click", confirmLocation);

            	

            	for(i=0; i<responseJSON.length;i++){
            		var option = document.createElement("option");
            		option.setAttribute("value",responseJSON[i].name);
            		option.innerHTML=responseJSON[i].name;

            		select.appendChild(option);
            	}

            	lieuxProches.appendChild(select);
            	lieuxProches.appendChild(confirmBtn);
            }
        }
    });

    // On envoie la requête au serveur
    xhr.open('GET', 'server/geo_query.php?lat=' + lat + '&lon=' + lon, true);
    xhr.send();
}



function confirmLocation(){
	alert('Stage ajouté');
}

/// A FAIRE PAR LA SUITE
/* CREER LES FICHIERS PHP (select, insert, update de stage
*/
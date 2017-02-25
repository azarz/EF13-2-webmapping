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
    var lieuxProches = document.getElementById("lieuxProches");

    // On cache la dv pour les lieux proches
    lieuxProches.style.visibility = "hidden";

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
    /**
    FOnction qui se déclenche à la validation du formulaire, récupère 
    la position du marqueur et interroge le serveur pour obtenir d'éventuels
    lieux de stages proches. Le cas échéant, on affiche ces lieux en demandant
    la confirmation de l'utilisateur
    */
	event.preventDefault();

	var lat = marker.getPosition().lat();
	var lon = marker.getPosition().lon();

	var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText();

            if (response == ''){
                new_location = true;
            	updateDB();
            
            } else{
                new_location = false;
            	responseJSON = JSON.parse(response);

            	var lieuxProches = document.getElementById("lieuxProches")

                var texte_confirm = document.createElement("p");
                texte_confirm.innerHTML = "Votre stage a eu lieu dans :"

            	var select = document.createElement("select");
            	select.setAttribute("name","listeLieux");
            	select.setAttribute("id","listeLieux");

           		var confirmBtn = document.createElement("button");
            	confirmBtn.setAttribute("name","confirmBtn");
            	confirmBtn.setAttribute("id","confirmBtn");
                confirmBtn.setAttribute("value","Confirmer lieu");
            	confirmBtn.addEventListener("click", updateDB);

                var neitherBtn = document.createElement("button");
                neitherBtn.setAttribute("name","neitherBtn");
                neitherBtn.setAttribute("id","neitherBtn");
                neitherBtn.setAttribute("value","Aucun de ces lieux");
                neitherBtn.addEventListener("click", newLocation);

            	for(i=0; i<responseJSON.length;i++){
            		var option = document.createElement("option");
            		option.setAttribute("value",responseJSON[i].name);
            		option.innerHTML=responseJSON[i].name;

            		select.appendChild(option);
            	}

                lieuxProches.appendChild(texte_confirm);
            	lieuxProches.appendChild(select);
            	lieuxProches.appendChild(confirmBtn);
                lieuxProches.appendChild(neitherBtn);

                // On affiche le choix
                lieuxProches.style.visibility = "visible";
            }
        }
    });

    // On envoie la requête au serveur
    xhr.open('GET', 'server/geo_query.php?lat=' + lat + '&lon=' + lon, true);
    xhr.send();
}




function newLocation(){
    /**
    Fonction lorqu'aucun des lieux proposées n'est le lieu de stage
    */
    new_location = true;
    updateDB();
}


function updateDB(){

    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
	       alert('Stage ajouté');
       }
    });


}

/// A FAIRE PAR LA SUITE
/* CREER LES FICHIERS PHP (select, insert, update de stage
*/
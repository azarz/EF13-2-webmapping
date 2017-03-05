/******** Variables globales *******/

// Le marqueur à déplacer
var marker;
// Le bouton de validation
var form;
var new_location;

//L'élément HTML par dessus le reste pour la validatio du lieu
var overlay;

//L'élément HTML de la selection de lieu de stage lors de la confirmation
var select_location;

// Fonction au lancement de la fenêtre
window.onload = init;


/************ Initialisation de la page ****************/

function init(){
    /**
    Initialisation de la fenêtre
    */
    initMap();
    form = document.getElementById("formStage");
    form.addEventListener('submit', validateForm);
    overlay = document.getElementById("overlay");
    
    // On cache la div pour les lieux proches
    overlay.style.visibility = "hidden";

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
	var lon = marker.getPosition().lng();

	var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText;

            // Si la réponse est vide, c'est qu'aucun lieu proche n'a été trouvé, le lieu actuel est donc noveau
            if (response == ''){
                new_location = true;
            	updateDB();
            
            // Sinon, on peuple les éléments HTML visant à séléctioner un leiu proche le cas échéant
            } else{
                new_location = false;
            	responseJSON = JSON.parse(response);

            	var lieuxProches = document.getElementById("lieuxProches")

                var closeIcon = document.createElement("img");
                closeIcon.setAttribute('src','./img/close.png');
                closeIcon.setAttribute("id",'closeIcon'); 
                closeIcon.setAttribute("class", "close");
                closeIcon.addEventListener('click', closeOverlay);

                var texte_confirm = document.createElement("p");
                texte_confirm.innerHTML = "Votre stage a eu lieu dans :"

            	select_location = document.createElement("select");
            	select_location.setAttribute("name","listeLieux");
            	select_location.setAttribute("id","listeLieux");

           		var confirmBtn = document.createElement("button");
            	confirmBtn.setAttribute("name","confirmBtn");
            	confirmBtn.setAttribute("id","confirmBtn");
                confirmBtn.innerHTML = "Confirmer lieu";
            	confirmBtn.addEventListener("click", updateDB);

                var neitherBtn = document.createElement("button");
                neitherBtn.setAttribute("name","neitherBtn");
                neitherBtn.setAttribute("id","neitherBtn");
                neitherBtn.innerHTML = "Aucun de ces lieux";
                neitherBtn.addEventListener("click", newLocation);

            	for(i=0; i<responseJSON.length;i++){
            		var option = document.createElement("option");
            		option.innerHTML = responseJSON[i].name;
                    option.setAttribute("value",responseJSON[i].id);
            		option.innerHTML=responseJSON[i].name;

            		select_location.appendChild(option);
            	}

                lieuxProches.appendChild(closeIcon);
                lieuxProches.appendChild(texte_confirm);
            	lieuxProches.appendChild(select_location);
            	lieuxProches.appendChild(confirmBtn);
                lieuxProches.appendChild(neitherBtn);

                // On affiche le choix
                overlay.style.visibility = "visible";
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
    /**
    Envoi des données au  serveur afin de mettre à jour la base de données
    On les récupère directement du formulaire
    */

    var data = {location: 0,
                internship:{}
    }

    var elements = form.elements;
    for (var i = 0; i < elements.length - 2; i++){
        if (!(elements[i].tagName == 'FIELDSET')){
            data.internship['' + elements[i].id] = elements[i].value;
        }  
    }

    // Si le lieu exoste déjà, on le définit par son ID dans la BDD
    if(!new_location){
        data.location = {id: select_location.value}
    } else{
    // Sinon, on le définit à l'aide du nom et de sa position
        data.location = {
            name: document.getElementById('lieu').value,
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
        }
    }

    console.log(data);

    var dataJSON = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            console.log(xhr.responseText);

            // On cache l'overlay, et on supprime ses enfants à la confirmation de la requête
            overlay.style.visibility = "hidden";
            var lieuxProches = document.getElementById("lieuxProches");
                while (lieuxProches.firstChild) {
                    lieuxProches.removeChild(lieuxProches.firstChild);
                }

	        alert('Stage ajouté');
       }
    });

    // On envoie la requête au serveur
    xhr.open('POST', 'server/insert_db.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("data=" + dataJSON);

}


function closeOverlay(){
    /**
    Fonction permettant la fermeture de l'overlay sans confirmer la position
    */
    overlay.style.visibility = "hidden";
    var lieuxProches = document.getElementById("lieuxProches");
        while (lieuxProches.firstChild) {
            lieuxProches.removeChild(lieuxProches.firstChild);
        }   
}
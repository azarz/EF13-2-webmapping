<?php
	// Nom de la table dans la BDD
	$internship_table = "internships";
	$place_table = "internship_places";
	
	// Récupération de la donnée envoyée par le client
	$newDataJSON = pg_escape_string($_POST["data"]);
	$newData = json_decode($newDataJSON, true);

	// Lien vers la base de données postGIS en local
	$link = pg_connect("host=localhost port=5432 dbname=internships user=postgres password=postgres");

	if(!$link){
		die('Erreur de connexion');
	}

	if(isset($newData["location"]["id"])){
		//Si le lieu de stage est déjà dans la BDD
		$locationID = intval($newData['location']['id']);


	} else {
		//Si il faut auddi ajouter le lieu de stage
		$location_name = $newData['location']['name'];
		$location_lat = $newData['location']['lat'];
		$location_lng = $newData['location']['lng'];

		$requestPlace = "INSERT INTO $place_table (id, name, lat, lng)
							  VALUES (DEFAULT, '$location_name', $location_lat, $location_lng)";

		$resultPlace = pg_query($link, $requestPlace);

		if(!$resultPlace) { 
			die('Erreur de requête'); 
		}


		// On récupère l'ID du lieu que l'on vient d'insérer
		$requestIDPlace = "SELECT id FROM $place_table ORDER BY id DESC LIMIT 1";

		$resultIDPlace = pg_query($link, $requestIDPlace);

		if(!$resultIDPlace) { 
			die('Erreur de requête'); 
		}

		$locationID = intval(pg_fetch_result($resultIDPlace, 0, 'id'));
	}


	$requestInternship = "INSERT INTO $internship_table (id, id_place, master_name, master_first_name, master_email, student_name, student_first_name, student_email, title_en, title_fr, summary_en, summary_fr, year, lat, lng)
						  VALUES (DEFAULT, $locationID";

	foreach($newData['internship'] as $value){
		$requestInternship .= ",'".$value."'";
	}

	$requestInternship .= ", 0, 0)";

	$resultInternship = pg_query($link, $requestInternship);

	if(!$resultInternship) { 
		die('Erreur de requête'); 
	}

	echo "insert OK";

?>
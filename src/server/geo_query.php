<?php

	header("Content-Type: application/json; charset=UTF-8");

	// Nom de la table dans la BDD
	$table_name = "internship_places";

	// Lien vers la base de données postGIS en local
	$link = pg_connect("host=localhost port=5432 dbname=internships user=postgres password=postgres");

	if(!$link){
		die('Erreur de connexion');
	}


	// Récupération des paramètres de la requête GET en les sécurisant
	// Il s'agit de la latitude et de la longitude du marqueur
	$lat_m = pg_escape_string($_GET["lat"]);
	$lon_m = pg_escape_string($_GET["lon"]);	


	/**
	Requête pour trouver des lieux de stages éventuellement proches de la recherche
	Le 0.25 dans le ST_DWithin de la clause WHERE correspond à une distance angulaire de 0.25° dans le système EPSG:4326, soit WGS84 plate carrée
	Ce qui correspond à peu près à 28 km car 1° correspond à 111 km à l'équateur et 28*4 = 112
	*/
	$requestBuffer = "SELECT id, name, lat, lng
				FROM $table_name 
				WHERE ST_DWithin( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_m, $lat_m), 4326), 0.25) 
				ORDER BY ST_Distance( ST_SetSRID(ST_MakePoint(lng, lat), 4326), ST_SetSRID(ST_MakePoint($lon_m, $lat_m), 4326) ) ASC ";

	$resultBuffer = pg_query($link, $requestBuffer);

	if(!$resultBuffer) { 
		die('Erreur de requête'); 
	}


	if(pg_num_rows($resultBuffer) == 0){
		// S'il n'y a aucun résultat, on renvoie une chaîne vide
		echo '';

	} else {
		// Notre sortie
		$tabOut = array() ; 

		// On remplit avec les résultats, en convertissant le string du resultat en un type utilisable
		while($ligne = pg_fetch_row($resultBuffer)) {
			$tabOut[] = array('id'=> intval($ligne[0]),
							  'name'=> $ligne[1], 
							  'lat'=> floatval($ligne[2]), 
							  'lng'=> floatval($ligne[3]), 
							  );
		}

		// On écrit le résultat
		echo json_encode($tabOut);
	}

?>
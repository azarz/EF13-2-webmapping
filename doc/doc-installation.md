#Installation

Avoir un serveur pgSQL (https://www.postgresql.org/download/) 
muni de postGIS. (installation décrite sur http://postgis.net/install/)

Extraire le dossier src dans le serveur.

Modifier l'adresse du serveur SQL, du nom de la table et des identifiants dans les fichiers PHP :
+ Aux lignes 6 et 9 du fichier get_internships.php
+ Aux lignes 4 et 11 du fichier update_db.php
(cf documentation programmeur, paragraphe sur le PHP)
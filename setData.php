<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$json = file_get_contents('php://input');
$myfile = fopen("data.json", "w") or die("Unable to open file!");
fwrite($myfile, $json);
fclose($myfile);

echo "Hello World";
?>
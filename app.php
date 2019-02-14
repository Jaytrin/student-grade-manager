<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');

require_once('mysql_connect.php');

$request = $_GET['request'];

switch($request){
    case 'get_data':
    require_once('get_data.php');
    break;
    case 'submit_data':
    require_once('submit_data.php');
    break;
    case 'update_data':
    require_once('update_data.php');
    break;
    case 'delete_data':
    require_once('delete_data.php');
    break;
    case 'clean_database':
    require_once('clean_database.php');
    break;
    default:
    $output['Errors'] = 'Request URL failed';
}

$output = json_encode($output);
echo $output;

?>
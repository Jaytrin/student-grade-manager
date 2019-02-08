<?php

require_once('mysql_connect.php');

$output=[];

$query = "SELECT * FROM students";

$result = mysqli_query($conn, $query);

if(mysqli_num_rows($result) > 0){
    while($row = mysqli_fetch_assoc($result)){
        $output[] = $row;
    }
} else {
    $output['Errors'][] = 'Invalid search. No data available';
}

?>
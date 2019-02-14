<?php

require_once('mysql_connect.php');

$ID = $_POST['ID'];

$stmtDeleteStudent = $conn->prepare("DELETE FROM students WHERE ID = ?");
$stmtDeleteStudent->bind_param("s", $ID);

if(!$stmtDeleteStudent->execute()){
    $output['message'] = 'Failed to delete student data.';
} else {
    $output['message'] = 'Student data successfully deleted.';
}

$stmtDeleteStudent->close();

?>
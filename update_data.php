<?php

require_once('mysql_connect.php');

$ID = $_POST['ID'];
$student = $_POST['student'];
$course = $_POST['course'];
$grade = $_POST['grade'];
$null = null;

$stmtSubmitStudent = $conn->prepare("UPDATE students SET student = ?, course = ?, grade = ? WHERE ID = ?");
$stmtSubmitStudent->bind_param("ssss", $student, $course, $grade, $ID);

if(!$stmtSubmitStudent->execute()){
    $output['message'] = 'Failed to update student data.';
} else {
    $output['message'] = 'Student data successfully updated.';
}

$stmtSubmitStudent->close();

?>
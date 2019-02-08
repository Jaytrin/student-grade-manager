<?php

require_once('mysql_connect.php');

$student = $_POST['student'];
$course = $_POST['course'];
$grade = $_POST['grade'];
$null = null;

$stmtSubmitStudent = $conn->prepare("INSERT INTO students (ID, student, course, grade) VALUES (?,?,?,?)");
$stmtSubmitStudent->bind_param("ssss", $null, $student, $course, $grade);

if(!$stmtSubmitStudent->execute()){
    $output['message'] = 'Failed to submit student data.';
} else {
    $output['message'] = 'Student data successfully submitted.';
}

$stmtSubmitStudent->close();

?>
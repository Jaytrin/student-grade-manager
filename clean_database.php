<?php
//This endpoint will be used for a CronJob to prevent cross-user data contamination
require_once('mysql_connect.php');

$query = "TRUNCATE TABLE students;";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (1, 'Jaytrin Apinchapong', 'Negotiations', 100);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (2, 'Perry Tran', 'Math', 80);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (3, 'Mia Tran', 'Science', 99);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (4, 'Soora Choi', 'Communication', 70);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (5, 'Dwayne Johnson', 'English', 95);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (6, 'Steve Jobs', 'Drama', 100);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (7, 'Bill Gates', 'PE', 100);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (8, 'Michael Jordan', 'Environmental Science', 50);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (9, 'Ernie Johnson', 'English', 100);";
$query .= "INSERT INTO students (ID, student, course, grade) VALUES (10, 'Charles Barkley', 'Cross Country', 20);";

if(mysqli_multi_query($conn,$query)){
    $output['message'] = 'Database successfully reset.';
} else {
    $output['Errors'][] = mysqli_error($conn);
}

?>
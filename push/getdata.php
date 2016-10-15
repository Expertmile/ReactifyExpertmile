<?php
	include("../connect.php");
	session_start();
	if ($_GET['q']) {
		$q = $_GET['q'];

		if(isset($_SESSION['UserID'])){
			$id = $_SESSION['UserID'];
			$name = $_SESSION['Fname'].' '.$_SESSION['Lname'];
			$category = $_SESSION['Category'];
		}

		$q1 = mysqli_query($con,"INSERT INTO GCM(Id,Subscription_Id,User_Id) VALUES ('','$q','$id')");	
		if ($q1) {
			$a[] = array('msg' => 'successfully insrted' );
		}

		echo json_encode($a);
	}
?>
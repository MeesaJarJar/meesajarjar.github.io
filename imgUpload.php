<?php
// Check for file upload errors
if ($_FILES['fileToUpload']['error'] !== UPLOAD_ERR_OK) {
    echo "File upload error: " . $_FILES['fileToUpload']['error'];
    exit; // Exit to prevent further processing
}

// Directory where the images will be saved
$target_dir = "/UOItems/";

// Check if the directory exists, if not, create it with proper permissions
if (!is_dir($target_dir)) {
    if (!mkdir($target_dir, 0755, true)) {
        echo "Error: Failed to create target directory.";
        exit;
    }
}

// Check if a file has been uploaded
if (isset($_FILES["fileToUpload"])) {
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    // Check if the file already exists, skip upload if it does
    if (file_exists($target_file)) {
        echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " already exists. Skipping upload.";
    } else {
        // Check if the file is an actual image
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if ($check !== false) {
            // Additional security: check file extension
            $allowed_extensions = ['png', 'jpg', 'jpeg', 'gif'];
            $file_extension = pathinfo($target_file, PATHINFO_EXTENSION);
            if (!in_array(strtolower($file_extension), $allowed_extensions)) {
                echo "Error: Invalid file extension.";
                exit;
            }

            // Move the uploaded file to the target directory
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        } else {
            echo "File is not an image.";
        }
    }
} else {
    echo "No file uploaded.";
}
?>

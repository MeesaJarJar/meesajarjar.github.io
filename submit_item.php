<?php
// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header('Allow: POST');
    echo "Error: Only POST requests are allowed.";
    exit;
}

// Absolute path to the CSV file
$file_path = __DIR__ . '/vendorsaleitemdata.csv';

// Get the incoming POST data (JSON array expected)
$raw_data = file_get_contents("php://input");
$data = json_decode($raw_data, true);

// Basic error checking for JSON decoding
if ($data === null || !is_array($data)) {
    http_response_code(400);
    echo "Error: Invalid JSON data received.";
    exit;
}

// Load existing lines if the file exists
$existing_lines = [];
if (file_exists($file_path)) {
    $existing_lines = file($file_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
}

// Open the file in append mode
$file = fopen($file_path, 'a');
if (!$file) {
    http_response_code(500);
    echo "Error: Unable to open the file for writing.";
    exit;
}

// Append new unique lines
foreach ($data as $line) {
    // Flatten arrays into pipe-delimited strings
    if (is_array($line)) {
        $line = implode('|', $line);
    }

    $line = trim($line); // Remove stray whitespace

    if ($line !== '' && !in_array($line, $existing_lines)) {
        if (fwrite($file, $line . PHP_EOL) === false) {
            http_response_code(500);
            echo "Error: Unable to write data to the file.";
            fclose($file);
            exit;
        }
        // Add to in-memory list to avoid duplicates within same request
        $existing_lines[] = $line;
    }
}

// Close the file
fclose($file);

// Success response
http_response_code(200);
echo "Data successfully appended to the CSV file.";
?>

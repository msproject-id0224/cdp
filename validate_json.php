<?php

$files = ['lang/en.json', 'lang/id.json'];
$basePath = __DIR__;

foreach ($files as $file) {
    $path = $basePath . '/' . $file;
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $json = json_decode($content, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo "ERROR in $file: " . json_last_error_msg() . "\n";
        } else {
            echo "OK: $file is valid JSON.\n";
        }
    } else {
        echo "MISSING: $path not found.\n";
    }
}

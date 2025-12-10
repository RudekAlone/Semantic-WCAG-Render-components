<?php
require __DIR__ . '/vendor/autoload.php';

use Core\Database;

$config = require __DIR__ . '/core/config/config.php';
$inputPassword = 'ZAQ!2wsx';
$inputLogin = 'jnowak001';

try {
    $db = new Database($config);
    
    // Get user
    $accounts = $db->query("SELECT * FROM accounts WHERE login = ?", [$inputLogin]);
    
    if (!$accounts) {
        echo "User not found.\n";
        exit;
    }
    
    $hashFromDb = $accounts[0]['password'];
    echo "Hash from DB: [" . $hashFromDb . "]\n";
    echo "Hash Length: " . strlen($hashFromDb) . "\n";
    
    echo "Verifying password '$inputPassword' against DB hash...\n";
    
    if (password_verify($inputPassword, $hashFromDb)) {
        echo "SUCCESS: password_verify returned TRUE.\n";
    } else {
        echo "FAILURE: password_verify returned FALSE.\n";
        
        // Debug generation
        echo "Generating new hash for '$inputPassword'...\n";
        $newHash = password_hash($inputPassword, PASSWORD_DEFAULT);
        echo "New Hash: $newHash\n";
        
        if (password_verify($inputPassword, $newHash)) {
             echo "Verification of new hash works.\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

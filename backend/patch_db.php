<?php
require __DIR__ . '/vendor/autoload.php';

use Core\Database;

$config = require __DIR__ . '/core/config/config.php';

try {
    $db = new Database($config);
    echo "Connected to DB.\n";

    // Known good hash for 'ZAQ!2wsx'
    $newHash = '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO';

    echo "Updating passwords for all accounts to use the new hash...\n";
    
    // Using direct PDO from Database class wrapper if possible, or just raw query
    // Database::query returns result, doesn't easily show affected rows but standard SQL update works.
    
    // We can't bind array for SET clause easily with this simple wrapper if we want to update all? 
    // Actually the wrapper: query($sql, $params).
    
    $sql = "UPDATE accounts SET password = ?";
    $db->query($sql, [$newHash]);
    
    echo "Update executed.\n";
    
    // Verify
    $rows = $db->query("SELECT login, password FROM accounts WHERE login='jnowak001'");
    echo "New hash in DB for jnowak001: " . $rows[0]['password'] . "\n";
    
    if ($rows[0]['password'] === $newHash) {
        echo "SUCCESS: Hash updated.\n";
    } else {
        echo "FAILURE: Hash mismatch.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

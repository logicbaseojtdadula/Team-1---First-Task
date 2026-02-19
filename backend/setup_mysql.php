<?php
echo "Creating MySQL database...\n";

try {
    // Connect to MySQL
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Drop database if exists and create new one
    $pdo->exec("DROP DATABASE IF EXISTS task_manager");
    $pdo->exec("CREATE DATABASE task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "✓ Database 'task_manager' created successfully!\n";
    echo "✓ Ready to run migrations and seeders\n";
    
} catch(PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Make sure MySQL is running (Herd should have it running)\n";
    echo "2. Check if port 3306 is available\n";
    echo "3. Verify MySQL credentials in .env file\n";
    exit(1);
}

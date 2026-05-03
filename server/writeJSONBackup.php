<?php
// Crear carpeta backup si no existe
$backupDir = "backup";
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0777, true);
}

// Leer JSON enviado desde fetch()
$data = file_get_contents("php://input");

// Nombre del archivo con fecha
$filename = $backupDir . "/backup_" . date("Ymd_His") . ".json";

// Guardar archivo
file_put_contents($filename, $data);

// Respuesta al cliente
echo "OK";
?>

<?php
if (isset($_GET['email'])) {
    $email = $_GET['email'];
    $file = 'emails.csv';

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Verifica se o email já existe no arquivo
        $emails = [];
        if (file_exists($file)) {
            $handle = fopen($file, 'r');
            if ($handle) {
                while (($data = fgetcsv($handle)) !== false) {
                    $emails[] = $data[0];
                }
                fclose($handle);
            }
        }

        if (!in_array($email, $emails)) {
            // Adiciona o email ao arquivo
            $handle = fopen($file, 'a');
            if ($handle) {
                fputcsv($handle, [$email]);
                fclose($handle);
                echo "Email adicionado com sucesso.";
            } else {
                echo "Erro ao abrir o arquivo.";
            }
        } else {
            echo "Email já existe.";
        }
    } else {
        echo "Email inválido.";
    }
} else {
    echo "Nenhum email fornecido.";
}
?>
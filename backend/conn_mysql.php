<?php

// informações do Banco de Dados
$env = parse_ini_file('.env');
$HOST = $env['HOST'];
$USER = $env['USER'];
$DATABASE = $env['DATABASE'];
$PORT = $env['PORT'];


/**
 * Realiza um select de acordo com o comando passado e retorna as linhas encontradas
 * @param string $sql Comando SQL a ser rodado no banco 
 */
function select_sql(string $sql) {
	global $HOST, $USER, $DATABASE, $PORT;
	$con = mysqli_connect($HOST, $USER, "", $DATABASE, $PORT);
	
	if ($con) {
		$result = mysqli_query($con, $sql);
		$con->close();

        return $result;
	}
}

// Realiza um insert de acordo com o comando passado e retorna o id criado
function insert_sql(string $sql) {
	global $HOST, $USER, $DATABASE, $PORT;

	$con = mysqli_connect($HOST, $USER, "", $DATABASE, $PORT);

	if ($con) {
		mysqli_query($con, $sql);
		$result = mysqli_insert_id($con);
		$con->close();

		return $result;
	}
}

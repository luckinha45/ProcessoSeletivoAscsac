<?php

require __DIR__ . '/vendor/autoload.php';
require_once './model.php';

app()->cors();

// retorna a campanha com o id fornecido
app()->get('/campanha/{id}', function ($id) {
	if ($id && is_numeric($id)) {
		$camp = Campanha::getByID($id);
		response()->json($camp);
	}
});

// retorna todas as campanhas existentes
app()->get('/campanha', function () {
	$camps = Campanha::getAll();
	response()->json($camps);
});

// Salva uma nova campanha com um nome e uma lista de contatos
app()->post('/campanha', function () {
	$body = request()->body();

	// checa se o campo 'nome' está presente na body
	if (!array_key_exists('nome', $body)) {
		response()->json(['error' => 'Nome da campanha é obrigatório'], 400);
        return;
	}

	// checa se o campo 'contatos' está presente na body
	if (!array_key_exists('contatos', $body)) {
		response()->json(['error' => 'Lista de contatos é obrigatória'], 400);
		return;
	}

	// Checa se os telefones dos contatos estão corretos
	$contTelErr = Contato::checaTel($body['contatos']);
	if ($contTelErr != null) {
		response()->json(['error' => 'Contato "' . $contTelErr['nome'] . ' ' . $contTelErr['sobrenome'] . '" possui número de telefone incorreto. Favor corrijí-lo!'], 400);
		return;
	}
	
	$camp = Campanha::save(['nome' => $body['nome'], 'contatos' => $body['contatos']]);
	response()->json($camp);

});

app()->run();

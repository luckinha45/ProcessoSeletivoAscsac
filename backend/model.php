<?php
require_once './conn_mysql.php';

class Campanha {
	public readonly int $id;
	public $nome;
	public $contatos;

	public function __construct(int $id, string $nome, array $contatos) {
		$this->id = $id;
		$this->nome = $nome;
		$this->contatos = $contatos;
	}

	/**
	 * Pega todas as Campanhas cadastradas e as retorna em um array.
	 * @return Campanha[]
	 */
	public static function getAll() {
		$result = select_sql("select * from campanha");
		if ($result) {
			$camps = [];
			while ($row = mysqli_fetch_assoc($result)) {
                $camps[] = new Campanha($row['id'], $row['nome'], [] /* Contato::getByCampanhaID($row['id']) */);
            }
            mysqli_free_result($result);
            return $camps;
		}
	}

	/**
	 * Pega uma campanha com o ID passado, retornaa Campanha se achado, se não retorna null.
	 * @param int $id ID de uma campanha
	 * @return Campanha|null
	 */
	public static function getByID(int $id) {
		$result = select_sql(sprintf("select * from campanha where id=%d", $id));
		$rowCamp =  mysqli_fetch_assoc($result);

		
		if ($rowCamp) {
			$camp = new Campanha($rowCamp['id'], $rowCamp['nome'], Contato::getByCampanhaID($rowCamp['id']));
			mysqli_free_result($result);
			return $camp;
		}

		return null;
	}

	/**
	 * Salva a campanha no BD e o retorna em seguida.
	 * @param array $campanha objeto com os atributos necessários para salvar a Campanha
	 * @return Campanha
	 */
	public static function save(array $campanha) {
		$id = insert_sql(sprintf("INSERT INTO `campanha` ( `nome`) VALUES ('%s')", $campanha['nome']));

		// cadastra contatos
		$contatos = [];
		foreach ($campanha['contatos'] as $c)  {
			$contatos[] = Contato::save($c, $id);
		}

		return new Campanha($id, $campanha['nome'], $contatos);
	}
}


class Contato {
	public readonly int $id;
	public readonly int $campanha_id;
	public $nome;
	public $sobrenome;
	public $email;
	public $tel;
	public $endr;
	public $cidade;
	public $cep;
	public $dtNasc;

	public function __construct(int $id, int $campanha_id, string $nome, string $sobrenome, string $email, string $tel, string $endr, string $cidade, string $cep, string $dtNasc) {
		$this->id = $id;
		$this->campanha_id = $campanha_id;
        $this->nome = $nome;
        $this->sobrenome = $sobrenome;
        $this->email = $email;
        $this->tel = $tel;
        $this->endr = $endr;
        $this->cidade = $cidade;
        $this->cep = $cep;
        $this->dtNasc = $dtNasc;
	}

	/** 
	 * Checa se os telefones dos contatos são válidos. Caso achou um telefone invalido, retorna o contato, se não, retorna null.
	 * Função baseada nessa implementação: https://gist.github.com/jonathangoncalves/7bdec924e9bd2bdf353d6b7520820b62
	 * @param array &$contatos lista de contatos recebidos
	 * @return Contato|null
	 */
	public static function checaTel(array &$contatos) {
		foreach ($contatos as $idx=>$c) {
			// remove simbolos especiais
			$tel = preg_replace("/\D/i", '', $c['tel']);
			$contatos[$idx]['tel'] = $tel;

			// checa tamanho do telefone
			if (!(strlen($tel) >= 12 && strlen($tel) <= 13)) return $c;
			
			//Se tiver 13 caracteres, verificar se começa com 9 o celular
			if (strlen($tel) == 13 && substr($tel, 4, 1) != '9') return $c;
			
			//DDDs validos
			$codigosDDD = [
				'11', '12', '13', '14', '15', '16', '17', '18', '19',
				'21', '22', '24', '27', '28', '31', '32', '33', '34',
				'35', '37', '38', '41', '42', '43', '44', '45', '46',
				'47', '48', '49', '51', '53', '54', '55', '61', '62',
				'64', '63', '65', '66', '67', '68', '69', '71', '73',
				'74', '75', '77', '79', '81', '82', '83', '84', '85',
				'86', '87', '88', '89', '91', '92', '93', '94', '95',
				'96', '97', '98', '99'
			];
			
			//verifica se o DDD é valido
			if (!in_array(substr($tel, 2, 2), $codigosDDD)) return $c;
		}
		return null;
	}

	/**
	 * Pega oc Contatos pelo ID de uma Campanha.
	 * @param int $campnha_id ID de uma Campanha cadastrada.
	 * @return Contato[]
	 */
	public static function getByCampanhaID(int $campnha_id)
	{
		$result = select_sql(sprintf("select * from contato where campanha_id=%d", $campnha_id));

		$contatos = [];
		while ($row = mysqli_fetch_assoc($result)) {
			$contatos[] = new Contato (
				$row['id'],
				$row['campanha_id'],
				$row['nome'],
				$row['sobrenome'],
				$row['email'],
				$row['tel'],
				$row['endr'],
				$row['cidade'],
				$row['cep'],
				$row['dtNasc']
			);
		}
		mysqli_free_result($result);

		return $contatos;
	}

	/**
	 * Salva o Contato baseado nos parâmetros passados.
	 * @param array $contato Objeto com os atributos necessários para salvar o contato
	 * @param int $campanha_id ID da Campanha relacionada a esse Contato
	 * @return Contato
	 */
	public static function save(array $contato, int $campanha_id)
	{
		$id = insert_sql (
			sprintf (
				"INSERT INTO `contato` (`campanha_id`, `nome`, `sobrenome`, `email`, `tel`, `endr`, `cidade`, `cep`, `dtNasc`) VALUES (%d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
				$campanha_id,
				$contato['nome'],
				$contato['sobrenome'],
				$contato['email'],
				$contato['tel'],
				$contato['endr'],
				$contato['cidade'],
				$contato['cep'],
				$contato['dtNasc']
			)
		);

		return new Contato(
			$id,
			$campanha_id,
			$contato['nome'],
			$contato['sobrenome'],
			$contato['email'],
			$contato['tel'],
			$contato['endr'],
			$contato['cidade'],
			$contato['cep'],
			$contato['dtNasc']
		);
	}
}

?>
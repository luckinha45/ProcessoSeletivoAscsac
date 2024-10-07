import { useState } from 'react'
import * as bs from 'react-bootstrap'
import { css } from '@emotion/react'
import Input from 'components/Input'
import papa from "papaparse";
import axios from "axios";
import {Link} from 'react-router-dom';
interface ContatoCSV {
		Nome: string;
		Sobrenome: string;
		Email: string;
		Telefone: string;
		Endereço: string;
		Cidade: string;
		CEP: string;
		"Data de Nascimento": string;
	}

export default function App() {
	const styles = {
		//#region tabela
		tbl: css({
			margin: 'auto',
			marginTop: '20px',
			border: '1px solid black',
			borderSpacing: 0,
			borderCollapse: 'collapse',
			borderRadius: '50px',
		}),

		tbl_row: css({
			border: '1px solid black',
			":nth-of-type(2n + 1)": {
				backgroundColor: 'rgb(87, 32, 92)'
			},
			":nth-of-type(2n)": {
				backgroundColor: 'rgb(51, 9, 61)'
			},
			":hover": {
				backgroundColor: 'rgba(94, 50, 151, 0.22)'
			}
		}),

		tbl_header: css({
			border: '1px solid black',
			backgroundColor: 'white',
			color: 'black',
			paddingRight: '5px',
			paddingLeft: '5px'
		}),

		tbl_col: css({
			border: '1px solid black',
		}),
		//#endregion

		crd_cad_camp: css({
			margin: '10px',
			padding: '-16px',
			textAlign: 'left',
			backgroundColor: 'rgb(250, 250, 250)',
			width: '290px'
		}),

		inpt_camp_nome : css({
			display: 'flex',
			gap: '10px',
			marginTop: '10px',
			flexDirection: 'column',
			margin: 'auto'
		}),
		link_campanha: css({
			marginTop: '10px'

		})
	};
	
	// verificador de telefone
	// https://gist.github.com/jonathangoncalves/7bdec924e9bd2bdf353d6b7520820b62
	
	//#region logic
	const [campNome, setCampNome] = useState<string>("");
	const [campFile, setCampFile] = useState<HTMLInputElement>();

	/**
	 * Envia a Campanha para o backend.
	 * @param nome Nome da campanha
	 * @param csvArr Array gerado pelo PapaParse
	 */
	function saveCampanha(nome:string, csvArr:Array<ContatoCSV>) {
		// refazer o csvArr pra utilizar os campos da api
		const contatos = [];
		csvArr.shift();
		csvArr.forEach(csvEl => {
			contatos.push({
                nome: csvEl[0],
                sobrenome: csvEl[1],
                email: csvEl[2],
                tel: csvEl[3],
                endr: csvEl[4],
                cidade: csvEl[5],
                cep: csvEl[6],
                dtNasc: csvEl[7]
            });
		});

		axios.post('http://localhost:5500/campanha', {
			nome,
            contatos
		})
		.then(response => {
			alert('Campanha cadastrada com sucesso!');
			console.log(response.data);
		})
		.catch(error => {
            alert(error.response.data.error);
            console.error(error);
        });
	}

	/**
	 * Trigger do botão de cadastro da Campanha.
	 */
	function cadCampanha () {
		console.log('cadastrando campanha...');
		const files = Array.from(campFile?.files || []);

		if (campNome === '' || files?.length === 0) {
			alert('Preencha todos os campos.');
	  		return;
		}

		const file:File = files[0];
		papa.parse<ContatoCSV>(file, {
			complete: (csv) => {
				saveCampanha(campNome, csv.data);
			},
			// header:true,
			dynamicTyping: true
		});
	}

	/**
	 * Trigger do Input de arquivo, salva o arquivo no State `campFile`.
	 */
	function handleFileSelected (e: React.ChangeEvent<HTMLInputElement>): void {
		setCampFile(e.target);
		const files = Array.from(e.target.files || []);
		console.log("files:", files);
	}
	//#endregion

	return (
		<>
			<Link to="/campanha"> <bs.Button variant="warning" css={styles.link_campanha}>Ver Campanhas</bs.Button> </Link>
			<bs.Card css={styles.crd_cad_camp}>
				<bs.Card.Body>
					<bs.Card.Header>Cadastrar Campanha</bs.Card.Header>
					
					<bs.Form.Group>
						<div css={styles.inpt_camp_nome}>
							<Input inptName="Nome" wd={256} isPwd={false} setVal={(val:string) => setCampNome(val)} />
							<bs.Form.Control type="file" onChange={handleFileSelected}/>
							<bs.Button variant="primary" onClick={cadCampanha}>Cadastrar Campanha</bs.Button>
						</div>
					</bs.Form.Group>

				</bs.Card.Body>
			</bs.Card>
		</>
	)
}

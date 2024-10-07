import {css} from "@emotion/react";
import axios from "axios";
import React from "react";
import * as bs from 'react-bootstrap';
import {Link} from "react-router-dom";

interface Contato {
    nome: string;
    sobrenome: string;
    email: string;
    tel: string;
    endr: string;
    cidade: string;
    cep: string;
    dtNasc: string;
}

export default function Campanha() {
	const styles = {
		div_campanha: css({
			color: 'white',
			height: '80vh',
            overflowY: 'auto',
		}),
		tbl_campanha: css({
			margin: 'auto',
			// marginTop: '20px',
			border: '1px solid black',
			borderSpacing: 0,
			borderCollapse: 'collapse',
			borderRadius: '50px',
		}),

		div_contato: css({
			color: 'white',
			height: '70vh',
            overflowY: 'auto',
            overflowX: 'auto',
		}),
		tbl_contato: css({
			margin: 'auto',
			// marginTop: '20px',
			border: '1px solid black',
			borderSpacing: 0,
			borderCollapse: 'collapse',
			borderRadius: '50px',
			color: 'white'
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
				backgroundColor: 'rgba(94, 50, 151, 0.8)',
				// color: 'black'
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
			paddingLeft: '5px',
			paddingRight: '5px'
		}),

		link_campanha: css({
			margin: '10px'
		}),

		btn_mostrar: css({
			margin: '5px',
			padding: '7px',
			paddingTop: '4px',
			paddingBottom: '4px'
		})
	};

	//#region Logica
	const [campanhas, setCamps] = React.useState([]);

	React.useEffect(() => {
		axios.get('http://localhost:5500/campanha').then((response) => {
			setCamps(response.data);
		});
	}, []);

	// variaveis e triggers pra abrir/fechar modal
	const [show, setShow] = React.useState(false);
	const [mdlTitulo, setMdlTitulo] = React.useState('');
	const [contatos, setContatos] = React.useState<Array<Contato>>([]);
	
	/**
	 * Fecha o modal e limpa a lista de Contatos.
	 */
	function handleClose() {
		setShow(false);
		setContatos([]);
	}

	/**
	 * Abre o modal para mostrar os contatos da campanha.
	 * @param nome Nome da campanha
	 * @param campId ID da campanha
	 */
	function handleShow (nome:string, campId:number) {
		setMdlTitulo(`Detalhes da Campanha: ${nome}`);

		axios.get(`http://localhost:5500/campanha/${campId}`).then((response) => {
			console.log(response.data.contatos);
			setContatos(response.data.contatos);
		});

		setShow(true);
	}
	//#endregion

	return (
		<>
			<Link to="/"> <bs.Button variant="warning" css={styles.link_campanha}>Cadastrar Nova Campanha</bs.Button> </Link>
			<div css={styles.div_campanha}>
				<table css={styles.tbl_campanha}>
					<thead>
						<tr>
							<th css={styles.tbl_header}>#</th>
							<th css={styles.tbl_header}>Campanha</th>
							<th css={styles.tbl_header}>Ações</th>
						</tr>
					</thead>
					<tbody>
						{campanhas.map(camp => {
							return (
								<tr key={camp.id} css={styles.tbl_row}>
									<td css={styles.tbl_col}>{camp.id}</td>
									<td css={styles.tbl_col}>{camp.nome}</td>
									<td >
									<bs.Button variant="primary" css={styles.btn_mostrar} onClick={() => handleShow(camp.nome, camp.id)}>Mostrar</bs.Button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<bs.Modal show={show} size="xl">
				<bs.Modal.Header className="bg-dark" >
					<bs.Modal.Title>{mdlTitulo}</bs.Modal.Title>
					<button type="button" onClick={handleClose} className="btn-close btn-close-white" aria-label="Close"></button>
				</bs.Modal.Header>
				
				<bs.Modal.Body className="bg-dark">
					<div css={styles.div_contato}>
						<table css={styles.tbl_contato}>
							<thead>
								<tr>
									<th css={styles.tbl_header}>Nome</th>
									<th css={styles.tbl_header}>Sobrenome</th>
									<th css={styles.tbl_header}>Email</th>
									<th css={styles.tbl_header}>Telefone</th>
									<th css={styles.tbl_header}>Endereço</th>
									<th css={styles.tbl_header}>Cidade</th>
									<th css={styles.tbl_header}>CEP</th>
									<th css={styles.tbl_header}>Data de Nascimento</th>
								</tr>
							</thead>
							<tbody>
								{contatos.map(row => {
									return (
										<tr css={styles.tbl_row}>
											<td css={styles.tbl_col}>{row.nome}</td>
											<td css={styles.tbl_col}>{row.sobrenome}</td>
											<td css={styles.tbl_col}>{row.email}</td>
											<td css={styles.tbl_col}>{row.tel}</td>
											<td css={styles.tbl_col}>{row.endr}</td>
											<td css={styles.tbl_col}>{row.cidade}</td>
											<td css={styles.tbl_col}>{row.cep}</td>
											<td css={styles.tbl_col}>{row.dtNasc}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</bs.Modal.Body>
			</bs.Modal>
		</>
	)
}

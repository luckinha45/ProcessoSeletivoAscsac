import { useState } from 'react'
import * as bs from 'react-bootstrap'
import { css } from '@emotion/react'

export default function App() {
	const styles = {
		tbl: css({
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
	};

	//#region logic
	const [count, setCount] = useState<number>(0);

	const campanhas:Array<{id:number, nome:string}> = [
		{id:0, nome:'marketing'},
		{id:1, nome:'usuários'},
		{id:2, nome:'clientes'},
	]
	//#endregion

	return (
		<>
			<table css={styles.tbl}>
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
                  <bs.Button variant="primary" onClick={() => {}}>Mostrar</bs.Button>
                  <bs.Button variant="danger" onClick={() => {}}>Deletar </bs.Button>
                </td>
              </tr>
            )
					})}
				</tbody>
			</table>
		</>
	)
}

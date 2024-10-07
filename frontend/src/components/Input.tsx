import { css } from '@emotion/react';
import * as bs from 'react-bootstrap'

export default function Input(props: {inptName: string, wd: number, isPwd: boolean, setVal: (val:string)=>void}) {
	const styles = {
		div: css({
			padding: "13px",
			paddingBottom: "0px",
			paddingLeft: "0px",
			paddingRight: "0px",
			position: "relative",
		}),

		lbl: css({
			position: "absolute",
			top: "-2px",
			left: "3px",
			backgroundColor: "purple",
			padding: "0px 5px 0px 5px",
			borderRadius: "5px",
			border: "1px solid black",
			color: "white",
			fontWeight: 450,
			//WebkitTextStroke: "0.5px black",
		}),

		inpt: css({
			width: props.wd,
			fontSize: "1rem",
			padding: "9px 0px 5px 5px",
			fontWeight: 400,
		})
	};

	return (
		<div css={styles.div}>
			<bs.FormControl className='bg-dark text-white' type={props.isPwd ? "password" : "text"} css={styles.inpt} onChange={(e) => props.setVal(e.target.value)} />
			<label css={styles.lbl}>{props.inptName}</label>
		</div>
	)
}

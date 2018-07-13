import * as React from "react";
import CharacterModel from "../model/CharacterModel";

export interface Props {
	characters: CharacterModel[];
	characterIndex: number;
	boardIndex: number;
}

export default class CharacterPanel extends React.PureComponent<Props> {
	private renderClassInfo(index: number) {
		const b = this.props.characters[this.props.characterIndex].getClass(index);
		const selected = this.props.boardIndex === index;
		if (!b) {
			return <button className="job nojob" aria-pressed={selected}>
				<span className="name">No Job</span>
			</button>;
		} else {
			return <button className="job" aria-pressed={selected}>
				<span className="name">{b.name}</span>
			</button>;
		}
	}

	render() {
		return <div className="character-panel">
			{this.props.characters.map((c, i) => <div key={i} aria-pressed={this.props.characterIndex === i}>
				<span className="name">{c.getCharacter().name}</span>
				{this.renderClassInfo(0)}
				{this.renderClassInfo(1)}
			</div>)}
		</div>;
	}
}

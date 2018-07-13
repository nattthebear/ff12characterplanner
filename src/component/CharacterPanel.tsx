import * as React from "react";
import CharacterModel from "../model/CharacterModel";
import "./CharacterPanel.scss";

export interface Props {
	characters: CharacterModel[];
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	// changeCharacterIndex(newIndex: number): void;
	// changeBoardIndex(newIndex: number): void;
}

export default class CharacterPanel extends React.PureComponent<Props> {
	private renderClassInfo(characterIndex: number, index: number) {
		const b = this.props.characters[characterIndex].getClass(index);
		const selected = this.props.characterIndex === characterIndex && this.props.boardIndex === index;
		if (!b) {
			return <button className="job nojob" aria-pressed={selected} onClick={() => this.props.changeIndices(characterIndex, index)}>
				<span className="name">No Job</span>
			</button>;
		} else {
			return <button className="job" aria-pressed={selected} onClick={() => this.props.changeIndices(characterIndex, index)}>
				<span className="name">{b.name}</span>
			</button>;
		}
	}

	render() {
		return <div className="character-panel">
			<div className="character-select">
				{this.props.characters.map((c, i) => <div className="character" key={i} aria-pressed={this.props.characterIndex === i}>
					<span className="name">{c.getCharacter().name}</span>
					<br />
					{this.renderClassInfo(i, 0)}
					<br />
					{this.renderClassInfo(i, 1)}
				</div>)}
			</div>
		</div>;
	}
}

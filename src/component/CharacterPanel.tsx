import * as React from "react";
import CharacterModel, { Coloring } from "../model/CharacterModel";
import "./CharacterPanel.scss";
import { LicenseGroups, LicenseGroup, License } from "../data/Licenses";

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
		const char = this.props.characters[characterIndex];
		const b = char.getClass(index);
		const selected = this.props.characterIndex === characterIndex && this.props.boardIndex === index;
		if (!b) {
			const disabled = index === 1 && !char.getClass(0);
			return <button disabled={disabled} className="job nojob" aria-pressed={selected} onClick={() => this.props.changeIndices(characterIndex, index)}>
				<span className="name">No Job</span>
			</button>;
		} else {
			return <button className="job" aria-pressed={selected} onClick={() => this.props.changeIndices(characterIndex, index)}>
				<span className="name">{b.name}</span>
			</button>;
		}
	}

	private renderLicenseGroup(g: LicenseGroup, i: number, colors: Map<License, Coloring>) {
		const children = Array<React.ReactNode>();
		for (const l of g.contents) {
			let className: string;
			switch (colors.get(l)) {
				case Coloring.OBTAINED: className = "l obtained"; break;
				case Coloring.CERTAIN: className = "l certain"; break;
				case Coloring.POSSIBLE: className = "l possible"; break;
				case Coloring.BLOCKED: className = "l blocked"; break;
				default: continue; // don't render not-at-all available licenses
			}
			children.push(<p key={l.fullName} className={className} aria-label={l.text}>{l.fullName}</p>);
		}
		if (children.length) {
			return <div key={i} className="group">
				<h3 className="name">{g.name}</h3>
				{children}
			</div>;
		} else {
			return <div key={i} />;
		}
	}

	private renderStatInfo() {
		const colors = this.props.characters[this.props.characterIndex].color();
		return LicenseGroups.map((g, i) => this.renderLicenseGroup(g, i, colors));
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
			<div className="stats">
				{this.renderStatInfo()}
			</div>
		</div>;
	}
}

import * as React from "react";
import PartyModel from "../model/PartyModel";
import CharacterPlanner from "./CharacterPlanner";
import autobind from "autobind-decorator";
import "normalize.css/normalize.css";
import "./App.scss";

export interface State {
	party: PartyModel;
	characterIndex: number;
	boardIndex: number;
	qeActive: boolean;
}

export default class App extends React.PureComponent<{}, State> {
	constructor(props: {}) {
		super(props);
		const party = location.search && PartyModel.decode(location.search.slice(1));
		this.state = {
			party: party || new PartyModel(),
			characterIndex: 0,
			boardIndex: 0,
			qeActive: false
		};
	}

	@autobind
	private changeParty(newParty: PartyModel) {
		this.setState(s => {
			if (s.boardIndex && !newParty.getJob(s.characterIndex, s.boardIndex)) {
				// don't allow selecting second job when first one is not learned
				return { party: newParty, boardIndex: 0 };
			} else {
				return { party: newParty, boardIndex: s.boardIndex };
			}
		});
	}

	@autobind
	private changeIndices(characterIndex: number, boardIndex: number) {
		this.setState({ characterIndex, boardIndex });
	}

	@autobind
	private toggleQe() {
		this.setState(s => ({ qeActive: !s.qeActive }));
	}

	private updateSearch() {
		history.replaceState(null, undefined, location.href.split("?")[0] + "?" + this.state.party.encode());
	}

	componentDidMount() {
		this.updateSearch();
	}

	componentDidUpdate(prevProps: {}, prevState: State) {
		if (this.state.party !== prevState.party) {
			this.updateSearch();
		}
	}

	render() {
		return <CharacterPlanner {...this.state} changeParty={this.changeParty} changeIndices={this.changeIndices} toggleQe={this.toggleQe} />;
	}
}

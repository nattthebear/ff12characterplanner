import { h, type TPC } from "vdomk";
import CharacterPanel from "./CharacterPanel.tsx";
import LicenseBoard from "./LicenseBoard.tsx";
import QeBoard from "./QeBoard.tsx";
import Dps from "./Dps.tsx";
import { useStore } from "../store/Store.ts";
import PartyModel from "../model/PartyModel.ts";

import "./CharacterPlanner.css";

const CharacterPlanner: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);
	let prevParty: PartyModel | undefined;

	return () => {
		const { party, qeActive, dpsActive } = getState();

		if (party !== prevParty) {
			requestIdleCallback(() => {
				const urlBase = window.location.href.split("?")[0];
				const search = party.encode();
				const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
				window.history.replaceState(null, "", urlBase + urlSuffix);
			});
			prevParty = party;
		}

		return <div class="character-planner">
			<CharacterPanel />
			{qeActive
				? <QeBoard />
				: dpsActive
					? <Dps party={party} />
					: <LicenseBoard />
			}
		</div>;
	};
};
export default CharacterPlanner;

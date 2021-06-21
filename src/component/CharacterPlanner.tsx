import { h } from "preact";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import QeBoard from "./QeBoard";
import Dps from "./Dps";
import { useStore } from "../store/Store";


export default function CharacterPlanner() {
	const store = useStore();

	return <div className="character-planner">
		<CharacterPanel />
		{store.qeActive
			? <QeBoard />
			: store.dpsActive
				? <Dps party={store.party} />
				: <LicenseBoard />
		}
	</div>;
}

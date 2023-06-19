import { h, TPC } from "vdomk";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.css";
import QeBoard from "./QeBoard";
import Dps from "./Dps";
import { useStore } from "../store/Store";

const CharacterPlanner: TPC<{}> = (_, hooks) => {
	const getState = useStore(hooks);
	return () => {
		const store = getState();
		return <div class="character-planner">
			<CharacterPanel />
			{store.qeActive
				? <QeBoard />
				: store.dpsActive
					? <Dps party={store.party} />
					: <LicenseBoard />
			}
		</div>;
	};
};
export default CharacterPlanner;

import { Component, h } from "vdomk";
import type { Terrain, Weather, ElementalReaction } from "../dps/Profile";

interface InputProps<T> {
	value: T;
	changeValue: (newValue: T) => void;
	label: string;
	tooltip: string;
}

interface NumberInputProps extends InputProps<number> {
	min: number;
	max: number;
}

export function NumberInput(props: NumberInputProps) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			{props.label}
			<input
				class={`d-${props.max.toString().length}`}
				type="number"
				value={props.value}
				min={props.min}
				max={props.max}
				onChange={ev => {
					if (ev.currentTarget.validity.valid) {
						const newValue = ev.currentTarget.valueAsNumber;
						if (newValue === newValue) {
							props.changeValue(newValue);
						}
					}
				}}
			/>
		</label>
	</div>;
}

export function BoolInput(props: InputProps<boolean>) {
	return <div aria-label={props.tooltip} class="control">
		<label>
			<input
				type="checkbox"
				checked={props.value}
				onChange={() => props.changeValue(!props.value)}
			/>
			{props.label}
		</label>
	</div>;
}

function makeEnumInput<T extends string>(options: { value: T, label: string}[], isNumber: false): Component<InputProps<T>>;
function makeEnumInput<T extends number>(options: { value: T, label: string}[], isNumber: true): Component<InputProps<T>>;
function makeEnumInput<T extends string | number>(options: { value: T, label: string}[], isNumber: boolean) {
	const optionNodes = options.map(({ value, label }) => <option value={value}>{label}</option>);
	const convertValue = isNumber ? Number : String;

	return function EnumInput(props: InputProps<T>) {
		return <div aria-label={props.tooltip} class="control">
			<label>
				{props.label}
				<select
					value={props.value}
					onChange={ev => props.changeValue(convertValue(ev.currentTarget.value) as T)}
				>
					{optionNodes}
				</select>
			</label>
		</div>;
	}
}

export const ElementInput = makeEnumInput<ElementalReaction>([
	{ value: 0, label: "Immune" },
	{ value: 0.5, label: "Strong" },
	{ value: 1, label: "Normal" },
	{ value: 2, label: "Weak" },
], true);

export const WeatherInput = makeEnumInput<Weather>([
	{ value: "other", label: "None" },
	{ value: "windy", label: "Wind" },
	{ value: "rainy", label: "Rain" },
	{ value: "foggy", label: "Fog" },
	{ value: "windy and rainy", label: "Downpour" },
], false);

export const TerrainInput = makeEnumInput<Terrain>([
	{ value: "other", label: "None" },
	{ value: "sand", label: "Sand" },
	{ value: "water", label: "Water" },
	{ value: "snow", label: "Snow" },
], false);

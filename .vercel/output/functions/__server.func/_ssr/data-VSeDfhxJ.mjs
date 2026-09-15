//#region node_modules/.nitro/vite/services/ssr/assets/data-VSeDfhxJ.js
var VIEW = {
	w: 400,
	h: 500
};
var NODES = {
	jagdishpur: {
		id: "jagdishpur",
		x: 168,
		y: 32,
		label: "Jagdishpur",
		kind: "hub"
	},
	varanasi: {
		id: "varanasi",
		x: 180,
		y: 86,
		label: "Varanasi",
		kind: "city",
		cityId: "varanasi"
	},
	patna: {
		id: "patna",
		x: 238,
		y: 108,
		label: "Patna",
		kind: "city",
		cityId: "patna",
		lx: 16,
		ly: -6
	},
	bokaro: {
		id: "bokaro",
		x: 214,
		y: 168,
		label: "Bokaro",
		kind: "hub"
	},
	ranchi: {
		id: "ranchi",
		x: 126,
		y: 204,
		label: "Ranchi",
		kind: "city",
		cityId: "ranchi",
		lx: -10
	},
	jamshedpur: {
		id: "jamshedpur",
		x: 302,
		y: 200,
		label: "Jamshedpur",
		kind: "city",
		cityId: "jamshedpur",
		lx: 28,
		ly: -4
	},
	durgapur: {
		id: "durgapur",
		x: 272,
		y: 252,
		label: "Durgapur",
		kind: "hub",
		lx: 24,
		ly: 6
	},
	kolkata: {
		id: "kolkata",
		x: 308,
		y: 312,
		label: "Kolkata",
		kind: "city",
		cityId: "kolkata",
		lx: 18
	},
	angul: {
		id: "angul",
		x: 160,
		y: 258,
		label: "Angul",
		kind: "hub"
	},
	bhubaneswar: {
		id: "bhubaneswar",
		x: 124,
		y: 334,
		label: "Bhubaneswar",
		kind: "city",
		cityId: "bhubaneswar",
		lx: -10,
		ly: 18
	},
	cuttack: {
		id: "cuttack",
		x: 196,
		y: 310,
		label: "Cuttack",
		kind: "city",
		cityId: "cuttack",
		lx: 26,
		ly: -4
	},
	dhamra: {
		id: "dhamra",
		x: 232,
		y: 360,
		label: "Dhamra",
		kind: "hub",
		ly: 16
	}
};
var CITIES = [
	{
		id: "varanasi",
		name: "Varanasi",
		image: "/cities/varanasi.jpg",
		activities: [
			{
				label: "CNG mobility",
				icon: "auto"
			},
			{
				label: "PNG homes",
				icon: "home"
			},
			{
				label: "Restaurants",
				icon: "food"
			},
			{
				label: "City activity",
				icon: "temple"
			}
		],
		line: "The ghats wake. Autos move. Homes take flame."
	},
	{
		id: "patna",
		name: "Patna",
		image: "/cities/patna.jpg",
		activities: [
			{
				label: "CNG mobility",
				icon: "taxi"
			},
			{
				label: "Homes",
				icon: "home"
			},
			{
				label: "Commercial",
				icon: "office"
			},
			{
				label: "Healthcare",
				icon: "hospital"
			}
		],
		line: "Riverfront offices, wards, and kitchens come online."
	},
	{
		id: "ranchi",
		name: "Ranchi",
		image: "/cities/ranchi.jpg",
		activities: [
			{
				label: "Mobility",
				icon: "taxi"
			},
			{
				label: "PNG",
				icon: "home"
			},
			{
				label: "Industry",
				icon: "industry"
			}
		],
		line: "The plateau city starts its morning shift."
	},
	{
		id: "jamshedpur",
		name: "Jamshedpur",
		image: "/cities/jamshedpur.jpg",
		activities: [
			{
				label: "Industrial activity",
				icon: "industry"
			},
			{
				label: "Commercial transport",
				icon: "truck"
			},
			{
				label: "Homes",
				icon: "home"
			}
		],
		line: "Furnaces hold temperature. Colonies stay warm."
	},
	{
		id: "bhubaneswar",
		name: "Bhubaneswar",
		image: "/cities/bhubaneswar.jpg",
		activities: [
			{
				label: "Public transport",
				icon: "bus"
			},
			{
				label: "PNG",
				icon: "home"
			},
			{
				label: "Commercial activity",
				icon: "office"
			}
		],
		line: "Buses roll. Sectors light in sequence."
	},
	{
		id: "cuttack",
		name: "Cuttack",
		image: "/cities/cuttack.jpg",
		activities: [
			{
				label: "Mobility",
				icon: "taxi"
			},
			{
				label: "Households",
				icon: "home"
			},
			{
				label: "Commercial activity",
				icon: "food"
			}
		],
		line: "Markets open along the Mahanadi."
	},
	{
		id: "kolkata",
		name: "Kolkata",
		image: "/cities/kolkata.jpg",
		activities: [
			{
				label: "Transport",
				icon: "taxi"
			},
			{
				label: "Homes",
				icon: "home"
			},
			{
				label: "Industry",
				icon: "industry"
			},
			{
				label: "Commercial",
				icon: "office"
			}
		],
		line: "The eastern terminal city is fully live."
	}
];
var CITY_BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c]));
var SLOTS = [
	{
		id: "s1",
		piece: "city",
		from: "jagdishpur",
		to: "varanasi",
		cityId: "varanasi"
	},
	{
		id: "s2",
		piece: "city",
		from: "varanasi",
		to: "patna",
		cityId: "patna"
	},
	{
		id: "s3",
		piece: "junction",
		from: "patna",
		to: "bokaro"
	},
	{
		id: "s4",
		piece: "turn",
		from: "bokaro",
		to: "ranchi",
		cityId: "ranchi"
	},
	{
		id: "s5",
		piece: "turn",
		from: "bokaro",
		to: "jamshedpur",
		cityId: "jamshedpur"
	},
	{
		id: "s6",
		piece: "city",
		from: "bokaro",
		to: "kolkata",
		cityId: "kolkata",
		extraPaths: [["bokaro", "durgapur"], ["durgapur", "kolkata"]]
	},
	{
		id: "s7",
		piece: "straight",
		from: "bokaro",
		to: "angul",
		extraPaths: [["angul", "dhamra"]]
	},
	{
		id: "s8",
		piece: "city",
		from: "angul",
		to: "bhubaneswar",
		cityId: "bhubaneswar"
	},
	{
		id: "s9",
		piece: "city",
		from: "angul",
		to: "cuttack",
		cityId: "cuttack"
	}
];
var PIECES = [
	{
		id: "straight",
		label: "Straight"
	},
	{
		id: "turn",
		label: "Turn"
	},
	{
		id: "junction",
		label: "Junction"
	},
	{
		id: "city",
		label: "City connector"
	}
];
var CHALLENGES = [
	{
		id: "varanasi",
		name: "Energize Varanasi",
		brief: "Connect Varanasi in under 30 seconds.",
		cityTarget: 1,
		timeLimitMs: 3e4
	},
	{
		id: "east-run",
		name: "East India Energy Run",
		brief: "Connect 5 cities along the corridor.",
		cityTarget: 5
	},
	{
		id: "cgd",
		name: "CGD Champion",
		brief: "Activate 5 CGD cities.",
		cityTarget: 5
	},
	{
		id: "master",
		name: "Pipeline Master",
		brief: "Complete the network with no wrong connections.",
		cityTarget: 7,
		noWrong: true
	},
	{
		id: "wah",
		name: "Wah Kya Energy Hai",
		brief: "Energize the complete challenge map.",
		cityTarget: 7
	}
];
var CITIZENS = [
	{
		id: "home",
		label: "My Home",
		blurb: "PNG in the kitchen",
		bonus: 400
	},
	{
		id: "commute",
		label: "My Commute",
		blurb: "CNG on the move",
		bonus: 400
	},
	{
		id: "industry",
		label: "My Industry",
		blurb: "Steady furnace heat",
		bonus: 400
	},
	{
		id: "city",
		label: "My City",
		blurb: "Wards, buses, markets",
		bonus: 400
	},
	{
		id: "environment",
		label: "My Environment",
		blurb: "Cleaner air along the route",
		bonus: 600
	}
];
var HANDLES = [
	"UrjaStar",
	"PipePilot",
	"CitySpark",
	"GangaFlow",
	"EastGrid",
	"CgdChamp",
	"NightLight",
	"GridRunner",
	"FlameLine",
	"CoastalGas",
	"DeltaLink",
	"SteelSpark",
	"GhatLight",
	"TempleGlow",
	"BridgeLine",
	"OdishaLink"
];
var POINTS = {
	pipe: 100,
	city: 500,
	cgdNetwork: 750,
	combo3: 1e3,
	completeRoute: 2500,
	noWrong: 1e3,
	completeChallenge: 5e3
};
var IMPACT_LABELS = [
	{
		at: 0,
		text: "Network waiting"
	},
	{
		at: 25,
		text: "Energy is moving"
	},
	{
		at: 50,
		text: "Cities are waking up"
	},
	{
		at: 75,
		text: "Life is getting energized"
	},
	{
		at: 100,
		text: "India is energized"
	}
];
function badgeFor(cities, complete) {
	if (complete && cities >= 7) return {
		id: "master",
		name: "Wah Kya Energy Hai"
	};
	if (cities >= 5) return {
		id: "energizer",
		name: "City Energizer"
	};
	if (cities >= 3) return {
		id: "connector",
		name: "Pipeline Connector"
	};
	if (cities >= 1) return {
		id: "starter",
		name: "Energy Starter"
	};
	return {
		id: "none",
		name: "Energy Connector"
	};
}
function impactLabel(pct) {
	let label = IMPACT_LABELS[0].text;
	for (const row of IMPACT_LABELS) if (pct >= row.at) label = row.text;
	return label;
}
function node(id) {
	const n = NODES[id];
	if (!n) throw new Error(`Unknown node ${id}`);
	return n;
}
function midpoint(a, b) {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2
	};
}
function pathD(a, b) {
	const mx = (a.x + b.x) / 2;
	const my = (a.y + b.y) / 2;
	const dx = b.x - a.x;
	const nx = -(b.y - a.y) * .08;
	const ny = dx * .08;
	return `M ${a.x} ${a.y} Q ${mx + nx} ${my + ny} ${b.x} ${b.y}`;
}
var LAND_PATH = "M64 36C108 6 178 2 236 16C292 30 338 62 352 108C366 152 360 196 352 236C360 276 372 318 362 356C352 396 328 428 286 444C236 462 186 454 146 430C108 408 86 370 78 328C70 286 58 250 64 210C70 166 52 118 64 36Z";
var RIVER_PATH = "M160 18C172 64 208 104 236 142C264 180 252 224 270 264C288 304 314 336 338 372";
var SAVE_KEY = "gail-energy-connect-v1";
//#endregion
export { node as _, HANDLES as a, PIECES as c, SAVE_KEY as d, SLOTS as f, midpoint as g, impactLabel as h, CITY_BY_ID as i, POINTS as l, badgeFor as m, CITIES as n, LAND_PATH as o, VIEW as p, CITIZENS as r, NODES as s, CHALLENGES as t, RIVER_PATH as u, pathD as v };

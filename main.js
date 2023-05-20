/*********** BUTTONS *******/
let buttons = document.getElementById("buttons");

let showNotes = true;
let showKeys = false;
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const keyCodes = [
	122, 115, 120, 100, 99, 118, 103, 98, 104, 110, 106, 109, 121, 55, 117, 56,
	105, 111, 48, 112, 45, 91, 61, 93,
];

let arr = [...new Array(24)];
arr.forEach((e, i) => (arr[i] = i));

const buttonMap = () => {
	buttons.innerHTML = arr
		.map((item) => {
			let note = item < 12 ? notes[item] : notes[item - 12];
			return `<button class='key ${
				note.includes("#") ? "blackKey" : "whiteKey"
			}' value=${item}>${showNotes ? note : ""}
		${
			showKeys
				? "<div class='keyboardKeys'>" +
				  String.fromCharCode(keyCodes[item]) +
				  " </div>"
				: ""
		}
		</button>`;
		})
		.join("");
};


/************* TOGGLES ********/

let showNotesToggle = document.getElementById("showNotes");
let showKeysToggle = document.getElementById("showKeys");
let toggleCircle = document.getElementsByClassName("toggleCircle")[0];
let toggleCircle1 = document.getElementsByClassName("toggleCircle")[1];

const showKeysClick = () => {
	showKeys
		? toggleCircle1.classList.remove("toggleCircleClicked")
		: toggleCircle1.classList.add("toggleCircleClicked");
};
const showNotesClick = () => {
	showNotes
		? toggleCircle.classList.remove("toggleCircleClicked")
		: toggleCircle.classList.add("toggleCircleClicked");
};

showNotesToggle.addEventListener("click", () => {
	showNotes = !showNotes;
	buttonMap();
	showNotesClick();
});

showKeysToggle.addEventListener("click", () => {
	showKeys = !showKeys;
	buttonMap();
	showKeysClick();
});

/********* SOUND ***********/

let waveForm = document.getElementById("wave");
let waveImg = document.getElementById("waveImg");
let octaveDown = document.getElementById("octaveDown");
let octaveUp = document.getElementById("octaveUp");
let keys = document.getElementsByClassName("key");
let currentNote = document.getElementById("currentNote");
let waves = ["sine", "sawtooth", "square", "triangle"];
let waveNumber = 0;
let context = null 
let octave = 261.63;


octaveDown.addEventListener("click", () => (octave = octave / 2));
octaveUp.addEventListener("click", () => (octave = octave * 2));

const waveImage = () => {
	waveImg.style.backgroundImage = `url('./images/${waves[waveNumber]}.svg')`;
};

waveForm.addEventListener("click", () => {
	waveNumber < waves.length - 1 ? waveNumber++ : (waveNumber = 0);
	waveImage();
});
const play = (i) => {

	if(context == null) context=new AudioContext();
	if ([...keys[i].classList].some((e) => e == "whiteKey"))
		keys[i].classList.add("whiteKeyClicked");

	if ([...keys[i].classList].some((e) => e == "blackKey"))
		keys[i].classList.add("blackKeyClicked");
let oscillator = context.createOscillator();
let gain = context.createGain();
	oscillator.type = waves[waveNumber];
	frequency = octave * 2 ** (i / 12);
	oscillator.frequency.value = frequency;
	gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.6);
	oscillator.connect(gain);
	gain.connect(context.destination);
	oscillator.start(context.currentTime+0);
	let note = i < 12 ? notes[i] : notes[i - 12];
	currentNote.innerText = note;
	oscillator.stop(context.currentTime+1.6);
	
};

const unplay = (i) => {
	
	
	if ([...keys[i].classList].some((e) => e == "whiteKeyClicked"))
		keys[i].classList.remove("whiteKeyClicked");

	if ([...keys[i].classList].some((e) => e == "blackKeyClicked"))
		keys[i].classList.remove("blackKeyClicked");
};

/*********** CONTROL ***********/


buttons.addEventListener("mousedown", (i) => {
	play(i.target.value);
});
buttons.addEventListener("mouseup", (i) => {
	unplay(i.target.value);
});

window.addEventListener("keydown", (i) => {
	if(!i.repeat){
		let numb = keyCodes.indexOf(i.key.charCodeAt(0));
		numb > -1 && play(keyCodes.indexOf(i.key.charCodeAt(0)));}
});
window.addEventListener("keyup", (i) => {
	let numb = keyCodes.indexOf(i.key.charCodeAt(0));
	numb > -1 && unplay(keyCodes.indexOf(i.key.charCodeAt(0)));
});

waveImage();
buttonMap();
showNotesClick();
showKeysClick();

/************ RANDOMIZER ****************/

let randomSpeed = document.getElementById("randomSpeed");
let randomSpeedUp = document.getElementById("randomSpeedUp");
let randomSpeedDown = document.getElementById("randomSpeedDown");
let randomPlay = document.getElementById("randomPlay");
let randomPlaying = false;

randomSpeed.addEventListener("input", () => {
	if (randomSpeed.value < 10) randomSpeed.value = 25;
});
randomSpeedUp.addEventListener("click", () => {
	if(randomSpeed.value<325)
	randomSpeed.value = Number(randomSpeed.value) + 5;
});
randomSpeedDown.addEventListener("click", () => {
	if(randomSpeed.value>25)
	randomSpeed.value = Number(randomSpeed.value) - 5;
});

const delay = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
const randomizer = () => {
	if (randomPlaying) {
		let arr = [0.375, 0.5, 0.625, 0.75, 0.875, 1];
		arrIdx = Math.ceil(Math.random() * arr.length - 1);
		let speed =  arr[arrIdx] * 1000/(randomSpeed.value / 60) ;
		console.log(randomSpeed.value , 1000/(randomSpeed.value / 60))
		randomPlay.innerText = "STOP";
		setTimeout(() => {
			let index = Math.ceil(Math.random() * keyCodes.length - 1);
			let coolNotes = [0, 2, 4, 6, 7, 9, 11];
			if (coolNotes.includes(index) || coolNotes.includes(index - 12)) {
				play(index);
				delay(speed).then(() => unplay(index));
			}
			randomizer();
		}, speed);
	} else {
		randomPlay.innerText = "Play ►";
	}
};

randomPlay.addEventListener("click", () => {
	randomPlaying = !randomPlaying;
	randomizer();
});

/******* CHANGE KEYS ********/

let changeKeysForm = document.getElementById("changeKeysForm");
let changeKeys = document.getElementById("changeKeys");
let changeKeysClicked = false;



const changeKeysContainer = () => {
	let line = `<ul>
	${keyCodes
		.map((e, i) => {
			let note = i < 12 ? notes[i] : notes[i - 12];
			return (
				"<li><p>" +
				note +
				"</p><input oninput='chnageKeysOnChnage(" +
				i +
				")' value=" +
				String.fromCharCode(keyCodes[i]) +
				"></li>  "
			);
		})
		.join(
			""
		)}<button class='changeKeysClose' onclick='changeKeysOpen()'>close</button></ul>`;
	changeKeysForm.innerHTML = changeKeysClicked ? line : "";
};

const changeKeysOpen = () => {
	changeKeysClicked = !changeKeysClicked;
	changeKeysContainer();
};

changeKeys.addEventListener("click", changeKeysOpen);

const chnageKeysOnChnage = (i) => {
	let input = document.getElementsByTagName("input")[i];
	input.value = input.value[input.value.length - 1];
	keyCodes[i] = input.value.charCodeAt("0");
	buttonMap();
};
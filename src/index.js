import { AUDIOS } from "./data.js";
import { shuffleArray } from "./method.js";
import { Title, Song, Bar, PlayButtons, PlayArea } from "./class.js";

const playButtons = new PlayButtons();
document.querySelector(".container").prepend(playButtons.getEl());

const bar = new Bar();
document.querySelector(".container").prepend(bar.getEl());

const title = new Title();
document.querySelector(".container").prepend(title.getEl());

///////////////////////////////
const playSong = function(id, name, length) {
  title.setName(name);
  title.setLength(length);
  title.play();

  bar.setLength(length);
  bar.play();
};

const stopSong = function() {
  title.setName("");
  title.setLength(0);
  title.stop();

  bar.stop();
};

const pauseSong = function() {
  title.pause();
  bar.pause();
};

window.playArea = new PlayArea(AUDIOS, playSong, pauseSong, stopSong);
document.querySelector(".musiclist").appendChild(playArea.getEl());
playArea.show();

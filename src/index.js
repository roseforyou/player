import AUDIOS from "./data";
import Title from './class/title';
import Bar from './class/bar';
import PlayButtons from './class/playButtons'
import PlayArea from "./class/playList";

const playButtons = new PlayButtons();
document.querySelector(".container").prepend(playButtons.getEl());

const bar = new Bar();
document.querySelector(".container").prepend(bar.getEl());

const title = new Title();
document.querySelector(".container").prepend(title.getEl());

///////////////////////////////
const playSong = function(id, name, length) {
  if (name) title.setName(name);
  if (length) title.setLength(length);
  title.play();

  if (length) bar.setLength(length);
  bar.play();

  playButtons.setPlayStatus('playing');
};

const stopSong = function() {
  title.setLength(0);
  title.stop();

  bar.stop();
  playButtons.setPlayStatus('stop');
};

const pauseSong = function() {
  title.pause();
  bar.pause();
  playButtons.setPlayStatus('pause');
};


window.playArea = new PlayArea(AUDIOS, playSong, pauseSong, stopSong);
document.querySelector(".musiclist").appendChild(playArea.getEl());
playArea.show();

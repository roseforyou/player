import { AUDIOS } from './data.js';
import { shuffleArray } from './method.js';
import { Title, Song, Bar, PlayButtons } from './class.js';


let playButtons = new PlayButtons();
document.querySelector('.container').prepend(playButtons.getEl());

let bar = new Bar();
document.querySelector('.container').prepend(bar.getEl());

let title = new Title();
document.querySelector('.container').prepend(title.getEl());

let ul = document.createElement('ul');
let songs = [];
let currentID = -1;
let clickSong = function(id, name, length) {
  let s = songs.find(data=>{return data.playing});
  if(s) {
    s.setStop();

  }
  songs.find(data=>{return data.id === id}).setPlay();

  title.setName(name);
  title.setLength(length);
  title.play();

  bar.setLength(length);
  bar.play();
}
shuffleArray(AUDIOS).map(data => {
  let song = new Song(data.id, data.name, data.length, clickSong);
  songs.push(song);
  ul.appendChild(song.getEl());
});
document.querySelector('.musiclist').appendChild(ul);
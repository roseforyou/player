import { AUDIOS } from './data.js';

class Song {
  constructor(id, name, length) {
    this.id = id;
    this.name = name;
    this.length = length;
    this.playing = false;

    this.li = this.createEl("li");
    this.cb = this.createEl('input', [], 'checkbox');
    this.span1 = this.createEl("span", ['cb']);
    this.span1.appendChild(this.cb);

    this.span2 = this.createEl("span", ['name']);
    this.span2.innerHTML = this.name;
    this.span2.onclick = function(event){

    }

    this.span3 = this.createEl("span", ['time']);
    this.span3.innerHTML = this.formatTime(this.length);

    this.li.appendChild(this.span1);
    this.li.appendChild(this.span2);
    this.li.appendChild(this.span3);

  }

  createEl(label, cls, type) {
    let el = document.createElement(label);
    if (cls && cls.length) el.classList.add(...cls);
    if (type) el.type = type;
    return el;
  }

  addZero(str) {
    return str >= 10 ? str : '0' + str;
  }
  formatTime(length) {
    return this.addZero(Math.floor(length / 60)) + ':' + this.addZero(length % 60);
  }

  setPlay() {
    if (this.playing) return;
    this.li.classList.add('on');
    this.playing = true;
  }

  setStop() {
    if (!this.playing) return;
    this.li.classList.remove('on');
    this.playing = false;
  }

  getEl() {
    return this.li;
  }

}

let ul = document.createElement('ul');
let songList = AUDIOS.map(data => {
  let song = new Song(data.id, data.name, data.length);
  ul.appendChild(song.getEl());
})
document.querySelector('.musiclist').appendChild(ul);
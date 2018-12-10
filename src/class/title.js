import {createEl, addZero} from '../method'

class Title {
  constructor(name, length) {
    this.name = name || "";
    this.initLen = length || 0;
    this.length = length || 0;

    this.span1 = createEl("span", ["name"]);
    this.span1.innerHTML = "Welcome to play music!";
    this.span2 = createEl("span", ["time"]);
    this.span2.innerHTML = "";
    this.div = createEl("div", ["title"]);
    this.div.append(this.span1, this.span2);

    this.si = 0;
  }

  formatTime(length) {
    return "-" + addZero(Math.floor(length / 60)) + ":" + addZero(length % 60);
  }

  setTime() {
    this.span2.innerHTML = this.formatTime(this.length);
  }
  setName(name) {
    this.span1.innerHTML = name;
  }

  setLength(length) {
    this.length = length;
    this.initLen = length;
    this.setTime();
  }

  play() {
    clearInterval(this.si);
    this.si = setInterval(
      function(ct) {
        if (ct.length === 0) {
          clearInterval(ct.si);
          ct.length = ct.initLen;
          // playlist next song
          return;
        }
        ct.length--;
        ct.setTime();
      },
      1000,
      this
    );
  }

  pause() {
    clearInterval(this.si);
  }

  stop() {
    clearInterval(this.si);
    this.length = this.initLen;
  }

  getEl() {
    return this.div;
  }
}
export default Title;
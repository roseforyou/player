function createEl(label, cls, type) {
  let el = document.createElement(label);
  if (cls && cls.length) el.classList.add(...cls);
  if (type) el.type = type;
  return el;
}

function addZero(str) {
  return str >= 10 ? str : '0' + str;
}

class Song {
  constructor(id, name, length, playSong) {
    let that = this;

    this.id = id;
    this.name = name;
    this.length = length;
    this.playing = false;
    this.selected = false;
    this.playSong = playSong;

    this.li = createEl("li");
    this.cb = createEl('input', [], 'checkbox');
    this.cb.onclick = function () {
      if (that.selected) {
        that.selected = false;
        that.li.classList.remove('on');
      } else {
        that.selected = true;
        that.li.classList.add('on');
      }
    };
    this.span1 = createEl("span", ['cb']);
    this.span1.appendChild(this.cb);

    this.span2 = createEl("span", ['name']);
    this.span2.innerHTML = this.name;
    this.span2.onclick = function () {
      if (that.selected) {
        that.selected = false;
        that.cb.checked = false;
        that.li.classList.remove('on');
      } else {
        that.selected = true;
        that.cb.checked = true;
        that.li.classList.add('on');
      }
    };

    this.span2.ondblclick = function () {
      if (that.playing) return;
      that.playSong(that.id, that.name, that.length);
    }

    this.span3 = createEl("span", ['time']);
    this.span3.innerHTML = this.formatTime(this.length);

    this.li.appendChild(this.span1);
    this.li.appendChild(this.span2);
    this.li.appendChild(this.span3);

  }

  formatTime(length) {
    return addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
  }

  setPlay() {
    if (this.playing) return;
    this.li.classList.add('playing');
    this.playing = true;
  }

  setStop() {
    if (!this.playing) return;
    this.li.classList.remove('playing');
    this.playing = false;
  }

  getEl() {
    return this.li;
  }

}

class Title {
  constructor(name, length) {
    this.name = name || '';
    this.initLen = length || 0;
    this.length = length || 0;

    this.span1 = createEl("span", ['name']);
    this.span1.innerHTML = '';
    this.span2 = createEl("span", ['time']);
    this.span2.innerHTML = '';
    this.div = createEl("div", ['title']);
    this.div.append(this.span1, this.span2);

    this.si = 0;

  }

  formatTime(length) {
    return '-' + addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
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
    this.si = setInterval(function (ct) {
      if (ct.length === 0) {
        clearInterval(ct.si);
        ct.length = ct.initLen;
        // playlist next song 
        return;
      }
      ct.length--;
      ct.setTime();
    }, 1000, this);
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

class Bar {
  constructor() {
    this.div = createEl("div", ['bar']);
    this.divInner = createEl("div", ['pb']);
    this.div.append(this.divInner);

    this.si = 0;
  }

  getEl() {
    return this.div;
  }

  init() {
    this.initLength = 0;
    this.length = 0;
    this.divInner.style.width = 0;
  }

  formatLength() {
    this.divInner.style.width = 100 * this.length / this.initLen + '%';
  }

  setLength(length) {
    this.length = length;
    this.initLen = length;
    this.divInner.style.width = '100%';
  }

  play() {
    clearInterval(this.si);
    this.si = setInterval(function (ct) {
      if (ct.length === 0) {
        clearInterval(ct.si);
        // playlist next song 
        return;
      }
      ct.length--;
      ct.formatLength();
    }, 1000, this);
  }

  pause() {
    clearInterval(this.si);
  }

  stop() {
    clearInterval(this.si);
    this.init();
  }
}

class PlayButtons {
  constructor(prev, play, stop, next) {
    let that = this;
    this.prev = prev;
    this.play = play;
    this.stop = stop;
    this.next = next;

    this.prevDiv = createEl('button');
    this.prevDiv.innerHTML = 'Prev';
    this.prevDiv.onclick = function () {
      that.prev();
    }

    this.playDiv = createEl('button');
    this.playDiv.innerHTML = 'Play';
    this.playDiv.onclick = function () {
      that.play();
    }

    this.stopDiv = createEl('button');
    this.stopDiv.innerHTML = 'Stop';
    this.stopDiv.onclick = function () {
      that.stop();
    }

    this.nextDiv = createEl('button');
    this.nextDiv.innerHTML = 'Next';
    this.nextDiv.onclick = function () {
      that.next();
    }

    this.buttonsDiv = createEl('div', ['buttons']);
    this.buttonsDiv.append(this.prevDiv, this.playDiv, this.stopDiv, this.nextDiv);

    this.playing = false;
  }

  setPlayTxt() {
    if (this.playing) {
      this.playDiv.innerHTML = 'Pause';
      this.playDiv.classList.add('on');
    } else {
      this.playDiv.innerHTML = 'Play';
      this.playDiv.classList.remove('on');
    }
  }

  setPlayStatus(status) {
    this.playing = status;
    this.setPlayTxt();
  }

  getEl() {
    return this.buttonsDiv;
  }
}

export {
  Title,
  Song,
  Bar,
  PlayButtons
};
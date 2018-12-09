function createEl(label, cls, type) {
  let el = document.createElement(label);
  if (cls && cls.length) el.classList.add(...cls);
  if (type) el.type = type;
  return el;
}

function addZero(str) {
  return str >= 10 ? str : "0" + str;
}

class Song {
  constructor(id, name, length, playListObj) {
    Object.assign(this, { id, name, length, playListObj });

    this.playing = false;
    this.selected = false;

    this.li = createEl("li");
    this.cb = createEl("input", [], "checkbox");
    this.cb.addEventListener("click", () => {
      if (this.selected) {
        this.selected = false;
        this.li.classList.remove("on");
      } else {
        this.selected = true;
        this.li.classList.add("on");
      }
    });

    this.span1 = createEl("span", ["cb"]);
    this.span1.appendChild(this.cb);

    this.span2 = createEl("span", ["name"]);
    this.span2.innerHTML = this.name;
    this.span2.addEventListener("click", () => {
      if (this.selected) {
        this.selected = false;
        this.cb.checked = false;
        this.li.classList.remove("on");
      } else {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add("on");
      }
    });

    this.span2.addEventListener("dblclick", () => {
      if (this.playing) return;
      this.playListObj.playSong(this.id, this.name, this.length);
      if (!this.selected) {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add("on");
      }
    });

    this.span3 = createEl("span", ["time"]);
    this.span3.innerHTML = this.formatTime(this.length);

    this.li.appendChild(this.span1);
    this.li.appendChild(this.span2);
    this.li.appendChild(this.span3);
  }

  formatTime(length) {
    return addZero(Math.floor(length / 60)) + ":" + addZero(length % 60);
  }

  setPlay() {
    if (this.playing) return;
    this.li.classList.add("playing");
    this.playing = true;
  }

  setStop() {
    if (!this.playing) return;
    this.li.classList.remove("playing");
    this.playing = false;
  }

  getEl() {
    return this.li;
  }
}

class PlayList {
  constructor(songsList, emitPlay, emitPause, emitStop) {
    const sl = JSON.parse(JSON.stringify(songsList));
    Object.assign(this, { sl, emitPlay, emitPause, emitStop });

    this.ul = createEl("ul");

    this.songsObjList = this.sl.map(data => {
      let s = new Song(data.id, data.name, data.length, this);
      this.ul.appendChild(s.getEl());
      return s;
    });
  }

  playSong(id, name, length) {
    const s = this.songsObjList.find(data => {
      return data.playing;
    });
    if (s) {
      s.setStop();
    }
    const ns = this.songsObjList
      .find(data => {
        return data.id === id;
      })
      .setPlay();
    this.emitPlay(id, name, length);
  }

  moveChildNode(newChildIdx, oldChildIdx) {
    this.ul.insertBefore(
      this.ul.childNodes[newChildIdx],
      this.ul.childNodes[oldChildIdx]
    );
    if (newChildIdx === this.songsObjList.length - 1) {
      this.ul.appendChild(this.ul.childNodes[oldChildIdx + 1]);
    } else {
      this.ul.insertBefore(
        this.ul.childNodes[oldChildIdx + 1],
        this.ul.childNodes[newChildIdx + 1]
      );
    }
  }

  random() {
    this.ul.classList.remove("asc");
    this.ul.classList.remove("desc");
    for (let i = this.songsObjList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.songsObjList[i];
      this.songsObjList[i] = this.songsObjList[j];
      this.songsObjList[j] = temp;

      // this method is not useful
      // let ctempi = this.ul.childNodes[i].cloneNode(true);
      // let ctempj = this.ul.childNodes[j].cloneNode(true);
      // this.ul.replaceChild(ctempj, this.ul.childNodes[i]);
      // this.ul.replaceChild(ctempi, this.ul.childNodes[j]);

      if (i < j) {
        this.moveChildNode(j, i);
      } else if (i > j) {
        this.moveChildNode(i, j);
      }
    }
  }

  sortHandle(sort, nameA, nameB) {
    if (sort === "asc") {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    } else {
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
    }

    return 0;
  }

  sort() {
    if (this.ul.classList.contains("asc")) {
      this.songsObjList.sort((a, b) => {
        return this.sortHandle(
          "desc",
          a.name.toUpperCase(),
          b.name.toUpperCase()
        );
      });

      [...this.ul.childNodes]
        .sort((a, b) => {
          return this.sortHandle(
            "desc",
            a.querySelector(".name").innerHTML.toUpperCase(),
            b.querySelector(".name").innerHTML.toUpperCase()
          );
        })
        .map(node => this.ul.appendChild(node));

      this.ul.classList.remove("asc");
      this.ul.classList.add("desc");
    } else {
      this.songsObjList.sort((a, b) => {
        return this.sortHandle(
          "asc",
          a.name.toUpperCase(),
          b.name.toUpperCase()
        );
      });

      [...this.ul.childNodes]
        .sort((a, b) => {
          return this.sortHandle(
            "asc",
            a.querySelector(".name").innerHTML.toUpperCase(),
            b.querySelector(".name").innerHTML.toUpperCase()
          );
        })
        .map(node => this.ul.appendChild(node));

      this.ul.classList.remove("desc");
      this.ul.classList.add("asc");
    }
  }

  delete() {
    if (
      typeof this.songsObjList.find(data => {
        return data.selected === true;
      }) === "undefined"
    ) {
      alert("Please select which you want to delete !");
    } else {
      if (confirm("Are you sure delete the seleced song ?!")) {
        this.ul.querySelectorAll(".on").forEach(data => {
          data.remove();
        });
        this.songsObjList = this.songsObjList.filter(data => {
          if (data.playing) {
            this.emitStop();
            data.setStop();
          }
          return data.selected === false;
        });
      }
    }
  }

  getEl() {
    return this.ul;
  }
}

class PlayArea {
  constructor(AUDIOS, playSong, pauseSong, stopSong) {
    this.playAreaDiv = createEl("div");
    this.btnsDIV = createEl("div", ["buttons", "listbuttons"]);
    this.addListBTN = createEl("button");
    this.addListBTN.innerHTML = "Add play list";
    this.addListBTN.addEventListener("click", () => {});
    this.sortBTN = createEl("button");
    this.sortBTN.innerHTML = "Sort";
    this.sortBTN.addEventListener("click", () => {
      this.playList.sort();
    });
    this.randomBTN = createEl("button");
    this.randomBTN.innerHTML = "Random";
    this.randomBTN.addEventListener("click", () => {
      this.playList.random();
    });
    this.deleteBTN = createEl("button");
    this.deleteBTN.innerHTML = "Delete";
    this.deleteBTN.addEventListener("click", () => {
      this.playList.delete();
    });
    this.btnsDIV.append(
      this.addListBTN,
      this.sortBTN,
      this.randomBTN,
      this.deleteBTN
    );
    this.playAreaDiv.appendChild(this.btnsDIV);

    this.playList = new PlayList(AUDIOS, playSong, pauseSong, stopSong);
    this.playAreaDiv.appendChild(this.playList.getEl());
  }

  show() {
    this.playAreaDiv.classList.remove("hide");
  }

  hide() {
    this.playAreaDiv.classList.add("hide");
  }

  getEl() {
    return this.playAreaDiv;
  }
}

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

class Bar {
  constructor() {
    this.div = createEl("div", ["bar"]);
    this.divInner = createEl("div", ["pb"]);
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
    this.divInner.style.width = (100 * this.length) / this.initLen + "%";
  }

  setLength(length) {
    this.length = length;
    this.initLen = length;
    this.divInner.style.width = "100%";
  }

  play() {
    clearInterval(this.si);
    this.si = setInterval(
      function(ct) {
        if (ct.length === 0) {
          clearInterval(ct.si);
          // playlist next song
          return;
        }
        ct.length--;
        ct.formatLength();
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
    this.init();
  }
}

class PlayButtons {
  constructor(prev, play, stop, next) {
    this.prev = prev;
    this.play = play;
    this.stop = stop;
    this.next = next;

    this.prevDiv = createEl("button");
    this.prevDiv.innerHTML = "Prev";
    this.prevDiv.addEventListener("click", () => {
      this.prev();
    });

    this.playDiv = createEl("button");
    this.playDiv.innerHTML = "Play";
    this.playDiv.addEventListener("click", () => {
      this.play();
    });

    this.stopDiv = createEl("button");
    this.stopDiv.innerHTML = "Stop";
    this.stopDiv.addEventListener("click", () => {
      this.stop();
    });

    this.nextDiv = createEl("button");
    this.nextDiv.innerHTML = "Next";
    this.nextDiv.addEventListener("click", () => {
      this.next();
    });

    this.buttonsDiv = createEl("div", ["buttons"]);
    this.buttonsDiv.append(
      this.prevDiv,
      this.playDiv,
      this.stopDiv,
      this.nextDiv
    );

    this.playing = false;
  }

  setPlayTxt() {
    if (this.playing) {
      this.playDiv.innerHTML = "Pause";
      this.playDiv.classList.add("on");
    } else {
      this.playDiv.innerHTML = "Play";
      this.playDiv.classList.remove("on");
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

export { Title, Song, Bar, PlayButtons, PlayList, PlayArea };

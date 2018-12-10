import { createEl, addZero } from "../method";

// song obj
class Song {
  constructor(id, name, length, playListObj) {
    Object.assign(this, { id, name, length, playListObj });

    this.selected = false;

    this.status = 'ready';// ready playing pause stop

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
      if ( this.status === 'playing') return;
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
    if (this.status === 'playing') {
      this.setPause();
      return;
    }
    this.li.classList.add("playing");
    this.status = 'playing';
  }

  setStop() {
    if (this.status === 'stop') return;
    this.li.classList.remove("playing");
    this.status = 'stop';
  }

  setPause() {
    if (this.status === 'pause') {
      this.setPlay();
      return;
    }
    this.status = 'pause';
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
      return data.status === 'playing';
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
          if (data.status === 'playing') {
            this.emitStop();
            data.setStop();
          }
          return data.selected === false;
        });
      }
    }
  }

  play() {

    if (this.songsObjList.find(data=>{return data.status==='playing'})) return;

    const pauseSong = this.songsObjList.find(data=>{
      return data.status === 'pause';
    });
    if (pauseSong) {
      pauseSong.setPlay();
      this.emitPlay();
      return;
    }

    const firstCheckedSong = this.songsObjList.find(data=>{
      return data.selected === true;
    });

    if (firstCheckedSong) {
      firstCheckedSong.setPlay();
      let {id, name, length} = firstCheckedSong;
      this.emitPlay(id, name, length);
    } else {
      this.songsObjList[0].setPlay();
      let {id, name, length} = this.songsObjList[0];
      this.emitPlay(id, name, length);
    }

  }
  pause() {
    const song = this.songsObjList.find(data=>{return data.status==='playing'});
    if (typeof song === 'undefined') return;
    song.setPause();
    this.emitPause();
  }
  stop() {
    const song = this.songsObjList.find(data=>{return data.status==='playing' || data.status==='pause'});
    song.setStop();
    this.emitStop();
  }
  prev() {
    const idx = this.songsObjList.findIndex(data=>{return data.status==='playing' || data.status==='pause'});
    let prevIdx = 0;
    if (idx>-1) {
      this.songsObjList[idx].setStop();
      this.emitStop();

      if (idx === 0) {
        prevIdx = this.songsObjList.length-1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = this.songsObjList.length-1;
    }

    this.songsObjList[prevIdx].setPlay();
    let {id, name, length} = this.songsObjList[prevIdx];
    this.emitPlay(id, name, length);
  }
  next() {
    const idx = this.songsObjList.findIndex(data=>{return data.status==='playing' || data.status==='pause'});
    let nextIdx = 0;
    if (idx>-1) {
      this.songsObjList[idx].setStop();
      this.emitStop();

      if (idx === this.songsObjList.length-1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }

    this.songsObjList[nextIdx].setPlay();
    let {id, name, length} = this.songsObjList[nextIdx];
    this.emitPlay(id, name, length);
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
    window.playList = this.playList;
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

export default PlayArea;
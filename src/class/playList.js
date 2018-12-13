import { createEl, addZero, selector } from "../method";

// song obj
class Song {
  constructor(id, name, length, playListObj) {
    Object.assign(this, { id, name, length, playListObj });

    this.selected = false;

    this.status = "ready"; // ready playing pause stop

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
      if (this.status === "playing") return;
      this.playListObj.playSong(this.id, this.name, this.length);
      if (!this.selected) {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add("on");
      }

      const currrentPlayAreaName = selector('.musiclist>div:not(.hide)').classList[0];
      if (currrentPlayAreaName === window.CURRENTPLAYAREA) return;
      const s = window.PLAYAREA[window.CURRENTPLAYAREA].playList.songsObjList.find(data => {
        return data.status === "playing" || data.status === "pause";
      });
      if (s) {
        s.setStop();
      }
      window.CURRENTPLAYAREA = selector('.musiclist>div:not(.hide)').classList[0];
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
    if (this.status === "playing") {
      this.setPause();
      return;
    }
    this.li.classList.add("playing");
    this.status = "playing";
  }

  setStop() {
    if (this.status === "stop") return;
    this.li.classList.remove("playing");
    this.status = "stop";
  }

  setPause() {
    if (this.status === "pause") {
      this.setPlay();
      return;
    }
    this.status = "pause";
  }

  getEl() {
    return this.li;
  }
}

class PlayList {
  constructor(songsList) {
    const sl = JSON.parse(JSON.stringify(songsList));
    Object.assign(this, { sl });

    this.ul = createEl("ul");

    this.songsObjList = this.sl.map(data => {
      let s = new Song(data.id, data.name, data.length, this);
      this.ul.appendChild(s.getEl());
      return s;
    });
  }

  playSong(id, name, length) {
    const s = this.songsObjList.find(data => {
      return data.status === "playing";
    });
    if (s) {
      s.setStop();
    }

    const ns = this.songsObjList
      .find(data => {
        return data.id === id;
      })
      .setPlay();
    window.playSong(id, name, length);
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
      alert("Please select which you want to delete!");
    } else {
      if (selector('.musiclist>div:not(.hide)').classList.contains('default')){
        window.loopAllPlayList(false);
      } else {
        const delSongName = this.songsObjList.filter(data=>{return data.selected===true}).map(data=>{return data.name;});
        if (confirm(`Are you sure delete [${delSongName.join(',')}]?`)) {
          window.delSelectedSongs(this, delSongName);
        }
      }
    }
  }

  play() {
    const currrentPlayAreaName = selector('.musiclist>div:not(.hide)').classList[0];
    if (currrentPlayAreaName === window.CURRENTPLAYAREA) {
      if (
        this.songsObjList.find(data => {
          return data.status === "playing";
        })
      )
        return;
  
      const pauseSong = this.songsObjList.find(data => {
        return data.status === "pause";
      });
      if (pauseSong) {
        pauseSong.setPlay();
        window.playSong();
        return;
      }
  
      const firstCheckedSong = this.songsObjList.find(data => {
        return data.selected === true;
      });
  
      if (firstCheckedSong) {
        firstCheckedSong.setPlay();
        let { id, name, length } = firstCheckedSong;
        window.playSong(id, name, length);
      } else {
        this.songsObjList[0].setPlay();
        let { id, name, length } = this.songsObjList[0];
        window.playSong(id, name, length);
      }
    } else {
      //window.CURRENTPLAYAREA under song is all 'stop' or 'ready' will play new switch list song.




    }
  }
  pause() {
    const song = this.songsObjList.find(data => {
      return data.status === "playing";
    });
    if (typeof song === "undefined") return;
    song.setPause();
    window.pauseSong();
  }
  stop() {
    const song = this.songsObjList.find(data => {
      return data.status === "playing" || data.status === "pause";
    });
    if (song) {
      song.setStop();
      window.stopSong();
    }
  }
  prev() {
    const idx = this.songsObjList.findIndex(data => {
      return data.status === "playing" || data.status === "pause";
    });
    let prevIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      window.stopSong();

      if (idx === 0) {
        prevIdx = this.songsObjList.length - 1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = this.songsObjList.length - 1;
    }

    this.songsObjList[prevIdx].setPlay();
    let { id, name, length } = this.songsObjList[prevIdx];
    window.playSong(id, name, length);
  }
  next() {
    const idx = this.songsObjList.findIndex(data => {
      return data.status === "playing" || data.status === "pause";
    });
    let nextIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      window.stopSong();

      if (idx === this.songsObjList.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }

    this.songsObjList[nextIdx].setPlay();
    let { id, name, length } = this.songsObjList[nextIdx];
    window.playSong(id, name, length);
  }

  addPlayList() {
    const songs = this.songsObjList.filter(data => {
      return data.selected === true;
    });
    if (songs.length) {
      const currentPlayAreaCount = ++window.CURRENTIDX;
      const newSongs = songs.map(data => {
        const { id, name, length } = data;
        return { id, name, length };
      });
      window.PLAYAREA["default" + currentPlayAreaCount] = new PlayArea(
        newSongs,
        false
      );
      selector(".musiclist")
        .appendChild(window.PLAYAREA["default" + currentPlayAreaCount].getEl());
      const newBtn = createEl("button", ["default" + currentPlayAreaCount]);
      newBtn.innerHTML = "New List" + currentPlayAreaCount;

      const btnDiv = createEl("div");
      btnDiv.appendChild(newBtn);

      const span = createEl('span', ['hide']);
      const input = createEl('input',[], 'text');
      window.aaa = input
      span.appendChild(input);
      btnDiv.appendChild(span);

      newBtn.addEventListener('dblclick', ()=>{
        span.classList.remove('hide');
        input.focus();
      });

      input.addEventListener('blur', ()=>{
        span.classList.add('hide');
      });

      input.addEventListener('keypress', (e)=>{
        var key = e.which || e.keyCode;
        if (key === 13) {
          newBtn.innerHTML = input.value.trim();
          input.blur();
          input.value = '';
        }
      });

      selector(".playlist .list").appendChild(btnDiv);
    } else {
      alert("Please select which you like song.");
    }
  }

  getEl() {
    return this.ul;
  }
}

class PlayArea {
  constructor(AUDIOS, isDefault) {
    this.playAreaDiv = createEl("div");
    this.btnsDIV = createEl("div", ["buttons", "listbuttons"]);
    if (isDefault) {
      this.playAreaDiv.classList.add("default");
      this.addListBTN = createEl("button");
      this.addListBTN.innerHTML = "Add play list";
      this.addListBTN.addEventListener("click", () => {
        this.playList.addPlayList();
      });
    } else {
      this.playAreaDiv.classList.add(
        "default" + window.CURRENTIDX
      );
    }
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
    if (isDefault) {
      this.btnsDIV.append(this.addListBTN);
    }
    this.btnsDIV.append(this.sortBTN, this.randomBTN, this.deleteBTN);
    this.playAreaDiv.appendChild(this.btnsDIV);

    this.playList = new PlayList(AUDIOS);
    // window.playList = this.playList;
    this.playAreaDiv.appendChild(this.playList.getEl());
    this.hide();
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

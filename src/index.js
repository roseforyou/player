import { selector } from './method'
import AUDIOS from "./data";
import Title from "./class/title";
import Bar from "./class/bar";
import PlayButtons from "./class/playButtons";
import PlayArea from "./class/playList";

//operate buttons [prev, play/pause, stop,  next]
const playButtons = new PlayButtons();
selector(".container").prepend(playButtons.getEl());

//music bar
const bar = new Bar();
selector(".container").prepend(bar.getEl());

//song title, time show area
const title = new Title();
selector(".container").prepend(title.getEl());

//song play list button event, and switch play area
selector(".playlist .list").addEventListener("click", e => {
  const currentEl = e.target;
  if (currentEl.nodeName === "BUTTON") {
    if (currentEl.classList.contains("on")) {
      return;
    } else {
      const onBtn = selector(".playlist .list button.on");
      if (onBtn) {
        onBtn.classList.remove("on");
        selector(".musiclist>div:not(.hide)")
          .classList.add("hide");
      }
      currentEl.classList.add("on");

      selector(".musiclist>." + currentEl.classList[0])
        .classList.remove("hide");

      if (currentEl.classList[0] === "default") {
        selector(".playlist .op").classList.add("hide");
      } else {
        selector(".playlist .op").classList.remove("hide");
      }

      // window.CURRENTPLAYAREA = currentEl.classList[0];
    }
  }
});
//song play list delete event
selector(".playlist .op").addEventListener("click", e => {
  const currentEl = e.target;
  if (currentEl.nodeName === "BUTTON") {
    if (confirm("Are you sure delete current play list?!")) {
      selector(".musiclist >div:not(.hide)").remove();
      window.CURRENTPLAYAREA = "default";
      const btn = selector(".playlist .list button.on");
      window.PLAYAREA[btn.classList[0]].playList.stop();
      delete window.PLAYAREA[btn.classList[0]];
      btn.remove();

      selector(".playlist .list .default").click();
    }
  }
});

window.CURRENTPLAYAREA = "default";
window.CURRENTIDX = 0;
window.PLAYAREA = {};
window.playSong = function(id, name, length) {
  if (name) title.setName(name);
  if (length) title.setLength(length);
  title.play();

  if (length) bar.setLength(length);
  bar.play();

  playButtons.setPlayStatus("playing");
};

window.stopSong = function() {
  title.setLength(0);
  title.stop();

  bar.stop();
  playButtons.setPlayStatus("stop");
};

window.pauseSong = function() {
  title.pause();
  bar.pause();
  playButtons.setPlayStatus("pause");
};

window.PLAYAREA["default"] = new PlayArea(AUDIOS, true);
selector(".musiclist").appendChild(window.PLAYAREA.default.getEl());
window.PLAYAREA.default.show();

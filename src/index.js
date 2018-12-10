import AUDIOS from "./data";
import Title from "./class/title";
import Bar from "./class/bar";
import PlayButtons from "./class/playButtons";
import PlayArea from "./class/playList";

const playButtons = new PlayButtons();
document.querySelector(".container").prepend(playButtons.getEl());

const bar = new Bar();
document.querySelector(".container").prepend(bar.getEl());

const title = new Title();
document.querySelector(".container").prepend(title.getEl());
///////////////////////////////
document.querySelector(".playlist .list").addEventListener("click", e => {
  const currentEl = e.target;
  if (currentEl.nodeName === "BUTTON") {
    if (currentEl.classList.contains("on")) {
      return;
    } else {
      const onBtn = document.querySelector(".playlist .list button.on");
      if (onBtn) {
        onBtn.classList.remove("on");
        document
          .querySelector(".musiclist>div:not(.hide)")
          .classList.add("hide");
      }
      currentEl.classList.add("on");

      document
        .querySelector(".musiclist>." + currentEl.classList[0])
        .classList.remove("hide");

      if (currentEl.classList[0] === "default") {
        document.querySelector(".playlist .op").classList.add("hide");
      } else {
        document.querySelector(".playlist .op").classList.remove("hide");
      }
    }
  }
});
document.querySelector(".playlist .op").addEventListener("click", e => {
  const currentEl = e.target;
  if (currentEl.nodeName === "BUTTON") {
    if (confirm("Are you sure delete current play list?!")) {
      document.querySelector(".musiclist >div:not(.hide)").remove();
      window.CURRENTPLAYAREA = "default";
      const btn = document.querySelector(".playlist .list button.on");
      window.PLAYAREA[btn.classList[0]] = undefined;
      btn.remove();

      document.querySelector(".playlist .list .default").click();
    }
  }
});

///////////////////////////////
window.CURRENTPLAYAREA = "default";
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

window.PLAYAREA.default = new PlayArea(AUDIOS, true);
document
  .querySelector(".musiclist")
  .appendChild(window.PLAYAREA.default.getEl());
window.PLAYAREA.default.show();

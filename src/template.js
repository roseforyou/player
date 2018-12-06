function genSongTmpl (name, time) {
return `<li class="on">
  <span class="cb"><input type="checkbox"></span><span class="name">${name}</span><span class="time">${time}</span>
</li>`;
}
function getPlaylistBtn (name) {
  return '';
}
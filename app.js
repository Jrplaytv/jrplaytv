
let channels = [];

function login() {
  const server = document.getElementById('server').value.trim();
  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();

  if (!server || !user || !pass) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  document.getElementById("loading").classList.remove("hidden");

  const url = `${server}/get.php?username=${user}&password=${pass}&type=m3u_plus&output=ts`;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      parseM3U(data);
      document.getElementById("login").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
    })
    .catch(err => alert("Erro ao carregar a lista: " + err))
    .finally(() => {
      document.getElementById("loading").classList.add("hidden");
    });
}

function parseM3U(data) {
  channels = [];
  const lines = data.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXTINF")) {
      const name = lines[i].split(",")[1];
      const url = lines[i + 1];
      channels.push({ name, url });
    }
  }
  showChannels(channels);
}

function showChannels(list) {
  const container = document.getElementById("channel-list");
  container.innerHTML = "";
  list.forEach((ch, i) => {
    const div = document.createElement("div");
    div.className = "channel-card";
    div.innerText = ch.name;
    div.onclick = () => {
      const player = document.getElementById("videoPlayer");
      player.src = ch.url;
      player.play();
    };
    container.appendChild(div);
  });
}

function filterChannels() {
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = channels.filter(ch => ch.name.toLowerCase().includes(term));
  showChannels(filtered);
}

function spotifyEmbed(url) {
  const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
}

function loadSpotify(url) {
  const src = spotifyEmbed(url);
  if (!src) return toast('That is not a valid Spotify link.');
  $('spBox').innerHTML =
    `<iframe title="Spotify player" src="${src}" width="100%" height="352" frameborder="0"
      style="border-radius:16px" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"></iframe>`;
  data.spotify = url;
  save();
}

$('spLoad').onclick = () => loadSpotify($('spUrl').value.trim());
$('spUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') loadSpotify(e.target.value.trim());
});
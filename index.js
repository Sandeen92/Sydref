// Define routes: external HTML snippets (located in the "route/" folder)
const routes = {
  home: 'start.html',
  about: 'aboutme.html',
  contact: 'gallery.html'
};

function loadRoute(name) {
  const content = document.getElementById('content');
  const path = routes[name];
  if (!path) {
    content.innerHTML = '<h1>404 – Sidan hittades inte</h1>';
    return;
  }

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`Could not fetch ${path} (status: ${res.status})`);
      return res.text();
    })
    .then(html => { content.innerHTML = html; })
    .catch(err => {
      console.error(err);
      content.innerHTML = `<h1>Kunde inte ladda sidan</h1><p>${err.message}</p>`;
    });
}

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    loadRoute(link.dataset.route);
  });
});

// Initial
loadRoute('home');


// Define routes: inline HTML or external files
const routes = {
  home: `
    <h1>Välkommen till Sydref AB</h1>
    <p></p>
  `,
  about: `
    <h1>Om mig</h1>
    <p></p>
  `,
  contact: `
    <h1>Bildgalleri</h1>
    <img
      src="images/fast.jpg"
      alt="Fast Image"
      class="img-fluid"
    />
  `
};

// Load route into #content
function loadRoute(name) {
  const target = document.getElementById('content');
  const payload = routes[name];
  if (!payload) {
    target.innerHTML = `<h1>404 – Page not found</h1>`;
    return;
  }

  if (/^\s*<\w+/.test(payload)) {
    target.innerHTML = payload;
  } else {
    fetch(payload)
      .then(res => res.text())
      .then(html => target.innerHTML = html)
      .catch(() => target.innerHTML = `<h1>Error loading page</h1>`);
  }
}

// Wire up navbar links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    loadRoute(link.dataset.route);
  });
});

// Load default route
loadRoute('home');
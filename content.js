// Este script carga el contenido editable (content.json) y lo inserta en la página.
// No es necesario modificar este archivo para cambiar textos o imágenes: eso se
// hace desde /admin (el panel de edición) o directamente en content.json.

(function () {
  var PRODUCT_ICONS = [
    '<path d="M9 2v4M15 2v4M6 6h12l-1 5a5 5 0 0 1-10 0L6 6Z"/><path d="M12 15v7"/>',
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01"/>',
    '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    '<path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z"/>',
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>',
    '<path d="M4 12h16M4 8h10M4 16h10"/>',
    '<path d="M7 21V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M7 13h10"/>'
  ];

  var SERVICE_ICONS = [
    '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>',
    '<path d="M3 17 9 5l4 8 3-4 5 8H3Z"/>',
    '<path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/>',
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 5-6 8-6s7 2 8 6"/>',
    '<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4l-6 6L5 20l2.3-2.3 6-6a4 4 0 0 1 5.4-5.4l-2.7 2.7 1.7 1.7 2.7-2.7Z"/>',
    '<path d="M9 3h6l1 4-4 3 4 3-1 4H9l-1-4 4-3-4-3 1-4Z"/>'
  ];

  function svg(inner, extraClass) {
    return '<svg class="icon' + (extraClass ? ' ' + extraClass : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' + inner + '</svg>';
  }

  function renderCards(containerId, items, icons) {
    var el = document.getElementById(containerId);
    if (!el || !items) return;
    el.innerHTML = items.map(function (title, i) {
      var iconInner = icons[i % icons.length];
      var orange = (i >= 4) ? ' orange' : '';
      return '<div class="card' + orange + '">' + svg(iconInner, orange ? '' : '') + '<h4>' + escapeHtml(title) + '</h4></div>';
    }).join('');
  }

  function renderGallery(containerId, urls) {
    var el = document.getElementById(containerId);
    if (!el || !urls) return;
    el.innerHTML = urls.map(function (url) {
      return '<a href="' + url + '" target="_blank" rel="noopener"><img src="' + url + '" alt="Solimek"></a>';
    }).join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function applyTextFields(data) {
    document.querySelectorAll('[data-field]').forEach(function (node) {
      var key = node.getAttribute('data-field');
      if (!(key in data)) return;
      var value = data[key];

      if (node.hasAttribute('data-field-mailto')) {
        node.setAttribute('href', 'mailto:' + value);
        node.textContent = value;
        return;
      }

      if (node.hasAttribute('data-field-multiline')) {
        node.innerHTML = String(value)
          .split('\n\n')
          .map(function (p) { return '<p>' + escapeHtml(p).replace(/\n/g, '<br>') + '</p>'; })
          .join('');
        return;
      }

      // Buttons/links keep their text; everything else too.
      node.textContent = value;
    });

    document.querySelectorAll('[data-field-src]').forEach(function (node) {
      var key = node.getAttribute('data-field-src');
      if (key in data) node.setAttribute('src', data[key]);
    });
  }

  fetch('content.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      applyTextFields(data);
      renderCards('products-list', data.products, PRODUCT_ICONS);
      renderCards('services-list', data.services, SERVICE_ICONS);
      renderGallery('gallery-list', data.gallery);
    })
    .catch(function (err) {
      console.error('No se pudo cargar content.json', err);
    });
})();

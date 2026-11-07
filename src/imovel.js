import { imoveis } from "./data/imoveis.js";

const app = document.querySelector("#app");
const params = new URLSearchParams(window.location.search);
const identifier = params.get("id") || params.get("slug");
const property = imoveis.find((item) => item.id === identifier || item.slug === identifier);

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function money(value, finalidade) {
  const formatted = currency.format(value);
  return finalidade === "Alugar" ? `${formatted}/mês` : formatted;
}

function quantity(value, singular, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function whatsappUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function logo() {
  return `<a class="brand" href="/#inicio" aria-label="HB11 JR Imóveis — início">
    <img src="/assets/logo%20trans.png" alt="Logotipo HB11 JR Imóveis" />
  </a>`;
}

function header() {
  return `<header class="site-header listing-header">
    ${logo()}
    <nav class="listing-nav" aria-label="Navegação principal">
      <a href="/#inicio">Início</a>
      <a href="/#imoveis">Imóveis</a>
      <a href="/#sobre">Sobre</a>
      <a href="/#contato">Contato</a>
    </nav>
    <a class="button button--small listing-header__contact" href="${whatsappUrl("Olá! Gostaria de falar com a HB11 JR Imóveis.")}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
  </header>`;
}

function propertyCard(item) {
  const url = `/imovel.html?id=${encodeURIComponent(item.id)}`;
  return `<article class="property-card property-card--compact">
    <a class="property-card__image" href="${url}" aria-label="Ver detalhes de ${escapeHtml(item.titulo)}">
      <img src="${escapeHtml(item.fotos[0])}" alt="${escapeHtml(item.titulo)} — fotografia demonstrativa" loading="lazy" />
      <span class="property-tag">${escapeHtml(item.finalidade)}</span>
      <span class="property-reference">${escapeHtml(item.codigo)}</span>
    </a>
    <div class="property-card__body">
      <div class="property-card__type">${escapeHtml(item.tipo)}<span>·</span>${item.area} m²</div>
      <a class="property-card__title" href="${url}">${escapeHtml(item.titulo)}</a>
      <div class="property-card__location">${escapeHtml(item.bairro)}, ${escapeHtml(item.cidade)}</div>
      <div class="property-card__bottom"><strong>${money(item.preco, item.finalidade)}</strong><a href="${url}">Ver imóvel <span aria-hidden="true">↗</span></a></div>
    </div>
  </article>`;
}

function galleryMarkup(item) {
  const photos = item.fotos.map((src) => escapeHtml(src));
  return `<section class="listing-gallery" aria-label="Galeria de fotografias do imóvel">
    <button class="listing-gallery__main" type="button" data-lightbox-index="0" aria-label="Ampliar fotografia principal">
      <img id="listing-main-photo" src="${photos[0]}" alt="${escapeHtml(item.titulo)} — fotografia principal demonstrativa" />
      <span class="listing-gallery__zoom">Ampliar fotos <span aria-hidden="true">↗</span></span>
    </button>
    <div class="listing-gallery__thumbnails">
      ${photos.slice(1).map((src, index) => `<button type="button" data-lightbox-index="${index + 1}" aria-label="Ampliar fotografia ${index + 2}">
        <img src="${src}" alt="Fotografia ${index + 2} demonstrativa do imóvel" loading="lazy" />
      </button>`).join("")}
    </div>
    <dialog class="listing-lightbox" id="listing-lightbox" aria-label="Fotografia ampliada">
      <button class="listing-lightbox__close" type="button" data-lightbox-close aria-label="Fechar galeria">×</button>
      <button class="listing-lightbox__arrow listing-lightbox__arrow--previous" type="button" data-lightbox-step="-1" aria-label="Fotografia anterior">‹</button>
      <img id="listing-lightbox-photo" src="${photos[0]}" alt="Fotografia ampliada demonstrativa" />
      <button class="listing-lightbox__arrow listing-lightbox__arrow--next" type="button" data-lightbox-step="1" aria-label="Próxima fotografia">›</button>
      <span class="listing-lightbox__count" id="listing-lightbox-count">1 / ${photos.length}</span>
    </dialog>
  </section>`;
}

function detailFacts(item) {
  return `<div class="listing-facts">
    <span><strong>${item.area}</strong><small>m² de área</small></span>
    <span><strong>${item.quartos}</strong><small>${item.quartos === 1 ? "quarto" : "quartos"}</small></span>
    <span><strong>${item.suites}</strong><small>${item.suites === 1 ? "suíte" : "suítes"}</small></span>
    <span><strong>${item.banheiros}</strong><small>${item.banheiros === 1 ? "banheiro" : "banheiros"}</small></span>
    <span><strong>${item.vagas}</strong><small>${item.vagas === 1 ? "vaga" : "vagas"}</small></span>
  </div>`;
}

function notFoundPage() {
  return `${header()}<main class="listing-not-found">
    <span class="eyebrow">HB11 JR IMÓVEIS</span>
    <h1>Este imóvel não foi encontrado.</h1>
    <p>O endereço pode ter mudado ou o imóvel não está disponível nesta seleção demonstrativa.</p>
    <a class="button button--dark" href="/#imoveis">Voltar aos imóveis</a>
  </main>`;
}

function detailPage(item) {
  const whatsappMessage = `Olá! Tenho interesse no imóvel ${item.codigo} — ${item.titulo}. Poderia me passar mais informações?`;
  const similar = imoveis
    .filter((other) => other.id !== item.id && (other.tipo === item.tipo || other.finalidade === item.finalidade))
    .slice(0, 3);

  return `${header()}
    <main class="listing-page">
      <div class="listing-breadcrumb"><a href="/#imoveis">← Voltar aos imóveis</a><span>${escapeHtml(item.codigo)} · Imóvel demonstrativo</span></div>
      ${galleryMarkup(item)}
      <section class="listing-content">
        <div class="listing-main">
          <span class="eyebrow">${escapeHtml(item.tipo)} · ${escapeHtml(item.finalidade)}</span>
          <h1>${escapeHtml(item.titulo)}</h1>
          <p class="listing-location">${escapeHtml(item.bairro)}, ${escapeHtml(item.cidade)}</p>
          ${detailFacts(item)}
          <div class="listing-description">
            <h2>Sobre o imóvel</h2>
            <p>${escapeHtml(item.descricao)}</p>
            <p>As fotografias, características e valores desta página são demonstrativos e não representam uma oferta real da HB11.</p>
          </div>
          <div class="listing-features">
            <h2>Características do imóvel</h2>
            <div>${item.caracteristicas.map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")}</div>
          </div>
        </div>
        <aside class="listing-contact">
          <span class="eyebrow">VALOR DEMONSTRATIVO</span>
          <strong class="listing-price">${money(item.preco, item.finalidade)}</strong>
          <span class="listing-code">Referência ${escapeHtml(item.codigo)}</span>
          <a class="button button--gold" href="${whatsappUrl(whatsappMessage)}" target="_blank" rel="noopener noreferrer">Consultar pelo WhatsApp</a>
          <small>Imóvel fictício para demonstração.</small>
        </aside>
      </section>
      ${similar.length ? `<section class="listing-similar">
        <div class="section-heading"><div><span class="eyebrow">CONTINUE EXPLORANDO</span><h2>Imóveis semelhantes</h2></div><a class="text-link" href="/#imoveis">Ver seleção <span>↗</span></a></div>
        <div class="property-grid">${similar.map(propertyCard).join("")}</div>
      </section>` : ""}
    </main>
    <footer class="site-footer listing-footer">
      <div class="footer-main">${logo()}<p>Presença, cuidado e orientação para cada etapa da sua jornada.</p><div class="footer-license">CRECI 040402-J</div></div>
      <div class="footer-links"><span class="eyebrow">Explore</span><a href="/#imoveis">Comprar e alugar</a><a href="/#sobre">Sobre a HB11</a></div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} HB11 JR Imóveis</span><span>Imóveis demonstrativos</span></div>
    </footer>`;
}

if (property) {
  document.title = `${property.titulo} | HB11 JR Imóveis`;
  app.innerHTML = detailPage(property);
} else {
  app.innerHTML = notFoundPage();
}

document.addEventListener("click", (event) => {
  const imageButton = event.target.closest("[data-lightbox-index]");
  const dialog = document.querySelector("#listing-lightbox");
  if (imageButton && dialog) {
    const index = Number(imageButton.dataset.lightboxIndex);
    dialog.dataset.currentIndex = String(index);
    showLightboxPhoto(index);
    dialog.showModal();
    return;
  }

  if (event.target.closest("[data-lightbox-close]")) {
    dialog?.close();
    return;
  }

  const stepButton = event.target.closest("[data-lightbox-step]");
  if (stepButton && dialog) {
    const total = property?.fotos.length || 0;
    const current = Number(dialog.dataset.currentIndex || 0);
    const next = (current + Number(stepButton.dataset.lightboxStep) + total) % total;
    dialog.dataset.currentIndex = String(next);
    showLightboxPhoto(next);
    return;
  }

  if (event.target === dialog) dialog.close();
});

function showLightboxPhoto(index) {
  if (!property) return;
  const image = document.querySelector("#listing-lightbox-photo");
  image.src = property.fotos[index];
  image.alt = `Fotografia ${index + 1} de ${property.fotos.length} — ${property.titulo}`;
  document.querySelector("#listing-lightbox-count").textContent = `${index + 1} / ${property.fotos.length}`;
}

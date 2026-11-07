import { imoveis } from "./data/imoveis.js";

const app = document.querySelector("#app");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroTimer;
let aboutTimer;
let revealObserver;

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

function whatsappUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function whatsappButton(message, label = "Conversar pelo WhatsApp", className = "button button--gold") {
  return `<a class="${className}" href="${whatsappUrl(message)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function logo(light = false) {
  return `<a class="brand${light ? " brand--light" : ""}" href="/" aria-label="HB11 JR Imóveis — início">
    <img src="/assets/logo%20trans.png" alt="Logotipo HB11 JR Imóveis" />
  </a>`;
}

function header({ rentals = false } = {}) {
  if (rentals) {
    return `<header class="site-header">${logo()}<a class="header-return" href="/#inicio">← HB11 JR Imóveis</a></header>`;
  }

  return `<header class="site-header">
    ${logo()}
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Abrir menu">
      <span></span><span></span><span></span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Navegação principal">
      <a href="/#inicio">Início</a><a href="/#imoveis" data-purpose-link="Comprar">Comprar</a><a href="/#imoveis" data-purpose-link="Alugar">Alugar</a><a href="/#sobre">Sobre</a><a href="/#contato">Contato</a>
      ${whatsappButton("Olá! Gostaria de falar com a HB11 JR Imóveis.", "WhatsApp", "button button--small")}
    </nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-main">
      ${logo(true)}
      <p>Presença, cuidado e orientação para cada etapa da sua jornada.</p>
      <div class="footer-license">CRECI 040402-J</div>
    </div>
    <div class="footer-links">
      <span class="eyebrow">Explore</span>
      <a href="/#imoveis" data-purpose-link="Comprar">Comprar imóvel</a><a href="/#imoveis" data-purpose-link="Alugar">Alugar imóvel</a><a href="/#sobre">Sobre a HB11</a>
    </div>
    <div class="footer-contact">
      <span class="eyebrow">Vamos conversar?</span>
      ${whatsappButton("Olá! Gostaria de falar com a HB11 JR Imóveis.", "Fale pelo WhatsApp", "text-link")}
      <small>Os imóveis exibidos neste site são demonstrativos.</small>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} HB11 JR Imóveis</span><span>Um projeto do grupo HB11 Imóveis</span></div>
  </footer>`;
}

function propertyCard(property, compact = false) {
  const detailUrl = `/imovel.html?id=${encodeURIComponent(property.id)}`;
  return `<article class="property-card${compact ? " property-card--compact" : ""}" data-reveal>
    <a class="property-card__image" href="${detailUrl}" aria-label="Ver detalhes de ${property.titulo}">
      <img src="${property.fotos[0]}" alt="${property.titulo} — fotografia demonstrativa" loading="lazy" />
      <span class="property-tag">${property.finalidade}</span>
      <span class="property-reference">${property.codigo}</span>
    </a>
    <div class="property-card__body">
      <div class="property-card__type">${property.tipo}<span>·</span>${property.area} m²</div>
      <a class="property-card__title" href="${detailUrl}">${property.titulo}</a>
      <div class="property-card__location">${property.bairro}, ${property.cidade}</div>
      <div class="property-card__facts">
        <span>${quantity(property.quartos, "quarto", "quartos")}</span><span>${quantity(property.banheiros, "banheiro", "banheiros")}</span><span>${quantity(property.vagas, "vaga", "vagas")}</span>
      </div>
      <div class="property-card__bottom"><strong>${money(property.preco, property.finalidade)}</strong><a href="${detailUrl}" aria-label="Ver imóvel ${property.codigo}">Ver imóvel <span aria-hidden="true">↗</span></a></div>
    </div>
  </article>`;
}

function searchForm() {
  return `<form class="search-panel" data-search-form>
    <div class="search-purpose">
      <span>Finalidade</span>
      <div class="search-purpose__options" role="group" aria-label="Finalidade do imóvel">
        <button type="button" class="is-selected" data-search-purpose="Comprar" aria-pressed="true">Comprar</button>
        <button type="button" data-search-purpose="Alugar" aria-pressed="false">Alugar</button>
      </div>
      <input type="hidden" name="finalidade" value="Comprar" />
    </div>
    <label class="search-field">
      <span>Tipo de imóvel</span>
      <select name="tipo"><option value="">Todos os tipos</option><option>Apartamento</option><option>Casa</option><option>Cobertura</option><option>Studio</option></select>
    </label>
    <label class="search-field">
      <span>Localização</span>
      <input name="localizacao" type="search" placeholder="Bairro ou cidade" />
    </label>
    <label class="search-field">
      <span>Faixa de preço</span>
      <select name="faixa"><option value="">Qualquer valor</option></select>
    </label>
    <button class="button button--dark search-submit" type="submit"><span>Buscar imóveis</span><span aria-hidden="true">↗</span></button>
  </form>`;
}

function homePage() {
  return `${header()}
    <main>
      <section class="hero" id="inicio" aria-label="Encontre seu próximo imóvel">
        <div class="hero__slides" aria-hidden="true">
          <img class="hero__slide is-active" src="/assets/hero1.png" alt="" fetchpriority="high" />
          <img class="hero__slide" src="/assets/hero2.png" alt="" />
        </div>
        <div class="hero__shade"></div>
        <div class="hero__content">
          <span class="eyebrow eyebrow--light"><i></i> HB11 JR IMÓVEIS · PRAIA GRANDE</span>
          <h1>Encontre o imóvel ideal para o seu <em>próximo capítulo.</em></h1>
          <p>Mais de 10 anos de experiência aproximando pessoas do lugar certo para viver.</p>
          ${searchForm()}
        </div>
        <span class="hero__caption">Praia Grande, litoral de São Paulo</span>
      </section>

      <section class="section section--featured" id="imoveis" data-reveal>
        <div class="section-heading">
          <div><span class="eyebrow">SELEÇÃO DEMONSTRATIVA</span><h2>Espaços para viver<br />novas histórias.</h2></div>
          <span class="property-count" id="home-result-count"></span>
        </div>
        <p class="demo-note">Imóveis, fotografias e valores fictícios para demonstração; não representam ofertas reais da HB11.</p>
        <div class="property-grid" id="home-property-grid">${imoveis.map((property) => propertyCard(property)).join("")}</div>
        <p class="empty-state" id="home-empty-state" hidden>Nenhum imóvel encontrado. Ajuste os filtros e tente novamente.</p>
      </section>

      <section class="section about-strip" id="sobre" data-reveal>
        <div class="about-strip__background" aria-hidden="true">
          <img class="about-strip__slide is-active" src="/assets/paisagem1.png" alt="" />
          <img class="about-strip__slide" src="/assets/paisagem2.png" alt="" />
          <img class="about-strip__slide" src="/assets/paisagem3.png" alt="" />
          <img class="about-strip__slide" src="/assets/paisagem5.png" alt="" />
          <img class="about-strip__slide" src="/assets/paisagem6.png" alt="" />
        </div>
        <div class="about-strip__shade" aria-hidden="true"></div>
        <div class="about-strip__intro"><span class="eyebrow">SOBRE A HB11</span><h2>Mais do que imóveis.<br /><em>Novos começos.</em></h2></div>
        <p>Há mais de 10 anos, a HB11 JR Imóveis acompanha pessoas em decisões importantes, com atendimento próximo e profissional.</p>
        <div class="about-strip__license"><strong>10+</strong><span>anos de experiência</span><small>CRECI 040402-J</small></div>
      </section>

      <section class="owner-cta" id="contato" data-reveal>
        <div><span class="eyebrow eyebrow--light">PARA PROPRIETÁRIOS</span><h2>Seu imóvel merece<br />um novo olhar.</h2></div>
        <p>Converse com a nossa equipe sobre anunciar seu imóvel.</p>
        ${whatsappButton("Olá! Tenho interesse em anunciar meu imóvel com a HB11 JR Imóveis.", "Anuncie pelo WhatsApp")}
      </section>
    </main>${footer()}${propertyDialog()}`;
}

function propertyDialog() {
  return `<dialog class="property-dialog" id="property-dialog" aria-labelledby="dialog-title">
    <button class="property-dialog__close" type="button" data-close-dialog aria-label="Fechar detalhes">×</button>
    <div id="property-dialog-content"></div>
  </dialog>`;
}

function propertyDialogContent(property) {
  const message = `Olá! Tenho interesse no imóvel ${property.codigo} — ${property.titulo}. Poderia me passar mais informações?`;
  return `<div class="property-dialog__layout">
    <img class="property-dialog__image" src="${property.fotos[0]}" alt="${property.titulo} — fotografia demonstrativa" />
    <div class="property-dialog__body">
      <span class="eyebrow">${property.finalidade} · IMÓVEL DEMONSTRATIVO</span>
      <h2 id="dialog-title">${property.titulo}</h2>
      <p class="property-card__location">${property.bairro}, ${property.cidade}</p>
      <strong class="property-dialog__price">${money(property.preco, property.finalidade)}</strong>
      <div class="detail-facts"><span><strong>${property.area}</strong> m²</span><span><strong>${property.quartos}</strong> ${quantity(property.quartos, "quarto", "quartos")}</span><span><strong>${property.banheiros}</strong> ${quantity(property.banheiros, "banheiro", "banheiros")}</span><span><strong>${property.vagas}</strong> ${quantity(property.vagas, "vaga", "vagas")}</span></div>
      <p class="property-dialog__description">${property.descricao}</p>
      <small>Imóvel, fotografias e valor fictícios para demonstração; não representam uma oferta real da HB11.</small>
      ${whatsappButton(message, "Consultar pelo WhatsApp")}
    </div>
  </div>`;
}

function setHomePurpose(purpose) {
  const form = document.querySelector("[data-search-form]");
  if (!form) return;
  form.elements.finalidade.value = purpose;
  form.querySelectorAll("[data-search-purpose]").forEach((button) => {
    const selected = button.dataset.searchPurpose === purpose;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateSearchPriceOptions(form);
}

function applyHomeFilters() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("#home-property-grid");
  if (!form || !grid) return;
  const filters = readForm(form);
  const [minimum, maximum] = String(filters.faixa || "").split(":");
  const location = normalize(filters.localizacao || "");
  const matches = imoveis.filter((property) => {
    if (filters.finalidade && property.finalidade !== filters.finalidade) return false;
    if (filters.tipo && property.tipo !== filters.tipo) return false;
    if (location && !normalize(`${property.bairro} ${property.cidade}`).includes(location)) return false;
    if (minimum && property.preco < Number(minimum)) return false;
    if (maximum && property.preco > Number(maximum)) return false;
    return true;
  });
  grid.innerHTML = matches.map((property) => propertyCard(property)).join("");
  grid.hidden = matches.length === 0;
  document.querySelector("#home-empty-state").hidden = matches.length > 0;
  document.querySelector("#home-result-count").textContent = `${matches.length} ${matches.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`;
  setupReveal(grid);
}

function getFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    finalidade: params.get("finalidade") || "",
    tipo: params.get("tipo") || "",
    localizacao: params.get("localizacao") || "",
    precoMin: params.get("precoMin") || "",
    precoMax: params.get("precoMax") || "",
    quartos: params.get("quartos") || "",
    ordenar: params.get("ordenar") || "recentes",
  };
}

function filterMarkup(filters, rentalOnly = false) {
  const types = ["Apartamento", "Casa", "Cobertura", "Studio"];
  return `<form class="filters" id="catalog-filters">
    <label><span>Finalidade</span><select name="finalidade" ${rentalOnly ? "disabled" : ""}>
      <option value="">Comprar e alugar</option><option value="Comprar" ${filters.finalidade === "Comprar" ? "selected" : ""}>Comprar</option><option value="Alugar" ${rentalOnly || filters.finalidade === "Alugar" ? "selected" : ""}>Alugar</option>
    </select></label>
    <label><span>Tipo de imóvel</span><select name="tipo"><option value="">Todos os tipos</option>${types.map((type) => `<option ${filters.tipo === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
    <label><span>Localização</span><input name="localizacao" type="search" value="${escapeHtml(filters.localizacao)}" placeholder="Bairro ou cidade" /></label>
    <label><span>Preço mínimo</span><input name="precoMin" type="number" min="0" inputmode="numeric" value="${escapeHtml(filters.precoMin)}" placeholder="R$ mínimo" /></label>
    <label><span>Preço máximo</span><input name="precoMax" type="number" min="0" inputmode="numeric" value="${escapeHtml(filters.precoMax)}" placeholder="R$ máximo" /></label>
    <label><span>Quartos</span><select name="quartos"><option value="">Qualquer</option><option value="1" ${filters.quartos === "1" ? "selected" : ""}>1+</option><option value="2" ${filters.quartos === "2" ? "selected" : ""}>2+</option><option value="3" ${filters.quartos === "3" ? "selected" : ""}>3+</option><option value="4" ${filters.quartos === "4" ? "selected" : ""}>4+</option></select></label>
    <button class="button button--dark filters__clear" type="button" data-clear-filters>Limpar filtros</button>
  </form>`;
}

function catalogPage(rentalOnly = false) {
  const filters = getFiltersFromUrl();
  if (rentalOnly) filters.finalidade = "Alugar";
  return `${header({ rentals: rentalOnly })}
    <main class="${rentalOnly ? "rental-page" : ""}">
      <section class="page-intro${rentalOnly ? " page-intro--dark" : ""}">
        <span class="eyebrow${rentalOnly ? " eyebrow--gold" : ""}">${rentalOnly ? "SÓ ALUGUÉIS · HB11 JR IMÓVEIS" : "PORTFÓLIO HB11"}</span>
        <h1>${rentalOnly ? "Um lugar para chamar de seu." : "Encontre seu próximo lugar."}</h1>
        <p>${rentalOnly ? "Um canal dedicado para encontrar o espaço que combina com você." : "Explore a seleção de imóveis e descubra possibilidades para o seu próximo capítulo."}</p>
        ${rentalOnly ? `<div class="rental-promise">Um projeto do grupo HB11 Imóveis, agora com um canal exclusivo para locação.</div>` : ""}
        <span class="demo-note${rentalOnly ? " demo-note--dark" : ""}">Imóveis, fotografias e valores exibidos são demonstrativos.</span>
      </section>
      <section class="catalog-section">
        <div class="catalog-toolbar"><strong id="result-count"></strong><label class="sort-control">Ordenar por <select id="sort-order" name="ordenar" form="catalog-filters">
          <option value="recentes" ${filters.ordenar === "recentes" ? "selected" : ""}>Mais recentes</option><option value="menor-preco" ${filters.ordenar === "menor-preco" ? "selected" : ""}>Menor preço</option><option value="maior-preco" ${filters.ordenar === "maior-preco" ? "selected" : ""}>Maior preço</option>
        </select></label></div>
        ${filterMarkup(filters, rentalOnly)}
        <div class="property-grid" id="catalog-grid"></div>
        <div class="empty-state" id="empty-state" hidden><span>⌕</span><h2>Nenhum imóvel encontrado</h2><p>Experimente ajustar ou limpar os filtros para ver outras opções.</p><button class="button button--dark" type="button" data-clear-filters>Limpar filtros</button></div>
      </section>
    </main>${rentalOnly ? rentalFooter() : footer()}`;
}

function rentalFooter() {
  return `<footer class="site-footer site-footer--dark"><div class="footer-main"><a class="rental-brand" href="/so-alugueis"><span class="rental-brand__mark">SÓ</span><span class="rental-brand__name">ALUGUÉIS</span></a><p>Um projeto do grupo HB11 Imóveis, agora com um canal exclusivo para locação.</p></div><div class="footer-links"><span class="eyebrow eyebrow--gold">Explore</span><a href="/so-alugueis">Imóveis para alugar</a><a href="/">Voltar à HB11 JR</a></div><div class="footer-contact"><span class="eyebrow eyebrow--gold">Fale com a gente</span>${whatsappButton("Olá! Gostaria de saber mais sobre imóveis para alugar.", "Conversar pelo WhatsApp", "text-link")}<small>Imóveis e valores demonstrativos.</small></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} HB11 JR Imóveis</span><span>Só Aluguéis · grupo HB11</span></div></footer>`;
}

function detailPage(slug) {
  const property = imoveis.find((item) => item.slug === slug);
  if (!property) return notFoundPage(true);
  const similar = imoveis.filter((item) => item.slug !== slug && item.finalidade === property.finalidade && item.tipo === property.tipo).slice(0, 3);
  const dark = property.finalidade === "Alugar";
  const message = `Olá! Tenho interesse no imóvel ${property.codigo} — ${property.titulo}. Poderia me passar mais informações?`;
  return `${header({ rentals: dark })}
    <main class="${dark ? "rental-page" : ""}">
      <div class="detail-back"><a href="${dark ? "/so-alugueis" : "/imoveis"}">← Voltar aos imóveis</a><span>${property.codigo} · ${property.finalidade}</span></div>
      <section class="detail-gallery" aria-label="Galeria do imóvel">
        <img class="detail-gallery__main" src="${property.fotos[0]}" alt="${property.titulo} — fotografia demonstrativa" />
        <img class="detail-gallery__secondary" src="${property.fotos[1] || property.fotos[0]}" alt="${property.titulo} — fotografia demonstrativa" />
        <span class="property-tag">${property.finalidade}</span>
      </section>
      <section class="detail-content">
        <div class="detail-main">
          <span class="eyebrow">IMÓVEL DEMONSTRATIVO · ${property.codigo}</span>
          <h1>${property.titulo}</h1>
          <p class="detail-location">${property.bairro}, ${property.cidade}</p>
          <div class="detail-facts"><span><strong>${property.area}</strong> m²</span><span><strong>${property.quartos}</strong> ${property.quartos === 1 ? "quarto" : "quartos"}</span><span><strong>${property.suites}</strong> ${property.suites === 1 ? "suíte" : "suítes"}</span><span><strong>${property.banheiros}</strong> ${property.banheiros === 1 ? "banheiro" : "banheiros"}</span><span><strong>${property.vagas}</strong> ${property.vagas === 1 ? "vaga" : "vagas"}</span></div>
          <div class="detail-description"><h2>Sobre o imóvel</h2><p>${property.descricao}</p><p>As imagens são ilustrativas e os dados apresentados não representam uma oferta real.</p></div>
          <div class="detail-amenities"><h2>Características</h2><div>${property.caracteristicas.map((feature) => `<span>${feature}</span>`).join("")}</div></div>
        </div>
        <aside class="detail-contact"><span class="eyebrow">VALOR DEMONSTRATIVO</span><strong class="detail-price">${money(property.preco, property.finalidade)}</strong><small>Condomínio e IPTU não informados.</small>${whatsappButton(message, "Consultar pelo WhatsApp")}<span class="detail-reference">Referência ${property.codigo}</span></aside>
      </section>
      ${similar.length ? `<section class="section section--similar"><div class="section-heading"><div><span class="eyebrow">CONTINUE EXPLORANDO</span><h2>Você também pode gostar.</h2></div><a class="text-link" href="${dark ? "/so-alugueis" : "/imoveis"}">Ver seleção <span>↗</span></a></div><div class="property-grid">${similar.map((item) => propertyCard(item, true)).join("")}</div></section>` : ""}
    </main>${dark ? rentalFooter() : footer()}`;
}

function aboutPage() {
  return `${header()}<main>
    <section class="about-hero"><span class="eyebrow">SOBRE A HB11 JR IMÓVEIS</span><h1>Presença para encontrar<br /><em>o lugar certo.</em></h1><p>Há mais de 10 anos, acompanhamos pessoas em uma das escolhas mais importantes: onde viver.</p><img src="/assets/paisagem1.png" alt="Paisagem de Praia Grande" /></section>
    <section class="about-values"><div><span class="eyebrow">NOSSA ESSÊNCIA</span><h2>Atendimento próximo.<br />Orientação profissional.</h2></div><p>A HB11 JR Imóveis atua com compromisso e cuidado em cada etapa da jornada imobiliária. Nosso trabalho é ajudar você a encontrar possibilidades alinhadas ao que procura.</p><div class="about-values__license"><strong>10+</strong><span>anos de experiência</span><small>CRECI 040402-J</small></div></section>
    <section class="owner-cta"><div><span class="eyebrow eyebrow--light">VAMOS CONVERSAR?</span><h2>O próximo capítulo<br />pode começar aqui.</h2></div><p>Entre em contato com a HB11 JR Imóveis.</p>${whatsappButton("Olá! Gostaria de conversar com a HB11 JR Imóveis.", "Fale pelo WhatsApp")}</section>
  </main>${footer()}`;
}

function notFoundPage(isProperty = false) {
  return `${header()}<main class="not-found"><span class="eyebrow">HB11 JR IMÓVEIS</span><h1>${isProperty ? "Este imóvel não foi encontrado." : "Esta página não foi encontrada."}</h1><p>O endereço pode ter mudado ou o conteúdo não está disponível.</p><a class="button button--dark" href="/">Voltar ao início</a></main>${footer()}`;
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

function normalize(value) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function currentRoute() {
  const path = decodeURIComponent(window.location.pathname).replace(/\/+$/, "") || "/";
  if (path === "/") return { page: "home" };
  if (path === "/imoveis") return { page: "home", section: "imoveis", purpose: new URLSearchParams(window.location.search).get("finalidade") || "" };
  if (path === "/so-alugueis") return { page: "home", section: "imoveis", purpose: "Alugar" };
  if (path === "/sobre") return { page: "home", section: "sobre" };
  if (path.startsWith("/imovel/")) return { page: "home", slug: path.slice("/imovel/".length) };
  return { page: "not-found" };
}

function navigate(url) {
  const next = new URL(url, window.location.origin);
  window.history.pushState({}, "", `${next.pathname}${next.search}${next.hash}`);
  if (next.pathname === "/" && next.hash) {
    if (currentRoute().page !== "home") render();
    window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(next.hash.slice(1)))?.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    });
    return;
  }
  render();
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function updateSearchPriceOptions(form) {
  const purpose = form.elements.finalidade.disabled ? "Alugar" : form.elements.finalidade.value;
  const priceSelect = form.elements.faixa;
  const selected = priceSelect.value;
  const ranges = purpose === "Alugar"
    ? [
        ["Até R$ 3 mil/mês", ":3000"],
        ["R$ 3 mil a R$ 5 mil/mês", "3000:5000"],
        ["Acima de R$ 5 mil/mês", "5000:"],
      ]
    : [
        ["Até R$ 500 mil", ":500000"],
        ["R$ 500 mil a R$ 1 milhão", "500000:1000000"],
        ["Acima de R$ 1 milhão", "1000000:"],
      ];
  priceSelect.innerHTML = `<option value="">Qualquer valor</option>${ranges.map(([label, value]) => `<option value="${value}">${label}</option>`).join("")}`;
  if (ranges.some(([, value]) => value === selected)) priceSelect.value = selected;
}

function syncFiltersToUrl(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function applyCatalogFilters() {
  const form = document.querySelector("#catalog-filters");
  if (!form) return;
  const filters = { ...readForm(form), ordenar: document.querySelector("#sort-order").value };
  const rentalOnly = currentRoute().page === "rentals";
  if (rentalOnly) filters.finalidade = "Alugar";
  syncFiltersToUrl(filters);

  let matches = imoveis.filter((property) => {
    if (filters.finalidade && property.finalidade !== filters.finalidade) return false;
    if (filters.tipo && property.tipo !== filters.tipo) return false;
    const location = normalize(filters.localizacao || "");
    if (location && !normalize(`${property.bairro} ${property.cidade}`).includes(location)) return false;
    if (filters.precoMin && property.preco < Number(filters.precoMin)) return false;
    if (filters.precoMax && property.preco > Number(filters.precoMax)) return false;
    if (filters.quartos && property.quartos < Number(filters.quartos)) return false;
    return true;
  });

  if (filters.ordenar === "menor-preco") matches.sort((a, b) => a.preco - b.preco);
  else if (filters.ordenar === "maior-preco") matches.sort((a, b) => b.preco - a.preco);
  else matches.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  document.querySelector("#result-count").textContent = `${matches.length} ${matches.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`;
  document.querySelector("#catalog-grid").innerHTML = matches.map((property) => propertyCard(property)).join("");
  document.querySelector("#empty-state").hidden = matches.length > 0;
  document.querySelector("#catalog-grid").hidden = matches.length === 0;
}

function render() {
  window.clearInterval(heroTimer);
  window.clearInterval(aboutTimer);
  revealObserver?.disconnect();
  const route = currentRoute();
  switch (route.page) {
    case "home":
      app.innerHTML = homePage();
      if (route.purpose) {
        setHomePurpose(route.purpose);
        applyHomeFilters();
      }
      updateSearchPriceOptions(document.querySelector("[data-search-form]"));
      if (!route.purpose) document.querySelector("#home-result-count").textContent = `${imoveis.length} imóveis demonstrativos`;
      startHeroSlideshow();
      startHeroMotion();
      startAboutSlideshow();
      if (route.slug) {
        const property = imoveis.find((item) => item.slug === route.slug);
        if (property) {
          document.querySelector("#property-dialog-content").innerHTML = propertyDialogContent(property);
          document.querySelector("#property-dialog").showModal();
        }
      }
      break;
    case "catalog":
      app.innerHTML = catalogPage();
      applyCatalogFilters();
      break;
    case "rentals":
      app.innerHTML = catalogPage(true);
      applyCatalogFilters();
      break;
    case "detail":
      app.innerHTML = detailPage(route.slug);
      break;
    case "about":
      app.innerHTML = aboutPage();
      break;
    default:
      app.innerHTML = notFoundPage();
  }
  setupReveal();
  const section = route.section || (route.page === "home" ? decodeURIComponent(window.location.hash.slice(1)) : "");
  if (section) {
    window.requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
    }));
  }
}

function setupReveal(root = document) {
  const elements = [...root.querySelectorAll("[data-reveal]:not(.reveal-observed)")];
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible", "reveal-observed"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  }
  elements.forEach((element) => {
    element.classList.add("reveal-observed");
    revealObserver.observe(element);
  });
}

function startHeroSlideshow() {
  if (reduceMotion.matches) return;
  const slides = [...document.querySelectorAll(".hero__slide")];
  if (slides.length < 2) return;
  let activeIndex = 0;
  heroTimer = window.setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, 7200);
}

function startAboutSlideshow() {
  const section = document.querySelector(".about-strip");
  if (!section || reduceMotion.matches) return;
  const slides = [...section.querySelectorAll(".about-strip__slide")];
  if (slides.length < 2) return;
  let activeIndex = 0;
  aboutTimer = window.setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, 7200);
}

function startHeroMotion() {
  const hero = document.querySelector(".hero");
  if (!hero || reduceMotion.matches || window.matchMedia("(pointer: coarse)").matches) return;
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 3;
    hero.style.setProperty("--hero-x", `${x.toFixed(1)}px`);
    hero.style.setProperty("--hero-y", `${y.toFixed(1)}px`);
  });
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-x", "0px");
    hero.style.setProperty("--hero-y", "0px");
  });
}

document.addEventListener("click", (event) => {
  const menuButton = event.target.closest(".menu-toggle");
  if (menuButton) {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    document.querySelector("#primary-nav").classList.toggle("is-open", !expanded);
    return;
  }
  const purposeButton = event.target.closest("[data-search-purpose]");
  if (purposeButton) {
    setHomePurpose(purposeButton.dataset.searchPurpose);
    return;
  }
  const purposeLink = event.target.closest("[data-purpose-link]");
  if (purposeLink) {
    setHomePurpose(purposeLink.dataset.purposeLink);
    applyHomeFilters();
  }
  if (event.target.closest("#primary-nav a")) {
    const nav = document.querySelector("#primary-nav");
    const toggle = document.querySelector(".menu-toggle");
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menu");
  }
  const propertyLink = event.target.closest("[data-property-detail]");
  if (propertyLink) {
    const property = imoveis.find((item) => item.slug === propertyLink.dataset.propertyDetail);
    const dialog = document.querySelector("#property-dialog");
    if (property && dialog) {
      event.preventDefault();
      document.querySelector("#property-dialog-content").innerHTML = propertyDialogContent(property);
      dialog.showModal();
      return;
    }
    if (property) {
      event.preventDefault();
      navigate(`/imovel/${property.slug}`);
      return;
    }
  }
  if (event.target.closest('a[href^="/imovel.html"]')) return;
  const closeDialog = event.target.closest("[data-close-dialog]");
  if (closeDialog) {
    document.querySelector("#property-dialog")?.close();
    return;
  }
  if (event.target.matches("#property-dialog")) {
    event.target.close();
    return;
  }
  const link = event.target.closest("a");
  if (link && link.origin === window.location.origin && !link.hasAttribute("target") && link.pathname.startsWith("/")) {
    event.preventDefault();
    navigate(`${link.pathname}${link.search}${link.hash}`);
    return;
  }
  if (event.target.closest("[data-clear-filters]")) {
    const form = document.querySelector("#catalog-filters");
    if (!form) return;
    form.reset();
    if (currentRoute().page === "rentals") form.elements.finalidade.value = "Alugar";
    document.querySelector("#sort-order").value = "recentes";
    applyCatalogFilters();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-search-form]");
  if (!form) return;
  event.preventDefault();
  applyHomeFilters();
  document.querySelector("#imoveis").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
});

document.addEventListener("input", (event) => {
  if (event.target.closest("#catalog-filters")) applyCatalogFilters();
});

document.addEventListener("change", (event) => {
  if (event.target.matches('[data-search-form] [name="finalidade"]')) {
    updateSearchPriceOptions(event.target.form);
  }
  if (event.target.closest("#catalog-filters") || event.target.matches("#sort-order")) applyCatalogFilters();
});

window.addEventListener("popstate", () => {
  render();
  if (window.location.hash) {
    window.requestAnimationFrame(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
    }));
  }
});

render();

# HB11 JR Imóveis

Frontend estático de página única com imóveis demonstrativos, sem backend, painel administrativo ou dependências de build.

## Executar localmente

Sirva a pasta por HTTP (módulos JavaScript não funcionam de forma confiável ao abrir o HTML diretamente):

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`. A navegação principal usa âncoras na Home. Os detalhes dos seis imóveis demonstrativos usam a página `imovel.html` com o identificador local do registro na query string. Em hospedagens que aplicam `_redirects`, endereços antigos como `/imoveis`, `/so-alugueis` e `/sobre` continuam apontando para a experiência de página única; o servidor Python simples serve diretamente apenas as páginas físicas existentes.

## Conteúdo demonstrativo

Os imóveis, preços, descrições e fotografias dos cards e galerias são demonstrativos e fictícios. Substitua os registros em `src/data/imoveis.js` por informações autorizadas antes de publicar ofertas reais. As fotografias demonstrativas são servidas pelo Unsplash; o fundo animado de Sobre reutiliza as imagens locais da orla em `assets/`.

Os links de WhatsApp usam `wa.me` sem um número pré-configurado e abrem uma conversa com a mensagem contextualizada pronta para envio. Para direcionar ao número comercial, configure o telefone no link conforme o padrão internacional do WhatsApp.

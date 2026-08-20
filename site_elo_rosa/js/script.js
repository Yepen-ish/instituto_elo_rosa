/* ============================================================================
   MÓDULO 1 — PÁGINA INICIAL (HOME)
   Script responsável pelos comportamentos interativos da página inicial:
   1) Animação "reveal" dos elementos ao rolar a página
   2) Exibir/ocultar o botão flutuante de contato
   3) Copiar e-mail e telefone para a área de transferência (rodapé)
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------------------
     1) ANIMAÇÃO "REVEAL"
     Observa os elementos com a classe .reveal e adiciona a classe .in
     quando eles entram na área visível da tela, disparando a transição
     de opacidade/posição definida no CSS (seção 1.9 do style.css).
     -------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealItems.length){
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target); // anima só uma vez
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    // Navegadores sem suporte a IntersectionObserver: mostra tudo direto
    revealItems.forEach(function (item) { item.classList.add('in'); });
  }

  /* --------------------------------------------------------------------
     2) BOTÃO FLUTUANTE DE CONTATO
     Some ele aparece (fade-in) somente depois que o usuário rola a
     página além da altura do herói, evitando poluir a primeira tela.
     -------------------------------------------------------------------- */
  var contactFab = document.getElementById('contactFab');

  if (contactFab){
    var showThreshold = window.innerHeight * 0.6;

    var toggleFab = function () {
      if (window.scrollY > showThreshold){
        contactFab.classList.add('show');
      } else {
        contactFab.classList.remove('show');
      }
    };

    window.addEventListener('scroll', toggleFab, { passive: true });
    toggleFab(); // checa o estado inicial ao carregar a página
  }

  /* --------------------------------------------------------------------
     3) COPIAR PARA A ÁREA DE TRANSFERÊNCIA (rodapé)
     Função auxiliar reutilizada pelo e-mail e pelo telefone.
     - texto: valor a ser copiado (vem do atributo data-copy no HTML)
     - hintEl: elemento que mostra a mensagem "copiado!" por 2 segundos
     -------------------------------------------------------------------- */
  function copiarTexto(texto, hintEl){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(texto).then(function () {
        mostrarAvisoCopiado(hintEl);
      }).catch(function () {
        copiarTextoFallback(texto);
        mostrarAvisoCopiado(hintEl);
      });
    } else {
      // Navegadores antigos, sem suporte à Clipboard API
      copiarTextoFallback(texto);
      mostrarAvisoCopiado(hintEl);
    }
  }

  /* Método alternativo de cópia (compatibilidade com navegadores antigos) */
  function copiarTextoFallback(texto){
    var campoTemporario = document.createElement('textarea');
    campoTemporario.value = texto;
    campoTemporario.style.position = 'fixed';
    campoTemporario.style.opacity = '0';
    document.body.appendChild(campoTemporario);
    campoTemporario.focus();
    campoTemporario.select();
    try { document.execCommand('copy'); } catch (erro) { /* ignora silenciosamente */ }
    document.body.removeChild(campoTemporario);
  }

  /* Mostra o texto "copiado!" por 2 segundos ao lado do ícone clicado */
  function mostrarAvisoCopiado(hintEl){
    if (!hintEl) return;
    hintEl.classList.add('show');
    window.clearTimeout(hintEl._timeoutId);
    hintEl._timeoutId = window.setTimeout(function () {
      hintEl.classList.remove('show');
    }, 2000);
  }

  /* 3a) E-MAIL — copia o endereço E deixa o link mailto funcionar normalmente
     (o navegador abre o app de e-mail padrão ao mesmo tempo em que copiamos) */
  var linkEmail = document.querySelector('.js-copy-email');
  if (linkEmail){
    linkEmail.addEventListener('click', function () {
      var texto = linkEmail.getAttribute('data-copy');
      var hint = document.getElementById('emailCopyHint');
      copiarTexto(texto, hint);
      // não usamos preventDefault(): o mailto: continua abrindo normalmente
    });
  }

  /* 3b) TELEFONE — apenas copia o número, sem abrir discador */
  var botaoTelefone = document.querySelector('.js-copy-phone');
  if (botaoTelefone){
    botaoTelefone.addEventListener('click', function () {
      var texto = botaoTelefone.getAttribute('data-copy');
      var hint = document.getElementById('phoneCopyHint');
      copiarTexto(texto, hint);
    });
  }

});

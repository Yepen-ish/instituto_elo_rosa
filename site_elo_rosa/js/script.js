/* ==========================================================================
   INSTITUTO ELO ROSA — SCRIPT PRINCIPAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------------
     A) ANIMAÇÃO "REVEAL" — elementos com a classe .reveal ganham .in
        quando entram na tela (usa IntersectionObserver).
     ------------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     B) BOTÃO FLUTUANTE DE CONTATO — aparece depois de rolar um pouco
     ------------------------------------------------------------------------ */
  var fab = document.getElementById('contactFab');
  if (fab) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) fab.classList.add('show');
      else fab.classList.remove('show');
    });
  }

  /* ------------------------------------------------------------------------
     C) MENU NOVO — hambúrguer, faixa que soma/some, pastilha e gaveta lateral
     ------------------------------------------------------------------------ */
  var nav         = document.getElementById('mainNav');
  var pill        = document.getElementById('navPill');
  var menuBtn     = document.getElementById('menuBtn');
  var menuBtnPill = document.getElementById('menuBtnPill');
  var drawer      = document.getElementById('menuDrawer');
  var overlay     = document.getElementById('menuOverlay');

  /* C.1 — abrir/fechar a gaveta (cortina no desktop, peça pequena no mobile).
     Cada verificação é independente: se algum elemento não existir, o resto
     continua funcionando normalmente. */
  if (drawer) {
    var isOpen = false;

    function setOpen(v) {
      isOpen = v;
      drawer.classList.toggle('open', v);
      if (overlay) overlay.classList.toggle('show', v);
      if (menuBtn) menuBtn.classList.toggle('is-open', v);
      if (menuBtnPill) menuBtnPill.classList.toggle('is-open', v);
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(!isOpen);
      });
    }
    if (menuBtnPill) {
      menuBtnPill.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(!isOpen);
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function () { setOpen(false); });
    }
    var drawerLinks = drawer.querySelectorAll('a');
    for (var i = 0; i < drawerLinks.length; i++) {
      drawerLinks[i].addEventListener('click', function () { setOpen(false); });
    }
  }

  /* C.2 — esconder a faixa depois da 2ª metade da página ao descer,
           mostrar a pastilha no lugar; ao subir um pouco, faixa volta. */
  if (nav && pill) {
    var lastY = window.scrollY;
    var ticking = false;

    var updateNav = function () {
      var y = window.scrollY;
      var half = (document.documentElement.scrollHeight - window.innerHeight) / 2;
      var goingDown = y > lastY;
      var goingUp = y < lastY;

      if (y > half && goingDown) {
        nav.classList.add('nav--hidden');
        pill.classList.add('show');
      } else if (goingUp) {
        nav.classList.remove('nav--hidden');
        pill.classList.remove('show');
      }
      if (y <= 40) {
        nav.classList.remove('nav--hidden');
        pill.classList.remove('show');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    });
  }

  /* ------------------------------------------------------------------------
     C.3) BOTÕES ".fx-btn" — "Descobrir", "fazer parte" e "eventos".
          Ao clicar: animação suave de bolha (sem sumir). Além disso:
          - se o link é uma âncora da própria página (começa com "#"),
            rola suavemente até lá;
          - se o link aponta para outra página (ex: eventos.html), espera
            a animação começar antes de navegar, para o efeito ser visível.
     ------------------------------------------------------------------------ */
  var fxButtons = document.querySelectorAll('.fx-btn');
  fxButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var href = btn.getAttribute('href') || '';
      var isAnchor = href.charAt(0) === '#';

      // reinicia a animação mesmo em cliques seguidos
      btn.classList.remove('is-clicked');
      void btn.offsetWidth;
      btn.classList.add('is-clicked');

      if (isAnchor) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (href && href !== '#') {
        // link para outra página: deixa a bolha começar antes de navegar
        e.preventDefault();
        setTimeout(function () {
          window.location.href = href;
        }, 260);
      }
    });
    btn.addEventListener('animationend', function () {
      btn.classList.remove('is-clicked');
    });
  });


  /* ------------------------------------------------------------------------
     D) COPIAR E-MAIL / TELEFONE DO RODAPÉ
     ------------------------------------------------------------------------ */
  var emailLink = document.querySelector('.js-copy-email');
  var emailHint = document.getElementById('emailCopyHint');
  if (emailLink && emailHint) {
    emailLink.addEventListener('click', function () {
      var text = emailLink.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      emailHint.classList.add('show');
      setTimeout(function () { emailHint.classList.remove('show'); }, 1600);
    });
  }

  var phoneBtn = document.querySelector('.js-copy-phone');
  var phoneHint = document.getElementById('phoneCopyHint');
  if (phoneBtn && phoneHint) {
    phoneBtn.addEventListener('click', function () {
      var text = phoneBtn.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      phoneHint.classList.add('show');
      setTimeout(function () { phoneHint.classList.remove('show'); }, 1600);
    });
  }

});

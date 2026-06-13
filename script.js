document.addEventListener('DOMContentLoaded', () => {

  // On initialise toutes nos fonctionnalités
  // dès que la page est prête
  initNavbar();
  initScrollReveal();
  initBarresCompetences();
  initTexteAnime();
  initFormulaire();
  initBoutonHaut();

  console.log('🚀 Portfolio chargé avec succès !');
});


/* ================================================
    NAVBAR
   ================================================ */
function initNavbar() {

  // On récupère les éléments du DOM
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('menuBurger');
  const navLinks  = document.querySelector('.nav-links');
  const tousLiens = document.querySelectorAll('.nav-links a');


  /* ---  Navbar compacte au scroll --- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* ---  Menu burger (mobile) --- */
  burger.addEventListener('click', () => {
    // classList.toggle = ajoute si absent, retire si présent
    navLinks.classList.toggle('ouvert');
    burger.classList.toggle('ouvert');
  });

  // Animation du burger (3 traits → croix)
  // On ajoute du CSS dynamiquement pour l'animation
  const style = document.createElement('style');
  style.textContent = `
    .menu-burger.ouvert span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .menu-burger.ouvert span:nth-child(2) {
      opacity: 0;
    }
    .menu-burger.ouvert span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  `;
  document.head.appendChild(style);

  // Fermer le menu quand on clique sur un lien
  tousLiens.forEach(lien => {
    lien.addEventListener('click', () => {
      navLinks.classList.remove('ouvert');
      burger.classList.remove('ouvert');
    });
  });


  /* ---  Lien actif selon la section visible --- */
  // On observe quelles sections sont visibles à l'écran
  const sections = document.querySelectorAll('section[id]');

  // IntersectionObserver = outil natif du navigateur qui
  // détecte quand un élément entre/sort de l'écran.
  const observateurNav = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cette section est visible

          // Retirer la classe "actif" de tous les liens
          tousLiens.forEach(l => l.classList.remove('actif'));

          const lienActif = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (lienActif) lienActif.classList.add('actif');
        }
      });
    },
    {
      // rootMargin : on considère qu'une section est "active"
      // quand elle occupe le tiers central de l'écran
      rootMargin: '-40% 0px -40% 0px'
    }
  );

  sections.forEach(section => observateurNav.observe(section));
}


/* ================================================
    SCROLL REVEAL
   ================================================ */
function initScrollReveal() {

  // On cible tous les éléments à animer
  const elementsReveal = document.querySelectorAll(
    '.reveal, .reveal-gauche, .reveal-droite'
  );

  const observateur = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // L'élément est visible → on l'anime
          entry.target.classList.add('visible');

          // Une fois animé, on arrête de l'observer
          observateur.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
      // threshold: 0.15 = l'animation se déclenche quand
      // 15% de l'élément est visible à l'écran
    }
  );

  elementsReveal.forEach(el => observateur.observe(el));
}


/* ================================================
    BARRES DE COMPÉTENCES ANIMÉES
   ================================================ */
function initBarresCompetences() {

  const barres = document.querySelectorAll('.barre');

  const observateur = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          // On anime uniquement la barre dans la carte qui vient d'entrer
          const barre = entry.target.querySelector('.barre');
          if (!barre) return;

          const niveau = barre.getAttribute('data-niveau');
           
          barre.style.transition = 'none';
          barre.style.width = '0%';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              barre.style.transition = 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
              barre.style.width = niveau + '%';
            });
          });

          observateur.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const cartes = document.querySelectorAll('.competence-carte');
  if (cartes.length > 0) {
    cartes.forEach(carte => observateur.observe(carte));
  } else {
    // Fallback si les cartes n'existent pas
    const section = document.getElementById('competences');
    if (section) observateur.observe(section);
  }
}


/* ================================================
    TEXTE ANIMÉ — EFFET MACHINE À ÉCRIRE
   ================================================ */
function initTexteAnime() {

  const element = document.getElementById('texte-anime');
  if (!element) return; // Sécurité : si l'élément n'existe pas, on arrête

  // Liste des textes à afficher — personnalise selon ton profil !
  const textes = [
    'Développeur Web',
    'Développeur de site web',
    'Créateur d\'interfaces',
    'Développeur d\'application web',
    'Passionné du code'
  ];

  let indexTexte    = 0;  // Quel texte on affiche en ce moment
  let indexLettre   = 0;  // Quelle lettre on est en train d'écrire
  let enTrain       = 'ecrire'; // 'ecrire' ou 'effacer'

  function animer() {
    const texteCourant = textes[indexTexte];

    if (enTrain === 'ecrire') {
      // On ajoute une lettre
      element.textContent = texteCourant.slice(0, indexLettre + 1);
      indexLettre++;

      if (indexLettre === texteCourant.length) {
        // Texte complet → on attend 2s avant d'effacer
        enTrain = 'effacer';
        setTimeout(animer, 2000);
        return;
      }
      // Vitesse d'écriture : 80ms entre chaque lettre
      setTimeout(animer, 80);

    } else {
      // On enlève une lettre
      element.textContent = texteCourant.slice(0, indexLettre - 1);
      indexLettre--;

      if (indexLettre === 0) {
        // Texte effacé → on passe au texte suivant
        enTrain = 'ecrire';
        indexTexte = (indexTexte + 1) % textes.length;
        // % textes.length = recommence au début quand on atteint la fin
        setTimeout(animer, 300);
        return;
      }
      // Vitesse d'effacement : 40ms (plus rapide que l'écriture)
      setTimeout(animer, 40);
    }
  }

  // On démarre l'animation avec un délai
  // (le temps que l'animation d'entrée du hero se termine)
  setTimeout(animer, 1200);
}


/* ================================================
    MODALES DES PROJETS
   ================================================ */
function ouvrirModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;

  // Ajoute la classe "active" → le CSS l'affiche
  modale.classList.add('active');

  // Empêche le scroll de la page derrière la modale
  document.body.style.overflow = 'hidden';
}

function fermerModale(id) {
  const modale = document.getElementById(id);
  if (!modale) return;

  // Retire la classe "active" → le CSS la cache
  modale.classList.remove('active');

  // Réactive le scroll de la page
  document.body.style.overflow = '';
}

// Fermer la modale avec la touche Échap du clavier
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Cherche toutes les modales ouvertes et les ferme
    document.querySelectorAll('.modale.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});


/* ================================================
    FORMULAIRE DE CONTACT
   ================================================ */
function initFormulaire() {

  const formulaire = document.getElementById('contactForm');
  if (!formulaire) return;

  // Crée le message de succès
  const msgSucces = document.createElement('div');
  msgSucces.classList.add('form-succes');
  formulaire.appendChild(msgSucces);

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupère les valeurs des champs
    const nom     = document.getElementById('nom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('sujet').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation : tous les champs doivent être remplis
    if (!nom || !email || !sujet || !message) {
      afficherErreur(msgSucces, '⚠️ Merci de remplir tous les champs !');
      return;
    }

    // Validation : format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      afficherErreur(msgSucces, '⚠️ Adresse email invalide.');
      return;
    }

    // Animation du bouton pendant l'envoi
    const bouton = formulaire.querySelector('button[type="submit"]');
    bouton.textContent = 'Envoi en cours...';
    bouton.disabled = true;

    // Paramètres envoyés à EmailJS
    const parametres = {
      from_name  : nom,
      from_email : email,
      subject    : sujet,
      message    : message,
    };

    emailjs.send("service_d43qij5", "template_lstg2eb", parametres)

      .then(() => {
        // ✅ Email envoyé avec succès
        formulaire.reset();
        bouton.textContent = 'Envoyer le message ✉️';
        bouton.disabled = false;

        msgSucces.style.background = 'rgba(0, 212, 255, 0.08)';
        msgSucces.style.borderColor = 'var(--cyber-blue)';
        msgSucces.style.color = 'var(--cyber-blue)';
        msgSucces.textContent = '✅ Message envoyé ! Je te réponds bientôt.';
        msgSucces.classList.add('visible');

        // Cache le message après 5 secondes
        setTimeout(() => msgSucces.classList.remove('visible'), 5000);
      })

      .catch((erreur) => {
        // ❌ Échec de l'envoi
        console.error('EmailJS erreur :', erreur);
        bouton.textContent = 'Envoyer le message ✉️';
        bouton.disabled = false;
        afficherErreur(msgSucces, '❌ Échec de l'envoi. Réessaie ou contacte-moi directement.');
      });
  });
}

// Fonction utilitaire pour afficher un message d'erreur
function afficherErreur(element, texte) {
  element.style.background = 'rgba(255, 50, 50, 0.08)';
  element.style.borderColor = '#ff3232';
  element.style.color = '#ff6464';
  element.textContent = texte;
  element.classList.add('visible');
  setTimeout(() => element.classList.remove('visible'), 4000);
}


/* ================================================
    BOUTON RETOUR EN HAUT
   ================================================ */
function initBoutonHaut() {

  const btn = document.getElementById('btn-haut');
  if (!btn) return;

  // Afficher/cacher le bouton selon la position du scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  // Remonter en haut au clic
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Défilement fluide
    });
  });
}

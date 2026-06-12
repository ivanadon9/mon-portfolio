/* ================================================
   PORTFOLIO — SCRIPT JAVASCRIPT COMPLET
   
   PLAN DU FICHIER :
   1. Utilitaires de base
   2. Navbar (scroll + menu burger + lien actif)
   3. Scroll Reveal (apparition des éléments)
   4. Barres de compétences animées
   5. Texte animé (effet machine à écrire)
   6. Modales des projets
   7. Formulaire de contact
   8. Bouton retour en haut
   ================================================ */


/* ================================================
   1. UTILITAIRES DE BASE
   
   "DOMContentLoaded" = on attend que tout le HTML
   soit chargé avant d'exécuter notre code.
   Sans ça, le JS essaierait de manipuler des
   éléments qui n'existent pas encore → erreurs.
   ================================================ */
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
   2. NAVBAR
   
   Trois comportements :
   a) Classe "scrolled" au défilement
   b) Menu burger sur mobile
   c) Lien actif selon la section visible
   ================================================ */
function initNavbar() {

  // On récupère les éléments du DOM
  // document.getElementById('...') = trouve un élément par son id
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('menuBurger');
  const navLinks  = document.querySelector('.nav-links');
  const tousLiens = document.querySelectorAll('.nav-links a');
  // querySelectorAll = trouve TOUS les éléments qui matchent
  // querySelector   = trouve seulement le PREMIER


  /* --- a) Navbar compacte au scroll --- */
  window.addEventListener('scroll', () => {
    // window.scrollY = combien de pixels on a défilé
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      // classList.add('scrolled') = ajoute la classe CSS "scrolled"
      // C'est comme écrire class="... scrolled" dans le HTML
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* --- b) Menu burger (mobile) --- */
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


  /* --- c) Lien actif selon la section visible --- */
  // On observe quelles sections sont visibles à l'écran
  const sections = document.querySelectorAll('section[id]');

  // IntersectionObserver = outil natif du navigateur qui
  // détecte quand un élément entre/sort de l'écran.
  // Bien plus performant qu'écouter le scroll manuellement.
  const observateurNav = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cette section est visible

          // Retirer la classe "actif" de tous les liens
          tousLiens.forEach(l => l.classList.remove('actif'));

          // Ajouter "actif" au lien qui correspond à cette section
          // entry.target.id = l'id de la section visible (ex: "projets")
          // On cherche le lien href="#projets"
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
   3. SCROLL REVEAL
   
   Principe :
   - Tous les éléments avec la classe "reveal"
     sont cachés (opacity:0) dans le CSS
   - Quand ils entrent dans l'écran, on leur
     ajoute la classe "visible" → ils apparaissent
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
          // (inutile de continuer à surveiller)
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
   4. BARRES DE COMPÉTENCES ANIMÉES
   
   Les barres se remplissent quand la section
   compétences entre dans l'écran.
   La largeur finale vient du data-niveau du HTML :
   <div class="barre" data-niveau="85">
   ================================================ */
function initBarresCompetences() {

  const barres = document.querySelectorAll('.barre');

  const observateur = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          // On anime uniquement la barre dans la carte qui vient d'entrer
          // plutôt que TOUTES les barres en même temps
          const barre = entry.target.querySelector('.barre');
          if (!barre) return;

          const niveau = barre.getAttribute('data-niveau');

          // FIX BUG 3 : on force width:0 puis on attend 2 cycles
          // de rendu (double requestAnimationFrame) pour que le
          // navigateur "voie" l'état initial avant d'animer.
          // Sans ce délai, le navigateur regroupe les 2 changements
          // dans le même cycle et n'anime rien.
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
    // FIX BUG 2 : threshold:0.2 = se déclenche dès que 20% de
    // la CARTE est visible. On observe chaque carte individuellement
    // plutôt que toute la section, bien plus fiable sur mobile.
    { threshold: 0.2 }
  );

  // FIX BUG 1 : on observe chaque carte de compétence
  // individuellement — pas la section entière
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
   5. TEXTE ANIMÉ — EFFET MACHINE À ÉCRIRE
   
   Le span #texte-anime affiche plusieurs métiers
   les uns après les autres, comme si quelqu'un
   les tapait et les effaçait en direct.
   ================================================ */
function initTexteAnime() {

  const element = document.getElementById('texte-anime');
  if (!element) return; // Sécurité : si l'élément n'existe pas, on arrête

  // Liste des textes à afficher — personnalise selon ton profil !
  const textes = [
    'Développeur Web',
    'Intégrateur HTML/CSS',
    'Créateur d\'interfaces',
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
   6. MODALES DES PROJETS
   
   ouvrirModale(id) → affiche la modale
   fermerModale(id) → cache la modale
   
   Ces fonctions sont appelées directement
   depuis le HTML : onclick="ouvrirModale('projet1')"
   Donc on les déclare sans "const" pour qu'elles
   soient accessibles globalement.
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
   7. FORMULAIRE DE CONTACT
   
   On intercepte la soumission du formulaire
   pour afficher un message de succès stylisé
   au lieu du comportement par défaut
   (qui rechargerait la page).
   ================================================ */
function initFormulaire() {

  const formulaire = document.getElementById('contactForm');
  if (!formulaire) return;

  // Crée et ajoute le div de succès dans le formulaire
  const msgSucces = document.createElement('div');
  msgSucces.classList.add('form-succes');
  msgSucces.textContent = '✅ Message envoyé ! Je te réponds bientôt.';
  formulaire.appendChild(msgSucces);

  formulaire.addEventListener('submit', (e) => {
    // e.preventDefault() = annule le rechargement de la page
    e.preventDefault();

    // Récupère les valeurs des champs
    const nom     = document.getElementById('nom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation basique — tous les champs doivent être remplis
    if (!nom || !email || !message) {
      alert('Merci de remplir tous les champs !');
      return;
    }

    // Ici tu pourras plus tard connecter un vrai service d'envoi
    // (ex: EmailJS, Formspree...). Pour l'instant on simule.

    // Animation du bouton pendant "l'envoi"
    const bouton = formulaire.querySelector('button[type="submit"]');
    bouton.textContent = 'Envoi en cours...';
    bouton.disabled = true;

    // Simule un délai réseau de 1.5s
    setTimeout(() => {
      // Réinitialise le formulaire
      formulaire.reset();
      bouton.textContent = 'Envoyer le message ✉️';
      bouton.disabled = false;

      // Affiche le message de succès
      msgSucces.classList.add('visible');

      // Cache le message après 4 secondes
      setTimeout(() => {
        msgSucces.classList.remove('visible');
      }, 4000);

    }, 1500);
  });
}


/* ================================================
   8. BOUTON RETOUR EN HAUT
   
   - Apparaît après avoir défilé de 400px
   - Ramène en douceur en haut de la page au clic
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

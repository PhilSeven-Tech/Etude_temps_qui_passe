# ⏳ L'Illusion du Temps — Loi de Paul Janet

Une application web interactive et visuelle permettant de comprendre et de visualiser l'illusion psychologique du temps qui passe selon la **loi philosophique et psychologique de Paul Janet (1823–1899)**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🧠 La Philosophie de Paul Janet

Paul Janet formulait dans ses travaux de psychologie :
> *« Chaque fraction de temps nous paraît d'autant plus courte que la durée totale de notre vie antérieure est plus longue. »*

### Les Formules Mathématiques :
1. **Poids instantané d'une année** à l'âge $x$ :
   $$f(x) = \frac{1}{x}$$

2. **Volume de Temps Ressenti Cumulé** de 1 à $A$ ans :
   $$V(A) = \int_{1}^{A} \frac{1}{t} \, dt = \ln(A)$$

3. **Seuil de Mi-Vie Subjective** (pour une vie de $N = 100$ ans) :
   $$M = \sqrt{N} = \sqrt{100} = \mathbf{10\text{ ans pile !}}$$
   À **10 ans**, vous avez déjà vécu **50% de toute la perception temporelle** d'une vie centenaire.

---

## ✨ Fonctionnalités de l'IHM

- 📊 **Repère $1/x$ & Aire sous la courbe** : Cannevas High-DPI interactif visualisant la courbe hyperbole $1/x$, la zone vécue (violet) et la zone restante.
- 📈 **Intégrale $\ln(x)$** : Courbe logarithmique du volume cumulé avec annotations pédagogiques.
- 🧱 **Grille des 100 Années** : Visualisation sous forme de blocs de chaque année de vie avec **infobulles détaillées au survol (Mouse Over)**.
- ⏳ **Comparateur d'Accélération** : Comparaison relative de la vitesse perçue entre différents âges (ex. 40 ans vs 10 ans).
- 🖱️ **Démonstration Mathématique au Survol** : Infobulles explicatives détaillées expliquant la formule de la racine carrée $\sqrt{N}$.

---

## 🚀 Installation & Utilisation Locale

Aucune dépendance lourde n'est requise. Un simple serveur HTTP suffit.

```bash
# Cloner le dépôt
git clone https://github.com/PhilSeven-Tech/Etude_temps_qui_passe.git

# Accéder au dossier
cd Etude_temps_qui_passe

# Lancer un serveur local Python
python -m http.server 8000
```

Ouvrez ensuite votre navigateur sur **`http://localhost:8000`**.

---

## 📄 Licence

Projet sous licence MIT — Développé avec passion pour l'exploration de la perception du temps.

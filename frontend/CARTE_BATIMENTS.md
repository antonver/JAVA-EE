# 🗺️ Carte des Bâtiments avec OpenStreetMap

## ✅ Réalisations

### 1. **Traduction complète en français** 🇫🇷
- ✅ Toute l'interface traduite en français
- ✅ Navigation, menus, boutons
- ✅ Pages: Connexion, Inscription, Tableau de bord, Profil, Paramètres
- ✅ Messages et notifications

### 2. **Logo Université de Montpellier** 🎓
- ✅ Logo ajouté dans l'AppBar
- ✅ Logo affiché dans le menu mobile (Drawer)
- ✅ Localisation: `src/assets/logo.png`

### 3. **Carte OpenStreetMap** 🗺️
- ✅ Intégration de React Leaflet
- ✅ Carte interactive sur la page d'accueil
- ✅ Marqueurs pour chaque bâtiment
- ✅ Popups avec informations détaillées
- ✅ Centrage automatique sur les bâtiments

### 4. **API Bâtiments** 🏢
- ✅ Endpoint: `GET /batiments/`
- ✅ Récupération automatique des données
- ✅ Parsing des bâtiments avec coordonnées
- ✅ Affichage sur la carte

---

## 🏗️ Architecture

```
frontend/src/
├── assets/
│   └── logo.png                 ← Logo Université Montpellier
├── components/
│   ├── Layout.jsx               ← Navigation FR + Logo
│   └── MapView.jsx              ← Nouveau! Carte OpenStreetMap
├── pages/
│   ├── Home.jsx                 ← Carte des bâtiments
│   ├── Dashboard.jsx            ← Tableau de bord (FR)
│   ├── Profile.jsx              ← Profil (FR)
│   ├── Settings.jsx             ← Paramètres (FR)
│   ├── Login.jsx                ← Connexion (FR)
│   └── Register.jsx             ← Inscription (FR)
├── services/
│   └── api.js                   ← + getBatiments()
└── index.css                    ← + Styles Leaflet
```

---

## 🗺️ Composant MapView

### Fonctionnalités

1. **Chargement automatique des bâtiments**
```javascript
const loadBatiments = async () => {
  const data = await getBatiments();
  setBatiments(data);
};
```

2. **Affichage sur la carte**
- Filtre les bâtiments avec coordonnées (latitude/longitude)
- Crée un marqueur pour chaque bâtiment
- Popup avec informations détaillées

3. **Centrage automatique**
- Calcule les limites de tous les bâtiments
- Centre la carte automatiquement
- Padding pour meilleure visibilité

4. **Statistiques**
- Nombre total de bâtiments
- Nombre de bâtiments géolocalisés
- Alerte pour bâtiments sans coordonnées

---

## 📊 Format des données

### Endpoint: `/batiments/`

**Réponse attendue:**
```json
[
  {
    "id": 1,
    "codeB": "BAT-A",
    "nom": "Bâtiment A",
    "latitude": 43.6108,
    "longitude": 3.8767,
    "adresse": "Place Eugène Bataillon",
    "campus": {
      "id": 1,
      "nom": "Campus Triolet"
    },
    "nbSalles": 25
  }
]
```

### Champs utilisés sur la carte:

| Champ | Usage | Obligatoire |
|-------|-------|-------------|
| `latitude` | Position Y sur la carte | ✅ |
| `longitude` | Position X sur la carte | ✅ |
| `nom` / `codeB` | Titre du marqueur | ✅ |
| `adresse` | Affichage dans popup | ❌ |
| `campus` | Information supplémentaire | ❌ |
| `nbSalles` | Statistiques | ❌ |

---

## 🎨 Bibliothèques utilisées

| Bibliothèque | Version | Usage |
|--------------|---------|-------|
| `react-leaflet` | Dernière | Composants React pour Leaflet |
| `leaflet` | Dernière | Bibliothèque de cartes |
| OpenStreetMap | - | Tuiles de carte |

### Installation
```bash
npm install react-leaflet leaflet
```

---

## 🗺️ Configuration de la carte

### Paramètres par défaut

```javascript
// Position par défaut (Montpellier)
const defaultCenter = [43.6108, 3.8767];
const defaultZoom = 13;
```

### Provider de tuiles
```javascript
<TileLayer
  attribution='&copy; OpenStreetMap contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

---

## 📱 Responsive Design

### Affichage adaptatif
- **Desktop:** Carte pleine hauteur avec statistiques
- **Mobile:** Carte optimisée avec contrôles tactiles
- **Hauteur:** `calc(100vh - 250px)` (minimum 500px)

---

## 🎯 Fonctionnalités de la carte

### 1. Marqueurs interactifs
```jsx
<Marker position={[latitude, longitude]}>
  <Popup>
    <h3>{batiment.nom}</h3>
    <p>📍 {batiment.adresse}</p>
    <p>Campus: {batiment.campus.nom}</p>
    <p>Salles: {batiment.nbSalles}</p>
  </Popup>
</Marker>
```

### 2. Centrage automatique
Le composant `SetViewOnClick` ajuste automatiquement la vue:
```javascript
const bounds = batiments
  .filter(b => b.latitude && b.longitude)
  .map(b => [b.latitude, b.longitude]);

if (bounds.length > 0) {
  map.fitBounds(bounds, { padding: [50, 50] });
}
```

### 3. États de chargement
- ⏳ **Loading:** CircularProgress pendant le chargement
- ❌ **Error:** Alert en cas d'erreur
- ✅ **Success:** Carte avec marqueurs

---

## 🇫🇷 Traductions françaises

### Navigation
- **Accueil** (Home)
- **Tableau de bord** (Dashboard)
- **Profil** (Profile)
- **Paramètres** (Settings)
- **Administration** (Admin - pour ADMIN uniquement)

### Actions
- **Se connecter** (Login)
- **S'inscrire** (Register)
- **Déconnexion** (Logout)

### Menu profil
- **Profil** (Profile)
- **Paramètres** (Settings)
- **Déconnexion** (Logout)

---

## 🚀 Utilisation

### Accéder à la carte

1. Se connecter à l'application
2. La page d'accueil affiche automatiquement la carte
3. Les bâtiments sont chargés depuis `/batiments/`
4. Cliquer sur un marqueur pour voir les détails

### Navigation

```
/ (Accueil)
  ↓
Carte des bâtiments
  ↓
Clic sur marqueur
  ↓
Popup avec détails du bâtiment
```

---

## 🔧 Configuration

### Modifier l'URL de l'API
Dans `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
```

### Modifier la position par défaut
Dans `MapView.jsx`:
```javascript
const defaultCenter = [43.6108, 3.8767]; // Montpellier
const defaultZoom = 13;
```

---

## 📊 Statistiques affichées

1. **Nombre total de bâtiments**
   - Compteur en haut de la carte
   
2. **Nombre de bâtiments géolocalisés**
   - Chip avec nombre de marqueurs sur la carte
   
3. **Bâtiments sans coordonnées**
   - Alert info si certains bâtiments n'ont pas de lat/long

---

## 🎨 Personnalisation

### Changer le style de la carte

Remplacer le TileLayer par un autre provider:

```jsx
// Exemple: Style sombre
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>

// Exemple: Vue satellite
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
/>
```

### Personnaliser les marqueurs

```javascript
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: '/path/to/custom-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

<Marker icon={customIcon} ... />
```

---

## 🐛 Gestion des erreurs

### Bâtiments sans coordonnées
```javascript
{batiments.filter(b => !b.latitude || !b.longitude).length > 0 && (
  <Alert severity="info">
    X bâtiment(s) n'ont pas de coordonnées géographiques
  </Alert>
)}
```

### Erreur de chargement
```javascript
if (error) {
  return (
    <Alert severity="error">
      Erreur lors du chargement des bâtiments
    </Alert>
  );
}
```

---

## ✨ Améliorations futures possibles

- [ ] Filtres par campus
- [ ] Filtres par composante
- [ ] Recherche de bâtiments
- [ ] Clustering de marqueurs (si beaucoup de bâtiments)
- [ ] Vue liste / carte
- [ ] Export des données
- [ ] Itinéraires entre bâtiments
- [ ] Vue 3D
- [ ] Informations en temps réel (occupation des salles)

---

## 🎉 Résumé

✅ **Interface complète en français**  
✅ **Logo Université de Montpellier**  
✅ **Carte OpenStreetMap interactive**  
✅ **API `/batiments/` intégrée**  
✅ **Marqueurs avec popups détaillées**  
✅ **Centrage automatique**  
✅ **Design responsive**  
✅ **Gestion des erreurs**  
✅ **Statistiques en temps réel**  

**Tout est prêt! 🚀**


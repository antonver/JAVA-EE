# 📏 API Calcul de Distance

## 🎯 Vue d'ensemble

API pour calculer la distance entre deux bâtiments universitaires.

**Méthode:** Formule de Haversine (distance à vol d'oiseau)

---

## 📡 Endpoints

### 1. Distance entre deux bâtiments

```
GET /api/distance/between/{codeB1}/{codeB2}
```

**Paramètres:**
- `codeB1` - Code du premier bâtiment (ex: `TRI_36`)
- `codeB2` - Code du deuxième bâtiment (ex: `RIC_B`)

**Exemple:**
```bash
GET http://localhost:8888/api/distance/between/TRI_36/RIC_B
```

**Réponse:**
```json
{
  "batiment1": {
    "code": "TRI_36",
    "latitude": 43.63038,
    "longitude": 3.86245,
    "campus": "Triolet"
  },
  "batiment2": {
    "code": "RIC_B",
    "latitude": 43.6036,
    "longitude": 3.8996,
    "campus": "Richter"
  },
  "distance": {
    "meters": 4328.52,
    "kilometers": 4.33,
    "type": "haversine",
    "description": "Distance à vol d'oiseau (ligne droite)"
  }
}
```

---

### 2. Distance avec coordonnées GPS

```
GET /api/distance/calculate?lat1={lat1}&lon1={lon1}&lat2={lat2}&lon2={lon2}
```

**Paramètres:**
- `lat1` - Latitude du point 1
- `lon1` - Longitude du point 1
- `lat2` - Latitude du point 2
- `lon2` - Longitude du point 2

**Exemple:**
```bash
GET http://localhost:8888/api/distance/calculate?lat1=43.63038&lon1=3.86245&lat2=43.6036&lon2=3.8996
```

**Réponse:**
```json
{
  "meters": 4328.52,
  "kilometers": 4.33,
  "type": "haversine"
}
```

---

## 🔬 Formule de Haversine

### Description
La formule de Haversine calcule la distance orthodromique (plus courte distance) entre deux points sur une sphère à partir de leurs latitudes et longitudes.

### Formule mathématique

```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Où:
- `φ` = latitude en radians
- `λ` = longitude en radians
- `R` = rayon de la Terre (6,371 km)
- `d` = distance

### Précision
- ✅ Très précise pour distances courtes (< 100 km)
- ✅ Erreur typique: < 0.5%
- ✅ Ne nécessite pas d'API externe

---

## 💻 Utilisation Frontend

### Service API

**Fichier:** `src/services/api.js`

```javascript
/**
 * Calculer la distance entre deux bâtiments
 * @param {string} codeB1 - Code du premier bâtiment
 * @param {string} codeB2 - Code du deuxième bâtiment
 * @returns {Promise} - Distance et informations
 */
export const getDistanceBetween = async (codeB1, codeB2) => {
  const response = await api.get(`/api/distance/between/${codeB1}/${codeB2}`);
  return response.data;
};

/**
 * Calculer la distance avec coordonnées GPS
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {Promise} - Distance
 */
export const calculateDistance = async (lat1, lon1, lat2, lon2) => {
  const response = await api.get('/api/distance/calculate', {
    params: { lat1, lon1, lat2, lon2 }
  });
  return response.data;
};
```

### Exemple d'utilisation

```javascript
import { getDistanceBetween } from './services/api';

// Dans un composant React
const [distance, setDistance] = useState(null);

const handleCalculateDistance = async () => {
  try {
    const result = await getDistanceBetween('TRI_36', 'RIC_B');
    setDistance(result);
    console.log(`Distance: ${result.distance.kilometers} km`);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 🗺️ Extension Google Maps API

### Option avancée (nécessite API key)

Pour obtenir la distance de trajet réel (par route), vous pouvez utiliser:

**Google Maps Distance Matrix API**

```java
// Exemple de méthode additionnelle
@GetMapping("/between/{codeB1}/{codeB2}/route")
public ResponseEntity<?> getRouteDistance(
        @PathVariable String codeB1,
        @PathVariable String codeB2) {
    
    // Récupérer les bâtiments
    Batiment bat1 = batimentRepository.findById(codeB1).orElseThrow();
    Batiment bat2 = batimentRepository.findById(codeB2).orElseThrow();
    
    // Appel API Google Maps
    String origin = bat1.getLatitude() + "," + bat1.getLongitude();
    String destination = bat2.getLatitude() + "," + bat2.getLongitude();
    String apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
    
    String url = String.format(
        "https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
        origin, destination, apiKey
    );
    
    // Faire requête HTTP et parser réponse
    // ...
}
```

**Avantages Google Maps:**
- ✅ Distance réelle par route
- ✅ Temps de trajet estimé
- ✅ Modes: voiture, vélo, à pied, transport

**Inconvénients:**
- ❌ Nécessite clé API
- ❌ Coût (après quota gratuit)
- ❌ Dépendance externe

---

## 📊 Comparaison des méthodes

| Méthode | Distance | Temps | API Key | Coût | Précision |
|---------|----------|-------|---------|------|-----------|
| **Haversine** | Vol d'oiseau | ❌ | ❌ Non | ✅ Gratuit | ± 0.5% |
| **Google Maps** | Route réelle | ✅ Oui | ⚠️ Oui | 💰 Payant | ± 1% |

---

## 🧪 Tests

### Test avec curl

```bash
# Distance entre Triolet et Richter
curl http://localhost:8888/api/distance/between/TRI_36/RIC_B

# Distance avec coordonnées
curl "http://localhost:8888/api/distance/calculate?lat1=43.63&lon1=3.86&lat2=43.60&lon2=3.90"
```

### Test depuis le frontend

```javascript
// Console du navigateur
fetch('http://localhost:8888/api/distance/between/TRI_36/RIC_B')
  .then(r => r.json())
  .then(data => console.log(`Distance: ${data.distance.kilometers} km`));
```

---

## 🎯 Cas d'usage

### 1. Afficher la distance sur la carte

```javascript
<Popup>
  <h3>{batiment.nom}</h3>
  <p>Distance depuis votre position: {distance} km</p>
</Popup>
```

### 2. Trouver le bâtiment le plus proche

```javascript
const findNearestBuilding = async (userLat, userLon, buildings) => {
  const distances = await Promise.all(
    buildings.map(async (b) => {
      const d = await calculateDistance(userLat, userLon, b.latitude, b.longitude);
      return { building: b, distance: d.meters };
    })
  );
  
  return distances.sort((a, b) => a.distance - b.distance)[0];
};
```

### 3. Calculer un itinéraire

```javascript
const route = [
  { from: 'TRI_36', to: 'TRI_07' },
  { from: 'TRI_07', to: 'RIC_B' },
  { from: 'RIC_B', to: 'PHA_A' }
];

const totalDistance = await route.reduce(async (acc, leg) => {
  const result = await getDistanceBetween(leg.from, leg.to);
  return acc + result.distance.meters;
}, 0);

console.log(`Distance totale: ${totalDistance / 1000} km`);
```

---

## 🔐 Sécurité

L'endpoint est configuré en **public** (`.permitAll()`) car:
- Données non sensibles (coordonnées GPS publiques)
- Pas de modification de données
- Calcul simple côté serveur

Pour restreindre l'accès:

```java
.requestMatchers("/api/distance/**").authenticated()
```

---

## 📚 Ressources

- [Formule de Haversine (Wikipedia)](https://fr.wikipedia.org/wiki/Formule_de_haversine)
- [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Calcul de distances géographiques](https://www.movable-type.co.uk/scripts/latlong.html)

---

## ✨ Résumé

✅ **Endpoint créé:** `/api/distance/between/{code1}/{code2}`  
✅ **Méthode:** Formule de Haversine  
✅ **Précision:** ±0.5%  
✅ **Coût:** Gratuit  
✅ **API Key:** Non nécessaire  
✅ **Response:** JSON avec distances en m et km  

**Prêt à utiliser!** 🚀


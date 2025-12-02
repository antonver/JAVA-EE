# 🚀 Spring Data REST - Configuration finale

## ✅ Solution avec Spring Data REST

### Avantages de Spring Data REST
- ✅ Génération automatique des endpoints REST
- ✅ Pas besoin de contrôleurs manuels
- ✅ Support HATEOAS (Hypermedia)
- ✅ Pagination, tri, recherche intégrés
- ✅ Standard RESTful

---

## 🔧 Configuration Backend

### 1. Repository avec @RepositoryRestResource

**Fichier:** `BatimentRepository.java`

```java
@RepositoryRestResource(collectionResourceRel = "batiments", path = "batiments")
public interface BatimentRepository extends JpaRepository<Batiment, String> {
    // Spring Data REST génère automatiquement les endpoints
}
```

### 2. Éviter les références circulaires

**Fichier:** `Batiment.java`

```java
@Entity
@JsonIgnoreProperties({"salleList", "composanteList"})
public class Batiment {
    
    @ManyToOne
    @JoinColumn(name="campus")
    @JsonIgnoreProperties({"batiments", "universite"})
    private Campus campus;
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy="batiment")
    private List<Salle> salleList;  // Ignoré dans JSON
    
    @ManyToMany(mappedBy = "batimentList")
    private List<Composante> composanteList;  // Ignoré dans JSON
}
```

### 3. Configuration de sécurité

**Fichier:** `SecurityConfiguration.java`

```java
.requestMatchers("/batiments/**").permitAll()
```

---

## 📡 Endpoints générés automatiquement

### Liste des bâtiments
```
GET /batiments
```

**Réponse:**
```json
{
  "_embedded": {
    "batiments": [
      {
        "anneeC": 1500,
        "longitude": 3.87525,
        "latitude": 43.61285,
        "_links": {
          "self": {
            "href": "http://localhost:8888/batiments/UM_DROIT"
          },
          "campus": {
            "href": "http://localhost:8888/batiments/UM_DROIT/campus"
          }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "http://localhost:8888/batiments"
    }
  }
}
```

### Un bâtiment spécifique
```
GET /batiments/{id}
```

**Exemple:**
```
GET /batiments/UM_DROIT
```

### Campus d'un bâtiment
```
GET /batiments/{id}/campus
```

### Recherche (si ajoutée au repository)
```
GET /batiments/search/findByCampus?campus={campusId}
```

---

## 🎨 Frontend - Parsing HATEOAS

### Service API mis à jour

**Fichier:** `api.js`

```javascript
export const getBatiments = async () => {
  const response = await api.get('/batiments');
  
  // Spring Data REST retourne: { _embedded: { batiments: [...] } }
  // On extrait le tableau de batiments
  if (response.data._embedded && response.data._embedded.batiments) {
    return response.data._embedded.batiments;
  }
  
  return response.data;
};
```

### MapView - Extraction de l'ID

**Fichier:** `MapView.jsx`

```javascript
{batiments.map((batiment, index) => {
  // ID depuis HATEOAS link
  // "http://localhost:8888/batiments/UM_DROIT" -> "UM_DROIT"
  const batimentId = batiment._links?.self?.href?.split('/').pop() || index;
  
  return (
    <Marker key={batimentId} position={[batiment.latitude, batiment.longitude]}>
      <Popup>
        <h3>{batimentId}</h3>
        <p>Année: {batiment.anneeC}</p>
        <p>Coords: {batiment.latitude}, {batiment.longitude}</p>
      </Popup>
    </Marker>
  );
})}
```

---

## 🔍 Format HATEOAS

### Structure de la réponse

```json
{
  "_embedded": {
    "batiments": [...]    // ← Les données ici
  },
  "_links": {
    "self": { ... },
    "profile": { ... }
  },
  "page": {              // Si pagination activée
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "number": 0
  }
}
```

### Liens (HATEOAS)

Chaque ressource a des `_links`:
- **self** - URL de la ressource
- **Relations** - URLs des ressources liées (campus, salles, etc.)

---

## 🎯 Comparaison

### Avant (Contrôleur manuel)
```java
@RestController
@RequestMapping("/batiments")
public class BatimentRestController {
    
    @GetMapping("/")
    public ResponseEntity<List<BatimentDTO>> getAllBatiments() {
        // Code manuel pour convertir Batiment -> BatimentDTO
        // Gestion manuelle des références circulaires
        return ResponseEntity.ok(batimentDTOs);
    }
}
```

❌ Beaucoup de code boilerplate  
❌ Maintenance manuelle des DTOs  
❌ Pas de pagination/tri automatique  

### Après (Spring Data REST)
```java
@RepositoryRestResource(path = "batiments")
public interface BatimentRepository extends JpaRepository<Batiment, String> {
    // C'est tout! 🎉
}
```

✅ Zéro code boilerplate  
✅ Endpoints générés automatiquement  
✅ Pagination/tri/recherche intégrés  
✅ Standard HATEOAS  

---

## 📦 Fichiers modifiés

### Backend

1. **BatimentRepository.java** (MODIFIÉ)
   - Ajout de `@RepositoryRestResource`
   
2. **Batiment.java** (MODIFIÉ)
   - Ajout de `@JsonIgnoreProperties` pour éviter cycles
   
3. **BatimentRestController.java** (SUPPRIMÉ)
   - Plus nécessaire avec Spring Data REST

### Frontend

1. **api.js** (MODIFIÉ)
   - Parse du format HATEOAS `_embedded.batiments`
   
2. **MapView.jsx** (MODIFIÉ)
   - Extraction de l'ID depuis `_links.self.href`

---

## 🧪 Tests

### Backend
```bash
# Liste des bâtiments
curl http://localhost:8888/batiments

# Un bâtiment spécifique
curl http://localhost:8888/batiments/UM_DROIT

# Campus d'un bâtiment
curl http://localhost:8888/batiments/UM_DROIT/campus
```

### Frontend
1. Ouvrir http://localhost:5173
2. Se connecter
3. Page d'accueil → Carte avec marqueurs ✅

---

## 🔧 Configuration avancée (optionnelle)

### Pagination
Par défaut, Spring Data REST pagine les résultats (20 éléments):
```
GET /batiments?page=0&size=20
```

Pour augmenter la taille:
```java
@RepositoryRestResource(collectionResourceRel = "batiments", path = "batiments")
public interface BatimentRepository extends JpaRepository<Batiment, String> {
    // Configuration dans application.properties
}
```

**application.properties:**
```properties
spring.data.rest.default-page-size=100
spring.data.rest.max-page-size=1000
```

### Projection (pour contrôler les champs)
```java
@Projection(name = "batimentWithCampus", types = { Batiment.class })
public interface BatimentProjection {
    String getCodeB();
    Double getLatitude();
    Double getLongitude();
    Campus getCampus();
}
```

Utilisation:
```
GET /batiments?projection=batimentWithCampus
```

---

## ✨ Avantages de cette approche

1. **Moins de code** - Pas de contrôleurs manuels
2. **Standard RESTful** - Format HATEOAS reconnu
3. **Fonctionnalités gratuites**:
   - Pagination
   - Tri (`?sort=anneeC,desc`)
   - Recherche (avec `@Query` dans repository)
   - Filtres
4. **Maintenabilité** - Modifications automatiques si modèle change
5. **Documentation auto** - Spring Data REST + Swagger

---

## 🎉 Résultat

✅ **Backend:** Endpoints générés automatiquement par Spring Data REST  
✅ **Frontend:** Parse correctement le format HATEOAS  
✅ **Carte:** Affiche tous les bâtiments avec marqueurs  
✅ **Code:** Minimal et maintenable  

---

## 📚 Références

- [Spring Data REST Documentation](https://docs.spring.io/spring-data/rest/docs/current/reference/html/)
- [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)
- [HAL (Hypertext Application Language)](http://stateless.co/hal_specification.html)

---

**Développé avec ❤️ pour l'Université de Montpellier**


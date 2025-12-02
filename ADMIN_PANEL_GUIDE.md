# 🔐 Guide: Panneau d'Administration

## 🎯 Vue d'ensemble

La page **/admin** est une interface de gestion complète permettant aux utilisateurs avec le rôle **GESTIONNAIRE** (ou **ADMIN**) d'effectuer des opérations CRUD sur toutes les entités du système.

---

## 🔒 Contrôle d'accès

### Rôles autorisés:
- ✅ **GESTIONNAIRE** - Accès complet
- ✅ **ADMIN** - Accès complet

### Rôles refusés:
- ❌ **ENSEIGNANT** - Pas d'accès
- ❌ **ETUDIANT** - Pas d'accès
- ❌ **USER** - Pas d'accès

---

## 📋 Entités gérables

### 1. **Bâtiments**
```
Champs:
- Code (codeB)
- Année de construction
- Latitude
- Longitude
- Campus

Operations:
- ✅ Afficher (Liste complète)
- 🔄 Actualiser
- 🚧 Ajouter (En cours)
- 🚧 Modifier (En cours)
- 🚧 Supprimer (En cours)
```

### 2. **Campus**
```
Champs:
- Nom (nomC)
- Ville
- Université

Operations:
- ✅ Afficher (Liste complète)
- 🔄 Actualiser
- 🚧 Ajouter (En cours)
- 🚧 Modifier (En cours)
- 🚧 Supprimer (En cours)
```

### 3. **Salles**
```
Champs:
- Numéro (numS)
- Type (amphi, td, tp, etc.)
- Capacité
- Étage
- Accès PMR

Operations:
- ✅ Afficher (Liste complète)
- 🔄 Actualiser
- 🚧 Ajouter (En cours)
- 🚧 Modifier (En cours)
- 🚧 Supprimer (En cours)
```

### 4. **Réservations**
```
Champs:
- ID
- Enseignant
- Salle
- Date début/fin
- Matière

Operations:
- 🔄 Actualiser
- 🚧 Gestion complète (En cours)
```

---

## 🎨 Interface utilisateur

### Structure:
```
┌──────────────────────────────────────────────────┐
│  Panneau d'Administration         [GESTIONNAIRE] │
├──────────────────────────────────────────────────┤
│  [Bâtiments] [Campus] [Salles] [Réservations]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Gestion des XXX      [Actualiser] [Ajouter]│ │
│  ├────────────────────────────────────────────┤ │
│  │ Code | Année | Lat | Long | Campus | ⚙️   │ │
│  │ TRI_36 | 2017 | ... | ... | Triolet | ✏️🗑│ │
│  │ ...                                        │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Comment accéder

### Étape 1: Connexion avec bon rôle
```
1. Se connecter avec un compte GESTIONNAIRE ou ADMIN
2. Le menu "Administration" apparaît automatiquement
```

### Étape 2: Navigation
```
Menu principal → Administration
ou
URL directe: http://localhost:5173/admin
```

---

## 🔧 Configuration backend

### SecurityConfiguration
```java
// /admin/** accessible aux GESTIONNAIRE et ADMIN
.requestMatchers("/admin/**")
    .hasAnyRole("ADMIN", "GESTIONNAIRE")

// /campus/** accessible uniquement aux gestionnaires
.requestMatchers("/campus/**")
    .hasAnyRole("ADMIN", "GESTIONNAIRE")
```

### Repositories exposés via Spring Data REST:
```java
@RepositoryRestResource(path = "batiments")
public interface BatimentRepository extends JpaRepository<...>

@RepositoryRestResource(path = "campus")
public interface CampusRepository extends JpaRepository<...>

@RepositoryRestResource(path = "salles")
public interface SalleRepository extends JpaRepository<...>
```

---

## 📡 API Endpoints

### GET Endpoints (Lecture):

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `GET /batiments` | Liste tous les bâtiments | ❌ Public |
| `GET /campus` | Liste tous les campus | ✅ GESTIONNAIRE/ADMIN |
| `GET /salles` | Liste toutes les salles | ❌ Public |
| `GET /reservations` | Liste toutes les réservations | ✅ Auth |

### POST Endpoints (Création):
```
🚧 En cours de développement
POST /admin/batiments
POST /admin/campus
POST /admin/salles
```

### PUT/PATCH Endpoints (Modification):
```
🚧 En cours de développement
PUT /admin/batiments/{id}
PUT /admin/campus/{id}
PUT /admin/salles/{id}
```

### DELETE Endpoints (Suppression):
```
🚧 En cours de développement
DELETE /admin/batiments/{id}
DELETE /admin/campus/{id}
DELETE /admin/salles/{id}
```

---

## 🎯 Fonctionnalités actuelles

### ✅ Implémenté:

1. **Interface avec onglets**
   - Navigation fluide entre entités
   - Design responsive
   - Tableaux avec pagination automatique

2. **Affichage des données**
   - Lecture des bâtiments
   - Lecture des campus
   - Lecture des salles
   - Lecture des réservations

3. **Bouton Actualiser**
   - Rafraîchit les données en temps réel
   - Gestion des états de chargement

4. **Contrôle d'accès**
   - Vérification du rôle côté frontend
   - Protection des routes côté backend
   - Badge d'identification (GESTIONNAIRE)

### 🚧 En développement:

1. **CRUD Complet**
   - Création d'entités
   - Modification d'entités
   - Suppression d'entités

2. **Dialogs de formulaires**
   - Formulaires de création
   - Formulaires d'édition
   - Confirmation de suppression

3. **Validation**
   - Validation frontend (React Hook Form)
   - Validation backend (Bean Validation)

4. **Recherche et filtres**
   - Recherche textuelle
   - Filtres par catégorie
   - Tri des colonnes

---

## 💡 Prochaines étapes

### Phase 1: CRUD Complet
```javascript
// Exemple: Créer un campus
const handleCreateCampus = async (data) => {
  await api.post('/admin/campus', {
    nomC: data.nom,
    ville: data.ville,
    universite: data.universite
  });
};
```

### Phase 2: Formulaires avancés
```javascript
// Dialog avec validation
<Dialog open={openDialog}>
  <DialogTitle>Ajouter un Campus</DialogTitle>
  <DialogContent>
    <TextField label="Nom" required />
    <TextField label="Ville" required />
    <Autocomplete options={universites} />
  </DialogContent>
</Dialog>
```

### Phase 3: Gestion des relations
```
- Sélection de Campus pour Bâtiment
- Sélection de Bâtiment pour Salle
- Gestion des Many-to-Many
```

---

## 🐛 Dépannage

### Problème 1: "Accès refusé"
**Symptôme:** 403 Forbidden

**Solution:**
1. Vérifiez votre rôle: Console (F12) → `user.role`
2. Si pas GESTIONNAIRE → Demandez à l'admin de changer votre rôle
3. Reconnectez-vous pour obtenir un nouveau token

### Problème 2: "Données ne s'affichent pas"
**Symptôme:** Tableaux vides

**Solution:**
1. Ouvrez Console (F12) → Network
2. Vérifiez les requêtes API
3. Si 401/403 → Problème d'authentification
4. Si 404 → Endpoint n'existe pas
5. Si 500 → Erreur serveur (vérifiez logs backend)

### Problème 3: "CORS Error"
**Symptôme:** 
```
Access to XMLHttpRequest at 'http://localhost:8888/campus' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
- Vérifiez que le backend est lancé
- Vérifiez SecurityConfiguration.java
- Redémarrez le backend

---

## 📊 Structure des données

### Bâtiment (Batiment.java)
```java
@Entity
public class Batiment {
    @Id
    private String codeB;
    
    private Integer anneeC;
    private Double latitude;
    private Double longitude;
    
    @ManyToOne
    private Campus campus;
}
```

### Campus (Campus.java)
```java
@Entity
public class Campus {
    @Id
    private String nomC;
    
    private String ville;
    
    @ManyToOne
    private Universite universite;
    
    @OneToMany(mappedBy = "campus")
    private List<Batiment> batiments;
}
```

### Salle (Salle.java)
```java
@Entity
public class Salle {
    @Id
    private String numS;
    
    private Integer capacite;
    @Enumerated(EnumType.STRING)
    private TypeSalle typeS;
    private String etage;
    private String acces;  // "oui" ou "non"
    
    @ManyToOne
    private Batiment batiment;
}
```

---

## ✅ Checklist de test

Avant de valider que tout fonctionne:

- [ ] Backend lancé sur port 8888
- [ ] Frontend lancé sur port 5173
- [ ] Connecté avec compte GESTIONNAIRE
- [ ] Onglet "Administration" visible dans le menu
- [ ] Page /admin accessible
- [ ] Onglet "Bâtiments" affiche les données
- [ ] Onglet "Campus" affiche les données
- [ ] Onglet "Salles" affiche les données
- [ ] Bouton "Actualiser" fonctionne
- [ ] Pas d'erreurs dans la console (F12)
- [ ] Badge "GESTIONNAIRE" visible

---

## 🎓 Comment tester

### 1. Créer un compte GESTIONNAIRE

**Option A: Via SQL**
```sql
INSERT INTO users (email, password, full_name, role, created_at, updated_at)
VALUES (
  'gestionnaire@example.com',
  '$2a$10$...', -- bcrypt hash du mot de passe
  'Jean Gestionnaire',
  'GESTIONNAIRE',
  NOW(),
  NOW()
);
```

**Option B: Modifier un compte existant**
```sql
UPDATE users 
SET role = 'GESTIONNAIRE' 
WHERE email = 'votre-email@example.com';
```

### 2. Se connecter
```
Email: gestionnaire@example.com
Password: votre-mot-de-passe
```

### 3. Vérifier le rôle
Ouvrez la console (F12):
```javascript
🔍 Роль извлеченная: GESTIONNAIRE ✅
```

### 4. Accéder à l'admin
```
Menu → Administration
ou
URL: http://localhost:5173/admin
```

---

**La page d'administration est prête! Les fonctionnalités CRUD complètes seront ajoutées progressivement. 🚀**


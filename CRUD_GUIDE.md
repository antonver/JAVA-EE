# 🔧 Guide: CRUD Complet - Panneau d'Administration

## 🎯 Vue d'ensemble

Toutes les entités de la base de données peuvent maintenant être gérées via l'interface d'administration avec des opérations CRUD complètes.

**Focus principal:** 🔐 **Gestion des rôles utilisateurs** - Le gestionnaire peut changer les rôles de tous les utilisateurs du système.

---

## 👥 GESTION DES UTILISATEURS (PRIORITÉ #1)

### Accès
```
Menu → Utilisateurs
URL: /users
```

### Fonctionnalités

#### ✅ **Changer le rôle d'un utilisateur**
```
1. Cliquer sur l'icône ✏️ à côté de l'utilisateur
2. Sélectionner le nouveau rôle dans le dropdown
3. Cliquer "Enregistrer"
4. ✅ Le rôle est changé immédiatement
```

**Rôles disponibles:**
- **ADMIN** 🔴 - Accès complet au système
- **GESTIONNAIRE** 🟣 - Gestion administrative complète
- **ENSEIGNANT** 🔵 - Réservation des salles
- **ETUDIANT** ⚪ - Consultation uniquement

#### ✅ **Supprimer un utilisateur**
```
1. Cliquer sur l'icône 🗑️
2. Confirmer la suppression
3. ✅ Utilisateur supprimé définitivement
```

### API Endpoints (Backend)

```java
GET    /admin/users              // Liste tous les utilisateurs
GET    /admin/users/{id}         // Détails d'un utilisateur
PATCH  /admin/users/{id}/role    // Changer le rôle
DELETE /admin/users/{id}          // Supprimer un utilisateur

// Request body pour changer le rôle:
{
  "role": "GESTIONNAIRE"
}
```

---

## 🏢 GESTION DES BÂTIMENTS

### Opérations disponibles

#### ✅ **Créer un bâtiment**
```java
POST /admin/batiments
{
  "codeB": "TRI_99",
  "anneeC": 2024,
  "latitude": 43.6304,
  "longitude": 3.8625,
  "campusNomC": "Triolet"
}
```

#### ✅ **Modifier un bâtiment**
```java
PUT /admin/batiments/{code}
{
  "codeB": "TRI_99",
  "anneeC": 2025,
  "latitude": 43.6305,
  "longitude": 3.8626,
  "campusNomC": "Triolet"
}
```

#### ✅ **Supprimer un bâtiment**
```java
DELETE /admin/batiments/{code}
```

---

## 🏫 GESTION DES CAMPUS

### Opérations disponibles

#### ✅ **Créer un campus**
```java
POST /admin/campus
{
  "nomC": "Nouveau Campus",
  "ville": "Montpellier",
  "universiteNom": "Université de Montpellier"
}
```

#### ✅ **Modifier un campus**
```java
PUT /admin/campus/{nom}
{
  "nomC": "Nouveau Campus",
  "ville": "Montpellier",
  "universiteNom": "Université de Montpellier"
}
```

#### ✅ **Supprimer un campus**
```java
DELETE /admin/campus/{nom}
```

---

## 🚪 GESTION DES SALLES

### Opérations disponibles

#### ✅ **Créer une salle**
```java
POST /admin/salles
{
  "numS": "99.01",
  "capacite": 50,
  "typeS": "TD",       // amphi, sc, td, tp, numerique
  "etage": "1",
  "acces": "oui",
  "batimentCodeB": "TRI_36"
}
```

#### ✅ **Modifier une salle**
```java
PUT /admin/salles/{num}
{
  "numS": "99.01",
  "capacite": 60,
  "typeS": "AMPHI",
  "etage": "1",
  "acces": "oui",
  "batimentCodeB": "TRI_36"
}
```

#### ✅ **Supprimer une salle**
```java
DELETE /admin/salles/{num}
```

---

## 📅 GESTION DES RÉSERVATIONS

### Opérations disponibles

#### ✅ **Supprimer une réservation (Admin)**
```java
DELETE /admin/reservations/{id}
```

**Note:** La création et modification de réservations se font via l'interface "Cours" pour les enseignants.

---

## 🔒 Sécurité

### Contrôle d'accès

```java
@PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
public class AdminController {
    // Tous les endpoints nécessitent ADMIN ou GESTIONNAIRE
}
```

### Frontend

```javascript
// AdminRoute protège /users et /admin
const AdminRoute = ({ children }) => {
  if (user?.role !== 'GESTIONNAIRE' && user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  return children;
};
```

---

## 🎨 Interface Utilisateur

### Page: Gestion des Utilisateurs (/users)

```
┌──────────────────────────────────────────────────────┐
│  👤 Gestion des Utilisateurs     [↻ Actualiser]     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ID │ Nom         │ Email          │ Rôle │ Actions │
│  ───┼─────────────┼────────────────┼──────┼─────────│
│  1  │ Jean D.     │ jean@..        │[GEST]│ ✏️ 🗑️   │
│  2  │ Marie P.    │ marie@..       │[ENSE]│ ✏️ 🗑️   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Cliquer sur ✏️:**
```
┌──────────────────────────────────┐
│  Changer le rôle de l'utilisateur│
├──────────────────────────────────┤
│  Utilisateur: Jean Dupont        │
│  jean@example.com                │
│                                  │
│  Nouveau rôle: [GESTIONNAIRE ▼]  │
│                                  │
│  ℹ️ Rôles disponibles:           │
│  • ADMIN: Accès complet          │
│  • GESTIONNAIRE: Gestion admin   │
│  • ENSEIGNANT: Réservation       │
│  • ETUDIANT: Consultation        │
│                                  │
│     [Annuler]  [Enregistrer]     │
└──────────────────────────────────┘
```

**Cliquer sur 🗑️:**
```
┌──────────────────────────────────┐
│  Confirmer la suppression        │
├──────────────────────────────────┤
│  ⚠️ Êtes-vous sûr de vouloir     │
│  supprimer Jean Dupont ?         │
│                                  │
│  Cette action est irréversible.  │
│                                  │
│     [Annuler]  [Supprimer]       │
└──────────────────────────────────┘
```

---

## 🧪 Tests

### Test 1: Changer un rôle ENSEIGNANT → GESTIONNAIRE

```
1. Se connecter en tant que GESTIONNAIRE
2. Aller sur /users
3. Trouver un utilisateur avec rôle ENSEIGNANT
4. Cliquer sur ✏️
5. Sélectionner "GESTIONNAIRE"
6. Cliquer "Enregistrer"
7. ✅ Vérifier que le rôle a changé
8. ✅ L'utilisateur doit se déconnecter/reconnecter pour voir le nouveau menu
```

### Test 2: Supprimer un utilisateur

```
1. Se connecter en tant que GESTIONNAIRE
2. Aller sur /users
3. Cliquer sur 🗑️ pour un utilisateur test
4. Confirmer la suppression
5. ✅ Utilisateur disparaît de la liste
6. ✅ Ne peut plus se connecter
```

### Test 3: Accès refusé pour ENSEIGNANT

```
1. Se connecter en tant que ENSEIGNANT
2. Essayer d'accéder à /users
3. ✅ Redirection automatique vers /
4. ✅ Menu "Utilisateurs" n'est pas visible
```

---

## 📊 Structure Backend

### AdminController.java

```java
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
public class AdminController {
    
    // === USERS ===
    @GetMapping("/users")
    @PatchMapping("/users/{id}/role")  // ⭐ IMPORTANT
    @DeleteMapping("/users/{id}")
    
    // === BATIMENTS ===
    @PostMapping("/batiments")
    @PutMapping("/batiments/{id}")
    @DeleteMapping("/batiments/{id}")
    
    // === CAMPUS ===
    @PostMapping("/campus")
    @PutMapping("/campus/{id}")
    @DeleteMapping("/campus/{id}")
    
    // === SALLES ===
    @PostMapping("/salles")
    @PutMapping("/salles/{id}")
    @DeleteMapping("/salles/{id}")
    
    // === RESERVATIONS ===
    @DeleteMapping("/reservations/{id}")
}
```

### DTOs (Java Records)

```java
public record RoleUpdateRequest(String role) {}

public record UserResponse(
    Integer id,
    String email,
    String fullName,
    String role,
    Date createdAt,
    Date updatedAt
) {}

public record BatimentRequest(...) {}
public record CampusRequest(...) {}
public record SalleRequest(...) {}
```

---

## 🎯 Prochaines étapes (À implémenter)

### Frontend: Formulaires de création/édition

**Pour Admin.jsx**, ajouter dialogs avec formulaires pour:
- ✅ Utilisateurs (FAIT - changement de rôle)
- 🔄 Bâtiments (À faire)
- 🔄 Campus (À faire)
- 🔄 Salles (À faire)

### Exemple de dialog pour créer un bâtiment:

```javascript
<Dialog open={openCreateDialog}>
  <DialogTitle>Créer un bâtiment</DialogTitle>
  <DialogContent>
    <TextField label="Code" required />
    <TextField label="Année" type="number" />
    <TextField label="Latitude" type="number" />
    <TextField label="Longitude" type="number" />
    <Autocomplete options={campus} label="Campus" />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Annuler</Button>
    <Button onClick={handleCreate}>Créer</Button>
  </DialogActions>
</Dialog>
```

---

## ✅ Checklist

- [x] Backend: AdminController créé
- [x] Backend: Endpoints CRUD pour toutes les entités
- [x] Backend: Sécurité (@PreAuthorize)
- [x] Frontend: Page UsersManagement créée
- [x] Frontend: Changement de rôle fonctionnel
- [x] Frontend: Suppression d'utilisateur
- [x] Frontend: AdminRoute protège les routes
- [x] Frontend: Menu "Utilisateurs" visible pour GESTIONNAIRE
- [ ] Frontend: Formulaires pour autres entités (En cours)
- [ ] Frontend: Validation des formulaires
- [ ] Frontend: Gestion des erreurs

---

## 🚀 Utilisation immédiate

### Changer un rôle maintenant:

1. **Se connecter** avec un compte GESTIONNAIRE ou ADMIN
2. **Menu** → Utilisateurs
3. **Cliquer ✏️** sur l'utilisateur à modifier
4. **Sélectionner** le nouveau rôle
5. **Enregistrer** ✅

**C'est tout! Le rôle est changé immédiatement dans la base de données!** 🎉

---

**Note:** L'utilisateur modifié doit se déconnecter et se reconnecter pour obtenir un nouveau JWT token avec le rôle mis à jour.


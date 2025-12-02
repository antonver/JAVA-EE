# 📚 Système de Réservation de Salles

## ✅ Fonctionnalité Implémentée

Système complet de réservation de salles pour les enseignants avec gestion des conflits.

---

## 🏗️ Architecture Backend

### 1. Entity `Reservation` (Many-to-Many avec données supplémentaires)

```java
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User enseignant;           // Qui réserve
    
    @ManyToOne
    @JoinColumn(name = "salle_num")
    private Salle salle;               // Quelle salle
    
    private LocalDateTime dateDebut;   // Quand commence
    private LocalDateTime dateFin;     // Quand finit
    private String matiere;            // Quel cours (ex: "Mathématiques")
}
```

**Relation Many-to-Many avec attributs:**
- Un enseignant peut réserver plusieurs salles
- Une salle peut être réservée par plusieurs enseignants
- Chaque réservation contient: date début, date fin, matière

### 2. Repository `ReservationRepository`

```java
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Trouver les réservations d'un enseignant
    List<Reservation> findByEnseignant(User enseignant);
    
    // Vérifier les conflits (salle déjà réservée)
    @Query("SELECT r FROM Reservation r WHERE r.salle = :salle " +
           "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
    List<Reservation> findConflicts(...);
    
    // Réservations à venir
    List<Reservation> findUpcomingByEnseignant(...);
}
```

### 3. Controller `ReservationController`

```java
@RestController
@RequestMapping("/reservations")
public class ReservationController {
    
    @PostMapping                    // Créer une réservation
    @GetMapping("/mes-reservations") // Mes réservations
    @DeleteMapping("/{id}")          // Supprimer
}
```

### 4. DTOs (Java Records)

```java
// Requête pour créer une réservation
public record ReservationRequest(
    String salleNum,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere
) {}

// Réponse avec détails complets
public record ReservationResponse(
    Long id,
    String enseignantNom,
    String salleNum,
    String batimentCode,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere,
    int capacite
) {}
```

---

## 🎨 Frontend

### 1. Page `Lessons.jsx`

**Composants:**
- Liste des réservations (Cards)
- Bouton "Réserver une salle"
- Dialog de création avec formulaire
- Suppression de réservation

**Features:**
- ✅ Affichage des cours à venir
- ✅ Formulaire de réservation
- ✅ Gestion des erreurs (conflit, salle inexistante)
- ✅ Design Material-UI responsive

### 2. Navigation (Layout.jsx)

**Logique d'affichage:**
```javascript
// Cours visible pour USER et ADMIN (enseignants)
if (user?.role === 'USER' || user?.role === 'ADMIN') {
    navigationItems.push({
      title: 'Cours',
      path: '/lessons',
      icon: <SchoolIcon />,
    });
}
```

**Icône:** `SchoolIcon` (🎓)

### 3. API Service (api.js)

```javascript
// Créer une réservation
export const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

// Mes réservations
export const getMesReservations = async () => {
  const response = await api.get('/reservations/mes-reservations');
  return response.data;
};

// Supprimer
export const deleteReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};
```

---

## 📡 API Endpoints

### 1. Créer une réservation
```
POST /reservations
Authorization: Bearer <token>

Body:
{
  "salleNum": "36.01",
  "dateDebut": "2025-12-05T10:00:00",
  "dateFin": "2025-12-05T12:00:00",
  "matiere": "Mathématiques"
}

Response 200:
{
  "id": 1,
  "enseignantNom": "Jean Dupont",
  "salleNum": "36.01",
  "batimentCode": "TRI_36",
  "dateDebut": "2025-12-05T10:00:00",
  "dateFin": "2025-12-05T12:00:00",
  "matiere": "Mathématiques",
  "capacite": 150
}

Response 400 (Conflit):
"La salle est déjà réservée pour cette période"
```

### 2. Mes réservations
```
GET /reservations/mes-reservations
Authorization: Bearer <token>

Response 200:
[
  {
    "id": 1,
    "enseignantNom": "Jean Dupont",
    "salleNum": "36.01",
    ...
  }
]
```

### 3. Supprimer une réservation
```
DELETE /reservations/{id}
Authorization: Bearer <token>

Response 200:
"Réservation supprimée"

Response 403:
"Vous ne pouvez supprimer que vos propres réservations"
```

---

## 🔐 Sécurité

### 1. Authentification
- Tous les endpoints `/reservations` requièrent un token JWT
- Token vérifié automatiquement par Spring Security

### 2. Autorisation
- **Créer:** Tout utilisateur authentifié (enseignant)
- **Voir ses réservations:** Utilisateur peut voir uniquement ses propres réservations
- **Supprimer:** Utilisateur peut supprimer uniquement ses propres réservations

### 3. Validation
```java
// Vérifier que l'enseignant ne peut supprimer que ses réservations
if (!reservation.getEnseignant().getId().equals(enseignant.getId())) {
    return ResponseEntity.status(403).body("...");
}
```

---

## ⚠️ Gestion des Conflits

### Détection des conflits
```java
// Query pour trouver les réservations qui se chevauchent
@Query("SELECT r FROM Reservation r WHERE r.salle = :salle " +
       "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
List<Reservation> findConflicts(...);
```

### Logique de chevauchement
```
Réservation existante:  [====]
Nouvelle tentative:         [====]  ❌ Conflit!

Réservation existante:  [====]
Nouvelle tentative:              [====]  ✅ OK
```

---

## 🎯 Cas d'Usage

### Scénario 1: Enseignant réserve une salle

1. **Login** comme enseignant
2. **Naviguer** vers "Cours" dans le menu
3. **Cliquer** sur "Réserver une salle"
4. **Remplir** le formulaire:
   - Salle: `36.01`
   - Matière: `Mathématiques`
   - Date début: `2025-12-05 10:00`
   - Date fin: `2025-12-05 12:00`
5. **Soumettre** → Réservation créée!

### Scénario 2: Conflit de réservation

1. Enseignant A réserve salle `36.01` de 10h à 12h
2. Enseignant B essaie de réserver la même salle de 11h à 13h
3. ❌ **Erreur:** "La salle est déjà réservée pour cette période"

### Scénario 3: Annuler une réservation

1. **Voir** ses réservations sur la page "Cours"
2. **Cliquer** sur l'icône 🗑️ (poubelle)
3. **Confirmer** la suppression
4. ✅ Réservation supprimée

---

## 📊 Structure de la Base de Données

```sql
CREATE TABLE reservation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,              -- FK vers users
    salle_num VARCHAR(16) NOT NULL,    -- FK vers salle
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (salle_num) REFERENCES salle(numS)
);

-- Index pour performances
CREATE INDEX idx_reservation_user ON reservation(user_id);
CREATE INDEX idx_reservation_salle ON reservation(salle_num);
CREATE INDEX idx_reservation_dates ON reservation(date_debut, date_fin);
```

---

## 🎨 UI/UX Features

### 1. Page "Cours"
- **Header:** "Mes Cours" + Bouton "Réserver une salle"
- **Cards:** Affichage des réservations en grille
- **Responsive:** Desktop (2 colonnes), Mobile (1 colonne)

### 2. Card de Réservation
```
┌─────────────────────────────────┐
│ Mathématiques          [36.01]  │
├─────────────────────────────────┤
│ 📅 05/12/2025 10:00             │
│ 📅 Fin: 05/12/2025 12:00        │
│ 📍 Bâtiment: TRI_36             │
│ 📚 Capacité: 150 places         │
├─────────────────────────────────┤
│                            [🗑️]  │
└─────────────────────────────────┘
```

### 3. Dialog de Création
```
┌─────────────────────────────────┐
│ Réserver une salle              │
├─────────────────────────────────┤
│ Numéro de salle: [_________]    │
│ Matière:         [_________]    │
│ Date de début:   [_________]    │
│ Date de fin:     [_________]    │
├─────────────────────────────────┤
│            [Annuler] [Réserver] │
└─────────────────────────────────┘
```

---

## ✅ Checklist d'Implémentation

### Backend ✅
- [x] Entity `Reservation` avec relations ManyToOne
- [x] Repository avec query de détection de conflits
- [x] Controller avec CRUD complet
- [x] DTOs (Java Records) pour requête/réponse
- [x] Validation des conflits
- [x] Sécurité (JWT + vérification propriétaire)

### Frontend ✅
- [x] Page `Lessons.jsx` avec liste et formulaire
- [x] API service (`api.js`)
- [x] Navigation (visible pour enseignants uniquement)
- [x] Route dans `App.jsx`
- [x] Gestion des erreurs
- [x] Design Material-UI responsive

---

## 🧪 Tests Manuels

### Test 1: Créer une réservation
1. Login comme enseignant
2. Aller sur "Cours"
3. Cliquer "Réserver une salle"
4. Remplir et soumettre
5. ✅ Réservation apparaît dans la liste

### Test 2: Conflit de réservation
1. Créer réservation salle `36.01` 10h-12h
2. Essayer de créer salle `36.01` 11h-13h
3. ✅ Erreur affichée

### Test 3: Suppression
1. Cliquer sur 🗑️ sur une réservation
2. Confirmer
3. ✅ Réservation disparaît

### Test 4: Visibilité
1. Login comme ADMIN → Voir "Cours" ✅
2. Login comme USER → Voir "Cours" ✅
3. Aucun autre rôle ne devrait voir "Cours"

---

## 🚀 Améliorations Futures Possibles

- [ ] **Calendrier** - Vue calendrier des réservations
- [ ] **Récurrence** - Réserver tous les lundis 10h-12h
- [ ] **Notifications** - Email de rappel avant le cours
- [ ] **Recherche de salle** - Par capacité, équipement, bâtiment
- [ ] **Export** - Exporter planning en PDF/ICS
- [ ] **Stats** - Taux d'occupation des salles
- [ ] **Admin** - Vue globale de toutes les réservations

---

## 📝 Résumé

✅ **Backend:** Entity + Repository + Controller + DTOs  
✅ **Frontend:** Page + Formulaire + Navigation  
✅ **Sécurité:** JWT + Vérification propriétaire  
✅ **Conflits:** Détection automatique  
✅ **UI/UX:** Material-UI responsive  
✅ **Role:** Visible uniquement pour enseignants  

**Système complet et fonctionnel! 🎉**


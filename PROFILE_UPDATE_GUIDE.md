# 🔧 Guide: Mise à jour du profil utilisateur

## ⚠️ IMPORTANT: Première étape

### Pourquoi le nom n'apparaît pas?

Si vous avez **déjà un compte** créé **avant** l'ajout de la fonctionnalité de profil, votre ancien JWT token **ne contient pas** le champ `fullName`.

### 🔄 Solution: Déconnexion et reconnexion

**Vous DEVEZ vous déconnecter et vous reconnecter** pour obtenir un nouveau token JWT avec le champ `fullName`.

---

## 📝 Étapes pour tester

### 1. Vérifier le token actuel (Optionnel)

Ouvrez la console du navigateur (F12) et regardez les logs:

```javascript
🔍 Décoded JWT token: {
  sub: "email@example.com",
  roles: "ROLE_ENSEIGNANT",
  fullName: ???,  // Si undefined → il faut se reconnecter
  exp: 1234567890
}
```

### 2. Se déconnecter

```
Menu → Déconnexion
```

### 3. Se reconnecter

```
Page de connexion → Entrer email/password → Se connecter
```

### 4. Vérifier le nouveau token

Après reconnexion, ouvrez la console (F12):

```javascript
🔍 Décoded JWT token: {
  sub: "email@example.com",
  roles: "ROLE_ENSEIGNANT",
  fullName: "Jean Dupont",  // ✅ Maintenant c'est là!
  exp: 1234567890
}
```

---

## 🎯 Test de la modification du profil

### Étape 1: Ouvrir la page Profil

```
Menu → Profil utilisateur
```

Vous devriez voir:
- ✅ Avatar avec initiale
- ✅ Nom complet
- ✅ Email
- ✅ Rôle

### Étape 2: Cliquer sur "Modifier le profil"

Un dialog s'ouvre avec:
- **Nom complet** (modifiable)
- **Email** (non modifiable)
- **Rôle** (non modifiable)

### Étape 3: Changer le nom

```
Nom complet: Jean Dupont → Jean-Pierre Dupont
```

### Étape 4: Enregistrer

```
Bouton "Enregistrer" → Message "Profil mis à jour avec succès!"
```

### Étape 5: Vérifier

La page se rafraîchit automatiquement et vous voyez:
- ✅ Nouveau nom partout sur la page
- ✅ Avatar avec nouvelle initiale
- ✅ Nouveau token JWT dans localStorage

---

## 🐛 Dépannage

### Problème 1: Nom n'apparaît pas

**Symptôme:** Champs vides dans le profil

**Solution:**
1. Ouvrez la console (F12)
2. Regardez: `🔍 FullName из токена:`
3. Si `undefined` → **Déconnectez-vous et reconnectez-vous**

### Problème 2: Erreur CORS

**Symptôme:** 
```
XMLHttpRequest cannot load http://localhost:8888/...
```

**Solution:**
1. Vérifiez que le backend est lancé: `lsof -ti:8888`
2. Si pas de résultat → Lancez: `mvn spring-boot:run`

### Problème 3: Erreur 401/403

**Symptôme:** "Unauthorized" ou "Forbidden"

**Solution:**
1. Token expiré → **Reconnectez-vous**
2. Vérifiez dans console: `🔍 Token valide jusqu'au: [date]`

---

## 🔍 Debug: Console du navigateur

### Logs attendus lors de la connexion:

```javascript
🔍 Декодированный JWT токен: {
  sub: "jean@example.com",
  roles: "ROLE_ENSEIGNANT",
  fullName: "Jean Dupont",
  iat: 1733095200,
  exp: 1733181600
}
🔍 Роль извлеченная: ENSEIGNANT
🔍 FullName из токена: Jean Dupont
🔍 Все поля decoded: ["sub", "roles", "fullName", "iat", "exp"]
```

### Logs attendus lors de la mise à jour:

```javascript
// Avant l'envoi
Mise à jour du profil: { fullName: "Jean-Pierre Dupont" }

// Après la réponse
✅ Profil mis à jour
Nouveau token reçu: eyJhbGciOiJIUzI1NiIs...

// Redux update
Redux: login action dispatched with new token
```

---

## 📊 Structure des DTOs (Backend)

### UpdateProfileRequest
```java
public record UpdateProfileRequest(
    @NotBlank String fullName
) {}
```

### UserProfileResponse
```java
public record UserProfileResponse(
    Integer id,
    String email,
    String fullName,
    String role
) {}
```

### UpdateProfileResponse
```java
public record UpdateProfileResponse(
    String token,           // Nouveau JWT
    UserProfileResponse user // Données mises à jour
) {}
```

---

## 🔐 Sécurité

### ✅ Ce qui est protégé:

1. **Endpoint `/users/me`**
   - Requiert authentification (`@PreAuthorize("isAuthenticated()")`)
   - Retourne **uniquement** le profil de l'utilisateur connecté

2. **Email immuable**
   - L'email est l'identifiant unique
   - Impossible de le modifier

3. **Rôle immuable**
   - Le rôle est assigné par l'admin
   - L'utilisateur ne peut pas changer son propre rôle

### ✅ Ce qui peut être modifié:

- **fullName uniquement** ✅

---

## 🎯 Cas d'usage

### Cas 1: Enseignant change son nom

```
Jean Dupont → se marie → Jean-Pierre Martin
```

1. Profil → Modifier → `fullName: "Jean-Pierre Martin"`
2. Enregistrer → Nouveau token généré
3. Toutes les futures réservations afficheront le nouveau nom

### Cas 2: Correction d'une faute de frappe

```
Jea Dupont (faute) → Jean Dupont (correct)
```

1. Profil → Modifier → Corriger la faute
2. Enregistrer

---

## ✅ Checklist finale

Avant de valider que tout fonctionne:

- [ ] Backend lancé sur port 8888
- [ ] Frontend lancé sur port 5173
- [ ] Déconnecté et reconnecté pour obtenir nouveau token
- [ ] Console (F12) affiche `fullName` dans le token
- [ ] Page Profil affiche le nom complet
- [ ] Modification du nom fonctionne
- [ ] Message de succès apparaît
- [ ] Page se rafraîchit avec nouveau nom
- [ ] Nouveau token stocké dans localStorage

---

**Si tous les points sont validés: 🎉 TOUT FONCTIONNE!**


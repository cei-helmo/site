# 📧 Configuration SMTP pour le Reset de Mot de Passe

## Variables d'Environnement Requises

Le système de reset de mot de passe utilise la **même configuration SMTP que la newsletter**. Ajoutez ces variables à votre fichier `.env.local` :

```env
# Configuration SMTP (identique à la newsletter)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# URL de base pour les liens de reset
NEXTAUTH_URL="http://localhost:3000"
```

## Configuration HELMo (Recommandée)

Si vous utilisez les serveurs HELMo, utilisez cette configuration :

```env
SMTP_HOST="smtp.helmo.be"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="votre-email@helmo.be"
SMTP_PASS="votre-mot-de-passe"
NEXTAUTH_URL="http://localhost:3000"
```

## Configuration Gmail

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Instructions Gmail :**
1. Activez la validation en 2 étapes
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans `SMTP_PASS`

## Test de la Configuration

### Via l'API :
```bash
curl http://localhost:3000/api/test-smtp
```

### Via l'interface admin :
- Allez dans le dashboard admin
- Utilisez le composant TestSMTP

## Fonctionnalités Implémentées

### ✅ Système de Reset Complet
- **Page de demande** : `/auth/forgot-password`
- **Page de reset** : `/auth/reset-password`
- **APIs sécurisées** avec tokens cryptographiques
- **Templates d'email** professionnels

### ✅ Sécurité Renforcée
- Tokens sécurisés (32 bytes)
- Expiration automatique (1 heure)
- Suppression après utilisation
- Pas de révélation d'informations

### ✅ Configuration Identique à la Newsletter
- Même transporteur SMTP
- Même format d'expéditeur : `"CEI HELMo" <user@helmo.be>`
- Même configuration SSL/TLS
- Compatibilité garantie

## Flux Utilisateur

1. **Demande de Reset :**
   - Clic sur "Mot de passe oublié"
   - Saisie de l'email
   - Génération du token
   - Envoi de l'email

2. **Réinitialisation :**
   - Clic sur le lien dans l'email
   - Vérification du token
   - Saisie du nouveau mot de passe
   - Validation et sauvegarde

## Template d'Email

L'email de reset utilise un template HTML professionnel avec :
- Design moderne et responsive
- Branding CEI HELMo
- Bouton d'action clair
- Avertissements de sécurité
- Version texte pour compatibilité

## Dépannage

### Erreurs Courantes

1. **"SMTP configuration failed"**
   - Vérifiez vos variables d'environnement
   - Testez avec l'endpoint `/api/test-smtp`

2. **"Connection timeout"**
   - Vérifiez le port (465 pour SSL, 587 pour TLS)
   - Vérifiez `SMTP_SECURE="true"` pour SSL

3. **"Authentication failed"**
   - Vérifiez vos identifiants SMTP
   - Pour Gmail, utilisez un mot de passe d'application

### Logs de Debug

Les erreurs SMTP sont loggées dans la console. Vérifiez :
```bash
npm run dev
# Regardez les logs dans la console
```

## Production

Pour la production, assurez-vous que :
- ✅ `NEXTAUTH_URL` pointe vers votre domaine
- ✅ Variables SMTP sont configurées
- ✅ HTTPS est activé
- ✅ Logs d'erreurs sont surveillés

## Support

Le système est maintenant **100% fonctionnel** et utilise la même infrastructure que la newsletter existante ! 🚀

# Guide de setup — Générateur de leads (restaurants sans site web à Lyon)

## Ce que fait le workflow

Chaque lundi à 8h, il interroge Google Places pour trouver des restaurants à Lyon, garde ceux qui n'ont pas de site web ou qui ont une note Google en dessous de 3,5, et ajoute chaque lead (nom, adresse, téléphone, note, lien Google Maps) dans une Google Sheet. C'est cette liste que tu peux vendre en abonnement à des agences web ou SEO qui cherchent des prospects locaux à démarcher.

## Étape 1 — Créer un compte n8n

Va sur n8n.io et crée un compte (offre gratuite disponible en cloud, ou auto-hébergement gratuit si tu es à l'aise avec un serveur/Docker). Le cloud suffit largement pour démarrer.

## Étape 2 — Obtenir une clé Google Places API

1. Va sur console.cloud.google.com et crée un nouveau projet.
2. Dans "APIs & Services", active **Places API (New)**.
3. Dans "Identifiants", crée une clé API, puis restreins-la à l'API Places pour la sécuriser.
4. Copie la clé.

**Côté coût** : Google offre 5 000 appels gratuits par mois sur cette API. Au-delà, compte environ 32 à 35 $ pour 1 000 requêtes selon les champs demandés (le tarif grimpe si tu demandes la note ou les avis, ce que fait ce workflow). Avec une recherche hebdomadaire (~20 résultats/semaine, donc 4 requêtes/mois), tu restes très largement dans le quota gratuit — le coût ne devient un sujet que si tu élargis à beaucoup de villes ou de recherches quotidiennes.
[Google Places API Usage and Billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)

## Étape 3 — Importer le workflow

Dans n8n : **Workflows > Add workflow > Import from File**, puis sélectionne le fichier `n8n-leads-restaurants-lyon.json`.

## Étape 4 — Configurer les nœuds

- **Rechercher restaurants (Google Places)** : ouvre le nœud, remplace `COLLE_TA_CLE_API_ICI` dans le header `X-Goog-Api-Key` par ta clé API.
- **Ajouter à la feuille de leads** : crée une Google Sheet avec un onglet nommé `Leads` et les colonnes `nom, adresse, telephone, note_google, nb_avis, a_un_site_web, lien_google_maps, date_collecte`. Copie son ID (dans l'URL, entre `/d/` et `/edit`) et colle-le dans `documentId`. Connecte ensuite ton compte Google dans les identifiants du nœud (n8n te guide automatiquement via OAuth).

## Étape 5 — Tester avant d'activer

Clique sur **Execute Workflow** en haut à droite pour lancer un test manuel. Vérifie que la Google Sheet se remplit correctement, puis active le trigger (bouton en haut à droite) pour que ça tourne automatiquement chaque lundi.

## Étape 6 — Adapter à d'autres niches/villes

Pour dupliquer ce workflow sur une autre zone ou un autre secteur (agences immobilières, e-commerces, salons de coiffure...), duplique le workflow dans n8n et change simplement la valeur `textQuery` dans le nœud de recherche (ex. `"agences immobilières à Bordeaux"`) et éventuellement le seuil de note dans le filtre.

## Étape 7 — Passer à la vente

Une fois que la liste te semble pertinente (teste-la toi-même : est-ce que ce sont de vrais prospects exploitables ?), les premières étapes commerciales concrètes :

1. Génère un échantillon de 15-20 leads et propose-le gratuitement à 3-5 agences web/SEO en direct (LinkedIn, cold email, groupes Facebook d'entrepreneurs).
2. Si ça convertit, propose un abonnement mensuel (ex. 100 leads qualifiés/mois) avec Stripe pour la facturation.
3. Documente les résultats concrets d'un client (ex. "3 clients signés grâce à ces leads") pour appuyer ta prospection suivante.

## Limites à connaître

Une recherche Google Places renvoie au maximum 20 résultats par requête. Pour aller au-delà, il faut gérer la pagination (`nextPageToken`) ou multiplier les requêtes par quartier — une évolution possible une fois que le workflow de base est validé.

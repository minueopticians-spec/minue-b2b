'use client';
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

/* ═══ COLORS & FONTS ═══ */
const CL = {dk:"#18332f",bg:"#f8efe6",bg2:"#f0e5d8",gr:"#6b7f7a",gr2:"#96a5a1",ln:"#d4cdc4",gn:"#2d6b4f",yl:"#b8860b",rd:"#a33030",bl:"#1a5276",wh:"#ffffff"};
const CD = {dk:"#e8dfd6",bg:"#1a1f1e",bg2:"#242a28",gr:"#8a9b96",gr2:"#6b7f7a",ln:"#2e3835",gn:"#4a9e75",yl:"#d4a017",rd:"#cf5050",bl:"#3a8cc2",wh:"#212826"};
let C = CL;
const DP = "'Cormorant Garamond',Georgia,serif";
const BD = "'DM Sans',system-ui,sans-serif";
const LOGO = "data:image/jpeg;base64,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";
const fmt = n => n.toFixed(2).replace(".",",");
const hashPw = async (plain, email) => { const data = new TextEncoder().encode("minue_" + (email||"").toLowerCase().trim() + "_" + plain); const buf = await crypto.subtle.digest("SHA-256", data); return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join(""); };

/* ═══ i18n DICTIONARY ═══ */
const T = {
  connexion:{fr:"Connexion",es:"Conexión",en:"Login"},
  sortir:{fr:"Sortir",es:"Salir",en:"Logout"},
  prototype:{fr:"Prototype interactif",es:"Prototipo interactivo",en:"Interactive prototype"},
  admin:{fr:"Admin",es:"Admin",en:"Admin"},
  distributeur:{fr:"Distributeur",es:"Distribuidor",en:"Distributor"},
  client:{fr:"Client",es:"Cliente",en:"Client"},
  catalogue:{fr:"Catalogue",es:"Catálogo",en:"Catalog"},
  panier:{fr:"Panier",es:"Carrito",en:"Cart"},
  commandes:{fr:"Commandes",es:"Pedidos",en:"Orders"},
  tarifs:{fr:"Tarifs",es:"Tarifas",en:"Pricing"},
  ressources:{fr:"Ressources",es:"Recursos",en:"Resources"},
  dashboard:{fr:"Dashboard",es:"Dashboard",en:"Dashboard"},
  clients:{fr:"Clients",es:"Clientes",en:"Clients"},
  promos:{fr:"Promos",es:"Promos",en:"Promos"},
  stock:{fr:"Stock",es:"Stock",en:"Stock"},
  factures:{fr:"Factures",es:"Facturas",en:"Invoices"},
  stats:{fr:"Stats",es:"Stats",en:"Stats"},
  collSS26:{fr:"Collection SS26",es:"Colección SS26",en:"SS26 Collection"},
  collSub:{fr:"Prix wholesale HT",es:"Precio wholesale sin IVA",en:"Wholesale price excl. VAT"},
  rechercher:{fr:"Rechercher...",es:"Buscar...",en:"Search..."},
  ajouter:{fr:"Ajouter",es:"Añadir",en:"Add"},
  ajouterPanier:{fr:"Ajouter au panier",es:"Añadir al carrito",en:"Add to cart"},
  enPanier:{fr:"en panier",es:"en carrito",en:"in cart"},
  panierVide:{fr:"Votre panier est vide",es:"Tu carrito está vacío",en:"Your cart is empty"},
  voirCat:{fr:"Voir le catalogue",es:"Ver catálogo",en:"View catalog"},
  cmdPour:{fr:"Commander pour :",es:"Pedir para:",en:"Order for:"},
  choisir:{fr:"— Choisir —",es:"— Elegir —",en:"— Select —"},
  totalHT:{fr:"Total HT",es:"Total sin IVA",en:"Total excl. VAT"},
  unites:{fr:"unités",es:"unidades",en:"units"},
  commEst:{fr:"Commission estimée",es:"Comisión estimada",en:"Estimated commission"},
  passerCmd:{fr:"Passer commande",es:"Realizar pedido",en:"Place order"},
  cmdEnvoyee:{fr:"Commande envoyée",es:"Pedido enviado",en:"Order submitted"},
  tarifActuel:{fr:"Tarif actuel",es:"Tarifa actual",en:"Current tier"},
  prochain:{fr:"Prochain",es:"Siguiente",en:"Next"},
  economisez:{fr:"vous économisez",es:"ahorras",en:"you save"},
  meilleurTarif:{fr:"Meilleur tarif ✓",es:"Mejor tarifa ✓",en:"Best tier ✓"},
  paiementUnique:{fr:"Paiement unique",es:"Pago único",en:"Single payment"},
  deuxPaiements30:{fr:"2 paiements (30j)",es:"2 pagos (30d)",en:"2 payments (30d)"},
  deuxPaiements1545:{fr:"2 paiements (15+45j)",es:"2 pagos (15+45d)",en:"2 payments (15+45d)"},
  dePago:{fr:"Payant",es:"De pago",en:"Paid shipping"},
  gratuit:{fr:"Gratuit",es:"Gratuito",en:"Free"},
  expOpt:{fr:"8,90 € (opt.)",es:"8,90 € (opc.)",en:"8.90 € (opt.)"},
  exp2:{fr:"2 expos. gratuits",es:"2 expos. gratis",en:"2 free displays"},
  exp3:{fr:"3 expos. gratuits",es:"3 expos. gratis",en:"3 free displays"},
  paiement:{fr:"Paiement",es:"Pago",en:"Payment"},
  envoi:{fr:"Envoi",es:"Envío",en:"Shipping"},
  expositor:{fr:"Expositor",es:"Expositor",en:"Display"},
  parUnite:{fr:"par unité HT",es:"por unidad",en:"per unit"},
  contactAgent:{fr:"Contactez votre agent Minuë",es:"Contacte con su agente Minuë",en:"Contact your Minuë agent"},
  prontoPago:{fr:"Pronto pago −3%",es:"Pronto pago −3%",en:"Early payment −3%"},
  prontoDesc:{fr:"Réduction si paiement anticipé",es:"Descuento por pago anticipado",en:"Discount for early payment"},
  tarifVolume:{fr:"Tarifs par volume",es:"Tarifas por volumen",en:"Volume pricing"},
  tarifVolSub:{fr:"Prix dégressifs · PVP 50-55 € · Envoi gratuit dès 20 uds",es:"Precios por volumen · PVP 50-55 € · Envío gratis desde 20 uds",en:"Volume pricing · RRP 50-55 € · Free shipping from 20 units"},
  votreTarif:{fr:"Votre tarif",es:"Tu tarifa",en:"Your tier"},
  mesCmd:{fr:"Mes commandes",es:"Mis pedidos",en:"My orders"},
  aucuneCmd:{fr:"Aucune commande",es:"Sin pedidos",en:"No orders"},
  nouvelleCmd:{fr:"+ Nouvelle commande",es:"+ Nuevo pedido",en:"+ New order"},
  creerCmd:{fr:"Créer la commande",es:"Crear pedido",en:"Create order"},
  modifierCmd:{fr:"Modifier la commande",es:"Modificar pedido",en:"Edit order"},
  detailArt:{fr:"DÉTAIL DES ARTICLES",es:"DETALLE DE ARTÍCULOS",en:"LINE ITEMS"},
  articles:{fr:"ARTICLES",es:"ARTÍCULOS",en:"ITEMS"},
  modeles:{fr:"modèles",es:"modelos",en:"models"},
  tarifApplique:{fr:"Tarif appliqué",es:"Tarifa aplicada",en:"Applied tier"},
  prixPerso:{fr:"Prix personnalisé",es:"Precio personalizado",en:"Custom price"},
  enregistrer:{fr:"Enregistrer",es:"Guardar",en:"Save"},
  confirme:{fr:"Confirmé",es:"Confirmado",en:"Confirmed"},
  expedie:{fr:"Expédié",es:"Enviado",en:"Shipped"},
  partiel:{fr:"Partiel",es:"Parcial",en:"Partial"},
  livre:{fr:"Livré",es:"Entregado",en:"Delivered"},
  enAttente:{fr:"En attente",es:"Pendiente",en:"Pending"},
  enPrepa:{fr:"En prépa.",es:"En prep.",en:"Preparing"},
  facture:{fr:"Facturé",es:"Facturado",en:"Invoiced"},
  paye:{fr:"Payé",es:"Pagado",en:"Paid"},
  statutCmd:{fr:"Statut commande",es:"Estado pedido",en:"Order status"},
  statutPay:{fr:"Statut paiement",es:"Estado pago",en:"Payment status"},
  tracking:{fr:"N° de suivi",es:"N° seguimiento",en:"Tracking"},
  notesInt:{fr:"Notes internes",es:"Notas internas",en:"Notes"},
  canal:{fr:"Canal",es:"Canal",en:"Channel"},
  nouveau:{fr:"+ Nouveau",es:"+ Nuevo",en:"+ New"},
  nouveauClient:{fr:"Nouveau client",es:"Nuevo cliente",en:"New client"},
  boutique:{fr:"Boutique",es:"Tienda",en:"Store"},
  contact:{fr:"Contact",es:"Contacto",en:"Contact"},
  ville:{fr:"Ville",es:"Ciudad",en:"City"},
  pays:{fr:"Pays",es:"País",en:"Country"},
  prospect:{fr:"Prospect",es:"Prospecto",en:"Prospect"},
  actif:{fr:"Actif",es:"Activo",en:"Active"},
  condComm:{fr:"Conditions commerciales",es:"Condiciones comerciales",en:"Commercial terms"},
  tarifAuto:{fr:"Tarif auto (volume)",es:"Tarifa auto (volumen)",en:"Auto tier (volume)"},
  prixFixe:{fr:"Prix fixe personnalisé",es:"Precio fijo personalizado",en:"Custom fixed price"},
  prixUnit:{fr:"Prix unitaire fixe (€)",es:"Precio unitario fijo (€)",en:"Fixed unit price (€)"},
  prixAutoDesc:{fr:"Calculé selon le volume",es:"Calculado según volumen",en:"Calculated by volume"},
  prixFixeDesc:{fr:"S'applique à toutes ses commandes",es:"Se aplica a todos sus pedidos",en:"Applies to all orders"},
  enregistrerCond:{fr:"Enregistrer",es:"Guardar",en:"Save"},
  notesComm:{fr:"Notes commerciales",es:"Notas comerciales",en:"Commercial notes"},
  ventesTot:{fr:"Ventes totales",es:"Ventas totales",en:"Total sales"},
  commTot:{fr:"Commission totale",es:"Comisión total",en:"Total commission"},
  percue:{fr:"Perçue",es:"Cobrada",en:"Collected"},
  aPercevoir:{fr:"À percevoir",es:"Pendiente",en:"Pending"},
  dernieresCmd:{fr:"Dernières commandes",es:"Últimos pedidos",en:"Recent orders"},
  mesClients:{fr:"Mes clients",es:"Mis clientes",en:"My clients"},
  stockBas:{fr:"Stock bas",es:"Stock bajo",en:"Low stock"},
  promosActives:{fr:"Promotions",es:"Promociones",en:"Promotions"},
  promosSub:{fr:"Offres actives",es:"Ofertas activas",en:"Active offers"},
  active:{fr:"Active",es:"Activa",en:"Active"},
  inactive:{fr:"Inactive",es:"Inactiva",en:"Inactive"},
  tableauBord:{fr:"Tableau de bord",es:"Panel de control",en:"Dashboard"},
  ca:{fr:"CA",es:"Facturación",en:"Revenue"},
  canaux:{fr:"Canaux",es:"Canales",en:"Channels"},
  prixCustom:{fr:"Prix custom",es:"Precio custom",en:"Custom pricing"},
  tousStandard:{fr:"Tous au tarif standard",es:"Todos en tarifa estándar",en:"All standard"},
  gestionStock:{fr:"Gestion du stock",es:"Gestión de stock",en:"Stock management"},
  nouveauProduit:{fr:"+ Produit",es:"+ Producto",en:"+ Product"},
  editer:{fr:"Éditer",es:"Editar",en:"Edit"},
  editerStock:{fr:"Éditer le stock",es:"Editar stock",en:"Edit stock"},
  stockActuel:{fr:"Stock actuel",es:"Stock actual",en:"Current stock"},
  nouveauStock:{fr:"Nouveau stock",es:"Nuevo stock",en:"New stock"},
  mettreAJour:{fr:"Mettre à jour",es:"Actualizar",en:"Update"},
  ajouterCat:{fr:"Ajouter",es:"Añadir",en:"Add"},
  modele:{fr:"Modèle",es:"Modelo",en:"Model"},
  couleur:{fr:"Couleur",es:"Color",en:"Color"},
  categorie:{fr:"Catégorie",es:"Categoría",en:"Category"},
  stockInit:{fr:"Stock initial",es:"Stock inicial",en:"Initial stock"},
  nouvFacture:{fr:"+ Facture",es:"+ Factura",en:"+ Invoice"},
  genererPDF:{fr:"PDF",es:"PDF",en:"PDF"},
  resVisuelles:{fr:"Ressources visuelles",es:"Recursos visuales",en:"Visual resources"},
  resSub:{fr:"Photos et assets pour votre boutique",es:"Fotos y assets para tu tienda",en:"Photos and assets for your store"},
  telecharger:{fr:"Télécharger",es:"Descargar",en:"Download"},
  commission:{fr:"Commission",es:"Comisión",en:"Commission"},
  choisirClient:{fr:"— Choisir un client —",es:"— Elegir cliente —",en:"— Select client —"},
  email:{fr:"Email",es:"Email",en:"Email"},
  motDePasse:{fr:"Mot de passe",es:"Contraseña",en:"Password"},
  errLogin:{fr:"Email ou mot de passe incorrect",es:"Email o contraseña incorrectos",en:"Incorrect email or password"},
  accesDemo:{fr:"Comptes de démo",es:"Cuentas de demo",en:"Demo accounts"},
  utilisateurs:{fr:"Utilisateurs",es:"Usuarios",en:"Users"},
  gestionUsers:{fr:"Gestion des utilisateurs",es:"Gestión de usuarios",en:"User management"},
  nouvelUser:{fr:"+ Utilisateur",es:"+ Usuario",en:"+ User"},
  nouveauUser:{fr:"Nouvel utilisateur",es:"Nuevo usuario",en:"New user"},
  editUser:{fr:"Modifier l'utilisateur",es:"Editar usuario",en:"Edit user"},
  roleLabel:{fr:"Rôle",es:"Rol",en:"Role"},
  emailLabel:{fr:"Email",es:"Email",en:"Email"},
  pwLabel:{fr:"Mot de passe",es:"Contraseña",en:"Password"},
  entreprise:{fr:"Entreprise",es:"Empresa",en:"Company"},
  commissionRate:{fr:"Commission %",es:"Comisión %",en:"Commission %"},
  langue:{fr:"Langue",es:"Idioma",en:"Language"},
  desactiver:{fr:"Désactiver",es:"Desactivar",en:"Disable"},
  userActif:{fr:"Actif",es:"Activo",en:"Active"},
  userInactif:{fr:"Désactivé",es:"Desactivado",en:"Disabled"},
  gestionPromos:{fr:"Gestion des promos",es:"Gestión de promos",en:"Promo management"},
  nouvellePromo:{fr:"+ Promo",es:"+ Promo",en:"+ Promo"},
  nouveauPromo:{fr:"Nouvelle promotion",es:"Nueva promoción",en:"New promotion"},
  editPromo:{fr:"Modifier la promo",es:"Editar promo",en:"Edit promo"},
  nomPromo:{fr:"Nom",es:"Nombre",en:"Name"},
  typePromo:{fr:"Type",es:"Tipo",en:"Type"},
  reduction:{fr:"Réduction %",es:"Descuento %",en:"Discount %"},
  conditionFr:{fr:"Condition (FR)",es:"Condición (FR)",en:"Condition (FR)"},
  conditionEs:{fr:"Condition (ES)",es:"Condición (ES)",en:"Condition (ES)"},
  conditionEn:{fr:"Condition (EN)",es:"Condición (EN)",en:"Condition (EN)"},
  visiblePour:{fr:"Visible pour",es:"Visible para",en:"Visible to"},
  percent:{fr:"Pourcentage",es:"Porcentaje",en:"Percentage"},
  cadeau:{fr:"Cadeau",es:"Regalo",en:"Gift"},
  promosClient:{fr:"Promotions en cours",es:"Promociones activas",en:"Current promotions"},
  monCompte:{fr:"Mon compte",es:"Mi cuenta",en:"My account"},
  donneesEntreprise:{fr:"Données entreprise",es:"Datos empresa",en:"Company details"},
  raisonSociale:{fr:"Raison sociale",es:"Razón social",en:"Company name"},
  nif:{fr:"NIF / TVA",es:"NIF / CIF",en:"Tax ID"},
  adresse:{fr:"Adresse",es:"Dirección",en:"Address"},
  codePostal:{fr:"Code postal",es:"Código postal",en:"Postal code"},
  telephone:{fr:"Téléphone",es:"Teléfono",en:"Phone"},
  donneesBancaires:{fr:"Données bancaires",es:"Datos bancarios",en:"Banking details"},
  iban:{fr:"IBAN",es:"IBAN",en:"IBAN"},
  bic:{fr:"BIC / SWIFT",es:"BIC / SWIFT",en:"BIC / SWIFT"},
  titulaire:{fr:"Titulaire du compte",es:"Titular de la cuenta",en:"Account holder"},
  sauvegarder:{fr:"Sauvegarder",es:"Guardar",en:"Save"},
  donneesSauvees:{fr:"Données sauvegardées",es:"Datos guardados",en:"Data saved"},
  nouveautes:{fr:"Nouveautés",es:"Novedades",en:"What's new"},
  nouveautesSub:{fr:"Recommandations et actualités",es:"Recomendaciones y novedades",en:"Recommendations and news"},
  gestionNouveautes:{fr:"Gestion des nouveautés",es:"Gestión de novedades",en:"News management"},
  nouvelleNouveaute:{fr:"+ Nouveauté",es:"+ Novedad",en:"+ News"},
  titreNouveaute:{fr:"Titre",es:"Título",en:"Title"},
  contenu:{fr:"Contenu",es:"Contenido",en:"Content"},
  datePublication:{fr:"Date",es:"Fecha",en:"Date"},
  epingle:{fr:"Épinglé",es:"Fijado",en:"Pinned"},
  topVenta:{fr:"Top vente",es:"Top venta",en:"Best seller"},
  nuevo:{fr:"Nouveau",es:"Nuevo",en:"New"},
  recomendado:{fr:"Recommandé",es:"Recomendado",en:"Recommended"},
  etiquetas:{fr:"Étiquettes",es:"Etiquetas",en:"Tags"},
  notesClient:{fr:"Note pour le client",es:"Nota para el cliente",en:"Note for customer"},
  noteDuCmd:{fr:"Note de Minuë",es:"Nota de Minuë",en:"Note from Minuë"},
  lienUrl:{fr:"Lien (URL)",es:"Enlace (URL)",en:"Link (URL)"},
  voirPlus:{fr:"Voir plus",es:"Ver más",en:"Read more"},
  factureDetail:{fr:"Détail facture",es:"Detalle factura",en:"Invoice detail"},
  sousTotal:{fr:"Sous-total",es:"Subtotal",en:"Subtotal"},
  tva:{fr:"TVA 21%",es:"IVA 21%",en:"VAT 21%"},
  totalTTC:{fr:"Total TTC",es:"Total con IVA",en:"Total incl. VAT"},
  factureNum:{fr:"Facture",es:"Factura",en:"Invoice"},
  emetteur:{fr:"Émetteur",es:"Emisor",en:"From"},
  destinataire:{fr:"Destinataire",es:"Destinatario",en:"To"},
  aide:{fr:"Aide",es:"Ayuda",en:"Help"},
  faq:{fr:"Questions fréquentes",es:"Preguntas frecuentes",en:"FAQ"},
  faqSub:{fr:"Trouvez votre réponse",es:"Encuentra tu respuesta",en:"Find your answer"},
  nouvelleFaq:{fr:"+ Question",es:"+ Pregunta",en:"+ Question"},
  questionLabel:{fr:"Question",es:"Pregunta",en:"Question"},
  reponseLabel:{fr:"Réponse",es:"Respuesta",en:"Answer"},
  detailCmd:{fr:"Détail de la commande",es:"Detalle del pedido",en:"Order detail"},
  artSupprime:{fr:"retiré (rupture de stock)",es:"retirado (rotura de stock)",en:"removed (out of stock)"},
  supprimerLigne:{fr:"Retirer",es:"Retirar",en:"Remove"},
  fraisEnvoi:{fr:"Frais d'envoi",es:"Gastos de envío",en:"Shipping cost"},
  envoiInclus:{fr:"Envoi inclus",es:"Envío incluido",en:"Shipping included"},
  resPhotos:{fr:"Photos produit HD",es:"Fotos producto HD",en:"Product photos HD"},
  resLifestyle:{fr:"Photos lifestyle",es:"Fotos lifestyle",en:"Lifestyle photos"},
  resLogos:{fr:"Logos Minuë",es:"Logos Minuë",en:"Minuë logos"},
  resTextes:{fr:"Textes commerciaux",es:"Textos comerciales",en:"Commercial texts"},
  resCatalogue:{fr:"Catalogue PDF SS26",es:"Catálogo PDF SS26",en:"SS26 PDF Catalog"},
  resGuide:{fr:"Guide de vente",es:"Guía de venta",en:"Sales guide"},
  acceder:{fr:"Accéder",es:"Acceder",en:"Access"},
  transporteur:{fr:"Transporteur",es:"Transportista",en:"Carrier"},
  urlSuivi:{fr:"URL de suivi",es:"URL de seguimiento",en:"Tracking URL"},
  suivreColis:{fr:"Suivre le colis",es:"Seguir envío",en:"Track shipment"},
  astucePrix:{fr:"Plus vous commandez, moins cher le prix unitaire ! Consultez Tarifs pour voir les paliers.",es:"¡Cuantas más unidades, menor el precio! Consulta Tarifas para ver los tramos.",en:"The more you order, the lower the unit price! Check Pricing for volume tiers."},
  prixFixeClient:{fr:"Prix négocié",es:"Precio negociado",en:"Negotiated price"},
  eliminarCmd:{fr:"Supprimer la commande",es:"Eliminar pedido",en:"Delete order"},
  eliminar:{fr:"Supprimer",es:"Eliminar",en:"Delete"},
  eliminarTarea:{fr:"Supprimer la tâche",es:"Eliminar tarea",en:"Delete task"},
  telephone:{fr:"Téléphone",es:"Teléfono",en:"Phone"},
  ville:{fr:"Ville",es:"Ciudad",en:"City"},
  pays:{fr:"Pays",es:"País",en:"Country"},
  notesUser:{fr:"Notes internes",es:"Notas internas",en:"Internal notes"},
  panierMoyen:{fr:"Panier moyen",es:"Ticket medio",en:"Avg. order"},
  voirTout:{fr:"Voir tout",es:"Ver todo",en:"See all"},
  stockBajo:{fr:"Stock faible",es:"Stock bajo",en:"Low stock"},
  accueil:{fr:"Accueil",es:"Inicio",en:"Home"},
  bienvenida:{fr:"Bonjour",es:"Hola",en:"Hello"},
  bienvenidaSub:{fr:"Ravie de vous revoir. Voici les dernières nouveautés pour vous.",es:"Encantados de verte. Aquí tienes lo último para ti.",en:"Great to see you. Here's what's new for you."},
  descubrirCol:{fr:"Découvrir la collection",es:"Descubrir la colección",en:"Discover the collection"},
  recoPour:{fr:"Sélection pour vous",es:"Seleccionados para ti",en:"Selected for you"},
  dernieresNouv:{fr:"Actualités",es:"Novedades",en:"What's new"},
  promosActives:{fr:"Offres en cours",es:"Ofertas activas",en:"Active offers"},
  solliciterAcces:{fr:"Nouveau client ? Demander l'accès",es:"¿Nuevo cliente? Solicitar acceso",en:"New client? Request access"},
  retourLogin:{fr:"← Retour à la connexion",es:"← Volver al inicio de sesión",en:"← Back to login"},
  envoyerDemande:{fr:"Envoyer la demande",es:"Enviar solicitud",en:"Submit request"},
  demandeEnvoyee:{fr:"Demande envoyée ! Nous vous contacterons quand votre compte sera activé.",es:"¡Solicitud enviada! Te contactaremos cuando tu cuenta esté activada.",en:"Request sent! We'll contact you when your account is activated."},
  pwNoMatch:{fr:"Les mots de passe ne correspondent pas",es:"Las contraseñas no coinciden",en:"Passwords don't match"},
  confirmerPw:{fr:"Confirmer mot de passe",es:"Confirmar contraseña",en:"Confirm password"},
  pendientes:{fr:"En attente",es:"Pendientes",en:"Pending"},
  solicitudes:{fr:"demandes d'accès",es:"solicitudes de acceso",en:"access requests"},
  activerCompte:{fr:"Activer le compte",es:"Activar cuenta",en:"Activate account"},
  monProfil:{fr:"Mon profil",es:"Mi perfil",en:"My profile"},
  fermer:{fr:"Fermer",es:"Cerrar",en:"Close"},
  topVentas:{fr:"Meilleures ventes",es:"Top ventas",en:"Top sales"},
  clientsPays:{fr:"Clients par pays",es:"Clientes por país",en:"Clients by country"},
  codePostal:{fr:"Code postal",es:"Código postal",en:"Postal code"},
  rechercherClient:{fr:"Rechercher client...",es:"Buscar cliente...",en:"Search client..."},
  echeance:{fr:"Échéance",es:"Vencimiento",en:"Due date"},
  assignee:{fr:"Assigné à",es:"Asignado a",en:"Assigned to"},
  enRetard:{fr:"En retard",es:"Atrasada",en:"Overdue"},
  sansEcheance:{fr:"Sans échéance",es:"Sin vencimiento",en:"No due date"},
  deconnexion:{fr:"Déconnexion",es:"Cerrar sesión",en:"Log out"},
  filtrerStatus:{fr:"État",es:"Estado",en:"Status"},
  filtrerPay:{fr:"Paiement",es:"Pago",en:"Payment"},
  rechercherProd:{fr:"Rechercher produit...",es:"Buscar producto...",en:"Search product..."},
  agotado:{fr:"Rupture",es:"Agotado",en:"Out of stock"},
  alerteStock:{fr:"Alerte stock",es:"Alerta stock",en:"Stock alert"},
  notifTitre:{fr:"Mises à jour",es:"Novedades de pedidos",en:"Order updates"},
  notifStatus:{fr:"Votre commande %s est passée à",es:"Tu pedido %s ha cambiado a",en:"Your order %s changed to"},
  datosPersonales:{fr:"Données personnelles",es:"Datos personales",en:"Personal info"},
  dirEnvio:{fr:"Adresse de livraison",es:"Dirección de envío",en:"Shipping address"},
  dirFacturacion:{fr:"Données de facturation",es:"Datos de facturación",en:"Billing info"},
  direccion:{fr:"Adresse",es:"Dirección",en:"Address"},
  fichaCliente:{fr:"Fiche client",es:"Ficha del cliente",en:"Client file"},
  condiciones:{fr:"Conditions commerciales",es:"Condiciones comerciales",en:"Commercial terms"},
  notesCmd:{fr:"Notes pour cette commande",es:"Notas para este pedido",en:"Notes for this order"},
  notesPlaceholder:{fr:"Instructions spéciales, adresse alternative...",es:"Instrucciones especiales, dirección alternativa...",en:"Special instructions, alternative address..."},
  dirEnvioClient:{fr:"Adresse de livraison du client",es:"Dirección de envío del cliente",en:"Client shipping address"},
  utiliserAdresse:{fr:"Utiliser l'adresse du client",es:"Usar dirección del cliente",en:"Use client address"},
  resumeClient:{fr:"Résumé",es:"Resumen",en:"Summary"},
  totalDepense:{fr:"Total commandé",es:"Total pedido",en:"Total ordered"},
  nbCommandes:{fr:"Commandes",es:"Pedidos",en:"Orders"},
  dernierCmd:{fr:"Dernière commande",es:"Último pedido",en:"Last order"},
  notesPrivees:{fr:"Notes privées",es:"Notas privadas",en:"Private notes"},
  notesPriveesDesc:{fr:"Visibles uniquement par vous",es:"Solo visibles para ti",en:"Only visible to you"},
  editarCmd:{fr:"Modifier la commande",es:"Editar pedido",en:"Edit order"},
  cmdNonConfirmee:{fr:"Non confirmée — modifiable",es:"No confirmada — editable",en:"Not confirmed — editable"},
  novedades:{fr:"Nouveautés",es:"Novedades",en:"New arrivals"},
  tuTarifa:{fr:"Votre tarif",es:"Tu tarifa",en:"Your pricing"},
  proximoTramo:{fr:"Plus que %n unités pour débloquer",es:"Solo %n unidades más para desbloquear",en:"Only %n more units to unlock"},
  porUnidad:{fr:"/unité",es:"/unidad",en:"/unit"},
  exporterCSV:{fr:"Exporter CSV",es:"Exportar CSV",en:"Export CSV"},
  sessionExpiree:{fr:"Session expirée. Veuillez vous reconnecter.",es:"Sesión expirada. Vuelve a iniciar sesión.",en:"Session expired. Please log in again."},
  favoris:{fr:"Favoris",es:"Favoritos",en:"Favorites"},
  ajouteFav:{fr:"Ajouté aux favoris",es:"Añadido a favoritos",en:"Added to favorites"},
  voirFavoris:{fr:"Voir favoris",es:"Ver favoritos",en:"View favorites"},
  packaging:{fr:"Packaging",es:"Packaging",en:"Packaging"},
  packagingSub:{fr:"Étuis, présentoirs et merchandising",es:"Fundas, expositores y merchandising",en:"Cases, displays and merchandising"},
  packType:{fr:"Type",es:"Tipo",en:"Type"},
  packDesc:{fr:"Description",es:"Descripción",en:"Description"},
  editPack:{fr:"Modifier packaging",es:"Editar packaging",en:"Edit packaging"},
  nouveauPack:{fr:"Nouveau",es:"Nuevo",en:"New"},
  packEtui:{fr:"Étuis",es:"Fundas",en:"Cases"},
  packDisplay:{fr:"Présentoirs",es:"Expositores",en:"Displays"},
  packMerch:{fr:"Merchandising",es:"Merchandising",en:"Merchandising"},
  fondFiltrer:{fr:"Filtrer",es:"Filtrar",en:"Filter"},
  couleurs:{fr:"couleurs",es:"colores",en:"colors"},
  voirModele:{fr:"Voir le modèle",es:"Ver modelo",en:"View model"},
  stockDisponible:{fr:"en stock",es:"en stock",en:"in stock"},
  envioPartial:{fr:"Envoi partiel",es:"Envío parcial",en:"Partial shipment"},
  enviado:{fr:"Envoyé",es:"Enviado",en:"Shipped"},
  pendienteEnvio:{fr:"En attente d'envoi",es:"Pendiente de envío",en:"Pending shipment"},
  recibido:{fr:"reçu",es:"recibido",en:"received"},
  pendiente:{fr:"en attente",es:"pendiente",en:"pending"},
  progreso:{fr:"Progression",es:"Progreso",en:"Progress"},
  factura:{fr:"Facture",es:"Factura",en:"Invoice"},
  tusMasPedidos:{fr:"Vos modèles les plus commandés",es:"Tus diseños más pedidos",en:"Your most ordered designs"},
  vecesComprado:{fr:"commandé %n fois",es:"pedido %n veces",en:"ordered %n times"},
  recoInteligente:{fr:"Vous pourriez aimer",es:"Te puede interesar",en:"You might like"},
  distributeurs:{fr:"Distributeurs",es:"Distribuidores",en:"Distributors"},
  distResume:{fr:"Résumé distributeur",es:"Resumen distribuidor",en:"Distributor summary"},
  ventesTotal:{fr:"Ventes totales",es:"Ventas totales",en:"Total sales"},
  commGeneree:{fr:"Commission générée",es:"Comisión generada",en:"Commission generated"},
  commPayee:{fr:"Payée",es:"Pagada",en:"Paid"},
  commDue:{fr:"À payer",es:"Pendiente",en:"Due"},
  liquidaciones:{fr:"Liquidations",es:"Liquidaciones",en:"Settlements"},
  noLiquidaciones:{fr:"Aucune liquidation enregistrée",es:"Sin liquidaciones registradas",en:"No settlements recorded"},
  notesDistrib:{fr:"Notes sur ce distributeur",es:"Notas sobre este distribuidor",en:"Notes about this distributor"},
  confirmarEliminar:{fr:"Confirmer la suppression ?",es:"¿Confirmar eliminación?",en:"Confirm deletion?"},
  reduirQty:{fr:"Réduire qté",es:"Reducir uds",en:"Reduce qty"},
  tareas:{fr:"Tâches",es:"Tareas",en:"Tasks"},
  gestionTareas:{fr:"Gestion des tâches",es:"Gestión de tareas",en:"Task management"},
  nouvelleTache:{fr:"+ Tâche",es:"+ Tarea",en:"+ Task"},
  titreTache:{fr:"Titre",es:"Título",en:"Title"},
  descTache:{fr:"Description",es:"Descripción",en:"Description"},
  priorite:{fr:"Priorité",es:"Prioridad",en:"Priority"},
  haute:{fr:"Haute",es:"Alta",en:"High"},
  moyenne:{fr:"Moyenne",es:"Media",en:"Medium"},
  basse:{fr:"Basse",es:"Baja",en:"Low"},
  area:{fr:"Domaine",es:"Área",en:"Area"},
  commercial:{fr:"Commercial",es:"Comercial",en:"Commercial"},
  finances:{fr:"Finances",es:"Finanzas",en:"Finance"},
  marketing:{fr:"Marketing",es:"Marketing",en:"Marketing"},
  produits:{fr:"Produits",es:"Productos",en:"Products"},
  clientsArea:{fr:"Clients",es:"Clientes",en:"Clients"},
  logistique:{fr:"Logistique",es:"Logística",en:"Logistics"},
  admin:{fr:"Admin",es:"Admin",en:"Admin"},
  fait:{fr:"Fait",es:"Hecho",en:"Done"},
  enCours:{fr:"En cours",es:"En curso",en:"In progress"},
  aFaire:{fr:"À faire",es:"Pendiente",en:"To do"},
  toutesAreas:{fr:"Tout",es:"Todo",en:"All"},
  promoClients:{fr:"Clients ciblés",es:"Clientes objetivo",en:"Target clients"},
  tousClients:{fr:"Tous les clients",es:"Todos los clientes",en:"All clients"},
  selectionPrivee:{fr:"Sélection Privée",es:"Selección Privée",en:"Private Selection"},
  selectionSub:{fr:"Éditions spéciales à prix privilégié, disponibilité limitée.",es:"Ediciones especiales a precio privilegiado, disponibilidad limitada.",en:"Special editions at privileged pricing, limited availability."},
  forme:{fr:"Forme",es:"Forma",en:"Shape"},
  couleur:{fr:"Couleur",es:"Color",en:"Color"},
  toutes:{fr:"Toutes",es:"Todas",en:"All"},
  tous:{fr:"Tous",es:"Todos",en:"All"},
  ronde:{fr:"Ronde",es:"Redonda",en:"Round"},
  carree:{fr:"Carrée",es:"Cuadrada",en:"Square"},
  catEye:{fr:"Cat-eye",es:"Cat-eye",en:"Cat-eye"},
  rectangulaire:{fr:"Rectangulaire",es:"Rectangular",en:"Rectangular"},
  aviateur:{fr:"Aviateur",es:"Aviador",en:"Aviator"},
  oversize:{fr:"Oversize",es:"Oversize",en:"Oversize"},
  geometrique:{fr:"Géométrique",es:"Geométrica",en:"Geometric"},
  noir:{fr:"Noir",es:"Negro",en:"Black"},
  careyCol:{fr:"Carey",es:"Carey",en:"Carey"},
  marron:{fr:"Marron",es:"Marrón",en:"Brown"},
  vert:{fr:"Vert",es:"Verde",en:"Green"},
  dore:{fr:"Doré",es:"Dorado",en:"Gold"},
  rose:{fr:"Rose",es:"Rosa",en:"Pink"},
  bleu:{fr:"Bleu",es:"Azul",en:"Blue"},
  rougeVin:{fr:"Rouge/Vin",es:"Rojo/Vino",en:"Red/Wine"},
  orangeCol:{fr:"Orange",es:"Naranja",en:"Orange"},
  cremeNude:{fr:"Crème/Nude",es:"Crema/Nude",en:"Cream/Nude"},
  gris:{fr:"Gris",es:"Gris",en:"Grey"},
  transparentCol:{fr:"Transparent",es:"Transparente",en:"Transparent"},
  multicolore:{fr:"Multicolore",es:"Multicolor",en:"Multicolor"},
};

/* ═══ PRICING TIERS (Essential only) ═══ */
const TIERS = [
  {min:1,max:9,price:26.90,label:"< 10",payK:"paiementUnique",shipK:"dePago",dispK:"expOpt"},
  {min:10,max:19,price:22.90,label:"10-19",payK:"paiementUnique",shipK:"dePago",dispK:"expOpt"},
  {min:20,max:29,price:19.90,label:"20-29",payK:"deuxPaiements30",shipK:"gratuit",dispK:"exp2"},
  {min:30,max:39,price:18.90,label:"30-39",payK:"deuxPaiements30",shipK:"gratuit",dispK:"exp3"},
  {min:40,max:60,price:17.90,label:"40-60",payK:"deuxPaiements1545",shipK:"gratuit",dispK:"exp3"},
];
const ACETATO_PRICE = 27.90;
const getTier = q => TIERS.find(t => q >= t.min && q <= t.max) || TIERS[4];
const getNextTier = q => { const i = TIERS.findIndex(t => q >= t.min && q <= t.max); return i >= 0 && i < TIERS.length - 1 ? TIERS[i+1] : null; };
const getPrice = (q, cp) => cp > 0 ? cp : getTier(q).price;

/* ═══ SEED DATA ═══ */
const PRODUCTS_INIT = [
  /* ── ESSENTIAL (PVC) ── */
  /* BAKER */
  {id:1,model:"BAKER",color:"Tea",sku:"MN-BAKR-TEA",col:"Essential",cat:"Essential",stock:16,fixedPrice:0,tags:["top","rec"]},
  {id:2,model:"BAKER",color:"Cloud",sku:"MN-BAKR-CLD",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:3,model:"BAKER",color:"Black",sku:"MN-BAKR-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0},
  {id:4,model:"BAKER",color:"Mint",sku:"MN-BAKR-MNT",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  /* VITTI */
  {id:5,model:"VITTI",color:"Brown Carey",sku:"MN-VTTI-BCR",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  {id:6,model:"VITTI",color:"Velvet",sku:"MN-VTTI-VLV",col:"Essential",cat:"Essential",stock:20,fixedPrice:0},
  {id:7,model:"VITTI",color:"Brown",sku:"MN-VTTI-BRN",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  {id:8,model:"VITTI",color:"Caramel",sku:"MN-VTTI-CRM",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  /* BERGMAN */
  {id:9,model:"BERGMAN",color:"Brown Carey",sku:"MN-BRGM-BCR",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:10,model:"BERGMAN",color:"Brown",sku:"MN-BRGM-BRN",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  {id:11,model:"BERGMAN",color:"Black",sku:"MN-BRGM-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0},
  {id:12,model:"BERGMAN",color:"Carey",sku:"MN-BRGM-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  /* TURA */
  {id:13,model:"TURA",color:"Guiza",sku:"MN-TURA-GZA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:14,model:"TURA",color:"Carey",sku:"MN-TURA-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  {id:15,model:"TURA",color:"Coffee",sku:"MN-TURA-COF",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  {id:16,model:"TURA",color:"Velvet",sku:"MN-TURA-VLV",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  /* CARDINALE */
  {id:17,model:"CARDINALE",color:"Carey",sku:"MN-CARD-CRY",col:"Essential",cat:"Essential",stock:20,fixedPrice:0,tags:["top"]},
  {id:18,model:"CARDINALE",color:"Apple",sku:"MN-CARD-APL",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:19,model:"CARDINALE",color:"Tea",sku:"MN-CARD-TEA",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  {id:20,model:"CARDINALE",color:"Guiza",sku:"MN-CARD-GZA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  /* GARDNER */
  {id:21,model:"GARDNER",color:"Black",sku:"MN-GRDN-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0},
  {id:22,model:"GARDNER",color:"Amber Dor\u00e9",sku:"MN-GRDN-ADR",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  {id:23,model:"GARDNER",color:"Carey",sku:"MN-GRDN-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  /* HART */
  {id:24,model:"HART",color:"Sunset",sku:"MN-HART-SNS",col:"Essential",cat:"Essential",stock:14,fixedPrice:0,tags:["new"]},
  {id:25,model:"HART",color:"Black",sku:"MN-HART-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0},
  {id:26,model:"HART",color:"Carey",sku:"MN-HART-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  {id:27,model:"HART",color:"Honey",sku:"MN-HART-HNY",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  /* DENEUVE */
  {id:28,model:"DENEUVE",color:"Tea",sku:"MN-DNVE-TEA",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  {id:29,model:"DENEUVE",color:"Apple",sku:"MN-DNVE-APL",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:50,model:"DENEUVE",color:"Carey",sku:"MN-DNVE-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  /* TOTTER */
  {id:51,model:"TOTTER",color:"Leaf",sku:"MN-TTTR-LEF",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:52,model:"TOTTER",color:"Black",sku:"MN-TTTR-BLK",col:"Essential",cat:"Essential",stock:20,fixedPrice:0},
  {id:53,model:"TOTTER",color:"Carey",sku:"MN-TTTR-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  /* RAINER */
  {id:54,model:"RAINER",color:"Caramel",sku:"MN-RNRR-CRM",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  {id:55,model:"RAINER",color:"Mandarine",sku:"MN-RNRR-MND",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:56,model:"RAINER",color:"Carey",sku:"MN-RNRR-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  /* ARIELLE */
  {id:57,model:"ARIELLE",color:"Velvet",sku:"MN-AREL-VLV",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:58,model:"ARIELLE",color:"Carey",sku:"MN-AREL-CRY",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  {id:59,model:"ARIELLE",color:"Dusty",sku:"MN-AREL-DSY",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  {id:60,model:"ARIELLE",color:"Pale Sandstone",sku:"MN-AREL-PLS",col:"Essential",cat:"Essential",stock:8,fixedPrice:0},
  /* DOVER */
  {id:61,model:"DOVER",color:"Hunter Blend",sku:"MN-DOVR-HBL",col:"Essential",cat:"Essential",stock:10,fixedPrice:0,tags:["rec"]},
  {id:62,model:"DOVER",color:"Tea",sku:"MN-DOVR-TEA",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:63,model:"DOVER",color:"Shadow",sku:"MN-DOVR-SHD",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  /* HAZEL */
  {id:64,model:"HAZEL",color:"Noir",sku:"MN-HAZL-NOR",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  {id:65,model:"HAZEL",color:"Carey",sku:"MN-HAZL-CRY",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  {id:66,model:"HAZEL",color:"Petal",sku:"MN-HAZL-PTL",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  /* COLETTE */
  {id:67,model:"COLETTE",color:"Cocoa",sku:"MN-COLT-COC",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:68,model:"COLETTE",color:"Jungle",sku:"MN-COLT-JNG",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:69,model:"COLETTE",color:"Burnt",sku:"MN-COLT-BRN",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  /* HEDY */
  {id:70,model:"HEDY",color:"Guiza",sku:"MN-HEDY-GZA",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  {id:71,model:"HEDY",color:"Matcha",sku:"MN-HEDY-MTC",col:"Essential",cat:"Essential",stock:18,fixedPrice:0},
  {id:72,model:"HEDY",color:"Jara",sku:"MN-HEDY-JRA",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  /* BOLDEN */
  {id:73,model:"BOLDEN",color:"Ebony",sku:"MN-BLDN-EBN",col:"Essential",cat:"Essential",stock:20,fixedPrice:0},
  {id:74,model:"BOLDEN",color:"Bruma",sku:"MN-BLDN-BRM",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:75,model:"BOLDEN",color:"Oliva",sku:"MN-BLDN-OLV",col:"Essential",cat:"Essential",stock:14,fixedPrice:0},
  {id:175,model:"BOLDEN",color:"Wine",sku:"MN-BLDN-WNE",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:76,model:"BOLDEN",color:"Nude",sku:"MN-BLDN-NDE",col:"Essential",cat:"Essential",stock:10,fixedPrice:0},
  /* NOVA */
  {id:77,model:"NOVA",color:"Black",sku:"MN-NOVA-BLK",col:"Essential",cat:"Essential",stock:22,fixedPrice:0},
  {id:78,model:"NOVA",color:"Jade",sku:"MN-NOVA-JDE",col:"Essential",cat:"Essential",stock:16,fixedPrice:0},
  {id:79,model:"NOVA",color:"Ruby",sku:"MN-NOVA-RBY",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},

  /* ── ACETATO ── */
  /* SIENNA */
  {id:30,model:"SIENNA",color:"Sepia",sku:"MN-SIEN-SPA",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE},
  {id:31,model:"SIENNA",color:"Bold",sku:"MN-SIEN-BLD",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* ASTOR */
  {id:32,model:"ASTOR",color:"Green",sku:"MN-ASTR-GRN",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE},
  {id:33,model:"ASTOR",color:"Bronze",sku:"MN-ASTR-BRZ",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* ARDEN */
  {id:34,model:"ARDEN",color:"Cocoa",sku:"MN-ARDN-COC",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE},
  {id:35,model:"ARDEN",color:"Champagne",sku:"MN-ARDN-CHP",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,tags:["top","new"]},
  {id:36,model:"ARDEN",color:"Carey",sku:"MN-ARDN-CRY",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* BARDOT */
  {id:37,model:"BARDOT",color:"Carey",sku:"MN-BRDT-CRY",col:"Acetato",cat:"Acetato",stock:14,fixedPrice:ACETATO_PRICE},
  /* JUNO */
  {id:38,model:"JUNO",color:"Shade",sku:"MN-JUNO-SHD",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* NOVAK */
  {id:39,model:"NOVAK",color:"Carey",sku:"MN-NOVK-CRY",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE,tags:["new","rec"]},
  {id:40,model:"NOVAK",color:"Mocha",sku:"MN-NOVK-MCH",col:"Acetato",cat:"Acetato",stock:8,fixedPrice:ACETATO_PRICE},
  /* IVY */
  {id:41,model:"IVY",color:"Felline",sku:"MN-IVY-FLN",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* LEIHGT */
  {id:42,model:"LEIHGT",color:"Chalk",sku:"MN-LHGT-CHK",col:"Acetato",cat:"Acetato",stock:6,fixedPrice:ACETATO_PRICE},
  /* HAYEK */
  {id:43,model:"HAYEK",color:"Carey",sku:"MN-HAYK-CRY",col:"Acetato",cat:"Acetato",stock:12,fixedPrice:ACETATO_PRICE},
  {id:44,model:"HAYEK",color:"Olive",sku:"MN-HAYK-OLV",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  {id:45,model:"JUNO",color:"Sienna",sku:"MN-JUNO-SNA",col:"Acetato",cat:"Acetato",stock:10,fixedPrice:ACETATO_PRICE},
  /* BLYTH */
  {id:46,model:"BLYTH",color:"Greenwave",sku:"MN-BLTH-GRW",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  {id:47,model:"BLYTH",color:"Carey",sku:"MN-BLTH-CRY",col:"Essential",cat:"Essential",stock:15,fixedPrice:0},
  /* COOPER II */
  {id:48,model:"COOPER II",color:"Caramel",sku:"MN-COP2-CRM",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:49,model:"COOPER II",color:"Buttercup",sku:"MN-COP2-BTC",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:50,model:"COOPER II",color:"Havana",sku:"MN-COP2-HVN",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:51,model:"COOPER II",color:"Grass",sku:"MN-COP2-GRS",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:52,model:"COOPER II",color:"Tiger",sku:"MN-COP2-TGR",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:53,model:"COOPER II",color:"Sierra",sku:"MN-COP2-SRA",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  {id:178,model:"COOPER II",color:"Moonlight",sku:"MN-COP2-MLT",col:"Essential",cat:"Essential",stock:12,fixedPrice:0},
  /* ── ICONS ── */
  /* GUGU */
  {id:100,model:"GUGU",color:"Gold Green",sku:"MN-GUGU-GGR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* MOORE */
  {id:101,model:"MOORE",color:"Kaffa",sku:"MN-MOOR-KFA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:102,model:"MOORE",color:"Black",sku:"MN-MOOR-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* CLEO */
  {id:103,model:"CLEO",color:"Tea",sku:"MN-CLEO-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:104,model:"CLEO",color:"Black",sku:"MN-CLEO-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* GRANT */
  {id:105,model:"GRANT",color:"Black",sku:"MN-GRNT-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:106,model:"GRANT",color:"Carey",sku:"MN-GRNT-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:107,model:"GRANT",color:"Caramel",sku:"MN-GRNT-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* BERRY */
  {id:108,model:"BERRY",color:"Navy",sku:"MN-BRRY-NVY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:109,model:"BERRY",color:"Carbon",sku:"MN-BRRY-CRB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:110,model:"BERRY",color:"Carey Brown",sku:"MN-BRRY-CBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:111,model:"BERRY",color:"Tea",sku:"MN-BRRY-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* STONE */
  {id:112,model:"STONE",color:"Black",sku:"MN-STON-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:113,model:"STONE",color:"Tea",sku:"MN-STON-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* FOSTER */
  {id:114,model:"FOSTER",color:"Gold-Black",sku:"MN-FSTR-GBK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:115,model:"FOSTER",color:"Carbon",sku:"MN-FSTR-CRB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:116,model:"FOSTER",color:"Gold-Brown",sku:"MN-FSTR-GBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* ROBERTS */
  {id:117,model:"ROBERTS",color:"Carrot",sku:"MN-RBRT-CRT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:118,model:"ROBERTS",color:"Peanut",sku:"MN-RBRT-PNT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:119,model:"ROBERTS",color:"Jasper",sku:"MN-RBRT-JSP",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:120,model:"ROBERTS",color:"Black",sku:"MN-RBRT-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:121,model:"ROBERTS",color:"Green Carey",sku:"MN-RBRT-GCR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:122,model:"ROBERTS",color:"Carey",sku:"MN-RBRT-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* THURMAN */
  {id:123,model:"THURMAN",color:"Black",sku:"MN-THRM-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:124,model:"THURMAN",color:"Carey",sku:"MN-THRM-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:125,model:"THURMAN",color:"Ember",sku:"MN-THRM-EMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:126,model:"THURMAN",color:"Caramel",sku:"MN-THRM-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:127,model:"THURMAN",color:"Cloud",sku:"MN-THRM-CLD",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* MACLAINE */
  {id:128,model:"MACLAINE",color:"Tea",sku:"MN-MCLN-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:129,model:"MACLAINE",color:"Black",sku:"MN-MCLN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* LAWRENCE */
  {id:130,model:"LAWRENCE",color:"Guiza",sku:"MN-LWRC-GZA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:131,model:"LAWRENCE",color:"Caramel",sku:"MN-LWRC-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:132,model:"LAWRENCE",color:"Carey",sku:"MN-LWRC-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:133,model:"LAWRENCE",color:"Bay",sku:"MN-LWRC-BAY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:134,model:"LAWRENCE",color:"Velvet",sku:"MN-LWRC-VLV",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:135,model:"LAWRENCE",color:"Black",sku:"MN-LWRC-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* MIRREN */
  {id:136,model:"MIRREN",color:"Black",sku:"MN-MRRN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:137,model:"MIRREN",color:"Carey",sku:"MN-MRRN-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:138,model:"MIRREN",color:"Tea",sku:"MN-MRRN-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* LANE */
  {id:139,model:"LANE",color:"Black",sku:"MN-LANE-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:140,model:"LANE",color:"Lightblue",sku:"MN-LANE-LBL",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:141,model:"LANE",color:"Opal",sku:"MN-LANE-OPL",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:142,model:"LANE",color:"Tea",sku:"MN-LANE-TEA",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:143,model:"LANE",color:"Ambar",sku:"MN-LANE-AMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:144,model:"LANE",color:"Carey",sku:"MN-LANE-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:145,model:"LANE",color:"Grass",sku:"MN-LANE-GRS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* HARLOW */
  {id:146,model:"HARLOW",color:"Gold-Green",sku:"MN-HRLW-GGR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:147,model:"HARLOW",color:"Gold-Brown",sku:"MN-HRLW-GBR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:148,model:"HARLOW",color:"Gold-Black",sku:"MN-HRLW-GBK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* MAKEY */
  {id:149,model:"MAKEY",color:"Carey",sku:"MN-MAKY-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:150,model:"MAKEY",color:"Black Cherry",sku:"MN-MAKY-BCH",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:151,model:"MAKEY",color:"Black",sku:"MN-MAKY-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:152,model:"MAKEY",color:"Snow",sku:"MN-MAKY-SNW",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* LOREN */
  {id:153,model:"LOREN",color:"Toffee",sku:"MN-LORN-TFE",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:154,model:"LOREN",color:"Cream",sku:"MN-LORN-CRM",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:155,model:"LOREN",color:"Black",sku:"MN-LORN-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:156,model:"LOREN",color:"Carey",sku:"MN-LORN-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* CARROL */
  {id:157,model:"CARROL",color:"Rowan",sku:"MN-CRRL-RWN",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:158,model:"CARROL",color:"Cedar",sku:"MN-CRRL-CDR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* ARETHA */
  {id:159,model:"ARETHA",color:"Rosse",sku:"MN-ARTH-RSS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:160,model:"ARETHA",color:"Carey",sku:"MN-ARTH-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:161,model:"ARETHA",color:"Black",sku:"MN-ARTH-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* KARINA */
  {id:162,model:"KARINA",color:"Copo",sku:"MN-KRNA-CPO",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:163,model:"KARINA",color:"Jade",sku:"MN-KRNA-JDE",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:164,model:"KARINA",color:"Black",sku:"MN-KRNA-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:165,model:"KARINA",color:"Ruby",sku:"MN-KRNA-RBY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* ZIYI */
  {id:166,model:"ZIYI",color:"Mandarine",sku:"MN-ZIYI-MND",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:167,model:"ZIYI",color:"Rosse",sku:"MN-ZIYI-RSS",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:168,model:"ZIYI",color:"Jasper",sku:"MN-ZIYI-JSP",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:169,model:"ZIYI",color:"Agate",sku:"MN-ZIYI-AGT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:170,model:"ZIYI",color:"Amber",sku:"MN-ZIYI-AMB",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* LAMARR */
  {id:171,model:"LAMARR",color:"Carbon Mate",sku:"MN-LMRR-CMT",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:172,model:"LAMARR",color:"Louvre",sku:"MN-LMRR-LVR",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:173,model:"LAMARR",color:"Carey",sku:"MN-LMRR-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:174,model:"LAMARR",color:"Dark",sku:"MN-LMRR-DRK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  /* KERR */
  {id:176,model:"KERR",color:"Black",sku:"MN-KERR-BLK",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]},
  {id:177,model:"KERR",color:"Carey",sku:"MN-KERR-CRY",col:"Icons",cat:"Icons",stock:10,fixedPrice:0,tags:["icons"]}
];

const ORDERS_INIT = [
  {id:"#MN-0001",client:"Le Bruit des Vagues",dist:"MPM Diffusion",date:"13/03/2026",items:50,total:850.26,comm:127.54,status:"partial",pay:"pending",shippingCost:0,track:"131DAFC1021215124R",carrier:"Zeleris",trackUrl:"",clientNotes:"Envío 1: 35 uds entregado (Factura M2026003). Envío 2: 15 uds pendiente 1ª semana abril. Pago: 50% a 15 días (04/04) + 50% a 45 días (04/05).",
    lines:[
      {model:"CARDINALE",color:"Guiza",sku:"MN-CARD-GZA",qty:2,price:17.01,qtyReceived:0},
      {model:"GARDNER",color:"Amber Doré",sku:"MN-GRDN-ADR",qty:2,price:17.01,qtyReceived:2},
      {model:"VITTI",color:"Velvet",sku:"MN-VTTI-VLV",qty:2,price:17.01,qtyReceived:0},
      {model:"VITTI",color:"Brown Carey",sku:"MN-VTTI-BCR",qty:2,price:17.01,qtyReceived:0},
      {model:"NOVA",color:"Jade",sku:"MN-NOVA-JDE",qty:2,price:17.01,qtyReceived:0},
      {model:"NOVA",color:"Ruby",sku:"MN-NOVA-RBY",qty:2,price:17.01,qtyReceived:0},
      {model:"BOLDEN",color:"Nude",sku:"MN-BLDN-NDE",qty:2,price:17.01,qtyReceived:2},
      {model:"HEDY",color:"Matcha",sku:"MN-HEDY-MTC",qty:2,price:17.01,qtyReceived:2},
      {model:"HEDY",color:"Guiza",sku:"MN-HEDY-GZA",qty:2,price:17.01,qtyReceived:2},
      {model:"ARIELLE",color:"Dusty",sku:"MN-AREL-DSY",qty:2,price:17.01,qtyReceived:1},
      {model:"DENEUVE",color:"Tea",sku:"MN-DNVE-TEA",qty:2,price:17.01,qtyReceived:2},
      {model:"HART",color:"Sunset",sku:"MN-HART-SNS",qty:2,price:17.01,qtyReceived:2},
      {model:"GUGU",color:"Gold Green",sku:"MN-GUGU-GGR",qty:2,price:17.01,qtyReceived:2},
      {model:"GRANT",color:"Carey",sku:"MN-GRNT-CRY",qty:2,price:17.01,qtyReceived:2},
      {model:"BERRY",color:"Navy",sku:"MN-BRRY-NVY",qty:2,price:17.01,qtyReceived:1},
      {model:"STONE",color:"Tea",sku:"MN-STON-TEA",qty:2,price:17.01,qtyReceived:2},
      {model:"ROBERTS",color:"Jasper",sku:"MN-RBRT-JSP",qty:2,price:17.01,qtyReceived:2},
      {model:"ROBERTS",color:"Green Carey",sku:"MN-RBRT-GCR",qty:2,price:17.01,qtyReceived:2},
      {model:"THURMAN",color:"Cloud",sku:"MN-THRM-CLD",qty:2,price:17.01,qtyReceived:2},
      {model:"MACLAINE",color:"Black",sku:"MN-MCLN-BLK",qty:2,price:17.01,qtyReceived:2},
      {model:"HARLOW",color:"Gold-Green",sku:"MN-HRLW-GGR",qty:2,price:17.01,qtyReceived:1},
      {model:"LOREN",color:"Black",sku:"MN-LORN-BLK",qty:2,price:17.01,qtyReceived:0},
      {model:"LOREN",color:"Toffee",sku:"MN-LORN-TFE",qty:2,price:17.01,qtyReceived:2},
      {model:"ZIYI",color:"Mandarine",sku:"MN-ZIYI-MND",qty:2,price:17.01,qtyReceived:2},
      {model:"LAMARR",color:"Louvre",sku:"MN-LMRR-LVR",qty:2,price:17.01,qtyReceived:2}
    ]},
  {id:"#MN-0002",client:"Il et Elle",dist:"MPM Diffusion",date:"20/01/2026",items:20,total:398.00,comm:59.70,status:"delivered",pay:"pending",shippingCost:0,track:"",carrier:"",trackUrl:"",clientNotes:"",
    lines:[{model:"HEDY",color:"Guiza",qty:2,price:19.90},{model:"HAZEL",color:"Petal",qty:2,price:19.90},{model:"KERR",color:"Black",qty:2,price:19.90},{model:"CLEO",color:"Black",qty:2,price:19.90},{model:"CLEO",color:"Tea",qty:2,price:19.90},{model:"THURMAN",color:"Black",qty:2,price:19.90},{model:"LAMARR",color:"Carey",qty:2,price:19.90},{model:"MACLAINE",color:"Black",qty:2,price:19.90},{model:"MACLAINE",color:"Tea",qty:2,price:19.90},{model:"LANE",color:"Tea",qty:2,price:19.90}]},
  {id:"#2589",client:"Optique Rivoli",dist:"Agent Sud",date:"05/03/2026",items:30,total:537,comm:80.55,status:"delivered",pay:"paid",shippingCost:0,track:"ZEL001",carrier:"GLS",trackUrl:"https://www.gls-spain.es/track?id=ZEL001",clientNotes:"",
    lines:[{model:"CARDINALE",color:"Guiza",sku:"MN-CARD-GZA",qty:6,price:17.9},{model:"BERGMAN",color:"Brown",sku:"MN-BRGM-BRN",qty:6,price:17.9},{model:"VITTI",color:"Brown Carey",sku:"MN-VTTI-BCR",qty:6,price:17.9},{model:"BAKER",color:"Mint",sku:"MN-BAKR-MNT",qty:6,price:17.9},{model:"TURA",color:"Velvet",sku:"MN-TURA-VLV",qty:6,price:17.9}]},
  {id:"#2615",client:"Concept Store Lyon",dist:"Direct",date:"18/03/2026",items:40,total:716,comm:0,status:"confirmed",pay:"invoiced",shippingCost:0,track:"",carrier:"",trackUrl:"",clientNotes:"",
    lines:[{model:"GARDNER",color:"Black",sku:"MN-GRDN-BLK",qty:8,price:17.9},{model:"BAKER",color:"Black",sku:"MN-BAKR-BLK",qty:8,price:17.9},{model:"VITTI",color:"Caramel",sku:"MN-VTTI-CRM",qty:8,price:17.9},{model:"CARDINALE",color:"Tea",sku:"MN-CARD-TEA",qty:8,price:17.9},{model:"BERGMAN",color:"Brown Carey",sku:"MN-BRGM-BCR",qty:8,price:17.9}]},
];

const CLIENTS_INIT = [
  {id:1,name:"Le Bruit des Vagues",contact:"Agnès",city:"Vannes",country:"FR",orders:1,total:850.26,status:"active",channel:"Agent Sud",customPrice:0,earlyPay:false,notes:""},
  {id:2,name:"Optique Rivoli",contact:"Claire",city:"Paris",country:"FR",orders:2,total:1290.6,status:"active",channel:"Agent Sud",customPrice:0,earlyPay:true,notes:""},
  {id:3,name:"Maison Solaire",contact:"Hugo",city:"Bordeaux",country:"FR",orders:0,total:0,status:"prospect",channel:"Agent Sud",customPrice:0,earlyPay:false,notes:""},
  {id:4,name:"Concept Store Lyon",contact:"Lucas",city:"Lyon",country:"FR",orders:1,total:716,status:"active",channel:"Direct",customPrice:0,earlyPay:false,notes:""},
  {id:5,name:"Brillen Hamburg",contact:"Anna",city:"Hamburg",country:"DE",orders:4,total:2148,status:"vip",channel:"Faire",customPrice:16.50,earlyPay:true,notes:""},
];

const TASKS_INIT = [
  {id:1,title:"Preparar lookbook SS26",desc:"Fotos + textos para distribuidores",priority:"haute",area:"marketing",status:"enCours",date:"20/03/2026"},
  {id:2,title:"Revisar factura Optique Rivoli",desc:"Comprobar importes y enviar",priority:"haute",area:"finances",status:"aFaire",date:"22/03/2026"},
  {id:3,title:"Contactar nuevas ópticas Berlín",desc:"Lista de 10 ópticas potenciales",priority:"moyenne",area:"commercial",status:"aFaire",date:"23/03/2026"},
  {id:4,title:"Actualizar stock Acetato",desc:"Verificar unidades físicas vs sistema",priority:"moyenne",area:"produits",status:"enCours",date:"21/03/2026"},
  {id:5,title:"Enviar credenciales a Minuë Colombia",desc:"Email con acceso B2B portal",priority:"haute",area:"clientsArea",status:"fait",date:"23/03/2026"},
  {id:6,title:"Configurar envío DHL Le Bruit des Vagues",desc:"Pedido #MN-0001 parcial",priority:"basse",area:"logistique",status:"aFaire",date:"22/03/2026"},
];

const FAQ_INIT = [
  {id:1,q:{fr:"Quel est le minimum de commande ?",es:"¿Cuál es el pedido mínimo?",en:"What is the minimum order?"},a:{fr:"Il n'y a pas de minimum par modèle. Le prix unitaire dépend du volume total de votre commande (voir Tarifs).",es:"No hay mínimo por modelo. El precio unitario depende del volumen total del pedido (ver Tarifas).",en:"No minimum per model. Unit price depends on your total order volume (see Pricing)."},on:true},
  {id:2,q:{fr:"Comment fonctionne le pronto pago ?",es:"¿Cómo funciona el pronto pago?",en:"How does early payment work?"},a:{fr:"Si vous payez dans les 7 jours suivant la facture, vous bénéficiez d'une remise de 3% sur le total. Cette option est activée par votre gestionnaire.",es:"Si pagas en los 7 días siguientes a la factura, obtienes un 3% de descuento. Esta opción la activa tu gestor.",en:"Pay within 7 days of invoice for a 3% discount. Your account manager enables this option."},on:true},
  {id:3,q:{fr:"Quels sont les délais de livraison ?",es:"¿Cuáles son los plazos de envío?",en:"What are delivery times?"},a:{fr:"Envoi sous 48-72h après confirmation. Livraison gratuite à partir de 20 unités.",es:"Envío en 48-72h tras confirmación. Envío gratuito a partir de 20 unidades.",en:"Ships within 48-72h after confirmation. Free shipping from 20 units."},on:true},
  {id:4,q:{fr:"La collection Acetato a-t-elle les mêmes tarifs ?",es:"¿La colección Acetato tiene las mismas tarifas?",en:"Does Acetato have the same pricing?"},a:{fr:"Non. L'Acetato a un prix fixe de 29,90 €/unité, indépendant du volume. Seule la collection Essential suit les tarifs dégressifs.",es:"No. El Acetato tiene un precio fijo de 29,90 €/unidad, independiente del volumen. Solo la colección Essential sigue las tarifas por volumen.",en:"No. Acetato has a fixed price of €29.90/unit regardless of volume. Only Essential follows volume tiers."},on:true},
  {id:5,q:{fr:"Comment obtenir les photos produit ?",es:"¿Cómo obtener las fotos del producto?",en:"How to get product photos?"},a:{fr:"Rendez-vous dans la section Ressources pour télécharger les photos HD, logos et textes commerciaux.",es:"Ve a la sección Recursos para descargar fotos HD, logos y textos comerciales.",en:"Visit the Resources section to download HD photos, logos and commercial texts."},on:true},
];

const NEWS_INIT = [
  {id:1,title:{fr:"Nouvelle collection SS26",es:"Nueva colección SS26",en:"New SS26 collection"},content:{fr:"Découvrez nos 19 modèles Essential et 10 modèles Acetato premium.",es:"Descubre nuestros 19 modelos Essential y 10 modelos Acetato premium.",en:"Discover our 19 Essential and 10 premium Acetato models."},date:"15/03/2026",pinned:true,on:true,url:""},
  {id:2,title:{fr:"Best-sellers à recommander",es:"Best-sellers para recomendar",en:"Best-sellers to recommend"},content:{fr:"BAKER Tea, CARDINALE Carey et ARDEN Champagne sont les plus demandés cette saison.",es:"BAKER Tea, CARDINALE Carey y ARDEN Champagne son los más pedidos esta temporada.",en:"BAKER Tea, CARDINALE Carey and ARDEN Champagne are this season's most requested."},date:"18/03/2026",pinned:false,on:true,url:"https://minueopticians.com"},
  {id:3,title:{fr:"Exposition optique Paris",es:"Feria óptica París",en:"Paris optical fair"},content:{fr:"Retrouvez Minuë au Salon SILMO du 20 au 23 septembre 2026.",es:"Encuentra Minuë en el salón SILMO del 20 al 23 de septiembre 2026.",en:"Find Minuë at SILMO fair from Sep 20-23, 2026."},date:"20/03/2026",pinned:false,on:true,url:"https://silmoparis.com"},
];

const PROMOS_INIT = [
  {id:1,name:"Geste bienvenue",disc:5,type:"percent",cond:{fr:"1re commande",es:"1er pedido",en:"1st order"},on:true,visible:["client","distributor"]},
  {id:2,name:"Volume 50+",disc:8,type:"percent",cond:{fr:"\u226550 unit\u00e9s",es:"\u226550 unidades",en:"\u226550 units"},on:true,visible:["client","distributor"]},
  {id:3,name:"SS26 Launch",disc:0,type:"gift",cond:{fr:"2 paires offertes",es:"2 pares gratis",en:"2 free pairs"},on:false,visible:["client","distributor"]},
];

const USERS_INIT = [
  {email:"hola@minueopticians.com",pw:"minue2026",role:"admin",name:"Alejandro",co:"Minuë Opticians",lang:"es"},
  {email:"showroom@agentsud.fr",pw:"agent2026",role:"distributor",name:"Marc",co:"Agent Sud Showroom",commRate:15,lang:"fr"},
  {email:"agnes@lebruitdesvagues.fr",pw:"vagues2026",role:"client",name:"Agnès",co:"Le Bruit des Vagues",lang:"fr"},
  {email:"claire@rivoli.fr",pw:"rivoli2026",role:"client",name:"Claire",co:"Optique Rivoli",lang:"fr"},
  {email:"lucas@cslyon.fr",pw:"lyon2026",role:"client",name:"Lucas",co:"Concept Store Lyon",lang:"fr"},
  {email:"anna@brillen.de",pw:"brillen2026",role:"client",name:"Anna",co:"Brillen Hamburg",lang:"en"},
];

const FLAGS = {fr:"FR",es:"ES",en:"EN"};

/* ═══ SHARED UI ═══ */
const Badge = ({l, c}) => (
  <span style={{fontSize:10,padding:"3px 9px",borderRadius:3,fontFamily:BD,color:c,background:c+"1a",fontWeight:500,whiteSpace:"nowrap"}}>{l}</span>
);
const Btn = ({children, onClick, disabled, small, ghost, style}) => (
  <button onClick={onClick} disabled={disabled} style={{padding:small?"7px 14px":"11px 22px",background:disabled?C.gr2:ghost?"transparent":C.dk,color:ghost?C.dk:C.bg,border:ghost?"1px solid "+C.ln:"none",fontSize:small?11:12,cursor:disabled?"default":"pointer",fontFamily:BD,fontWeight:500,borderRadius:3,...(style||{})}}>{children}</button>
);

const Sec = ({title, sub, right, children}) => (
  <div style={{padding:"20px min(24px, 4vw)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:sub?6:18,flexWrap:"wrap",gap:8}}>
      <h1 style={{fontSize:"min(26px, 5.5vw)",fontWeight:500,letterSpacing:0.5,margin:0,fontFamily:DP,color:C.dk,lineHeight:1.2}}>{title}</h1>
      {right}
    </div>
    {sub && <p style={{color:C.gr,fontSize:12,fontFamily:BD,margin:"0 0 18px",lineHeight:1.5}}>{sub}</p>}
    {children}
  </div>
);

/* ═══ MAIN APP ═══ */
export default function App() {
  const [darkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  C = darkMode ? CD : CL;
  const [user, setUser] = useState(() => { try { const s = typeof window !== "undefined" && localStorage.getItem("minue_session"); if (s) { const sess = JSON.parse(s); if (Date.now() - sess.ts > 86400000) { localStorage.removeItem("minue_session"); localStorage.removeItem("minue_view"); return null; } return sess.user; } return null; } catch(e) { return null; } });
  const [loading, setLoading] = useState(() => { try { return typeof window !== "undefined" && !!localStorage.getItem("minue_session"); } catch(e) { return false; } });
  const [lang, _setLang] = useState(() => { try { const s = typeof window !== "undefined" && localStorage.getItem("minue_session"); if (s) { const sess = JSON.parse(s); return sess.user?.lang || "fr"; } const bl = typeof navigator !== "undefined" && navigator.language?.substring(0,2); return bl === "es" ? "es" : bl === "en" ? "en" : "fr"; } catch(e) { return "fr"; } });
  const setLang = (l) => { _setLang(l); try { const s = localStorage.getItem("minue_session"); if (s) { const sess = JSON.parse(s); sess.user.lang = l; localStorage.setItem("minue_session", JSON.stringify(sess)); } } catch(e) { console.log('DB error:', e); } };
  const [view, _setView] = useState(() => { try { return typeof window !== "undefined" && localStorage.getItem("minue_view") || "c-cat"; } catch(e) { return "c-cat"; } });
  const setView = (v) => { _setView(v); try { localStorage.setItem("minue_view", v); } catch(e) { console.log('DB error:', e); } };
  const [cart, setCart] = useState({});
  const [cartCl, setCartCl] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [regData, setRegData] = useState({name:"",co:"",email:"",pw:"",pw2:"",city:"",country:"",phone:""});
  const [regSent, setRegSent] = useState(false);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [clients, setClients] = useState(CLIENTS_INIT);
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [users, setUsers] = useState(USERS_INIT);
  const [promos, setPromos] = useState(PROMOS_INIT);
  const [news, setNews] = useState(NEWS_INIT);
  const [accountData, setAccountData] = useState({});
  const [accountSaved, setAccountSaved] = useState(false);
  const [faqs, setFaqs] = useState(FAQ_INIT);
  const [tasks, setTasks] = useState(TASKS_INIT);
  const [taskFilter, setTaskFilter] = useState("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [ordStatusFilter, setOrdStatusFilter] = useState("all");
  const [ordPayFilter, setOrdPayFilter] = useState("all");
  const [stockSearch, setStockSearch] = useState("");
  const [cartNotes, setCartNotes] = useState("");
  const [favs, setFavs] = useState([]);
  const dbToggleFav = async (productId) => { if (!dbReady || !user) return; try { const isFav = favs.includes(productId); if (isFav) { await supabase.from("user_favorites").delete().eq("user_email", user.email).eq("product_id", productId); } else { await supabase.from("user_favorites").insert({user_email: user.email, product_id: productId}); } } catch(e) { console.log("Fav error:", e); } };
  const [favFilter, setFavFilter] = useState(false);
  const [privateNotes, setPrivateNotes] = useState({});
  const [packItems, setPackItems] = useState([
    {id:1,type:"Étui",name:{fr:"Étui rigide Minuë",es:"Funda rígida Minuë",en:"Minuë hard case"},desc:{fr:"Étui noir avec logo doré, inclus avec chaque paire",es:"Funda negra con logo dorado, incluida con cada par",en:"Black case with gold logo, included with every pair"},imageUrl:"https://cdn.shopify.com/s/files/1/0783/5765/0865/files/funda_minue.jpg",on:true},
    {id:2,type:"Étui",name:{fr:"Étui souple voyage",es:"Funda blanda viaje",en:"Soft travel case"},desc:{fr:"Pochette microfibre avec cordon",es:"Bolsa microfibra con cordón",en:"Microfibre pouch with drawstring"},imageUrl:"",on:true},
    {id:3,type:"Display",name:{fr:"Présentoir comptoir 6 pièces",es:"Expositor mostrador 6 uds",en:"Counter display 6 pcs"},desc:{fr:"Présentoir en bois naturel pour 6 paires, logo gravé",es:"Expositor madera natural para 6 pares, logo grabado",en:"Natural wood display for 6 pairs, engraved logo"},imageUrl:"",on:true},
    {id:4,type:"Display",name:{fr:"Présentoir mural 12 pièces",es:"Expositor pared 12 uds",en:"Wall display 12 pcs"},desc:{fr:"Support mural élégant en métal noir",es:"Soporte pared elegante metal negro",en:"Elegant black metal wall mount"},imageUrl:"",on:true},
    {id:5,type:"Merchandising",name:{fr:"Miroir de comptoir Minuë",es:"Espejo mostrador Minuë",en:"Minuë counter mirror"},desc:{fr:"Miroir rond avec socle en laiton, logo gravé",es:"Espejo redondo con base latón, logo grabado",en:"Round mirror with brass base, engraved logo"},imageUrl:"",on:true},
    {id:6,type:"Merchandising",name:{fr:"Chiffon microfibre Minuë",es:"Paño microfibra Minuë",en:"Minuë microfibre cloth"},desc:{fr:"Chiffon nettoyant avec logo, inclus avec chaque paire",es:"Paño limpiador con logo, incluido con cada par",en:"Cleaning cloth with logo, included with every pair"},imageUrl:"",on:true}
  ]);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("");
  const [colFilter, setColFilter] = useState("all");
  const [expandedTier, setExpandedTier] = useState(-1);
  const [shapeFilter, setShapeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [filterPanel, setFilterPanel] = useState(null);
  const [userFilter, setUserFilter] = useState("all");
  const [cardQtys, setCardQtys] = useState({});
  const [ed, setEd] = useState({});

  /* ═══ SUPABASE DATA LAYER ═══ */
  const dbReady = !!supabase;
  const dbToProduct = r => ({id:r.id,model:r.model,color:r.color,sku:r.sku,col:r.collection,cat:r.category||r.collection,stock:r.stock,fixedPrice:Number(r.fixed_price)||0,tags:r.tags||[],imageUrl:r.image_url,shape:r.shape||"",colorFamily:r.color_family||""});
  const dbToUser = r => ({id:r.id,email:r.email,pw:r.password_hash||"",role:r.role,name:r.name,co:r.company||"",lang:r.lang||"fr",commRate:r.comm_rate||0,active:r.active===true,phone:r.phone||"",city:r.city||"",country:r.country||"",notes:r.notes||""});
  const dbToClient = r => ({id:r.id,userId:r.user_id,name:r.name,contact:r.contact,city:r.city,country:r.country||"FR",channel:r.channel||"Direct",customPrice:Number(r.custom_price)||0,earlyPay:!!r.early_pay,status:r.status||"prospect",notes:r.notes||"",orders:0,total:0,companyName:r.company_name||"",taxId:r.tax_id||"",address:r.address||"",postalCode:r.postal_code||"",phone:r.phone||"",companyEmail:r.company_email||"",bankHolder:r.bank_holder||"",iban:r.iban||"",bic:r.bic||"",shippingAddress:r.shipping_address||"",shippingCity:r.shipping_city||"",shippingPostal:r.shipping_postal||"",shippingCountry:r.shipping_country||""});
  const dbToOrder = (r, lines) => ({id:r.order_number,dbId:r.id,client:r.client_name,dist:r.distributor||"Direct",date:r.created_at?new Date(r.created_at).toLocaleDateString("fr-FR"):"-",status:r.status,pay:r.payment,shippingCost:Number(r.shipping_cost)||0,carrier:r.carrier||"",track:r.track_number||"",trackUrl:r.track_url||"",notes:r.notes_internal||"",clientNotes:r.notes_client||"",total:Number(r.total)||0,items:r.items_count||0,comm:Number(r.commission)||0,lines:lines||[]});
  const dbToPromo = r => ({id:r.id,name:r.name,type:r.type,disc:r.discount,cond:{fr:r.condition_fr||"",es:r.condition_es||"",en:r.condition_en||""},visible:r.visible_to||[],on:r.active!==false});
  const dbToNews = r => ({id:r.id,title:{fr:r.title_fr||"",es:r.title_es||"",en:r.title_en||""},content:{fr:r.content_fr||"",es:r.content_es||"",en:r.content_en||""},url:r.url||"",pinned:!!r.pinned,on:r.active!==false,date:r.created_at?new Date(r.created_at).toLocaleDateString("fr-FR"):"-"});
  const dbToFaq = r => ({id:r.id,q:{fr:r.question_fr||"",es:r.question_es||"",en:r.question_en||""},a:{fr:r.answer_fr||"",es:r.answer_es||"",en:r.answer_en||""},on:r.active!==false});

  useEffect(() => {
    if (!dbReady) return;
    const load = async () => {
      try {
        const {data:prods} = await supabase.from("products").select("*").eq("active",true);
        if (prods && prods.length > 0) setProducts(prods.map(dbToProduct));
        const {data:usrs} = await supabase.from("users").select("*");
        if (usrs && usrs.length > 0) setUsers(usrs.map(dbToUser));
        const {data:cls} = await supabase.from("clients").select("*");
        if (cls) { if (cls.length > 0) setClients(cls.map(dbToClient)); if (user) { const myClient = cls.find(c => c.user_id === user.id || (c.name && user.name && c.name.toLowerCase() === user.name.toLowerCase())); if (myClient) setAccountData({companyName:myClient.company_name||"",taxId:myClient.tax_id||"",address:myClient.address||"",postalCode:myClient.postal_code||"",city:myClient.city||"",country:myClient.country||"",phone:myClient.phone||"",companyEmail:myClient.company_email||"",bankHolder:myClient.bank_holder||"",iban:myClient.iban||"",bic:myClient.bic||"",shippingAddress:myClient.shipping_address||"",shippingCity:myClient.shipping_city||"",shippingPostal:myClient.shipping_postal||"",shippingCountry:myClient.shipping_country||""}); } }
        const {data:ords} = await supabase.from("orders").select("*").order("created_at",{ascending:false});
        if (ords) {
          const {data:allLines} = await supabase.from("order_lines").select("*");
          const linesByOrder = {};
          (allLines||[]).forEach(l => { if(!linesByOrder[l.order_id]) linesByOrder[l.order_id]=[]; linesByOrder[l.order_id].push({model:l.model,color:l.color,sku:l.sku,qty:l.quantity,price:Number(l.unit_price),col:l.collection,qtyReceived:l.qty_received||0}); });
          if (ords.length > 0) setOrders(ords.map(o => dbToOrder(o, linesByOrder[o.id]||[])));
        }
        const {data:prms} = await supabase.from("promos").select("*");
        if (prms && prms.length > 0) setPromos(prms.map(dbToPromo));
        const {data:nws} = await supabase.from("news").select("*").order("created_at",{ascending:false});
        if (nws && nws.length > 0) setNews(nws.map(dbToNews));
        const {data:fqs} = await supabase.from("faqs").select("*");
        if (fqs && fqs.length > 0) setFaqs(fqs.map(dbToFaq));
        const {data:tsks} = await supabase.from("tasks").select("*").order("created_at",{ascending:false});
        if (tsks && tsks.length > 0) setTasks(tsks.map(t => ({id:t.id,title:t.title,desc:t.description||"",priority:t.priority||"moyenne",area:t.area||"commercial",status:t.status||"aFaire",dueDate:t.due_date||"",assignee:t.assignee||"",date:t.created_at?new Date(t.created_at).toLocaleDateString("fr-FR"):"-"})));
        if (user && usrs) { const fresh = usrs.map(dbToUser).find(u => u.email.toLowerCase() === user.email.toLowerCase()); if (fresh && fresh.active) { setUser(fresh); try { localStorage.setItem("minue_session", JSON.stringify({user:fresh,ts:Date.now()})); } catch(e) {} } else if (fresh && !fresh.active) { setUser(null); try { localStorage.removeItem("minue_session"); } catch(e) {} } }
        if (user) { const {data:fvs} = await supabase.from("user_favorites").select("product_id").eq("user_email",user.email); if (fvs) setFavs(fvs.map(f => f.product_id)); }
        const {data:pks} = await supabase.from("packaging").select("*").order("sort_order",{ascending:true});
        if (pks && pks.length > 0) setPackItems(pks.map(r => ({id:r.id,type:r.type,name:{fr:r.name_fr||"",es:r.name_es||"",en:r.name_en||""},desc:{fr:r.desc_fr||"",es:r.desc_es||"",en:r.desc_en||""},imageUrl:r.image_url||"",on:r.active!==false})));
        if (user) { const {data:pns} = await supabase.from("private_notes").select("*").eq("author_email",user.email); if (pns) { const notesMap = {}; pns.forEach(n => { notesMap[n.client_id] = n.content; }); setPrivateNotes(notesMap); } }
      } catch(e) { console.log("DB load fallback:", e); }
      setLoading(false);
    };
    load();
  }, [dbReady, user?.email]);

  const getNextOrderNumber = async () => { if (!dbReady) return "#MN-" + String(orders.length + 1).padStart(4, "0"); try { const {data} = await supabase.from("orders").select("order_number").order("created_at",{ascending:false}).limit(1); if (data && data.length > 0) { const num = parseInt(data[0].order_number.replace(/\D/g, "")) || 0; return "#MN-" + String(num + 1).padStart(4, "0"); } return "#MN-0001"; } catch(e) { return "#MN-" + String(orders.length + 1).padStart(4, "0"); } };

  const dbSaveOrder = async (order, lines) => {
    if (!dbReady) return;
    try {
      const {data} = await supabase.from("orders").insert({order_number:order.id,client_name:order.client,distributor:order.dist,status:order.status,payment:order.pay,shipping_cost:order.shippingCost||0,carrier:order.carrier||"",track_number:order.track||"",track_url:order.trackUrl||"",notes_internal:order.notes||"",notes_client:order.clientNotes||"",total:order.total,items_count:order.items,commission:order.comm}).select().single();
      if (data && lines) { await supabase.from("order_lines").insert(lines.map(l => ({order_id:data.id,model:l.model,color:l.color,sku:l.sku,quantity:l.qty,unit_price:l.price,collection:l.col||"Essential"}))); }
    } catch(e) { console.log("DB save order:", e); }
  };

  const dbUpdateOrder = async (order) => {
    if (!dbReady || !order.dbId) return;
    try {
      await supabase.from("orders").update({status:order.status,payment:order.pay,track_number:order.track,carrier:order.carrier,track_url:order.trackUrl,notes_internal:order.notes,notes_client:order.clientNotes,total:order.total,items_count:order.items,shipping_cost:order.shippingCost,commission:order.comm}).eq("id",order.dbId);
      if (order.lines) { await supabase.from("order_lines").delete().eq("order_id",order.dbId); await supabase.from("order_lines").insert(order.lines.map(l => ({order_id:order.dbId,model:l.model,color:l.color,sku:l.sku,quantity:l.qty,unit_price:l.price,collection:l.col||"Essential"}))); }
    } catch(e) { console.log("DB update order:", e); }
  };

  const dbUpdateProduct = async (prod) => { if (!dbReady) return; try { await supabase.from("products").update({stock:prod.stock,tags:prod.tags||[],shape:prod.shape||"",color_family:prod.colorFamily||""}).eq("id",prod.id); } catch(e) { console.log('DB error:', e); } };
  const dbSaveUser = async (u) => { if (!dbReady) return; try { const hpw = await hashPw(u.pw, u.email); await supabase.from("users").insert({email:u.email,password_hash:hpw,role:u.role,name:u.name,company:u.co,lang:u.lang,comm_rate:u.commRate||0,active:true}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateUser = async (u) => { if (!dbReady) return; try { await supabase.from("users").update({name:u.name,company:u.co,password_hash:u.pw,comm_rate:u.commRate,active:u.active!==false,phone:u.phone||null,city:u.city||null,country:u.country||null,notes:u.notes||null}).eq("email",u.origEmail||u.email); } catch(e) { console.log('DB error:', e); } };
  const dbSaveClient = async (c) => { if (!dbReady) return; try { await supabase.from("clients").insert({name:c.name,contact:c.contact,city:c.city,country:c.country||"FR",channel:"Direct",status:"prospect"}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateClient = async (c) => { if (!dbReady) return; try { await supabase.from("clients").update({custom_price:c.customPrice||0,early_pay:!!c.earlyPay,status:c.status,notes:c.notes}).eq("id",c.id); } catch(e) { console.log('DB error:', e); } };
  const dbSavePromo = async (p) => { if (!dbReady) return; try { await supabase.from("promos").insert({name:p.name,type:p.type,discount:p.disc,condition_fr:p.cond?.fr,condition_es:p.cond?.es,condition_en:p.cond?.en,visible_to:p.visible,active:true}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdatePromo = async (p) => { if (!dbReady) return; try { await supabase.from("promos").update({name:p.name,type:p.type,discount:p.disc,condition_fr:p.cond?.fr,condition_es:p.cond?.es,condition_en:p.cond?.en,visible_to:p.visible,active:p.on!==false}).eq("id",p.id); } catch(e) { console.log('DB error:', e); } };
  const dbSaveNews = async (n) => { if (!dbReady) return; try { await supabase.from("news").insert({title_fr:n.title?.fr,title_es:n.title?.es,title_en:n.title?.en,content_fr:n.content?.fr,content_es:n.content?.es,content_en:n.content?.en,url:n.url||"",pinned:!!n.pinned,active:true}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateNews = async (n) => { if (!dbReady) return; try { await supabase.from("news").update({title_fr:n.title?.fr,title_es:n.title?.es,title_en:n.title?.en,content_fr:n.content?.fr,content_es:n.content?.es,content_en:n.content?.en,url:n.url||"",pinned:!!n.pinned,active:n.on!==false}).eq("id",n.id); } catch(e) { console.log('DB error:', e); } };
  const dbSaveFaq = async (f) => { if (!dbReady) return; try { await supabase.from("faqs").insert({question_fr:f.q?.fr,question_es:f.q?.es,question_en:f.q?.en,answer_fr:f.a?.fr,answer_es:f.a?.es,answer_en:f.a?.en,active:true}); } catch(e) { console.log('DB error:', e); } };
  const dbUpdateFaq = async (f) => { if (!dbReady) return; try { await supabase.from("faqs").update({question_fr:f.q?.fr,question_es:f.q?.es,question_en:f.q?.en,answer_fr:f.a?.fr,answer_es:f.a?.es,answer_en:f.a?.en,active:f.on!==false}).eq("id",f.id); } catch(e) { console.log('DB error:', e); } };
  const dbSavePackaging = async (pk) => { if (!dbReady) return; try { const {data} = await supabase.from("packaging").insert({type:pk.type,name_fr:pk.name?.fr,name_es:pk.name?.es,name_en:pk.name?.en,desc_fr:pk.desc?.fr,desc_es:pk.desc?.es,desc_en:pk.desc?.en,image_url:pk.imageUrl||"",active:true}).select().single(); return data; } catch(e) { console.log("DB error:", e); } };
  const dbUpdatePackaging = async (pk) => { if (!dbReady) return; try { await supabase.from("packaging").update({type:pk.type,name_fr:pk.name?.fr,name_es:pk.name?.es,name_en:pk.name?.en,desc_fr:pk.desc?.fr,desc_es:pk.desc?.es,desc_en:pk.desc?.en,image_url:pk.imageUrl||"",active:pk.on!==false}).eq("id",pk.id); } catch(e) { console.log("DB error:", e); } };
  const dbDeletePackaging = async (id) => { if (!dbReady) return; try { await supabase.from("packaging").delete().eq("id",id); } catch(e) { console.log("DB error:", e); } };
  const dbSavePrivateNote = async (authorEmail, clientId, content) => { if (!dbReady) return; try { await supabase.from("private_notes").upsert({author_email:authorEmail,client_id:clientId,content:content},{onConflict:"author_email,client_id"}); } catch(e) { console.log("DB error:", e); } };
  const dbSaveTask = async (t) => { if (!dbReady) return; try { await supabase.from("tasks").insert({title:t.title,description:t.desc||"",priority:t.priority||"moyenne",area:t.area||"commercial",status:t.status||"aFaire",due_date:t.dueDate||null,assignee:t.assignee||null}); } catch(e) { console.log("DB error:", e); } };
  const dbUpdateTask = async (t) => { if (!dbReady || !t.id) return; try { await supabase.from("tasks").update({title:t.title,description:t.desc||"",priority:t.priority,area:t.area,status:t.status,due_date:t.dueDate||null,assignee:t.assignee||null}).eq("id",t.id); } catch(e) { console.log("DB error:", e); } };
  const dbDeleteTask = async (id) => { if (!dbReady) return; try { await supabase.from("tasks").delete().eq("id",id); } catch(e) { console.log("DB error:", e); } };
  const dbSaveAccountData = async (data) => { if (!dbReady || !user) return; try { await supabase.from("clients").update({company_name:data.companyName,tax_id:data.taxId,address:data.address,postal_code:data.postalCode,phone:data.phone,company_email:data.companyEmail,bank_holder:data.bankHolder,iban:data.iban,bic:data.bic,shipping_address:data.shippingAddress||null,shipping_city:data.shippingCity||null,shipping_postal:data.shippingPostal||null,shipping_country:data.shippingCountry||null}).eq("user_id",user.id); } catch(e) { console.log('DB error:', e); } };

  /* i18n helper */
  const t = k => (T[k] && T[k][lang]) || (T[k] && T[k].fr) || k;

  /* Status labels (reactive to lang) */
  const SL = {confirmed:t("confirme"),shipped:t("expedie"),partial:t("partiel"),delivered:t("livre"),pending:t("enAttente"),preparing:t("enPrepa")};
  const SC = {confirmed:C.bl,shipped:C.yl,partial:C.yl,delivered:C.gn,pending:C.gr,preparing:C.dk};
  const PL = {pending:t("enAttente"),invoiced:t("facture"),paid:t("paye")};
  const PC = {pending:C.yl,invoiced:C.bl,paid:C.gn};

  /* Cart calculations — Essential uses tiers, Acetato uses fixedPrice */
  const cartEntries = Object.entries(cart).filter(([,q]) => q > 0);
  const cartCount = cartEntries.reduce((s,[,q]) => s + q, 0);
  const essentialEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col !== "Acetato"; });
  const acetatoEntries = cartEntries.filter(([id]) => { const p = products.find(x => String(x.id) === String(id)); return p && p.col === "Acetato"; });
  const essentialCount = essentialEntries.reduce((s,[,q]) => s + q, 0);
  const acetatoCount = acetatoEntries.reduce((s,[,q]) => s + q, 0);
  const activeClientName = user && user.role === "client" ? user.co : cartCl;
  const activeClient = clients.find(c => c.name === activeClientName);
  const customPrice = activeClient ? activeClient.customPrice || 0 : 0;
  const earlyPay = activeClient ? activeClient.earlyPay : false;
  const essentialUnitPrice = getPrice(essentialCount || 1, customPrice);
  const essentialTotal = essentialCount * essentialUnitPrice;
  const acetatoTotal = acetatoEntries.reduce((s,[id,q]) => { const p = products.find(x => String(x.id) === String(id)); return s + (p ? p.fixedPrice : ACETATO_PRICE) * q; }, 0);
  const cartTotal = essentialTotal + acetatoTotal;
  const earlyPaySaving = earlyPay ? cartTotal * 0.03 : 0;
  const finalTotal = cartTotal - earlyPaySaving;
  const currentTier = getTier(essentialCount || 1);
  const nextTier = getNextTier(essentialCount || 1);

  /* Distributor clients */
  const distCo = user ? (user.co||"") : "";
  const isMyChannel = (ch) => { if (!ch || !distCo) return false; const a = ch.toLowerCase().trim(); const b = distCo.toLowerCase().trim(); const bClean = b.replace(/ showroom$/i,"").replace(/ diffusion$/i,"").trim(); const aClean = a.replace(/ showroom$/i,"").replace(/ diffusion$/i,"").trim(); return a === b || aClean === bClean || b.includes(aClean) || a.includes(bClean); };
  const distClients = clients.filter(c => isMyChannel(c.channel));
  const distLabel = distCo.replace(/ Showroom$/i,"").trim() || "Direct";

  /* Distributor dashboard KPIs (pre-calculated, no IIFE needed) */
  const distOrders = orders.filter(o => isMyChannel(o.dist));
  const distSales = distOrders.reduce((s, o) => s + o.total, 0);
  const distComm = distOrders.reduce((s, o) => s + o.comm, 0);
  const distPaid = distOrders.filter(o => o.pay === "paid").reduce((s, o) => s + o.comm, 0);
  const distInvoiced = distOrders.filter(o => o.pay === "invoiced").reduce((s, o) => s + o.comm, 0);

  /* newOrd modal calculations */
  const edLines = ed.lines || [];
  const edQty = edLines.reduce((s, l) => s + l.qty, 0);
  const edCp = (modal === "newOrd" && clients.find(c => c.name === ed.client)) ? clients.find(c => c.name === ed.client).customPrice || 0 : 0;
  const edUp = getPrice(edQty || 1, edCp);
  const edTotal = edQty * edUp;

  /* Cart actions */
  const addToCart = (id, qty) => setCart(p => ({...p, [id]: (p[id] || 0) + (qty || 2)}));
  const setCardQty = (id, q) => setCardQtys(p => ({...p, [id]: Math.max(1, q)}));
  const getCardQty = (id) => cardQtys[id] || 2;
  const updateQty = (id, q) => {
    if (q <= 0) { setCart(p => { const n = {...p}; delete n[id]; return n; }); }
    else { setCart(p => ({...p, [id]: q})); }
  };

  /* Place order */
  const doOrder = () => {
    const lines = cartEntries.map(([id, q]) => {
      const p = products.find(x => String(x.id) === String(id));
      const price = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice;
      return {model: p.model, color: p.color, sku: p.sku, qty: q, price, col: p.col};
    });
    const newOrder = {
      id: "#MN-" + String(orders.length + 1).padStart(4, "0"),
      client: activeClientName || "—",
      dist: user.role === "distributor" ? distLabel : "Direct",
      date: new Date().toLocaleDateString("fr-FR"),
      items: cartCount, total: finalTotal,
      comm: user.role === "distributor" ? finalTotal * 0.15 : 0,
      status: "confirmed", pay: "pending", shippingCost: cartCount >= 20 ? 0 : 0, track: "", carrier: "", trackUrl: "", notes: "", clientNotes: cartNotes, lines
    };
    setOrders(p => [newOrder, ...p]);
    dbSaveOrder(newOrder, lines);
    setCart({}); setCartCl(""); setCartNotes(""); setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView(user.role === "distributor" ? "d-ord" : "c-ord"); }, 1500);
  };

  /* ═══ LOGIN SCREEN ═══ */
  const doLogin = async () => {
    const hashed = await hashPw(loginPw, loginEmail); const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && (u.pw === hashed || (u.pw.length !== 64 && u.pw === loginPw)));
    if (!found || found.active === false) { setLoginErr(t("errLogin")); return; }
    setLoginErr("");
    if (found.pw.length !== 64 && dbReady) { supabase.from("users").update({password_hash: hashed}).eq("email", found.email); found.pw = hashed; }
    setUser(found); try { localStorage.setItem("minue_session", JSON.stringify({user:found,ts:Date.now()})); } catch(e) { console.log('DB error:', e); }
    setLang(found.lang || "fr");
    setView(found.role === "admin" ? "a-stats" : found.role === "distributor" ? "d-dash" : "c-home");
  };

  const doRegister = () => {
    if (!regData.name || !regData.email || !regData.pw) { setLoginErr(t("errLogin")); return; }
    if (regData.pw.length < 8) { setLoginErr("Min. 8 caractères"); return; }
    if (regData.pw !== regData.pw2) { setLoginErr(t("pwNoMatch")); return; }
    if (users.find(u => u.email.toLowerCase() === regData.email.toLowerCase())) { setLoginErr("Email exists"); return; }
    const nu = {email:regData.email, pw:regData.pw, role:"client", name:regData.name, co:regData.co, lang, commRate:0, active:false, phone:regData.phone, city:regData.city, country:regData.country, notes:"Solicitud de acceso"};
    setUsers(p => [...p, nu]); dbSaveUser(nu);
    setLoginErr("");
    setRegSent(true);
  };

  if (!user && loading) { return (<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.bg}}><img src={LOGO} alt="Minue" style={{width:80,height:80,objectFit:"contain",borderRadius:12,marginBottom:12,opacity:0.7}} /><div style={{fontSize:12,fontFamily:BD,color:C.gr}}>Chargement...</div></div>); }
  if (!user) {
    return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:DP}}>
        <img src={LOGO} alt="Minuë" style={{width:"min(120px, 30vw)",height:"min(120px, 30vw)",objectFit:"contain",borderRadius:16,marginBottom:8}} />
        <div style={{letterSpacing:4,fontSize:13,color:C.gr,marginBottom:12,fontFamily:BD}}>Eyewear · B2B Portal</div>
        <div style={{display:"flex",gap:4,marginBottom:36}}>
          {["fr","es","en"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{background:lang===l?C.dk:"transparent",color:lang===l?C.bg:C.gr,border:"1px solid "+(lang===l?C.dk:C.ln),cursor:"pointer",fontSize:12,padding:"5px 10px",borderRadius:3,fontFamily:BD}}>{FLAGS[l]}</button>
          ))}
        </div>

        {regSent ? (
          <div style={{background:C.wh,borderRadius:6,padding:"34px 38px",width:"min(390px, 88vw)",border:"1px solid "+C.ln,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>✓</div>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:600,marginBottom:8}}>{t("demandeEnvoyee")}</div>
            <button onClick={() => { setRegSent(false); setRegisterMode(false); }} style={{fontSize:12,fontFamily:BD,color:C.gn,background:"none",border:"none",cursor:"pointer",marginTop:12}}>{t("retourLogin")}</button>
          </div>
        ) : !registerMode ? (
          <div style={{background:C.wh,borderRadius:6,padding:"34px 38px",width:"min(390px, 88vw)",border:"1px solid "+C.ln}}>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:C.gr,fontFamily:BD,marginBottom:5,fontWeight:500}}>{t("email")}</div>
              <input type="email" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="you@store.com" style={{width:"100%",padding:"11px 12px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:C.gr,fontFamily:BD,marginBottom:5,fontWeight:500}}>{t("motDePasse")}</div>
              <input type="password" value={loginPw} onChange={e => { setLoginPw(e.target.value); setLoginErr(""); }} onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="********" style={{width:"100%",padding:"11px 12px",border:"1px solid "+(loginErr?C.rd:C.ln),borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              {loginErr && <div style={{fontSize:11,color:C.rd,fontFamily:BD,marginTop:6}}>{loginErr}</div>}
            </div>
            <Btn onClick={doLogin} style={{width:"100%",padding:"13px 0",fontSize:13}}>{t("connexion")}</Btn>
            <div style={{textAlign:"center",marginTop:16}}>
              <button onClick={() => { setRegisterMode(true); setLoginErr(""); }} style={{fontSize:11,fontFamily:BD,color:C.gn,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>{t("solliciterAcces")}</button>
            </div>
          </div>
        ) : (
          <div style={{background:C.wh,borderRadius:6,padding:"28px 34px",width:"min(420px, 90vw)",border:"1px solid "+C.ln}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:4}}>{t("solliciterAcces").split("?")[1]||t("solliciterAcces")}</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:18}}>{t("bienvenidaSub")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")} *</div>
                <input value={regData.name} onChange={e => setRegData(p => ({...p, name:e.target.value}))} placeholder="Marie Dupont" style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")} *</div>
                <input value={regData.co} onChange={e => setRegData(p => ({...p, co:e.target.value}))} placeholder="Optique Paris" style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")} *</div>
              <input type="email" value={regData.email} onChange={e => setRegData(p => ({...p, email:e.target.value}))} placeholder="contact@store.com" style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("motDePasse")} *</div>
                <input type="password" value={regData.pw} onChange={e => setRegData(p => ({...p, pw:e.target.value}))} placeholder="min. 6" style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("confirmerPw")} *</div>
                <input type="password" value={regData.pw2} onChange={e => setRegData(p => ({...p, pw2:e.target.value}))} placeholder="min. 6" style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div>
                <input value={regData.city} onChange={e => setRegData(p => ({...p, city:e.target.value}))} style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div>
                <input value={regData.country} onChange={e => setRegData(p => ({...p, country:e.target.value}))} placeholder="FR, ES..." style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <input value={regData.phone} onChange={e => setRegData(p => ({...p, phone:e.target.value}))} placeholder="+33..." style={{width:"100%",padding:"9px 10px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            {loginErr && <div style={{fontSize:11,color:C.rd,fontFamily:BD,marginBottom:8}}>{loginErr}</div>}
            <Btn onClick={doRegister} style={{width:"100%",padding:"12px 0",fontSize:13}}>{t("envoyerDemande")}</Btn>
            <div style={{textAlign:"center",marginTop:12}}>
              <button onClick={() => { setRegisterMode(false); setLoginErr(""); }} style={{fontSize:11,fontFamily:BD,color:C.gr,background:"none",border:"none",cursor:"pointer"}}>{t("retourLogin")}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ═══ ROLE & NAV CONFIG ═══ */
  const role = user.role;
  const navItems = role === "client"
    ? [["c-home","accueil"],["c-cat","catalogue"],["c-cart","panier"],["c-selection","selectionPrivee"],["c-ord","commandes"],["c-tarifs","tarifs"],["c-promo","promos"],["c-news","nouveautes"],["c-pack","packaging"],["c-res","ressources"],["c-help","faq"],["c-account","monCompte"]]
    : role === "distributor"
    ? [["d-dash","dashboard"],["d-cat","catalogue"],["d-cart","panier"],["d-tarifs","tarifs"],["d-selection","selectionPrivee"],["d-ord","commandes"],["d-cl","clients"],["d-promo","promos"],["d-news","nouveautes"],["d-pack","packaging"],["d-help","faq"],["d-account","monCompte"]]
    : [["a-stats","stats"],["a-ord","commandes"],["a-cl","clients"],["a-dist","distributeurs"],["a-stock","stock"],["a-inv","factures"],["a-promo","promos"],["a-news","nouveautes"],["a-pack","packaging"],["a-tasks","tareas"],["a-users","utilisateurs"],["a-faq","faq"]];

  /* ═══ RENDERABLE SECTIONS ═══ */
  const renderNav = () => {
    const rc = role==="admin"?"#e8a87c":role==="distributor"?"#87ceeb":"#c4956a";
    return (
    <nav style={{background:darkMode?"#141c1a":CL.dk,position:"sticky",top:0,zIndex:100}}>
      {/* TOP BAR */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px min(16px, 3vw)",borderBottom:"1px solid rgba(248,239,230,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",minWidth:0}} onClick={() => setView(navItems[0][0])}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <img src={LOGO} alt="Minuë" style={{height:"min(88px, 22vw)",borderRadius:4}} />
            <span style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"rgba(248,239,230,0.5)",background:"rgba(248,239,230,0.08)",padding:"2px 8px",borderRadius:3,marginTop:4,letterSpacing:2,textTransform:"uppercase"}}>Beta</span>
          </div>
          <span style={{fontSize:8,padding:"2px 7px",fontFamily:BD,color:rc,background:"rgba(248,239,230,0.08)",fontWeight:600,borderRadius:8,textTransform:"uppercase",letterSpacing:0.3,whiteSpace:"nowrap"}}>{t(role==="distributor"?"distributeur":role)}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          {["fr","es","en"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{width:24,height:24,borderRadius:12,background:lang===l?"rgba(248,239,230,0.15)":"transparent",border:"none",cursor:"pointer",fontSize:10,color:lang===l?C.bg:"rgba(248,239,230,0.3)",fontFamily:BD,fontWeight:600}}>{l.toUpperCase()}</button>
          ))}
          <div style={{width:1,height:14,background:"rgba(248,239,230,0.1)",margin:"0 2px"}} />
          {(() => {
            const notifs = role === "admin"
              ? [...users.filter(u => u.active === false && u.role !== "admin").map(u => ({type:"access",text:u.name+" — "+t("solliciterAcces"),go:"a-users"})),
                 ...tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").map(tk => ({type:"task",text:"⚠ "+tk.title,go:"a-tasks"})),
                 ...products.filter(p => p.stock === 0).slice(0,3).map(p => ({type:"stock",text:p.model+" "+p.color+" — "+t("agotado"),go:"a-stock"}))]
              : role === "distributor"
              ? [...orders.filter(o => isMyChannel(o.dist) && (o.status === "shipped" || o.status === "delivered")).slice(0,5).map(o => ({type:"order",text:o.id+" → "+SL[o.status],go:"d-ord"}))]
              : [...orders.filter(o => o.client === (user.name||user.co)).slice(0,5).map(o => ({type:"order",text:o.id+" → "+SL[o.status],go:"c-ord"})),
                 ...promos.filter(p => p.on && (p.visible||[]).includes("client")).slice(0,2).map(p => ({type:"promo",text:"🎁 "+p.name,go:"c-promo"}))];
            const count = notifs.length;
            return <>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{width:26,height:26,borderRadius:13,background:count>0?"rgba(248,239,230,0.15)":"rgba(248,239,230,0.08)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(248,239,230,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {count > 0 && <span style={{position:"absolute",top:-2,right:-4,width:16,height:16,borderRadius:8,background:"#e74c3c",fontSize:9,fontWeight:700,fontFamily:BD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{count>9?"9+":count}</span>}
              </button>
              {notifOpen && <div style={{position:"fixed",top:48,right:12,width:"min(340px, 85vw)",maxHeight:"60vh",background:C.wh,borderRadius:8,border:"1px solid "+C.ln,boxShadow:"0 8px 30px rgba(24,51,47,0.15)",zIndex:200,overflow:"hidden"}} onClick={e => e.stopPropagation()}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:700}}>Notifications</span>
                  <button onClick={() => setNotifOpen(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.gr}}>✕</button>
                </div>
                <div style={{overflowY:"auto",maxHeight:"calc(60vh - 50px)"}}>
                  {notifs.length === 0 && <div style={{padding:30,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>✓ {t("aucuneCmd")}</div>}
                  {notifs.map((n,i) => (
                    <div key={i} onClick={() => { setView(n.go); setNotifOpen(false); }} style={{padding:"10px 16px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD,color:C.dk,display:"flex",alignItems:"center",gap:8,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e => e.currentTarget.style.background=C.bg} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <span style={{width:6,height:6,borderRadius:3,background:n.type==="access"?"#f39c12":n.type==="task"?C.rd:n.type==="stock"?C.yl:C.gn,flexShrink:0}} />
                      <span>{n.text}</span>
                    </div>
                  ))}
                </div>
              </div>}
            </>;
          })()}
          <div style={{width:1,height:14,background:"rgba(248,239,230,0.1)",margin:"0 2px"}} />
          {role === "client" && activeClient && activeClient.status === "vip" && <span style={{fontSize:8,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#d4a03020,#c4903a20)",padding:"2px 7px",borderRadius:4,letterSpacing:1.5,border:"1px solid #d4a03040"}}>VIP</span>}
          <div onClick={() => setProfileOpen(!profileOpen)} style={{width:26,height:26,borderRadius:13,background:rc+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:BD,color:rc,flexShrink:0,cursor:"pointer",position:"relative"}}>{user.name[0]}</div>
          <button onClick={() => { setUser(null); setCart({}); setLoginEmail(""); setLoginPw(""); try { localStorage.removeItem("minue_session"); localStorage.removeItem("minue_view"); } catch(e) { console.log('DB error:', e); } }} style={{background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center",flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(248,239,230,0.35)" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
      {/* TABS */}
      <div style={{display:"flex",padding:"0 8px",overflowX:"auto",WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none"}}>
        {navItems.map(([v, k]) => {
          const on = view === v;
          const isCart = k === "panier" && cartCount > 0;
          return (
            <button key={v} onClick={() => setView(v)} style={{position:"relative",background:"none",border:"none",padding:"8px min(12px, 2.5vw)",cursor:"pointer",fontSize:"min(13px, 3.2vw)",fontFamily:BD,fontWeight:on?600:400,color:on?"#f8efe6":"rgba(248,239,230,0.4)",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              {t(k)}
              {isCart && <span style={{background:C.gn,color:"#fff",fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:6,fontFamily:BD}}>{cartCount}</span>}
              {on && <div style={{position:"absolute",bottom:0,left:12,right:12,height:2,background:rc,borderRadius:1}} />}
            </button>
          );
        })}
      </div>
    </nav>
    );
  };


  const renderTierBar = () => {
    if (essentialCount === 0 || customPrice > 0) return null;
    const pct = nextTier ? Math.min(100, ((essentialCount - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;
    const unitsToNext = nextTier ? nextTier.min - essentialCount : 0;
    const saving = nextTier ? (essentialUnitPrice - nextTier.price) * essentialCount : 0;
    return (
      <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontFamily:BD,fontSize:12,color:C.dk,fontWeight:600}}>{t("tarifActuel")} Essential: {fmt(essentialUnitPrice)} €/ud ({currentTier.label})</span>
          {nextTier && <span style={{fontFamily:BD,fontSize:11,color:C.gn,fontWeight:500}}>{t("prochain")}: {fmt(nextTier.price)} €</span>}
        </div>
        <div style={{height:6,background:C.bg2,borderRadius:3,overflow:"hidden",marginBottom:6}}>
          <div style={{height:6,background:nextTier?C.yl:C.gn,borderRadius:3,width:pct+"%",transition:"width 0.4s"}} />
        </div>
        {nextTier
          ? <span style={{fontFamily:BD,fontSize:11,color:C.yl}}>+{unitsToNext} uds = {fmt(nextTier.price)} €/ud ({t("economisez")} {fmt(saving)} €)</span>
          : <span style={{fontFamily:BD,fontSize:11,color:C.gn}}>{t("meilleurTarif")}</span>
        }
      </div>
    );
  };

  const colorDot = {Black:"#1a1a1a",Carey:"#8B6914","Brown Carey":"#7B5B2A",Brown:"#6B3A2A",Tea:"#c4956a",Cloud:"#d4cfc8",Mint:"#7ec8a0",Cocoa:"#5c3a28",Champagne:"#e8d5b8",Green:"#3d6b4f",Bronze:"#8b6914",Shade:"#5a5a6a",Sienna:"#a0522d",Olive:"#6b7a3a",Felline:"#8a7a5a",Chalk:"#e8e0d0",Mocha:"#7a5c40",Sepia:"#704214",Bold:"#2a2a3a",Apple:"#5c8a3a",Guiza:"#9a7a4a",Velvet:"#5a2a4a",Coffee:"#4a3020","Amber Doré":"#c5a55a",Burnt:"#8a3a1a",Jungle:"#2a5a3a",Noir:"#1a1a1a",Petal:"#d4839a","Hunter Blend":"#4a5a3a",Shadow:"#4a4a5a",Dusty:"#c4a090","Pale Sandstone":"#d4c4a8",Dusy:"#c4a090",Honey:"#d4a040",Sunset:"#d47a3a",Caramel:"#a0742a",Mandarine:"#d4763a",Bruma:"#a0a0b0",Ebony:"#2a2a2a",Nude:"#d4b8a0",Oliva:"#6b7a3a",Wine:"#722f37",Jara:"#8a3a4a",Matcha:"#7a9a5a",Leaf:"#4a7a3a",Greenwave:"#3a8a6a",Buttercup:"#d4a830",Havana:"#6b4a2a",Grass:"#4a8a3a",Tiger:"#b87a30",Sierra:"#a06030","Gold Green":"#8aa050",Kaffa:"#5a3a2a",Navy:"#2a3a6a",Carbon:"#3a3a3a","Carey Brown":"#7a5a3a","Gold-Black":"#2a2a2a","Gold-Brown":"#8a6a30","Gold-Green":"#6a8a30",Carrot:"#d47030",Peanut:"#c4a060",Jasper:"#8a4a3a","Green Carey":"#5a7a3a",Ember:"#b04a2a","Black Cherry":"#4a1a2a",Snow:"#e8e8e8",Toffee:"#8a5a2a",Cream:"#f0e0c8",Rowan:"#8a3a2a",Cedar:"#6a3a1a",Rosse:"#c04a5a",Copo:"#e0e8f0",Jade:"#3a8a6a",Ruby:"#9a2a3a",Agate:"#8a7a6a",Amber:"#c4903a","Carbon Mate":"#3a3a3a",Louvre:"#8a8a8a",Dark:"#2a2a2a",Bay:"#6a8a5a",Lightblue:"#7aacca",Opal:"#b0c0d0",Ambar:"#c4903a"};

  const renderModelCard = (modelName, variants) => {
    const first = variants.find(v => v.imageUrl) || variants[0];
    const isAcetato = first.col === "Acetato";
    const displayPrice = isAcetato ? first.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
    const totalStock = variants.reduce((s,v) => s + v.stock, 0);
    const inCartCount = variants.reduce((s,v) => s + (cart[v.id]||0), 0);
    const tags = [...new Set(variants.flatMap(v => v.tags||[]))];
    const tagConf = {top:{l:t("topVenta"),c:"#c4956a"},new:{l:t("nuevo"),c:"#8e44ad"},rec:{l:t("recomendado"),c:"#722f37"},icons:{l:"Icons",c:"#b8860b"},privee:{l:"Privée",c:"#18332f"}};
    const hasFav = variants.some(v => favs.includes(v.id));
    return (
      <div key={modelName} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",cursor:"pointer"}} onClick={() => { setModal("viewModel"); setEd({model:modelName, variants}); }}>
        <div style={{height:"min(168px, 40vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",color:C.ln,fontFamily:DP,letterSpacing:2,overflow:"hidden"}}>
          {first.imageUrl ? <img src={first.imageUrl} alt={modelName} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : "MINUË"}
          <span style={{position:"absolute",top:8,left:8,fontSize:9,color:isAcetato?"#7a5c3a":first.col==="Icons"?"#b8860b":C.gr,fontFamily:BD,background:isAcetato?"#e8d5c0":first.col==="Icons"?"#f5ecd8":"rgba(255,255,255,0.85)",padding:"2px 7px",borderRadius:3,fontWeight:500}}>{first.col}</span>
          {tags.length > 0 && <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:3}}>
            {tags.filter(tg => tg !== "icons").map(tg => tagConf[tg] ? <span key={tg} style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:tagConf[tg].c,padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:0.3}}>{tagConf[tg].l}</span> : null)}
          </div>}
          {inCartCount > 0 && <span style={{position:"absolute",bottom:8,right:8,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:3}}>x{inCartCount}</span>}
          {hasFav && <span style={{position:"absolute",top:8,right:38,fontSize:12}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b4c3b" stroke="#6b4c3b" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>}
          <span style={{position:"absolute",top:8,right:8,fontSize:9,fontFamily:BD,color:totalStock<10?"#fff":C.dk,background:totalStock<10?C.rd:totalStock<20?C.yl+"30":"rgba(255,255,255,0.85)",padding:"3px 7px",borderRadius:10,fontWeight:600}}>{totalStock}</span>
        </div>
        <div style={{padding:"12px 14px",background:"#faf6f1"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <span style={{fontSize:15,fontWeight:600,fontFamily:DP,color:C.dk}}>{modelName}</span>
            <span style={{fontSize:13,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</span>
          </div>
          <div style={{display:"flex",gap:4,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
            {variants.slice(0,7).map(v => <div key={v.id} title={v.color} style={{width:16,height:16,borderRadius:8,background:colorDot[v.color]||"#aaa",border:"2px solid "+(cart[v.id]>0?C.gn:v.stock<5?C.rd+"50":"#e0d8d0"),flexShrink:0}} />)}
            {variants.length > 7 && <span style={{fontSize:9,fontFamily:BD,color:C.gr}}>+{variants.length-7}</span>}
          </div>
          <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:6}}>{variants.length} {t("couleurs")}</div>
        </div>
      </div>
    );
  };

  const renderCard = (p) => {
    const inCart = cart[p.id] > 0;
    const isAcetato = p.col === "Acetato";
    const displayPrice = isAcetato ? p.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
    const cq = getCardQty(p.id);
    const tags = p.tags || [];
    const tagConf = {top:{l:t("topVenta"),c:"#c4956a"},new:{l:t("nuevo"),c:"#8e44ad"},rec:{l:t("recomendado"),c:"#722f37"},icons:{l:"Icons",c:"#b8860b"},privee:{l:"Privée",c:"#18332f"}};
    return (
      <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
        <div style={{height:"min(168px, 40vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",color:C.ln,fontFamily:DP,letterSpacing:2,overflow:"hidden"}}>
          {p.imageUrl ? <img src={p.imageUrl} alt={p.model+" "+p.color} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : "MINUË"}
          <span style={{position:"absolute",top:8,left:8,fontSize:9,color:isAcetato?"#7a5c3a":C.gr,fontFamily:BD,background:isAcetato?"#e8d5c0":"rgba(255,255,255,0.85)",padding:"2px 7px",borderRadius:3,fontWeight:500}}>{p.col}</span>
          <span style={{position:"absolute",top:8,right:8,fontSize:9,fontFamily:BD,color:"#fff",background:p.stock<5?C.rd:p.stock<10?C.yl:C.gn,width:26,height:26,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{p.stock}</span>
          {tags.length > 0 && <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:3}}>
            {tags.map(tg => tagConf[tg] ? <span key={tg} style={{fontSize:8,fontFamily:BD,fontWeight:700,color:"#fff",background:tagConf[tg].c,padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:0.3}}>{tagConf[tg].l}</span> : null)}
          </div>}
          {inCart && <span style={{position:"absolute",bottom:8,right:8,fontSize:9,fontFamily:BD,color:C.bg,background:C.gn,padding:"2px 8px",borderRadius:3}}>x{cart[p.id]}</span>}
          {role !== "admin" && <button onClick={(e) => { e.stopPropagation(); setFavs(f => f.includes(p.id) ? f.filter(x => x!==p.id) : [...f, p.id]); dbToggleFav(p.id); }} style={{position:"absolute",top:8,right:role==="admin"?42:38,background:"rgba(255,255,255,0.85)",border:"none",cursor:"pointer",width:26,height:26,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={favs.includes(p.id)?"#6b4c3b":"none"} stroke={favs.includes(p.id)?"#6b4c3b":"#999"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>}
        </div>
        <div style={{padding:"12px 14px",background:darkMode?C.bg2:"#faf6f1"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <span style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</span>
            <span style={{fontSize:14,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(displayPrice)} €</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:2}}>
            <span style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color}</span>
            <span style={{fontSize:9,fontFamily:BD,color:C.gr2}}>PVP {isAcetato ? "70" : "45-50"} €</span>
          </div>
          <div style={{fontSize:10,color:C.gr2,fontFamily:BD,marginTop:1}}>{p.sku}</div>
          <div style={{display:"flex",gap:6,marginTop:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",border:"1px solid "+C.ln,borderRadius:3,overflow:"hidden"}}>
              <button onClick={() => setCardQty(p.id, cq - 1)} style={{width:28,height:30,background:C.bg,border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,color:C.dk}}>-</button>
              <span style={{minWidth:28,textAlign:"center",fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{cq}</span>
              <button onClick={() => setCardQty(p.id, cq + 1)} style={{width:28,height:30,background:C.bg,border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,color:C.dk}}>+</button>
            </div>
            <button onClick={() => addToCart(p.id, cq)} style={{flex:1,padding:"7px 0",background:C.dk,color:C.bg,border:"none",fontSize:11,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:500}}>{t("ajouterPanier")}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderRow = (o, i, showComm, showDist) => (
    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 14px",borderBottom:"1px solid "+C.bg2,background:C.wh,flexWrap:"wrap",cursor:"pointer"}} onClick={() => { if (role === "admin") { setModal("editOrd"); setEd({...o, idx: orders.indexOf(o)}); } else { setModal("viewOrd"); setEd({...o}); }}}>
      <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{o.id}</span>
      <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:"1 1 80px",minWidth:60}}>{o.client}</span>
      <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{o.date}</span>
      <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
      <Badge l={SL[o.status]} c={SC[o.status]} />
      <Badge l={PL[o.pay]} c={PC[o.pay]} />
      <span style={{fontSize:10,fontFamily:BD,color:C.bl}}>→</span>
    </div>
  );

  const exportCSV = (filename, headers, rows) => {
    const clean = v => String(v||"").replace(/"/g,'""').replace(/\n/g,' ');
    const csv = [headers.join(";"), ...rows.map(r => r.map(v => '"'+clean(v)+'"').join(";"))].join("\r\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const exportClients = () => {
    const h = ["Nom","Contact","Email","Ville","CP","Pays","Canal","Status","Prix custom","Early Pay","Tel","Adresse","Raison sociale","NIF","Notes"];
    const rows = clients.map(c => [c.name||"",c.contact||"",c.companyEmail||"",c.city||"",c.postalCode||"",c.country||"",c.channel||"",c.status||"",c.customPrice||0,c.earlyPay?"Oui":"Non",c.phone||"",c.address||"",c.companyName||"",c.taxId||"",c.notes||""]);
    exportCSV("minue_clients_"+new Date().toISOString().slice(0,10)+".csv", h, rows);
  };
  const exportOrders = () => {
    const h = ["No","Client","Distributeur","Date","Unites","Total","Status","Paiement","Transporteur","Tracking","Notes"];
    const rows = orders.map(o => [o.id||"",o.client||"",o.dist||"",o.date||"",o.items||0,o.total||0,o.status||"",o.pay||"",o.carrier||"",o.track||"",o.clientNotes||""]);
    exportCSV("minue_pedidos_"+new Date().toISOString().slice(0,10)+".csv", h, rows);
  };

  const renderKPI = (label, value, accent) => (
    <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 14px"}}>
      <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
      <div style={{fontSize:"min(24px, 5.5vw)",fontWeight:600,fontFamily:BD,color:accent||C.dk,lineHeight:1.1}}>{value}</div>
    </div>
  );

  /* ═══ MODAL ═══ */
  const renderModal = () => {
    if (!modal) return null;
    const titles = {editCl:t("condComm"),editSt:t("editerStock"),newProd:t("nouveauProduit"),newOrd:t("nouvelleCmd"),editOrd:t("modifierCmd"),viewOrd:t("detailCmd"),newCl:t("nouveauClient"),newUser:t("nouveauUser"),editUser:t("editUser"),newPromo:t("nouveauPromo"),editPromo:t("editPromo"),newNews:t("nouvelleNouveaute"),editNews:t("titreNouveaute"),viewInv:t("factureDetail"),newFaq:t("nouvelleFaq"),editFaq:t("questionLabel"),newTask:t("nouvelleTache"),editTask:t("titreTache")};
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={() => setModal(null)}>
        <div style={{background:C.wh,padding:"24px 20px",borderRadius:8,width:"100%",maxWidth:480,maxHeight:"90vh",overflow:"auto",margin:"0 16px"}} onClick={e => e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontSize:18,fontWeight:400,fontFamily:DP,color:C.dk,margin:0}}>{titles[modal] || ""}</h2>
            <button onClick={() => setModal(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.gr}}>x</button>
          </div>

          {/* EDIT CLIENT */}
          {modal === "editCl" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.name}</span>
              <Badge l={ed.status==="vip"?"VIP":ed.status==="prospect"?t("prospect"):t("actif")} c={ed.status==="vip"?C.yl:ed.status==="prospect"?C.gr2:C.gn} />
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:16}}>{ed.contact} · {ed.city}, {ed.country} · {ed.channel}</div>
            <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid "+C.ln,overflowX:"auto"}}>
              {[["resume",t("resumeClient")],["info",t("fichaCliente")],...(role==="admin"?[["cond",t("condiciones")]]:[]),["notes",t("notesPrivees")]].map(([v,l]) => (
                <button key={v} onClick={() => setEd(p => ({...p, _tab:v}))} style={{padding:"8px 14px",background:"none",border:"none",borderBottom:"2px solid "+((ed._tab||"resume")===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:(ed._tab||"resume")===v?600:400,color:(ed._tab||"resume")===v?C.dk:C.gr,whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>

            {/* RESUME TAB */}
            {(ed._tab||"resume") === "resume" && (() => {
              const clOrders = orders.filter(o => o.client === ed.name);
              const totalSpent = clOrders.reduce((s,o) => s + o.total, 0);
              const totalUnits = clOrders.reduce((s,o) => s + o.items, 0);
              const lastOrd = clOrders[0];
              return <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:16}}>
                  {renderKPI(t("nbCommandes"), String(clOrders.length))}
                  {renderKPI(t("totalDepense"), fmt(totalSpent)+" €", C.gn)}
                  {renderKPI(t("unites"), String(totalUnits))}
                  {renderKPI(t("dernierCmd"), lastOrd ? lastOrd.date : "—")}
                </div>
                {clOrders.length > 0 ? <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:250,overflowY:"auto"}}>
                  {clOrders.map((o,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                      <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.date}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds · {fmt(o.total)} €</span>
                      <Badge l={SL[o.status]} c={SC[o.status]} />
                    </div>
                  ))}
                </div> : <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:20}}>—</div>}
              </>;
            })()}

            {(ed._tab||"resume") === "info" && <>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("datosPersonales")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("boutique"),"name"],[t("contact"),"contact"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"],[t("ville"),"city"],[t("pays"),"country"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <input value={ed[k]||""} onChange={e => setEd(p => ({...p,[k]:e.target.value}))} style={{width:"100%",padding:7,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,boxSizing:"border-box"}} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("dirEnvio")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontFamily:BD,color:C.dk,padding:"7px 0"}}>{ed[k] || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("dirFacturacion")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                  {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("codePostal"),"postalCode"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontFamily:BD,color:C.dk,padding:"7px 0"}}>{ed[k] || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("donneesBancaires")}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
                  {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontFamily:BD,color:C.dk,padding:"7px 0"}}>{ed[k] || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <div style={{display:"flex",gap:6}}>
                  {[["prospect",t("prospect")],["active",t("actif")],["vip","VIP"]].map(([v,l]) => (
                    <button key={v} onClick={() => setEd(p => ({...p, status:v}))} style={{padding:"5px 12px",background:ed.status===v?C.dk:"transparent",color:ed.status===v?C.bg:C.gr,border:"1px solid "+(ed.status===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{l}</button>
                  ))}
                </div>
              </div>
            </>}

            {(ed._tab||"resume") === "cond" && <>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:16,marginBottom:16}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <button onClick={() => setEd(p => ({...p, customPrice: 0}))} style={{flex:1,padding:10,background:ed.customPrice===0?C.dk:C.wh,color:ed.customPrice===0?C.bg:C.dk,border:"1px solid "+(ed.customPrice===0?C.dk:C.ln),borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",fontWeight:500}}>{t("tarifAuto")}</button>
                  <button onClick={() => setEd(p => ({...p, customPrice: p.customPrice || 19.90}))} style={{flex:1,padding:10,background:ed.customPrice>0?C.dk:C.wh,color:ed.customPrice>0?C.bg:C.dk,border:"1px solid "+(ed.customPrice>0?C.dk:C.ln),borderRadius:4,fontSize:11,fontFamily:BD,cursor:"pointer",fontWeight:500}}>{t("prixFixe")}</button>
                </div>
                {ed.customPrice > 0
                  ? <><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("prixUnit")}</div><input type="number" step="0.10" value={ed.customPrice} onChange={e => setEd(p => ({...p, customPrice: parseFloat(e.target.value) || 0}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:14,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600}} /></>
                  : <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{t("prixAutoDesc")}</div>
                }
              </div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:16,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{t("prontoPago")}</div><div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{t("prontoDesc")}</div></div>
                <button onClick={() => setEd(p => ({...p, earlyPay: !p.earlyPay}))} style={{width:44,height:24,borderRadius:12,background:ed.earlyPay?C.gn:C.ln,border:"none",cursor:"pointer",position:"relative"}}>
                  <div style={{width:18,height:18,borderRadius:9,background:C.wh,position:"absolute",top:3,left:ed.earlyPay?23:3,transition:"left 0.2s"}} />
                </button>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesComm")}</div>
                <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={2} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            </>}

            {/* PRIVATE NOTES TAB */}
            {(ed._tab||"resume") === "notes" && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:10}}>{t("notesPriveesDesc")}</div>
              <textarea value={ed.privateNotes || ""} onChange={e => setEd(p => ({...p, privateNotes: e.target.value}))} rows={6} placeholder="..." style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:6,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} />
            </>}

            <div style={{display:"flex",gap:8,marginTop:12}}>
              <Btn onClick={() => { setClients(p => p.map(c => c.id === ed.id ? {...c, ...ed, _tab:undefined} : c)); if(ed.privateNotes !== undefined && user) dbSavePrivateNote(user.email, String(ed.id), ed.privateNotes||""); dbUpdateClient(ed); setModal(null); }} style={{flex:1}}>{t("enregistrerCond")}</Btn>
              <Btn ghost onClick={() => { if(confirm(t("confirmarEliminar"))){ setClients(p => p.filter(c => c.id !== ed.id)); setModal(null); }}} style={{color:C.rd,borderColor:C.rd}}>✕</Btn>
            </div>
          </>}

          {/* NEW CLIENT */}
          {modal === "newCl" && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("boutique"),"name"],[t("contact"),"contact"],[t("ville"),"city"],[t("pays"),"country"],[t("codePostal"),"postalCode"],[t("telephone"),"phone"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginTop:8,marginBottom:8}}>{t("dirEnvio")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginTop:8,marginBottom:8}}>{t("dirFacturacion")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <Btn onClick={() => { if(ed.name){const nc = {...ed, id: Date.now(), orders:0, total:0, status:"prospect", channel: role==="distributor"?distLabel:"Direct", customPrice:0, earlyPay:false}; setClients(p => [...p, nc]); dbSaveClient(nc); setModal(null);} }} style={{width:"100%",marginTop:8}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT STOCK */}
          {modal === "editSt" && <>
            {ed.imageUrl && <div style={{height:118,background:C.wh,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,border:"1px solid "+C.ln,overflow:"hidden"}}>
              <img src={ed.imageUrl} alt={ed.model} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",padding:6}} />
            </div>}
            <div style={{fontSize:15,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:16}}>{ed.model} - {ed.color}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14,textAlign:"center"}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("stockActuel")}</div>
                <div style={{fontSize:24,fontWeight:300,fontFamily:DP,color:parseInt(ed.stock)<10?C.yl:C.gn}}>{ed.stock}</div>
              </div>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nouveauStock")}</div>
                <input type="number" value={ed.stock} onChange={e => setEd(p => ({...p, stock: e.target.value}))} style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:18,background:C.wh,color:C.dk,boxSizing:"border-box",fontWeight:600,textAlign:"center"}} />
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  {[5,10,20,50].map(n => <button key={n} onClick={() => setEd(p => ({...p, stock: String((parseInt(p.stock)||0)+n)}))} style={{flex:1,padding:6,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,fontSize:10,fontFamily:BD,color:C.dk,cursor:"pointer"}}>+{n}</button>)}
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("forme")}</div>
                <select value={ed.shape||""} onChange={e => setEd(p => ({...p, shape:e.target.value}))} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="">—</option>
                  {["ronde","carree","catEye","rectangulaire","aviateur","oversize","geometrique"].map(v => <option key={v} value={v}>{t(v)}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("couleur")}</div>
                <select value={ed.colorFamily||""} onChange={e => setEd(p => ({...p, colorFamily:e.target.value}))} style={{width:"100%",padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="">—</option>
                  {["noir","careyCol","marron","vert","dore","rose","bleu","rougeVin","orangeCol","cremeNude","gris","transparentCol","multicolore"].map(v => <option key={v} value={v}>{t(v)}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("etiquetas")}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[["top",t("topVenta"),"#c4956a"],["new",t("nuevo"),"#8e44ad"],["rec",t("recomendado"),"#722f37"],["icons","Icons","#b8860b"],["privee","Privée","#18332f"]].map(([tg,lb,cl]) => { const tags = ed.tags||[]; const on = tags.includes(tg); return (
                  <button key={tg} onClick={() => setEd(p => ({...p, tags: on ? tags.filter(x=>x!==tg) : [...tags, tg]}))} style={{padding:"6px 12px",background:on?cl:"transparent",color:on?"#fff":cl,border:"1px solid "+(on?cl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,fontWeight:600,cursor:"pointer",textTransform:"uppercase"}}>{lb}</button>
                ); })}
              </div>
            </div>
            <Btn onClick={() => { setProducts(p => p.map(pr => pr.id === ed.id ? {...pr, stock: parseInt(ed.stock)||0, tags: ed.tags||[], shape: ed.shape||"", colorFamily: ed.colorFamily||""} : pr)); dbUpdateProduct({...ed, stock: parseInt(ed.stock)||0}); setModal(null); }} style={{width:"100%"}}>{t("mettreAJour")}</Btn>
          </>}

          {/* NEW PRODUCT */}
          {modal === "newProd" && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("modele"),"model"],[t("couleur"),"color"],["SKU","sku"],[t("categorie"),"cat"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={ed[k] || ""} onChange={e => setEd(p => ({...p, [k]: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Collection</div>
                <select value={ed.col || "Essential"} onChange={e => setEd(p => ({...p, col: e.target.value, fixedPrice: e.target.value === "Acetato" ? ACETATO_PRICE : 0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="Essential">Essential</option>
                  <option value="Acetato">Acetato</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("stockInit")}</div>
                <input type="number" value={ed.stock || ""} onChange={e => setEd(p => ({...p, stock: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            {(ed.col === "Acetato") && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Prix fixe Acetato (€)</div>
              <input type="number" step="0.10" value={ed.fixedPrice || ACETATO_PRICE} onChange={e => setEd(p => ({...p, fixedPrice: parseFloat(e.target.value) || ACETATO_PRICE}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <Btn onClick={() => { if(ed.model){setProducts(p => [...p, {id:p.length+50, model:ed.model.toUpperCase(), color:ed.color||"", sku:ed.sku||"MN-NEW", col:ed.col||"Essential", cat:ed.col||"Essential", stock:parseInt(ed.stock)||0, fixedPrice:ed.col==="Acetato"?(ed.fixedPrice||ACETATO_PRICE):0}]); setModal(null);} }} style={{width:"100%"}}>{t("ajouterCat")}</Btn>
          </>}

          {/* NEW ORDER */}
          {modal === "newOrd" && <>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("client")}</div>
              <select value={ed.client || ""} onChange={e => setEd(p => ({...p, client: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                <option value="">{t("choisirClient")}</option>
                {clients.map(c => <option key={c.id} value={c.name}>{c.name} ({c.channel})</option>)}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("canal")}</div>
              <select value={ed.dist || "Direct"} onChange={e => setEd(p => ({...p, dist: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                {["Direct","Agent Sud","MPM Diffusion","Showroom Nomada","MCModa","Faire"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:500}}>{t("articles")}</div>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <select id="nop" style={{flex:1,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk}}>
                {products.map(p => <option key={p.id} value={p.id}>{p.model} - {p.color} ({p.stock})</option>)}
              </select>
              <input id="noq" type="number" defaultValue="2" min="1" style={{width:55,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,textAlign:"center"}} />
              <Btn small onClick={() => { const sel = document.getElementById("nop"); const qi = document.getElementById("noq"); const p = products.find(x => String(x.id) === String(sel.value)); if(p) setEd(prev => ({...prev, lines:[...(prev.lines||[]), {model:p.model, color:p.color, sku:p.sku, qty:parseInt(qi.value)||2, price:0}]})); }}>{t("ajouter")}</Btn>
            </div>
            {edLines.length > 0 && <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,marginBottom:14,overflow:"hidden"}}>
              {edLines.map((l, i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD}}>
                  <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                  <span style={{color:C.gr}}>{l.color}</span>
                  <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{l.qty}</span>
                  <span style={{fontWeight:600,minWidth:50,textAlign:"right"}}>{fmt(edUp * l.qty)} €</span>
                  <button onClick={() => setEd(prev => ({...prev, lines: prev.lines.filter((_, j) => j !== i)}))} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:14}}>x</button>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:C.bg,fontFamily:BD,fontSize:11}}>
                <span style={{fontWeight:600}}>{edQty} {t("unites")}</span>
                <span style={{fontWeight:600}}>{fmt(edTotal)} €</span>
              </div>
            </div>}
            <Btn disabled={!ed.client || edQty === 0} onClick={() => { const lns = edLines.map(l => ({...l, price: edUp})); setOrders(p => [{id:"#MN-"+String(p.length+1).padStart(4,"0"), client:ed.client, dist:ed.dist||"Direct", date:new Date().toLocaleDateString("fr-FR"), items:edQty, total:edTotal, comm:ed.dist!=="Direct"&&ed.dist!=="Faire"?edTotal*0.15:0, status:"confirmed", pay:"pending", track:"", lines:lns}, ...p]); setModal(null); }} style={{width:"100%"}}>{t("creerCmd")} ({edQty} uds - {fmt(edTotal)} €)</Btn>
          </>}

          {/* EDIT ORDER */}
          {modal === "editOrd" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <span style={{fontSize:24,fontFamily:DP,color:C.dk,fontWeight:600,letterSpacing:1}}>{ed.id}</span>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{ed.client}</span>
                <span style={{fontSize:10,fontFamily:BD,color:C.gr}}>{ed.date} · {ed.dist}</span>
              </div>
              <span style={{flex:1}} />
              <Badge l={ed.dist} c={ed.dist==="Agent Sud"?C.bl:ed.dist==="Faire"?C.yl:C.gn} />
            </div>
            {ed.lines && ed.lines.length > 0 && <>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:500}}>{t("detailArt")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,marginBottom:14,overflow:"hidden",maxHeight:220,overflowY:"auto"}}>
                {ed.lines.map((l, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD}}>
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <button onClick={() => {
                      const nl = ed.lines.map((x,j) => j===i ? {...x, qty: Math.max(1, x.qty-1)} : x);
                      const ni = nl.reduce((s,x)=>s+x.qty,0); const nt = nl.reduce((s,x)=>s+x.price*x.qty,0);
                      setEd(p => ({...p, lines:nl, items:ni, total:nt}));
                    }} style={{width:20,height:20,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk,padding:0}}>-</button>
                    <span style={{fontWeight:600,minWidth:24,textAlign:"center"}}>{l.qty}</span>
                    <button onClick={() => {
                      const nl = ed.lines.map((x,j) => j===i ? {...x, qty: x.qty+1} : x);
                      const ni = nl.reduce((s,x)=>s+x.qty,0); const nt = nl.reduce((s,x)=>s+x.price*x.qty,0);
                      setEd(p => ({...p, lines:nl, items:ni, total:nt}));
                    }} style={{width:20,height:20,background:C.bg,border:"1px solid "+C.ln,borderRadius:2,cursor:"pointer",fontSize:11,fontFamily:BD,color:C.dk,padding:0}}>+</button>
                    <span style={{fontWeight:600,minWidth:50,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                    <button onClick={() => {
                      const removed = ed.lines[i];
                      const newLines = ed.lines.filter((_, j) => j !== i);
                      const newItems = newLines.reduce((s, x) => s + x.qty, 0);
                      const newTotal = newLines.reduce((s, x) => s + x.price * x.qty, 0);
                      const note = (ed.clientNotes ? ed.clientNotes + "\n" : "") + removed.model + " " + removed.color + " (x" + removed.qty + ") " + t("artSupprime");
                      setEd(p => ({...p, lines: newLines, items: newItems, total: newTotal, clientNotes: note}));
                    }} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:9,fontFamily:BD,fontWeight:600,padding:"2px 4px",flexShrink:0}}>✕</button>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:C.bg,fontFamily:BD,fontSize:11,fontWeight:600}}>
                  <span>{ed.items || ed.lines.reduce((s,x)=>s+x.qty,0)} {t("unites")}</span>
                  <span>{fmt(ed.total || ed.lines.reduce((s,x)=>s+x.price*x.qty,0))} €</span>
                </div>
              </div>
            </>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("statutCmd")}</div>
                <select value={ed.status} onChange={e => setEd(p => ({...p, status: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {Object.keys(SL).map(k => <option key={k} value={k}>{SL[k]}</option>)}
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("statutPay")}</div>
                <select value={ed.pay} onChange={e => setEd(p => ({...p, pay: e.target.value}))} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {Object.keys(PL).map(k => <option key={k} value={k}>{PL[k]}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("tracking")}</div>
                <input value={ed.track || ""} onChange={e => setEd(p => ({...p, track: e.target.value}))} placeholder="ABC123456" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("transporteur")}</div>
                <input value={ed.carrier || ""} onChange={e => setEd(p => ({...p, carrier: e.target.value}))} placeholder="DHL, GLS, SEUR..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("urlSuivi")}</div>
              <input value={ed.trackUrl || ""} onChange={e => setEd(p => ({...p, trackUrl: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("fraisEnvoi")} {(ed.items||0) >= 20 && <span style={{color:C.gn,fontSize:9,fontWeight:600}}>({t("envoiInclus")})</span>}</div>
              <input type="number" step="0.01" value={ed.shippingCost === -1 ? "" : (ed.shippingCost || 0)} onChange={e => setEd(p => ({...p, shippingCost: parseFloat(e.target.value) || 0}))} placeholder="0.00" style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:13,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesInt")}</div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={2} style={{width:"100%",padding:10,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesClient")} <span style={{color:C.gr2,fontSize:9}}>({t("client")} {t("voirPlus").toLowerCase()})</span></div>
              <textarea value={ed.clientNotes || ""} onChange={e => setEd(p => ({...p, clientNotes: e.target.value}))} rows={2} placeholder="..." style={{width:"100%",padding:10,border:"1px solid "+C.bl+"40",borderRadius:3,fontFamily:BD,fontSize:12,background:"#f0f6fa",color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { const updated = {...orders[ed.idx], status:ed.status, pay:ed.pay, track:ed.track, carrier:ed.carrier, trackUrl:ed.trackUrl, notes:ed.notes, clientNotes:ed.clientNotes, lines:ed.lines, items:ed.items, total:ed.total, shippingCost:ed.shippingCost, comm:ed.dist!=="Direct"&&ed.dist!=="Faire"?ed.total*0.15:0}; setOrders(p => p.map((o, i) => i === ed.idx ? updated : o)); dbUpdateOrder(updated); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { if(confirm(t("confirmarEliminar"))){ setOrders(p => p.filter((_, i) => i !== ed.idx)); setModal(null); }}} style={{color:C.rd,borderColor:C.rd}}>{t("eliminarCmd")}</Btn>
            </div>
          </>}

          {/* VIEW ORDER (client / distributor read-only) */}
          {/* VIEW MODEL */}
          {modal === "viewModel" && ed.variants && <>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
              {(() => { const first = ed.variants.find(v => v.imageUrl) || ed.variants[0]; return first.imageUrl ? <img src={first.imageUrl} alt={ed.model} style={{width:80,height:80,objectFit:"contain",borderRadius:6,border:"1px solid "+C.ln}} /> : <div style={{width:80,height:80,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:18,color:C.ln,border:"1px solid "+C.ln}}>MINUË</div>; })()}
              <div>
                <div style={{fontSize:22,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.model}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4}}>{ed.variants[0].col} · {ed.variants.length} {t("couleurs")} · {ed.variants.reduce((s,v) => s+v.stock,0)} {t("stockDisponible")}</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:"50vh",overflowY:"auto"}}>
              {ed.variants.map(v => {
                const isAcetato = v.col === "Acetato";
                const price = isAcetato ? v.fixedPrice : (customPrice > 0 ? customPrice : essentialCount > 0 ? essentialUnitPrice : 26.90);
                const cq = getCardQty(v.id);
                return (
                  <div key={v.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:cart[v.id]>0?C.gn+"08":C.bg,border:"1px solid "+(cart[v.id]>0?C.gn+"30":C.ln),borderRadius:6}}>
                    <div style={{width:20,height:20,borderRadius:10,background:colorDot[v.color]||"#aaa",border:"2px solid #e0d8d0",flexShrink:0}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{v.color}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{v.sku} · stock: {v.stock}</div>
                    </div>
                    {role !== "admin" && <button onClick={(e) => { e.stopPropagation(); setFavs(f => f.includes(v.id) ? f.filter(x => x!==v.id) : [...f, v.id]); }} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={favs.includes(v.id)?"#6b4c3b":"none"} stroke={favs.includes(v.id)?"#6b4c3b":"#ccc"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>}
                    <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(price)} €</span>
                    {role !== "admin" && <>
                      <div style={{display:"flex",alignItems:"center",border:"1px solid "+C.ln,borderRadius:3,overflow:"hidden"}}>
                        <button onClick={() => setCardQty(v.id, cq-1)} style={{width:26,height:28,background:C.wh,border:"none",cursor:"pointer",fontSize:12,color:C.dk}}>-</button>
                        <span style={{minWidth:24,textAlign:"center",fontSize:12,fontFamily:BD,fontWeight:600}}>{cq}</span>
                        <button onClick={() => setCardQty(v.id, cq+1)} style={{width:26,height:28,background:C.wh,border:"none",cursor:"pointer",fontSize:12,color:C.dk}}>+</button>
                      </div>
                      <button onClick={() => addToCart(v.id, cq)} style={{padding:"6px 12px",background:C.dk,color:C.bg,border:"none",fontSize:10,cursor:"pointer",fontFamily:BD,borderRadius:3,fontWeight:500}}>+</button>
                    </>}
                    {v.stock === 0 && <span style={{fontSize:9,fontFamily:BD,color:"#fff",background:C.rd,padding:"2px 6px",borderRadius:3}}>{t("agotado")}</span>}
                  </div>
                );
              })}
            </div>
          </>}

          {modal === "viewOrd" && (() => {
            const canEdit = role === "distributor" && ed.status === "confirmed";
            const isPartial = ed.status === "partial";
            const hasQtyData = isPartial && ed.lines && ed.lines.some(l => (l.qtyReceived||0) > 0);
            const shippedQty = hasQtyData ? ed.lines.reduce((s,l) => s + (l.qtyReceived||0), 0) : 0;
            const pendingQty = isPartial ? ed.items - shippedQty : 0;
            const shippedLines = hasQtyData ? ed.lines.filter(l => (l.qtyReceived||0) > 0) : [];
            const pendingLines = hasQtyData ? ed.lines.filter(l => (l.qtyReceived||0) < l.qty) : [];
            return <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontSize:24,fontFamily:DP,color:C.dk,fontWeight:600,letterSpacing:1}}>{ed.id}</span>
              <Badge l={SL[ed.status]} c={SC[ed.status]} />
              <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
            </div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginBottom:canEdit?8:16}}>{ed.client} · {ed.date} · {ed.dist}</div>
            {canEdit && <div style={{background:C.gn+"10",border:"1px solid "+C.gn+"30",borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>✏️ {t("cmdNonConfirmee")}</div>}

            {/* PARTIAL PROGRESS - only with qtyReceived data */}
            {isPartial && hasQtyData && <div style={{background:C.yl+"10",border:"1px solid "+C.yl+"30",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("envioPartial")}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{shippedQty} / {ed.items} {t("unites")}</span>
              </div>
              <div style={{height:6,background:C.bg2,borderRadius:3,overflow:"hidden",marginBottom:10}}>
                <div style={{height:6,background:C.gn,borderRadius:3,width:Math.round(shippedQty/ed.items*100)+"%"}} />
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1,background:C.gn+"10",borderRadius:6,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontFamily:BD,color:C.gn,fontWeight:700}}>{shippedQty}</div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gn}}>{t("enviado")}</div>
                </div>
                <div style={{flex:1,background:C.yl+"10",borderRadius:6,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontFamily:BD,color:C.yl,fontWeight:700}}>{pendingQty}</div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.yl}}>{t("pendienteEnvio")}</div>
                </div>
              </div>
            </div>}

            {/* PARTIAL without qtyReceived data - show badge */}
            {isPartial && !hasQtyData && <div style={{background:C.yl+"10",border:"1px solid "+C.yl+"30",borderRadius:8,padding:"14px 16px",marginBottom:16}}>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:4}}>{t("envioPartial")}</div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{ed.clientNotes || ed.notes || ""}</div>
            </div>}

            {/* SHIPPED ITEMS (partial with data) */}
            {isPartial && hasQtyData && shippedLines.length > 0 && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:700,marginBottom:6}}>✓ {t("enviado")} — {shippedQty} {t("unites")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.gn+"30",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {shippedLines.map((l, i) => (
                  <div key={"s"+i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD}}>
                    <span style={{width:6,height:6,borderRadius:3,background:C.gn,flexShrink:0}} />
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{l.qtyReceived||l.qty}</span>
                    <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * (l.qtyReceived||l.qty))} €</span>
                  </div>
                ))}
              </div>
            </>}

            {/* PENDING ITEMS (partial with data) */}
            {isPartial && hasQtyData && pendingLines.length > 0 && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.yl,fontWeight:700,marginBottom:6}}>⏳ {t("pendienteEnvio")} — {pendingQty} {t("unites")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.yl+"30",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {pendingLines.map((l, i) => { const pend = l.qty - (l.qtyReceived||0); return (
                  <div key={"p"+i} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD,opacity:0.7}}>
                    <span style={{width:6,height:6,borderRadius:3,background:C.yl,flexShrink:0}} />
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{pend}</span>
                    <span style={{fontWeight:600,minWidth:55,textAlign:"right",color:C.gr}}>{fmt(l.price * pend)} €</span>
                  </div>
                ); })}
              </div>
            </>}

            {/* NORMAL LINES (non-partial OR partial without qty data) */}
            {(!isPartial || (isPartial && !hasQtyData)) && ed.lines && ed.lines.length > 0 && <>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6,fontWeight:500}}>{t("detailArt")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:4,marginBottom:14,overflow:"hidden"}}>
                {ed.lines.map((l, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,fontSize:12,fontFamily:BD}}>
                    <span style={{fontWeight:600,color:C.dk,flex:1}}>{l.model}</span>
                    <span style={{color:C.gr}}>{l.color}</span>
                    {canEdit ? <>
                      <button onClick={() => { const nl = [...ed.lines]; nl[i] = {...nl[i], qty: Math.max(1, nl[i].qty-1)}; const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:11,color:C.dk,padding:0}}>-</button>
                      <span style={{fontWeight:600,minWidth:22,textAlign:"center"}}>{l.qty}</span>
                      <button onClick={() => { const nl = [...ed.lines]; nl[i] = {...nl[i], qty: nl[i].qty+1}; const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{width:22,height:22,background:C.bg,border:"1px solid "+C.ln,borderRadius:3,cursor:"pointer",fontSize:11,color:C.dk,padding:0}}>+</button>
                      <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                      <button onClick={() => { const nl = ed.lines.filter((_,j) => j!==i); const items = nl.reduce((s,x) => s+x.qty,0); const total = nl.reduce((s,x) => s+x.qty*x.price,0); setEd(p => ({...p, lines:nl, items, total})); }} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:14,padding:"0 2px"}}>✕</button>
                    </> : <>
                      <span style={{fontWeight:600,minWidth:28,textAlign:"center"}}>x{l.qty}</span>
                      <span style={{fontWeight:600,minWidth:55,textAlign:"right"}}>{fmt(l.price * l.qty)} €</span>
                    </>}
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:C.bg,fontFamily:BD,fontSize:12,fontWeight:600}}>
                  <span>{ed.items} {t("unites")}</span>
                  <span>{fmt(ed.total)} €</span>
                </div>
              </div>
            </>}

            {/* TOTAL (partial with qty data) */}
            {isPartial && hasQtyData && <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:C.bg,borderRadius:4,fontFamily:BD,fontSize:12,fontWeight:600,marginBottom:14}}>
              <span>{ed.items} {t("unites")}</span>
              <span>{fmt(ed.total)} €</span>
            </div>}
            {canEdit && <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesCmd")}</div>
              <textarea value={ed.clientNotes||""} onChange={e => setEd(p => ({...p, clientNotes:e.target.value}))} rows={2} placeholder={t("notesPlaceholder")} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>}
            {(ed.track || ed.carrier) && <div style={{marginBottom:12,padding:"12px 14px",background:C.bg,borderRadius:4,border:"1px solid "+C.ln}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("tracking")}</div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                {ed.carrier && <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600,background:C.wh,padding:"3px 10px",borderRadius:3,border:"1px solid "+C.ln}}>{ed.carrier}</span>}
                {ed.track && <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600,letterSpacing:0.5}}>{ed.track}</span>}
              </div>
              {ed.trackUrl && <a href={ed.trackUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,fontSize:11,fontFamily:BD,color:C.bl,textDecoration:"none",fontWeight:600,padding:"5px 12px",background:C.bl+"10",borderRadius:3}}>{t("suivreColis")} →</a>}
            </div>}
            {!canEdit && ed.clientNotes && <div style={{padding:"12px 14px",background:"#f0f6fa",borderRadius:4,border:"1px solid "+C.bl+"30"}}>
              <div style={{fontSize:10,fontFamily:BD,color:C.bl,fontWeight:600,marginBottom:4}}>{t("noteDuCmd")}</div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,lineHeight:1.5,whiteSpace:"pre-line"}}>{ed.clientNotes}</div>
            </div>}
            {canEdit && <Btn onClick={() => { setOrders(p => p.map((o, i) => i === ed.idx ? {...o, lines:ed.lines, items:ed.items, total:ed.total, clientNotes:ed.clientNotes} : o)); setModal(null); }} style={{width:"100%",marginTop:8}}>{t("editarCmd")}</Btn>}
          </>;
          })()}

          {/* NEW USER */}
          {modal === "newUser" && <>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("roleLabel")}</div>
              <div style={{display:"flex",gap:8}}>
                {[["client",t("client"),"🏪",C.gn],["distributor",t("distributeur")+" / Showroom","🤝",C.bl]].map(([v,l,icon,col]) => (
                  <button key={v} onClick={() => setEd(p => ({...p, role:v, commRate:v==="distributor"?15:0}))} style={{flex:1,padding:"12px 14px",background:ed.role===v?col+"12":"transparent",border:"2px solid "+(ed.role===v?col:C.ln),borderRadius:8,cursor:"pointer",textAlign:"left"}}>
                    <div style={{fontSize:18,marginBottom:4}}>{icon}</div>
                    <div style={{fontSize:12,fontFamily:BD,fontWeight:600,color:ed.role===v?col:C.gr}}>{l}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("langue")}</div>
              <div style={{display:"flex",gap:6}}>
                {[["fr","FR"],["es","ES"],["en","EN"]].map(([v,l]) => (
                  <button key={v} onClick={() => setEd(p => ({...p, lang:v}))} style={{padding:"6px 14px",background:ed.lang===v?C.dk:"transparent",color:ed.lang===v?C.bg:C.gr,border:"1px solid "+(ed.lang===v?C.dk:C.ln),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} placeholder="Nom" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <input value={ed.co || ""} onChange={e => setEd(p => ({...p, co: e.target.value}))} placeholder="Boutique / Showroom" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("emailLabel")}</div>
              <input type="email" value={ed.email || ""} onChange={e => setEd(p => ({...p, email: e.target.value}))} placeholder="user@store.com" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pwLabel")}</div>
              <input value={ed.pw || ""} onChange={e => setEd(p => ({...p, pw: e.target.value}))} placeholder="min. 6 chars" style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            {ed.role === "distributor" && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commissionRate")}</div>
              <input type="number" value={ed.commRate || 15} onChange={e => setEd(p => ({...p, commRate: parseInt(e.target.value)||15}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <input value={ed.phone || ""} onChange={e => setEd(p => ({...p, phone: e.target.value}))} placeholder="+34..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div>
                <input value={ed.city || ""} onChange={e => setEd(p => ({...p, city: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div>
                <input value={ed.country || ""} onChange={e => setEd(p => ({...p, country: e.target.value}))} placeholder="FR, ES, DE..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesUser")}</div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={2} placeholder="..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <Btn onClick={() => { if(ed.email && ed.name && ed.pw){ setUsers(p => [...p, {...ed, active: true}]); dbSaveUser(ed); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT USER */}
          {modal === "editUser" && <>
            <div style={{fontSize:15,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:4}}>{ed.name}</div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr,marginBottom:16}}>{ed.email} - {ed.role === "distributor" ? t("distributeur") : t(ed.role)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <input value={ed.co || ""} onChange={e => setEd(p => ({...p, co: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pwLabel")}</div>
              <input value={ed.pw || ""} onChange={e => setEd(p => ({...p, pw: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            {ed.role === "distributor" && <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commissionRate")}</div>
              <input type="number" value={ed.commRate || 15} onChange={e => setEd(p => ({...p, commRate: parseInt(e.target.value)||15}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <input value={ed.phone || ""} onChange={e => setEd(p => ({...p, phone: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("ville")}</div>
                <input value={ed.city || ""} onChange={e => setEd(p => ({...p, city: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("pays")}</div>
                <input value={ed.country || ""} onChange={e => setEd(p => ({...p, country: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesUser")}</div>
              <textarea value={ed.notes || ""} onChange={e => setEd(p => ({...p, notes: e.target.value}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setUsers(p => p.map(u => u.email === ed.origEmail ? {...u, name:ed.name, co:ed.co, pw:ed.pw, commRate:ed.commRate, active:ed.active!==false, phone:ed.phone, city:ed.city, country:ed.country, notes:ed.notes} : u)); dbUpdateUser(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tu={...ed, active:!(ed.active!==false)}; setUsers(p => p.map(u => u.email === tu.origEmail ? {...u, active: tu.active} : u)); dbUpdateUser(tu); setModal(null); }} style={{flex:0}}>{ed.active !== false ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* NEW PROMO */}
          {modal === "newPromo" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nomPromo")}</div>
              <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("typePromo")}</div>
                <select value={ed.type || "percent"} onChange={e => setEd(p => ({...p, type: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="percent">{t("percent")}</option>
                  <option value="gift">{t("cadeau")}</option>
                </select>
              </div>
              {ed.type === "percent" && <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("reduction")}</div>
                <input type="number" value={ed.disc || 0} onChange={e => setEd(p => ({...p, disc: parseInt(e.target.value)||0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 8px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionFr")}</div><input value={(ed.cond && ed.cond.fr) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEs")}</div><input value={(ed.cond && ed.cond.es) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEn")}</div><input value={(ed.cond && ed.cond.en) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("visiblePour")}</div>
              <div style={{display:"flex",gap:8}}>
                {["client","distributor"].map(r => { const vis = ed.visible || []; const on = vis.includes(r); return (
                  <button key={r} onClick={() => setEd(p => ({...p, visible: on ? vis.filter(x=>x!==r) : [...vis, r]}))} style={{padding:"6px 14px",background:on?C.dk:"transparent",color:on?C.bg:C.gr,border:"1px solid "+(on?C.dk:C.ln),borderRadius:3,fontSize:11,fontFamily:BD,cursor:"pointer"}}>{r === "distributor" ? t("distributeur") : t("client")}</button>
                ); })}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("promoClients")}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <button onClick={() => setEd(p => ({...p, targetClients:[]}))} style={{padding:"4px 10px",background:(!ed.targetClients||ed.targetClients.length===0)?C.dk:"transparent",color:(!ed.targetClients||ed.targetClients.length===0)?C.bg:C.gr,border:"1px solid "+((!ed.targetClients||ed.targetClients.length===0)?C.dk:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{t("tousClients")}</button>
                {clients.map(c => { const tgt = ed.targetClients||[]; const on = tgt.includes(c.name); return (
                  <button key={c.name} onClick={() => setEd(p => ({...p, targetClients: on ? tgt.filter(x=>x!==c.name) : [...tgt, c.name]}))} style={{padding:"4px 10px",background:on?C.bl:"transparent",color:on?"#fff":C.gr,border:"1px solid "+(on?C.bl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{c.name}</button>
                ); })}
              </div>
            </div>
            <Btn onClick={() => { if(ed.name){ const np = {...ed, id: Date.now(), on:true}; setPromos(p => [...p, np]); dbSavePromo(np); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT PROMO */}
          {modal === "editPromo" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nomPromo")}</div>
              <input value={ed.name || ""} onChange={e => setEd(p => ({...p, name: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("typePromo")}</div>
                <select value={ed.type || "percent"} onChange={e => setEd(p => ({...p, type: e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="percent">{t("percent")}</option>
                  <option value="gift">{t("cadeau")}</option>
                </select>
              </div>
              {ed.type === "percent" && <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("reduction")}</div>
                <input type="number" value={ed.disc || 0} onChange={e => setEd(p => ({...p, disc: parseInt(e.target.value)||0}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 8px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionFr")}</div><input value={(ed.cond && ed.cond.fr) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEs")}</div><input value={(ed.cond && ed.cond.es) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("conditionEn")}</div><input value={(ed.cond && ed.cond.en) || ""} onChange={e => setEd(p => ({...p, cond:{...(p.cond||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("visiblePour")}</div>
              <div style={{display:"flex",gap:8}}>
                {["client","distributor"].map(r => { const vis = ed.visible || []; const on = vis.includes(r); return (
                  <button key={r} onClick={() => setEd(p => ({...p, visible: on ? vis.filter(x=>x!==r) : [...vis, r]}))} style={{padding:"6px 14px",background:on?C.dk:"transparent",color:on?C.bg:C.gr,border:"1px solid "+(on?C.dk:C.ln),borderRadius:3,fontSize:11,fontFamily:BD,cursor:"pointer"}}>{r === "distributor" ? t("distributeur") : t("client")}</button>
                ); })}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:6}}>{t("promoClients")}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <button onClick={() => setEd(p => ({...p, targetClients:[]}))} style={{padding:"4px 10px",background:(!ed.targetClients||ed.targetClients.length===0)?C.dk:"transparent",color:(!ed.targetClients||ed.targetClients.length===0)?C.bg:C.gr,border:"1px solid "+((!ed.targetClients||ed.targetClients.length===0)?C.dk:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{t("tousClients")}</button>
                {clients.map(c => { const tgt = ed.targetClients||[]; const on = tgt.includes(c.name); return (
                  <button key={c.name} onClick={() => setEd(p => ({...p, targetClients: on ? tgt.filter(x=>x!==c.name) : [...tgt, c.name]}))} style={{padding:"4px 10px",background:on?C.bl:"transparent",color:on?"#fff":C.gr,border:"1px solid "+(on?C.bl:C.ln),borderRadius:3,fontSize:10,fontFamily:BD,cursor:"pointer"}}>{c.name}</button>
                ); })}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setPromos(p => p.map(pr => pr.id === ed.id ? {...ed} : pr)); dbUpdatePromo(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tp={...ed,on:!ed.on}; setPromos(p => p.map(pr => pr.id === tp.id ? {...pr, on: tp.on} : pr)); dbUpdatePromo(tp); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* NEW NEWS */}
          {modal === "newNews" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (FR)</div>
              <input value={(ed.title && ed.title.fr) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (ES)</div><input value={(ed.title && ed.title.es) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (EN)</div><input value={(ed.title && ed.title.en) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (FR)</div>
              <textarea value={(ed.content && ed.content.fr) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), fr:e.target.value}}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (ES)</div><textarea value={(ed.content && ed.content.es) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), es:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (EN)</div><textarea value={(ed.content && ed.content.en) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), en:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("lienUrl")}</div>
              <input value={ed.url || ""} onChange={e => setEd(p => ({...p, url: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
              <label style={{fontSize:11,fontFamily:BD,color:C.dk,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={ed.pinned||false} onChange={e => setEd(p => ({...p, pinned:e.target.checked}))} /> {t("epingle")}</label>
            </div>
            <Btn onClick={() => { if(ed.title && ed.title.fr){ const nn = {...ed, id:Date.now(), date:new Date().toLocaleDateString("fr-FR"), on:true}; setNews(p => [...p, nn]); dbSaveNews(nn); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT NEWS */}
          {modal === "editNews" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (FR)</div>
              <input value={(ed.title && ed.title.fr) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), fr:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (ES)</div><input value={(ed.title && ed.title.es) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), es:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreNouveaute")} (EN)</div><input value={(ed.title && ed.title.en) || ""} onChange={e => setEd(p => ({...p, title:{...(p.title||{}), en:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (FR)</div>
              <textarea value={(ed.content && ed.content.fr) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), fr:e.target.value}}))} rows={3} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (ES)</div><textarea value={(ed.content && ed.content.es) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), es:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
              <div style={{marginBottom:12}}><div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contenu")} (EN)</div><textarea value={(ed.content && ed.content.en) || ""} onChange={e => setEd(p => ({...p, content:{...(p.content||{}), en:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} /></div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("lienUrl")}</div>
              <input value={ed.url || ""} onChange={e => setEd(p => ({...p, url: e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
              <label style={{fontSize:11,fontFamily:BD,color:C.dk,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={ed.pinned||false} onChange={e => setEd(p => ({...p, pinned:e.target.checked}))} /> {t("epingle")}</label>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setNews(p => p.map(n => n.id === ed.id ? {...ed} : n)); dbUpdateNews(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tn={...ed,on:!ed.on}; setNews(p => p.map(n => n.id === tn.id ? {...n, on:tn.on} : n)); dbUpdateNews(tn); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* VIEW INVOICE */}
          {modal === "viewInv" && <>
            <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"20px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500}}>F-{(ed.id||"").replace("#","")}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{ed.date}</div>
                </div>
                <Badge l={PL[ed.pay]} c={PC[ed.pay]} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>{t("emetteur")}</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>Minuë Opticians</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr,lineHeight:1.5}}>Alejandro Carrasco Diaz<br/>NIF: ES77843808D<br/>C/ Gutiérrez de Alba 2<br/>41010 Sevilla, Spain</div>
                </div>
                <div>
                  <div style={{fontSize:9,fontFamily:BD,color:C.gr,marginBottom:4,fontWeight:600,textTransform:"uppercase"}}>{t("destinataire")}</div>
                  <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{ed.client}</div>
                  <div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{ed.dist}</div>
                </div>
              </div>
              {ed.lines && ed.lines.length > 0 && <div style={{borderTop:"1px solid "+C.ln,paddingTop:12}}>
                <div style={{display:"flex",padding:"0 0 6px",fontSize:9,fontFamily:BD,color:C.gr,fontWeight:600,textTransform:"uppercase"}}>
                  <span style={{flex:1}}>Article</span><span style={{minWidth:35,textAlign:"center"}}>Qty</span><span style={{minWidth:55,textAlign:"right"}}>P.U.</span><span style={{minWidth:60,textAlign:"right"}}>Total</span>
                </div>
                {ed.lines.map((l,i) => (
                  <div key={i} style={{display:"flex",padding:"5px 0",fontSize:11,fontFamily:BD,borderBottom:"1px solid "+C.bg2}}>
                    <span style={{flex:1,color:C.dk}}>{l.model} {l.color}</span>
                    <span style={{minWidth:35,textAlign:"center",color:C.gr}}>{l.qty}</span>
                    <span style={{minWidth:55,textAlign:"right",color:C.gr}}>{fmt(l.price)} €</span>
                    <span style={{minWidth:60,textAlign:"right",color:C.dk,fontWeight:600}}>{fmt(l.price*l.qty)} €</span>
                  </div>
                ))}
              </div>}
              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gr}}>{t("sousTotal")}</span><span>{fmt(ed.total||0)} €</span></div>
                {(ed.shippingCost > 0) && <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gr}}>{t("fraisEnvoi")}</span><span>{fmt(ed.shippingCost)} €</span></div>}
                {(ed.shippingCost === 0 && (ed.items||0) >= 20) && <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gn}}>{t("envoi")}</span><span style={{color:C.gn,fontWeight:600}}>{t("envoiInclus")}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:BD,marginBottom:4}}><span style={{color:C.gr}}>{t("tva")}</span><span>{fmt(((ed.total||0)+(ed.shippingCost>0?ed.shippingCost:0))*0.21)} €</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontFamily:DP,fontWeight:600,marginTop:6}}><span>{t("totalTTC")}</span><span>{fmt(((ed.total||0)+(ed.shippingCost>0?ed.shippingCost:0))*1.21)} €</span></div>
              </div>
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid "+C.ln}}>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>IBAN: ES11 2100 8447 6202 0010 9299 · BIC: CAIXESBBXXX</div>
              </div>
            </div>
          </>}

          {/* NEW FAQ */}
          {modal === "newFaq" && <>
            {["fr","es","en"].map(l => (
              <div key={l} style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("questionLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.q && ed.q[l]) || ""} onChange={e => setEd(p => ({...p, q:{...(p.q||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:8}}>{t("reponseLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.a && ed.a[l]) || ""} onChange={e => setEd(p => ({...p, a:{...(p.a||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <Btn onClick={() => { if(ed.q && ed.q.fr){ const nf = {...ed, id:Date.now(), on:true}; setFaqs(p => [...p, nf]); dbSaveFaq(nf); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT FAQ */}
          {modal === "editFaq" && <>
            {["fr","es","en"].map(l => (
              <div key={l} style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("questionLabel")} ({l.toUpperCase()})</div>
                <input value={(ed.q && ed.q[l]) || ""} onChange={e => setEd(p => ({...p, q:{...(p.q||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:8}}>{t("reponseLabel")} ({l.toUpperCase()})</div>
                <textarea value={(ed.a && ed.a[l]) || ""} onChange={e => setEd(p => ({...p, a:{...(p.a||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setFaqs(p => p.map(f => f.id === ed.id ? {...ed} : f)); dbUpdateFaq(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const tf={...ed,on:!ed.on}; setFaqs(p => p.map(f => f.id === tf.id ? {...f, on:tf.on} : f)); dbUpdateFaq(tf); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
            </div>
          </>}

          {/* VIEW DISTRIBUTOR */}
          {modal === "viewDist" && <>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
              <div style={{width:36,height:36,borderRadius:18,background:C.bl+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,fontFamily:BD,color:C.bl}}>{ed.name[0]}</div>
              <div>
                <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:600}}>{ed.co || ed.name}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{ed.name} · {ed.email} · {ed.commRate||15}%</div>
              </div>
            </div>
            <div style={{display:"flex",gap:4,margin:"12px 0",borderBottom:"1px solid "+C.ln,overflowX:"auto"}}>
              {[["resume",t("resumeClient")],["clients",t("clients")],["orders",t("commandes")],["liquid",t("liquidaciones")],["notes",t("notesDistrib")]].map(([v,l]) => (
                <button key={v} onClick={() => setEd(p => ({...p, _tab:v}))} style={{padding:"8px 14px",background:"none",border:"none",borderBottom:"2px solid "+((ed._tab||"resume")===v?C.dk:"transparent"),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:(ed._tab||"resume")===v?600:400,color:(ed._tab||"resume")===v?C.dk:C.gr,whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>

            {(ed._tab||"resume") === "resume" && <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:16}}>
                {renderKPI(t("clients"), String(ed._dClients.length))}
                {renderKPI(t("commandes"), String(ed._dOrders.length))}
                {renderKPI(t("ventesTotal"), fmt(ed._dSales)+" €", C.gn)}
                {renderKPI(t("commGeneree"), fmt(ed._dComm)+" €", C.bl)}
                {renderKPI(t("commPayee"), fmt(ed._dPaid)+" €", C.gn)}
                {renderKPI(t("commDue"), fmt(ed._dComm - ed._dPaid)+" €", ed._dComm - ed._dPaid > 0 ? C.yl : C.gn)}
              </div>
              <div style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("dernieresCmd")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
                {ed._dOrders.slice(0,5).map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderBottom:"1px solid "+C.bg2}}>
                    <span style={{fontSize:12,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client} · {o.date}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{fmt(o.total)} €</span>
                    <Badge l={SL[o.status]} c={SC[o.status]} />
                  </div>
                ))}
                {ed._dOrders.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "clients" && <>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
                {ed._dClients.map((c,i) => {
                  const clOrds = ed._dOrders.filter(o => o.client === c.name);
                  const clTotal = clOrds.reduce((s,o) => s+o.total, 0);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2}}>
                      <div style={{flex:1}}><div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,fontFamily:BD,color:C.gr}}>{c.contact} · {c.city}</div></div>
                      <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{clOrds.length} cmd · {fmt(clTotal)} €</span>
                      <Badge l={c.status==="prospect"?t("prospect"):t("actif")} c={c.status==="prospect"?C.yl:C.gn} />
                    </div>
                  );
                })}
                {ed._dClients.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "orders" && <>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",maxHeight:350,overflowY:"auto"}}>
                {ed._dOrders.map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                    <span style={{fontSize:13,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>{o.client} · {o.date}</span>
                    <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{o.items} uds · {fmt(o.total)} €</span>
                    <Badge l={SL[o.status]} c={SC[o.status]} />
                    <Badge l={PL[o.pay]} c={PC[o.pay]} />
                  </div>
                ))}
                {ed._dOrders.length === 0 && <div style={{padding:20,textAlign:"center",fontSize:12,fontFamily:BD,color:C.gr2}}>—</div>}
              </div>
            </>}

            {ed._tab === "liquid" && <>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:12}}>{t("noLiquidaciones")}</div>
              <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {renderKPI(t("commGeneree"), fmt(ed._dComm)+" €", C.bl)}
                  {renderKPI(t("commPayee"), fmt(ed._dPaid)+" €", C.gn)}
                  {renderKPI(t("commDue"), fmt(ed._dComm-ed._dPaid)+" €", C.yl)}
                </div>
              </div>
            </>}

            {ed._tab === "notes" && <>
              <textarea value={ed.distNotes||""} onChange={e => setEd(p => ({...p, distNotes:e.target.value}))} rows={6} placeholder="..." style={{width:"100%",padding:12,border:"1px solid "+C.ln,borderRadius:6,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} />
              <Btn onClick={() => { setPrivateNotes(p => ({...p, ["dist_"+ed.email]:ed.distNotes})); if(user) dbSavePrivateNote(user.email, "dist_"+ed.email, ed.distNotes||""); setModal(null); }} style={{width:"100%",marginTop:8}}>{t("enregistrer")}</Btn>
            </>}
          </>}

          {/* NEW PACKAGING */}
          {modal === "newPack" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("packType")}</div>
              <select value={ed.type} onChange={e => setEd(p => ({...p, type:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                <option value="Étui">Étui / Funda</option><option value="Display">Display / Expositor</option><option value="Merchandising">Merchandising</option>
              </select>
            </div>
            {["fr","es","en"].map(l => (
              <div key={l} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nom")} ({l.toUpperCase()})</div>
                <input value={(ed.name&&ed.name[l])||""} onChange={e => setEd(p => ({...p, name:{...(p.name||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:6}}>{t("packDesc")} ({l.toUpperCase()})</div>
                <textarea value={(ed.desc&&ed.desc[l])||""} onChange={e => setEd(p => ({...p, desc:{...(p.desc||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Image URL</div>
              <input value={ed.imageUrl||""} onChange={e => setEd(p => ({...p, imageUrl:e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <Btn onClick={() => { const np = {...ed, id:Date.now(), on:true}; setPackItems(p => [...p, np]); dbSavePackaging(np); setModal(null); }} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT PACKAGING */}
          {modal === "editPack" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("packType")}</div>
              <select value={ed.type} onChange={e => setEd(p => ({...p, type:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                <option value="Étui">Étui / Funda</option><option value="Display">Display / Expositor</option><option value="Merchandising">Merchandising</option>
              </select>
            </div>
            {["fr","es","en"].map(l => (
              <div key={l} style={{marginBottom:10}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("nom")} ({l.toUpperCase()})</div>
                <input value={(ed.name&&ed.name[l])||""} onChange={e => setEd(p => ({...p, name:{...(p.name||{}), [l]:e.target.value}}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4,marginTop:6}}>{t("packDesc")} ({l.toUpperCase()})</div>
                <textarea value={(ed.desc&&ed.desc[l])||""} onChange={e => setEd(p => ({...p, desc:{...(p.desc||{}), [l]:e.target.value}}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Image URL</div>
              <input value={ed.imageUrl||""} onChange={e => setEd(p => ({...p, imageUrl:e.target.value}))} placeholder="https://..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setPackItems(p => p.map(pk => pk.id === ed.id ? {...ed} : pk)); dbUpdatePackaging(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { const toggled = {...ed, on:!ed.on}; setPackItems(p => p.map(pk => pk.id === ed.id ? toggled : pk)); dbUpdatePackaging(toggled); setModal(null); }}>{ed.on ? t("desactiver") : t("userActif")}</Btn>
              <Btn ghost onClick={() => { if(confirm("Supprimer?")){ setPackItems(p => p.filter(pk => pk.id !== ed.id)); dbDeletePackaging(ed.id); setModal(null); }}} style={{color:C.rd,borderColor:C.rd}}>✕</Btn>
            </div>
          </>}

          {/* NEW TASK */}
          {modal === "newTask" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreTache")}</div>
              <input value={ed.title||""} onChange={e => setEd(p => ({...p, title:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("descTache")}</div>
              <textarea value={ed.desc||""} onChange={e => setEd(p => ({...p, desc:e.target.value}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("echeance")}</div>
                <input type="date" value={ed.dueDate||""} onChange={e => setEd(p => ({...p, dueDate:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("assignee")}</div>
                <input value={ed.assignee||""} onChange={e => setEd(p => ({...p, assignee:e.target.value}))} placeholder="Alejandro, Marc..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("priorite")}</div>
                <select value={ed.priority||"moyenne"} onChange={e => setEd(p => ({...p, priority:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="haute">{t("haute")}</option><option value="moyenne">{t("moyenne")}</option><option value="basse">{t("basse")}</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("area")}</div>
                <select value={ed.area||"commercial"} onChange={e => setEd(p => ({...p, area:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {["commercial","finances","marketing","produits","clientsArea","logistique","admin"].map(a => <option key={a} value={a}>{t(a)}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <select value={ed.status||"aFaire"} onChange={e => setEd(p => ({...p, status:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="aFaire">{t("aFaire")}</option><option value="enCours">{t("enCours")}</option><option value="fait">{t("fait")}</option>
                </select>
              </div>
            </div>
            <Btn onClick={() => { if(ed.title){ setTasks(p => [...p, {...ed, id:p.length+10, date:new Date().toLocaleDateString("fr-FR")}]); dbSaveTask(ed); setModal(null); }}} style={{width:"100%"}}>{t("enregistrer")}</Btn>
          </>}

          {/* EDIT TASK */}
          {modal === "editTask" && <>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("titreTache")}</div>
              <input value={ed.title||""} onChange={e => setEd(p => ({...p, title:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("descTache")}</div>
              <textarea value={ed.desc||""} onChange={e => setEd(p => ({...p, desc:e.target.value}))} rows={2} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("echeance")}</div>
                <input type="date" value={ed.dueDate||""} onChange={e => setEd(p => ({...p, dueDate:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("assignee")}</div>
                <input value={ed.assignee||""} onChange={e => setEd(p => ({...p, assignee:e.target.value}))} placeholder="Alejandro, Marc..." style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"0 10px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("priorite")}</div>
                <select value={ed.priority||"moyenne"} onChange={e => setEd(p => ({...p, priority:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="haute">{t("haute")}</option><option value="moyenne">{t("moyenne")}</option><option value="basse">{t("basse")}</option>
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("area")}</div>
                <select value={ed.area||"commercial"} onChange={e => setEd(p => ({...p, area:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  {["commercial","finances","marketing","produits","clientsArea","logistique","admin"].map(a => <option key={a} value={a}>{t(a)}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>Status</div>
                <select value={ed.status||"aFaire"} onChange={e => setEd(p => ({...p, status:e.target.value}))} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box"}}>
                  <option value="aFaire">{t("aFaire")}</option><option value="enCours">{t("enCours")}</option><option value="fait">{t("fait")}</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={() => { setTasks(p => p.map(tk => tk.id === ed.id ? {...ed} : tk)); dbUpdateTask(ed); setModal(null); }} style={{flex:1}}>{t("enregistrer")}</Btn>
              <Btn ghost onClick={() => { setTasks(p => p.filter(tk => tk.id !== ed.id)); dbDeleteTask(ed.id); setModal(null); }} style={{color:C.rd,borderColor:C.rd}}>{t("eliminarTarea")}</Btn>
            </div>
          </>}
        </div>
      </div>
    );
  };

  /* ═══ PROMO CARD RENDERER ═══ */
  const renderPromoCard = (p, i, canEdit) => (
    <div key={i} style={{background:C.wh,border:"1px solid "+(p.on?C.gn+"40":C.ln),borderRadius:6,padding:22,opacity:p.on?1:0.5,cursor:canEdit?"pointer":"default"}} onClick={() => { if(canEdit){ setModal("editPromo"); setEd({...p}); }}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:15,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.name}</span>
        <Badge l={p.on?t("active"):t("inactive")} c={p.on?C.gn:C.gr} />
      </div>
      <div style={{fontSize:24,fontWeight:300,fontFamily:DP,color:C.gn,marginBottom:6}}>{p.type==="percent"?"-"+p.disc+" %":t("cadeau")}</div>
      <div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{(p.cond && p.cond[lang]) || (p.cond && p.cond.fr) || ""}</div>
      {canEdit && <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>{(p.visible||[]).map(v => <Badge key={v} l={v==="distributor"?t("distributeur"):t("client")} c={v==="distributor"?C.bl:C.gn} />)}{p.targetClients && p.targetClients.length > 0 && <span style={{fontSize:9,fontFamily:BD,color:C.bl,padding:"2px 6px",background:C.bl+"15",borderRadius:3}}>{p.targetClients.join(", ")}</span>}</div>}
    </div>
  );

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:BD}}>
      {renderNav()}

      {/* NOTIF OVERLAY */}
      {notifOpen && <div style={{position:"fixed",inset:0,zIndex:190}} onClick={() => setNotifOpen(false)} />}

      {/* PROFILE POPUP */}
      {profileOpen && <div style={{position:"fixed",inset:0,zIndex:180}} onClick={() => setProfileOpen(false)}>
        <div style={{position:"absolute",top:52,right:16,width:"min(340px, 85vw)",background:C.wh,borderRadius:8,border:"1px solid "+C.ln,boxShadow:"0 8px 30px rgba(24,51,47,0.12)",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
          <div style={{padding:"20px 20px 16px",background:darkMode?"#1e2d29":CL.dk,color:"#f8efe6"}}>
            <div style={{fontSize:18,fontFamily:DP,fontWeight:500}}>{user.name}</div>
            <div style={{fontSize:11,fontFamily:BD,opacity:0.6,marginTop:2}}>{user.email}</div>
            <div style={{marginTop:8,display:"flex",gap:6,alignItems:"center"}}><Badge l={role==="admin"?"Admin":role==="distributor"?t("distributeur"):t("client")} c={role==="admin"?"#96a5a1":role==="distributor"?C.bl:C.gn} />{role === "client" && activeClient && activeClient.status === "vip" && <span style={{fontSize:9,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#fdf6e3,#f5ecd8)",padding:"3px 10px",borderRadius:4,letterSpacing:2,border:"1px solid #d4a03050"}}>★ VIP</span>}</div>
          </div>
          <div style={{padding:"14px 20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 12px"}}>
              <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("entreprise")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.co || "—"}</div>
              </div>
              <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("langue")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{(user.lang||"fr").toUpperCase()}</div>
              </div>
              {user.city && <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("ville")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.city}{user.country ? " ("+user.country+")" : ""}</div>
              </div>}
              {user.phone && <div>
                <div style={{fontSize:9,color:C.gr,fontFamily:BD,marginBottom:2,textTransform:"uppercase"}}>{t("telephone")}</div>
                <div style={{fontSize:12,fontFamily:BD,color:C.dk}}>{user.phone}</div>
              </div>}
            </div>
            <div style={{borderTop:"1px solid "+C.ln,marginTop:12,paddingTop:12,display:"flex",gap:8}}>
              {role !== "admin" && <Btn small ghost onClick={() => { setProfileOpen(false); setView(role==="distributor"?"d-account":"c-account"); }}>{t("monCompte")}</Btn>}
              <Btn small ghost onClick={() => { setProfileOpen(false); setUser(null); setCart({}); setLoginEmail(""); setLoginPw(""); try { localStorage.removeItem("minue_session"); localStorage.removeItem("minue_view"); } catch(e) { console.log('DB error:', e); } }} style={{color:C.rd,borderColor:C.rd}}>{t("deconnexion")}</Btn>
            </div>
          </div>
        </div>
      </div>}
      {renderModal()}

      {/* CLIENT VIEWS */}
      {/* CLIENT HOME */}
      {view === "c-home" && <div>
        {/* HERO GREETING */}
        <div style={{padding:"min(40px, 8vw) min(24px, 4vw) min(28px, 5vw)",background:darkMode?"linear-gradient(135deg,#141c1a,#1e2d29)":"linear-gradient(135deg,"+CL.dk+","+CL.dk+"dd)",color:darkMode?"#e8dfd6":CL.bg}}>
          <div style={{fontSize:"min(28px, 6vw)",fontFamily:DP,fontWeight:400,marginBottom:6}}>{t("bienvenida")}, {user.name} ✦</div>
          {activeClient && activeClient.status === "vip" && <div style={{marginBottom:8}}><span style={{fontSize:10,fontFamily:BD,fontWeight:800,color:"#d4a030",background:"linear-gradient(135deg,#d4a03015,#c4903a15)",padding:"4px 12px",borderRadius:5,letterSpacing:2,border:"1px solid #d4a03030"}}>★ VIP</span></div>}
          <div style={{fontSize:13,fontFamily:BD,color:"rgba(248,239,230,0.7)",maxWidth:500,lineHeight:1.5}}>{t("bienvenidaSub")}</div>
          <Btn onClick={() => setView("c-cat")} style={{marginTop:16,background:darkMode?"#e8dfd6":CL.bg,color:darkMode?"#141c1a":CL.dk,border:"none"}}>{t("descubrirCol")} →</Btn>
        </div>

        {/* ORDER NOTIFICATIONS */}
        <div style={{padding:"20px min(24px, 4vw)"}}>
          {orders.filter(o => o.client === (user.name || user.co)).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("notifTitre")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
              {orders.filter(o => o.client === (user.name || user.co)).slice(0,3).map((o,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                  <div style={{background:C.dk+"08",borderRadius:6,padding:"6px 10px"}}>
                    <span style={{fontSize:15,fontFamily:BD,color:C.dk,fontWeight:700,letterSpacing:0.5}}>{o.id}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:500}}>{o.items} {t("unites")} · {fmt(o.total)} €</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>{o.date}</div>
                  </div>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                  {o.track && <a href={o.trackUrl||"#"} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:BD,color:C.bl,textDecoration:"none",background:C.bl+"10",padding:"4px 8px",borderRadius:4}} onClick={e => e.stopPropagation()}>📦 Track</a>}
                </div>
              ))}
            </div>
          </>}

          {/* BEST SELLERS - social proof */}
          <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("topVentas")}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
            {(() => { const sold = {}; orders.forEach(o => (o.lines||[]).forEach(l => { sold[l.model+"|"+l.color] = (sold[l.model+"|"+l.color]||0) + (l.qty||0); })); const topSkus = Object.entries(sold).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => k.split("|")); const topProds = topSkus.map(([m,c]) => products.find(p => p.model === m && p.color === c)).filter(Boolean); return topProds.length > 0 ? topProds.map(p => renderCard(p)) : products.filter(p => (p.tags||[]).includes("top")).slice(0,3).map(p => renderCard(p)); })()}
          </div>

          {/* YOUR MOST ORDERED */}
          {(() => { const myOrders = orders.filter(o => o.client === (user.name||user.co)); const mySold = {}; myOrders.forEach(o => (o.lines||[]).forEach(l => { const k = l.model+"|"+l.color; mySold[k] = (mySold[k]||0) + (l.qty||0); })); const myTop = Object.entries(mySold).sort((a,b) => b[1]-a[1]).slice(0,4); const myTopProds = myTop.map(([k,qty]) => { const [m,c] = k.split("|"); const p = products.find(x => x.model === m && x.color === c); return p ? {p,qty} : null; }).filter(Boolean); return myTopProds.length > 0 ? <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("tusMasPedidos")}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
              {myTopProds.map(({p,qty}) => (
                <div key={p.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden",position:"relative"}}>
                  <div style={{height:"min(140px, 35vw)",background:C.wh,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.model} style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} /> : <span style={{fontSize:28,fontFamily:DP,color:C.ln}}>MINUË</span>}
                  </div>
                  <div style={{padding:"10px 14px",background:"#faf6f1"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                      <span style={{fontSize:13,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</span>
                      <span style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:600}}>x{qty}</span>
                    </div>
                    <div style={{fontSize:11,color:C.gr,fontFamily:BD,marginTop:2}}>{p.color}</div>
                    <div style={{fontSize:9,color:C.gr2,fontFamily:BD,marginTop:2}}>{t("vecesComprado").replace("%n",String(qty))}</div>
                  </div>
                </div>
              ))}
            </div>
          </> : null; })()}

          {/* SMART RECOMMENDATIONS - products client hasn't ordered yet, popular globally */}
          {(() => {
            const myOrders = orders.filter(o => o.client === (user.name||user.co));
            const myModels = new Set(); myOrders.forEach(o => (o.lines||[]).forEach(l => myModels.add(l.model+"|"+l.color)));
            const globalSold = {}; orders.forEach(o => (o.lines||[]).forEach(l => { globalSold[l.model+"|"+l.color] = (globalSold[l.model+"|"+l.color]||0) + (l.qty||0); }));
            const recos = Object.entries(globalSold).filter(([k]) => !myModels.has(k)).sort((a,b) => b[1]-a[1]).slice(0,4).map(([k]) => { const [m,c] = k.split("|"); return products.find(p => p.model === m && p.color === c); }).filter(Boolean);
            const display = recos.length > 0 ? recos : products.filter(p => !myModels.has(p.model+"|"+p.color) && (p.tags||[]).some(t => ["top","new","rec"].includes(t))).slice(0,4);
            return display.length > 0 ? <>
              <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("recoInteligente")}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
                {display.map(p => renderCard(p))}
              </div>
            </> : null;
          })()}

          {/* PRICING TIER NUDGE */}
          {customPrice === 0 && (() => {
            const tiers = [[10,22.90],[20,19.90],[30,18.90],[40,17.90]];
            const currentUnits = orders.filter(o => o.client === (user.name||user.co)).reduce((s,o) => s+o.items, 0);
            const next = tiers.find(([min]) => currentUnits < min);
            return next ? <div style={{background:"linear-gradient(135deg,"+CL.dk+"08,"+CL.gn+"08)",border:"1px solid "+CL.gn+"25",borderRadius:8,padding:"16px 20px",marginBottom:28,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{t("tuTarifa")}</div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4,lineHeight:1.5}}>{t("proximoTramo").replace("%n", String(next[0]-currentUnits))} <span style={{fontWeight:700,color:C.gn}}>{fmt(next[1])} €{t("porUnidad")}</span></div>
              </div>
              <Btn small onClick={() => setView("c-cat")}>{t("descubrirCol")}</Btn>
            </div> : null;
          })()}

          {/* NEW ARRIVALS */}
          {products.filter(p => (p.tags||[]).includes("new")).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("novedades")}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:28}}>
              {products.filter(p => (p.tags||[]).includes("new")).slice(0,4).map(p => renderCard(p))}
            </div>
          </>}

          {/* LATEST NEWS */}
          {news.filter(n => n.on).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("dernieresNouv")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
              {news.filter(n => n.on).slice(0,2).map((n,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div>
                    <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:600}}>{(n.title&&n.title[lang])||n.title?.fr||""}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:4,lineHeight:1.4}}>{((n.content&&n.content[lang])||n.content?.fr||"").substring(0,120)}{((n.content&&n.content[lang])||"").length>120?"...":""}</div>
                  </div>
                  {n.url && <a href={n.url} target="_blank" rel="noreferrer" style={{fontSize:11,fontFamily:BD,color:C.gn,whiteSpace:"nowrap",textDecoration:"none",fontWeight:600}}>→</a>}
                </div>
              ))}
            </div>
          </>}

          {/* ACTIVE PROMOS */}
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).length > 0 && <>
            <div style={{fontSize:18,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:14}}>{t("promosActives")}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
              {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).slice(0,3).map((p,i) => renderPromoCard(p, i, false))}
            </div>
          </>}
        </div>
      </div>}

      {view === "c-cat" && <Sec title={t("collSS26")} sub={t("collSub")} right={<input placeholder={t("rechercher")} value={filter} onChange={e => setFilter(e.target.value)} style={{padding:"8px 14px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,width:"min(200px, 40vw)"}} />}>
        <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
          {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) => (
            <button key={v} onClick={() => { setColFilter(v); setFavFilter(false); }} style={{padding:"5px 14px",background:colFilter===v&&!favFilter?C.dk:"transparent",color:colFilter===v&&!favFilter?C.bg:C.gr,border:"1px solid "+(colFilter===v&&!favFilter?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          {favs.length > 0 && <button onClick={() => setFavFilter(!favFilter)} style={{padding:"5px 12px",background:favFilter?"#6b4c3b":"transparent",color:favFilter?"#fff":"#6b4c3b",border:"1px solid "+(favFilter?"#6b4c3b":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={favFilter?"#fff":"#6b4c3b"} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> {favs.length}
          </button>}
          <span style={{flex:1}} />
          <button onClick={() => setFilterPanel(filterPanel==="shape"?null:"shape")} style={{padding:"5px 12px",background:filterPanel==="shape"?C.dk:shapeFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="shape"?C.bg:shapeFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="shape"||shapeFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("forme")}{shapeFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="shape"?C.bg:C.dk}} />}
          </button>
          <button onClick={() => setFilterPanel(filterPanel==="color"?null:"color")} style={{padding:"5px 12px",background:filterPanel==="color"?C.dk:colorFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="color"?C.bg:colorFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="color"||colorFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("couleur")}{colorFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="color"?C.bg:C.dk}} />}
          </button>
        </div>
        {filterPanel==="shape"&&<div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln}}>
          {[["all","toutes"],["ronde","ronde"],["carree","carree"],["catEye","catEye"],["rectangulaire","rectangulaire"],["aviateur","aviateur"],["oversize","oversize"],["geometrique","geometrique"]].map(([v,k]) => (
            <button key={v} onClick={() => { setShapeFilter(v); if(v!=="all") setFilterPanel(null); }} style={{padding:"5px 12px",background:shapeFilter===v?C.dk:"transparent",color:shapeFilter===v?C.bg:C.dk,border:"1px solid "+(shapeFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{v==="all"?t("toutes"):t(k)}</button>
          ))}
        </div>}
        {filterPanel==="color"&&<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln,alignItems:"center"}}>
          <button onClick={() => { setColorFilter("all"); setFilterPanel(null); }} style={{padding:"4px 10px",background:colorFilter==="all"?C.dk:"transparent",color:colorFilter==="all"?C.bg:C.gr,border:"1px solid "+(colorFilter==="all"?C.dk:C.ln),cursor:"pointer",fontSize:9,fontFamily:BD,borderRadius:20}}>{t("tous")}</button>
          {[["noir","#1a1a1a"],["careyCol","#8B6914"],["marron","#7B4B2A"],["vert","#2d6b4f"],["dore","#C5A55A"],["rose","#D4839A"],["bleu","#3B6B9E"],["rougeVin","#722f37"],["orangeCol","#D4763A"],["cremeNude","#E8D5C0"],["gris","#8C8C8C"],["transparentCol","#f5f5f5"],["multicolore","conic-gradient(#e74c3c,#f1c40f,#2ecc71,#3498db,#e74c3c)"]].map(([v,bg]) => (
            <button key={v} onClick={() => { setColorFilter(v); setFilterPanel(null); }} title={t(v)} style={{width:26,height:26,borderRadius:13,background:bg,border:colorFilter===v?"3px solid "+C.dk:"2px solid "+C.ln,cursor:"pointer",boxShadow:colorFilter===v?"0 0 0 2px "+C.bg+", 0 0 0 4px "+C.dk:"none",padding:0}} />
          ))}
        </div>}
        {essentialCount > 0 && customPrice === 0 && renderTierBar()}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {products.filter(p => (favFilter ? favs.includes(p.id) : true) && (colFilter === "all" || p.col === colFilter) && (shapeFilter === "all" || p.shape === shapeFilter) && (colorFilter === "all" || p.colorFamily === colorFilter) && (!filter || p.model.toLowerCase().includes(filter.toLowerCase()) || p.color.toLowerCase().includes(filter.toLowerCase()))).map(p => renderCard(p))}
        </div>
      </Sec>}

      {view === "c-cart" && <Sec title={t("panier")}>
        {cartEntries.length === 0
          ? <div style={{textAlign:"center",padding:40,fontFamily:BD,color:C.gr}}><p>{t("panierVide")}</p><Btn onClick={() => setView("c-cat")}>{t("voirCat")}</Btn></div>
          : <div style={{maxWidth:800,margin:"0 auto"}}>
              {customPrice > 0 && <div style={{background:"#f0f6fa",border:"1px solid "+C.bl+"30",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.bl,fontWeight:500}}>{t("prixFixeClient")}: {fmt(customPrice)} €/{t("unites")}</div>}
              {customPrice === 0 && renderTierBar()}
              {customPrice === 0 && essentialCount > 0 && nextTier && <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{t("astucePrix")}</div>}
              {cartEntries.map(([id, q]) => { const p = products.find(x => String(x.id) === String(id)); const itemPrice = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice; return (
                <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                  <div><div style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div><div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color} {p.col === "Acetato" ? <span style={{fontSize:9,color:"#7a5c3a",background:"#e8d5c0",padding:"1px 5px",borderRadius:2,marginLeft:4}}>Acetato</span> : ""}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{fmt(itemPrice)} €</span>
                    <button onClick={() => updateQty(+id, q-1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk,fontFamily:BD}}>-</button>
                    <span style={{fontSize:13,fontFamily:BD,minWidth:22,textAlign:"center"}}>{q}</span>
                    <button onClick={() => updateQty(+id, q+1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk,fontFamily:BD}}>+</button>
                    <span style={{fontSize:13,fontFamily:BD,fontWeight:600,minWidth:65,textAlign:"right"}}>{fmt(itemPrice*q)} €</span>
                  </div>
                </div>
              ); })}
              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:16}}>
                {essentialCount > 0 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gr}}>Essential: {essentialCount} {t("unites")} x {fmt(essentialUnitPrice)} €</span><span style={{fontFamily:BD,fontSize:12}}>{fmt(essentialTotal)} €</span></div>}
                {acetatoCount > 0 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:"#7a5c3a"}}>Acetato: {acetatoCount} {t("unites")}</span><span style={{fontFamily:BD,fontSize:12}}>{fmt(acetatoTotal)} €</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.dk,fontWeight:600}}>{t("totalHT")}</span><span style={{fontFamily:BD,fontSize:13,fontWeight:600}}>{fmt(cartTotal)} €</span></div>
                {earlyPay && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>{t("prontoPago")}</span><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>-{fmt(earlyPaySaving)} €</span></div>}
                {cartCount >= 20 && <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:BD,fontSize:12,color:C.gn}}>{t("envoi")}</span><span style={{fontFamily:BD,fontSize:12,color:C.gn,fontWeight:600}}>{t("gratuit")}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"12px 0"}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("totalHT")}</div>
                    <div style={{fontSize:30,fontWeight:300,fontFamily:DP,color:C.dk}}>{fmt(finalTotal)} €</div>
                  </div>
                  <Btn onClick={doOrder}>{t("passerCmd")}</Btn>
                </div>
              </div>
            </div>
        }
        {submitted && <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}><div style={{background:C.wh,padding:"40px 50px",textAlign:"center",borderRadius:8}}><div style={{fontSize:32,color:C.gn}}>OK</div><div style={{fontSize:18,fontFamily:DP,color:C.dk,marginTop:8}}>{t("cmdEnvoyee")}</div></div></div>}
      </Sec>}

      {view === "c-ord" && <Sec title={t("mesCmd")}>{orders.filter(o => o.client === user.co).length ? <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{orders.filter(o => o.client === user.co).map((o,i) => <div key={i}>{renderOrderRow(o, i, false, false)}{o.clientNotes && <div style={{padding:"8px 14px 12px",background:"#f0f6fa",borderBottom:"1px solid "+C.bg2,fontSize:11,fontFamily:BD,color:C.bl}}><span style={{fontWeight:600,fontSize:10}}>{t("noteDuCmd")}:</span> {o.clientNotes}</div>}</div>)}</div> : <p style={{color:C.gr,fontFamily:BD}}>{t("aucuneCmd")}</p>}</Sec>}

      {view === "c-tarifs" && <Sec title={t("tarifVolume")} sub={t("tarifVolSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
          {TIERS.map((tier, i) => { const isA = cartCount >= tier.min && cartCount <= tier.max && customPrice === 0; return (
            <div key={i} style={{background:C.wh,border:"2px solid "+(isA?C.gn:C.ln),borderRadius:6,padding:18,position:"relative"}}>
              {isA && <div style={{position:"absolute",top:-10,right:12,background:C.gn,color:C.bg,fontSize:9,fontFamily:BD,padding:"2px 8px",borderRadius:3,fontWeight:600}}>{t("votreTarif")}</div>}
              <div style={{fontSize:22,fontWeight:300,fontFamily:DP,color:C.dk,marginBottom:4}}>{tier.label} uds</div>
              <div style={{fontSize:26,fontWeight:500,fontFamily:DP,color:isA?C.gn:C.dk}}>{fmt(tier.price)} €</div>
              <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("parUnite")}</div>
              <div style={{borderTop:"1px solid "+C.ln,marginTop:10,paddingTop:10}}>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:3}}>{t("paiement")}: <span style={{color:C.dk,fontWeight:500}}>{t(tier.payK)}</span></div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:3}}>{t("envoi")}: <span style={{color:tier.shipK==="gratuit"?C.gn:C.dk,fontWeight:500}}>{t(tier.shipK)}</span></div>
                <div style={{fontSize:11,fontFamily:BD,color:C.gr}}>{t("expositor")}: <span style={{color:C.dk,fontWeight:500}}>{t(tier.dispK)}</span></div>
              </div>
            </div>
          ); })}
          <div style={{background:C.bg2,border:"1px solid "+C.ln,borderRadius:6,padding:18,display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"}}>
            <div style={{fontSize:20,fontFamily:DP,color:C.dk}}>+60 uds</div>
            <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6}}>{t("contactAgent")}</div>
          </div>
        </div>
      </Sec>}

      {view === "c-res" && <Sec title={t("resVisuelles")} sub={t("resSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {[
            {icon:"HQ",title:t("resPhotos"),desc:"PNG/JPG 2000px",url:"https://drive.google.com/drive/folders/minue-photos-hd",type:"link"},
            {icon:"LF",title:t("resLifestyle"),desc:"Campaign & editorial",url:"https://drive.google.com/drive/folders/minue-lifestyle",type:"link"},
            {icon:"LG",title:t("resLogos"),desc:"PNG, SVG, AI",url:"https://drive.google.com/drive/folders/minue-logos",type:"link"},
            {icon:"TX",title:t("resTextes"),desc:"FR / ES / EN",url:"https://drive.google.com/drive/folders/minue-textes",type:"link"},
            {icon:"SS26",title:t("resCatalogue"),desc:"PDF 24 pages",url:"https://minueopticians.com/catalogue-ss26.pdf",type:"download"},
            {icon:"GV",title:t("resGuide"),desc:"PDF",url:"https://minueopticians.com/guide-vente.pdf",type:"download"},
          ].map((r, j) => (
            <div key={j} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"18px 20px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:44,height:44,borderRadius:6,background:C.bg,border:"1px solid "+C.ln,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:BD,fontWeight:700,color:C.dk,flexShrink:0}}>{r.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,fontFamily:DP,color:C.dk}}>{r.title}</div>
                <div style={{fontSize:10,color:C.gr2,fontFamily:BD,marginTop:2}}>{r.desc}</div>
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{padding:"6px 14px",background:r.type==="download"?C.dk:"transparent",color:r.type==="download"?C.bg:C.dk,border:"1px solid "+(r.type==="download"?C.dk:C.ln),fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:3,textDecoration:"none",whiteSpace:"nowrap",cursor:"pointer"}}>{r.type==="download"?t("telecharger"):t("acceder")}</a>
            </div>
          ))}
        </div>
      </Sec>}

      {/* TARIFS DISTRIBUTOR */}
      {view === "d-tarifs" && <Sec title={t("tarifVolume")} sub={t("tarifVolSub")}>
        {(() => {
          const tierConditions = [
            ["Paiement unique / Pago único","Envoi payant / Envío de pago","Présentoir en option / Expositor opcional","PVP 45-50 €"],
            ["Paiement unique / Pago único","Envoi payant / Envío de pago","1 présentoir inclus / 1 expositor incluido","PVP 45-50 €"],
            ["2 paiements à 30 jours / 2 pagos a 30 días","Envoi gratuit / Envío gratuito","2 présentoirs inclus / 2 expositores incluidos","PVP 45-50 €"],
            ["2 paiements à 30 jours / 2 pagos a 30 días","Envoi gratuit / Envío gratuito","3 présentoirs inclus / 3 expositores incluidos","PVP 45-50 €"],
            ["2 paiements 15/45 jours / 2 pagos 15/45 días","Envoi gratuit / Envío gratuito","3 présentoirs inclus / 3 expositores incluidos","Meilleur tarif / Mejor tarifa","PVP 45-50 €"]
          ];
          return <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"14px 16px",background:C.dk,color:C.bg}}>
              <div style={{fontSize:14,fontFamily:DP,fontWeight:600}}>{t("tarifs")} Essential & Icons</div>
            </div>
            {TIERS.map((tier, i) => {
              const isActive = essentialCount >= tier.min && essentialCount <= tier.max;
              const isOpen = expandedTier === i;
              return (
                <div key={i}>
                  <div onClick={() => setExpandedTier(isOpen ? -1 : i)} style={{display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.bg2,background:isActive?C.gn+"08":"transparent",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e => {if(!isActive) e.currentTarget.style.background=C.bg}} onMouseLeave={e => {if(!isActive) e.currentTarget.style.background="transparent"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{tier.label} {t("unites")}</div>
                      <div style={{fontSize:10,fontFamily:BD,color:C.bl,marginTop:3,cursor:"pointer"}}>{isOpen ? "▲ Masquer" : "▼ Voir conditions"}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:isActive?C.gn:C.dk}}>{fmt(tier.price)} €</div>
                      <div style={{fontSize:9,fontFamily:BD,color:C.gr}}>/ ud</div>
                    </div>
                    {isActive && <span style={{marginLeft:8,fontSize:9,fontFamily:BD,color:"#fff",background:C.gn,padding:"2px 8px",borderRadius:10,fontWeight:600}}>{t("votreTarif")}</span>}
                  </div>
                  {isOpen && <div style={{padding:"10px 16px 14px",background:isActive?C.gn+"05":C.bg,borderBottom:"1px solid "+C.ln}}>
                    {(tierConditions[i]||[]).map((cond, j) => (
                      <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:11,fontFamily:BD,color:C.dk}}>
                        <span style={{color:C.gn,fontSize:10}}>✓</span> {cond}
                      </div>
                    ))}
                  </div>}
                </div>
              );
            })}
          </div>;
        })()}
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <div style={{padding:"14px 16px",background:"#7a5c3a",color:C.bg}}>
            <div style={{fontSize:14,fontFamily:DP,fontWeight:600}}>{t("tarifs")} Acetato</div>
          </div>
          <div style={{display:"flex",alignItems:"center",padding:"14px 16px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>Prix unique / Precio único</div>
              <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:2}}>PVP 70 €</div>
            </div>
            <div style={{fontSize:16,fontFamily:BD,fontWeight:700,color:C.dk}}>{fmt(ACETATO_PRICE)} €</div>
            <span style={{marginLeft:8,fontSize:9,fontFamily:BD,color:C.gr}}>/ ud</span>
          </div>
        </div>
        <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.6}}>
            • PVP Essential & Icons: 45-50 €<br/>
            • PVP Acetato: 70 €<br/>
            • {t("gratuit")} ≥ 20 {t("unites")}<br/>
            • Early pay: -3%
          </div>
        </div>
      </Sec>}

      {(view === "c-selection" || view === "d-selection") && <Sec title={t("selectionPrivee")} sub={t("selectionSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {products.filter(p => (p.tags||[]).includes("privee")).map(p => renderCard(p))}
          {products.filter(p => (p.tags||[]).includes("privee")).length === 0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:40}}>
            <div style={{fontSize:20,fontFamily:DP,color:C.dk,marginBottom:8}}>{t("selectionPrivee")}</div>
            <div style={{fontSize:12,fontFamily:BD,color:C.gr}}>Bientôt disponible · Próximamente · Coming soon</div>
          </div>}
        </div>
      </Sec>}

      {view === "c-promo" && <Sec title={t("promosClient")} sub={t("promosSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).map((p,i) => renderPromoCard(p, i, false))}
          {promos.filter(p => p.on && (p.visible||[]).includes("client") && (!p.targetClients || p.targetClients.length === 0 || p.targetClients.includes(user.co))).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "c-news" && <Sec title={t("nouveautes")} sub={t("nouveautesSub")}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"20px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:16,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <span style={{fontSize:9,fontFamily:BD,color:C.yl,fontWeight:600}}>PINNED</span>}
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.6}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
              {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontFamily:BD,color:C.bl,marginTop:6,display:"inline-block",textDecoration:"none",fontWeight:500}}>{t("voirPlus")} →</a>}
            </div>
          ))}
          {news.filter(n => n.on).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "c-account" && <Sec title={t("monCompte")}>
        <div style={{maxWidth:640}}>
          {/* PERSONAL */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("datosPersonales")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.name}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.email}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.co || "—"}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("telephone")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.phone || "—"}</div>
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("dirEnvio")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("direccion"),"shippingAddress"],[t("ville"),"shippingCity"],[t("codePostal"),"shippingPostal"],[t("pays"),"shippingCountry"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          {/* BILLING */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("dirFacturacion")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("ville"),"city"],[t("codePostal"),"postalCode"],[t("pays"),"country"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          {/* BANK */}
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesBancaires")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Btn onClick={() => { dbSaveAccountData(accountData); setAccountSaved(true); }}>{t("sauvegarder")}</Btn>
            {accountSaved && <span style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>{t("donneesSauvees")}</span>}
          </div>
        </div>
      </Sec>}

      {/* DISTRIBUTOR VIEWS */}
      {view === "d-dash" && <>
        <div style={{padding:"min(30px, 6vw) min(24px, 4vw) min(20px, 4vw)",background:darkMode?"linear-gradient(135deg,#141c1a,#1e2d29)":"linear-gradient(135deg,"+CL.dk+","+CL.dk+"dd)",color:darkMode?"#e8dfd6":"#f8efe6"}}>
          <div style={{fontSize:"min(24px, 5vw)",fontFamily:DP,fontWeight:400,marginBottom:4}}>{t("bienvenida")}, {user.name} ✦</div>
          <div style={{fontSize:12,fontFamily:BD,opacity:0.6}}>{user.co}</div>
        </div>
        <div style={{padding:"20px min(24px, 4vw)"}}>
          {/* ORDER NOTIFICATIONS */}
          {distOrders.length > 0 && <div style={{marginBottom:20}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:10}}>{t("notifTitre")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {distOrders.slice(0,3).map((o,i) => (
                <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={() => { setModal("viewOrd"); setEd({...o, idx:orders.indexOf(o)}); }}>
                  <span style={{fontSize:13,fontFamily:DP,color:C.dk,fontWeight:600}}>{o.id}</span>
                  <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                  <Badge l={PL[o.pay]} c={PC[o.pay]} />
                </div>
              ))}
            </div>
          </div>}

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10,marginBottom:20}}>
            {renderKPI(t("ventesTot"), fmt(distSales)+" €")}
            {renderKPI(t("commTot")+" ("+(user.commRate||15)+"%)", fmt(distComm)+" €", C.gn)}
            {renderKPI(t("percue"), fmt(distPaid)+" €", C.gn)}
            {renderKPI(t("aPercevoir"), fmt(distInvoiced)+" €", distInvoiced > 0 ? C.yl : C.gn)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            <div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("dernieresCmd")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{distOrders.slice(0,5).map((o,i) => renderOrderRow(o, i, true, false))}</div>
            </div>
            <div>
              <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:8}}>{t("mesClients")}</div>
              <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6}}>
                {distClients.map(c => { const cOrds = distOrders.filter(o => o.client === c.name); return {...c, _total: cOrds.reduce((s,o) => s+o.total, 0), _orders: cOrds.length}; }).sort((a,b) => b._total - a._total).map((c, i) => <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:"1px solid "+C.bg2}}><div><div style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{c.name}</div><div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{c.contact} · {c.city} · {c._orders} cmd</div></div><span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:c._total>0?C.gn:C.gr}}>{fmt(c._total)} €</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </>}

      {view === "d-cat" && <Sec title={t("collSS26")} sub={t("collSub")} right={<input placeholder={t("rechercher")} value={filter} onChange={e => setFilter(e.target.value)} style={{padding:"8px 14px",border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.wh,color:C.dk,width:"min(200px, 40vw)"}} />}>
        <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
          {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) => (
            <button key={v} onClick={() => { setColFilter(v); setFavFilter(false); }} style={{padding:"5px 14px",background:colFilter===v&&!favFilter?C.dk:"transparent",color:colFilter===v&&!favFilter?C.bg:C.gr,border:"1px solid "+(colFilter===v&&!favFilter?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          {favs.length > 0 && <button onClick={() => setFavFilter(!favFilter)} style={{padding:"5px 12px",background:favFilter?"#6b4c3b":"transparent",color:favFilter?"#fff":"#6b4c3b",border:"1px solid "+(favFilter?"#6b4c3b":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={favFilter?"#fff":"#6b4c3b"} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> {favs.length}
          </button>}
          <span style={{flex:1}} />
          <button onClick={() => setFilterPanel(filterPanel==="shape"?null:"shape")} style={{padding:"5px 12px",background:filterPanel==="shape"?C.dk:shapeFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="shape"?C.bg:shapeFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="shape"||shapeFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("forme")}{shapeFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="shape"?C.bg:C.dk}} />}
          </button>
          <button onClick={() => setFilterPanel(filterPanel==="color"?null:"color")} style={{padding:"5px 12px",background:filterPanel==="color"?C.dk:colorFilter!=="all"?C.dk+"15":"transparent",color:filterPanel==="color"?C.bg:colorFilter!=="all"?C.dk:C.gr,border:"1px solid "+(filterPanel==="color"||colorFilter!=="all"?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20,display:"flex",alignItems:"center",gap:4}}>
            {t("couleur")}{colorFilter!=="all"&&<span style={{width:6,height:6,borderRadius:3,background:filterPanel==="color"?C.bg:C.dk}} />}
          </button>
        </div>
        {filterPanel==="shape"&&<div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln}}>
          {[["all","toutes"],["ronde","ronde"],["carree","carree"],["catEye","catEye"],["rectangulaire","rectangulaire"],["aviateur","aviateur"],["oversize","oversize"],["geometrique","geometrique"]].map(([v,k]) => (
            <button key={v} onClick={() => { setShapeFilter(v); if(v!=="all") setFilterPanel(null); }} style={{padding:"5px 12px",background:shapeFilter===v?C.dk:"transparent",color:shapeFilter===v?C.bg:C.dk,border:"1px solid "+(shapeFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,borderRadius:20}}>{v==="all"?t("toutes"):t(k)}</button>
          ))}
        </div>}
        {filterPanel==="color"&&<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",padding:"10px 14px",background:C.wh,borderRadius:6,border:"1px solid "+C.ln,alignItems:"center"}}>
          <button onClick={() => { setColorFilter("all"); setFilterPanel(null); }} style={{padding:"4px 10px",background:colorFilter==="all"?C.dk:"transparent",color:colorFilter==="all"?C.bg:C.gr,border:"1px solid "+(colorFilter==="all"?C.dk:C.ln),cursor:"pointer",fontSize:9,fontFamily:BD,borderRadius:20}}>{t("tous")}</button>
          {[["noir","#1a1a1a"],["careyCol","#8B6914"],["marron","#7B4B2A"],["vert","#2d6b4f"],["dore","#C5A55A"],["rose","#D4839A"],["bleu","#3B6B9E"],["rougeVin","#722f37"],["orangeCol","#D4763A"],["cremeNude","#E8D5C0"],["gris","#8C8C8C"],["transparentCol","#f5f5f5"],["multicolore","conic-gradient(#e74c3c,#f1c40f,#2ecc71,#3498db,#e74c3c)"]].map(([v,bg]) => (
            <button key={v} onClick={() => { setColorFilter(v); setFilterPanel(null); }} title={t(v)} style={{width:26,height:26,borderRadius:13,background:bg,border:colorFilter===v?"3px solid "+C.dk:"2px solid "+C.ln,cursor:"pointer",boxShadow:colorFilter===v?"0 0 0 2px "+C.bg+", 0 0 0 4px "+C.dk:"none",padding:0}} />
          ))}
        </div>}
        {essentialCount > 0 && customPrice === 0 && renderTierBar()}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>{products.filter(p => (favFilter ? favs.includes(p.id) : true) && (colFilter === "all" || p.col === colFilter) && (shapeFilter === "all" || p.shape === shapeFilter) && (colorFilter === "all" || p.colorFamily === colorFilter) && (!filter || p.model.toLowerCase().includes(filter.toLowerCase()) || p.color.toLowerCase().includes(filter.toLowerCase()))).map(p => renderCard(p))}</div>
      </Sec>}

      {view === "d-cart" && <Sec title={t("panier")}>
        <div style={{marginBottom:14,padding:"12px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:4,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:11,color:C.gr,fontFamily:BD,fontWeight:500}}>{t("cmdPour")}</span>
          {distClients.length > 0 ? <select value={cartCl} onChange={e => setCartCl(e.target.value)} style={{flex:1,padding:8,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk}}>
            <option value="">{t("choisir")}</option>
            {distClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select> : <span style={{flex:1,fontSize:11,fontFamily:BD,color:C.gr2,fontStyle:"italic"}}>Chargement clients...</span>}
        </div>
        {cartEntries.length === 0
          ? <div style={{textAlign:"center",padding:40,fontFamily:BD,color:C.gr}}><p>{t("panierVide")}</p><Btn onClick={() => setView("d-cat")}>{t("voirCat")}</Btn></div>
          : <div style={{maxWidth:800,margin:"0 auto"}}>
              {customPrice > 0 && <div style={{background:"#f0f6fa",border:"1px solid "+C.bl+"30",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.bl,fontWeight:500}}>{t("prixFixeClient")}: {fmt(customPrice)} €/{t("unites")}</div>}
              {customPrice === 0 && renderTierBar()}
              {customPrice === 0 && essentialCount > 0 && nextTier && <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{t("astucePrix")}</div>}
              {cartEntries.map(([id, q]) => { const p = products.find(x => String(x.id) === String(id)); const itemPrice = p.col === "Acetato" ? p.fixedPrice : essentialUnitPrice; return (
                <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid "+C.bg2}}>
                  <div><div style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{p.model}</div><div style={{fontSize:11,color:C.gr,fontFamily:BD}}>{p.color} {p.col === "Acetato" ? <span style={{fontSize:9,color:"#7a5c3a",background:"#e8d5c0",padding:"1px 5px",borderRadius:2,marginLeft:4}}>Acetato</span> : ""}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{fmt(itemPrice)} €</span>
                    <button onClick={() => updateQty(+id, q-1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk}}>-</button>
                    <span style={{fontSize:13,fontFamily:BD,minWidth:22,textAlign:"center"}}>{q}</span>
                    <button onClick={() => updateQty(+id, q+1)} style={{width:26,height:26,background:C.bg,border:"1px solid "+C.ln,cursor:"pointer",borderRadius:3,color:C.dk}}>+</button>
                    <span style={{fontSize:13,fontFamily:BD,fontWeight:600,minWidth:65,textAlign:"right"}}>{fmt(itemPrice*q)} €</span>
                  </div>
                </div>
              ); })}
              <div style={{borderTop:"2px solid "+C.dk,marginTop:12,paddingTop:16}}>
                {(() => { const selCl = distClients.find(c => c.name === cartCl); return selCl && (selCl.shippingAddress || selCl.city) ? <div style={{background:C.bg,border:"1px solid "+C.ln,borderRadius:6,padding:"10px 14px",marginBottom:12,fontSize:11,fontFamily:BD,color:C.gr}}>
                  <span style={{fontWeight:600,color:C.dk}}>📦 {t("dirEnvioClient")}:</span> {selCl.shippingAddress || selCl.address || "—"}, {selCl.shippingCity || selCl.city || ""} {selCl.shippingPostal || ""} {selCl.shippingCountry || selCl.country || ""}
                </div> : null; })()}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("notesCmd")}</div>
                  <textarea value={cartNotes} onChange={e => setCartNotes(e.target.value)} rows={2} placeholder={t("notesPlaceholder")} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:11,background:C.bg,color:C.dk,boxSizing:"border-box",resize:"vertical"}} />
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"12px 0"}}>
                  <div>
                    <div style={{fontSize:10,color:C.gr,fontFamily:BD}}>{t("totalHT")}</div>
                    <div style={{fontSize:30,fontWeight:300,fontFamily:DP,color:C.dk}}>{fmt(finalTotal)} €</div>
                    <div style={{fontSize:12,color:C.gn,fontFamily:BD,fontWeight:600,marginTop:4}}>{t("commEst")}: {fmt(finalTotal*0.15)} €</div>
                  </div>
                  <Btn onClick={doOrder} disabled={!cartCl}>{t("passerCmd")}</Btn>
                </div>
              </div>
            </div>
        }
        {submitted && <div style={{position:"fixed",inset:0,background:"rgba(24,51,47,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}><div style={{background:C.wh,padding:"40px 50px",textAlign:"center",borderRadius:8}}><div style={{fontSize:32,color:C.gn}}>OK</div><div style={{fontSize:18,fontFamily:DP,color:C.dk,marginTop:8}}>{t("cmdEnvoyee")}</div></div></div>}
      </Sec>}

      {view === "d-ord" && <Sec title={t("mesCmd")}>
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          {[["all",t("tous")],["confirmed",t("confirmed")],["preparing",t("preparing")],["shipped",t("shipped")],["delivered",t("delivered")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdStatusFilter(v)} style={{padding:"5px 12px",background:ordStatusFilter===v?C.dk:"transparent",color:ordStatusFilter===v?C.bg:C.gr,border:"1px solid "+(ordStatusFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{width:1,height:16,background:C.ln,margin:"0 2px"}} />
          {[["all",t("tous")],["pending",t("pending")],["paid",t("paid")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdPayFilter(v)} style={{padding:"5px 12px",background:ordPayFilter===v?C.bl:"transparent",color:ordPayFilter===v?"#fff":C.gr,border:"1px solid "+(ordPayFilter===v?C.bl:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{distOrders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter)).map((o,i) => renderOrderRow(o, orders.indexOf(o), true, false))}</div>
      </Sec>}

      {view === "d-cl" && <Sec title={t("mesClients")} right={<Btn small onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:"FR",postalCode:"",phone:"",companyEmail:"",companyName:"",taxId:"",address:"",shippingAddress:"",shippingCity:"",shippingPostal:"",shippingCountry:""}); }}>{t("nouveau")}</Btn>}>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {distClients.map((c, i) => {
            const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽"};
            return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("editCl"); setEd({...c, _tab:"resume"}); }}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{c.name}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{c.city}</span>
                </div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:1}}>{flags[c.country]||"🌍"} {c.country||"—"} · {c.contact}</div>
              </div>
              <Badge l={c.status==="prospect"?t("prospect"):t("actif")} c={c.status==="prospect"?C.yl:C.gn} />
            </div>
            );
          })}
        </div>
      </Sec>}

      {view === "d-promo" && <Sec title={t("promosActives")} sub={t("promosSub")}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.filter(p => p.on && (p.visible||[]).includes("distributor")).map((p,i) => renderPromoCard(p, i, false))}
          {promos.filter(p => p.on && (p.visible||[]).includes("distributor")).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "d-news" && <Sec title={t("nouveautes")} sub={t("nouveautesSub")}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {news.filter(n => n.on).sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0)).map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"20px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:16,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <span style={{fontSize:9,fontFamily:BD,color:C.yl,fontWeight:600}}>PINNED</span>}
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.6}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
              {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,fontFamily:BD,color:C.bl,marginTop:6,display:"inline-block",textDecoration:"none",fontWeight:500}}>{t("voirPlus")} →</a>}
            </div>
          ))}
          {news.filter(n => n.on).length === 0 && <p style={{color:C.gr,fontFamily:BD,fontSize:12}}>{t("aucuneCmd")}</p>}
        </div>
      </Sec>}

      {view === "d-account" && <Sec title={t("monCompte")}>
        <div style={{maxWidth:640}}>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("datosPersonales")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("contact")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.name}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("email")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.email}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("entreprise")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.dk,padding:"9px 0"}}>{user.co || "—"}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{t("commission")}</div>
                <div style={{fontSize:13,fontFamily:BD,color:C.gn,padding:"9px 0",fontWeight:600}}>{user.commRate||0}%</div>
              </div>
            </div>
          </div>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesEntreprise")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("raisonSociale"),"companyName"],[t("nif"),"taxId"],[t("direccion"),"address"],[t("ville"),"city"],[t("codePostal"),"postalCode"],[t("pays"),"country"],[t("telephone"),"phone"],[t("emailLabel"),"companyEmail"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,padding:"20px 22px",marginBottom:16}}>
            <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700,marginBottom:14}}>{t("donneesBancaires")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              {[[t("titulaire"),"bankHolder"],[t("iban"),"iban"],[t("bic"),"bic"]].map(([l,k]) => (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.gr,fontFamily:BD,marginBottom:4}}>{l}</div>
                  <input value={accountData[k]||""} onChange={e => { setAccountData(p => ({...p,[k]:e.target.value})); setAccountSaved(false); }} style={{width:"100%",padding:9,border:"1px solid "+C.ln,borderRadius:3,fontFamily:BD,fontSize:12,background:C.bg,color:C.dk,boxSizing:"border-box"}} />
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Btn onClick={() => { dbSaveAccountData(accountData); setAccountSaved(true); }}>{t("sauvegarder")}</Btn>
            {accountSaved && <span style={{fontSize:11,fontFamily:BD,color:C.gn,fontWeight:500}}>{t("donneesSauvees")}</span>}
          </div>
        </div>
      </Sec>}

      {/* ADMIN VIEWS */}
      {view === "a-ord" && <Sec title={t("commandes")} right={<div style={{display:"flex",gap:6}}><Btn small ghost onClick={exportOrders}>{t("exporterCSV")}</Btn><Btn small onClick={() => { setModal("newOrd"); setEd({client:"",dist:"Direct",lines:[]}); }}>{t("nouvelleCmd")}</Btn></div>}>
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          {[["all",t("tous")],["confirmed",t("confirmed")],["preparing",t("preparing")],["shipped",t("shipped")],["delivered",t("delivered")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdStatusFilter(v)} style={{padding:"5px 12px",background:ordStatusFilter===v?C.dk:"transparent",color:ordStatusFilter===v?C.bg:C.gr,border:"1px solid "+(ordStatusFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{width:1,height:16,background:C.ln,margin:"0 2px"}} />
          {[["all",t("tous")],["pending",t("pending")],["invoiced",t("invoiced")],["paid",t("paid")]].map(([v,l]) => (
            <button key={v} onClick={() => setOrdPayFilter(v)} style={{padding:"5px 12px",background:ordPayFilter===v?C.bl:"transparent",color:ordPayFilter===v?"#fff":C.gr,border:"1px solid "+(ordPayFilter===v?C.bl:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{flex:1}} />
          <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{orders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter)).length} / {orders.length}</span>
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>{orders.filter(o => (ordStatusFilter==="all"||o.status===ordStatusFilter) && (ordPayFilter==="all"||o.pay===ordPayFilter)).map((o, i) => renderOrderRow(o, orders.indexOf(o), true, true))}</div>
      </Sec>}

      {view === "a-cl" && <Sec title={t("clients")} right={<div style={{display:"flex",gap:6}}><Btn small ghost onClick={exportClients}>{t("exporterCSV")}</Btn><Btn small onClick={() => { setModal("newCl"); setEd({name:"",contact:"",city:"",country:"FR",postalCode:""}); }}>{t("nouveau")}</Btn></div>}>
        <div style={{display:"flex",gap:6,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          {[["all",t("tous")],["active",t("actif")],["prospect",t("prospect")],["vip","VIP"]].map(([v,l]) => (
            <button key={v} onClick={() => setClientFilter(v)} style={{padding:"5px 12px",background:clientFilter===v?C.dk:"transparent",color:clientFilter===v?C.bg:C.gr,border:"1px solid "+(clientFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l}</button>
          ))}
          <span style={{flex:1}} />
          <input placeholder={t("rechercherClient")} value={clientSearch} onChange={e => setClientSearch(e.target.value)} style={{padding:"6px 12px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(180px, 35vw)"}} />
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {clients.filter(c => (clientFilter === "all" || c.status === clientFilter) && (!clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) || (c.city||"").toLowerCase().includes(clientSearch.toLowerCase()) || (c.country||"").toLowerCase().includes(clientSearch.toLowerCase()))).map((c, i) => {
            const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽"};
            return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("editCl"); setEd({...c}); }}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{c.name}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{c.city}{c.postalCode ? " "+c.postalCode : ""}</span>
                </div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:1}}>{flags[c.country]||"🌍"} {c.country||"—"} · {c.channel}</div>
              </div>
              {c.customPrice > 0 ? <Badge l={fmt(c.customPrice)+" €"} c={C.bl} /> : null}
              {c.earlyPay && <Badge l="-3%" c={C.gn} />}
              <Badge l={c.status==="vip"?"VIP":c.status==="prospect"?t("prospect"):t("actif")} c={c.status==="vip"?C.yl:c.status==="prospect"?C.gr2:C.gn} />
            </div>
            );
          })}
          {clients.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:20,textAlign:"center"}}>—</div>}
        </div>
      </Sec>}

      {/* ADMIN DISTRIBUTORS */}
      {view === "a-dist" && <Sec title={t("distributeurs")}>
        {(() => {
          const dists = users.filter(u => u.role === "distributor");
          return dists.length === 0
            ? <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:30}}>—</div>
            : <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {dists.map((d,i) => {
                const dLabel = (d.co||"").replace(/ Showroom$/i,"").trim();
                const dClients = clients.filter(c => (c.channel||"").toLowerCase().includes(dLabel.toLowerCase()));
                const dOrders = orders.filter(o => (o.dist||"").toLowerCase().includes(dLabel.toLowerCase()));
                const dSales = dOrders.reduce((s,o) => s+o.total, 0);
                const dComm = dOrders.reduce((s,o) => s+(o.comm||0), 0);
                const dPaid = dOrders.filter(o => o.pay === "paid").reduce((s,o) => s+(o.comm||0), 0);
                return (
                  <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={() => { setModal("viewDist"); setEd({...d, _dLabel:dLabel, _dClients:dClients, _dOrders:dOrders, _dSales:dSales, _dComm:dComm, _dPaid:dPaid, _tab:"resume", distNotes:privateNotes["dist_"+d.email]||""}); }}>
                    <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:40,height:40,borderRadius:20,background:C.bl+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,fontFamily:BD,color:C.bl,flexShrink:0}}>{d.name[0]}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontFamily:BD,color:C.dk,fontWeight:700}}>{d.co || d.name}</div>
                        <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:2}}>{d.name} · {d.email} · {d.phone||""}</div>
                      </div>
                      <div style={{display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("clients")}</div><div style={{fontSize:16,fontFamily:BD,color:C.dk,fontWeight:700}}>{dClients.length}</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("commandes")}</div><div style={{fontSize:16,fontFamily:BD,color:C.dk,fontWeight:700}}>{dOrders.length}</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:9,fontFamily:BD,color:C.gr}}>{t("ventesTotal")}</div><div style={{fontSize:16,fontFamily:BD,color:C.gn,fontWeight:700}}>{fmt(dSales)} €</div></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>;
        })()}
      </Sec>}

      {view === "a-stock" && <Sec title={t("gestionStock")} right={<Btn small onClick={() => { setModal("newProd"); setEd({model:"",color:"",sku:"",cat:"Essential",col:"Essential",stock:"20",fixedPrice:0}); }}>{t("nouveauProduit")}</Btn>}>
        <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          {[["all","Tout"],["Essential","Essential"],["Icons","Icons"],["Acetato","Acetato"]].map(([v,l]) => (
            <button key={v} onClick={() => setColFilter(v)} style={{padding:"6px 14px",background:colFilter===v?C.dk:"transparent",color:colFilter===v?C.bg:C.gr,border:"1px solid "+(colFilter===v?C.dk:C.ln),cursor:"pointer",fontSize:11,fontFamily:BD,fontWeight:500,borderRadius:3}}>{l}</button>
          ))}
          <span style={{flex:1}} />
          {(() => { const out = products.filter(p => p.stock === 0).length; const low = products.filter(p => p.stock > 0 && p.stock < 5).length; return <>
            {out > 0 && <span style={{fontSize:10,fontFamily:BD,color:"#fff",background:C.rd,padding:"3px 10px",borderRadius:10,fontWeight:600}}>{out} {t("agotado")}</span>}
            {low > 0 && <span style={{fontSize:10,fontFamily:BD,color:C.yl,background:C.yl+"15",padding:"3px 10px",borderRadius:10,fontWeight:600}}>{low} {t("alerteStock")}</span>}
          </>; })()}
          <input placeholder={t("rechercherProd")} value={stockSearch} onChange={e => setStockSearch(e.target.value)} style={{padding:"6px 12px",border:"1px solid "+C.ln,borderRadius:20,fontFamily:BD,fontSize:11,background:C.wh,color:C.dk,width:"min(170px, 30vw)"}} />
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {products.filter(p => (colFilter === "all" || p.col === colFilter) && (!stockSearch || p.model.toLowerCase().includes(stockSearch.toLowerCase()) || p.color.toLowerCase().includes(stockSearch.toLowerCase()) || p.sku.toLowerCase().includes(stockSearch.toLowerCase()))).map((p, i) => (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid "+C.bg2,background:p.stock===0?C.rd+"08":p.stock<5?C.yl+"06":i%2?C.bg:C.wh,cursor:"pointer"}} onClick={() => { setModal("editSt"); setEd({...p, stock: String(p.stock)}); }}>
              <div style={{width:40,height:40,borderRadius:4,background:C.wh,border:"1px solid "+C.ln,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.model} style={{width:"100%",height:"100%",objectFit:"contain"}} /> : <span style={{fontSize:7,color:C.ln,fontFamily:BD}}>—</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{p.model}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{p.color}</span>
                </div>
                <div style={{fontSize:9,fontFamily:BD,color:C.gr2,marginTop:1}}>{p.sku}</div>
              </div>
              <span style={{fontSize:9,fontFamily:BD,color:p.col==="Acetato"?"#7a5c3a":C.gr2,background:p.col==="Acetato"?"#e8d5c0":C.bg,padding:"2px 6px",borderRadius:10,flexShrink:0}}>{p.col}</span>
              <span style={{fontSize:p.stock===0?9:14,fontWeight:700,fontFamily:BD,color:p.stock===0?"#fff":p.stock<5?C.rd:p.stock<10?C.yl:C.gn,background:p.stock===0?C.rd:p.stock<5?C.rd+"12":"transparent",padding:p.stock===0?"3px 8px":"0 4px",borderRadius:10,minWidth:32,textAlign:"center",flexShrink:0}}>{p.stock===0?t("agotado"):p.stock}</span>
            </div>
          ))}
        </div>
      </Sec>}

      {view === "a-inv" && <Sec title={t("factures")}>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {orders.map((o, i) => { const ship = o.shippingCost > 0 ? o.shippingCost : 0; const ttc = (o.total + ship) * 1.21; return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",borderBottom:"1px solid "+C.bg2}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,cursor:"pointer",flexWrap:"wrap",minWidth:0}} onClick={() => { setModal("viewInv"); setEd({...o}); }}>
                <span style={{fontSize:11,fontWeight:600,fontFamily:BD,color:C.dk}}>{("F-"+o.id.replace("#",""))}</span>
                <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:"1 1 100px",minWidth:60}}>{o.client}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{o.date}</span>
                <span style={{fontSize:11,fontFamily:BD,color:C.dk,fontWeight:600}}>{fmt(ttc)} €</span>
                <Badge l={PL[o.pay]} c={PC[o.pay]} />
              </div>
              <button onClick={(e) => { e.stopPropagation(); if(confirm(t("confirmarEliminar"))){ setOrders(p => p.filter((_,j) => j!==i)); }}} style={{background:C.rd,border:"none",color:"#fff",cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:600,padding:"6px 10px",borderRadius:3,flexShrink:0,whiteSpace:"nowrap"}}>{t("eliminar")}</button>
            </div>
          ); })}
        </div>
      </Sec>}

      {view === "a-promo" && <Sec title={t("gestionPromos")} right={<Btn small onClick={() => { setModal("newPromo"); setEd({name:"",type:"percent",disc:5,cond:{fr:"",es:"",en:""},on:true,visible:["client","distributor"]}); }}>{t("nouvellePromo")}</Btn>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {promos.map((p,i) => renderPromoCard(p, i, true))}
        </div>
      </Sec>}

      {view === "a-news" && <Sec title={t("gestionNouveautes")} right={<Btn small onClick={() => { setModal("newNews"); setEd({title:{fr:"",es:"",en:""},content:{fr:"",es:"",en:""},pinned:false,on:true}); }}>{t("nouvelleNouveaute")}</Btn>}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {news.map((n,i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"16px 20px",cursor:"pointer",opacity:n.on?1:0.5}} onClick={() => { setModal("editNews"); setEd({...n}); }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:500,fontFamily:DP,color:C.dk}}>{(n.title&&n.title[lang])||n.title?.fr||""}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {n.pinned && <Badge l={t("epingle")} c={C.yl} />}
                  <Badge l={n.on?t("active"):t("inactive")} c={n.on?C.gn:C.gr} />
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr2}}>{n.date}</span>
                </div>
              </div>
              <div style={{fontSize:11,fontFamily:BD,color:C.gr,lineHeight:1.5}}>{(n.content&&n.content[lang])||n.content?.fr||""}</div>
            </div>
          ))}
        </div>
      </Sec>}

      {view === "a-tasks" && <Sec title={t("gestionTareas")} right={<Btn small onClick={() => { setModal("newTask"); setEd({title:"",desc:"",priority:"moyenne",area:"commercial",status:"aFaire"}); }}>{t("nouvelleTache")}</Btn>}>
        <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
          {["all","commercial","finances","marketing","produits","clientsArea","logistique","admin"].map(a => (
            <button key={a} onClick={() => setTaskFilter(a)} style={{padding:"5px 12px",background:taskFilter===a?C.dk:"transparent",color:taskFilter===a?C.bg:C.gr,border:"1px solid "+(taskFilter===a?C.dk:C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:3}}>{a==="all"?t("toutesAreas"):t(a)}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {["aFaire","enCours","fait"].map(st => {
            const prioOrder = {haute:0,moyenne:1,basse:2};
            const prioColor = {haute:C.rd,moyenne:C.yl,basse:C.gn};
            const areaColor = {commercial:"#2980b9",finances:"#27ae60",marketing:"#8e44ad",produits:"#d35400",clientsArea:"#16a085",logistique:"#2c3e50",admin:"#7f8c8d"};
            const filtered = tasks.filter(tk => tk.status === st && (taskFilter === "all" || tk.area === taskFilter)).sort((a,b) => (prioOrder[a.priority]||1) - (prioOrder[b.priority]||1));
            return (
              <div key={st}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{fontSize:13,fontFamily:BD,fontWeight:600,color:C.dk}}>{t(st)}</span>
                  <span style={{fontSize:10,fontFamily:BD,color:C.gr,background:C.bg,padding:"2px 8px",borderRadius:8}}>{filtered.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,minHeight:100,background:C.bg,borderRadius:6,padding:8,border:"1px solid "+C.ln}}>
                  {filtered.map((tk,i) => (
                    <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,padding:"12px 14px",cursor:"pointer",borderLeft:"4px solid "+(prioColor[tk.priority]||C.gr)}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:12,fontFamily:BD,fontWeight:600,color:C.dk}}>{tk.title}</span>
                        <Badge l={t(tk.priority)} c={prioColor[tk.priority]||C.gr} />
                      </div>
                      {tk.desc && <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginBottom:6,lineHeight:1.4}}>{tk.desc}</div>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,fontFamily:BD,color:"#fff",background:areaColor[tk.area]||C.gr,padding:"2px 8px",borderRadius:3}}>{t(tk.area)}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {tk.assignee && <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:3}}>👤 {tk.assignee}</span>}
                          {tk.dueDate && (() => { const d = new Date(tk.dueDate); const overdue = d < new Date() && tk.status !== "fait"; return <span style={{fontSize:9,fontFamily:BD,color:overdue?C.rd:C.gr2,fontWeight:overdue?600:400}}>{overdue?"⚠ ":""}{d.toLocaleDateString()}</span>; })()}
                          {!tk.dueDate && <span style={{fontSize:9,fontFamily:BD,color:C.gr2}}>{tk.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <div style={{textAlign:"center",padding:20,fontSize:11,color:C.gr2,fontFamily:BD}}>—</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Sec>}

      {view === "a-users" && <Sec title={t("gestionUsers")} right={<Btn small onClick={() => { setModal("newUser"); setEd({role:"client",name:"",co:"",email:"",pw:"",lang:"fr",commRate:0,active:true}); }}>{t("nouvelUser")}</Btn>}>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["all",t("tous")],["client",t("client")],["distributor",t("distributeur")],["pending",t("pendientes")]].map(([v,l]) => {
            const count = v === "pending" ? users.filter(u => u.role !== "admin" && u.active === false).length : v === "all" ? 0 : users.filter(u => u.role === v).length;
            return (
            <button key={v} onClick={() => setUserFilter(v)} style={{padding:"5px 14px",background:userFilter===v?C.dk:v==="pending"&&count>0?"#f39c1215":"transparent",color:userFilter===v?C.bg:v==="pending"&&count>0?"#f39c12":C.gr,border:"1px solid "+(userFilter===v?C.dk:v==="pending"&&count>0?"#f39c12":C.ln),cursor:"pointer",fontSize:10,fontFamily:BD,fontWeight:500,borderRadius:20}}>{l} {(v!=="all"&&count>0) && <span style={{fontSize:9,color:userFilter===v?C.bg+"99":C.gr2}}>({count})</span>}</button>
            );
          })}
        </div>
        <div style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:6,overflow:"hidden"}}>
          {users.filter(u => u.role !== "admin" && (userFilter === "all" ? true : userFilter === "pending" ? u.active === false : u.role === userFilter)).map((u, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid "+C.bg2,cursor:"pointer",opacity:u.active===false?0.5:1}} onClick={() => { setModal("editUser"); setEd({...u, origEmail: u.email}); }}>
              <Badge l={u.role === "distributor" ? t("distributeur") : t("client")} c={u.role === "distributor" ? C.bl : C.gn} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{u.name}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr}}>{u.co}</span>
                </div>
                <div style={{fontSize:10,fontFamily:BD,color:C.gr2,marginTop:1}}>
                  {u.email}{u.city ? " · "+u.city : ""}{u.country ? " ("+u.country+")" : ""}{u.phone ? " · "+u.phone : ""}
                </div>
              </div>
              {u.notes && <span style={{fontSize:9,fontFamily:BD,color:C.bl,background:C.bl+"15",padding:"2px 6px",borderRadius:10}}>📝</span>}
              {u.commRate > 0 && <span style={{fontSize:10,fontFamily:BD,color:C.yl}}>{u.commRate}%</span>}
              <Badge l={u.active !== false ? t("userActif") : t("userInactif")} c={u.active !== false ? C.gn : C.rd} />
            </div>
          ))}
        </div>
        <div style={{marginTop:16,padding:"14px 16px",background:C.wh,border:"1px solid "+C.ln,borderRadius:6}}>
          <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginBottom:8,fontWeight:500}}>Admin</div>
          {users.filter(u => u.role === "admin").map((u, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0"}}>
              <Badge l="Admin" c={C.dk} />
              <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{u.name}</span>
              <span style={{fontSize:11,fontFamily:BD,color:C.gr2}}>{u.email}</span>
            </div>
          ))}
        </div>
      </Sec>}

      {view === "a-stats" && <Sec title={t("tableauBord")}>
        {users.filter(u => u.active === false && u.role !== "admin").length > 0 && (
          <div onClick={() => { setView("a-users"); setUserFilter("pending"); }} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#f39c12"+"12",border:"1px solid #f39c12"+"40",borderRadius:8,marginBottom:16,cursor:"pointer"}}>
            <span style={{width:10,height:10,borderRadius:5,background:"#f39c12",flexShrink:0}} />
            <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{users.filter(u => u.active === false && u.role !== "admin").length} {t("solicitudes")}</span>
            <span style={{fontSize:11,fontFamily:BD,color:C.gr,flex:1}}>→ {t("voirTout")}</span>
          </div>
        )}
        {/* KPI ROW */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:22}}>
          {renderKPI(t("ca"), fmt(orders.reduce((s,o) => s+o.total, 0))+" €", C.gn)}
          {renderKPI(t("commandes"), String(orders.length))}
          {renderKPI(t("unites"), String(orders.reduce((s,o) => s+o.items, 0)))}
          {renderKPI(t("clients"), String(clients.length))}
          {renderKPI(t("produits"), String(products.length))}
          {renderKPI(t("panierMoyen"), orders.length ? fmt(orders.reduce((s,o) => s+o.total, 0)/orders.length)+" €" : "—")}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:12}}>
          {/* URGENT TASKS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.rd+"08"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("tareas")} · <span style={{color:C.rd}}>{t("haute")}</span></span>
              <Btn small ghost onClick={() => setView("a-tasks")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"10px 16px"}}>
              {tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").length === 0
                ? <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Sin tareas urgentes</div>
                : tasks.filter(tk => tk.priority === "haute" && tk.status !== "fait").slice(0,4).map((tk,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:"1px solid "+C.bg2,cursor:"pointer"}} onClick={() => { setModal("editTask"); setEd({...tk}); }}>
                    <span style={{width:8,height:8,borderRadius:4,background:C.rd,flexShrink:0}} />
                    <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1}}>{tk.title}</span>
                    <Badge l={t(tk.status)} c={tk.status==="enCours"?C.yl:C.gr} />
                  </div>
                ))
              }
            </div>
          </div>

          {/* LOW STOCK */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.yl+"08"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("stockBajo")}</span>
              <Btn small ghost onClick={() => setView("a-stock")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"6px 16px"}}>
              {products.filter(p => p.stock < 10).sort((a,b) => a.stock - b.stock).slice(0,6).map((p,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid "+C.bg2}}>
                  {p.imageUrl ? <img src={p.imageUrl} style={{width:30,height:30,objectFit:"contain",borderRadius:4}} /> : <span style={{width:30,height:30,background:C.bg,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:C.ln}}>—</span>}
                  <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1,fontWeight:500}}>{p.model} <span style={{color:C.gr,fontWeight:400}}>{p.color}</span></span>
                  <span style={{fontSize:14,fontWeight:700,fontFamily:BD,color:p.stock<5?C.rd:C.yl,background:p.stock<5?C.rd+"10":C.yl+"10",padding:"2px 8px",borderRadius:10}}>{p.stock}</span>
                </div>
              ))}
              {products.filter(p => p.stock < 10).length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Stock OK</div>}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:12}}>
          {/* RECENT ORDERS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("commandes")} récentes</span>
              <Btn small ghost onClick={() => setView("a-ord")}>{t("voirTout")}</Btn>
            </div>
            <div style={{padding:"6px 16px"}}>
              {orders.slice(0,5).map((o,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid "+C.bg2}}>
                  <span style={{fontSize:12,fontWeight:700,fontFamily:BD,color:C.dk}}>{o.id}</span>
                  <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr2}}>{o.date}</span>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                  <Badge l={SL[o.status]} c={SC[o.status]} />
                </div>
              ))}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:14,textAlign:"center"}}>—</div>}
            </div>
          </div>

          {/* PENDING PAYMENTS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln,background:C.bl+"06"}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("enAttente")} · {t("paiement")}</span>
            </div>
            <div style={{padding:"6px 16px"}}>
              {orders.filter(o => o.pay === "pending" || o.pay === "invoiced").length === 0
                ? <div style={{fontSize:12,fontFamily:BD,color:C.gn,padding:12,textAlign:"center",fontWeight:500}}>✓ Todo cobrado</div>
                : orders.filter(o => o.pay === "pending" || o.pay === "invoiced").slice(0,5).map((o,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid "+C.bg2}}>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:BD,color:C.dk}}>{o.id}</span>
                    <span style={{fontSize:12,fontFamily:BD,color:C.gr,flex:1}}>{o.client}</span>
                    <span style={{fontSize:12,fontWeight:600,fontFamily:BD,color:C.dk}}>{fmt(o.total)} €</span>
                    <Badge l={PL[o.pay]} c={PC[o.pay]} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
          {/* CHANNELS */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("canaux")}</span>
            </div>
            <div style={{padding:"12px 16px"}}>
              {(() => {
                const channels = {};
                orders.forEach(o => { channels[o.dist] = (channels[o.dist]||0) + o.total; });
                const total = Object.values(channels).reduce((s,v) => s+v, 0) || 1;
                const colors = {"Agent Sud":C.dk,"Direct":C.gn,"Faire":C.yl};
                return Object.entries(channels).sort((a,b) => b[1]-a[1]).map(([ch,val],i) => (
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontFamily:BD,fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{ch}</span><span style={{color:C.gr}}>{fmt(val)} € ({Math.round(val/total*100)}%)</span></div>
                    <div style={{height:6,background:C.bg2,borderRadius:3}}><div style={{height:6,background:colors[ch]||C.bl,borderRadius:3,width:Math.round(val/total*100)+"%"}} /></div>
                  </div>
                ));
              })()}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:10}}>—</div>}
            </div>
          </div>

          {/* CUSTOM PRICES */}
          <div style={{background:C.wh,borderRadius:8,padding:0,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("clients")} · {t("prixCustom")}</span>
            </div>
            <div style={{padding:"8px 16px"}}>
            {clients.filter(c => c.customPrice > 0).length
              ? clients.filter(c => c.customPrice > 0).map((c, i) => <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontFamily:BD,fontSize:11,borderBottom:"1px solid "+C.bg2}}><span>{c.name} <span style={{color:C.gr2}}>({c.country||"—"})</span></span><span style={{color:C.bl,fontWeight:600}}>{fmt(c.customPrice)} €</span></div>)
              : <div style={{fontSize:11,color:C.gr2,fontFamily:BD,textAlign:"center"}}>{t("tousStandard")}</div>
            }
            {clients.filter(c => c.earlyPay).length > 0 && <>
              <div style={{fontSize:10,fontFamily:BD,color:C.gn,marginTop:10,fontWeight:600}}>Early Pay (-3%)</div>
              {clients.filter(c => c.earlyPay).map((c,i) => <div key={i} style={{fontSize:11,fontFamily:BD,color:C.dk,padding:"3px 0"}}>{c.name}</div>)}
            </>}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginTop:12}}>
          {/* TOP SELLING */}
          <div style={{background:C.wh,borderRadius:8,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("topVentas")}</span>
            </div>
            <div style={{padding:"8px 16px"}}>
              {(() => { const sold = {}; orders.forEach(o => (o.lines||[]).forEach(l => { sold[l.model] = (sold[l.model]||0) + (l.qty||0); })); return Object.entries(sold).sort((a,b) => b[1]-a[1]).slice(0,6).map(([model,qty],i) => {
                const p = products.find(x => x.model === model);
                return (<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid "+C.bg2}}>
                  <span style={{fontSize:11,fontFamily:BD,color:C.gr2,fontWeight:700,minWidth:20}}>{i+1}.</span>
                  {p?.imageUrl ? <img src={p.imageUrl} style={{width:28,height:28,objectFit:"contain",borderRadius:3}} /> : <span style={{width:28}} />}
                  <span style={{fontSize:12,fontFamily:BD,color:C.dk,flex:1,fontWeight:500}}>{model}</span>
                  <span style={{fontSize:13,fontWeight:700,fontFamily:BD,color:C.gn}}>{qty} uds</span>
                </div>);
              }); })()}
              {orders.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:10,textAlign:"center"}}>—</div>}
            </div>
          </div>

          {/* CLIENTS BY COUNTRY */}
          <div style={{background:C.wh,borderRadius:8,overflow:"hidden",border:"1px solid "+C.ln}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.ln}}>
              <span style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:700}}>{t("clientsPays")}</span>
            </div>
            <div style={{padding:"12px 16px"}}>
              {(() => { const cc = {}; clients.forEach(c => { const k = c.country || "—"; cc[k] = (cc[k]||0)+1; }); const total = clients.length || 1; const flags = {FR:"🇫🇷",ES:"🇪🇸",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",PT:"🇵🇹",BE:"🇧🇪",NL:"🇳🇱",UK:"🇬🇧",CH:"🇨🇭",CO:"🇨🇴",MX:"🇲🇽"}; return Object.entries(cc).sort((a,b) => b[1]-a[1]).slice(0,8).map(([co,n],i) => (
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontFamily:BD,fontSize:12,marginBottom:3}}>
                    <span style={{fontWeight:500}}>{flags[co]||"🌍"} {co}</span>
                    <span style={{color:C.gr}}>{n} ({Math.round(n/total*100)}%)</span>
                  </div>
                  <div style={{height:5,background:C.bg2,borderRadius:3}}><div style={{height:5,background:C.gn,borderRadius:3,width:Math.round(n/total*100)+"%"}} /></div>
                </div>
              )); })()}
              {clients.length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,padding:10,textAlign:"center"}}>—</div>}
            </div>
          </div>
        </div>
      </Sec>}
      {/* PACKAGING VIEWS */}
      {(view === "c-pack" || view === "d-pack") && <Sec title={t("packaging")} sub={t("packagingSub")}>
        {[["Étui","packEtui"],["Display","packDisplay"],["Merchandising","packMerch"]].map(([type,key]) => {
          const items = packItems.filter(pk => pk.on && pk.type === type);
          return items.length > 0 ? <div key={type} style={{marginBottom:24}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:12}}>{t(key)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {items.map((pk,i) => (
                <div key={pk.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden"}}>
                  {pk.imageUrl ? <div style={{height:140,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <img src={pk.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:8}} />
                  </div> : <div style={{height:140,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:24,color:C.ln,letterSpacing:2}}>MINUË</div>}
                  <div style={{padding:"14px 16px"}}>
                    <div style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600}}>{(pk.name&&pk.name[lang])||pk.name?.fr||""}</div>
                    <div style={{fontSize:11,fontFamily:BD,color:C.gr,marginTop:6,lineHeight:1.5}}>{(pk.desc&&pk.desc[lang])||pk.desc?.fr||""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div> : null;
        })}
      </Sec>}

      {view === "a-pack" && <Sec title={t("packaging")} sub={t("packagingSub")} right={<Btn small onClick={() => { setModal("newPack"); setEd({type:"Étui",name:{fr:"",es:"",en:""},desc:{fr:"",es:"",en:""},imageUrl:"",on:true}); }}>{t("nouveauPack")}</Btn>}>
        {[["Étui","packEtui"],["Display","packDisplay"],["Merchandising","packMerch"]].map(([type,key]) => {
          const items = packItems.filter(pk => pk.type === type);
          return items.length > 0 ? <div key={type} style={{marginBottom:24}}>
            <div style={{fontSize:16,fontFamily:DP,color:C.dk,fontWeight:500,marginBottom:12}}>{t(key)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {items.map((pk,i) => (
                <div key={pk.id} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,overflow:"hidden",opacity:pk.on?1:0.4,cursor:"pointer"}} onClick={() => { setModal("editPack"); setEd({...pk}); }}>
                  {pk.imageUrl ? <div style={{height:120,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    <img src={pk.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:6}} />
                  </div> : <div style={{height:120,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:DP,fontSize:20,color:C.ln}}>MINUË</div>}
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontFamily:BD,color:C.dk,fontWeight:600}}>{(pk.name&&pk.name[lang])||pk.name?.fr||""}</div>
                    <div style={{fontSize:10,fontFamily:BD,color:C.gr,marginTop:4,lineHeight:1.4}}>{((pk.desc&&pk.desc[lang])||pk.desc?.fr||"").substring(0,80)}</div>
                    {!pk.on && <Badge l="OFF" c={C.rd} />}
                  </div>
                </div>
              ))}
            </div>
          </div> : null;
        })}
      </Sec>}

      {/* FAQ VIEWS */}
      {(view === "c-help" || view === "d-help" || view === "a-faq") && <Sec title={t("faq")} sub={t("faqSub")} right={role === "admin" ? <Btn small onClick={() => { setModal("newFaq"); setEd({q:{fr:"",es:"",en:""},a:{fr:"",es:"",en:""},on:true}); }}>{t("nouvelleFaq")}</Btn> : null}>
        <div style={{maxWidth:700}}>
          {faqs.filter(f => role === "admin" ? true : f.on).map((f, i) => (
            <div key={i} style={{background:C.wh,border:"1px solid "+C.ln,borderRadius:8,marginBottom:8,opacity:f.on?1:0.4,overflow:"hidden"}}>
              <button onClick={() => setHelpExpanded(helpExpanded === f.id ? null : f.id)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                <span style={{fontSize:13,fontFamily:BD,color:C.dk,fontWeight:600,flex:1,paddingRight:8}}>{(f.q && f.q[lang]) || f.q?.fr || ""}</span>
                <span style={{fontSize:16,color:C.gr,fontFamily:BD,flexShrink:0,transform:helpExpanded===f.id?"rotate(45deg)":"none",transition:"transform 0.2s"}}>+</span>
              </button>
              {helpExpanded === f.id && <div style={{padding:"0 18px 16px",fontSize:12,fontFamily:BD,color:C.gr,lineHeight:1.7}}>
                {(f.a && f.a[lang]) || f.a?.fr || ""}
                {role === "admin" && <div style={{marginTop:10}}><Btn small ghost onClick={() => { setModal("editFaq"); setEd({...f}); }}>{t("editer")}</Btn></div>}
              </div>}
            </div>
          ))}
          {faqs.filter(f => role === "admin" ? true : f.on).length === 0 && <div style={{fontSize:12,fontFamily:BD,color:C.gr2,textAlign:"center",padding:30}}>—</div>}
        </div>
      </Sec>}

      {/* FLOATING CART BUTTON - hide on cart page */}
      {role !== "admin" && cartCount > 0 && view !== "c-cart" && view !== "d-cart" && <button onClick={() => setView(role === "distributor" ? "d-cart" : "c-cart")} style={{position:"fixed",bottom:20,right:20,height:48,borderRadius:24,background:C.dk,color:"#f8efe6",border:"none",cursor:"pointer",fontSize:13,fontFamily:BD,fontWeight:600,boxShadow:"0 4px 16px rgba(24,51,47,0.3)",zIndex:150,display:"flex",alignItems:"center",gap:8,padding:"0 18px 0 14px"}}>
        <span style={{fontSize:18}}>🛒</span>
        <span>{cartCount}</span>
        <span style={{fontSize:10,fontWeight:400,opacity:0.7}}>{fmt(finalTotal)} €</span>
      </button>}
    </div>
  );
}

import type { AdminLocale } from '@/lib/admin-i18n/constants';

export type AdminDict = {
  navOverview: string;
  navPackages: string;
  navServices: string;
  navFaqs: string;
  navTestimonials: string;
  navPages: string;
  navLegal: string;
  navOrders: string;
  navContact: string;
  navChat: string;
  navSettings: string;
  comingSoon: string;
  adminPanel: string;
  secureArea: string;
  mobileNavHint: string;
  administrator: string;
  overviewTitle: string;
  overviewSubtitle: string;
  overviewFootnote: string;
  packagesTitle: string;
  ordersTitle: string;
  contactTitle: string;
  create: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  activate: string;
  deactivate: string;
  status: string;
  statusNew: string;
  statusContacted: string;
  statusClosed: string;
  statusReplied: string;
  fullName: string;
  email: string;
  whatsapp: string;
  message: string;
  budgetInterest: string;
  packageLabel: string;
  priceLabel: string;
  dateLabel: string;
  actions: string;
  noData: string;
  logout: string;
  signIn: string;
  password: string;
  invalidCredentials: string;
  loginMissingFields: string;
  loginUnavailable: string;
  loginConfigIssue: string;
  backToSite: string;
  slug: string;
  title: string;
  subtitle: string;
  currency: string;
  description: string;
  featuresLines: string;
  sortOrder: string;
  popular: string;
  active: string;
  addPackage: string;
  updatePackage: string;
  deleteBlocked: string;
  confirmDelete: string;
  selectPackage: string;
  orderDetails: string;
  contactDetails: string;
  updateStatus: string;
  packageSlugInvalid: string;
  requiredField: string;
};

const EN: AdminDict = {
  navOverview: 'Overview',
  navPackages: 'Packages',
  navServices: 'Services',
  navFaqs: 'FAQs',
  navTestimonials: 'Testimonials',
  navPages: 'Pages',
  navLegal: 'Legal Pages',
  navOrders: 'Orders',
  navContact: 'Contact Messages',
  navChat: 'Chat Support',
  navSettings: 'Settings',
  comingSoon: 'Soon',
  adminPanel: 'Admin panel',
  secureArea: 'Secure area',
  mobileNavHint: 'Limited mobile nav · use desktop',
  administrator: 'Administrator',
  overviewTitle: 'Overview',
  overviewSubtitle:
    'Orders and contact messages are live. Content modules below remain phased.',
  overviewFootnote:
    'CMS builders, FAQs editor, testimonials, legal pages editor, chat inbox, and site settings stay marked Coming soon.',
  packagesTitle: 'Packages',
  ordersTitle: 'Orders',
  contactTitle: 'Contact messages',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  activate: 'Activate',
  deactivate: 'Deactivate',
  status: 'Status',
  statusNew: 'New',
  statusContacted: 'Contacted',
  statusClosed: 'Closed',
  statusReplied: 'Replied',
  fullName: 'Full name',
  email: 'Email',
  whatsapp: 'WhatsApp',
  message: 'Message',
  budgetInterest: 'Budget / package interest',
  packageLabel: 'Package',
  priceLabel: 'Price',
  dateLabel: 'Date',
  actions: 'Actions',
  noData: 'No records yet.',
  logout: 'Log out',
  signIn: 'Sign in',
  password: 'Password',
  invalidCredentials: 'Invalid credentials',
  loginMissingFields: 'Enter your email and password.',
  loginUnavailable: 'Unable to sign in right now.',
  loginConfigIssue: 'Server configuration error. Try again later.',
  backToSite: '← Back to site',
  slug: 'Slug',
  title: 'Title',
  subtitle: 'Subtitle',
  currency: 'Currency',
  description: 'Description',
  featuresLines: 'Features (one per line)',
  sortOrder: 'Sort order',
  popular: 'Most popular',
  active: 'Active',
  addPackage: 'Add package',
  updatePackage: 'Save package',
  deleteBlocked: 'Cannot delete: orders exist for this package.',
  confirmDelete: 'Delete package',
  selectPackage: 'Package',
  orderDetails: 'Order',
  contactDetails: 'Message',
  updateStatus: 'Update status',
  packageSlugInvalid: 'Slug must use lowercase letters, numbers, and hyphens.',
  requiredField: 'Required fields missing.',
};

const AR: AdminDict = {
  navOverview: 'نظرة عامة',
  navPackages: 'الباقات',
  navServices: 'الخدمات',
  navFaqs: 'الأسئلة الشائعة',
  navTestimonials: 'آراء العملاء',
  navPages: 'الصفحات',
  navLegal: 'الصفحات القانونية',
  navOrders: 'الطلبات',
  navContact: 'رسائل التواصل',
  navChat: 'دعم المحادثة',
  navSettings: 'الإعدادات',
  comingSoon: 'قريباً',
  adminPanel: 'لوحة الإدارة',
  secureArea: 'منطقة آمنة',
  mobileNavHint: 'تنقّل الجوال محدود · يُفضّل سطح المكتب',
  administrator: 'مسؤول',
  overviewTitle: 'نظرة عامة',
  overviewSubtitle: 'الطلبات ورسائل التواصل مفعّلة. وحدات المحتوى التالية ضمن مراحل لاحقة.',
  overviewFootnote:
    'منشئ المحتوى ومحرر الأسئلة والشهادات والصفحات القانونية وصندوق المحادثة وإعدادات الموقع ما زالت مؤجلة.',
  packagesTitle: 'الباقات',
  ordersTitle: 'الطلبات',
  contactTitle: 'رسائل التواصل',
  create: 'إنشاء',
  edit: 'تعديل',
  delete: 'حذف',
  save: 'حفظ',
  cancel: 'إلغاء',
  activate: 'تفعيل',
  deactivate: 'إيقاف',
  status: 'الحالة',
  statusNew: 'جديد',
  statusContacted: 'تم التواصل',
  statusClosed: 'مغلق',
  statusReplied: 'تم الرد',
  fullName: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  whatsapp: 'واتساب',
  message: 'الرسالة',
  budgetInterest: 'الميزانية أو اهتمام الباقة',
  packageLabel: 'الباقة',
  priceLabel: 'السعر',
  dateLabel: 'التاريخ',
  actions: 'إجراءات',
  noData: 'لا توجد سجلات بعد.',
  logout: 'تسجيل الخروج',
  signIn: 'تسجيل الدخول',
  password: 'كلمة المرور',
  invalidCredentials: 'بيانات الدخول غير صحيحة',
  loginMissingFields: 'أدخل البريد وكلمة المرور.',
  loginUnavailable: 'تعذّر تسجيل الدخول حالياً.',
  loginConfigIssue: 'خطأ إعداد خادم. حاول لاحقاً.',
  backToSite: '← العودة إلى الموقع',
  slug: 'المعرّف النصي',
  title: 'العنوان',
  subtitle: 'العنوان الفرعي',
  currency: 'العملة',
  description: 'الوصف',
  featuresLines: 'الميزات (سطر لكل بند)',
  sortOrder: 'ترتيب العرض',
  popular: 'الأكثر طلباً',
  active: 'نشط',
  addPackage: 'إضافة باقة',
  updatePackage: 'حفظ الباقة',
  deleteBlocked: 'لا يمكن الحذف: توجد طلبات مرتبطة بهذه الباقة.',
  confirmDelete: 'حذف الباقة',
  selectPackage: 'الباقة',
  orderDetails: 'طلب',
  contactDetails: 'رسالة',
  updateStatus: 'تحديث الحالة',
  packageSlugInvalid: 'المعرّف يجب أن يستخدم أحرفاً صغيرة وأرقاماً وشرطات.',
  requiredField: 'حقول مطلوبة ناقصة.',
};

const FR: AdminDict = {
  navOverview: 'Vue d ensemble',
  navPackages: 'Forfaits',
  navServices: 'Services',
  navFaqs: 'FAQ',
  navTestimonials: 'Témoignages',
  navPages: 'Pages',
  navLegal: 'Pages légales',
  navOrders: 'Commandes',
  navContact: 'Messages contact',
  navChat: 'Support chat',
  navSettings: 'Paramètres',
  comingSoon: 'Bientôt',
  adminPanel: 'Panneau admin',
  secureArea: 'Espace sécurisé',
  mobileNavHint: 'Navigation mobile limitée · préférez le bureau',
  administrator: 'Administrateur',
  overviewTitle: 'Vue d ensemble',
  overviewSubtitle:
    'Commandes et messages sont actifs. Les modules ci dessous restent en phases ultérieures.',
  overviewFootnote:
    'CMS, FAQ, témoignages, pages légales, messagerie chat et réglages site restent « Bientôt ».',
  packagesTitle: 'Forfaits',
  ordersTitle: 'Commandes',
  contactTitle: 'Messages',
  create: 'Créer',
  edit: 'Modifier',
  delete: 'Supprimer',
  save: 'Enregistrer',
  cancel: 'Annuler',
  activate: 'Activer',
  deactivate: 'Désactiver',
  status: 'Statut',
  statusNew: 'Nouveau',
  statusContacted: 'Contacté',
  statusClosed: 'Fermé',
  statusReplied: 'Répondu',
  fullName: 'Nom complet',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  message: 'Message',
  budgetInterest: 'Budget ou formule',
  packageLabel: 'Formule',
  priceLabel: 'Prix',
  dateLabel: 'Date',
  actions: 'Actions',
  noData: 'Aucun enregistrement.',
  logout: 'Se déconnecter',
  signIn: 'Se connecter',
  password: 'Mot de passe',
  invalidCredentials: 'Identifiants invalides',
  loginMissingFields: 'Indiquez votre e-mail et votre mot de passe.',
  loginUnavailable: 'Connexion impossible pour le moment.',
  loginConfigIssue: 'Erreur de configuration serveur. Réessayez plus tard.',
  backToSite: '← Retour au site',
  slug: 'Identifiant',
  title: 'Titre',
  subtitle: 'Sous titre',
  currency: 'Devise',
  description: 'Description',
  featuresLines: 'Fonctions (une par ligne)',
  sortOrder: 'Ordre d affichage',
  popular: 'Plus populaire',
  active: 'Actif',
  addPackage: 'Ajouter un forfait',
  updatePackage: 'Enregistrer le forfait',
  deleteBlocked: 'Suppression impossible : commandes liées.',
  confirmDelete: 'Supprimer le forfait',
  selectPackage: 'Formule',
  orderDetails: 'Commande',
  contactDetails: 'Message',
  updateStatus: 'Mettre à jour le statut',
  packageSlugInvalid:
    'L identifiant doit contenir minuscules, chiffres et traits d union.',
  requiredField: 'Champs obligatoires manquants.',
};

const MAP: Record<AdminLocale, AdminDict> = {
  en: EN,
  ar: AR,
  fr: FR,
};

export function getAdminDictionary(locale: AdminLocale): AdminDict {
  return MAP[locale] ?? EN;
}

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
  chatScreenTitle: string;
  chatOverviewSubtitle: string;
  chatConversations: string;
  chatVisitor: string;
  chatAdmin: string;
  chatReply: string;
  chatReplyPlaceholder: string;
  chatSendReply: string;
  chatStatusOpen: string;
  chatStatusWaiting: string;
  chatStatusClosed: string;
  chatLastMessage: string;
  chatNoConversations: string;
  chatSelectConversation: string;
  chatConversationNotFound: string;
  chatTicketReceived: string;
  chatBackToList: string;
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
    'Orders, contact messages, and live chat support are active. Content modules below remain phased.',
  overviewFootnote:
    'Services, FAQs, testimonials, pages builder, legal pages editor, and site settings stay Coming soon.',
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
  loginUnavailable: 'Database temporarily unavailable.',
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
  chatScreenTitle: 'Chat support',
  chatOverviewSubtitle: 'Visitor threads from the website chat widget.',
  chatConversations: 'Conversations',
  chatVisitor: 'Visitor',
  chatAdmin: 'Admin',
  chatReply: 'Reply',
  chatReplyPlaceholder: 'Write your reply…',
  chatSendReply: 'Send reply',
  chatStatusOpen: 'Open',
  chatStatusWaiting: 'Waiting',
  chatStatusClosed: 'Closed',
  chatLastMessage: 'Last message',
  chatNoConversations: 'No conversations found',
  chatSelectConversation: 'Select a conversation from the list.',
  chatConversationNotFound: 'This conversation could not be loaded.',
  chatTicketReceived: 'Support request received',
  chatBackToList: '← All conversations',
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
  navChat: 'دعم الدردشة',
  navSettings: 'الإعدادات',
  comingSoon: 'قريباً',
  adminPanel: 'لوحة الإدارة',
  secureArea: 'منطقة آمنة',
  mobileNavHint: 'تنقّل الجوال محدود · يُفضّل سطح المكتب',
  administrator: 'مسؤول',
  overviewTitle: 'نظرة عامة',
  overviewSubtitle: 'الطلبات ورسائل التواصل ودعم الدردشة المباشرة مفعّلة. وحدات المحتوى التالية ضمن مراحل لاحقة.',
  overviewFootnote:
    'الخدمات والأسئلة الشائعة والشهادات ومنشئ الصفحات ومحرر الصفحات القانونية وإعدادات الموقع ما زالت قريباً.',
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
  loginUnavailable: 'قاعدة البيانات غير متاحة مؤقتاً.',
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
  chatScreenTitle: 'دعم الدردشة',
  chatOverviewSubtitle: 'محادثات الزوار من أداة الدردشة في الموقع.',
  chatConversations: 'المحادثات',
  chatVisitor: 'الزائر',
  chatAdmin: 'المدير',
  chatReply: 'الرد',
  chatReplyPlaceholder: 'اكتب ردك…',
  chatSendReply: 'إرسال الرد',
  chatStatusOpen: 'مفتوح',
  chatStatusWaiting: 'في الانتظار',
  chatStatusClosed: 'مغلق',
  chatLastMessage: 'آخر رسالة',
  chatNoConversations: 'لا توجد محادثات',
  chatSelectConversation: 'اختر محادثة من القائمة.',
  chatConversationNotFound: 'تعذّر تحميل هذه المحادثة.',
  chatTicketReceived: 'تم استلام طلب الدعم',
  chatBackToList: '← كل المحادثات',
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
    'Commandes, messages contact et support chat en direct sont actifs. Les modules ci dessous restent en phases ultérieures.',
  overviewFootnote:
    'Services, FAQ, témoignages, pages, pages légales et réglages site restent « Bientôt ».',
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
  loginUnavailable: 'Base de données temporairement indisponible.',
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
  chatScreenTitle: 'Support chat',
  chatOverviewSubtitle: 'Fils visiteurs depuis le widget de chat du site.',
  chatConversations: 'Conversations',
  chatVisitor: 'Visiteur',
  chatAdmin: 'Admin',
  chatReply: 'Réponse',
  chatReplyPlaceholder: 'Écrivez votre réponse…',
  chatSendReply: 'Envoyer la réponse',
  chatStatusOpen: 'Ouvert',
  chatStatusWaiting: 'En attente',
  chatStatusClosed: 'Fermé',
  chatLastMessage: 'Dernier message',
  chatNoConversations: 'Aucune conversation trouvée',
  chatSelectConversation: 'Choisissez une conversation dans la liste.',
  chatConversationNotFound: 'Impossible de charger cette conversation.',
  chatTicketReceived: 'Demande de support reçue',
  chatBackToList: '← Toutes les conversations',
};

const MAP: Record<AdminLocale, AdminDict> = {
  en: EN,
  ar: AR,
  fr: FR,
};

export function getAdminDictionary(locale: AdminLocale): AdminDict {
  return MAP[locale] ?? EN;
}

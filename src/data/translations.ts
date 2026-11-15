import { LanguageCode } from '../utils/i18n';

export interface LocalizedDictionary {
  brand: {
    shortWordmark: string;
    fullWordmark: string;
    clinicName: string;
    companyName: string;
    companySubtitle: string;
    cityCountry: string;
    foundedText: string;
    mophShort: string;
    clinicAddress: string;
    registeredOffice: string;
    hoursPolicy: string;
    tagline: string;
    founderName: string;
    founderTitle: string;
    founderBio: string;
    overview: string;
    vision: string;
    mission: string[];
    legalStatement: string;
    epigraphTranslation: string;
  };
  nav: {
    home: string;
    treatments: string;
    shop: string;
    about: string;
    contact: string;
    portals: string;
    portalsTitle: string;
    booking: string;
    bookingDesc: string;
    patientPortal: string;
    patientPortalDesc: string;
    symptomChecker: string;
    symptomCheckerDesc: string;
    testimonials: string;
    testimonialsDesc: string;
    blog: string;
    blogDesc: string;
    posTriage: string;
    posTriageDesc: string;
    admin: string;
    adminDesc: string;
    signIn: string;
    signOut: string;
    healthHistory: string;
    myConsultations: string;
    bookVisit: string;
    bookAppointment: string;
    activeLabel: string;
    openCartAria: string;
    toggleMenuAria: string;
    switcherAria: string;
    currencyAria: string;
    currencyLabel: string;
  };
  mobileBar: {
    callDesk: string;
    treatments: string;
    bookVisit: string;
    shop: string;
    cart: string;
  };
  hero: {
    headlineTop: string;
    headlineAccent: string;
    welcomePrefix: string;
    directedByPrefix: string;
    descriptionSuffix: string;
    scheduleCta: string;
    dispensaryCta: string;
    modalitiesCount: string;
    modalitiesDesc: string;
    formulasCount: string;
    formulasDesc: string;
    lookingForGuide: string;
    remedyGuideLink: string;
  };
  home: {
    systemsKicker: string;
    systemsHeading: string;
    founderProfileLink: string;
    servicesKicker: string;
    servicesHeading: string;
    allFeesLink: string;
    dispensaryKicker: string;
    dispensaryHeading: string;
    browseCategoriesLink: string;
    detailsBtn: string;
    addBtn: string;
    fullTriageLink: string;
    insideClinicKicker: string;
    insideClinicHeading: string;
    insideClinicBody: string;
    viewGalleryBtn: string;
    documentsWord: string;
    journalKicker: string;
    journalHeading: string;
    allArticlesBtn: string;
    readBtn: string;
    portalKicker: string;
    portalHeading: string;
    portalBody: string;
    portalBtn: string;
    allStoriesLink: string;
    ctaHeading: string;
    callWhatsappPrefix: string;
    closeGalleryAria: string;
  };
  systems: Array<{
    code: string;
    title: string;
    tagline: string;
    description: string;
    principles: string[];
  }>;
  scopeOfServices: Array<{
    code: string;
    title: string;
    category: string;
    description: string;
  }>;
  safetyEthics: Array<{
    title: string;
    desc: string;
  }>;
  treatments: {
    headerTitle: string;
    headerSubtitle: string;
    mophBadge: string;
    scopeKicker: string;
    scopeHeading: string;
    scopeSub: string;
    pillarsKicker: string;
    pillarsHeading: string;
    pillarsSub: string;
    pillars: Array<{ title: string; subtitle: string; desc: string }>;
    directoryKicker: string;
    directoryHeading: string;
    directorySub: string;
    allCat: string;
    catLabels: Record<string, string>;
    feeLabel: string;
    hideDetails: string;
    protocolDossier: string;
    bookVisit: string;
    includesTitle: string;
    indicationsTitle: string;
    prepTitle: string;
    prepNotes: string[];
    dispensaryNote: string;
    schedulePrefix: string;
    safetyBannerKicker: string;
    safetyBannerTitle: string;
    safetyBannerBody: string;
    bookConsultation: string;
    faqKicker: string;
    faqHeading: string;
    faqs: Array<{ q: string; a: string }>;
  };
  shop: {
    pageKicker: string;
    pageTitle: string;
    pageSub: string;
    dispatchTitle: string;
    dispatchSub: string;
    dispatchFreePrefix: string;
    dispatchFreeSuffix: string;
    promoTitle: string;
    promoSubPrefix: string;
    promoSubSuffix: string;
    purityTitle: string;
    puritySub: string;
    catalogKicker: string;
    catalogTitle: string;
    catalogSub: string;
    adviceBtn: string;
    allCategory: string;
    searchPlaceholder: string;
    formulationSingular: string;
    formulationPlural: string;
    sortFeatured: string;
    sortRating: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    emptyTitle: string;
    emptySub: string;
    showAllBtn: string;
    inspectBtn: string;
    addBtn: string;
    addedBtn: string;
    outOfStock: string;
    lowStock: string;
    inStock: string;
    shareLabel: string;
    activeNomenclature: string;
    clinicalDosage: string;
    addToCartTotal: string;
    reviewsWord: string;
    standardsKicker: string;
    standardsTitle: string;
    standards: Array<{ title: string; desc: string }>;
    unsureNote: string;
    bookConsultation: string;
    productCategories: Record<string, string>;
  };
  cart: {
    title: string;
    itemsInBasket: string;
    freeShippingUnlocked: string;
    addMorePrefix: string;
    addMoreSuffix: string;
    emptyTitle: string;
    emptySub: string;
    browseBtn: string;
    promoPlaceholder: string;
    applyBtn: string;
    promoSuccess: string;
    promoInvalid: string;
    subtotal: string;
    discount: string;
    shipping: string;
    freeLabel: string;
    tax: string;
    total: string;
    checkoutBtn: string;
    sslNote: string;
  };
  checkout: {
    step1Kicker: string;
    step1Title: string;
    recipientName: string;
    emailLabel: string;
    addressLabel: string;
    cityLabel: string;
    postalLabel: string;
    phoneLabel: string;
    orderTotalLabel: string;
    itemsWord: string;
    freeShippingApplied: string;
    standardShipping: string;
    continuePayment: string;
    step2Kicker: string;
    step2Title: string;
    cardMethod: string;
    cardSub: string;
    codMethod: string;
    codSub: string;
    cardNumber: string;
    expiryDate: string;
    cvcLabel: string;
    codTitle: string;
    codNote: string;
    totalToPay: string;
    verifiedSafe: string;
    backAddress: string;
    confirmOrder: string;
    orderConfirmedBadge: string;
    thankYouTitle: string;
    thankYouSub: string;
    orderRefLabel: string;
    recipientSummary: string;
    deliverySummary: string;
    estDelivery: string;
    estDeliveryVal: string;
    totalPaid: string;
    continueExploring: string;
  };
  quickView: {
    dossierTitle: string;
    closeAria: string;
    addToCart: string;
    addedNotice: string;
    keyActives: string;
    suggestedUse: string;
  };
  booking: {
    pageTitle: string;
    pageSub: string;
    telehealthBadge: string;
    confidentialBadge: string;
    tabPatient: string;
    tabStaff: string;
    tabLookup: string;
    policyTitle: string;
    policyDesc: string;
    recordsTitle: string;
    recordsDesc: string;
    fastTitle: string;
    fastDesc: string;
    lookupTitle: string;
    lookupSub: string;
    lookupPlaceholder: string;
    searchBtn: string;
    confirmedLabel: string;
    patientLabel: string;
    serviceLabel: string;
    dateTimeLabel: string;
    clinicianLabel: string;
    noMatchPrefix: string;
    noMatchSuffix: string;
    hotlineTitle: string;
    callBtnPrefix: string;
    wizardSteps: [string, string, string];
    selectServiceTitle: string;
    inclusionsLabel: string;
    feeLabel: string;
    selectClinicianTitle: string;
    yearsPractice: string;
    modeLabel: string;
    inClinicTitle: string;
    inClinicSub: string;
    telehealthTitle: string;
    telehealthSub: string;
    proceedStep2: string;
    selectedProtocol: string;
    withPrefix: string;
    changeService: string;
    selectDateLabel: string;
    availableSlotsLabel: string;
    morningLabel: string;
    afternoonLabel: string;
    backBtn: string;
    nextStep3: string;
    step3Badge: string;
    step3Title: string;
    step3Privacy: string;
    legalName: string;
    emailAddress: string;
    phoneWhatsapp: string;
    ageOptional: string;
    concernsLabel: string;
    concernsPlaceholder: string;
    firstTimeCheckbox: string;
    dueAtVisit: string;
    confirmReserveBtn: string;
    aptConfirmedBadge: string;
    aptConfirmedTitle: string;
    recordedFor: string;
    refCode: string;
    locationLabel: string;
    arrivalNotesTitle: string;
    arrivalNotes: string[];
    downloadIcs: string;
    bookAnother: string;
    alreadyBooked: string;
    quickLookupPlaceholder: string;
    lookupBtn: string;
    scheduleErrorMsg: string;
  };
  about: {
    leadershipKicker: string;
    clinicAddressLabel: string;
    registeredOfficeLabel: string;
    bookWithFounder: string;
    viewServices: string;
    faithKicker: string;
    visionTitle: string;
    visionSubtitle: string;
    missionTitle: string;
    missionSubtitle: string;
    safetyKicker: string;
    mophKicker: string;
    mophTitle: string;
    directDesk: string;
    archiveKicker: string;
    archiveTitle: string;
    archiveSub: string;
    gridLabel: string;
    projectorLabel: string;
    allRecords: string;
    inspectBtn: string;
    lightboxBtn: string;
    slideLabel: string;
    ofWord: string;
    teamKicker: string;
    teamTitle: string;
    yearsPractice: string;
    scheduleBtn: string;
    bottomCtaTitle: string;
    bookClinicalBtn: string;
    contactDeskBtn: string;
    closeBtn: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phoneDeskTitle: string;
    callClinicBtn: string;
    whatsappTitle: string;
    whatsappSub: string;
    whatsappBtn: string;
    emailsTitle: string;
    sendEmailBtn: string;
    websitesTitle: string;
    openPortalBtn: string;
    inquiryKicker: string;
    inquiryTitle: string;
    inquirySub: string;
    receivedTitle: string;
    receivedBody: string;
    sendAnother: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    inquiryType: string;
    optGeneral: string;
    optAppointment: string;
    optDispensary: string;
    optTelehealth: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    sendingBtn: string;
    kabulLocations: string;
    clinicAddrTitle: string;
    regOfficeTitle: string;
    bookOutpatientBtn: string;
    hoursRuleTitle: string;
    hoursRuleDesc: string;
    channelsKicker: string;
    followPrefix: string;
  };
  symptoms: {
    kicker: string;
    title: string;
    subtitle: string;
    protocolSummary: string;
    keyBotanicals: string;
    recommendedVisit: string;
    bookBtn: string;
    dispensaryFormulations: string;
    scheduleEvalBtn: string;
    pageBadge: string;
    pageHeading: string;
    pageAccent: string;
    pageSub: string;
    nonInvasiveBadge: string;
    formulatedByBadge: string;
    clinicalProfilePrefix: string;
    unaniContext: string;
    recommendedConsult: string;
    bookThisVisit: string;
    targetedCompounds: string;
    personalizedRegimen: string;
    regimenDesc: string;
    typicalWindow: string;
    compoundedRemediesKicker: string;
    targetedProductsFor: string;
    viewFullDispensary: string;
    dossierBtn: string;
    mizajSectionKicker: string;
    mizajSectionTitle: string;
    mizajSectionSub: string;
    unaniPillarBadge: string;
    signsLabel: string;
    balancingLabel: string;
    mizajGuides: Array<{ mizaj: string; qualities: string; herbs: string }>;
    ctaTitle: string;
    ctaSub: string;
    scheduleAssessment: string;
    whatsappTriage: string;
  };
  testimonials: {
    kicker: string;
    heading: string;
    sub: string;
    allStories: string;
    verifiedPatient: string;
    progressLabel: string;
    conditionLabel: string;
    clinicianLabel: string;
    lookingForCare: string;
    bookVisit: string;
    pageBadge: string;
    pageTitle: string;
    pageAccent: string;
    pageSub: string;
    statSatisfaction: string;
    statRelief: string;
    statPatients: string;
    statNatural: string;
    shareKicker: string;
    shareTitle: string;
    shareSub: string;
    submittedTitle: string;
    submittedBody: string;
    nameLabel: string;
    cityLabel: string;
    condLabel: string;
    docLabel: string;
    storyLabel: string;
    storyPlaceholder: string;
    submitStoryBtn: string;
    ctaTitle: string;
    ctaSub: string;
    bookNowBtn: string;
    exploreTreatmentsBtn: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    pharmKicker: string;
    pharmTitle: string;
    pharmSub: string;
    indicationLabel: string;
    ingredientsLabel: string;
    methodLabel: string;
    wantPersonalized: string;
    scheduleBtn: string;
    disclaimerTitle: string;
    disclaimerBody: string;
  };
  portal: {
    badge: string;
    title: string;
    subtitle: string;
    signInTitle: string;
    signInSub: string;
    signInDesc: string;
    signInBtn: string;
    lookupTitle: string;
    lookupHeading: string;
    lookupSub: string;
    searchAptBtn: string;
    tabProtocols: string;
    tabAppointments: string;
    tabOrders: string;
    tabMizaj: string;
    bookConsultBtn: string;
    signOutBtn: string;
    doseLoggedMsg: string;
  };
  posAdmin: {
    posKicker: string;
    posTitle: string;
    posSub: string;
    viewLedgerBtn: string;
    tabPos: string;
    tabTriage: string;
    adminKicker: string;
    adminTitle: string;
    adminSub: string;
    openPosBtn: string;
    tabAccounting: string;
    tabMoa2009: string;
    tabInventory: string;
    tabSettings: string;
  };
  chatbot: {
    askButton: string;
    title: string;
    subtitle: string;
    welcomeMsg: string;
    placeholder: string;
    searchBtn: string;
    mapsBtn: string;
    thinking: string;
    quickPrompts: Array<{ label: string; prompt: string }>;
  };
  footer: {
    pagesHeading: string;
    addressesHeading: string;
    clinicLabel: string;
    regOfficeLabel: string;
    phoneWhatsappLabel: string;
    updatesHeading: string;
    updatesSub: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    subscribedMsg: string;
    scopeSafetyLabel: string;
    copyrightPrefix: string;
  };
  servicesMap: Record<
    string,
    {
      title: string;
      duration: string;
      category: string;
      description: string;
      suitableFor: string[];
      treatmentIncludes: string[];
    }
  >;
  productsMap: Record<
    string,
    {
      name: string;
      subtitle: string;
      volumeOrWeight: string;
      shortDescription: string;
      detailedDescription: string;
      suggestedUse: string;
      precautions: string;
    }
  >;
  symptomsMap: Record<
    string,
    {
      name: string;
      description: string;
      recommendedHerbs: string[];
    }
  >;
}

const EN_DICT: LocalizedDictionary = {
  brand: {
    shortWordmark: 'SAFI CARE',
    fullWordmark: 'SAFI NATURAL CARE',
    clinicName: 'Safi Natural Care Clinic',
    companyName: 'Safi Natural Care',
    companySubtitle: 'Herbal Health Care & Wellness Company',
    cityCountry: 'Kabul, Afghanistan',
    foundedText: 'Est. April 2026',
    mophShort: 'MoPH TCIM',
    clinicAddress: 'Main Airport Road, Charahi Shaheed, Kabul, Afghanistan',
    registeredOffice: 'PD#10, Qalai Fathullah, Kabul, Afghanistan',
    hoursPolicy: 'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm',
    tagline: 'Herbal Medicine · Unani Medicine · Naturopathy',
    founderName: 'Dr. Hafizullah Safi',
    founderTitle: 'Founder & Director / CEO, Safi Natural Care',
    founderBio:
      'Founder and Director of Safi Natural Care in Kabul, Dr. Hafizullah Safi leads outpatient care uniting Herbal Medicine, Unani Mizaj diagnostics, Naturopathy, and traditional acupuncture with clear patient safety standards.',
    overview:
      'Safi Natural Care Clinic is an outpatient healthcare facility in Kabul providing traditional and natural medical care through Herbal Medicine, Unani Medicine, and Naturopathy.',
    vision:
      'Community health supported by safe, ethical, and evidence-informed traditional medicine.',
    mission: [
      'Provide accessible herbal, Unani, and naturopathic outpatient care',
      'Uphold patient safety, informed consent, and honest clinical boundaries',
    ],
    legalStatement:
      "Safi Natural Care Clinic operates in accordance with Afghanistan's Ministry of Public Health regulations as a complementary outpatient service. It does not replace emergency or conventional medical care.",
    epigraphTranslation:
      "And when I am ill, it is He who cures me (Ash-Shu'ara 26:80)",
  },
  nav: {
    home: 'Home',
    treatments: 'Treatments',
    shop: 'Dispensary',
    about: 'About',
    contact: 'Contact',
    portals: 'Portals',
    portalsTitle: 'Clinic Portals & Operations',
    booking: 'Book Consultation',
    bookingDesc: 'Schedule clinic or video visit',
    patientPortal: 'Patient Portal',
    patientPortalDesc: 'Appointments, protocols & orders',
    symptomChecker: 'Symptom Triage',
    symptomCheckerDesc: 'Unani Mizaj & herbal guidance',
    testimonials: 'Patient Stories',
    testimonialsDesc: 'Documented clinical outcomes',
    blog: 'Remedy Journal',
    blogDesc: 'Monographs & home infusions',
    posTriage: 'POS & QR Triage',
    posTriageDesc: 'Barcode POS & patient check-in',
    admin: 'Admin & Accounting',
    adminDesc: 'MOA 2009 ledger, inventory & settings',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    healthHistory: 'Health History & Protocols',
    myConsultations: 'My Consultations',
    bookVisit: 'Book Visit',
    bookAppointment: 'Book Appointment',
    activeLabel: 'Active',
    openCartAria: 'Open shopping cart',
    toggleMenuAria: 'Toggle navigation menu',
    switcherAria: 'Select language',
    currencyAria: 'Select currency',
    currencyLabel: 'Currency',
  },
  mobileBar: {
    callDesk: 'Call Desk',
    treatments: 'Treatments',
    bookVisit: 'Book Visit',
    shop: 'Shop',
    cart: 'Cart',
  },
  hero: {
    headlineTop: 'Traditional Medicine,',
    headlineAccent: 'Grounded in Clinical Care.',
    welcomePrefix: 'Welcome to',
    directedByPrefix: 'Directed by',
    descriptionSuffix:
      'our Kabul outpatient clinic delivers ethical Herbal, Unani, Naturopathic, and traditional acupuncture care.',
    scheduleCta: 'Schedule Consultation',
    dispensaryCta: 'Herbal Dispensary',
    modalitiesCount: '3 Modalities',
    modalitiesDesc: 'Herbal, Unani Mizaj & Naturopathy',
    formulasCount: '9 Formula Lines',
    formulasDesc: 'Full-spectrum clinic apothecary',
    lookingForGuide: 'Looking for dietary monographs?',
    remedyGuideLink: 'Remedy Guide',
  },
  home: {
    systemsKicker: 'Three Systems of Practice',
    systemsHeading: 'Herbal Medicine · Unani Medicine · Naturopathy',
    founderProfileLink: 'Founder & Clinic Profile',
    servicesKicker: 'Outpatient Services · Kabul',
    servicesHeading: 'Clinical Focus Areas',
    allFeesLink: 'All Consultation Fees & Protocols',
    dispensaryKicker: 'Safi Herbal Dispensary',
    dispensaryHeading: 'Signature Compounded Remedies',
    browseCategoriesLink: 'Browse All 9 Categories',
    detailsBtn: 'Details',
    addBtn: 'Add',
    fullTriageLink: 'Full Symptom & Mizaj Triage',
    insideClinicKicker: 'Inside Safi Natural Care Clinic',
    insideClinicHeading: 'Kabul Practice & Official Profile',
    insideClinicBody:
      'Every outpatient dossier, dietary plan, and apothecary formulation is tracked with clear safety standards and MoPH compliance.',
    viewGalleryBtn: 'View Full Gallery',
    documentsWord: 'Documents',
    journalKicker: 'Remedy Journal',
    journalHeading: 'Botanical Notes & Dietary Guidance',
    allArticlesBtn: 'All Articles',
    readBtn: 'Read',
    portalKicker: 'Patient Records Portal',
    portalHeading: 'Review Your Consultations, Prescriptions & Dispensary Orders',
    portalBody:
      'Sign in with your clinic account to view active botanical dosing schedules and order history.',
    portalBtn: 'Patient Portal',
    allStoriesLink: 'All Patient Stories',
    ctaHeading: 'Book an In-Clinic or Telehealth Visit',
    callWhatsappPrefix: 'Call / WhatsApp:',
    closeGalleryAria: 'Close gallery lightbox',
  },
  systems: [
    {
      code: 'HM.',
      title: 'Herbal Medicine',
      tagline: 'Phytotherapy',
      description:
        'Unadulterated medicinal plant formulations prepared for physiological safety and clear therapeutic utility.',
      principles: [
        'Plant-based preparations guided by phytotherapy principles',
        'Verified botanical identification and safe dosing',
        'Zero toxic, endangered, or adulterated substances',
      ],
    },
    {
      code: 'UN.',
      title: 'Unani Medicine',
      tagline: 'Mizaj & Diet Therapy',
      description:
        'Classical Unani temperament evaluation and diet therapy designed to restore constitutional balance.',
      principles: [
        'Mizaj (constitutional temperament) assessment',
        'Balancing Akhlat (four humors) through herbs and diet',
        'Supporting Tabiat (innate self-healing capacity)',
      ],
    },
    {
      code: 'NA.',
      title: 'Naturopathy',
      tagline: 'Lifestyle & Nutrition',
      description:
        'Practical lifestyle, sleep, and nutrition protocols that reinforce natural recovery without invasive intervention.',
      principles: [
        'Individualized lifestyle and nutrition counseling',
        'Non-invasive, supportive care tailored to daily habits',
        'Complementary guidance alongside conventional medicine',
      ],
    },
  ],
  scopeOfServices: [
    {
      code: 'HM.',
      title: 'Digestive and metabolic conditions',
      category: 'Metabolic & Gastric',
      description:
        'Supportive care for reflux, bloating, sluggish digestion, and dietary-metabolic balance.',
    },
    {
      code: 'UN.',
      title: 'Musculoskeletal and joint discomfort',
      category: 'Joints & Mobility',
      description:
        'Botanical compresses, topical anti-inflammatory balms, and mobility support for stiff joints.',
    },
    {
      code: 'NA.',
      title: 'Chronic stress and lifestyle-related conditions',
      category: 'Stress & Sleep',
      description:
        'Nervine phytotherapy, circadian rhythm recovery, and practical lifestyle counseling.',
    },
    {
      code: 'HM.',
      title: 'Hormonal and reproductive health support',
      category: 'Endocrine & Fertility',
      description:
        'Constitutional herbal protocols supporting cycle balance and male/female reproductive vitality.',
    },
    {
      code: 'UN.',
      title: 'Respiratory and urological supportive care',
      category: 'Bronchial & Renal',
      description:
        'Demulcent syrups, seasonal airway support, and kidney/urinary tract botanical tonics.',
    },
    {
      code: 'NA.',
      title: 'Skin and hair health (non-cosmetic, therapeutic care)',
      category: 'Therapeutic Derm',
      description:
        'Targeted internal and topical plant care for chronic dryness, scalp health, and reactive skin.',
    },
    {
      code: 'NA.',
      title: 'General wellness and preventive health education',
      category: 'Preventive Care',
      description:
        'Temperament-based nutrition guidance and seasonal preventive habits for families.',
    },
    {
      code: 'AC.',
      title: 'Traditional acupuncture (non-invasive supportive care)',
      category: 'Acupuncture',
      description:
        'Non-invasive supportive meridian care for localized pain, tension headaches, and recovery.',
    },
  ],
  safetyEthics: [
    {
      title: 'Patient Safety',
      desc: 'Full health history review, careful case assessment, and prompt medical referral when conventional care is needed.',
    },
    {
      title: 'Ethical Practice',
      desc: 'No exaggerated claims or guaranteed cures; transparent communication respecting patient dignity.',
    },
    {
      title: 'Informed Consent',
      desc: 'Clear explanation of traditional medicine scope, expected timeline, and limitations.',
    },
    {
      title: 'Clinical Documentation',
      desc: 'Structured patient records, QR visit tracking, and follow-up continuity.',
    },
  ],
  treatments: {
    headerTitle: 'Outpatient Traditional & Integrative Clinical Care',
    headerSubtitle:
      'Every consultation is tailored to your constitutional temperament (Mizaj), combining Unani-Tibb, Phytotherapy, Naturopathy, and non-invasive supportive care.',
    mophBadge: 'MoPH Compliant TCIM Practice',
    scopeKicker: 'Scope of Practice',
    scopeHeading: '8 Outpatient Clinical Services',
    scopeSub: 'Non-invasive, supportive, and preventive care for chronic and functional conditions.',
    pillarsKicker: 'Constitutional Evaluation',
    pillarsHeading: '4 Diagnostic Pillars',
    pillarsSub:
      'Every patient assessment follows structured diagnostic observation before compounding or prescribing.',
    pillars: [
      {
        title: '1. Nabz (Pulse)',
        subtitle: 'Hemodynamic Vitality',
        desc: 'Evaluating radial pulse parameters to assess organ vitality, metabolic heat, and vascular balance.',
      },
      {
        title: '2. Mizaj (Temperament)',
        subtitle: 'Humoral Equilibrium',
        desc: 'Determining your profile across Blood, Yellow Bile, Phlegm, and Black Bile to guide diet and herbs.',
      },
      {
        title: '3. Lisan (Tongue Review)',
        subtitle: 'Digestive Mapping',
        desc: 'Visual observation of coating, moisture, and color to identify digestive stagnation and heat.',
      },
      {
        title: '4. Herb-Drug Audit',
        subtitle: 'Clinical Safety Screen',
        desc: 'Cross-checking herbal formulations against conventional medications for safe complementary care.',
      },
    ],
    directoryKicker: 'In-Clinic & Telehealth Protocols',
    directoryHeading: 'Bookable Consultation Programs',
    directorySub: 'Inspect what each consultation includes and reserve your slot directly.',
    allCat: 'All',
    catLabels: {
      All: 'All',
      General: 'General',
      'Chronic Care': 'Chronic Care',
      Specialized: 'Specialized',
      Vitality: 'Vitality',
    },
    feeLabel: 'Consultation Fee',
    hideDetails: 'Hide Details',
    protocolDossier: 'Protocol Dossier',
    bookVisit: 'Book Visit',
    includesTitle: 'What This Visit Includes',
    indicationsTitle: 'Primary Clinical Indications',
    prepTitle: 'Patient Preparation',
    prepNotes: [
      'Avoid heavy caffeine or food 2 hours before pulse assessment.',
      'Bring recent lab panels and current prescription names.',
      'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm.',
    ],
    dispensaryNote: 'Direct remedy dispensing available at our on-site Kabul apothecary.',
    schedulePrefix: 'Schedule',
    safetyBannerKicker: 'Patient Safety & Sterile Clinical Standards',
    safetyBannerTitle: 'Non-Invasive, Honest Outpatient Care in Kabul',
    safetyBannerBody:
      'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm at Main Airport Road, Charahi Shaheed, Kabul. Single-use sterile equipment and verified botanical formulations.',
    bookConsultation: 'Book Consultation',
    faqKicker: 'Patient Information',
    faqHeading: 'Common Clinical Questions',
    faqs: [
      {
        q: 'How does Unani-Tibb diagnosis differ from conventional allopathic testing?',
        a: 'Unani-Tibb evaluates the whole human system through constitutional temperament (Mizaj: Dam/Sanguine, Safra/Choleric, Balgham/Phlegmatic, Sawda/Melancholic), arterial pulse (Nabz), tongue, and metabolic digestion to guide individualized herbal and dietary care.',
      },
      {
        q: 'What systems of medicine are practiced at Safi Natural Care Clinic?',
        a: 'We practice three complementary systems in Kabul: Herbal Medicine (Phytotherapy), Unani Medicine (Mizaj assessment & diet therapy), and Naturopathy (lifestyle & nutrition counseling), alongside non-invasive supportive traditional acupuncture.',
      },
      {
        q: 'Can I take Safi herbal formulations alongside my prescription medications?',
        a: 'Yes, with clinical oversight. During your initial consultation, Dr. Hafizullah Safi and our clinical care team review your current prescriptions and health history to prevent adverse herb-drug interactions.',
      },
      {
        q: 'Do you take appointments or walk-in patients?',
        a: 'Appointments go first, then walk-ins (Sat–Thu 8:30am – 6:00pm). Scheduled consultations are seen first at Main Airport Road, Charahi Shaheed, Kabul.',
      },
      {
        q: 'Are your botanical preparations lab-tested and safely sourced?',
        a: 'Yes. Every botanical preparation at Safi Natural Care is compounded using verified medicinal plants, free of toxic, endangered, or adulterated substances, and checked for potency and hygienic storage.',
      },
    ],
  },
  shop: {
    pageKicker: 'Safi Natural Care · Botanical Dispensary',
    pageTitle: 'Herbal Formulations & Apothecary',
    pageSub:
      'Compounded botanical formulations across 9 wellness categories — including Safi Hormone Balance, Safi Chill AF, and Safi Beauty Drops.',
    dispatchTitle: 'Kabul & Dispatch',
    dispatchSub: 'Free shipping over $60 · Clinic pickup on Airport Rd',
    dispatchFreePrefix: 'Free shipping over',
    dispatchFreeSuffix: '· Clinic pickup on Airport Rd',
    promoTitle: 'Patient Promo Code',
    promoSubPrefix: 'Apply',
    promoSubSuffix: 'for 10% off',
    purityTitle: 'Verified Botanical Purity',
    puritySub: 'Zero heavy metals or synthetic adulterants',
    catalogKicker: '9 Clinical Categories',
    catalogTitle: 'Safi Apothecary Catalog',
    catalogSub:
      'Filter by health category or search any formulation to inspect botanical ingredients, live dispensary stock, and pricing.',
    adviceBtn: 'Need Constitutional Advice?',
    allCategory: 'All',
    searchPlaceholder: 'Search formulations (e.g. Hormone Balance, Chill AF, Beauty Drops)...',
    formulationSingular: 'formulation',
    formulationPlural: 'formulations',
    sortFeatured: 'Featured First',
    sortRating: 'Highest Rated',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    emptyTitle: 'No Formulations Match Your Filter',
    emptySub: 'Try another wellness category or clear your search term.',
    showAllBtn: 'Show All 9 Categories',
    inspectBtn: 'Inspect',
    addBtn: 'Add',
    addedBtn: 'Added',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    shareLabel: 'Share:',
    activeNomenclature: 'Botanical Actives & Nomenclature',
    clinicalDosage: 'Clinical Dosage:',
    addToCartTotal: 'Add to Cart',
    reviewsWord: 'reviews',
    standardsKicker: 'Preparation Standards',
    standardsTitle: 'Clean Botanical Extraction & Storage',
    standards: [
      {
        title: 'Verified Sourcing',
        desc: 'Botanical extracts, capsules, and oils are sourced and bottled under clean, inspected dispensary standards.',
      },
      {
        title: 'Transparent Labeling',
        desc: 'Full botanical nomenclature, conservative dosing instructions, and clear clinical contraindication notes.',
      },
      {
        title: 'Amber UV Packaging',
        desc: 'Protected in UV-shielded glass and sealed apothecary jars without harsh chemical preservatives.',
      },
    ],
    unsureNote:
      'Unsure which category fits your Mizaj temperament? Speak directly with Dr. Hafizullah Safi’s clinic team.',
    bookConsultation: 'Book Consultation',
    productCategories: {
      "Women's Health & Hormonal Wellness": "Women's Health & Hormonal Wellness",
      'Male Wellness & Fertility': 'Male Wellness & Fertility',
      'Digestive & Gastrointestinal Wellness': 'Digestive & Gastrointestinal Wellness',
      'Stress, Sleep & Neurological Wellness': 'Stress, Sleep & Neurological Wellness',
      'Bone, Joint & Pain Management': 'Bone, Joint & Pain Management',
      'Kidney & Urinary Wellness': 'Kidney & Urinary Wellness',
      'Cardiometabolic Wellness': 'Cardiometabolic Wellness',
      'Liver & Detox Wellness': 'Liver & Detox Wellness',
      'Immunity & General Wellness': 'Immunity & General Wellness',
    },
  },
  cart: {
    title: 'Apothecary Cart',
    itemsInBasket: 'items in basket',
    freeShippingUnlocked: 'Free Dispensary Shipping Unlocked!',
    addMorePrefix: 'Add',
    addMoreSuffix: 'more for FREE shipping',
    emptyTitle: 'Your Cart is Empty',
    emptySub: 'Explore our doctor-compounded herbal remedies and natural medicines.',
    browseBtn: 'Browse Dispensary',
    promoPlaceholder: 'Promo code (e.g. HERBAL10)',
    applyBtn: 'Apply',
    promoSuccess: 'Coupon applied successfully!',
    promoInvalid: 'Invalid coupon code. Try HERBAL10 for 10% off.',
    subtotal: 'Subtotal',
    discount: 'Discount',
    shipping: 'Dispensary Shipping',
    freeLabel: 'FREE',
    tax: 'Estimated Tax (5%)',
    total: 'Total Amount',
    checkoutBtn: 'Proceed to Secure Checkout',
    sslNote: '256-Bit SSL Encrypted Herbal Dispensary Checkout',
  },
  checkout: {
    step1Kicker: 'Dispensary Shipping · Step 1 of 2',
    step1Title: 'Delivery Address & Contact',
    recipientName: 'Full Recipient Name *',
    emailLabel: 'Email for Tracking Updates *',
    addressLabel: 'Street Address & Apartment/Suite *',
    cityLabel: 'City *',
    postalLabel: 'Postal Code',
    phoneLabel: 'Delivery Phone *',
    orderTotalLabel: 'Order Total',
    itemsWord: 'items',
    freeShippingApplied: 'Free Shipping Applied',
    standardShipping: 'Standard Shipping',
    continuePayment: 'Continue to Payment',
    step2Kicker: 'Secure Payment · Step 2 of 2',
    step2Title: 'Select Payment Option',
    cardMethod: 'Credit / Debit Card',
    cardSub: 'Visa, MC, Amex',
    codMethod: 'Clinic Pickup / COD',
    codSub: 'Pay upon delivery',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvcLabel: 'CVC / CVV',
    codTitle: 'Cash on Delivery / Pickup:',
    codNote:
      'You can inspect your sealed herbal formulations upon delivery and pay the courier or clinic desk in cash.',
    totalToPay: 'Total to Pay Now:',
    verifiedSafe: 'Verified Safe',
    backAddress: 'Back to Address',
    confirmOrder: 'Confirm & Place Herbal Order',
    orderConfirmedBadge: 'Order Confirmed',
    thankYouTitle: 'Thank You for Choosing Safi Natural Care Clinic',
    thankYouSub: 'Your order is currently being compounded and packed with organic botanical care.',
    orderRefLabel: 'Order Reference Number:',
    recipientSummary: 'Recipient:',
    deliverySummary: 'Delivery Address:',
    estDelivery: 'Estimated Delivery:',
    estDeliveryVal: '2-4 Business Days',
    totalPaid: 'Total Paid:',
    continueExploring: 'Continue Exploring Safi Clinic',
  },
  quickView: {
    dossierTitle: 'Formulation Dossier',
    closeAria: 'Close product modal',
    addToCart: 'Add to Cart',
    addedNotice: 'Added to Cart!',
    keyActives: 'Key Botanical Actions',
    suggestedUse: 'Suggested Usage',
  },
  booking: {
    pageTitle: 'Book Your Clinical Consultation',
    pageSub:
      'Reserve an in-person consultation with Dr. Hafizullah Safi and our clinical care team at Main Airport Road, Charahi Shaheed, Kabul, or book a telehealth video review.',
    telehealthBadge: 'Telehealth Video Available',
    confidentialBadge: 'Patient Confidentiality',
    tabPatient: 'Patient Booking Wizard',
    tabStaff: 'Clinic Staff Master Calendar',
    tabLookup: 'Look Up Booking',
    policyTitle: 'Scheduling & Walk-In Policy',
    policyDesc:
      'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm. Scheduled appointments take priority, followed by walk-in evaluations.',
    recordsTitle: 'Bring Recent Medical Records',
    recordsDesc:
      'Bring lab reports and current prescription names so we can run a thorough herb-drug safety review.',
    fastTitle: '2-Hour Pre-Visit Fast',
    fastDesc:
      'Avoid coffee or heavy meals 2 hours prior for accurate pulse (Nabz) and tongue evaluation.',
    lookupTitle: 'Look Up an Existing Booking',
    lookupSub: 'Enter your booking reference number (e.g. SHC-8401), phone number, or email.',
    lookupPlaceholder: 'e.g. SHC-8401 or +93 780 299 299',
    searchBtn: 'Search Booking',
    confirmedLabel: 'Booking Confirmed',
    patientLabel: 'Patient',
    serviceLabel: 'Service',
    dateTimeLabel: 'Date & Time',
    clinicianLabel: 'Clinician',
    noMatchPrefix: 'No booking found matching',
    noMatchSuffix: 'Contact our reception desk at +93 780 299 299.',
    hotlineTitle: 'Direct Reception & Walk-In Coordination',
    callBtnPrefix: 'Call',
    wizardSteps: ['Service & Clinician', 'Date & Time', 'Patient Details'],
    selectServiceTitle: '1. Select Clinical Service',
    inclusionsLabel: 'Protocol Inclusions:',
    feeLabel: 'consultation fee',
    selectClinicianTitle: '2. Select Clinician',
    yearsPractice: 'Years Practice',
    modeLabel: 'Consultation Mode:',
    inClinicTitle: 'In-Clinic Visit',
    inClinicSub: 'Charahi Shaheed, Kabul',
    telehealthTitle: 'Telehealth Video',
    telehealthSub: 'Link emailed after booking',
    proceedStep2: 'Proceed to Date & Time',
    selectedProtocol: 'Selected Protocol:',
    withPrefix: 'With',
    changeService: 'Change Service',
    selectDateLabel: 'Select Date',
    availableSlotsLabel: 'Available Clinic Time Slots:',
    morningLabel: 'Morning',
    afternoonLabel: 'Afternoon',
    backBtn: 'Back',
    nextStep3: 'Next: Patient Details',
    step3Badge: 'Step 3 of 3',
    step3Title: 'Patient Information & Health Context',
    step3Privacy:
      'All patient details are confidential under Safi Natural Care Clinic privacy protocols.',
    legalName: 'Full Legal Name *',
    emailAddress: 'Email Address *',
    phoneWhatsapp: 'Phone / WhatsApp *',
    ageOptional: 'Patient Age (optional)',
    concernsLabel: 'Primary Health Concerns *',
    concernsPlaceholder: 'Describe your symptoms, duration, and current medications...',
    firstTimeCheckbox: 'First-time patient visiting Safi Natural Care Clinic',
    dueAtVisit: 'Due at visit',
    confirmReserveBtn: 'Confirm & Reserve Visit',
    aptConfirmedBadge: 'Appointment Confirmed',
    aptConfirmedTitle: 'We Look Forward to Seeing You',
    recordedFor: 'Confirmation recorded for',
    refCode: 'Reference Code',
    locationLabel: 'Location',
    arrivalNotesTitle: 'Clinic Arrival Notes',
    arrivalNotes: [
      'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm.',
      'Avoid coffee or heavy meals 2 hours prior for accurate pulse assessment.',
      'Bring any current prescription bottles or laboratory reports.',
    ],
    downloadIcs: 'Download Calendar (.ics)',
    bookAnother: 'Book Another Visit',
    alreadyBooked: 'Already have a scheduled visit?',
    quickLookupPlaceholder: 'Enter Booking Ref (e.g. SHC-84291) or Phone',
    lookupBtn: 'Lookup',
    scheduleErrorMsg: 'Please select both a date and an available clinic time slot.',
  },
  about: {
    leadershipKicker: 'Leadership · Herbal Health Care & Wellness Company',
    clinicAddressLabel: 'Clinic Address',
    registeredOfficeLabel: 'Registered Office',
    bookWithFounder: 'Book With Dr. Hafizullah Safi',
    viewServices: 'View 8 Outpatient Services',
    faithKicker: "Faith & Healing · Surah Ash-Shu'ara 26:80",
    visionTitle: 'Vision',
    visionSubtitle: 'Ethical Community Care',
    missionTitle: 'Mission',
    missionSubtitle: 'Safety & Informed Consent',
    safetyKicker: 'Clinical Safety & WHO TCIM Principles',
    mophKicker: 'MoPH Compliance',
    mophTitle: 'Legal & Scope Notice',
    directDesk: 'Direct Desk:',
    archiveKicker: 'Clinic Archive & Portraits',
    archiveTitle: 'Official Documentation & Clinical Photos',
    archiveSub: 'Click any record or photo below to inspect full resolution in the lightbox viewer.',
    gridLabel: 'Grid',
    projectorLabel: 'Projector',
    allRecords: 'All Records',
    inspectBtn: 'Inspect',
    lightboxBtn: 'Lightbox',
    slideLabel: 'Slide',
    ofWord: 'of',
    teamKicker: 'Medical Team',
    teamTitle: 'Director & Clinical Staff',
    yearsPractice: 'Years Practice',
    scheduleBtn: 'Schedule Consultation',
    bottomCtaTitle: 'Visit Our Kabul Outpatient Clinic',
    bookClinicalBtn: 'Book Clinical Consultation',
    contactDeskBtn: 'Contact Clinic Desk',
    closeBtn: 'Close',
  },
  contact: {
    title: 'Contact & Kabul Locations',
    subtitle:
      'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm. Reach Dr. Hafizullah Safi’s reception desk for scheduled visits, walk-in coordination, or herbal dispensary pickups.',
    phoneDeskTitle: 'Phone Desk (Kabul)',
    callClinicBtn: 'Call Clinic',
    whatsappTitle: 'WhatsApp Consultation Desk',
    whatsappSub: 'Appointments & remedy inquiries',
    whatsappBtn: 'Message on WhatsApp',
    emailsTitle: 'Clinical Emails',
    sendEmailBtn: 'Send Email',
    websitesTitle: 'Official Websites',
    openPortalBtn: 'Open Portal',
    inquiryKicker: 'Online Inquiry',
    inquiryTitle: 'Send a Message to Our Reception Desk',
    inquirySub:
      'Ask about outpatient scheduling, Unani Mizaj assessments, or herbal preparation availability.',
    receivedTitle: 'Inquiry Received',
    receivedBody:
      'Thank you for contacting Safi Natural Care Clinic. Our Kabul reception coordinator will follow up with you shortly.',
    sendAnother: 'Send Another Inquiry',
    fullName: 'Full Name *',
    emailAddress: 'Email Address *',
    phoneNumber: 'Phone Number',
    inquiryType: 'Inquiry Type',
    optGeneral: 'General Clinical Question',
    optAppointment: 'Appointment Scheduling',
    optDispensary: 'Herbal Apothecary & Remedies',
    optTelehealth: 'Telehealth Video Review',
    messageLabel: 'Message *',
    messagePlaceholder: 'Outline your question or preferred consultation time...',
    submitBtn: 'Submit Inquiry',
    sendingBtn: 'Sending...',
    kabulLocations: 'Kabul Locations',
    clinicAddrTitle: 'Clinic Address',
    regOfficeTitle: 'Registered Office',
    bookOutpatientBtn: 'Book Outpatient Consultation',
    hoursRuleTitle: 'Clinic Hours & Walk-In Rule',
    hoursRuleDesc:
      'Pre-booked patients receive priority consultation slots; walk-ins are seen in order of arrival between scheduled consultations.',
    channelsKicker: 'Clinic Channels',
    followPrefix: 'Follow',
  },
  symptoms: {
    kicker: 'Interactive Botanical Guide',
    title: 'Match Symptoms to Clinic Formulations',
    subtitle:
      'Select an outpatient focus area to review classical herbs, recommended consultation paths, and targeted remedies.',
    protocolSummary: 'Protocol Summary',
    keyBotanicals: 'Key Botanicals',
    recommendedVisit: 'Recommended Visit',
    bookBtn: 'Book',
    dispensaryFormulations: 'Dispensary Formulations',
    scheduleEvalBtn: 'Schedule Clinical Evaluation',
    pageBadge: 'Interactive Botanical Diagnostician & Triage Portal',
    pageHeading: 'Symptom Checker &',
    pageAccent: 'Targeted Herbal Regimens',
    pageSub:
      'Select your health challenge to explore classical Unani humoral analysis (Mizaj), evidence-informed botanical remedies, and recommended clinic consultations.',
    nonInvasiveBadge: 'Non-Invasive Supportive Guidance',
    formulatedByBadge: 'Formulated by Dr. Hafizullah Safi',
    clinicalProfilePrefix: 'Clinical Profile:',
    unaniContext:
      'In traditional Unani phytotherapy, this presentation indicates an imbalance in humoral constitution (Akhlat). Treatment aims to calm inflamed tissue, eliminate stagnant buildup, and support Tabiat (innate healing vitality).',
    recommendedConsult: 'Recommended Consultation',
    bookThisVisit: 'Book This Visit',
    targetedCompounds: 'Targeted Botanical Compounds',
    personalizedRegimen: 'Personalized Botanical Regimen',
    regimenDesc:
      'Compound preparation using pure organic cold-pressed plant extracts, soothing tisanes, and Unani Mizaj restorative guidance to support vitality.',
    typicalWindow: 'Typical restorative window: 3 to 6 weeks',
    compoundedRemediesKicker: 'Compounded Remedies',
    targetedProductsFor: 'Targeted Products for',
    viewFullDispensary: 'View Full Dispensary',
    dossierBtn: 'Dossier',
    mizajSectionKicker: 'Unani Constitutional Principles',
    mizajSectionTitle: 'Understanding Your Mizaj (Temperament)',
    mizajSectionSub:
      'In Greco-Arab medicine, every individual possesses a distinctive constitutional balance. Matching herbs to your humoral qualities ensures optimal support.',
    unaniPillarBadge: 'Unani Pillar',
    signsLabel: 'Signs:',
    balancingLabel: 'Balancing Botanicals:',
    mizajGuides: [
      {
        mizaj: 'Dam (Sanguine / Hot & Moist)',
        qualities:
          'Warm body, active digestion, ruddy complexion, prone to arterial pressure & metabolic heat',
        herbs: 'FloraSoothe Spearmint, Hibiscus, Coriander seed infusion',
      },
      {
        mizaj: 'Safra (Choleric / Hot & Dry)',
        qualities:
          'Sharp pulse, irritability, acid reflux, prone to skin heat & hepatic sensitivity',
        herbs: 'Pure Neem restorative salve, Licorice root, Rose petal cold extract',
      },
      {
        mizaj: 'Balgham (Phlegmatic / Cold & Moist)',
        qualities:
          'Sluggish circulation, morning heaviness, mucus congestion & fluid retention',
        herbs: 'Himalayan Shilajit pitch, Ginger root decoction, Black Seed oil',
      },
      {
        mizaj: 'Sawda (Melancholic / Cold & Dry)',
        qualities:
          'Overthinking, broken sleep, dry joints, nervous tension & digestive spasm',
        herbs: 'Saffron & KSM-66 Ashwagandha tonic, Chamomile blossoms, Sweet almond oil',
      },
    ],
    ctaTitle: 'Need a Professional Clinical Assessment?',
    ctaSub:
      'Book an in-person diagnostic evaluation with Dr. Hafizullah Safi at Main Airport Road, Charahi Shaheed in Kabul, or schedule a telehealth visit.',
    scheduleAssessment: 'Schedule Clinical Assessment',
    whatsappTriage: 'WhatsApp Direct Triage: +93 780 299 299',
  },
  testimonials: {
    kicker: 'Patient Stories & Clinical Outcomes',
    heading: 'Patient Experiences & Documented Progress',
    sub: 'Observational outpatient feedback from patients treated at Safi Natural Care Clinic in Kabul.',
    allStories: 'All Stories',
    verifiedPatient: 'Verified Patient',
    progressLabel: 'Progress',
    conditionLabel: 'Condition:',
    clinicianLabel: 'Clinician:',
    lookingForCare: 'Looking for Personalized Clinical Care?',
    bookVisit: 'Book Visit',
    pageBadge: 'Documented Clinical Outcomes & Patient Stories',
    pageTitle: 'Patient Recovery Stories &',
    pageAccent: 'Clinical Evidence',
    pageSub:
      'Real experiences from patients treated at Safi Natural Care Clinic in Kabul and via our telehealth service. Every case reflects ethical, non-invasive herbal care.',
    statSatisfaction: 'Average Satisfaction',
    statRelief: 'Significant Relief Rate',
    statPatients: 'Patients Treated',
    statNatural: 'Natural Botanical Rx',
    shareKicker: 'Patient Community Voice',
    shareTitle: 'Share Your Healing Journey',
    shareSub:
      'Has Safi Natural Care Clinic helped restore your health? Your feedback helps others explore ethical natural healthcare.',
    submittedTitle: 'Thank You for Sharing Your Experience',
    submittedBody:
      "Your story has been submitted to Dr. Hafizullah Safi's clinical review board.",
    nameLabel: 'Your Full Name / Initials',
    cityLabel: 'City / Country',
    condLabel: 'Health Condition Treated',
    docLabel: 'Attending Practitioner',
    storyLabel: 'Your Recovery Story & Outcome',
    storyPlaceholder:
      'Describe your symptoms before treatment, the herbal protocol used, and how you felt over time...',
    submitStoryBtn: 'Submit Clinical Feedback for Verification',
    ctaTitle: 'Begin Your Personalized Recovery Journey',
    ctaSub:
      'Book an appointment with our clinical team in Kabul or schedule an online video consultation.',
    bookNowBtn: 'Book Consultation Now',
    exploreTreatmentsBtn: 'Explore All Treatments & Pricing',
  },
  blog: {
    badge: 'The Safi Materia Medica & Remedies Journal',
    title: 'Herbal Remedies, Clinical Monographs & Phytotherapy',
    subtitle:
      'Evidence-based botanical insights, traditional Unani-Tibb home preparation recipes, and medicinal guides written by our clinical herbalists in Kabul.',
    pharmKicker: 'Traditional Pharmacopeia',
    pharmTitle: 'Home Formulations You Can Prepare',
    pharmSub:
      'Time-honored preparation recipes recorded in classical Unani-Tibb pharmacopeia for everyday wellness.',
    indicationLabel: 'Indication:',
    ingredientsLabel: 'Ingredients:',
    methodLabel: 'Method:',
    wantPersonalized: 'Want personalized botanical protocols specific to your constitution?',
    scheduleBtn: 'Schedule a Clinical Consultation',
    disclaimerTitle: 'Clinical Phytotherapy & Education Disclaimer',
    disclaimerBody:
      'Educational monographs are intended for informational and self-care education and do not replace medical diagnosis. Consult your practitioner if pregnant, nursing, or taking prescription medications.',
  },
  portal: {
    badge: 'Secure Patient Health Records',
    title: 'Patient Health History & Dispensary Records',
    subtitle:
      'Access your confidential consultation history, personalized Unani herbal protocols, dosage schedules, and dispensary orders at Safi Natural Care Clinic.',
    signInTitle: 'Verified Patient Sign-In',
    signInSub: 'End-to-End Encrypted Cloud Health Records',
    signInDesc:
      'Sign in with your verified account to review your full clinical dossiers, track daily botanical regimens prescribed by Dr. Hafizullah Safi, and manage refills.',
    signInBtn: 'Sign In With Verified Google Account',
    lookupTitle: 'Instant Appointment Lookup',
    lookupHeading: 'Find Your Visit by Reference',
    lookupSub: 'Enter your appointment booking reference (e.g. SNC-XXXXXX) or patient phone number.',
    searchAptBtn: 'Search Appointment',
    tabProtocols: 'Recommended Herbal Protocols',
    tabAppointments: 'Clinical Consultations',
    tabOrders: 'Dispensary Purchase History',
    tabMizaj: 'Unani Temperament & Humors',
    bookConsultBtn: 'Book Consultation',
    signOutBtn: 'Sign Out',
    doseLoggedMsg: 'Dose logged successfully! Daily adherence updated.',
  },
  posAdmin: {
    posKicker: 'Safi Natural Care Clinic · Front Desk & Pharmacy',
    posTitle: 'POS Pharmacy & Patient QR Triage',
    posSub:
      "Scan dispensary medicine barcodes for instant POS checkout or scan a patient's SNC-PAT QR identity card to pull their dossier and log arrival.",
    viewLedgerBtn: 'View Accounting Ledger',
    tabPos: 'Pharmacy POS & Bottle Scanner',
    tabTriage: 'Patient CRM & QR Identity Triage',
    adminKicker: 'Safi Natural Care Clinic · Executive Operations',
    adminTitle: 'Clinical Accounting & Inventory Console',
    adminSub:
      'Live P&L analytics across Kabul outpatient consultations and dispensary sales, automated COGS ledgering, stock monitoring, and site settings.',
    openPosBtn: 'Open POS & QR Triage',
    tabAccounting: 'Financial Analytics & Ledger',
    tabMoa2009: 'Accounting 2009 Suite',
    tabInventory: 'Inventory & Restock Alerts',
    tabSettings: 'Social & Overhead Settings',
  },
  chatbot: {
    askButton: 'Ask Hakim AI',
    title: 'Hakim AI Companion',
    subtitle: 'Safi Natural Care Clinic · Kabul',
    welcomeMsg:
      'Salam and welcome to Safi Natural Care Clinic. How can I assist your health journey today? Ask about Unani temperament (Mizaj), herbal remedies, or our Kabul clinic.',
    placeholder: 'Ask about remedies, temperament, or treatments...',
    searchBtn: 'Search',
    mapsBtn: 'Maps',
    thinking: 'Hakim Assistant is analyzing clinical botanicals...',
    quickPrompts: [
      {
        label: 'Balance Safrawi Mizaj',
        prompt: 'What herbal remedies balance a hot and dry (Safrawi) temperament?',
      },
      {
        label: 'Kabul Clinic Visit',
        prompt: 'How do I visit Safi Natural Care Clinic in Kabul, Afghanistan?',
      },
      {
        label: 'Herb-Drug Safety',
        prompt: 'Can I take Black Seed oil while on blood pressure medication?',
      },
    ],
  },
  footer: {
    pagesHeading: 'Clinic Pages',
    addressesHeading: 'Kabul Addresses & Hours',
    clinicLabel: 'Clinic:',
    regOfficeLabel: 'Registered Office:',
    phoneWhatsappLabel: 'Phone & WhatsApp',
    updatesHeading: 'Clinic Updates',
    updatesSub: 'Seasonal Unani dietary notes and apothecary updates from Dr. Hafizullah Safi.',
    emailPlaceholder: 'Enter your email',
    subscribeBtn: 'Subscribe',
    subscribedMsg: 'Subscribed to clinic updates.',
    scopeSafetyLabel: 'Scope & Safety:',
    copyrightPrefix: 'Kabul, Afghanistan',
  },
  servicesMap: {
    'srv-comprehensive': {
      title: 'Master Herbal & Unani Consultation',
      duration: '60 minutes',
      category: 'General',
      description:
        'Complete diagnostic evaluation of your pulse, tongue indicators, medical history, and constitutional temperament (Mizaj) with a personalized herbal and dietary plan.',
      suitableFor: [
        'Complex multi-system symptoms',
        'Digestive, hormonal, or metabolic imbalance',
        'Root-cause preventive care',
      ],
      treatmentIncludes: [
        '60-minute diagnostic consultation with Dr. Hafizullah Safi',
        'Unani Mizaj & temperament assessment',
        'Tailored herbal protocol & nutrition guide',
        'Dispensary prescription & safety review',
      ],
    },
    'srv-digestive': {
      title: 'Digestive & Metabolic Care Consultation',
      duration: '50 minutes',
      category: 'Chronic Care',
      description:
        'Targeted botanical and Unani dietary plans for reflux, abdominal bloating, sluggish motility, and metabolic imbalance.',
      suitableFor: ['Acid reflux & gastritis', 'Bloating & irregular motility', 'Liver & metabolic sluggishness'],
      treatmentIncludes: [
        'Digestive & hepatic temperament review',
        'Herbal bitter & demulcent dosing schedule',
        'Practical meal timing & food synergy chart',
      ],
    },
    'srv-pain-arthritis': {
      title: 'Musculoskeletal, Joint & Acupuncture Therapy',
      duration: '50 minutes',
      category: 'Chronic Care',
      description:
        'Non-invasive botanical compresses, topical analgesic balms, and supportive traditional acupuncture for stiff joints, back discomfort, and muscle tension.',
      suitableFor: ['Knee & joint stiffness', 'Lower back & neck tension', 'Traditional acupuncture support'],
      treatmentIncludes: [
        'Joint mobility & inflammatory assessment',
        'Topical herbal compress & internal protocol',
        'Optional non-invasive acupuncture session',
      ],
    },
    'srv-stress-sleep': {
      title: 'Stress, Sleep & Lifestyle Counseling',
      duration: '45 minutes',
      category: 'Vitality',
      description:
        'Naturopathic nervous-system recovery combining calming nervines, adaptogenic tonics, and practical sleep-hygiene restructuring.',
      suitableFor: ['Broken sleep & restlessness', 'Chronic work stress', 'Mental fatigue'],
      treatmentIncludes: [
        'Circadian & stress habit evaluation',
        'Targeted evening botanical drop schedule',
        'Personalized nutrition & breathwork guide',
      ],
    },
    'srv-skin': {
      title: 'Therapeutic Skin & Hair Care Consultation',
      duration: '45 minutes',
      category: 'Specialized',
      description:
        'Non-cosmetic therapeutic care for dry, irritated dermis and scalp discomfort pairing internal herbal cleansing with protective botanical salves.',
      suitableFor: ['Chronic dry or reactive skin', 'Scalp & hair thinning support', 'Barrier recovery'],
      treatmentIncludes: [
        'Digestive-skin axis review',
        'Topical botanical balm guidance',
        'Internal detox & lipid nutrition plan',
      ],
    },
    'srv-hijama': {
      title: 'Hijama (Wet Cupping) & Traditional Acupuncture',
      duration: '60 minutes',
      category: 'Specialized',
      description:
        'Sterile single-use Unani cupping and non-invasive supportive acupuncture to ease chronic muscular stagnation and tension headaches.',
      suitableFor: ['Tension headaches & neck stiffness', 'Muscular stagnation', 'Preventive seasonal reset'],
      treatmentIncludes: [
        'Pre-session pulse & blood pressure check',
        '100% single-use sterile surgical cups or needles',
        'Black seed post-care balm & rest advice',
      ],
    },
    'srv-hormonal': {
      title: 'Hormonal & Reproductive Health Support',
      duration: '60 minutes',
      category: 'Specialized',
      description:
        'Constitutional herbal and lifestyle support for women’s hormonal equilibrium, cycle regularity, and male reproductive vitality.',
      suitableFor: ['Cycle irregularity & PMS', 'Perimenopausal shifts', 'Male vitality & fertility support'],
      treatmentIncludes: [
        'Endocrine & temperament case audit',
        'Personalized herbal formulation roadmap',
        'Seed-cycling & targeted mineral nutrition',
      ],
    },
    'srv-followup': {
      title: 'Follow-Up & Preventive Health Education',
      duration: '30 minutes',
      category: 'General',
      description:
        'Progress check-in to review symptom response, adjust herbal dosing, and reinforce preventive daily nutrition.',
      suitableFor: ['Returning clinic patients', 'Dose adjustments & refills', 'Preventive health check-ins'],
      treatmentIncludes: [
        'Symptom progress check',
        'Updated dosing schedule',
        'Dispensary refill authorization',
      ],
    },
  },
  productsMap: {},
  symptomsMap: {
    digestive: {
      name: 'Digestive & Metabolic',
      description: 'Acid reflux, bloating, sluggish digestion, or irregular motility.',
      recommendedHerbs: ['Marshmallow Root', 'Chamomile', 'Fennel Seed', 'Chicory (Kasni)'],
    },
    'pain-joints': {
      name: 'Joints & Musculoskeletal',
      description: 'Knee stiffness, back tension, or joint discomfort.',
      recommendedHerbs: ['Boswellia Serrata', 'Turmeric', 'Arnica', 'Acupuncture'],
    },
    'stress-sleep': {
      name: 'Stress & Sleep',
      description: 'Restless sleep, nervous tension, or daily burnout.',
      recommendedHerbs: ['Lemon Balm', 'Passionflower', 'KSM-66 Ashwagandha', 'Saffron'],
    },
    'hormonal-wellness': {
      name: 'Hormonal & Vitality',
      description: 'Cycle balance, endocrine fatigue, or male reproductive support.',
      recommendedHerbs: ['Vitex Berry', 'Shatavari', 'Himalayan Shilajit', 'Afghan Saffron'],
    },
    'skin-immunity': {
      name: 'Skin, Hair & Respiratory',
      description: 'Dry reactive skin, seasonal coughs, or preventive support.',
      recommendedHerbs: ['Sea Buckthorn', 'Neem & Calendula', 'Black Seed', 'Wild Thyme'],
    },
  },
};

const PS_DICT: LocalizedDictionary = {
  brand: {
    shortWordmark: 'صافی کلینیک',
    fullWordmark: 'صافی د سنتی طب کلینیک',
    clinicName: 'صافی د سنتی طب کلینیک',
    companyName: 'Safi Natural Care',
    companySubtitle: 'د بوټو روغتیا پالنه او طبیعی درملنه',
    cityCountry: 'کابل، افغانستان',
    foundedText: 'تاسیس اپریل ۲۰۲۶',
    mophShort: 'د عامې روغتیا وزارت TCIM',
    clinicAddress: 'د هوایي ډګر عمومي سړک، څلورلارې شهید، کابل، افغانستان',
    registeredOffice: 'لسمه ناحیه، قلعه فتح الله، کابل، افغانستان',
    hoursPolicy: 'لومړیتوب مخکینیو نوبتونو ته، ورپسې عادي مراجعین · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰',
    tagline: 'بوټاني طب · یوناني طب · طبیعی درملنه',
    founderName: 'ډاکتر حفیظ الله صافی',
    founderTitle: 'بنسټ ایښودونکی او عمومي رییس · Safi Natural Care',
    founderBio:
      'په کابل کې د صافی د سنتي طب کلینیک بنسټ ایښودونکی او مدیر ډاکتر حفیظ الله صافی د ناروغانو د خوندیتوب له روښانه معیارونو سره سم د بوټاني طب، یوناني مزاج تشخیص، ناتوروپتي او سنتي طبابت خدمتونه رهبري کوي.',
    overview:
      'صافی د سنتي طب کلینیک په کابل کې یو سراپا (خارج بستر) روغتیایي مرکز دی چې د بوټاني طب، یوناني طب او طبیعی درملنې له لارې خوندي او اخلاقي طبي خدمتونه وړاندې کوي.',
    vision:
      'د خوندي، اخلاقي او پر شواهدو ولاړ سنتي طب له لارې د ټولنې روغتیا ته وده ورکول.',
    mission: [
      'لاس رسي وړ بوټاني، یوناني او طبیعی سراپا طبي خدمات وړاندې کول',
      'د ناروغ خوندیتوب، باخبره رضایت او صادقانه طبي حدودو ته درناوی کول',
    ],
    legalStatement:
      'صافی د سنتي طب کلینیک د افغانستان د عامې روغتیا وزارت د مقرراتو په چوکاټ کې د تکمیلي سنتي طب په توګه فعالیت کوي او د بیړني یا عصري طبي درملنې بدیل نه دی.',
    epigraphTranslation: 'او کله چې زه ناروغ شم، نو همغه ماته شفا راکوي (الشعراء ۲۶:۸۰)',
  },
  nav: {
    home: 'کورپاڼه',
    treatments: 'درملنې',
    shop: 'درملتون',
    about: 'زموږ په اړه',
    contact: 'اړیکه',
    portals: 'برخې',
    portalsTitle: 'د کلینیک برخې او عملیات',
    booking: 'د نوبت اخیستل',
    bookingDesc: 'حضوري یا آنلاین معاینه وټاکئ',
    patientPortal: 'د ناروغ پورتال',
    patientPortalDesc: 'نوبتونه، نسخې او فرمایشونه',
    symptomChecker: 'د نښو ارزونه',
    symptomCheckerDesc: 'یوناني مزاج او بوټاني لارښود',
    testimonials: 'د ناروغانو کیسې',
    testimonialsDesc: 'ثبت شوې روغتیايي پایلې',
    blog: 'د درملو ژورنال',
    blogDesc: 'علمي لیکنې او کورنۍ نسخې',
    posTriage: 'POS او QR تریاژ',
    posTriageDesc: 'د درملتون بارکوډ او د ناروغ ثبت',
    admin: 'اداره او محاسبه',
    adminDesc: 'د حسابدارۍ دفتر، ګدام او تنظیمات',
    signIn: 'ننوتل',
    signOut: 'وتل',
    healthHistory: 'روغتیايي تاریخچه او نسخې',
    myConsultations: 'زما معاینات',
    bookVisit: 'نوبت واخلئ',
    bookAppointment: 'نوبت ثبت کړئ',
    activeLabel: 'فعال',
    openCartAria: 'د پیرود سبد خلاص کړئ',
    toggleMenuAria: 'غورنۍ خلاص یا بند کړئ',
    switcherAria: 'ژبه وټاکئ',
    currencyAria: 'اسعار وټاکئ',
    currencyLabel: 'اسعار',
  },
  mobileBar: {
    callDesk: 'زنګ ووهئ',
    treatments: 'درملنې',
    bookVisit: 'نوبت',
    shop: 'درملتون',
    cart: 'سبد',
  },
  hero: {
    headlineTop: 'سنتي او بوټاني طب،',
    headlineAccent: 'پر کلینیکي پاملرنې ولاړ.',
    welcomePrefix: 'ښه راغلاست',
    directedByPrefix: 'تر مشرۍ لاندې د',
    descriptionSuffix:
      'زموږ د کابل کلینیک په اخلاقي ډول بوټاني، یوناني، طبیعی درملنه او غیر جراحي سنتي طبابت وړاندې کوي.',
    scheduleCta: 'معاینه وټاکئ',
    dispensaryCta: 'د بوټو درملتون',
    modalitiesCount: '۳ طبي سیستمونه',
    modalitiesDesc: 'بوټاني، یوناني مزاج او ناتوروپتي',
    formulasCount: '۹ تخصصي کټګورۍ',
    formulasDesc: 'بشپړ کلینیکي بوټاني درملتون',
    lookingForGuide: 'د خوړو او درملو لارښود غواړئ؟',
    remedyGuideLink: 'د درملو لارښود',
  },
  home: {
    systemsKicker: 'د درملنې درې بنسټونه',
    systemsHeading: 'بوټاني طب · یوناني طب · طبیعی درملنه',
    founderProfileLink: 'د بنسټ ایښودونکي او کلینیک پروفایل',
    servicesKicker: 'سراپا کلینیکي خدمتونه · کابل',
    servicesHeading: 'د درملنې اساسي برخې',
    allFeesLink: 'د معایناتو فیسونه او پلانونه',
    dispensaryKicker: 'د صافی بوټاني درملتون',
    dispensaryHeading: 'ځانګړي ترکیب شوي درمل',
    browseCategoriesLink: 'ټولې ۹ کټګورۍ وګورئ',
    detailsBtn: 'جزییات',
    addBtn: 'اضافه',
    fullTriageLink: 'د نښو او مزاج بشپړه ارزونه',
    insideClinicKicker: 'د صافی کلینیک دننه',
    insideClinicHeading: 'د کابل کلینیک او رسمي پروفایل',
    insideClinicBody:
      'د ناروغ هره دوسیه، غذایي پلان او بوټاني نسخه د روغتیا وزارت له اصولو سره سم په بشپړ خوندیتوب ثبتیږي.',
    viewGalleryBtn: 'بشپړ ګالري وګورئ',
    documentsWord: 'سندونه',
    journalKicker: 'علمي ژورنال',
    journalHeading: 'بوټاني یادښتونه او غذایي لارښوونې',
    allArticlesBtn: 'ټولې مقالې',
    readBtn: 'لوستل',
    portalKicker: 'د ناروغانو د معلوماتو پورتال',
    portalHeading: 'خپلې معاینې، نسخې او د درملتون فرمایشونه وګورئ',
    portalBody:
      'خپل حساب ته ننوځئ ترڅو د درملو مهالویش او د تېرو معایناتو تاریخچه وګورئ.',
    portalBtn: 'د ناروغ پورتال',
    allStoriesLink: 'د ناروغانو ټولې کیسې',
    ctaHeading: 'حضوري یا آنلاین ویډیوي معاینه وټاکئ',
    callWhatsappPrefix: 'زنګ / واټساپ:',
    closeGalleryAria: 'ګالري بند کړئ',
  },
  systems: [
    {
      code: 'HM.',
      title: 'بوټاني طب (Phytotherapy)',
      tagline: 'بوټاني درملنه',
      description:
        'خالص طبي بوټي او مستند ترکیبونه چې د فزیولوژیکي خوندیتوب او لوړ کیفیت له مخې چمتو کیږي.',
      principles: [
        'د فیتوتراپي اصولو پر بنسټ د بوټو درمل جوړول',
        'د بوټو دقیقه پیژندنه او خوندي اندازه',
        'له زهرجنو او ناپاکو موادو بشپړ پاکوالی',
      ],
    },
    {
      code: 'UN.',
      title: 'یوناني طب (Unani Medicine)',
      tagline: 'مزاج او غذایي درملنه',
      description:
        'د مزاج کلاسیک تشخیص او غذایي رژیمونه چې د بدن اخلاط او طبیعي توازن بېرته سموي.',
      principles: [
        'د مزاج (ساختاري طبیعت) دقیقه ارزونه',
        'د بوټو او خوړو له لارې د اخلاطو توازن',
        'د طبیعت (د بدن د شفابخش ځواک) پیاوړتیا',
      ],
    },
    {
      code: 'NA.',
      title: 'طبیعي درملنه (Naturopathy)',
      tagline: 'د ژوند طرز او تغذیه',
      description:
        'د ژوند طرز، خوب او سالمې تغذیې عملي لارښوونې چې پرته له جراحۍ طبیعي رغښت پیاوړی کوي.',
      principles: [
        'د هر شخص لپاره ځانګړې غذایي او د ژوند طرز مشوره',
        'غیر جراحي او د ورځنیو عادتونو سره برابره پاملرنه',
        'له عصري طب سره همغږې تکمیلي لارښوونې',
      ],
    },
  ],
  scopeOfServices: [
    {
      code: 'HM.',
      title: 'هاضمې او میتابولیک ستونزې',
      category: 'هاضمه او معده',
      description: 'د تیزابیت، پړسوب، سستې هاضمې او میتابولیک توازن لپاره مرستندویه درملنه.',
    },
    {
      code: 'UN.',
      title: 'د عضلاتو او بندونو دردونه',
      category: 'بندونه او حرکت',
      description: 'د بندونو د سختوالي او درد کمولو لپاره بوټاني ضمادونه او مرستندویه ملمونه.',
    },
    {
      code: 'NA.',
      title: 'مزمن فشار، بې خوبي او عصبي ستړیا',
      category: 'فشار او خوب',
      description: 'د اعصابو آراموونکي بوټي، د خوب د ساعت تنظیم او د ژوند طرز عملي مشورې.',
    },
    {
      code: 'HM.',
      title: 'هورموني او د تناسلي روغتیا ملاتړ',
      category: 'هورموني توازن',
      description: 'د میاشتني عادت د توازن او نارینه او ښځینه روغتیا لپاره طبیعي پروګرامونه.',
    },
    {
      code: 'UN.',
      title: 'تنفسي او بولی پاملرنه',
      category: 'سږي او پښتورګي',
      description: 'نرموونکي شربتونه، موسمي تنفسي ملاتړ او د پښتورګو پاکوونکي بوټاني څاڅکي.',
    },
    {
      code: 'NA.',
      title: 'د پوستکي او ویښتانو درملنه (غیر سینګاري)',
      category: 'طبي پوستکی',
      description: 'د وچ پوستکي، حساسیت او د سر د پوستکي پیاوړتیا لپاره داخلي او بهرنۍ پاملرنه.',
    },
    {
      code: 'NA.',
      title: 'عمومي روغتیا او وقایوي زده کړه',
      category: 'وقایوي طب',
      description: 'د کورنیو لپاره د مزاج پر بنسټ تغذیه او موسمي وقایوي عادتونه.',
    },
    {
      code: 'AC.',
      title: 'سنتي طب سوزني (غیر جراحي ملاتړ)',
      category: 'اکوپنکچر',
      description: 'د موضعي دردونو، سر درد او رغښت لپاره غیر تهاجمي سنتي مرستندویه درملنه.',
    },
  ],
  safetyEthics: [
    {
      title: 'د ناروغ خوندیتوب',
      desc: 'د روغتیا بشپړې تاریخچې کتنه، دقیق کلینیکي معاینه او د اړتیا په وخت عصري ډاکټر ته رجعت.',
    },
    {
      title: 'مسلکي اخلاق',
      desc: 'له مبالغې او بې اساسه ژمنو ډډه؛ د ناروغ له کرامت سره سمه صادقانه مشوره.',
    },
    {
      title: 'باخبره رضایت',
      desc: 'د سنتي درملنې د حدودو، اټکل شوي وخت او امکاناتو روښانه تشریح.',
    },
    {
      title: 'کلینیکي اسناد',
      desc: 'منظمې طبي دوسیې، د QR له لارې تعقیب او دوامداره پاملرنه.',
    },
  ],
  treatments: {
    headerTitle: 'سراپا سنتي او تکمیلي کلینیکي پاملرنه',
    headerSubtitle:
      'هره معاینه ستاسو د مزاج له مخې چمتو کیږي چې یوناني طب، فیتوتراپي، ناتوروپتي او غیر جراحي ملاتړ سره یوځای کوي.',
    mophBadge: 'د عامې روغتیا وزارت TCIM اصول',
    scopeKicker: 'د فعالیت ساحه',
    scopeHeading: '۸ سراپا کلینیکي خدمتونه',
    scopeSub: 'د مزمنو او وظیفوي ستونزو لپاره غیر تهاجمي او وقایوي پاملرنه.',
    pillarsKicker: 'اساسي ارزونه',
    pillarsHeading: 'د تشخیص ۴ بنسټیز ستنې',
    pillarsSub: 'له نسخې ورکولو مخکې د هر ناروغ وضعیت په منظم کلینیکي ډول ارزیابي کیږي.',
    pillars: [
      {
        title: '۱. نبض (Pulse)',
        subtitle: 'د رګونو حیاتي ارزونه',
        desc: 'د غړو د قوت، داخلي تودوخې او د وینې جریان ارزولو لپاره د نبض معاینه.',
      },
      {
        title: '۲. مزاج (Temperament)',
        subtitle: 'د اخلاطو توازن',
        desc: 'د دموي، صفراوي، بلغمي او سوداوي مزاج ټاکل ترڅو دقیق خواړه او بوټي وټاکل شي.',
      },
      {
        title: '۳. ژبه (Lisan)',
        subtitle: 'د هاضمې نقشه',
        desc: 'د ژبې رنګ او رطوبت کتنه ترڅو د معدې تودوخه یا بندښت معلوم شي.',
      },
      {
        title: '۴. د درملو تداخل کتل',
        subtitle: 'د خوندیتوب معاینه',
        desc: 'د کیمیاوي درملو سره د بوټو د تداخل مخنیوي لپاره کلینیکي کتنه.',
      },
    ],
    directoryKicker: 'حضوري او آنلاین پروګرامونه',
    directoryHeading: 'د معایناتو کتابچه او فیسونه',
    directorySub: 'د هرې معاینې جزییات وګورئ او نېغ په نېغه نوبت ونیسئ.',
    allCat: 'ټول',
    catLabels: {
      All: 'ټول',
      General: 'عمومي',
      'Chronic Care': 'مزمنې ناروغۍ',
      Specialized: 'تخصصي',
      Vitality: 'اروايي او قوت',
    },
    feeLabel: 'د معاینې فیس',
    hideDetails: 'جزییات پټ کړئ',
    protocolDossier: 'بشپړ جزییات',
    bookVisit: 'نوبت ونیسئ',
    includesTitle: 'په دې معاینه کې شامل دي',
    indicationsTitle: 'اساسي نښې او ناروغۍ',
    prepTitle: 'د ناروغ چمتووالی',
    prepNotes: [
      'له معاینې ۲ ساعته مخکې له درنو خوړو او قهوې ډډه وکړئ.',
      'د لابراتوار وروستي معاینات او د اوسنیو درملو لیست له ځان سره راوړئ.',
      'لومړیتوب نوبتونو ته، ورپسې عادي مراجعین · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰.',
    ],
    dispensaryNote: 'د کلینیک په دننه بوټاني درملتون کې سملاسي درمل چمتو کیږي.',
    schedulePrefix: 'نوبت واخلئ:',
    safetyBannerKicker: 'د ناروغ خوندیتوب او تعقیم معیارونه',
    safetyBannerTitle: 'په کابل کې صادقانه او غیر جراحي پاملرنه',
    safetyBannerBody:
      'لومړیتوب نوبتونو ته دی · د هوایي ډګر عمومي سړک، څلورلارې شهید، کابل. یو ځل مصرف تعقیم وسایل او باوري بوټي.',
    bookConsultation: 'معاینه وټاکئ',
    faqKicker: 'د ناروغانو پوښتنې',
    faqHeading: 'عامې کلینیکي پوښتنې',
    faqs: [
      {
        q: 'یوناني تشخیص له عصري معایناتو څه توپیر لري؟',
        a: 'یوناني طب ټول بدن د مزاج (دم، صفرا، بلغم، سودا)، نبض او ژبې له مخې ارزوي ترڅو د بدن ذاتي شفابخش ځواک پیاوړی کړي.',
      },
      {
        q: 'په صافی کلینیک کې کوم طبي سیستمونه کارول کیږي؟',
        a: 'په کابل کې درې بشپړوونکي سیستمونه: بوټاني طب، یوناني طب او ناتوروپتي د سنتي اکوپنکچر ترڅنګ کارول کیږي.',
      },
      {
        q: 'آیا د ډاکټر له نورو درملو سره یوځای بوټاني درمل اخیستلی شم؟',
        a: 'هو، د ډاکټر حفیظ الله صافی تر کلینیکي څارنې لاندې ستاسو ټول درمل چک کیږي ترڅو منفي تداخل رامنځته نشي.',
      },
      {
        q: 'آیا یوازې په نوبت کار کوئ که پرته له نوبته هم راتللی شو؟',
        a: 'نوبت لرونکو ناروغانو ته لومړیتوب ورکول کیږي او ورپسې عادي مراجعین په نوبت سره کتل کیږي.',
      },
      {
        q: 'آیا ستاسو بوټاني درمل خوندي او پاک دي؟',
        a: 'هو، ټول بوټي له معتبرو سرچینو او پاکو شرایطو لاندې پرته له کیمیاوي یا زهرجنو موادو چمتو کیږي.',
      },
    ],
  },
  shop: {
    pageKicker: 'Safi Natural Care · بوټاني درملتون',
    pageTitle: 'بوټاني درمل او طبیعي ترکیبونه',
    pageSub:
      'په ۹ روغتیايي کټګوریو کې چمتو شوي خالص درمل — لکه صافی هورمون بالانس، صافی چیل او بیوتي ډراپس.',
    dispatchTitle: 'کابل او ارسال',
    dispatchSub: 'له ۶۰ ډالرو پورته وړیا ارسال · له کلینیک څخه لاس په لاس اخیستل',
    dispatchFreePrefix: 'وړیا ارسال له دې پورته:',
    dispatchFreeSuffix: '· له کلینیک څخه لاس په لاس اخیستل',
    promoTitle: 'د ناروغ د تخفیف کوډ',
    promoSubPrefix: 'له',
    promoSubSuffix: 'سره ۱۰٪ تخفیف ترلاسه کړئ',
    purityTitle: 'تضمین شوی خالصوالی',
    puritySub: 'له درنو فلزاتو او کیمیاوي موادو پاک',
    catalogKicker: '۹ کلینیکي کټګورۍ',
    catalogTitle: 'د صافی درملتون کتلوګ',
    catalogSub: 'د روغتیا د برخې له مخې فلټر کړئ یا د درملو نوم ولټوئ.',
    adviceBtn: 'د مزاج مشوره غواړئ؟',
    allCategory: 'ټول',
    searchPlaceholder: 'درمل ولټوئ (لکه Hormone Balance, Shilajit, Black Seed)...',
    formulationSingular: 'ترکیب',
    formulationPlural: 'ترکیبونه',
    sortFeatured: 'لومړی غوره درمل',
    sortRating: 'لوړې نمرې',
    sortPriceLow: 'بیه: له کم څخه زیات',
    sortPriceHigh: 'بیه: له زیات څخه کم',
    emptyTitle: 'ستاسو د لټون سره سم درمل ونه موندل شول',
    emptySub: 'بله کټګوري وټاکئ یا د لټون کلیمه پاکه کړئ.',
    showAllBtn: 'ټولې ۹ کټګورۍ وښایاست',
    inspectBtn: 'کتل',
    addBtn: 'اضافه',
    addedBtn: 'اضافه شو',
    outOfStock: 'ختم شوی',
    lowStock: 'کم پاتې',
    inStock: 'موجود دی',
    shareLabel: 'شریکول:',
    activeNomenclature: 'فعال بوټي او علمي نومونه',
    clinicalDosage: 'د کارولو طریقه:',
    addToCartTotal: 'سبد ته اضافه',
    reviewsWord: 'نظرونه',
    standardsKicker: 'د چمتو کولو معیارونه',
    standardsTitle: 'پاک استخراج او خوندي ساتنه',
    standards: [
      {
        title: 'معتبره سرچینه',
        desc: 'بوټاني عصارې او تېل د کلینیکي معیارونو لاندې په پاک چاپېریال کې چمتو کیږي.',
      },
      {
        title: 'روښانه لارښوونې',
        desc: 'علمي نومونه، دقیق خوراک او د احتیاط ټکي په روښانه ډول لیکل شوي دي.',
      },
      {
        title: 'تیاره شیشه یي بسته بندي',
        desc: 'د لمر له رڼا څخه په خوندي شیشو کې پرته له مصنوعی محافظه کوونکو موادو ساتل کیږي.',
      },
    ],
    unsureNote: 'نه پوهیږئ کوم درمل ستاسو له مزاج سره سمون لري؟ زموږ له طبي ټیم سره مشوره وکړئ.',
    bookConsultation: 'معاینه وټاکئ',
    productCategories: {
      "Women's Health & Hormonal Wellness": 'د ښځو روغتیا او هورموني توازن',
      'Male Wellness & Fertility': 'د نارینه وو قوت او روغتیا',
      'Digestive & Gastrointestinal Wellness': 'هاضمه او د معدې روغتیا',
      'Stress, Sleep & Neurological Wellness': 'فشار، خوب او عصبي آرامښت',
      'Bone, Joint & Pain Management': 'هډوکي، بندونه او د درد کنټرول',
      'Kidney & Urinary Wellness': 'پښتورګي او بولی لارې',
      'Cardiometabolic Wellness': 'زړه او میتابولیزم',
      'Liver & Detox Wellness': 'ځیګر او د بدن پاکوالی',
      'Immunity & General Wellness': 'معافیت او عمومي روغتیا',
    },
  },
  cart: {
    title: 'د درملتون سبد',
    itemsInBasket: 'توکي په سبد کې',
    freeShippingUnlocked: 'وړیا ارسال فعال شو!',
    addMorePrefix: 'د وړیا ارسال لپاره',
    addMoreSuffix: 'نور اضافه کړئ',
    emptyTitle: 'ستاسو سبد تش دی',
    emptySub: 'زموږ د ډاکټرانو له خوا ترکیب شوي خالص بوټاني درمل وګورئ.',
    browseBtn: 'درملتون وګورئ',
    promoPlaceholder: 'د تخفیف کوډ (لکه HERBAL10)',
    applyBtn: 'تطبیق',
    promoSuccess: 'د تخفیف کوډ په بریالیتوب تطبیق شو!',
    promoInvalid: 'ناسم کوډ. د ۱۰٪ تخفیف لپاره HERBAL10 وکاروئ.',
    subtotal: 'مجموعه',
    discount: 'تخفیف',
    shipping: 'د ارسال لګښت',
    freeLabel: 'وړیا',
    tax: 'اټکل شوې مالیه (۵٪)',
    total: 'وروستۍ بیه',
    checkoutBtn: 'خوندي تادیې ته لاړ شئ',
    sslNote: 'د صافی درملتون خوندي او رمز شوې تادیه',
  },
  checkout: {
    step1Kicker: 'د درملتون ارسال · ۱ له ۲ پړاو',
    step1Title: 'د سپارلو پته او اړیکه',
    recipientName: 'د ترلاسه کوونکي بشپړ نوم *',
    emailLabel: 'د تعقیب لپاره برېښنالیک *',
    addressLabel: 'بشپړه پته او کوڅه *',
    cityLabel: 'ښار *',
    postalLabel: 'پوستي کوډ',
    phoneLabel: 'د اړیکې شمېره *',
    orderTotalLabel: 'ټول فرمایش',
    itemsWord: 'توکي',
    freeShippingApplied: 'وړیا ارسال تطبیق شو',
    standardShipping: 'عادي ارسال',
    continuePayment: 'تادیې ته دوام ورکړئ',
    step2Kicker: 'خوندي تادیه · ۲ له ۲ پړاو',
    step2Title: 'د تادیې طریقه وټاکئ',
    cardMethod: 'بانکي کارت',
    cardSub: 'Visa, MC, Amex',
    codMethod: 'له کلینیک اخیستل / نقدي',
    codSub: 'د سپارلو پر مهال تادیه',
    cardNumber: 'د کارت شمېره',
    expiryDate: 'د پای نېټه',
    cvcLabel: 'امنيتي کوډ (CVC)',
    codTitle: 'د سپارلو پر مهال نقدي تادیه:',
    codNote: 'تاسو کولی شئ خپل مهر شوي درمل وګورئ او لګښت یې په نغدي ډول ورکړئ.',
    totalToPay: 'اوسنی د تادیې مبلغ:',
    verifiedSafe: 'تضمین شوی خوندیتوب',
    backAddress: 'بېرته پتې ته',
    confirmOrder: 'فرمایش تایید او ثبت کړئ',
    orderConfirmedBadge: 'فرمایش تایید شو',
    thankYouTitle: 'له صافی کلینیک څخه ستاسو مننه',
    thankYouSub: 'ستاسو فرمایش اوس د بوټاني معیارونو له مخې چمتو کیږي.',
    orderRefLabel: 'د فرمایش شمېره:',
    recipientSummary: 'ترلاسه کوونکی:',
    deliverySummary: 'د سپارلو پته:',
    estDelivery: 'د سپارلو اټکل شوی وخت:',
    estDeliveryVal: '۲ تر ۴ کاري ورځې',
    totalPaid: 'ورکړل شوې بیه:',
    continueExploring: 'کلینیک ته بېرته ستنېدل',
  },
  quickView: {
    dossierTitle: 'د درملو علمي دوسیه',
    closeAria: 'کړکۍ بند کړئ',
    addToCart: 'سبد ته اضافه کړئ',
    addedNotice: 'سبد ته اضافه شو!',
    keyActives: 'اساسي بوټاني ترکیبات',
    suggestedUse: 'د کارولو لارښوونه',
  },
  booking: {
    pageTitle: 'خپل کلینیکي نوبت ثبت کړئ',
    pageSub:
      'په کابل کې د هوایي ډګر سړک، څلورلارې شهید کې له ډاکټر حفیظ الله صافی سره حضوري یا آنلاین ویډیوي معاینه وټاکئ.',
    telehealthBadge: 'آنلاین ویډیوي معاینه شته',
    confidentialBadge: 'د ناروغ د معلوماتو محرمیت',
    tabPatient: 'د نوبت ثبتولو لارښود',
    tabStaff: 'د کارکوونکو عمومي جنتري',
    tabLookup: 'د نوبت پلټنه',
    policyTitle: 'د نوبتونو او عادي مراجعینو اصول',
    policyDesc: 'لومړیتوب مخکینیو نوبتونو ته ورکول کیږي، ورپسې عادي مراجعین کتل کیږي.',
    recordsTitle: 'پخواني طبي اسناد راوړئ',
    recordsDesc: 'د لابراتوار پایلې او د اوسنیو درملو لیست راوړئ ترڅو د تداخل مخنیوی وشي.',
    fastTitle: 'له معاینې ۲ ساعته مخکې روژه',
    fastDesc: 'د نبض او ژبې دقیق تشخیص لپاره ۲ ساعته مخکې له قهوې او درنو خوړو ډډه وکړئ.',
    lookupTitle: 'خپل ثبت شوی نوبت ومومئ',
    lookupSub: 'د نوبت شمېره (لکه SHC-8401)، تلیفون یا برېښنالیک ولیکئ.',
    lookupPlaceholder: 'لکه SHC-8401 یا +93 780 299 299',
    searchBtn: 'پلټل',
    confirmedLabel: 'نوبت تایید شوی',
    patientLabel: 'ناروغ',
    serviceLabel: 'خدمت',
    dateTimeLabel: 'نېټه او وخت',
    clinicianLabel: 'ډاکټر',
    noMatchPrefix: 'له دې معلوماتو سره نوبت ونه موندل شو:',
    noMatchSuffix: 'له استقبال سره په +93 780 299 299 اړیکه ونیسئ.',
    hotlineTitle: 'مستقیم استقبال او د عادي مراجعینو همغږي',
    callBtnPrefix: 'زنګ:',
    wizardSteps: ['خدمت او ډاکټر', 'نېټه او وخت', 'د ناروغ معلومات'],
    selectServiceTitle: '۱. کلینیکي خدمت وټاکئ',
    inclusionsLabel: 'په معاینه کې شامل دي:',
    feeLabel: 'د معاینې فیس',
    selectClinicianTitle: '۲. معالج وټاکئ',
    yearsPractice: 'کاله تجربه',
    modeLabel: 'د معاینې ډول:',
    inClinicTitle: 'حضوري معاینه',
    inClinicSub: 'څلورلارې شهید، کابل',
    telehealthTitle: 'آنلاین ویډیو',
    telehealthSub: 'لینک به په برېښنالیک درشي',
    proceedStep2: 'نېټې او وخت ته لاړ شئ',
    selectedProtocol: 'ټاکل شوې معاینه:',
    withPrefix: 'له',
    changeService: 'خدمت بدل کړئ',
    selectDateLabel: 'نېټه وټاکئ',
    availableSlotsLabel: 'موجود کلینیکي وختونه:',
    morningLabel: 'سهار',
    afternoonLabel: 'ماسپښین',
    backBtn: 'شاته',
    nextStep3: 'بل پړاو: د ناروغ معلومات',
    step3Badge: '۳ له ۳ پړاو',
    step3Title: 'د ناروغ مشخصات او روغتیايي حال',
    step3Privacy: 'ستاسو ټول روغتیايي معلومات د کلینیک په کچه محرم ساتل کیږي.',
    legalName: 'بشپړ نوم *',
    emailAddress: 'برېښنالیک *',
    phoneWhatsapp: 'تلیفون / واټساپ *',
    ageOptional: 'عمر (اختیاري)',
    concernsLabel: 'اصلي روغتیايي ستونزه *',
    concernsPlaceholder: 'خپلې نښې، موده او اوسني درمل ولیکئ...',
    firstTimeCheckbox: 'دا صافی کلینیک ته زما لومړنۍ مراجعه ده',
    dueAtVisit: 'د معاینې پر مهال',
    confirmReserveBtn: 'نوبت تایید او ثبت کړئ',
    aptConfirmedBadge: 'نوبت تایید شو',
    aptConfirmedTitle: 'ستاسو په تمه یو',
    recordedFor: 'تایید ثبت شو د دې لپاره:',
    refCode: 'د نوبت کوډ',
    locationLabel: 'ځای',
    arrivalNotesTitle: 'د کلینیک د راتګ لارښوونې',
    arrivalNotes: [
      'لومړیتوب نوبتونو ته ورکول کیږي، ورپسې عادي مراجعین · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰.',
      'د نبض دقیق تشخیص لپاره ۲ ساعته مخکې درانه خواړه مه خورئ.',
      'پخواني لابراتواري معاینات له ځان سره راوړئ.',
    ],
    downloadIcs: 'جنتري ډاونلوډ (.ics)',
    bookAnother: 'بل نوبت ثبت کړئ',
    alreadyBooked: 'آیا مخکې مو نوبت ثبت کړی دی؟',
    quickLookupPlaceholder: 'د نوبت کوډ یا تلیفون ولیکئ',
    lookupBtn: 'لټون',
    scheduleErrorMsg: 'مهرباني وکړئ نېټه او وخت دواړه وټاکئ.',
  },
  about: {
    leadershipKicker: 'مشرتابه · د بوټو روغتیا پالنه او طبیعی درملنه',
    clinicAddressLabel: 'د کلینیک پته',
    registeredOfficeLabel: 'ثبت شوی دفتر',
    bookWithFounder: 'له ډاکټر حفیظ الله صافی سره نوبت ونیسئ',
    viewServices: '۸ سراپا خدمتونه وګورئ',
    faithKicker: 'عقیده او شفا · سورة الشعراء ۲۶:۸۰',
    visionTitle: 'لیدلوری (Vision)',
    visionSubtitle: 'اخلاقي ټولنیزه روغتیا پالنه',
    missionTitle: 'ماموریت (Mission)',
    missionSubtitle: 'خوندیتوب او باخبره رضایت',
    safetyKicker: 'کلینیکي خوندیتوب او د روغتیا نړیوال سازمان اصول',
    mophKicker: 'د عامې روغتیا وزارت اطاعت',
    mophTitle: 'قانوني او د فعالیت ساحه',
    directDesk: 'مستقیمه شمېره:',
    archiveKicker: 'د کلینیک آرشیف او انځورونه',
    archiveTitle: 'رسمي اسناد او کلینیکي انځورونه',
    archiveSub: 'د لوی لیدلو لپاره پر هر انځور کلیک وکړئ.',
    gridLabel: 'ګریډ',
    projectorLabel: 'پروجیکټر',
    allRecords: 'ټول اسناد',
    inspectBtn: 'کتل',
    lightboxBtn: 'لوی لید',
    slideLabel: 'سلایډ',
    ofWord: 'له',
    teamKicker: 'طبي ټیم',
    teamTitle: 'رییس او کلینیکي پرسونل',
    yearsPractice: 'کاله تجربه',
    scheduleBtn: 'نوبت وټاکئ',
    bottomCtaTitle: 'په کابل کې زموږ کلینیک ته راشئ',
    bookClinicalBtn: 'کلینیکي معاینه وټاکئ',
    contactDeskBtn: 'له کلینیک سره اړیکه',
    closeBtn: 'بندول',
  },
  contact: {
    title: 'اړیکه او د کابل پتې',
    subtitle:
      'لومړیتوب نوبتونو ته، ورپسې عادي مراجعین · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰. د نوبتونو یا درملتون د معلوماتو لپاره له استقبال سره اړیکه ونیسئ.',
    phoneDeskTitle: 'د تلیفون مرکز (کابل)',
    callClinicBtn: 'زنګ ووهئ',
    whatsappTitle: 'د واټساپ مشورتي میز',
    whatsappSub: 'نوبتونه او د درملو پوښتنې',
    whatsappBtn: 'په واټساپ پیغام ولېږئ',
    emailsTitle: 'کلینیکي برېښنالیکونه',
    sendEmailBtn: 'برېښنالیک ولېږئ',
    websitesTitle: 'رسمي ویبپاڼې',
    openPortalBtn: 'ویبپاڼه پرانیزئ',
    inquiryKicker: 'آنلاین پوښتنه',
    inquiryTitle: 'زموږ استقبال ته پیغام واستوئ',
    inquirySub: 'د نوبتونو، یوناني مزاج ارزونې یا د بوټو درملو د شتون په اړه وپوښتئ.',
    receivedTitle: 'ستاسو پیغام ترلاسه شو',
    receivedBody: 'له صافی کلینیک سره د اړیکې مننه. زموږ همکاران به ډېر ژر درسره اړیکه ونیسي.',
    sendAnother: 'بل پیغام ولېږئ',
    fullName: 'بشپړ نوم *',
    emailAddress: 'برېښنالیک *',
    phoneNumber: 'تلیفون شمېره',
    inquiryType: 'د پوښتنې ډول',
    optGeneral: 'عمومي کلینیکي پوښتنه',
    optAppointment: 'د نوبت نیول',
    optDispensary: 'د بوټو درملتون',
    optTelehealth: 'آنلاین ویډیوي معاینه',
    messageLabel: 'پیغام *',
    messagePlaceholder: 'خپله پوښتنه یا د اړیکې مناسب وخت ولیکئ...',
    submitBtn: 'پیغام واستوئ',
    sendingBtn: 'لېږل کیږي...',
    kabulLocations: 'په کابل کې پتې',
    clinicAddrTitle: 'د کلینیک پته',
    regOfficeTitle: 'ثبت شوی دفتر',
    bookOutpatientBtn: 'سراپا معاینه وټاکئ',
    hoursRuleTitle: 'کاري ساعتونه او د راتګ اصول',
    hoursRuleDesc:
      'نوبت لرونکي ناروغان لومړیتوب لري او عادي مراجعین د راتګ د ترتیب له مخې کتل کیږي.',
    channelsKicker: 'ټولنیزې شبکې',
    followPrefix: 'تعقیب کړئ:',
  },
  symptoms: {
    kicker: 'متقابل بوټاني لارښود',
    title: 'نښې له کلینیکي درملو سره وتړئ',
    subtitle: 'یوه برخه وټاکئ ترڅو مناسب بوټي، اړوند معاینه او درمل وګورئ.',
    protocolSummary: 'د درملنې لنډیز',
    keyBotanicals: 'اساسي بوټي',
    recommendedVisit: 'وړاندیز شوې معاینه',
    bookBtn: 'نوبت',
    dispensaryFormulations: 'د درملتون ترکیبونه',
    scheduleEvalBtn: 'کلینیکي ارزونه وټاکئ',
    pageBadge: 'د نښو او یوناني مزاج لارښود',
    pageHeading: 'د نښو ارزونه او',
    pageAccent: 'مناسب بوټاني پروګرامونه',
    pageSub:
      'خپله روغتیايي ستونزه وټاکئ ترڅو یوناني اخلاط، باوري بوټي او مناسبه معاینه وګورئ.',
    nonInvasiveBadge: 'غیر جراحي او خوندي لارښود',
    formulatedByBadge: 'د ډاکټر حفیظ الله صافی له خوا ترتیب شوی',
    clinicalProfilePrefix: 'کلینیکي پروفایل:',
    unaniContext:
      'په یوناني طب کې دا نښې د اخلاطو د عدم توازن ښکارندویي کوي. موخه یې د التهاب کمول او د بدن ذاتي شفا (طبیعت) پیاوړي کول دي.',
    recommendedConsult: 'وړاندیز شوې معاینه',
    bookThisVisit: 'دا معاینه وټاکئ',
    targetedCompounds: 'مهم بوټاني ترکیبات',
    personalizedRegimen: 'شخصي شوی بوټاني پروګرام',
    regimenDesc: 'خالص یخ-پریس شوي تېل، بوټاني چای او د یوناني مزاج له مخې غذایي مشورې.',
    typicalWindow: 'عادي د رغښت موده: ۳ تر ۶ اونۍ',
    compoundedRemediesKicker: 'چمتو شوي درمل',
    targetedProductsFor: 'ځانګړي درمل د دې لپاره:',
    viewFullDispensary: 'بشپړ درملتون وګورئ',
    dossierBtn: 'جزییات',
    mizajSectionKicker: 'یوناني بنسټونه',
    mizajSectionTitle: 'خپل مزاج وپیژنئ',
    mizajSectionSub: 'په یوناني طب کې هر انسان ځانګړی مزاج لري چې درمل او خواړه باید ورسره برابر وي.',
    unaniPillarBadge: 'یوناني اصل',
    signsLabel: 'نښې:',
    balancingLabel: 'توازن کوونکي بوټي:',
    mizajGuides: [
      {
        mizaj: 'دم (ګرم او مرطوب)',
        qualities: 'تود بدن، قوي هاضمه، د تودوخې او وینې فشار ته تمایل',
        herbs: 'نعنا، غوږولۍ، د دڼیا تخم اوبه',
      },
      {
        mizaj: 'صفرا (ګرم او وچ)',
        qualities: 'تېز نبض، د معدې تیزابیت، پوستکي ګرمي او ژر غوسه کېدل',
        herbs: 'نیم ملهم، خوږه ولې، د ګلاب سړه عصاره',
      },
      {
        mizaj: 'بلغم (سوړ او مرطوب)',
        qualities: 'سستي، بلغم، د سهار دروندوالی او د بندونو پړسوب',
        herbs: 'سلاجیت، زنجبیل، توره دانه تېل',
      },
      {
        mizaj: 'سودا (سوړ او وچ)',
        qualities: 'فکري فشار، بې خوبي، وچ بندونه او عصبي ستړیا',
        herbs: 'زعفران او اشواګندا، بابونه، خوږ بادام تېل',
      },
    ],
    ctaTitle: 'مسلکي کلینیکي معاینې ته اړتیا لرئ؟',
    ctaSub: 'په کابل کې له ډاکټر حفیظ الله صافی سره حضوري یا آنلاین معاینه ونیسئ.',
    scheduleAssessment: 'معاینه وټاکئ',
    whatsappTriage: 'واټساپ مستقیم اړیکه: +93 780 299 299',
  },
  testimonials: {
    kicker: 'د ناروغانو کیسې او پایلې',
    heading: 'د ناروغانو تجربې او ثبت شوی پرمختګ',
    sub: 'په کابل کې د صافی د سنتي طب کلینیک د مراجعینو مشاهداتي نظرونه.',
    allStories: 'ټولې کیسې',
    verifiedPatient: 'تایید شوی ناروغ',
    progressLabel: 'پرمختګ',
    conditionLabel: 'ستونزه:',
    clinicianLabel: 'معالج:',
    lookingForCare: 'شخصي طبي پاملرنه غواړئ؟',
    bookVisit: 'نوبت واخلئ',
    pageBadge: 'ثبت شوې کلینیکي پایلې او د ناروغانو کیسې',
    pageTitle: 'د ناروغانو د روغتیا کیسې او',
    pageAccent: 'کلینیکي تجربې',
    pageSub: 'د کابل کلینیک او آنلاین ناروغانو ریښتینې تجربې د اخلاقي او غیر تهاجمي درملنې په برخه کې.',
    statSatisfaction: 'د رضایت کچه',
    statRelief: 'د ښه والي سلنه',
    statPatients: 'درملل شوي ناروغان',
    statNatural: 'طبیعي بوټاني نسخې',
    shareKicker: 'د ناروغانو غږ',
    shareTitle: 'خپله د روغتیا کیسه شریکه کړئ',
    shareSub: 'که زموږ کلینیک ستاسو له روغتیا سره مرسته کړې وي، خپل نظر ولیکئ.',
    submittedTitle: 'ستاسو د تجربې شریکولو مننه',
    submittedBody: 'ستاسو نظر د کلینیک علمي بورډ ته د ارزونې لپاره وسپارل شو.',
    nameLabel: 'ستاسو بشپړ نوم / لنډ نوم',
    cityLabel: 'ښار / هېواد',
    condLabel: 'درمل شوې ستونزه',
    docLabel: 'اړوند ډاکټر',
    storyLabel: 'ستاسو د روغتیا کیسه او پایله',
    storyPlaceholder: 'د درملنې مخکې او وروسته خپل حالت بیان کړئ...',
    submitStoryBtn: 'نظر وسپارئ',
    ctaTitle: 'خپل د روغتیا سفر نن پیل کړئ',
    ctaSub: 'په کابل کې حضوري یا آنلاین معاینه ونیسئ.',
    bookNowBtn: 'اوس نوبت واخلئ',
    exploreTreatmentsBtn: 'ټولې درملنې او بیې وګورئ',
  },
  blog: {
    badge: 'د صافی د درملو او بوټو ژورنال',
    title: 'بوټاني درملنې، علمي مقالې او فیتوتراپي',
    subtitle: 'په کابل کې زموږ د متخصصینو له خوا لیکل شوي علمي یادښتونه او د کورنیو درملو لارښود.',
    pharmKicker: 'کلاسیک فارماکوپیا',
    pharmTitle: 'کورنۍ نسخې چې په اسانۍ یې چمتو کولی شئ',
    pharmSub: 'په یوناني طب کې د ورځنۍ روغتیا ساتنې لپاره باوري کورنۍ طریقه.',
    indicationLabel: 'ګټه:',
    ingredientsLabel: 'مواد:',
    methodLabel: 'طریقه:',
    wantPersonalized: 'د خپل مزاج سره سم شخصي نسخه غواړئ؟',
    scheduleBtn: 'کلینیکي معاینه وټاکئ',
    disclaimerTitle: 'د طبي زده کړې او خوندیتوب یادونه',
    disclaimerBody:
      'دا مقالې یوازې د عامه پوهاوي لپاره دي او د طبي تشخیص ځای نه نیسي. د امیندوارۍ یا کیمیاوي درملو اخیستلو پر مهال له ډاکټر سره مشوره وکړئ.',
  },
  portal: {
    badge: 'د ناروغ خوندي روغتیايي اسناد',
    title: 'د ناروغ تاریخچه او د درملتون ریکارډونه',
    subtitle: 'خپلو معایناتو، د یوناني طب نسخو او د درملتون فرمایشونو ته لاسرسی ومومئ.',
    signInTitle: 'د ناروغ تایید شوی ننوتل',
    signInSub: 'رمز شوي روغتیايي اسناد',
    signInDesc: 'د ډاکټر حفیظ الله صافی له خوا ثبت شوي پروتوکولونو کتلو لپاره ننوځئ.',
    signInBtn: 'له ګوګل حساب سره ننوځئ',
    lookupTitle: 'د نوبت چټک پلټنه',
    lookupHeading: 'د کوډ له مخې نوبت ومومئ',
    lookupSub: 'خپل د نوبت کوډ (لکه SNC-XXXXXX) یا د تلیفون شمېره ولیکئ.',
    searchAptBtn: 'معاینه ولټوئ',
    tabProtocols: 'بوټاني نسخې',
    tabAppointments: 'کلینیکي معاینات',
    tabOrders: 'د درملتون فرمایشونه',
    tabMizaj: 'یوناني مزاج او اخلاط',
    bookConsultBtn: 'معاینه وټاکئ',
    signOutBtn: 'وتل',
    doseLoggedMsg: 'نننی خوراک په بریالیتوب ثبت شو!',
  },
  posAdmin: {
    posKicker: 'صافی د سنتي طب کلینیک · استقبال او درملتون',
    posTitle: 'د درملتون POS او QR تریاژ',
    posSub: 'د چټک پلور لپاره د درملو بارکوډ سکن کړئ یا د ناروغ د راتګ ثبتولو لپاره QR کارډ وکاروئ.',
    viewLedgerBtn: 'د حسابدارۍ دفتر وګورئ',
    tabPos: 'د درملتون POS او بارکوډ سکنر',
    tabTriage: 'د ناروغ CRM او QR پېژندنه',
    adminKicker: 'صافی د سنتي طب کلینیک · اجرایوي اداره',
    adminTitle: 'د کلینیک حسابداري او ګدام سیستم',
    adminSub: 'ژوندی مالي تحلیل، د ګدام خبرتیاوې، او د کلینیک عمومي تنظیمات.',
    openPosBtn: 'POS او QR تریاژ پرانیزئ',
    tabAccounting: 'مالي تحلیل او لیجر',
    tabMoa2009: 'حسابداري ۲۰۰۹ سیستم',
    tabInventory: 'ګدام او د کمښت خبرتیاوې',
    tabSettings: 'شبکې او اداري تنظیمات',
  },
  chatbot: {
    askButton: 'له حکیم AI وپوښتئ',
    title: 'حکیم مرستیال AI',
    subtitle: 'صافی د سنتي طب کلینیک · کابل',
    welcomeMsg:
      'سلام او ښه راغلاست! زه د صافی کلینیک ډیجیټل مرستیال یم. د یوناني مزاج، بوټاني درملو یا د کابل کلینیک د پتو په اړه پوښتنه وکړئ.',
    placeholder: 'د درملو، مزاج یا معاینې په اړه وپوښتئ...',
    searchBtn: 'لټون',
    mapsBtn: 'نقشه',
    thinking: 'حکیم مرستیال معلومات تحلیلوي...',
    quickPrompts: [
      { label: 'د صفراوي مزاج توازن', prompt: 'د صفراوي مزاج توازن لپاره کوم بوټي ګټور دي؟' },
      { label: 'د کابل کلینیک پته', prompt: 'په کابل کې صافی کلینیک ته څنګه راشم؟' },
      { label: 'د توره دانه خوندیتوب', prompt: 'آیا د فشار له درملو سره توره دانه اخیستل کیدی شي؟' },
    ],
  },
  footer: {
    pagesHeading: 'د کلینیک پاڼې',
    addressesHeading: 'د کابل پتې او ساعتونه',
    clinicLabel: 'کلینیک:',
    regOfficeLabel: 'ثبت شوی دفتر:',
    phoneWhatsappLabel: 'تلیفون او واټساپ',
    updatesHeading: 'د کلینیک خبرتیاوې',
    updatesSub: 'د ډاکټر حفیظ الله صافی موسمي غذایي مشورې او د درملتون تازه خبرونه.',
    emailPlaceholder: 'خپل برېښنالیک ولیکئ',
    subscribeBtn: 'گډون وکړئ',
    subscribedMsg: 'د کلینیک خبرتیاوو ته بریالی گډون وشو.',
    scopeSafetyLabel: 'ساحه او خوندیتوب:',
    copyrightPrefix: 'کابل، افغانستان',
  },
  servicesMap: {
    'srv-comprehensive': {
      title: 'بشپړ بوټاني او یوناني معاینه',
      duration: '۶۰ دقیقې',
      category: 'عمومي',
      description: 'د نبض، ژبې، روغتیايي تاریخچې او مزاج بشپړ تشخیص له ځانګړي بوټاني او غذایي پلان سره.',
      suitableFor: ['ګڼ سیستمي نښې', 'هاضمي او هورموني عدم توازن', 'بنسټیز وقایوي پاملرنه'],
      treatmentIncludes: [
        'له ډاکټر حفیظ الله صافی سره ۶۰ دقیقې معاینه',
        'د یوناني مزاج دقیقه ارزونه',
        'ځانګړې بوټاني نسخه او غذایي لارښود',
        'د درملو خوندیتوب کتنه',
      ],
    },
    'srv-digestive': {
      title: 'د هاضمې او میتابولیزم معاینه',
      duration: '۵۰ دقیقې',
      category: 'مزمنې ناروغۍ',
      description: 'د معدې تیزابیت، پړسوب او سستې هاضمې لپاره ځانګړي بوټاني او غذایي پروګرامونه.',
      suitableFor: ['د معدې تیزابیت', 'پړسوب او قبضیت', 'د ځیګر سستوالی'],
      treatmentIncludes: ['د هاضمې مزاج ارزونه', 'د بوټو خوراک مهالویش', 'د خوړو د وخت لارښود'],
    },
    'srv-pain-arthritis': {
      title: 'د بندونو، عضلاتو او اکوپنکچر درملنه',
      duration: '۵۰ دقیقې',
      category: 'مزمنې ناروغۍ',
      description: 'د زنګنو، ملا او غاړې درد لپاره بوټاني ضمادونه او غیر جراحي سنتي اکوپنکچر.',
      suitableFor: ['د زنګنو او بندونو کلکوالی', 'د ملا او غاړې درد', 'سنتي اکوپنکچر ملاتړ'],
      treatmentIncludes: ['د بندونو د حرکت معاینه', 'بهرنی مرهم او داخلي نسخه', 'اختیاري غیر تهاجمي اکوپنکچر'],
    },
    'srv-stress-sleep': {
      title: 'فشار، خوب او د ژوند طرز مشوره',
      duration: '۴۵ دقیقې',
      category: 'اروايي او قوت',
      description: 'د عصبي سیستم آرامښت او ژور خوب لپاره آراموونکي بوټي او عملي مشورې.',
      suitableFor: ['بې خوبي او ناکراري', 'د کار او ژوند فشار', 'ذهني ستړیا'],
      treatmentIncludes: ['د خوب او فشار ارزونه', 'د ماښام بوټاني څاڅکي', 'د ساه ایستلو او تغذیې لارښود'],
    },
    'srv-skin': {
      title: 'د پوستکي او ویښتانو طبي پاملرنه',
      duration: '۴۵ دقیقې',
      category: 'تخصصي',
      description: 'د وچ پوستکي، حساسیت او د ویښتانو پیاوړتیا لپاره داخلي تصفیه او طبیعي ملمونه.',
      suitableFor: ['وچ او حساس پوستکی', 'د ویښتانو کمزورتیا', 'د پوستکي د خنډ رغښت'],
      treatmentIncludes: ['د معده-پوستکي اړیکې کتنه', 'طبیعي ملم لارښوونه', 'داخلي تصفیه او شحم تغذیه'],
    },
    'srv-hijama': {
      title: 'حجامت او سنتي اکوپنکچر',
      duration: '۶۰ دقیقې',
      category: 'تخصصي',
      description: 'د عضلاتي بندښت او سر دردونو کمولو لپاره تعقیم یو ځل مصرف حجامت او سنتي اکوپنکچر.',
      suitableFor: ['د سر درد او غاړې کلکوالی', 'عضلاتي فشار', 'موسمي تصفیه'],
      treatmentIncludes: ['د فشار او نبض مخکینی چک', '۱۰۰٪ تعقیم یو ځل مصرف پیالې', 'د توره دانه ملم او استراحت لارښود'],
    },
    'srv-hormonal': {
      title: 'هورموني او د تناسلي روغتیا ملاتړ',
      duration: '۶۰ دقیقې',
      category: 'تخصصي',
      description: 'د ښځو هورموني توازن او د نارینه وو قوت او بارورۍ لپاره طبیعی لارښود.',
      suitableFor: ['د عادت بې نظمي', 'هورموني بدلونونه', 'د نارینه وو قوت ملاتړ'],
      treatmentIncludes: ['د غدودو او مزاج ارزونه', 'د بوټو ترکیب پلان', 'معدني او غذایي لارښود'],
    },
    'srv-followup': {
      title: 'تعقیبي کتنه او وقایوي لارښوونه',
      duration: '۳۰ دقیقې',
      category: 'عمومي',
      description: 'د مخکینیو نښو ارزونه، د درملو اندازه تنظیمول او وقایوي روغتیايي مشوره.',
      suitableFor: ['پخواني ناروغان', 'د نسخې نوي کول', 'دوراني روغتیايي چک'],
      treatmentIncludes: ['د پرمختګ کتنه', 'نوی خوراک مهالویش', 'د درملتون اجازه لیک'],
    },
  },
  productsMap: {
    'prod-hormone-balance': {
      name: 'صافی هورمون بالانس (Safi Hormone Balance)',
      subtitle: 'د ښځو هورموني توازن بوټاني څاڅکي',
      volumeOrWeight: '۶۰ ملي لیتره تیاره شیشه',
      shortDescription: 'د میاشتني عادت د نظم او طبیعي هورموني توازن لپاره ځانګړې یوناني عصاره.',
      detailedDescription: 'په کابل کې د صافی کلینیک له خوا پرته له مصنوعي هورمونونو چمتو شوی طبیعي ترکیب.',
      suggestedUse: 'ورځې دوه ځله ۳۰ څاڅکي په تودو اوبو کې له خوړو سره وخورئ.',
      precautions: 'د امیندوارۍ پر مهال د ډاکټر له مشورې پرته مه کاروئ.',
    },
    'prod-chill-af': {
      name: 'صافی چیل (Safi Chill AF)',
      subtitle: 'د اعصابو چټک آرامښت او ژور خوب شربت',
      volumeOrWeight: '۵۰ ملي لیتره څاڅکي',
      shortDescription: 'د فشار کمولو او ماښامني آرامښت لپاره چټک اغیزه بوټاني عصاره.',
      detailedDescription: 'له بادرنجبویه او پشن فلاور څخه جوړ شوی چې بې له خوب آلوده کولو ذهن آراموي.',
      suggestedUse: 'د فشار پر مهال یا ۳۰ دقیقې مخکې له خوبه ۲۵–۳۵ څاڅکي وکاروئ.',
      precautions: 'له آراموونکو درملو سره یوځای د ډاکټر مشوره واخلئ.',
    },
    'prod-beauty-drops': {
      name: 'صافی بیوتي ډراپس (Safi Beauty Drops)',
      subtitle: 'د پوستکي، ویښتانو او انټي اکسیډنټ څاڅکي',
      volumeOrWeight: '۵۰ ملي لیتره څاڅکي',
      shortDescription: 'د پوستکي د نرمښت او ویښتانو د ریښو د تغذیې لپاره طبیعي تېل.',
      detailedDescription: 'د اومیګا ۷ او ویټامین C بډایه عصاره چې له دننه او بهره پوستکی تغذیه کوي.',
      suggestedUse: 'ورځې ۲۰ څاڅکي په اوبو کې یا د شپې ۳ څاڅکي پر پاک پوستکي ولګوئ.',
      precautions: 'پر حساس پوستکي لومړی ازموینه وکړئ.',
    },
    'prod-black-seed': {
      name: 'صافی شاهي توره دانه تېل (Royal Black Seed)',
      subtitle: 'خالص یخ-پریس شوې کلونجي (Nigella Sativa)',
      volumeOrWeight: '۱۰۰ ملي لیتره بوتل',
      shortDescription: 'له ۲.۸٪ تیموکینون سره خالص یخ-پریس شوي تېل د معافیت او زړه ملاتړ لپاره.',
      detailedDescription: 'تر ۳۵ درجې لاندې استخراج شوي خالص تېل چې فعال مواد یې خوندي پاتې دي.',
      suggestedUse: 'هر سهار ۱ چای کاشوغه (۵ ملي لیتره) له شاتو یا تودو اوبو سره.',
      precautions: 'په امیندوارۍ کې د ډاکټر مشوره واخلئ.',
    },
    'prod-shilajit-gold': {
      name: 'خالص همالیايي سلاجیت طلایي رزین',
      subtitle: 'پاک شوی لومړۍ درجه معدني سلاجیت',
      volumeOrWeight: '۳۰ ګرامه شیشه',
      shortDescription: 'د ۷۸٪ فولویک اسید سره بډایه سلاجیت د انرژۍ او نارینه قوت لپاره.',
      detailedDescription: 'په طبیعي لمر پاک شوی معدني رزین چې له درنو فلزاتو په خپلواکه توګه چک شوی دی.',
      suggestedUse: 'هر سهار د یوه نخود په اندازه (۳۰۰ ملی ګرامه) په تودو اوبو یا شیدو کې حل کړئ.',
      precautions: 'یوازې له پاکو اوبو سره وکاروئ او کلک یې بند وساتئ.',
    },
    'prod-gut-tea': {
      name: 'فلوراسوت د هاضمې بوټاني چای',
      subtitle: 'کلینیکي بوټاني پاڼې او ریښې',
      volumeOrWeight: '۱۲۰ ګرامه قوطی',
      shortDescription: 'د معدې تیزابیت او پړسوب کمولو لپاره خطمي، بابونه او د بادیان تخم.',
      detailedDescription: 'طبیعي کافیین-پاک چای چې د معدې دیوال ساتي او ګاز کموي.',
      suggestedUse: '۱ قاشق په تودو اوبو کې ۱۲ دقیقې پټ دم کړئ.',
      precautions: 'له کیمیاوي ګولیو ۱ ساعت فاصله ورکړئ.',
    },
    'prod-joint-balm': {
      name: 'د بندونو بوسویلیا او کورکمن ملهم',
      subtitle: 'د بندونو تودوونکی بوټاني ضماد',
      volumeOrWeight: '۸۰ ګرامه شیشه',
      shortDescription: 'کندر، کورکمن او ارنیکا په طبیعي موم کې د زنګنو او ملا د درد لپاره.',
      detailedDescription: 'سنتي موضعي ملهم چې د بندونو کلکوالی او سهارنی درد نرموي.',
      suggestedUse: 'ورځې ۲–۳ ځله پر بندونو په نرمۍ مساج کړئ.',
      precautions: 'یوازې بهرنۍ کارونه؛ پر خلاصو زخمونو مه لګوئ.',
    },
    'prod-renal-drops': {
      name: 'صافی یوریکلینز د پښتورګو څاڅکي',
      subtitle: 'د پښتورګو او مثانې تصفیوي عصاره',
      volumeOrWeight: '۶۰ ملي لیتره څاڅکي',
      shortDescription: 'د پښتورګو د چاڼ او یوریک اسید د توازن لپاره ملایم بوټاني شربت.',
      detailedDescription: 'له طبیعي ادرار آورونکو او نرموونکو بوټو څخه جوړ شوی پاک ترکیب.',
      suggestedUse: 'ورځې دوه ځله ۳۰ څاڅکي په یوه ګیلاس پاکو اوبو کې.',
      precautions: 'د ورځې په اوږدو کې کافي اوبه وڅښئ.',
    },
    'prod-liver-tonic': {
      name: 'صافی هیپاتوکس د ځیګر او صفرا شربت',
      subtitle: 'د کاسني ریښه، خارخسک او قاصدک',
      volumeOrWeight: '۱۰۰ ملي لیتره بوتل',
      shortDescription: 'د ځیګر د پاکوالي او صفرا جریان لپاره کلاسیک یوناني ترکیب.',
      detailedDescription: 'له درنو خوړو وروسته د ځیګر فعالیت او صفرا توازن ملاتړ کوي.',
      suggestedUse: 'له خوړو ۱۵ دقیقې مخکې ۱ چای کاشوغه په تودو اوبو کې.',
      precautions: 'د صفرا د لارو د بندښت پر مهال له ډاکټر وپوښتئ.',
    },
    'prod-ashwagandha': {
      name: 'صافی اشواګندا او د هرات زعفران تونیک',
      subtitle: 'بشپړ عضوي تطابق ورکوونکی ترکیب',
      volumeOrWeight: '۶۰ ملي لیتره څاڅکي',
      shortDescription: 'د هرات خالص زعفران له اشواګندا سره د ورځني فشار او روحیه توازن لپاره.',
      detailedDescription: 'بې له محرکو موادو باثباته انرژي او ذهني وضاحت برابروي.',
      suggestedUse: 'ورځې دوه ځله ۳۰ څاڅکي په تودو اوبو یا چای کې.',
      precautions: 'د تایرایډ ستونزو پر مهال مشوره واخلئ.',
    },
    'prod-lung-syrup': {
      name: 'برونکو-وایتل د سږو او ستوني شربت',
      subtitle: 'وحشي کاکوتي او غرني شات شربت',
      volumeOrWeight: '۲۰۰ ملي لیتره بوتل',
      shortDescription: 'د ستوني خارش، ټوخي او موسمي بندښت لپاره طبیعي شربت.',
      detailedDescription: 'بې له خوب آلوده کولو ساه اخیستل اسانه کوي.',
      suggestedUse: 'لویان: ۱ خوړو کاشوغه ورځې ۳ ځله؛ ماشومان (+۴): ۱ چای کاشوغه.',
      precautions: 'شات لري؛ له ۱ کال کم عمره ماشومانو ته مه ورکوئ.',
    },
    'prod-sleep-drops': {
      name: 'سومنا-کالم د ژور خوب څاڅکي',
      subtitle: 'سنبل الطیب او اسکال کپ عصاره',
      volumeOrWeight: '۵۰ ملي لیتره څاڅکي',
      shortDescription: 'د شپې طبیعي او بې وقفې خوب لپاره خالص بوټاني څاڅکي.',
      detailedDescription: 'د شپې ویښېدل کموي او سهار ستړیا نه راولي.',
      suggestedUse: 'له خوبه ۳۰ دقیقې مخکې ۴۰ څاڅکي په تودو اوبو کې.',
      precautions: 'له خوړلو وروسته موټر مه چلوئ.',
    },
    'prod-neem-salve': {
      name: 'د نیم او همیشه بهار د پوستکي ملهم',
      subtitle: 'د وچ او حساس پوستکي رغوونکی',
      volumeOrWeight: '۶۰ ملي لیتره قوطی',
      shortDescription: 'د نیم خالص تېل او طبیعی موم د چاودېدلي او وچ پوستکي د آرامښت لپاره.',
      detailedDescription: 'له استرویید او کیمیاوي موادو پاک رغوونکی ملم.',
      suggestedUse: 'ورځې ۲–۴ ځله پر پاک پوستکي ولګوئ.',
      precautions: 'یوازې بهرنۍ کارونه.',
    },
  },
  symptomsMap: {
    digestive: {
      name: 'هاضمه او میتابولیزم',
      description: 'د معدې تیزابیت، پړسوب، سست هاضمه او بې نظمه کولمې.',
      recommendedHerbs: ['د خطمي ریښه', 'بابونه', 'د بادیان تخم', 'کاسني'],
    },
    'pain-joints': {
      name: 'بندونه او عضلات',
      description: 'د زنګنو سختوالی، د ملا درد او عضلاتي فشار.',
      recommendedHerbs: ['کندر (بوسویلیا)', 'کورکمن', 'ارنیکا', 'سنتي اکوپنکچر'],
    },
    'stress-sleep': {
      name: 'فشار او خوب',
      description: 'نارامه خوب، عصبي فشار او ورځنۍ ستړیا.',
      recommendedHerbs: ['بادرنجبویه', 'پشن فلاور', 'اشواګندا', 'افغاني زعفران'],
    },
    'hormonal-wellness': {
      name: 'هورمون او قوت',
      description: 'د میاشتني عادت توازن، کمه انرژي او د نارینه وو قوت.',
      recommendedHerbs: ['پنج انګشت', 'شتاوري', 'همالیايي سلاجیت', 'زعفران'],
    },
    'skin-immunity': {
      name: 'پوستکی، ویښتان او سږي',
      description: 'وچ پوستکی، موسمي ټوخی او وقایوي معافیت.',
      recommendedHerbs: ['سنجد دریایي', 'نیم او کالندولا', 'توره دانه', 'وحشي کاکوتي'],
    },
  },
};

const FA_DICT: LocalizedDictionary = {
  brand: {
    shortWordmark: 'کلینیک صافی',
    fullWordmark: 'کلینیک طب سنتی صافی',
    clinicName: 'کلینیک طب سنتی صافی',
    companyName: 'Safi Natural Care',
    companySubtitle: 'موسسه مراقبت‌های گیاهی و سلامت طبیعی',
    cityCountry: 'کابل، افغانستان',
    foundedText: 'تأسیس اپریل ۲۰۲۶',
    mophShort: 'وزارت صحت عامه TCIM',
    clinicAddress: 'سرک عمومی میدان هوایی، چهارراهی شهید، کابل، افغانستان',
    registeredOffice: 'ناحیه دهم، قلعه فتح‌الله، کابل، افغانستان',
    hoursPolicy: 'اولویت با نوبت‌های قبلی، سپس مراجعین حضوری · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰',
    tagline: 'گیاه‌درمانی · طب یونانی · طب طبیعی',
    founderName: 'داکتر حفیظ‌الله صافی',
    founderTitle: 'بنیان‌گذار و رئیس کل · Safi Natural Care',
    founderBio:
      'داکتر حفیظ‌الله صافی، بنیان‌گذار و مدیر کلینیک طب سنتی صافی در کابل، مراقبت‌های سراپا را با پیوند دادن گیاه‌درمانی، تشخیص مزاج یونانی، طب طبیعی و طب سوزنی سنتی بر اساس معیارهای روشن مصونیت بیمار رهبری می‌کند.',
    overview:
      'کلینیک طب سنتی صافی یک مرکز صحی سراپا (خارج‌بستر) در کابل است که مراقبت‌های سنتی و طبیعی را از طریق گیاه‌درمانی، طب یونانی و ناتوروپاتی ارائه می‌دهد.',
    vision:
      'ارتقای سلامت جامعه از طریق طب سنتی مصون، اخلاقی و مبتنی بر شواهد.',
    mission: [
      'ارائه مراقبت‌های قابل دسترس گیاهی، یونانی و طبیعی به صورت سراپا',
      'رعایت کامل مصونیت بیمار، رضایت آگاهانه و حدود صادقانه طبی',
    ],
    legalStatement:
      'کلینیک طب سنتی صافی مطابق با مقررات وزارت صحت عامه افغانستان به عنوان خدمات صحی تکمیلی فعالیت می‌کند و جایگزین مراقبت‌های عاجل یا طب معاصر نیست.',
    epigraphTranslation: 'و هنگامی که بیمار شوم، همو مرا شفا می‌بخشد (الشعراء ۲۶:۸۰)',
  },
  nav: {
    home: 'صفحه اصلی',
    treatments: 'درمان‌ها',
    shop: 'دواخانه',
    about: 'درباره ما',
    contact: 'تماس با ما',
    portals: 'پورتال‌ها',
    portalsTitle: 'بخش‌ها و عملیات کلینیک',
    booking: 'رزرو نوبت',
    bookingDesc: 'تعیین وقت حضوری یا ویدیویی',
    patientPortal: 'پورتال بیمار',
    patientPortalDesc: 'نوبت‌ها، نسخه‌ها و سفارش‌ها',
    symptomChecker: 'ارزیابی علائم',
    symptomCheckerDesc: 'راهنمای مزاج یونانی و گیاهان',
    testimonials: 'تجربه بیماران',
    testimonialsDesc: 'نتایج ثبت‌شده درمانی',
    blog: 'ژورنال درمانی',
    blogDesc: 'مقالات علمی و دم‌نوش‌های خانگی',
    posTriage: 'POS و تریاژ QR',
    posTriageDesc: 'فروش دواخانه و پذیرش بیمار',
    admin: 'اداره و محاسبه',
    adminDesc: 'دفتر حسابداری، گدام و تنظیمات',
    signIn: 'ورود',
    signOut: 'خروج',
    healthHistory: 'سابقه صحی و نسخه‌ها',
    myConsultations: 'معاینات من',
    bookVisit: 'رزرو نوبت',
    bookAppointment: 'ثبت نوبت معاینه',
    activeLabel: 'فعال',
    openCartAria: 'باز کردن سبد خرید',
    toggleMenuAria: 'باز یا بسته کردن منو',
    switcherAria: 'انتخاب زبان',
    currencyAria: 'انتخاب واحد پول',
    currencyLabel: 'واحد پول',
  },
  mobileBar: {
    callDesk: 'تماس',
    treatments: 'درمان‌ها',
    bookVisit: 'رزرو نوبت',
    shop: 'دواخانه',
    cart: 'سبد',
  },
  hero: {
    headlineTop: 'طب سنتی و گیاهی،',
    headlineAccent: 'مبتنی بر مراقبت کلینیکی.',
    welcomePrefix: 'خوش آمدید به',
    directedByPrefix: 'تحت مدیریت',
    descriptionSuffix:
      'کلینیک سراپا ما در کابل خدمات اخلاقی گیاه‌درمانی، طب یونانی، ناتوروپاتی و طب سوزنی غیرتهاجمی ارائه می‌کند.',
    scheduleCta: 'رزرو مشاوره طبی',
    dispensaryCta: 'دواخانه گیاهی',
    modalitiesCount: '۳ سیستم درمانی',
    modalitiesDesc: 'گیاه‌درمانی، مزاج یونانی و ناتوروپاتی',
    formulasCount: '۹ بخش تخصصی',
    formulasDesc: 'دواخانه کامل ترکیبات گیاهی کلینیک',
    lookingForGuide: 'به دنبال راهنمای غذایی و گیاهی هستید؟',
    remedyGuideLink: 'راهنمای درمان‌ها',
  },
  home: {
    systemsKicker: 'سه پایه طبابت کلینیک',
    systemsHeading: 'گیاه‌درمانی · طب یونانی · طب طبیعی',
    founderProfileLink: 'پروفایل بنیان‌گذار و کلینیک',
    servicesKicker: 'خدمات سراپا · کابل',
    servicesHeading: 'حوزه‌های تمرکز کلینیکی',
    allFeesLink: 'فهرست کامل فیس‌ها و برنامه‌ها',
    dispensaryKicker: 'دواخانه گیاهی صافی',
    dispensaryHeading: 'ترکیبات اختصاصی کلینیک',
    browseCategoriesLink: 'مشاهده هر ۹ دسته‌بندی',
    detailsBtn: 'جزئیات',
    addBtn: 'افزودن',
    fullTriageLink: 'ارزیابی کامل علائم و مزاج',
    insideClinicKicker: 'درون کلینیک طب سنتی صافی',
    insideClinicHeading: 'مطب کابل و پروفایل رسمی',
    insideClinicBody:
      'تمامی دوسیه‌های بیماران، برنامه‌های غذایی و ترکیبات دواخانه بر اساس معیارهای مصونیت و مقررات وزارت صحت عامه ثبت می‌شود.',
    viewGalleryBtn: 'مشاهده گالری کامل',
    documentsWord: 'اسناد',
    journalKicker: 'ژورنال درمانی',
    journalHeading: 'یادداشت‌های گیاه‌شناسی و تغذیه',
    allArticlesBtn: 'همه مقالات',
    readBtn: 'مطالعه',
    portalKicker: 'پورتال سوابق بیماران',
    portalHeading: 'مشاهده معاینات، نسخه‌ها و سفارش‌های دواخانه',
    portalBody:
      'برای مشاهده زمان‌بندی مصرف گیاهان دارویی و سوابق خود وارد حساب کلینیک شوید.',
    portalBtn: 'پورتال بیمار',
    allStoriesLink: 'همه داستان‌های بیماران',
    ctaHeading: 'نوبت حضوری یا مشاوره ویدیویی رزرو کنید',
    callWhatsappPrefix: 'تماس / واتساپ:',
    closeGalleryAria: 'بستن گالری',
  },
  systems: [
    {
      code: 'HM.',
      title: 'گیاه‌درمانی (Phytotherapy)',
      tagline: 'فیتوتراپی علمی',
      description:
        'ترکیبات خالص گیاهان دارویی که برای مصونیت فزیولوژیکی و اثربخشی روشن آماده می‌شوند.',
      principles: [
        'تهیه داروها بر اساس اصول علمی فیتوتراپی',
        'تشخیص دقیق گیاه‌شناسی و دوز مصون',
        'عاری از مواد سمی، ناخالصی یا گیاهان نادر ممنوعه',
      ],
    },
    {
      code: 'UN.',
      title: 'طب یونانی (Unani Medicine)',
      tagline: 'مزاج‌شناسی و پرهیز غذایی',
      description:
        'ارزیابی کلاسیک مزاج و رژیم‌درمانی جهت بازگرداندن تعادل طبیعی بدن.',
      principles: [
        'تشخیص دقیق مزاج سرشتی بیمار',
        'تعدیل اخلاط چهارگانه با گیاهان و غذا',
        'تقویت طبیعت مدبره (قوه خودشفابخشی بدن)',
      ],
    },
    {
      code: 'NA.',
      title: 'طب طبیعی (Naturopathy)',
      tagline: 'سبک زندگی و تغذیه',
      description:
        'اصلاح عملی سبک زندگی، خواب و تغذیه که بدون مداخله تهاجمی به بهبودی کمک می‌کند.',
      principles: [
        'مشاوره فردی تغذیه و عادات روزمره',
        'مراقبت غیرتهاجمی و حمایتی',
        'راهنمایی همسو و تکمیلی در کنار طب معاصر',
      ],
    },
  ],
  scopeOfServices: [
    {
      code: 'HM.',
      title: 'مشکلات گوارشی و متابولیک',
      category: 'معده و متابولیزم',
      description: 'حمایت درمانی برای ترش‌کردن معده، نفخ، کندی هضم و تعادل متابولیک.',
    },
    {
      code: 'UN.',
      title: 'ناراحتی‌های عضلانی و مفاصل',
      category: 'مفاصل و حرکت',
      description: 'ضمادهای گیاهی، مرهم‌های ضدالتهاب موضعی و کمک به نرمی مفاصل.',
    },
    {
      code: 'NA.',
      title: 'استرس مزمن و اختلالات سبک زندگی',
      category: 'استرس و خواب',
      description: 'گیاهان آرام‌بخش اعصاب، تنظیم چرخه خواب و مشاوره سبک زندگی.',
    },
    {
      code: 'HM.',
      title: 'حمایت از تعادل هورمونی و باروری',
      category: 'غدد و باروری',
      description: 'برنامه‌های گیاهی متناسب با مزاج برای نظم هورمونی زنان و توان جسمی مردان.',
    },
    {
      code: 'UN.',
      title: 'مراقبت‌های حمایتی تنفسی و کلیوی',
      category: 'تنفس و کلیه',
      description: 'شربت‌های نرم‌کننده سینه و قطره‌های گیاهی تصفیه‌کننده مجاری ادرار.',
    },
    {
      code: 'NA.',
      title: 'سلامت پوست و مو (درمانی و غیرآرایشی)',
      category: 'پوست درمانی',
      description: 'مراقبت هدفمند خوراکی و موضعی برای خشکی مزمن پوست و ریزش مو.',
    },
    {
      code: 'NA.',
      title: 'سلامت عمومی و آموزش پیشگیری',
      category: 'طب وقایوی',
      description: 'تغذیه بر اساس مزاج و عادات پیشگیرانه فصلی برای خانواده‌ها.',
    },
    {
      code: 'AC.',
      title: 'طب سوزنی سنتی (حمایتی و غیرتهاجمی)',
      category: 'اکوپنکچر',
      description: 'مراقبت غیرتهاجمی مریدین‌ها برای دردهای موضعی، سردرد تنشی و ریکاوری.',
    },
  ],
  safetyEthics: [
    {
      title: 'مصونیت بیمار',
      desc: 'بررسی کامل سابقه صحی، ارزیابی دقیق پرونده و ارجاع فوری به داکتر معاصر در صورت نیاز.',
    },
    {
      title: 'طبابت اخلاقی',
      desc: 'پرهیز از ادعاهای اغراق‌آمیز یا وعده درمان قطعی؛ ارتباط صادقانه با احترام به کرامت بیمار.',
    },
    {
      title: 'رضایت آگاهانه',
      desc: 'توضیح شفاف حدود طب سنتی، مدت زمان مورد انتظار و امکانات درمانی.',
    },
    {
      title: 'ثبت سوابق کلینیکی',
      desc: 'دوسیه‌های منظم بیمار، پیگیری با QR و تداوم مراقبت‌های بعدی.',
    },
  ],
  treatments: {
    headerTitle: 'مراقبت‌های کلینیکی سنتی و تکمیلی به صورت سراپا',
    headerSubtitle:
      'هر جلسه مشاوره مطابق با مزاج سرشتی شما طراحی می‌شود و طب یونانی، گیاه‌درمانی، ناتوروپاتی و طب سوزنی را ترکیب می‌کند.',
    mophBadge: 'مطابق با اصول TCIM وزارت صحت عامه',
    scopeKicker: 'حوزه خدمات کلینیکی',
    scopeHeading: '۸ خدمات درمانی سراپا',
    scopeSub: 'مراقبت‌های غیرتهاجمی، حمایتی و وقایوی برای بیماری‌های مزمن و عملکردی.',
    pillarsKicker: 'ارزیابی سرشتی',
    pillarsHeading: '۴ رکن تشخیصی کلینیک',
    pillarsSub: 'پیش از تجویز یا ترکیب دارو، وضعیت هر بیمار به صورت ساختارمند معاینه می‌شود.',
    pillars: [
      {
        title: '۱. نبض‌شناسی (Pulse)',
        subtitle: 'بررسی توان حیاتی',
        desc: 'ارزیابی شاخص‌های نبض برای سنجش حرارت غریزی، توان اعضا و جریان خون.',
      },
      {
        title: '۲. مزاج (Temperament)',
        subtitle: 'تعادل اخلاط',
        desc: 'تعیین غلبه دم، صفرا، بلغم یا سودا برای انتخاب دقیق غذا و گیاهان دارویی.',
      },
      {
        title: '۳. معاینه زبان (Lisan)',
        subtitle: 'نقشه گوارشی',
        desc: 'مشاهده بار، رطوبت و رنگ زبان برای تشخیص گرمی یا رکود گوارشی.',
      },
      {
        title: '۴. بررسی تداخل دارویی',
        subtitle: 'غربالگری مصونیت',
        desc: 'تطبیق گیاهان دارویی با داروهای شیمیایی بیمار جهت اطمینان از عدم تداخل.',
      },
    ],
    directoryKicker: 'برنامه‌های حضوری و آنلاین',
    directoryHeading: 'فهرست برنامه‌های مشاوره قابل رزرو',
    directorySub: 'موارد شامل هر معاینه را بررسی کرده و نوبت خود را مستقیماً ثبت کنید.',
    allCat: 'همه',
    catLabels: {
      All: 'همه',
      General: 'عمومی',
      'Chronic Care': 'مراقبت مزمن',
      Specialized: 'تخصصی',
      Vitality: 'انرژی و آرامش',
    },
    feeLabel: 'فیس مشاوره',
    hideDetails: 'بستن جزئیات',
    protocolDossier: 'جزئیات برنامه',
    bookVisit: 'رزرو نوبت',
    includesTitle: 'موارد شامل در این ویزیت',
    indicationsTitle: 'موارد کاربرد بالینی',
    prepTitle: 'آمادگی پیش از معاینه',
    prepNotes: [
      '۲ ساعت پیش از معاینه از نوشیدن قهوه و غذای سنگین خودداری کنید.',
      'نتایج آزمایش‌های اخیر و نام داروهای فعلی خود را همراه داشته باشید.',
      'اولویت با نوبت‌های قبلی، سپس مراجعین حضوری · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰.',
    ],
    dispensaryNote: 'تحویل مستقیم داروها در دواخانه داخل کلینیک در کابل امکان‌پذیر است.',
    schedulePrefix: 'رزرو:',
    safetyBannerKicker: 'استانداردهای تعقیم و مصونیت بیمار',
    safetyBannerTitle: 'مراقبت غیرتهاجمی و صادقانه در کابل',
    safetyBannerBody:
      'اولویت با نوبت‌های قبلی · سرک عمومی میدان هوایی، چهارراهی شهید، کابل. تجهیزات استریل یک‌بار مصرف و گیاهان تاییدشده.',
    bookConsultation: 'رزرو مشاوره',
    faqKicker: 'اطلاعات بیماران',
    faqHeading: 'پرسش‌های متداول کلینیکی',
    faqs: [
      {
        q: 'تشخیص در طب یونانی چه تفاوتی با آزمایش‌های مرسوم دارد؟',
        a: 'طب یونانی کل سیستم بدن را از طریق مزاج (دم، صفرا، بلغم، سودا)، نبض و زبان بررسی می‌کند تا با گیاهان و رژیم غذایی، قوه خوددرمانی بدن تقویت شود.',
      },
      {
        q: 'در کلینیک طب سنتی صافی کدام شاخه‌های درمانی ارائه می‌شود؟',
        a: 'ما سه سیستم مکمل گیاه‌درمانی، طب یونانی و ناتوروپاتی را همراه با طب سوزنی حمایتی غیرتهاجمی در کابل ارائه می‌دهیم.',
      },
      {
        q: 'آیا می‌توانم ترکیبات گیاهی صافی را همراه با داروهای داکتر استفاده کنم؟',
        a: 'بله، تحت نظارت کلینیکی. در ویزیت اول، داکتر حفیظ‌الله صافی فهرست داروهای شما را بررسی می‌کند تا هیچ تداخل دارویی رخ ندهد.',
      },
      {
        q: 'آیا پذیرش فقط با نوبت قبلی است یا بدون نوبت هم می‌توان مراجعه کرد؟',
        a: 'مراجعین دارای نوبت قبلی در اولویت هستند و بیماران بدون نوبت نیز بین نوبت‌ها به ترتیب ورود پذیرش می‌شوند.',
      },
      {
        q: 'آیا محصولات گیاهی شما آزمایش‌شده و خالص هستند؟',
        a: 'بله، تمامی فرآورده‌ها از گیاهان تاییدشده، عاری از فلزات سنگین و مواد شیمیایی در شرایط بهداشتی تهیه می‌شوند.',
      },
    ],
  },
  shop: {
    pageKicker: 'Safi Natural Care · دواخانه گیاهی',
    pageTitle: 'فرآورده‌های گیاهی و عطاری کلینیکی',
    pageSub:
      'فرمول‌های ترکیبی در ۹ دسته‌بندی صحی — شامل قطره‌های هورمون بالانس، صافی چیل و بیوتی دراپس.',
    dispatchTitle: 'ارسال کابل و ولایات',
    dispatchSub: 'ارسال رایگان برای خرید بالای ۶۰ دالر · تحویل حضوری در کلینیک',
    dispatchFreePrefix: 'ارسال رایگان برای خرید بالای',
    dispatchFreeSuffix: '· تحویل حضوری در کلینیک',
    promoTitle: 'کد تخفیف بیمار',
    promoSubPrefix: 'کد',
    promoSubSuffix: 'را برای ۱۰٪ تخفیف وارد کنید',
    purityTitle: 'خلوص گیاهی تاییدشده',
    puritySub: 'بدون فلزات سنگین یا افزودنی‌های مصنوعی',
    catalogKicker: '۹ دسته‌بندی کلینیکی',
    catalogTitle: 'کتلوگ دواخانه صافی',
    catalogSub: 'بر اساس حوزه سلامت فیلتر کنید یا نام دارو را برای دیدن ترکیبات و موجودی جستجو نمایید.',
    adviceBtn: 'مشاوره مزاج می‌خواهید؟',
    allCategory: 'همه',
    searchPlaceholder: 'جستجوی دارو (مثلاً Hormone Balance، Chill AF، Black Seed)...',
    formulationSingular: 'ترکیب',
    formulationPlural: 'ترکیب',
    sortFeatured: 'برگزیده‌ها ابتدا',
    sortRating: 'بالاترین امتیاز',
    sortPriceLow: 'قیمت: ارزان به گران',
    sortPriceHigh: 'قیمت: گران به ارزان',
    emptyTitle: 'محصولی مطابق فیلتر شما یافت نشد',
    emptySub: 'دسته‌بندی دیگری را انتخاب کنید یا متن جستجو را پاک نمایید.',
    showAllBtn: 'نمایش هر ۹ دسته‌بندی',
    inspectBtn: 'مشاهده',
    addBtn: 'افزودن',
    addedBtn: 'افزوده شد',
    outOfStock: 'ناموجود',
    lowStock: 'موجودی کم',
    inStock: 'موجود',
    shareLabel: 'اشتراک‌گذاری:',
    activeNomenclature: 'مواد موثره و نام علمی گیاهان',
    clinicalDosage: 'دستور مصرف کلینیکی:',
    addToCartTotal: 'افزودن به سبد',
    reviewsWord: 'دیدگاه',
    standardsKicker: 'استانداردهای تهیه دارو',
    standardsTitle: 'عصاره‌گیری پاک و نگهداری استاندارد',
    standards: [
      {
        title: 'منابع معتبر گیاهی',
        desc: 'عصاره‌ها و روغن‌ها تحت نظارت و استانداردهای پاک دواخانه تهیه و بسته‌بندی می‌شوند.',
      },
      {
        title: 'برچسب‌گذاری شفاف',
        desc: 'ذکر نام علمی گیاهان، دوز محافظه‌کارانه و نکات احتیاطی روی هر بسته.',
      },
      {
        title: 'شیشه‌های محافظت‌شده UV',
        desc: 'نگهداری در شیشه‌های تیره بدون مواد نگهدارنده شیمیایی برای حفظ خواص طبیعی.',
      },
    ],
    unsureNote: 'مطمئن نیستید کدام دسته با مزاج شما سازگار است؟ با تیم کلینیک داکتر صافی مشوره کنید.',
    bookConsultation: 'رزرو مشاوره',
    productCategories: {
      "Women's Health & Hormonal Wellness": 'سلامت زنان و تعادل هورمونی',
      'Male Wellness & Fertility': 'سلامت و توان جسمی مردان',
      'Digestive & Gastrointestinal Wellness': 'سلامت دستگاه گوارش و معده',
      'Stress, Sleep & Neurological Wellness': 'آرامش اعصاب، استرس و خواب',
      'Bone, Joint & Pain Management': 'استخوان، مفاصل و تسکین درد',
      'Kidney & Urinary Wellness': 'سلامت کلیه و مجاری ادراری',
      'Cardiometabolic Wellness': 'سلامت قلب و متابولیزم',
      'Liver & Detox Wellness': 'سلامت کبد و پاکسازی',
      'Immunity & General Wellness': 'تقویت معافیت و تندرستی عمومی',
    },
  },
  cart: {
    title: 'سبد خرید دواخانه',
    itemsInBasket: 'قلم در سبد خرید',
    freeShippingUnlocked: 'ارسال رایگان فعال شد!',
    addMorePrefix: 'برای ارسال رایگان',
    addMoreSuffix: 'دیگر اضافه کنید',
    emptyTitle: 'سبد خرید شما خالی است',
    emptySub: 'ترکیبات گیاهی تهیه‌شده توسط داکتران کلینیک را بررسی کنید.',
    browseBtn: 'مشاهده دواخانه',
    promoPlaceholder: 'کد تخفیف (مثلاً HERBAL10)',
    applyBtn: 'اعمال',
    promoSuccess: 'کد تخفیف با موفقیت اعمال شد!',
    promoInvalid: 'کد نامعتبر است. برای ۱۰٪ تخفیف از HERBAL10 استفاده کنید.',
    subtotal: 'جمع کل',
    discount: 'تخفیف',
    shipping: 'هزینه ارسال',
    freeLabel: 'رایگان',
    tax: 'مالیات برآوردی (۵٪)',
    total: 'مبلغ نهایی',
    checkoutBtn: 'ادامه به پرداخت امن',
    sslNote: 'پرداخت رمزگذاری‌شده دواخانه گیاهی صافی',
  },
  checkout: {
    step1Kicker: 'ارسال دواخانه · مرحله ۱ از ۲',
    step1Title: 'آدرس تحویل و اطلاعات تماس',
    recipientName: 'نام کامل گیرنده *',
    emailLabel: 'ایمیل برای اطلاع‌رسانی *',
    addressLabel: 'آدرس دقیق و کوچه *',
    cityLabel: 'شهر *',
    postalLabel: 'کد پستی',
    phoneLabel: 'شماره تماس تحویل *',
    orderTotalLabel: 'مجموع سفارش',
    itemsWord: 'قلم',
    freeShippingApplied: 'ارسال رایگان اعمال شد',
    standardShipping: 'ارسال عادی',
    continuePayment: 'ادامه به پرداخت',
    step2Kicker: 'پرداخت امن · مرحله ۲ از ۲',
    step2Title: 'انتخاب روش پرداخت',
    cardMethod: 'کارت بانکی',
    cardSub: 'Visa, MC, Amex',
    codMethod: 'تحویل در کلینیک / پرداخت نقدی',
    codSub: 'پرداخت هنگام تحویل',
    cardNumber: 'شماره کارت',
    expiryDate: 'تاریخ انقضا',
    cvcLabel: 'کد امنیتی (CVC)',
    codTitle: 'پرداخت نقدی هنگام تحویل:',
    codNote: 'می‌توانید بسته‌های پلمب‌شده گیاهی خود را بررسی کرده و هزینه را نقدی بپردازید.',
    totalToPay: 'مبلغ قابل پرداخت:',
    verifiedSafe: 'تاییدشده و امن',
    backAddress: 'بازگشت به آدرس',
    confirmOrder: 'تایید و ثبت سفارش گیاهی',
    orderConfirmedBadge: 'سفارش تایید شد',
    thankYouTitle: 'از انتخاب کلینیک طب سنتی صافی سپاسگزاریم',
    thankYouSub: 'سفارش شما اکنون در دواخانه با دقت در حال آماده‌سازی است.',
    orderRefLabel: 'شماره پیگیری سفارش:',
    recipientSummary: 'گیرنده:',
    deliverySummary: 'آدرس تحویل:',
    estDelivery: 'زمان تخمینی تحویل:',
    estDeliveryVal: '۲ تا ۴ روز کاری',
    totalPaid: 'مبلغ پرداختی:',
    continueExploring: 'بازگشت به کلینیک صافی',
  },
  quickView: {
    dossierTitle: 'پرونده علمی ترکیب',
    closeAria: 'بستن پنجره محصول',
    addToCart: 'افزودن به سبد',
    addedNotice: 'به سبد اضافه شد!',
    keyActives: 'خواص کلیدی گیاهان',
    suggestedUse: 'نحوه مصرف پیشنهادی',
  },
  booking: {
    pageTitle: 'رزرو نوبت مشاوره کلینیکی',
    pageSub:
      'ویزیت حضوری با داکتر حفیظ‌الله صافی در سرک میدان هوایی، چهارراهی شهید، کابل یا مشاوره ویدیویی آنلاین رزرو نمایید.',
    telehealthBadge: 'مشاوره ویدیویی آنلاین فعال است',
    confidentialBadge: 'حفظ محرمیت بیمار',
    tabPatient: 'مراحل رزرو بیمار',
    tabStaff: 'تقویم جامع کادر درمانی',
    tabLookup: 'پیگیری نوبت',
    policyTitle: 'قانون نوبت‌دهی و مراجعین بدون نوبت',
    policyDesc: 'اولویت با نوبت‌های ثبت‌شده است و سپس مراجعین حضوری پذیرش می‌شوند.',
    recordsTitle: 'همراه داشتن سوابق صحی',
    recordsDesc: 'آزمایش‌ها و فهرست داروهای فعلی را بیاورید تا تداخلات دارویی بررسی شود.',
    fastTitle: 'پرهیز ۲ ساعته پیش از معاینه',
    fastDesc: 'برای دقت در معاینه نبض و زبان، ۲ ساعت قبل از غذا و قهوه پرهیز کنید.',
    lookupTitle: 'جستجوی نوبت ثبت‌شده',
    lookupSub: 'شماره پیگیری (مثلاً SHC-8401)، شماره تلفن یا ایمیل خود را وارد کنید.',
    lookupPlaceholder: 'مثلاً SHC-8401 یا +93 780 299 299',
    searchBtn: 'جستجوی نوبت',
    confirmedLabel: 'نوبت تاییدشده',
    patientLabel: 'بیمار',
    serviceLabel: 'خدمت',
    dateTimeLabel: 'تاریخ و ساعت',
    clinicianLabel: 'معالج',
    noMatchPrefix: 'نوبتی مطابق با این عبارت یافت نشد:',
    noMatchSuffix: 'با پذیرش کلینیک در شماره +93 780 299 299 تماس بگیرید.',
    hotlineTitle: 'پذیرش مستقیم و هماهنگی حضوری',
    callBtnPrefix: 'تماس:',
    wizardSteps: ['خدمت و معالج', 'تاریخ و ساعت', 'مشخصات بیمار'],
    selectServiceTitle: '۱. انتخاب خدمت کلینیکی',
    inclusionsLabel: 'موارد شامل برنامه:',
    feeLabel: 'فیس مشاوره',
    selectClinicianTitle: '۲. انتخاب معالج',
    yearsPractice: 'سال تجربه',
    modeLabel: 'نوع مشاوره:',
    inClinicTitle: 'ویزیت حضوری در کلینیک',
    inClinicSub: 'چهارراهی شهید، کابل',
    telehealthTitle: 'ویزیت ویدیویی آنلاین',
    telehealthSub: 'لینک پس از ثبت ایمیل می‌شود',
    proceedStep2: 'ادامه به انتخاب تاریخ و ساعت',
    selectedProtocol: 'برنامه انتخاب‌شده:',
    withPrefix: 'با',
    changeService: 'تغییر خدمت',
    selectDateLabel: 'انتخاب تاریخ',
    availableSlotsLabel: 'ساعت‌های خالی کلینیک:',
    morningLabel: 'صبح',
    afternoonLabel: 'بعدازظهر',
    backBtn: 'بازگشت',
    nextStep3: 'بعدی: مشخصات بیمار',
    step3Badge: 'مرحله ۳ از ۳',
    step3Title: 'مشخصات بیمار و وضعیت صحی',
    step3Privacy: 'تمامی اطلاعات بیمار نزد کلینیک طب سنتی صافی کاملاً محرمانه می‌ماند.',
    legalName: 'نام کامل *',
    emailAddress: 'آدرس ایمیل *',
    phoneWhatsapp: 'تلفن / واتساپ *',
    ageOptional: 'سن بیمار (اختیاری)',
    concernsLabel: 'شکایت اصلی و علائم صحی *',
    concernsPlaceholder: 'علائم، مدت زمان و داروهای فعلی خود را بنویسید...',
    firstTimeCheckbox: 'این نخستین مراجعه من به کلینیک طب سنتی صافی است',
    dueAtVisit: 'پرداخت هنگام ویزیت',
    confirmReserveBtn: 'تایید و ثبت نوبت',
    aptConfirmedBadge: 'نوبت تایید شد',
    aptConfirmedTitle: 'منتظر دیدار شما هستیم',
    recordedFor: 'تاییدیه ثبت شد برای:',
    refCode: 'کد پیگیری',
    locationLabel: 'محل ویزیت',
    arrivalNotesTitle: 'نکات حضور در کلینیک',
    arrivalNotes: [
      'اولویت با نوبت‌های قبلی و سپس مراجعین حضوری · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰.',
      '۲ ساعت پیش از معاینه نبض، غذای سنگین و قهوه میل نکنید.',
      'بسته‌های دارو و آزمایش‌های اخیر را همراه بیاورید.',
    ],
    downloadIcs: 'دانلود فایل تقویم (.ics)',
    bookAnother: 'ثبت نوبت دیگر',
    alreadyBooked: 'قبلاً نوبت رزرو کرده‌اید؟',
    quickLookupPlaceholder: 'کد پیگیری یا شماره تلفن را وارد کنید',
    lookupBtn: 'جستجو',
    scheduleErrorMsg: 'لطفاً تاریخ و ساعت مورد نظر را انتخاب نمایید.',
  },
  about: {
    leadershipKicker: 'رهبری · موسسه مراقبت‌های گیاهی و سلامت طبیعی',
    clinicAddressLabel: 'آدرس کلینیک',
    registeredOfficeLabel: 'دفتر ثبت‌شده',
    bookWithFounder: 'رزرو با داکتر حفیظ‌الله صافی',
    viewServices: 'مشاهده ۸ خدمات سراپا',
    faithKicker: 'ایمان و شفا · سوره الشعراء ۲۶:۸۰',
    visionTitle: 'چشم‌انداز (Vision)',
    visionSubtitle: 'مراقبت اخلاقی از جامعه',
    missionTitle: 'ماموریت (Mission)',
    missionSubtitle: 'مصونیت و رضایت آگاهانه',
    safetyKicker: 'اصول مصونیت بیمار و WHO TCIM',
    mophKicker: 'مطابقت با وزارت صحت عامه',
    mophTitle: 'اطلاعیه حقوقی و حوزه فعالیت',
    directDesk: 'خط مستقیم:',
    archiveKicker: 'آرشیف و تصاویر کلینیک',
    archiveTitle: 'اسناد رسمی و تصاویر کلینیک',
    archiveSub: 'برای بزرگ‌نمایی روی هر سند یا تصویر کلیک کنید.',
    gridLabel: 'شبکه',
    projectorLabel: 'اسلایدشو',
    allRecords: 'همه اسناد',
    inspectBtn: 'مشاهده',
    lightboxBtn: 'بزرگ‌نمایی',
    slideLabel: 'اسلاید',
    ofWord: 'از',
    teamKicker: 'کادر طبی',
    teamTitle: 'رئیس و تیم کلینیکی',
    yearsPractice: 'سال تجربه',
    scheduleBtn: 'تعیین وقت مشاوره',
    bottomCtaTitle: 'به کلینیک سراپا ما در کابل مراجعه نمایید',
    bookClinicalBtn: 'رزرو مشاوره کلینیکی',
    contactDeskBtn: 'تماس با پذیرش کلینیک',
    closeBtn: 'بستن',
  },
  contact: {
    title: 'تماس و آدرس‌های کابل',
    subtitle:
      'اولویت با نوبت‌های قبلی، سپس مراجعین حضوری · شنبه–پنجشنبه ۸:۳۰ – ۱۸:۰۰. برای نوبت‌گیری یا هماهنگی دواخانه با پذیرش داکتر حفیظ‌الله صافی در تماس شوید.',
    phoneDeskTitle: 'میز تلفن (کابل)',
    callClinicBtn: 'تماس با کلینیک',
    whatsappTitle: 'میز مشاوره واتساپ',
    whatsappSub: 'نوبت‌دهی و پرسش‌های دارویی',
    whatsappBtn: 'پیام در واتساپ',
    emailsTitle: 'ایمیل‌های کلینیک',
    sendEmailBtn: 'ارسال ایمیل',
    websitesTitle: 'وب‌سایت‌های رسمی',
    openPortalBtn: 'باز کردن پورتال',
    inquiryKicker: 'استعلام آنلاین',
    inquiryTitle: 'ارسال پیام به بخش پذیرش',
    inquirySub: 'درباره زمان معاینات، مزاج‌شناسی یونانی یا موجودی داروها بپرسید.',
    receivedTitle: 'پیام شما دریافت شد',
    receivedBody: 'سپاس از تماس شما با کلینیک طب سنتی صافی. همکاران ما به زودی پاسخ خواهند داد.',
    sendAnother: 'ارسال پیام دیگر',
    fullName: 'نام کامل *',
    emailAddress: 'آدرس ایمیل *',
    phoneNumber: 'شماره تماس',
    inquiryType: 'نوع درخواست',
    optGeneral: 'پرسش عمومی کلینیکی',
    optAppointment: 'رزرو نوبت معاینه',
    optDispensary: 'دواخانه و ترکیبات گیاهی',
    optTelehealth: 'مشاوره ویدیویی آنلاین',
    messageLabel: 'پیام *',
    messagePlaceholder: 'پرسش یا زمان مناسب برای تماس را بنویسید...',
    submitBtn: 'ارسال پیام',
    sendingBtn: 'در حال ارسال...',
    kabulLocations: 'نشانی‌های کابل',
    clinicAddrTitle: 'آدرس کلینیک',
    regOfficeTitle: 'دفتر ثبت‌شده',
    bookOutpatientBtn: 'رزرو ویزیت سراپا',
    hoursRuleTitle: 'ساعات کاری و قانون مراجعه',
    hoursRuleDesc: 'اولویت با بیماران دارای نوبت قبلی است و مراجعین بدون نوبت به ترتیب ورود ویزیت می‌شوند.',
    channelsKicker: 'کانال‌های ارتباطی',
    followPrefix: 'دنبال کنید:',
  },
  symptoms: {
    kicker: 'راهنمای تعاملی گیاه‌شناسی',
    title: 'تطبیق علائم با فرمول‌های کلینیک',
    subtitle: 'حوزه مشکل خود را انتخاب کنید تا گیاهان کلاسیک، مشاوره مناسب و داروهای هدفمند را ببینید.',
    protocolSummary: 'خلاصه برنامه درمانی',
    keyBotanicals: 'گیاهان کلیدی',
    recommendedVisit: 'ویزیت پیشنهادی',
    bookBtn: 'رزرو',
    dispensaryFormulations: 'داروهای پیشنهادی دواخانه',
    scheduleEvalBtn: 'رزرو ارزیابی کلینیکی',
    pageBadge: 'پورتال تشخیص علائم و مزاج‌شناسی',
    pageHeading: 'بررسی علائم و',
    pageAccent: 'برنامه‌های هدفمند گیاهی',
    pageSub: 'چالش صحی خود را انتخاب کنید تا تحلیل اخلاط یونانی، گیاهان دارویی و ویزیت مرتبط را مشاهده نمایید.',
    nonInvasiveBadge: 'راهنمایی غیرتهاجمی و حمایتی',
    formulatedByBadge: 'تدوین‌شده توسط داکتر حفیظ‌الله صافی',
    clinicalProfilePrefix: 'پروفایل کلینیکی:',
    unaniContext:
      'در طب سنتی یونانی، این علائم نشان‌دهنده عدم تعادل اخلاط است. هدف آرام‌سازی التهاب و تقویت طبیعت شفابخش بدن می‌باشد.',
    recommendedConsult: 'مشاوره پیشنهادی',
    bookThisVisit: 'رزرو این ویزیت',
    targetedCompounds: 'ترکیبات گیاهی هدفمند',
    personalizedRegimen: 'رژیم گیاهی شخصی‌سازی‌شده',
    regimenDesc: 'عصاره‌های خالص عصاره‌گیری سرد، دم‌نوش‌های التیام‌بخش و راهنمای اصلاح مزاج.',
    typicalWindow: 'دوره معمول بهبودی: ۳ تا ۶ هفته',
    compoundedRemediesKicker: 'فرآورده‌های ترکیبی',
    targetedProductsFor: 'محصولات هدفمند برای',
    viewFullDispensary: 'مشاهده کامل دواخانه',
    dossierBtn: 'پرونده',
    mizajSectionKicker: 'اصول سرشتی طب یونانی',
    mizajSectionTitle: 'شناخت مزاج شما',
    mizajSectionSub: 'در طب سنتی هر فرد مزاج خاصی دارد؛ انتخاب گیاهان هماهنگ با مزاج بهترین نتیجه را می‌دهد.',
    unaniPillarBadge: 'رکن یونانی',
    signsLabel: 'نشانه‌ها:',
    balancingLabel: 'گیاهان متعادل‌کننده:',
    mizajGuides: [
      {
        mizaj: 'دم (گرم و تر)',
        qualities: 'بدن گرم، هضم فعال، چهره گندم‌گون یا سرخ، مستعد حرارت متابولیک و فشار خون',
        herbs: 'نعنا، گل چای‌ترش، دم‌نوش گشنیز',
      },
      {
        mizaj: 'صفرا (گرم و خشک)',
        qualities: 'نبض تند، زودرنجی، ریفلاکس معده، گرمی کبد و التهاب پوستی',
        herbs: 'مرهم نیم، ریشه شیرین‌بیان، گلاب خنک',
      },
      {
        mizaj: 'بلغم (سرد و تر)',
        qualities: 'گردش خون کند، سنگینی صبحگاهی، تجمع خلط و ورم مفاصل',
        herbs: 'شلاجیت هیمالیا، جوشانده زنجبیل، روغن سیاهدانه',
      },
      {
        mizaj: 'سودا (سرد و خشک)',
        qualities: 'فکر و خیال زیاد، بی‌خوابی، خشکی مفاصل و تنش عصبی',
        herbs: 'زعفران و اشواگاندا، بابونه، روغن بادام شیرین',
      },
    ],
    ctaTitle: 'نیاز به ارزیابی تخصصی کلینیکی دارید؟',
    ctaSub: 'نوبت حضوری با داکتر حفیظ‌الله صافی در کابل یا مشاوره ویدیویی ثبت نمایید.',
    scheduleAssessment: 'رزرو ارزیابی کلینیکی',
    whatsappTriage: 'مشاوره مستقیم واتساپ: +93 780 299 299',
  },
  testimonials: {
    kicker: 'تجربه بیماران و نتایج کلینیکی',
    heading: 'تجربیات بیماران و روند بهبودی',
    sub: 'بازخوردهای واقعی بیماران درمان‌شده در کلینیک طب سنتی صافی در کابل.',
    allStories: 'همه داستان‌ها',
    verifiedPatient: 'بیمار تاییدشده',
    progressLabel: 'نتیجه',
    conditionLabel: 'مشکل:',
    clinicianLabel: 'معالج:',
    lookingForCare: 'به دنبال مراقبت تخصصی فردی هستید؟',
    bookVisit: 'رزرو نوبت',
    pageBadge: 'نتایج مستند کلینیکی و داستان‌های بیماران',
    pageTitle: 'داستان‌های بهبودی بیماران و',
    pageAccent: 'شواهد کلینیکی',
    pageSub: 'تجربیات واقعی بیماران در کلینیک کابل و خدمات تله‌هلث با طب سنتی اخلاقی.',
    statSatisfaction: 'میانگین رضایت',
    statRelief: 'نرخ بهبود قابل توجه',
    statPatients: 'بیماران درمان‌شده',
    statNatural: 'نسخه ۱۰۰٪ طبیعی',
    shareKicker: 'صدای جامعه بیماران',
    shareTitle: 'تجربه بهبودی خود را به اشتراک بگذارید',
    shareSub: 'اگر کلینیک صافی به سلامت شما کمک کرده است، تجربه خود را ثبت کنید.',
    submittedTitle: 'سپاس از به اشتراک گذاشتن تجربه شما',
    submittedBody: 'دیدگاه شما جهت بررسی به هیئت تحریریه کلینیک ارسال شد.',
    nameLabel: 'نام کامل / حروف اختصاری',
    cityLabel: 'شهر / کشور',
    condLabel: 'مشکل درمانی',
    docLabel: 'معالج مربوطه',
    storyLabel: 'شرح بهبودی و نتیجه درمان',
    storyPlaceholder: 'علائم پیش از درمان و روند بهبودی خود را بنویسید...',
    submitStoryBtn: 'ارسال بازخورد کلینیکی',
    ctaTitle: 'سفر بهبودی شخصی خود را آغاز کنید',
    ctaSub: 'در کابل نوبت بگیرید یا مشاوره آنلاین ویدیویی رزرو نمایید.',
    bookNowBtn: 'رزرو نوبت فوری',
    exploreTreatmentsBtn: 'مشاهده همه درمان‌ها و تعرفه‌ها',
  },
  blog: {
    badge: 'ژورنال گیاه‌درمانی و داروشناسی صافی',
    title: 'درمان‌های گیاهی، مونوگراف‌های بالینی و فیتوتراپی',
    subtitle: 'یافته‌های علمی گیاهی و دستورهای سنتی تهیه‌شده توسط متخصصان ما در کابل.',
    pharmKicker: 'دارونامه سنتی',
    pharmTitle: 'ترکیبات خانگی قابل تهیه در منزل',
    pharmSub: 'دستورهای اصیل طب یونانی برای حفظ سلامت روزمره.',
    indicationLabel: 'مورد مصرف:',
    ingredientsLabel: 'مواد لازم:',
    methodLabel: 'روش تهیه:',
    wantPersonalized: 'نسخه گیاهی متناسب با مزاج خودتان را می‌خواهید؟',
    scheduleBtn: 'رزرو مشاوره کلینیکی',
    disclaimerTitle: 'سلب مسئولیت آموزشی فیتوتراپی',
    disclaimerBody:
      'این مقالات جنبه آموزشی دارد و جایگزین معاینه پزشکی نیست. در دوران بارداری یا مصرف داروهای تجویزی حتماً با داکتر مشورت کنید.',
  },
  portal: {
    badge: 'سوابق صحی امن بیمار',
    title: 'تاریخچه صحی بیمار و سوابق دواخانه',
    subtitle: 'دسترسی به تاریخچه ویزیت‌ها، برنامه‌های گیاهی یونانی و سفارش‌های دواخانه صافی.',
    signInTitle: 'ورود تاییدشده بیمار',
    signInSub: 'پرونده الکترونیک رمزگذاری‌شده',
    signInDesc: 'برای مشاهده نسخه‌های تجویزشده توسط داکتر حفیظ‌الله صافی وارد حساب خود شوید.',
    signInBtn: 'ورود با حساب تاییدشده گوگل',
    lookupTitle: 'جستجوی فوری نوبت',
    lookupHeading: 'یافتن نوبت با شماره پیگیری',
    lookupSub: 'شماره مرجع (مثلاً SNC-XXXXXX) یا شماره تماس خود را وارد کنید.',
    searchAptBtn: 'جستجوی نوبت',
    tabProtocols: 'نسخه‌های گیاهی پیشنهادی',
    tabAppointments: 'تاریخچه معاینات',
    tabOrders: 'سوابق خرید دواخانه',
    tabMizaj: 'مزاج و اخلاط یونانی',
    bookConsultBtn: 'رزرو مشاوره',
    signOutBtn: 'خروج',
    doseLoggedMsg: 'دوز امروز با موفقیت ثبت شد!',
  },
  posAdmin: {
    posKicker: 'کلینیک طب سنتی صافی · پذیرش و دواخانه',
    posTitle: 'فروشگاه دواخانه POS و تریاژ QR بیمار',
    posSub: 'اسکن بارکد داروها برای فروش سریع یا اسکن کارت QR بیمار برای ثبت حضور.',
    viewLedgerBtn: 'مشاهده دفتر حسابداری',
    tabPos: 'صندوق دواخانه و اسکنر بارکد',
    tabTriage: 'ثبت بیماران و تریاژ QR',
    adminKicker: 'کلینیک طب سنتی صافی · مدیریت اجرایی',
    adminTitle: 'کنسول حسابداری کلینیک و مدیریت گدام',
    adminSub: 'تحلیل مالی سود و زیان، دفتر حسابداری، هشدار موجودی و تنظیمات کلینیک.',
    openPosBtn: 'باز کردن POS و تریاژ QR',
    tabAccounting: 'تحلیل مالی و دفتر کل',
    tabMoa2009: 'مجموعه حسابداری ۲۰۰۹',
    tabInventory: 'موجودی گدام و هشدارها',
    tabSettings: 'تنظیمات شبکه‌ها و هزینه‌ها',
  },
  chatbot: {
    askButton: 'پرسش از حکیم AI',
    title: 'همراه هوشمند حکیم AI',
    subtitle: 'کلینیک طب سنتی صافی · کابل',
    welcomeMsg:
      'سلام و خوش آمدید به کلینیک طب سنتی صافی! درباره مزاج‌شناسی یونانی، گیاهان دارویی یا آدرس کلینیک در کابل بپرسید.',
    placeholder: 'درباره داروها، مزاج یا نوبت بپرسید...',
    searchBtn: 'جستجو',
    mapsBtn: 'نقشه',
    thinking: 'حکیم هوشمند در حال تحلیل منابع گیاه‌شناسی است...',
    quickPrompts: [
      { label: 'تعدیل مزاج صفراوی', prompt: 'چه گیاهانی برای تعادل مزاج گرم و خشک (صفراوی) مفید هستند؟' },
      { label: 'آدرس کلینیک کابل', prompt: 'چگونه به کلینیک طب سنتی صافی در کابل مراجعه کنم؟' },
      { label: 'تداخل سیاهدانه', prompt: 'آیا مصرف روغن سیاهدانه با داروی فشار خون مجاز است؟' },
    ],
  },
  footer: {
    pagesHeading: 'صفحات کلینیک',
    addressesHeading: 'آدرس‌ها و ساعات کابل',
    clinicLabel: 'کلینیک:',
    regOfficeLabel: 'دفتر ثبت‌شده:',
    phoneWhatsappLabel: 'تلفن و واتساپ',
    updatesHeading: 'تازه‌های کلینیک',
    updatesSub: 'نکات فصلی تغذیه یونانی و خبرهای دواخانه از داکتر حفیظ‌الله صافی.',
    emailPlaceholder: 'ایمیل خود را وارد کنید',
    subscribeBtn: 'عضویت',
    subscribedMsg: 'عضویت شما در خبرنامه کلینیک ثبت شد.',
    scopeSafetyLabel: 'حوزه و مصونیت:',
    copyrightPrefix: 'کابل، افغانستان',
  },
  servicesMap: {
    'srv-comprehensive': {
      title: 'مشاوره جامع گیاه‌درمانی و طب یونانی',
      duration: '۶۰ دقیقه',
      category: 'عمومی',
      description: 'ارزیابی کامل نبض، نشانه‌های زبان، سابقه صحی و مزاج همراه با برنامه اختصاصی گیاهی و غذایی.',
      suitableFor: ['علائم چندسیستمی پیچیده', 'عدم تعادل گوارشی یا هورمونی', 'مراقبت پیشگیرانه ریشه‌ای'],
      treatmentIncludes: [
        '۶۰ دقیقه ویزیت تشخیصی با داکتر حفیظ‌الله صافی',
        'ارزیابی دقیق مزاج یونانی',
        'برنامه اختصاصی گیاهی و تغذیه',
        'بررسی مصونیت داروهای دواخانه',
      ],
    },
    'srv-digestive': {
      title: 'مشاوره تخصصی گوارش و متابولیزم',
      duration: '۵۰ دقیقه',
      category: 'مراقبت مزمن',
      description: 'برنامه‌های گیاهی و غذایی یونانی برای ریفلاکس، نفخ، کندی معده و تعادل متابولیک.',
      suitableFor: ['ریفلاکس و ورم معده', 'نفخ و یبوست', 'کندی کبد و متابولیزم'],
      treatmentIncludes: ['بررسی مزاج گوارش و کبد', 'جدول مصرف تلخ‌داروها و لعاب‌ها', 'برنامه زمان‌بندی غذا'],
    },
    'srv-pain-arthritis': {
      title: 'درمان مفاصل، عضلات و طب سوزنی',
      duration: '۵۰ دقیقه',
      category: 'مراقبت مزمن',
      description: 'کمپرس‌های گیاهی، مرهم‌های موضعی و طب سوزنی غیرتهاجمی برای خشکی مفاصل و کمردرد.',
      suitableFor: ['خشکی زانو و مفاصل', 'درد کمر و گردن', 'حمایت با طب سوزنی سنتی'],
      treatmentIncludes: ['ارزیابی حرکت مفاصل', 'ضماد موضعی و پروتکل خوراکی', 'جلسه اختیاری طب سوزنی'],
    },
    'srv-stress-sleep': {
      title: 'مشاوره استرس، خواب و سبک زندگی',
      duration: '۴۵ دقیقه',
      category: 'انرژی و آرامش',
      description: 'بازسازی سیستم عصبی با گیاهان آرام‌بخش، تونیک‌های آداپتوژن و اصلاح بهداشت خواب.',
      suitableFor: ['بی‌خوابی و بدخوابی', 'استرس مزمن کاری', 'خستگی ذهنی'],
      treatmentIncludes: ['ارزیابی ریتم شبانه‌روزی', 'برنامه قطره گیاهی شبانه', 'راهنمای تغذیه و تنفس'],
    },
    'srv-skin': {
      title: 'مشاوره درمانی پوست و مو',
      duration: '۴۵ دقیقه',
      category: 'تخصصی',
      description: 'مراقبت غیرآرایشی برای خشکی و حساسیت پوست و تقویت مو با پاکسازی درونی و مرهم گیاهی.',
      suitableFor: ['پوست خشک و حساس', 'ریزش مو', 'ترمیم لایه محافظ پوست'],
      treatmentIncludes: ['بررسی محور گوارش-پوست', 'راهنمای پماد گیاهی', 'رژیم تصفیه خون و اسیدهای چرب'],
    },
    'srv-hijama': {
      title: 'حجامت و طب سوزنی سنتی',
      duration: '۶۰ دقیقه',
      category: 'تخصصی',
      description: 'حجامت استریل یک‌بار مصرف و طب سوزنی حمایتی برای رفع گرفتگی عضلات و سردردهای تنشی.',
      suitableFor: ['سردردهای تنشی و گردن', 'گرفتگی عضلانی', 'پاکسازی فصلی'],
      treatmentIncludes: ['کنترل فشار خون و نبض پیش از جلسه', 'لیوان‌های کاملاً استریل یک‌بار مصرف', 'مرهم سیاهدانه و توصیه استراحت'],
    },
    'srv-hormonal': {
      title: 'حمایت هورمونی و باروری',
      duration: '۶۰ دقیقه',
      category: 'تخصصی',
      description: 'حمایت گیاهی و اصلاح سبک زندگی برای نظم هورمونی زنان و تقویت قوای مردان.',
      suitableFor: ['بی‌نظمی قاعدگی', 'تغییرات پیش‌یائسگی', 'تقویت باروری و توان مردان'],
      treatmentIncludes: ['بررسی غدد و مزاج', 'نقشه فرمولاسیون گیاهی', 'تغذیه معدنی هدفمند'],
    },
    'srv-followup': {
      title: 'پیگیری درمان و آموزش پیشگیری',
      duration: '۳۰ دقیقه',
      category: 'عمومی',
      description: 'بررسی روند بهبودی، تنظیم مجدد دوز گیاهان و تقویت عادات تغذیه سالم.',
      suitableFor: ['بیماران مراجعه‌کننده قبلی', 'تنظیم دوز و تمدید دارو', 'چکاپ پیشگیرانه'],
      treatmentIncludes: ['بررسی پیشرفت علائم', 'به‌روزرسانی برنامه مصرف', 'تمدید نسخه دواخانه'],
    },
  },
  productsMap: {
    'prod-hormone-balance': {
      name: 'صافی هورمون بالانس (Safi Hormone Balance)',
      subtitle: 'قطره تعادل هورمونی ویتکس، شتاوری و زعفران',
      volumeOrWeight: '۶۰ میلی‌لیتر قطره شیشه تیره',
      shortDescription: 'فرمول اختصاصی طب یونانی برای نظم قاعدگی و تعادل طبیعی هورمونی.',
      detailedDescription: 'ترکیب‌شده در کلینیک صافی کابل برای خانم‌ها بدون هیچ‌گونه هورمون مصنوعی.',
      suggestedUse: 'روزی دو بار ۳۰ قطره در آب ولرم همراه غذا مصرف شود.',
      precautions: 'در دوران بارداری تنها با نظر داکتر مصرف شود.',
    },
    'prod-chill-af': {
      name: 'صافی چیل (Safi Chill AF)',
      subtitle: 'اکسیر آرامش سریع اعصاب و خواب عمیق',
      volumeOrWeight: '۵۰ میلی‌لیتر قطره‌چکان',
      shortDescription: 'ترکیب بادرنجبویه، گل ساعتی و اسکال‌کپ برای رفع تنش عصبی و بی‌قراری شبانه.',
      detailedDescription: 'بدون ایجاد خواب‌آلودگی روزانه، ظرف ۲۰ دقیقه سیستم عصبی را آرام می‌کند.',
      suggestedUse: 'هنگام استرس یا ۳۰ دقیقه پیش از خواب ۲۵ تا ۳۵ قطره مصرف شود.',
      precautions: 'در صورت مصرف داروهای آرام‌بخش با پزشک مشورت کنید.',
    },
    'prod-beauty-drops': {
      name: 'صافی بیوتی دراپس (Safi Beauty Drops)',
      subtitle: 'قطره ترمیم‌کننده پوست، مو و آنتی‌اکسیدان',
      volumeOrWeight: '۵۰ میلی‌لیتر قطره‌چکان',
      shortDescription: 'تغذیه سلولی با سنجد دریایی، نسترن و گزنه برای شفافیت پوست و تقویت مو.',
      detailedDescription: 'غنی از امگا-۷ و کاروتنوئیدهای طبیعی برای استحکام پوست و ریشه مو.',
      suggestedUse: 'روزی ۲۰ قطره در آب یا شب‌ها ۳ قطره روی پوست تمیز ماساژ دهید.',
      precautions: 'پیش از مصرف موضعی روی پوست حساس تست نمایید.',
    },
    'prod-black-seed': {
      name: 'اکسیر شاهانه سیاهدانه صافی',
      subtitle: 'روغن سیاهدانه بکر کلدپرس (Nigella Sativa)',
      volumeOrWeight: '۱۰۰ میلی‌لیتر شیشه',
      shortDescription: 'روغن سیاهدانه کلدپرس با ۲.۸٪ تیموکینون طبیعی برای ایمنی و متابولیزم.',
      detailedDescription: 'عصاره‌گیری زیر ۳۵ درجه سانتی‌گراد برای حفظ کامل اسیدهای چرب و ترکیبات فعال.',
      suggestedUse: 'هر صبح ۱ قاشق چای‌خوری (۵ میلی‌لیتر) با عسل طبیعی یا آب ولرم.',
      precautions: 'در دوران بارداری یا مصرف رقیق‌کننده‌های خون مشورت شود.',
    },
    'prod-shilajit-gold': {
      name: 'رزین طلایی شلاجیت خالص هیمالیا',
      subtitle: 'مومیایی معدنی تصفیه‌شده درجه یک',
      volumeOrWeight: '۳۰ گرم شیشه',
      shortDescription: 'رزین خالص سرشار از ۷۸٪ فولویک اسید برای انرژی، استقامت و قوای مردان.',
      detailedDescription: 'تصفیه‌شده در آفتاب و آزمایش‌شده از نظر نبود فلزات سنگین.',
      suggestedUse: 'هر صبح به اندازه یک نخود (۳۰۰ میلی‌گرم) در آب ولرم یا شیر حل کنید.',
      precautions: 'تنها در آب تصفیه‌شده حل شود و درب ظرف محکم بسته گردد.',
    },
    'prod-gut-tea': {
      name: 'دم‌نوش گوارشی فلوراسوت',
      subtitle: 'ترکیب کلینیکی گیاهان آرام‌بخش معده',
      volumeOrWeight: '۱۲۰ گرم قوطی',
      shortDescription: 'ریشه خطمی، بابونه، رازیانه و شیرین‌بیان برای تسکین سوزش معده و نفخ.',
      detailedDescription: 'سرشار از لعاب گیاهی جهت پوشاندن مخاط معده و رفع اسپاسم گوارشی.',
      suggestedUse: '۱ قاشق غذاخوری در آب داغ به مدت ۱۲ دقیقه به صورت دربسته دم کنید.',
      precautions: 'با قرص‌های دارویی حداقل ۱ ساعت فاصله مصرف داشته باشد.',
    },
    'prod-joint-balm': {
      name: 'مرهم مفاصل کندر و زردچوبه',
      subtitle: 'پماد گرم‌کننده و ضدالتهاب موضعی',
      volumeOrWeight: '۸۰ گرم شیشه',
      shortDescription: 'کندر هندی، کورکومین و آرنیکا در موم عسل طبیعی برای زانو، کمر و مفاصل.',
      detailedDescription: 'ضماد سنتی یونانی جهت رفع خشکی صبحگاهی مفاصل و خستگی عضلات.',
      suggestedUse: 'روزی ۲ تا ۳ بار به آرامی روی مفاصل ماساژ دهید.',
      precautions: 'فقط برای استعمال خارجی؛ روی زخم باز نزنید.',
    },
    'prod-renal-drops': {
      name: 'قطره کلیه و مثانه صافی یوریکلینز',
      subtitle: 'عصاره چانکاپیدرا، گزنه و کاکل ذرت',
      volumeOrWeight: '۶۰ میلی‌لیتر قطره‌چکان',
      shortDescription: 'تونیک ملایم برای تصفیه کلیه‌ها، تعادل اسیداوریک و آرامش مجاری ادرار.',
      detailedDescription: 'فرمول بدون الکل تهیه‌شده در دواخانه کابل برای سلامت مجاری ادراری.',
      suggestedUse: 'روزی دو بار ۳۰ قطره در یک لیوان بزرگ آب معدنی مخلوط کنید.',
      precautions: 'در طول روز آب کافی بنوشید.',
    },
    'prod-liver-tonic': {
      name: 'شربت تلخ کبد و صفرا صافی هیپاتوکس',
      subtitle: 'خارمریم، ریشه کاسنی و قاصدک',
      volumeOrWeight: '۱۰۰ میلی‌لیتر شیشه',
      shortDescription: 'تونیک کلاسیک کاسنی و سیلیمارین برای پاکسازی کبد و جریان سالم صفرا.',
      detailedDescription: 'رفع سنگینی پس از غذاهای چرب و حمایت از آنزیم‌های کبدی.',
      suggestedUse: '۱۵ دقیقه پیش از غذا ۱ قاشق چای‌خوری در آب ولرم میل شود.',
      precautions: 'در انسداد مجاری صفراوی با پزشک مشورت نمایید.',
    },
    'prod-ashwagandha': {
      name: 'تونیک اشواگاندا KSM-66 و زعفران صافی',
      subtitle: 'اکسیر آداپتوژن تمام‌طیف ارگانیک',
      volumeOrWeight: '۶۰ میلی‌لیتر قطره‌چکان',
      shortDescription: 'اشواگاندا استاندارد همراه با زعفران خالص هرات برای تاب‌آوری در برابر استرس.',
      detailedDescription: 'انرژی پایدار روزانه و بهبود خلق‌وخو بدون محرک‌های مصنوعی.',
      suggestedUse: 'روزی دو بار ۳۰ قطره در آب ولرم یا دم‌نوش میل شود.',
      precautions: 'در پرکاری تیروئید با پزشک مشورت کنید.',
    },
    'prod-lung-syrup': {
      name: 'شربت ریه و گلو برونکو-وایتال',
      subtitle: 'آویشن کوهی، آقطی و عسل کوهستان',
      volumeOrWeight: '۲۰۰ میلی‌لیتر شیشه',
      shortDescription: 'شربت تسکین‌دهنده سرفه، گلودرد و گرفتگی فصلی مجاری تنفسی.',
      detailedDescription: 'پاکسازی مجاری هوایی بدون ایجاد خواب‌آلودگی روزانه.',
      suggestedUse: 'بزرگسالان: ۱ قاشق غذاخوری ۳ بار در روز؛ کودکان (+۴): ۱ قاشق چای‌خوری.',
      precautions: 'دارای عسل طبیعی؛ برای نوزادان زیر ۱ سال مناسب نیست.',
    },
    'prod-sleep-drops': {
      name: 'قطره خواب عمیق سومنا-کالم',
      subtitle: 'عصاره سنبل‌الطیب و اسکال‌کپ',
      volumeOrWeight: '۵۰ میلی‌لیتر قطره‌چکان',
      shortDescription: 'قطره شبانه برای به خواب رفتن طبیعی و جلوگیری از بیداری‌های نیمه‌شب.',
      detailedDescription: 'بیداری سرحال در صبح بدون سنگینی و گیجی.',
      suggestedUse: '۳۰ دقیقه قبل از خواب ۴۰ قطره در آب ولرم میل شود.',
      precautions: 'پس از مصرف رانندگی نکنید.',
    },
    'prod-neem-salve': {
      name: 'مرهم ترمیم‌کننده پوست نیم و همیشه‌بهار',
      subtitle: 'محافظ پوست‌های خشک و حساس',
      volumeOrWeight: '۶۰ میلی‌لیتر قوطی',
      shortDescription: 'روغن بذر نیم کلدپرس، کالندولا و موم زنبور عسل برای ترک و خشکی پوست.',
      detailedDescription: 'فاقد کورتون و پارابن؛ محافظ سد دفاعی پوست دست و بدن.',
      suggestedUse: 'روزی ۲ تا ۴ بار روی پوست تمیز بمالید.',
      precautions: 'دارای بوی طبیعی بذر نیم؛ فقط مصرف خارجی.',
    },
  },
  symptomsMap: {
    digestive: {
      name: 'گوارش و متابولیزم',
      description: 'سوزش معده، نفخ، هضم کند یا بی‌نظمی روده.',
      recommendedHerbs: ['ریشه خطمی', 'بابونه', 'تخم رازیانه', 'کاسنی'],
    },
    'pain-joints': {
      name: 'مفاصل و استخوان',
      description: 'خشکی زانو، گرفتگی کمر یا درد مفاصل.',
      recommendedHerbs: ['کندر (بوسویلیا)', 'زردچوبه', 'آرنیکا', 'طب سوزنی'],
    },
    'stress-sleep': {
      name: 'استرس و خواب',
      description: 'خواب ناآرام، تنش عصبی یا خستگی روزانه.',
      recommendedHerbs: ['بادرنجبویه', 'گل ساعتی', 'اشواگاندا KSM-66', 'زعفران'],
    },
    'hormonal-wellness': {
      name: 'هورمونی و توان جسمی',
      description: 'تعادل قاعدگی، خستگی غدد یا تقویت قوای مردان.',
      recommendedHerbs: ['پنج‌انگشت', 'شتاوری', 'شلاجیت هیمالیا', 'زعفران افغانی'],
    },
    'skin-immunity': {
      name: 'پوست، مو و تنفس',
      description: 'پوست خشک و حساس، سرفه فصلی یا حمایت پیشگیرانه.',
      recommendedHerbs: ['سنجد دریایی', 'نیم و همیشه‌بهار', 'سیاهدانه', 'آویشن کوهی'],
    },
  },
};

export const TRANSLATIONS: Record<LanguageCode, LocalizedDictionary> = {
  en: EN_DICT,
  ps: PS_DICT,
  fa: FA_DICT,
};

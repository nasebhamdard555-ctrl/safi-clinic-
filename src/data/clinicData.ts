import {
  Practitioner,
  ConsultationService,
  HerbalProduct,
  BlogPost,
  SymptomMatch,
  ClinicOfficialProfile,
  ClinicPresentationSlide,
  OfficialProductCategory,
} from '../types/clinic';
import heroApothecaryImg from '../assets/images/hero_botanical_apothecary_1794735902543.jpg';
import amberElixirImg from '../assets/images/product_amber_elixir_1794735902742.jpg';
import resinBalmImg from '../assets/images/product_herbal_resin_balm_1794735903703.jpg';
import clinicConsultationImg from '../assets/images/clinic_unani_consultation_1794735904695.jpg';

export const CLINIC_ASSETS = {
  heroApothecaryImg,
  amberElixirImg,
  resinBalmImg,
  clinicConsultationImg,
};

export const OFFICIAL_PRODUCT_CATEGORIES: OfficialProductCategory[] = [
  "Women's Health & Hormonal Wellness",
  'Male Wellness & Fertility',
  'Digestive & Gastrointestinal Wellness',
  'Stress, Sleep & Neurological Wellness',
  'Bone, Joint & Pain Management',
  'Kidney & Urinary Wellness',
  'Cardiometabolic Wellness',
  'Liver & Detox Wellness',
  'Immunity & General Wellness',
];

export const CLINIC_PROFILE: ClinicOfficialProfile = {
  name: 'Safi Natural Care Clinic',
  pashtoName: 'صافی د سنتی طب کلینیک',
  persianName: 'کلینیک طب سنتی صافی',
  companyName: 'Safi Natural Care',
  companySubtitle: 'Herbal Health Care & Wellness Company',
  foundedDate: 'April 2026',
  founder: {
    name: 'Dr. Hafizullah Safi',
    title: 'Founder & Director / CEO, Safi Natural Care',
    location: 'Kabul, Afghanistan',
    photo: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    bio: 'Founder and Director of Safi Natural Care in Kabul, Dr. Hafizullah Safi leads outpatient care uniting Herbal Medicine, Unani Mizaj diagnostics, Naturopathy, and traditional acupuncture with clear patient safety standards.',
  },
  clinicAddress: 'Main Airport Road, Charahi Shaheed, Kabul, Afghanistan',
  registeredOffice: 'PD#10, Qalai Fathullah, Kabul, Afghanistan',
  tagline: 'Herbal Medicine · Unani Medicine · Naturopathy',
  facilityType: 'Outpatient / Community-based clinic',
  country: 'Afghanistan',
  city: 'Kabul',
  field: 'Herbal Medicine | Unani Medicine | Naturopathy',
  website: 'www.safinaturalcare.af',
  secondaryWebsite: 'www.safihealthcare.com',
  email: 'info@safihealthcare.com',
  secondaryEmail: 'hafeez.safi@gmail.com',
  phone: '+93780299299',
  formattedPhone: '+93 780 299 299',
  hoursPolicy: 'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm',
  faithAndHealing: {
    arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    pashto: 'او کله چ زه ناروغ شم، نو همغه ما ته شفا راكوي ( الله )',
    english: "And when I am ill, it is He who cures me (Ash-Shu'ara 26:80)",
  },
  overview:
    'Safi Natural Care Clinic is an outpatient healthcare facility in Kabul providing traditional and natural medical care through Herbal Medicine, Unani Medicine, and Naturopathy.',
  tcimScope:
    'Operates within the scope of Traditional, Complementary, and Integrative Medicine (TCIM) under Afghanistan Ministry of Public Health regulations.',
  vision:
    'Community health supported by safe, ethical, and evidence-informed traditional medicine.',
  mission: [
    'Provide accessible herbal, Unani, and naturopathic outpatient care',
    'Uphold patient safety, informed consent, and honest clinical boundaries',
  ],
  systemsOfMedicine: [
    {
      code: 'HM.',
      title: 'Herbal Medicine',
      tagline: 'Phytotherapy',
      principles: [
        'Plant-based preparations guided by phytotherapy principles',
        'Verified botanical identification and safe dosing',
        'Zero toxic, endangered, or adulterated substances',
      ],
      description:
        'Unadulterated medicinal plant formulations prepared for physiological safety and clear therapeutic utility.',
    },
    {
      code: 'UN.',
      title: 'Unani Medicine',
      tagline: 'Mizaj & Diet Therapy',
      principles: [
        'Mizaj (constitutional temperament) assessment',
        'Balancing Akhlat (four humors) through herbs and diet',
        'Supporting Tabiat (innate self-healing capacity)',
      ],
      description:
        'Classical Unani temperament evaluation and diet therapy designed to restore constitutional balance.',
    },
    {
      code: 'NA.',
      title: 'Naturopathy',
      tagline: 'Lifestyle & Nutrition',
      principles: [
        'Individualized lifestyle and nutrition counseling',
        'Non-invasive, supportive care tailored to daily habits',
        'Complementary guidance alongside conventional medicine',
      ],
      description:
        'Practical lifestyle, sleep, and nutrition protocols that reinforce natural recovery without invasive intervention.',
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
  whoAlignment: [
    'Safe and effective traditional medicine practice',
    'Zero misinformation or unsafe preparations',
    'Respect for regional biodiversity and botanical heritage',
    'Structured clinical documentation and follow-up',
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
  legalStatement:
    "Safi Natural Care Clinic operates in accordance with Afghanistan's Ministry of Public Health regulations as a complementary outpatient service. It does not replace emergency or conventional medical care.",
  publicHealthInitiatives: [
    'Preventive nutrition and herbal safety education',
    'Clean clinical record-keeping and observational follow-up',
    'Responsible sourcing of regional Afghan botanicals',
    'Collaborative referrals with conventional physicians',
  ],
};

export const PRACTITIONERS: Practitioner[] = [
  {
    id: 'prac-hafizullah',
    name: 'Dr. Hafizullah Safi',
    title: 'Founder & Director · Lead Practitioner',
    degrees: 'Herbal Medicine · Unani Mizaj · Naturopathy',
    specialties: [
      'Unani Mizaj Diagnostics',
      'Herbal Phytotherapy',
      'Naturopathic Nutrition',
      'Traditional Acupuncture',
    ],
    bio: 'Founder & Director of Safi Natural Care in Kabul, Dr. Hafizullah Safi oversees outpatient consultations, custom botanical compounding, and patient safety protocols.',
    experienceYears: 18,
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    rating: 5.0,
    reviewsCount: 388,
  },
  {
    id: 'prac-clinical-team',
    name: 'Safi Clinical Care Team',
    title: 'Unani, Phytotherapy & Acupuncture Unit',
    degrees: 'Outpatient Dispensary & Regimenal Care · Kabul',
    specialties: [
      'Digestive & Metabolic Care',
      'Joint & Musculoskeletal Support',
      'Preventive Health Counseling',
    ],
    bio: 'Our Kabul clinical and apothecary staff handle daily follow-ups, dispensary compounding, QR intake triage, and supportive outpatient therapies.',
    experienceYears: 12,
    imageUrl: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.11_PM__1__6b058c47.jpeg',
    rating: 4.95,
    reviewsCount: 214,
  },
];

export const CONSULTATION_SERVICES: ConsultationService[] = [
  {
    id: 'srv-comprehensive',
    title: 'Master Herbal & Unani Consultation',
    duration: '60 minutes',
    price: 140,
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
  {
    id: 'srv-digestive',
    title: 'Digestive & Metabolic Care Consultation',
    duration: '50 minutes',
    price: 125,
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
  {
    id: 'srv-pain-arthritis',
    title: 'Musculoskeletal, Joint & Acupuncture Therapy',
    duration: '50 minutes',
    price: 130,
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
  {
    id: 'srv-stress-sleep',
    title: 'Stress, Sleep & Lifestyle Counseling',
    duration: '45 minutes',
    price: 115,
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
  {
    id: 'srv-skin',
    title: 'Therapeutic Skin & Hair Care Consultation',
    duration: '45 minutes',
    price: 120,
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
  {
    id: 'srv-hijama',
    title: 'Hijama (Wet Cupping) & Traditional Acupuncture',
    duration: '60 minutes',
    price: 150,
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
  {
    id: 'srv-hormonal',
    title: 'Hormonal & Reproductive Health Support',
    duration: '60 minutes',
    price: 145,
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
  {
    id: 'srv-followup',
    title: 'Follow-Up & Preventive Health Education',
    duration: '30 minutes',
    price: 65,
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
];

export const HERBAL_PRODUCTS: HerbalProduct[] = [
  {
    id: 'prod-hormone-balance',
    name: 'Safi Hormone Balance',
    subtitle: "Vitex, Shatavari & Lady's Mantle Endocrine Drops",
    category: "Women's Health & Hormonal Wellness",
    price: 42.0,
    originalPrice: 49.0,
    rating: 4.97,
    reviewsCount: 164,
    inStock: true,
    isPopular: true,
    image: amberElixirImg,
    volumeOrWeight: '60ml / 2.0 fl oz amber dropper',
    shortDescription:
      'Signature Unani endocrine formula supporting cycle regularity, luteal warmth, and natural hormonal equilibrium.',
    detailedDescription:
      'Compounded by Safi Natural Care in Kabul for women navigating cycle irregularity, PMS discomfort, and perimenopausal transitions without synthetic hormones.',
    botanicalIngredients: [
      { commonName: 'Chaste Tree Berry', botanicalName: 'Vitex agnus-castus', action: 'Progesterone & Cycle Rhythm' },
      { commonName: 'Shatavari Root', botanicalName: 'Asparagus racemosus', action: 'Reproductive Tonic' },
      { commonName: 'Afghan Saffron', botanicalName: 'Crocus sativus', action: 'Mood & Pelvic Circulation' },
    ],
    keyBenefits: [
      'Supports balanced menstrual cycle timing',
      'Eases premenstrual cramping and mood shifts',
      'Alcohol-free cold glycerite extraction',
    ],
    suggestedUse: 'Take 30 drops (1 full dropper) in warm water twice daily with food.',
    precautions: 'Discontinue during pregnancy unless advised by your practitioner.',
    certifications: ['Safi Signature Formula', 'Alcohol-Free', 'Lab Verified'],
  },
  {
    id: 'prod-chill-af',
    name: 'Safi Chill AF',
    subtitle: 'Rapid Nervous Calm, Cortisol & Deep Rest Elixir',
    category: 'Stress, Sleep & Neurological Wellness',
    price: 39.0,
    originalPrice: 46.0,
    rating: 4.98,
    reviewsCount: 218,
    inStock: true,
    isPopular: true,
    image: heroApothecaryImg,
    volumeOrWeight: '50ml / 1.7 fl oz dropper',
    shortDescription:
      'Fast-acting herbal calm drops blending Lemon Balm, Passionflower, L-Theanine botanical green leaf, and Blue Skullcap.',
    detailedDescription:
      'Crafted for acute nervous tension, overthinking, and restless evenings. Calms sympathetic overdrive within 20 minutes without daytime grogginess.',
    botanicalIngredients: [
      { commonName: 'Lemon Balm Leaf', botanicalName: 'Melissa officinalis', action: 'Calm Focus & GABA Support' },
      { commonName: 'Passionflower Herb', botanicalName: 'Passiflora incarnata', action: 'Quiets Mental Chatter' },
      { commonName: 'Blue Skullcap', botanicalName: 'Scutellaria lateriflora', action: 'Nervous Tension Relief' },
    ],
    keyBenefits: [
      'Settles racing thoughts without sedation',
      'Supports steady evening wind-down',
      'Clean mint-botanical taste',
    ],
    suggestedUse: 'Take 25–35 drops under the tongue or in herbal tea during high stress or 30 minutes before sleep.',
    precautions: 'Consult your practitioner if combining with prescription sedatives.',
    certifications: ['Safi Signature Formula', 'Non-Habit Forming', 'Vegan'],
  },
  {
    id: 'prod-beauty-drops',
    name: 'Safi Beauty Drops',
    subtitle: 'Therapeutic Skin Barrier, Hair & Antioxidant Drops',
    category: 'Immunity & General Wellness',
    price: 45.0,
    originalPrice: 54.0,
    rating: 4.95,
    reviewsCount: 192,
    inStock: true,
    isPopular: true,
    image: amberElixirImg,
    volumeOrWeight: '50ml / 1.7 fl oz dropper',
    shortDescription:
      'Internal & topical sea-buckthorn, rosehip, nettle seed, and nigella cellular nourishment for resilient skin and hair.',
    detailedDescription:
      'Formulated to support skin clarity, hair follicle nutrition, and omega-7 lipid repair from within as part of therapeutic dermatological care.',
    botanicalIngredients: [
      { commonName: 'Sea Buckthorn Berry', botanicalName: 'Hippophae rhamnoides', action: 'Omega-7 Dermal Repair' },
      { commonName: 'Rosehip Seed Extract', botanicalName: 'Rosa canina', action: 'Vitamin C Collagen Support' },
      { commonName: 'Stinging Nettle Seed', botanicalName: 'Urtica dioica', action: 'Hair & Mineral Vitality' },
    ],
    keyBenefits: [
      'Nourishes dry skin barrier and scalp health',
      'Rich in natural carotenoids and omega fatty acids',
      'Zero synthetic fragrance or mineral oil',
    ],
    suggestedUse: 'Take 20 drops daily in water or juice, or apply 3 drops directly onto clean skin at night.',
    precautions: 'Patch test before topical application on highly sensitive skin.',
    certifications: ['Cold-Pressed Purity', 'Zero Synthetics', 'Safi Original'],
  },
  {
    id: 'prod-black-seed',
    name: 'Safi Royal Black Seed Elixir',
    subtitle: 'Cold-Pressed Nigella Sativa Oil (Extra Virgin)',
    category: 'Cardiometabolic Wellness',
    price: 38.0,
    originalPrice: 45.0,
    rating: 4.98,
    reviewsCount: 382,
    inStock: true,
    isPopular: true,
    image: heroApothecaryImg,
    volumeOrWeight: '100ml / 3.4 fl oz bottle',
    shortDescription:
      'Unfiltered, cold-pressed black cumin seed oil containing 2.8% natural Thymoquinone for metabolic and vascular support.',
    detailedDescription:
      'Cold-pressed under 35°C using traditional extraction standards to preserve volatile thymoquinone and essential fatty acids.',
    botanicalIngredients: [
      { commonName: 'Black Cumin Seed', botanicalName: 'Nigella sativa', action: 'Metabolic & Immune Resilience' },
      { commonName: 'Natural Tocopherol', botanicalName: 'Helianthus annuus', action: 'Lipid Antioxidant' },
    ],
    keyBenefits: [
      'Supports healthy lipid & glucose metabolism',
      'Fortifies respiratory and immune resistance',
      'Cold-pressed without chemical solvents',
    ],
    suggestedUse: 'Take 1 teaspoon (5ml) daily in the morning with raw honey or lukewarm water.',
    precautions: 'Consult your practitioner if pregnant or taking anticoagulants.',
    certifications: ['100% Certified Organic', 'Cold-Pressed', 'Lab Tested'],
  },
  {
    id: 'prod-shilajit-gold',
    name: 'Pure Himalayan Shilajit Gold Resin',
    subtitle: 'Purified Grade-A Mineral Pitch',
    category: 'Male Wellness & Fertility',
    price: 58.0,
    originalPrice: 68.0,
    rating: 5.0,
    reviewsCount: 412,
    inStock: true,
    isPopular: false,
    image: resinBalmImg,
    volumeOrWeight: '30g / 1.05 oz glass jar',
    shortDescription:
      'High-altitude purified Shilajit resin rich in 78% fulvic acid and ionic trace minerals for stamina and male vitality.',
    detailedDescription:
      'Solar-purified mineral pitch standardized for heavy-metal safety to support cellular energy, reproductive strength, and recovery.',
    botanicalIngredients: [
      { commonName: 'Purified Black Shilajit', botanicalName: 'Asphaltum punjabianum', action: 'Mitochondrial Vitality' },
      { commonName: 'Fulvic Mineral Complex', botanicalName: 'Natural humic extract', action: 'Trace Mineral Absorption' },
    ],
    keyBenefits: [
      'Supports male vitality, endurance, and recovery',
      'Provides 84+ ionic trace minerals',
      'Independently tested heavy-metal free',
    ],
    suggestedUse: 'Dissolve a pea-sized portion (300mg) in warm spring water or milk each morning.',
    precautions: 'Use only filtered/spring water. Store sealed away from moisture.',
    certifications: ['Heavy Metal Free', 'Authentic Mountain Sourced'],
  },
  {
    id: 'prod-gut-tea',
    name: 'FloraSoothe Digestive Botanical Tea',
    subtitle: 'Clinical Herbal Loose-Leaf Infusion',
    category: 'Digestive & Gastrointestinal Wellness',
    price: 26.0,
    rating: 4.88,
    reviewsCount: 165,
    inStock: true,
    image: heroApothecaryImg,
    volumeOrWeight: '120g / 4.2 oz tin',
    shortDescription:
      'Marshmallow root, Egyptian Chamomile, Fennel seed, and DGL Licorice blend for gastric comfort and bloating relief.',
    detailedDescription:
      'High-mucilage botanical infusion crafted to coat irritated stomach lining, ease post-meal fullness, and calm enteric spasms.',
    botanicalIngredients: [
      { commonName: 'Marshmallow Root', botanicalName: 'Althaea officinalis', action: 'Demulcent Mucosal Shield' },
      { commonName: 'Chamomile Blossoms', botanicalName: 'Matricaria recutita', action: 'Antispasmodic' },
      { commonName: 'Sweet Fennel Seeds', botanicalName: 'Foeniculum vulgare', action: 'Carminative Gas Relief' },
    ],
    keyBenefits: [
      'Cools stomach acidity and burning naturally',
      'Reduces post-meal bloating and gas',
      'Naturally caffeine-free',
    ],
    suggestedUse: 'Steep 1 heaping tablespoon in 8 oz hot water covered for 12 minutes before or after meals.',
    precautions: 'Take 1 hour apart from pharmaceutical tablets.',
    certifications: ['100% Organic', 'Caffeine Free'],
  },
  {
    id: 'prod-joint-balm',
    name: 'Joint-Flex Boswellia & Turmeric Balm',
    subtitle: 'Topical Herbal Heat & Mobility Compress Salve',
    category: 'Bone, Joint & Pain Management',
    price: 36.0,
    originalPrice: 42.0,
    rating: 4.92,
    reviewsCount: 198,
    inStock: true,
    image: resinBalmImg,
    volumeOrWeight: '80g / 2.8 oz glass jar',
    shortDescription:
      'Frankincense resin, 95% curcuminoids, arnica, and camphor infused in organic beeswax for stiff joints and sore muscles.',
    detailedDescription:
      'Traditional Unani topical compress delivering localized anti-inflammatory relief to knees, lower back, shoulders, and neck.',
    botanicalIngredients: [
      { commonName: 'Frankincense Resin', botanicalName: 'Boswellia serrata', action: 'Joint Comfort Modulator' },
      { commonName: 'Turmeric Root', botanicalName: 'Curcuma longa', action: 'Tissue Soothing' },
      { commonName: 'Mountain Arnica', botanicalName: 'Arnica montana', action: 'Strain & Stiffness Relief' },
    ],
    keyBenefits: [
      'Eases morning joint stiffness',
      'Supports recovery after physical strain',
      'Zero petroleum or synthetic fragrance',
    ],
    suggestedUse: 'Massage gently into affected joints 2–3 times daily.',
    precautions: 'For external use only. Avoid broken skin and eyes.',
    certifications: ['Wildcrafted Resins', 'Zero Petroleum'],
  },
  {
    id: 'prod-renal-drops',
    name: 'Safi Uricleanse Renal & Bladder Drops',
    subtitle: 'Chanca Piedra, Nettle Leaf & Corn Silk Extract',
    category: 'Kidney & Urinary Wellness',
    price: 34.0,
    rating: 4.91,
    reviewsCount: 112,
    inStock: true,
    image: amberElixirImg,
    volumeOrWeight: '60ml / 2.0 fl oz dropper',
    shortDescription:
      'Gentle soothing urinary-tract tonic supporting healthy kidney filtration, uric acid balance, and bladder comfort.',
    detailedDescription:
      'Formulated in our Kabul dispensary with classic diuretic and demulcent botanicals to maintain clear urinary comfort and mineral balance.',
    botanicalIngredients: [
      { commonName: 'Chanca Piedra', botanicalName: 'Phyllanthus niruri', action: 'Renal Mineral Balance' },
      { commonName: 'Corn Silk', botanicalName: 'Zea mays', action: 'Urinary Tract Demulcent' },
      { commonName: 'Nettle Leaf', botanicalName: 'Urtica dioica', action: 'Gentle Diuretic Support' },
    ],
    keyBenefits: [
      'Supports comfortable urinary flow',
      'Helps maintain balanced uric acid filtration',
      'Soothing alcohol-free liquid extract',
    ],
    suggestedUse: 'Mix 30 drops into a large glass of spring water twice daily.',
    precautions: 'Maintain adequate water intake. Consult practitioner for diagnosed renal disease.',
    certifications: ['Alcohol-Free', 'Quality Tested'],
  },
  {
    id: 'prod-liver-tonic',
    name: 'Safi Hepatox Liver & Bile Bitter Tonic',
    subtitle: 'Milk Thistle Seed, Chicory Root & Dandelion Extract',
    category: 'Liver & Detox Wellness',
    price: 37.0,
    rating: 4.93,
    reviewsCount: 146,
    inStock: true,
    image: heroApothecaryImg,
    volumeOrWeight: '100ml / 3.4 fl oz bottle',
    shortDescription:
      'Traditional Unani hepatic tonic featuring Silymarin-rich Milk Thistle and roasted Chicory root for liver clarity.',
    detailedDescription:
      'Supports natural bile flow, hepatic enzyme resilience, and clear digestion after rich meals.',
    botanicalIngredients: [
      { commonName: 'Milk Thistle Seed', botanicalName: 'Silybum marianum', action: 'Hepatocyte Protection' },
      { commonName: 'Chicory Root (Kasni)', botanicalName: 'Cichorium intybus', action: 'Unani Liver Cooling' },
      { commonName: 'Dandelion Root', botanicalName: 'Taraxacum officinale', action: 'Healthy Bile Flow' },
    ],
    keyBenefits: [
      'Supports healthy liver detoxification pathways',
      'Relieves sluggishness after heavy meals',
      'Classical Unani Kasni formulation',
    ],
    suggestedUse: 'Take 1 teaspoon (5ml) in lukewarm water 15 minutes before meals.',
    precautions: 'Consult practitioner if pregnant or managing bile-duct obstruction.',
    certifications: ['100% Organic Herbs', 'Unani Tradition'],
  },
  {
    id: 'prod-ashwagandha',
    name: 'Safi KSM-66 & Saffron Vitality Tonic',
    subtitle: 'Full-Spectrum Organic Adaptogenic Elixir',
    category: 'Stress, Sleep & Neurological Wellness',
    price: 44.0,
    originalPrice: 52.0,
    rating: 4.95,
    reviewsCount: 247,
    inStock: true,
    image: amberElixirImg,
    volumeOrWeight: '60ml / 2.0 fl oz dropper',
    shortDescription:
      'Clinical KSM-66 Ashwagandha paired with pure Afghan Saffron threads for steady stress resilience and mood clarity.',
    detailedDescription:
      'Combines standardized Withania somnifera root with Herat saffron threads to support healthy daytime cortisol curves and restful focus.',
    botanicalIngredients: [
      { commonName: 'Ashwagandha Root', botanicalName: 'Withania somnifera', action: 'Adaptogen & Stress Balance' },
      { commonName: 'Afghan Saffron Threads', botanicalName: 'Crocus sativus', action: 'Mood & Focus Support' },
    ],
    keyBenefits: [
      'Balances daily stress response naturally',
      'Supports steady energy without stimulants',
      'Pure Herat saffron infusion',
    ],
    suggestedUse: 'Take 30 drops diluted in warm water or tea twice daily.',
    precautions: 'Consult practitioner if managing hyperthyroidism.',
    certifications: ['Organic Botanicals', 'Alcohol-Free'],
  },
  {
    id: 'prod-lung-syrup',
    name: 'Broncho-Vital Lung & Throat Elixir',
    subtitle: 'Wild Thyme, Ivy Leaf & Mountain Honey Syrup',
    category: 'Immunity & General Wellness',
    price: 32.0,
    originalPrice: 38.0,
    rating: 4.93,
    reviewsCount: 174,
    inStock: true,
    image: heroApothecaryImg,
    volumeOrWeight: '200ml / 6.8 fl oz bottle',
    shortDescription:
      'Soothing bronchial syrup prepared with wild thyme, elderberry, ivy leaf, and raw mountain honey.',
    detailedDescription:
      'Clears seasonal airway congestion and soothes dry throats without drowsiness.',
    botanicalIngredients: [
      { commonName: 'Wild Mountain Thyme', botanicalName: 'Thymus vulgaris', action: 'Bronchial Ease' },
      { commonName: 'Black Elderberry', botanicalName: 'Sambucus nigra', action: 'Seasonal Immune Shield' },
      { commonName: 'Raw Mountain Honey', botanicalName: 'Mel', action: 'Throat Demulcent' },
    ],
    keyBenefits: [
      'Soothes scratchy throat and cough discomfort',
      'Non-drowsy daytime formula',
      'Preservative-free small batches',
    ],
    suggestedUse: 'Adults: 1 tablespoon 3 times daily. Children (4+): 1 teaspoon twice daily.',
    precautions: 'Contains raw honey; not suitable for infants under 12 months.',
    certifications: ['Alcohol-Free', 'Small Batch'],
  },
  {
    id: 'prod-sleep-drops',
    name: 'Somna-Calm Valerian & Skullcap Drops',
    subtitle: 'Deep Sleep Herbal Tincture',
    category: 'Stress, Sleep & Neurological Wellness',
    price: 29.0,
    rating: 4.89,
    reviewsCount: 221,
    inStock: true,
    image: amberElixirImg,
    volumeOrWeight: '50ml / 1.7 fl oz dropper',
    shortDescription:
      'Valerian root, skullcap, and passionflower tincture formulated for natural, uninterrupted sleep cycles.',
    detailedDescription:
      'Helps quiet late-night physical restlessness and supports natural sleep architecture with zero morning hangover.',
    botanicalIngredients: [
      { commonName: 'Valerian Root', botanicalName: 'Valeriana officinalis', action: 'Natural Sleep Induction' },
      { commonName: 'American Skullcap', botanicalName: 'Scutellaria lateriflora', action: 'Nervous Relaxation' },
    ],
    keyBenefits: [
      'Shortens time to fall asleep naturally',
      'Reduces middle-of-the-night waking',
      'Wake clear-headed',
    ],
    suggestedUse: 'Take 40 drops in warm water 30 minutes before bedtime.',
    precautions: 'Do not drive after taking.',
    certifications: ['Organic Certified', 'Vegan'],
  },
  {
    id: 'prod-neem-salve',
    name: 'Neem & Calendula Restorative Skin Salve',
    subtitle: 'Barrier Repair for Dry & Reactive Skin',
    category: 'Immunity & General Wellness',
    price: 28.0,
    rating: 4.96,
    reviewsCount: 189,
    inStock: true,
    image: resinBalmImg,
    volumeOrWeight: '60ml / 2.0 oz tin',
    shortDescription:
      'Cold-pressed neem seed oil, marigold calendula, and natural beeswax to calm dry, cracked, or reactive skin.',
    detailedDescription:
      'Steroid-free therapeutic skin balm protecting compromised lipid barriers on hands, elbows, and sensitive areas.',
    botanicalIngredients: [
      { commonName: 'Organic Neem Oil', botanicalName: 'Azadirachta indica', action: 'Skin Soothing & Antimicrobial' },
      { commonName: 'Calendula Oleoresin', botanicalName: 'Calendula officinalis', action: 'Barrier Recovery' },
    ],
    keyBenefits: [
      'Calms itching and dry flaking quickly',
      'Seals cracked skin naturally',
      'Free of parabens and steroids',
    ],
    suggestedUse: 'Warm a small amount between fingertips and press onto clean skin 2–4 times daily.',
    precautions: 'Natural nutty neem aroma; for external use only.',
    certifications: ['100% Botanical & Beeswax', 'Steroid Free'],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-black-seed',
    title: 'Nigella Sativa: Clinical Uses of Cold-Pressed Black Seed in Unani Medicine',
    slug: 'nigella-sativa-black-seed-oil-benefits',
    category: 'Immunity & Lungs',
    author: {
      name: 'Dr. Hafizullah Safi',
      role: 'Founder & Director, Safi Natural Care',
      avatar: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    },
    publishDate: 'November 2026',
    readTime: '5 min read',
    coverImage: heroApothecaryImg,
    summary:
      'How cold-pressed black cumin seed supports seasonal respiratory comfort, metabolic steadiness, and immune balance.',
    content: {
      introduction:
        'Within classical Unani-Tibb, Nigella sativa has long been prized for gentle warming support in sluggish digestive and bronchial constitutions. Cold extraction below 35°C protects its natural thymoquinone.',
      historicalContext:
        'Ibn Sina noted black seed for restoring vitality during seasonal fatigue and sluggishness.',
      keyHerb: {
        name: 'Black Cumin Seed',
        latinName: 'Nigella sativa',
        activeCompounds: 'Thymoquinone, Nigellone, Omega Fatty Acids',
      },
      remedyRecipe: {
        title: 'Morning Warm Honey & Black Seed Tonic',
        ingredients: [
          '1 teaspoon cold-pressed Safi Royal Black Seed Elixir',
          '1 teaspoon raw wildflower honey',
          '6 oz lukewarm spring water',
        ],
        preparationSteps: [
          'Dissolve raw honey in lukewarm (never boiling) water.',
          'Stir in the black seed oil cleanly.',
          'Drink 20 minutes before breakfast.',
        ],
        dosageAdvice: 'Suitable as a 4–6 week seasonal routine.',
      },
      clinicalInsights:
        'Best paired with clean anti-inflammatory meals and adequate hydration.',
      contraindications:
        'Avoid therapeutic doses during pregnancy; consult your practitioner if taking blood thinners.',
    },
    relatedProductId: 'prod-black-seed',
  },
  {
    id: 'blog-gut-restoration',
    title: 'Bitters and Demulcents: Calming Gastric Burning Without Suppressing Digestion',
    slug: 'gut-brain-axis-herbal-bitters-demulcents',
    category: 'Digestive Health',
    author: {
      name: 'Dr. Hafizullah Safi',
      role: 'Founder & Director, Safi Natural Care',
      avatar: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    },
    publishDate: 'October 2026',
    readTime: '6 min read',
    coverImage: clinicConsultationImg,
    summary:
      'Pairing soothing marshmallow root mucilage with gentle carminatives like fennel and chamomile for lasting gut comfort.',
    content: {
      introduction:
        'Chronic bloating and reflux often stem from irritated mucosal membranes and hurried meals. Demulcent roots coat and cool while carminatives gently move trapped gas.',
      keyHerb: {
        name: 'Marshmallow Root & Fennel',
        latinName: 'Althaea officinalis & Foeniculum vulgare',
        activeCompounds: 'Polysaccharide Mucilage, Anethole',
      },
      remedyRecipe: {
        title: 'Overnight Cold-Infusion Demulcent Tea',
        ingredients: [
          '2 tablespoons dried Marshmallow root',
          '1 teaspoon bruised Fennel seeds',
          '20 oz cool filtered water',
        ],
        preparationSteps: [
          'Steep roots and seeds in cool water overnight in a covered glass jar.',
          'Strain through fine cloth in the morning.',
          'Sip 4 oz between meals.',
        ],
        dosageAdvice: 'Sip 2–3 times daily away from heavy meals.',
      },
      clinicalInsights:
        'Cold maceration preserves viscous soothing polysaccharides.',
      contraindications:
        'Separate mucilage teas from prescription tablets by at least 1 hour.',
    },
    relatedProductId: 'prod-gut-tea',
  },
  {
    id: 'blog-boswellia-joints',
    title: 'Boswellia Resin & Turmeric: Traditional Joint Support Without Gastric Irritation',
    slug: 'boswellia-curcumin-natural-joint-relief',
    category: 'Pain & Inflammation',
    author: {
      name: 'Dr. Hafizullah Safi',
      role: 'Founder & Director, Safi Natural Care',
      avatar: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    },
    publishDate: 'October 2026',
    readTime: '5 min read',
    coverImage: resinBalmImg,
    summary:
      'How topical frankincense balms and warm compresses ease morning joint stiffness gently.',
    content: {
      introduction:
        'Frankincense resin (Boswellia serrata) and turmeric modulate inflammatory pathways while respecting stomach lining.',
      keyHerb: {
        name: 'Indian Frankincense Resin',
        latinName: 'Boswellia serrata',
        activeCompounds: 'Boswellic Acids (AKBA), Terpenes',
      },
      remedyRecipe: {
        title: 'Evening Warm Joint Compress',
        ingredients: [
          '1 tablespoon Safi Joint-Flex Balm',
          'Warm clean cotton cloth',
        ],
        preparationSteps: [
          'Warm the joint gently with a damp warm towel.',
          'Massage Joint-Flex Balm into knees or shoulders for 3 minutes.',
          'Cover loosely with warm cotton before rest.',
        ],
        dosageAdvice: 'Use 2–3 times daily for comfort.',
      },
      clinicalInsights:
        'Combining gentle warmth with topical resin improves local mobility.',
      contraindications:
        'Avoid broken skin; external use only.',
    },
    relatedProductId: 'prod-joint-balm',
  },
];

export const SYMPTOM_MATCHES: SymptomMatch[] = [
  {
    concernId: 'digestive',
    name: 'Digestive & Metabolic',
    description: 'Acid reflux, bloating, sluggish digestion, or irregular motility.',
    icon: 'Apple',
    recommendedHerbs: ['Marshmallow Root', 'Chamomile', 'Fennel Seed', 'Chicory (Kasni)'],
    matchedProducts: ['prod-gut-tea', 'prod-liver-tonic'],
    matchedServiceId: 'srv-digestive',
  },
  {
    concernId: 'pain-joints',
    name: 'Joints & Musculoskeletal',
    description: 'Knee stiffness, back tension, or joint discomfort.',
    icon: 'Bone',
    recommendedHerbs: ['Boswellia Serrata', 'Turmeric', 'Arnica', 'Acupuncture'],
    matchedProducts: ['prod-joint-balm', 'prod-shilajit-gold'],
    matchedServiceId: 'srv-pain-arthritis',
  },
  {
    concernId: 'stress-sleep',
    name: 'Stress & Sleep',
    description: 'Restless sleep, nervous tension, or daily burnout.',
    icon: 'Moon',
    recommendedHerbs: ['Lemon Balm', 'Passionflower', 'KSM-66 Ashwagandha', 'Saffron'],
    matchedProducts: ['prod-chill-af', 'prod-sleep-drops'],
    matchedServiceId: 'srv-stress-sleep',
  },
  {
    concernId: 'hormonal-wellness',
    name: 'Hormonal & Vitality',
    description: 'Cycle balance, endocrine fatigue, or male reproductive support.',
    icon: 'Heart',
    recommendedHerbs: ['Vitex Berry', 'Shatavari', 'Himalayan Shilajit', 'Afghan Saffron'],
    matchedProducts: ['prod-hormone-balance', 'prod-shilajit-gold'],
    matchedServiceId: 'srv-hormonal',
  },
  {
    concernId: 'skin-immunity',
    name: 'Skin, Hair & Respiratory',
    description: 'Dry reactive skin, seasonal coughs, or preventive support.',
    icon: 'Sparkles',
    recommendedHerbs: ['Sea Buckthorn', 'Neem & Calendula', 'Black Seed', 'Wild Thyme'],
    matchedProducts: ['prod-beauty-drops', 'prod-black-seed'],
    matchedServiceId: 'srv-skin',
  },
];

export const CLINIC_STATS = [
  { label: 'Systems of Care', value: '3' },
  { label: 'Outpatient Services', value: '8' },
  { label: 'Herbal Categories', value: '9' },
  { label: 'Est. Safi Natural Care', value: '2026' },
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    patientName: 'Ahmadullah Stanikzai',
    location: 'Kabul, Afghanistan',
    condition: 'Musculoskeletal & Knee Discomfort',
    quote:
      'Dr. Hafizullah Safi assessed my constitution thoroughly and prescribed Joint-Flex Balm alongside warm dietary habits. Within three weeks my morning stiffness eased significantly.',
    rating: 5,
    verified: true,
  },
  {
    id: 'test-2',
    patientName: 'Soraya Karimi',
    location: 'Kabul, Afghanistan',
    condition: 'Hormonal & Digestive Balance',
    quote:
      'Clear guidance with zero exaggerated promises. Safi Hormone Balance and FloraSoothe Tea helped stabilize my digestion and monthly comfort comfortably.',
    rating: 5,
    verified: true,
  },
  {
    id: 'test-3',
    patientName: 'Mirwais Rahimi',
    location: 'Kabul, Afghanistan',
    condition: 'Chronic Stress & Sleep Quality',
    quote:
      'Safi Chill AF and the lifestyle counseling plan helped calm my evening restlessness without morning grogginess. Respectful, organized clinic.',
    rating: 5,
    verified: true,
  },
];

export const CLINIC_PRESENTATION_SLIDES: ClinicPresentationSlide[] = [
  {
    id: 'slide-profile',
    title: 'Founder & Clinic Profile',
    subtitle: 'Dr. Hafizullah Safi · Kabul, Afghanistan',
    category: 'Overview',
    description: 'Safi Natural Care Clinic · Main Airport Road, Charahi Shaheed & PD#10, Qalai Fathullah, Kabul.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
    highlights: ['Dr. Hafizullah Safi', 'Outpatient Care', 'Est. April 2026'],
  },
  {
    id: 'slide-overview',
    title: 'Executive Clinic Overview',
    subtitle: 'Outpatient Traditional & Natural Medicine',
    category: 'Overview',
    description: 'Non-invasive, supportive care through Herbal Medicine, Unani Medicine, and Naturopathy.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM__1__bd974087.jpeg',
    highlights: ['Patient Safety', 'Informed Consent', 'TCIM Scope'],
  },
  {
    id: 'slide-vision-mission',
    title: 'Vision & Mission',
    subtitle: 'Safe & Ethical Care',
    category: 'Governance',
    description: 'Accessible herbal, Unani, and naturopathic outpatient services harmonized with public health principles.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.11_PM_351ed87f.jpeg',
    highlights: ['Community Health', 'Clear Boundaries', 'Patient Dignity'],
  },
  {
    id: 'slide-systems',
    title: 'Herbal & Unani Systems',
    subtitle: 'Phytotherapy & Mizaj Principles',
    category: 'Clinical Systems',
    description: 'Botanical identification alongside classical Mizaj (temperament), Akhlat, and Tabiat balance.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.11_PM__1__6b058c47.jpeg',
    highlights: ['Phytotherapy', 'Mizaj Assessment', 'Safe Preparations'],
  },
  {
    id: 'slide-naturopathy',
    title: 'Naturopathy Principles',
    subtitle: 'Lifestyle & Nutrition Counseling',
    category: 'Clinical Systems',
    description: 'Non-invasive dietary and daily habit guidance supporting the body’s natural self-healing capacity.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.12_PM_21a4a40f.jpeg',
    highlights: ['Nutrition Support', 'Daily Routine', 'Non-Invasive'],
  },
  {
    id: 'slide-faith',
    title: 'Faith & Healing',
    subtitle: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    category: 'Philosophy',
    description: 'او کله چ زه ناروغ شم، نو همغه ما ته شفا راكوي ( الله ) — Ash-Shu’ara 26:80.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.12_PM__1__58ecb67b.jpeg',
    highlights: ["Ash-Shu'ara 26:80", 'Ethical Healing', 'Compassion'],
  },
  {
    id: 'slide-scope',
    title: 'Outpatient Clinical Scope',
    subtitle: '8 Core Service Areas',
    category: 'Services',
    description: 'Digestive, musculoskeletal, stress, hormonal, respiratory/urological, skin/hair, preventive care, and acupuncture.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.13_PM_008084f0.jpeg',
    highlights: ['8 Services', 'Acupuncture', 'Outpatient Care'],
  },
  {
    id: 'slide-safety-ethics',
    title: 'Safety & Quality Assurance',
    subtitle: 'Informed Consent & Documentation',
    category: 'Ethics & QA',
    description: 'No exaggerated claims, clear referrals, and structured case follow-up.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.13_PM__1__d11577d4.jpeg',
    highlights: ['Zero Exaggeration', 'Structured Records', 'Patient Autonomy'],
  },
  {
    id: 'slide-who',
    title: 'WHO TCIM Alignment',
    subtitle: 'Safe Traditional Medicine Standards',
    category: 'WHO Alignment',
    description: 'Promoting safe traditional practice, biodiversity stewardship, and honest patient education.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.13_PM__2__8f2e5377.jpeg',
    highlights: ['WHO TCIM', 'Botanical Safety', 'Anti-Misinformation'],
  },
  {
    id: 'slide-public-health',
    title: 'Community Health Education',
    subtitle: 'Preventive Wellness',
    category: 'Public Health',
    description: 'Preventive nutrition guidance and responsible collaboration with traditional medicine networks.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.14_PM_d01df245.jpeg',
    highlights: ['Preventive Care', 'Case Records', 'Public Education'],
  },
  {
    id: 'slide-legal',
    title: 'Ministry of Health Compliance',
    subtitle: 'Regulatory Scope Statement',
    category: 'Legal',
    description: 'Complementary outpatient practice compliant with Afghanistan Ministry of Public Health regulations.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.14_PM__1__f385731b.jpeg',
    highlights: ['MoPH Compliant', 'Complementary Scope', 'Referral Ready'],
  },
  {
    id: 'slide-contact',
    title: 'Official Contact & Offices',
    subtitle: 'Kabul, Afghanistan',
    category: 'Contact',
    description: 'Main Airport Road, Charahi Shaheed & PD#10, Qalai Fathullah · +93 780 299 299 · www.safinaturalcare.af · info@safihealthcare.com.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.15_PM_2c5bbea2.jpeg',
    highlights: ['+93 780 299 299', 'hafeez.safi@gmail.com', 'www.safinaturalcare.af'],
  },
];

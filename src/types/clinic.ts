export interface Practitioner {
  id: string;
  name: string;
  title: string;
  degrees: string;
  specialties: string[];
  bio: string;
  experienceYears: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
}

export interface ConsultationService {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  suitableFor: string[];
  treatmentIncludes: string[];
  category: 'General' | 'Chronic Care' | 'Vitality' | 'Specialized';
}

export interface HerbalProduct {
  id: string;
  name: string;
  subtitle: string;
  category: 'Tinctures & Tonics' | 'Herbal Teas' | 'Healing Salves' | 'Capsules & Extracts' | 'Resins';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isPopular?: boolean;
  image: string;
  volumeOrWeight: string;
  shortDescription: string;
  detailedDescription: string;
  botanicalIngredients: {
    commonName: string;
    botanicalName: string;
    action: string;
  }[];
  keyBenefits: string[];
  suggestedUse: string;
  precautions: string;
  certifications: string[];
}

export interface CartItem {
  product: HerbalProduct;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Digestive Health' | 'Immunity & Lungs' | 'Pain & Inflammation' | 'Stress & Sleep' | 'Skin & Detox';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  coverImage: string;
  summary: string;
  content: {
    introduction: string;
    historicalContext?: string;
    keyHerb: {
      name: string;
      latinName: string;
      activeCompounds: string;
    };
    remedyRecipe: {
      title: string;
      ingredients: string[];
      preparationSteps: string[];
      dosageAdvice: string;
    };
    clinicalInsights: string;
    contraindications: string;
  };
  relatedProductId?: string;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  serviceId: string;
  serviceTitle: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  timeSlot: string;
  consultationType: 'In-Clinic VIP Suite' | 'Online Telehealth Video';
  patient: {
    fullName: string;
    email: string;
    phone: string;
    gender?: string;
    age?: string;
    healthConcerns: string;
    isFirstTime: boolean;
  };
  status: 'Confirmed' | 'Pending' | 'Completed';
  totalFee: number;
  createdAt: string;
}

export interface SymptomMatch {
  concernId: string;
  name: string;
  description: string;
  icon: string;
  recommendedHerbs: string[];
  matchedProducts: string[];
  matchedServiceId: string;
}

export interface ClinicOfficialProfile {
  name: string;
  tagline: string;
  facilityType: string;
  country: string;
  city: string;
  field: string;
  website: string;
  email: string;
  phone: string;
  formattedPhone: string;
  faithAndHealing: {
    arabic: string;
    pashto: string;
    english: string;
  };
  overview: string;
  tcimScope: string;
  vision: string;
  mission: string[];
  systemsOfMedicine: {
    title: string;
    tagline: string;
    principles: string[];
    description: string;
  }[];
  safetyEthics: {
    title: string;
    desc: string;
  }[];
  whoAlignment: string[];
  scopeOfServices: {
    title: string;
    category: string;
    description: string;
  }[];
  legalStatement: string;
  publicHealthInitiatives: string[];
}

export interface ClinicPresentationSlide {
  id: string;
  title: string;
  subtitle: string;
  category:
    | 'Overview'
    | 'Governance'
    | 'Clinical Systems'
    | 'Philosophy'
    | 'Services'
    | 'Ethics & QA'
    | 'WHO Alignment'
    | 'Public Health'
    | 'Legal'
    | 'Contact';
  description: string;
  image: string;
  highlights: string[];
}

export interface PatientProtocol {
  id: number | string;
  userUid?: string;
  protocolName: string;
  prescribingDoctor: string;
  mizajTarget: string;
  primaryHerbs: string;
  formulation: string;
  dosageSchedule: string;
  instructions: string;
  dietaryAdvice?: string | null;
  contraindications?: string | null;
  status: 'Active' | 'Completed' | 'Maintenance';
  durationWeeks: number;
  adherenceRate: number;
  createdAt?: string;
}

export interface PatientOrderRecord {
  id: number | string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  itemsJson: string;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
}

export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface MedicineInventoryItem {
  id: number;
  productId: string;
  sku: string;
  barcodeQr: string;
  name: string;
  category: string;
  unitPrice: number;
  cogsPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: InventoryStatus;
  updatedAt?: string;
}

export type TransactionType = 'consultation' | 'pharmacy_sale' | 'expense';

export interface TransactionRecord {
  id: number;
  referenceNumber: string;
  type: TransactionType;
  patientId?: number | null;
  patientName?: string | null;
  description: string;
  grossAmount: number;
  cogsAmount: number;
  overheadAmount: number;
  netAmount: number;
  paymentMethod: string;
  itemsJson?: string | null;
  createdAt: string;
}

export interface PatientVisitLog {
  id: number;
  patientId: number;
  practitionerName: string;
  visitType: string;
  consultationFee: number;
  notes?: string | null;
  checkedInAt: string;
}

export interface PatientCrmProfile {
  id: number;
  qrCodeToken: string;
  userUid?: string | null;
  fullName: string;
  email?: string | null;
  phone: string;
  age?: string | null;
  gender?: string | null;
  mizaj: string;
  medicalHistory?: string | null;
  currentProtocols?: string | null;
  totalVisits: number;
  lastVisitAt?: string | null;
  createdAt: string;
  visits?: PatientVisitLog[];
}

export interface InventoryAlertLog {
  id: number;
  medicineId: number;
  medicineName: string;
  remainingStock: number;
  threshold: number;
  alertStatus: string;
  dispatchedToEmail: string;
  createdAt: string;
}

export interface ClinicConfigSettings {
  id?: number;
  clinicName: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  twitterUrl: string;
  overheadPercentage: number;
  lowStockThreshold: number;
  ownerAlertEmail: string;
  updatedAt?: string;
}


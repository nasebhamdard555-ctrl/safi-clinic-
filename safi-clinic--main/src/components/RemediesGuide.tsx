import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Leaf,
  Sparkles,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Activity,
  Droplets,
  Heart,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { HERBAL_PRODUCTS, BLOG_POSTS } from '../data/clinicData';
import { HerbalProduct, BlogPost } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized } from '../utils/i18n';
import { useCurrency } from '../context/CurrencyContext';

export interface RemedyGuideItem {
  id: string;
  remedyName: string;
  mainHerb: string;
  latinName: string;
  ailmentCategory: string;
  ailmentLabel: string;
  symptoms: string[];
  activeCompounds: string;
  unaniMizaj: string; // Constitutional Temperament
  preparationMethod: string;
  clinicalAction: string;
  dosage: string;
  blogPostId?: string;
  productId?: string;
}

export const REMEDIES_DATABASE: RemedyGuideItem[] = [
  {
    id: 'rem-black-seed',
    remedyName: 'Royal Black Seed Immune & Bronchial Elixir',
    mainHerb: 'Black Cumin Seed',
    latinName: 'Nigella sativa',
    ailmentCategory: 'respiratory',
    ailmentLabel: 'Respiratory & Immunity',
    symptoms: ['Seasonal Allergies', 'Bronchial Congestion', 'Chronic Phlegm', 'Low Resistance'],
    activeCompounds: 'Thymoquinone (2.8%), Nigellone, Alpha-Hederin',
    unaniMizaj: 'Hot & Dry (2nd Degree) — Rekindles innate metabolic heat (Hararat Ghareezia)',
    preparationMethod: 'Virgin cold-pressed extraction under 35°C without solvent degradation.',
    clinicalAction: 'Mast cell stabilizer, bronchodilator, anti-inflammatory cytokine regulator',
    dosage: '1 teaspoon (5ml) daily with lukewarm wildflower honey water.',
    blogPostId: 'blog-black-seed',
    productId: 'prod-black-seed',
  },
  {
    id: 'rem-marshmallow',
    remedyName: 'Demulcent Mucilage Cold-Infusion Protocol',
    mainHerb: 'Marshmallow Root',
    latinName: 'Althaea officinalis',
    ailmentCategory: 'digestive',
    ailmentLabel: 'Digestive & Gastric Health',
    symptoms: ['Acid Reflux / GERD', 'Gastric Burning', 'Bloating', 'Esophageal Irritation'],
    activeCompounds: 'Complex Mucilage Polysaccharides, Flavonoids, Pectin',
    unaniMizaj: 'Cold & Moist (1st Degree) — Calms excessive hot-bilious stomach fires',
    preparationMethod: 'Overnight cold-maceration (8-10 hrs in filtered cold water; never boil).',
    clinicalAction: 'Forms physical soothing barrier coating gastrointestinal epithelium',
    dosage: '4 to 6 oz sipped lukewarm 20 minutes before meals.',
    blogPostId: 'blog-gut-restoration',
    productId: 'prod-gut-tea',
  },
  {
    id: 'rem-boswellia',
    remedyName: 'Thermal Frankincense & Curcumin Joint Compress',
    mainHerb: 'Boswellia Resin (Frankincense)',
    latinName: 'Boswellia serrata',
    ailmentCategory: 'joints',
    ailmentLabel: 'Joints & Arthritis',
    symptoms: ['Joint Swelling', 'Morning Stiffness', 'Osteoarthritis', 'Cartilage Wear'],
    activeCompounds: 'AKBA (Acetyl-11-keto-beta-boswellic acid), Curcuminoids, Terpenes',
    unaniMizaj: 'Hot & Dry (1st Degree) — Disperses cold phleghmatic humoral stagnation in joints',
    preparationMethod: 'Gentle lipophilic infusion into organic beeswax, shea butter, and arnica.',
    clinicalAction: 'Specific 5-Lipoxygenase (5-LOX) inhibitor; preserves synovial fluid',
    dosage: 'Massage dime-sized salve into affected joint followed by 20-min warm flannel wrap.',
    blogPostId: 'blog-boswellia-joints',
    productId: 'prod-joint-balm',
  },
  {
    id: 'rem-ashwagandha',
    remedyName: 'KSM-66 & Afghan Saffron Adrenal Neuro-Reset',
    mainHerb: 'Ashwagandha Root',
    latinName: 'Withania somnifera',
    ailmentCategory: 'stress',
    ailmentLabel: 'Stress & Insomnia',
    symptoms: ['Racing Thoughts / Anxiety', 'Broken REM Sleep', 'Adrenal Burnout', 'Afternoon Fatigue'],
    activeCompounds: 'Withanolides (5%), Safranal, Crocin, Rosavins',
    unaniMizaj: 'Warm & Dry (1st Degree) — Nourishes depleted nervous vital force (Ruh)',
    preparationMethod: 'Full-spectrum milk-steeped alcohol-free vegetable glycerite.',
    clinicalAction: 'Bidirectional HPA-axis regulator; elevates GABA neurotransmitter tone',
    dosage: '30 drops in warm water or herbal tea twice daily, morning and dusk.',
    blogPostId: 'blog-adaptogens-burnout',
    productId: 'prod-ashwagandha',
  },
  {
    id: 'rem-shilajit',
    remedyName: 'Purified Himalayan Mineral Pitch Rejuvenator',
    mainHerb: 'Shilajit (Mumijo)',
    latinName: 'Asphaltum punjabianum',
    ailmentCategory: 'vitality',
    ailmentLabel: 'Vitality & Metabolism',
    symptoms: ['Chronic Exhaustion', 'Muscle Weakness', 'Brain Fog', 'Low Libido'],
    activeCompounds: 'Fulvic Acid (78%), Humic Acid, 84+ Ionic Trace Minerals',
    unaniMizaj: 'Hot & Dry (2nd Degree) — Universal rejuvenator (Muqawwi-e-Aam)',
    preparationMethod: 'Solar-purified through traditional Triphala decoction at 18,000ft altitude.',
    clinicalAction: 'Ignites mitochondrial ATP bio-energetics; enhances nutrient delivery',
    dosage: 'Pea-sized dab (300-500mg) dissolved in warm raw milk or spring water.',
    blogPostId: 'blog-black-seed',
    productId: 'prod-shilajit-gold',
  },
  {
    id: 'rem-neem',
    remedyName: 'Neem Seed & Calendula Barrier Salve',
    mainHerb: 'Neem Seed & Calendula',
    latinName: 'Azadirachta indica & Calendula officinalis',
    ailmentCategory: 'skin',
    ailmentLabel: 'Skin & Dermatology',
    symptoms: ['Itching Flare-ups', 'Plaque Psoriasis', 'Cracked Eczema', 'Scalp Flaking'],
    activeCompounds: 'Azadirachtin, Nimbin, Quercetin, Calendulosides',
    unaniMizaj: 'Cold & Dry (1st Degree) — Purifies systemic blood heat and soothes erythema',
    preparationMethod: 'Cold-pressed virgin neem unrefined oil blended with solar-infused marigolds.',
    clinicalAction: 'Non-steroidal anti-pruritic, antimicrobial, accelerates epithelialization',
    dosage: 'Warm between clean fingertips and press gently onto affected dermis 2-3x daily.',
    blogPostId: 'blog-gut-restoration',
    productId: 'prod-neem-salve',
  },
  {
    id: 'rem-valerian',
    remedyName: 'Somna-Calm Valerian & Blue Skullcap Infusion',
    mainHerb: 'Valerian Root & Skullcap',
    latinName: 'Valeriana officinalis & Scutellaria lateriflora',
    ailmentCategory: 'stress',
    ailmentLabel: 'Stress & Insomnia',
    symptoms: ['Sleep Latency / Tossing', 'Muscle Restlessness', 'Nighttime Anxiety', 'Spastic Tension'],
    activeCompounds: 'Valerenic Acid, Scutellarin, Baicalin, Volatile Terpenoids',
    unaniMizaj: 'Warm & Dry (2nd Degree) — Resolves cerebral wind and spastic tensions',
    preparationMethod: 'Fresh whole root tincture macerated in dark glass apothecary flagons.',
    clinicalAction: 'Positive allosteric GABA-A receptor modulator; reduces sleep onset delay',
    dosage: '40 drops in 2 oz warm water 30 minutes before sleep.',
    blogPostId: 'blog-adaptogens-burnout',
    productId: 'prod-sleep-drops',
  },
];

interface RemediesGuideProps {
  onSelectBlogSlug?: (slug: string) => void;
  onSelectShopProduct?: (productId: string) => void;
  onAddToCart?: (product: HerbalProduct, quantity?: number) => void;
}

export const RemediesGuide: React.FC<RemediesGuideProps> = ({
  onSelectBlogSlug,
  onSelectShopProduct,
  onAddToCart,
}) => {
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const tx = <T,>(en: T, ps: T, fa: T) => pickLocalized(language, { en, ps, fa });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAilment, setSelectedAilment] = useState('all');
  const [selectedHerb, setSelectedHerb] = useState('all');
  const [selectedSymptom, setSelectedSymptom] = useState('all');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Extract unique herbs & symptoms for dynamic filters
  const allHerbs = useMemo(() => {
    const list = Array.from(new Set(REMEDIES_DATABASE.map((r) => r.mainHerb)));
    return ['all', ...list];
  }, []);

  const allSymptoms = useMemo(() => {
    const set = new Set<string>();
    REMEDIES_DATABASE.forEach((r) => r.symptoms.forEach((s) => set.add(s)));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered entries
  const filteredRemedies = useMemo(() => {
    return REMEDIES_DATABASE.filter((rem) => {
      // Ailment filter
      if (selectedAilment !== 'all' && rem.ailmentCategory !== selectedAilment) {
        return false;
      }
      // Herb filter
      if (selectedHerb !== 'all' && rem.mainHerb !== selectedHerb) {
        return false;
      }
      // Symptom filter
      if (selectedSymptom !== 'all' && !rem.symptoms.includes(selectedSymptom)) {
        return false;
      }
      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = rem.remedyName.toLowerCase().includes(q);
        const matchesHerb = rem.mainHerb.toLowerCase().includes(q) || rem.latinName.toLowerCase().includes(q);
        const matchesAilment = rem.ailmentLabel.toLowerCase().includes(q);
        const matchesSymptoms = rem.symptoms.some((s) => s.toLowerCase().includes(q));
        const matchesAction = rem.clinicalAction.toLowerCase().includes(q);
        return matchesName || matchesHerb || matchesAilment || matchesSymptoms || matchesAction;
      }
      return true;
    });
  }, [selectedAilment, selectedHerb, selectedSymptom, searchQuery]);

  // Helper to resolve linked product & blog
  const getLinkedProduct = (productId?: string): HerbalProduct | undefined => {
    if (!productId) return undefined;
    return HERBAL_PRODUCTS.find((p) => p.id === productId);
  };

  const getLinkedBlogPost = (blogPostId?: string): BlogPost | undefined => {
    if (!blogPostId) return undefined;
    return BLOG_POSTS.find((b) => b.id === blogPostId);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0c2214] via-[#081b10] to-[#040e08] border border-[#d4af37]/50 p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1f4334] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.blog.pharmKicker}</span>
          </div>
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            {tx('Interactive Herbal Remedies Guide', 'د بوټو درملو متقابل لارښود', 'راهنمای تعاملی درمان‌های گیاهی')}
          </h2>
          <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
            {tx(
              'Filter our clinical herbal dispensary and journal by specific health ailment, symptom, or primary medicinal herb. Every monograph connects traditional Unani Mizaj concepts with verified clinical formulations.',
              'زموږ د درملتون او مجلې بوټي درمل د ناروغۍ، نښې یا اصلي بوټي له مخې وپلټئ.',
              'داروهای گیاهی دواخانه و مقالات کلینیکی ما را بر اساس بیماری، علائم یا گیاه اصلی فیلتر کنید.'
            )}
          </p>
        </div>

        <div className="text-end text-xs text-[#d4af37] tabular-nums" dir="ltr">
          <span className="font-bold text-[#f5f3ec]">{filteredRemedies.length}</span> / {REMEDIES_DATABASE.length}
        </div>
      </div>

      {/* Interactive Filter Controls Bar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute start-4 top-1/2 -translate-y-1/2 text-[#8da396]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tx(
              'Search remedy by symptom (e.g. acid reflux, joint stiffness, insomnia) or botanical herb...',
              'درمل د نښې یا طبیعي بوټي له مخې ولټوئ...',
              'جستجوی دارو بر اساس علائم یا نام گیاه...'
            )}
            className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-[#05130b] border border-[#234b3c] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder:text-[#52705e] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-xs text-[#8da396] hover:text-white cursor-pointer"
            >
              {tx('Clear', 'پاکول', 'پاک کردن')}
            </button>
          )}
        </div>

        {/* Multi-axis Filter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Ailment Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{tx('Filter by Common Ailment', 'د ناروغۍ له مخې فلټر', 'فیلتر بر اساس بیماری')}</span>
            </label>
            <select
              value={selectedAilment}
              onChange={(e) => setSelectedAilment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#05130b] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="all">{tx('All Common Ailments', 'ټولې ناروغۍ', 'همه بیماری‌ها')}</option>
              <option value="digestive">{tx('Digestive & Gastric Health', 'هاضمه او معده', 'هاضمه و معده')}</option>
              <option value="joints">{tx('Joints & Arthritis', 'بندونه او ارتریتس', 'مفاصل و آرتروز')}</option>
              <option value="stress">{tx('Stress, Burnout & Insomnia', 'فشار او بې خوبي', 'استرس و بی‌خوابی')}</option>
              <option value="respiratory">{tx('Respiratory & Immunity', 'تنفس او معافیت', 'تنفس و معافیت')}</option>
              <option value="skin">{tx('Skin & Eczema', 'پوست او اکزیما', 'پوست و اگزما')}</option>
              <option value="vitality">{tx('Vitality & Metabolism', 'ځواک او میتابولیزم', 'انرژی و متابولیسم')}</option>
            </select>
          </div>

          {/* Symptom Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              <span>{tx('Filter by Specific Symptom', 'د نښو له مخې فلټر', 'فیلتر بر اساس علامت')}</span>
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#05130b] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="all">{tx('All Identified Symptoms', 'ټولې نښې', 'همه علائم')}</option>
              {allSymptoms
                .filter((s) => s !== 'all')
                .map((symp) => (
                  <option key={symp} value={symp}>
                    {symp}
                  </option>
                ))}
            </select>
          </div>

          {/* Main Herb Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              <span>{tx('Filter by Main Botanical Herb', 'د اصلي بوټي له مخې فلټر', 'فیلتر بر اساس گیاه اصلی')}</span>
            </label>
            <select
              value={selectedHerb}
              onChange={(e) => setSelectedHerb(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#05130b] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="all">{tx('All Botanical Herbs', 'ټول طبیعي بوټي', 'همه گیاهان دارویی')}</option>
              {allHerbs
                .filter((h) => h !== 'all')
                .map((herb) => (
                  <option key={herb} value={herb}>
                    {herb}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quick Reset Button if filtered */}
        {(selectedAilment !== 'all' || selectedHerb !== 'all' || selectedSymptom !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-[#8da396] pt-1">
            <span>{tx('Filtered results active', 'فلټر فعال دی', 'نتایج فیلترشده فعال است')}</span>
            <button
              onClick={() => {
                setSelectedAilment('all');
                setSelectedHerb('all');
                setSelectedSymptom('all');
                setSearchQuery('');
              }}
              className="text-[#d4af37] hover:underline cursor-pointer"
            >
              {tx('Reset all filters', 'ټول فلټرونه پاک کړئ', 'بازنشانی همه فیلترها')}
            </button>
          </div>
        )}
      </div>

      {/* Remedies Result Cards */}
      {filteredRemedies.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#05130b] border border-[#234b3c] space-y-3">
          <AlertCircle className="w-8 h-8 text-[#d4af37] mx-auto" />
          <h4 className="font-serif-classic font-bold text-lg text-[#f5f3ec]">
            {tx('No remedies matched your filter combination', 'ستاسو د فلټر سره هیڅ درمل ونه موندل شول', 'هیچ درمانی مطابق فیلتر شما یافت نشد')}
          </h4>
          <p className="text-xs text-[#8da396] max-w-md mx-auto">
            {t.shop.emptySub}
          </p>
          <button
            onClick={() => {
              setSelectedAilment('all');
              setSelectedHerb('all');
              setSelectedSymptom('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#0e2118] border border-[#d4af37] text-xs text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors"
          >
            {tx('Clear Filters', 'فلټرونه پاک کړئ', 'پاک کردن فیلترها')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRemedies.map((remedy) => {
            const linkedProduct = getLinkedProduct(remedy.productId);
            const linkedBlog = getLinkedBlogPost(remedy.blogPostId);

            return (
              <div
                key={remedy.id}
                className="p-6 rounded-2xl bg-[#06170e] border border-[#234b3c] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
              >
                <div className="space-y-4">
                  {/* Top Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#0b2417] border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                      {remedy.ailmentLabel}
                    </span>
                    <span className="text-[11px] text-[#8da396] italic" dir="ltr">
                      {remedy.latinName}
                    </span>
                  </div>

                  {/* Title & Herb */}
                  <div>
                    <h3 className="font-serif-classic font-bold text-xl text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors">
                      {remedy.remedyName}
                    </h3>
                    <div className="text-xs text-[#d4af37] font-semibold mt-0.5">
                      {remedy.mainHerb}
                    </div>
                  </div>

                  {/* Unani Mizaj Temperament */}
                  <div className="p-3 rounded-xl bg-[#040e08] border border-[#1b3b2f] space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-[#8da396] font-semibold">
                      {tx('Unani Mizaj & Humoral Action:', 'یوناني مزاج او اخلاطي اغېز:', 'مزاج یونانی و تاثیر اخلاطی:')}
                    </div>
                    <p className="text-xs text-[#d8e2dc] font-medium leading-relaxed">
                      {remedy.unaniMizaj}
                    </p>
                  </div>

                  {/* Symptoms Addressed */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#8da396] font-semibold block">
                      {tx('Addressed Symptoms:', 'اړوندې نښې:', 'علائم تحت پوشش:')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {remedy.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#081f13] border border-[#1c4030] text-[10px] text-[#a6b6ad]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Phytochemicals & Clinical Action */}
                  <div className="text-xs text-[#a6b6ad] space-y-1 pt-2 border-t border-[#1b3b2f]">
                    <div>
                      <span className="text-[#8da396] font-semibold">{t.quickView.keyActives}: </span>
                      <span className="text-[#f5f3ec]">{remedy.activeCompounds}</span>
                    </div>
                    <div>
                      <span className="text-[#8da396] font-semibold">{t.shop.clinicalDosage} </span>
                      <span className="text-[#d8e2dc]">{remedy.dosage}</span>
                    </div>
                  </div>
                </div>

                {/* Integrated Links: Blog Dossier & Corresponding Product */}
                <div className="pt-4 border-t border-[#1b3b2f] flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Blog Link */}
                  {linkedBlog && (
                    <button
                      onClick={() => onSelectBlogSlug && onSelectBlogSlug(linkedBlog.slug)}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[#081f13] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] hover:text-[#d4af37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{tx('Read Clinical Dossier', 'کلینیکي دوسیه ولولئ', 'مطالعه پرونده کلینیکی')}</span>
                    </button>
                  )}

                  {/* Product Link & Add to Cart */}
                  {linkedProduct && (
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <button
                        onClick={() => onSelectShopProduct && onSelectShopProduct(linkedProduct.id)}
                        className="px-3 py-2 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs text-[#f5f3ec] cursor-pointer transition-colors tabular-nums"
                        dir="ltr"
                      >
                        {formatPrice(linkedProduct.price)} · {t.shop.inspectBtn}
                      </button>

                      {onAddToCart && (
                        <button
                          onClick={() => {
                            onAddToCart(linkedProduct, 1);
                            setAddedNotice(remedy.id);
                            setTimeout(() => setAddedNotice(null), 1500);
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{addedNotice === remedy.id ? t.shop.addedBtn : t.shop.addBtn}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

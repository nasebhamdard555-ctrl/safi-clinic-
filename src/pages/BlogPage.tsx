import React from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Leaf,
  Clock,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Droplets,
  Award,
} from 'lucide-react';
import { HerbalBlog } from '../components/HerbalBlog';
import { RemediesGuide } from '../components/RemediesGuide';
import { HerbalProduct } from '../types/clinic';

interface BlogPageProps {
  onSelectShopProduct: (productId: string) => void;
  onOpenBooking: () => void;
  onAddToCart?: (product: HerbalProduct, quantity?: number) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onSelectShopProduct,
  onOpenBooking,
  onAddToCart,
}) => {
  const classicalRecipes = [
    {
      title: 'Avicenna’s Royal Black Seed & Raw Honey Electuary',
      target: 'Deep Bronchial Health & Immune Restoration',
      prepTime: '10 minutes',
      ingredients: [
        '100g freshly stone-ground Ethiopian Black Cumin Seeds (Nigella sativa)',
        '300g Raw Wildflower or Sidr mountain honey',
        '1 tsp finely ground Ceylon cinnamon',
      ],
      instructions:
        'Fold the freshly ground black seed powder into the raw honey in a glass jar using a wooden spoon (never metal). Allow to infuse for 48 hours in a dark cupboard. Take 1 teaspoon every morning on an empty stomach with lukewarm water.',
    },
    {
      title: 'Ayurvedic & Unani Golden Boswellia Milk',
      target: 'Joint Inflammation, Stiffness & Nighttime Rest',
      prepTime: '15 minutes',
      ingredients: [
        '1 cup warm almond milk or whole organic goat milk',
        '1/2 tsp organic turmeric powder (95% curcuminoids)',
        '1/4 tsp pure powdered Boswellia serrata resin (Frankincense)',
        'Pinch of black pepper (piperine for 2000% absorption)',
        '1 tsp unrefined grass-fed ghee or organic coconut oil',
      ],
      instructions:
        'Simmer the milk gently with turmeric, Boswellia, and black pepper on low heat for 7 minutes. Whisk in the healthy fats to bind fat-soluble curcuminoids and boswellic acids. Sip warm 30 minutes before bed.',
    },
    {
      title: 'Marshmallow Root Cold-Infusion Demulcent',
      target: 'Acid Reflux, Esophageal Burning & Gastric Ulcers',
      prepTime: 'Overnight Cold-Steep',
      ingredients: [
        '2 heaping tablespoons organic peeled Marshmallow root (Althaea officinalis)',
        '1 quart pure spring or filtered water',
        '1 slice fresh ginger or organic mint leaf (optional)',
      ],
      instructions:
        'Place marshmallow root in a clean glass jar and fill with cold spring water. Never use boiling water, as heat coagulates the therapeutic mucilaginous polysaccharides. Cover and steep in the refrigerator for 8 hours. Strain and drink 4-6 oz before meals.',
    },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#0d1609] text-[#f5f3ec] relative selection:bg-[#84cc16] selection:text-black">
      {/* Page Ambient Ancient Earthy Moss & Herbal Olive Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-lime-600/25 via-emerald-900/15 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#112a14] border border-[#e2bb38]/40 text-[#e2bb38] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Safi Materia Medica & Remedies Journal</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Herbal Remedies, Clinical Monographs & Phytotherapy
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Evidence-based botanical insights, traditional Unani-Tibb home preparation recipes, and medicinal chemistry guides written by our clinical herbalists in Kabul.
          </p>
        </div>
      </section>

      {/* Interactive Remedies Guide Component (Filter by Ailment, Symptom, or Main Herb) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <RemediesGuide
          onSelectShopProduct={onSelectShopProduct}
          onAddToCart={onAddToCart}
        />
      </section>

      {/* Main Blog Component */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <HerbalBlog
          onSelectShopProduct={onSelectShopProduct}
          onOpenBooking={onOpenBooking}
        />
      </section>

      {/* Classical Home Formulations / Apothecary Compendium */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c2413] via-[#091d0f] to-[#040e07] border border-[#e2bb38]/40 shadow-2xl space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#e2bb38] font-semibold">
              Traditional Pharmacopeia
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
              Ancient Home Formulations You Can Prepare
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2">
              Time-honored preparation recipes recorded in classical Greco-Arab Unani-Tibb pharmacopeia for daily health defense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classicalRecipes.map((recipe, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0e2714] border border-[#244f2a] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-[#13351b] border border-[#244f2a] text-[10px] text-[#e2bb38] font-semibold">
                      {recipe.prepTime}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-[#8da396]" />
                  </div>

                  <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                    {recipe.title}
                  </h3>

                  <p className="text-xs font-medium text-emerald-400">
                    Indication: {recipe.target}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-[#1e4423]">
                    <span className="text-[11px] font-bold text-[#e2bb38] block">Ingredients:</span>
                    <ul className="space-y-1 text-xs text-[#a6b6ad]">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#e2bb38]">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#1e4423]">
                    <span className="text-[11px] font-bold text-[#e2bb38] block mb-1">Method:</span>
                    <p className="text-xs text-[#d8e2dc] leading-relaxed italic">
                      {recipe.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1e4423] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-[#a6b6ad]">
              Want personalized botanical protocols specific to your constitution?
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e2bb38] to-[#ab8922] text-black font-semibold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule a Clinical Consultation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Phytotherapy Clinical Disclaimer */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-5 rounded-2xl bg-[#091a0e] border border-[#1e4423] text-xs text-[#8da396] leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-[#e2bb38] font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Clinical Phytotherapy & Education Disclaimer</span>
          </div>
          <p>
            The educational articles and herbal monographs provided by Safi Herbal Clinic are intended for informational purposes and constitutional self-care education. They do not constitute individualized medical diagnoses. If you are pregnant, nursing, taking prescription medications, or managing severe chronic illness, please consult with our registered clinical herbalists or your primary healthcare provider before undertaking new herbal regimens.
          </p>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  Leaf,
  AlertTriangle,
  ShoppingBag,
  Share2,
} from 'lucide-react';
import { BLOG_POSTS, HERBAL_PRODUCTS } from '../data/clinicData';
import { BlogPost } from '../types/clinic';

interface HerbalBlogProps {
  onSelectShopProduct?: (productId: string) => void;
  onOpenBooking: () => void;
}

export const HerbalBlog: React.FC<HerbalBlogProps> = ({
  onSelectShopProduct,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = [
    'All',
    'Digestive Health',
    'Immunity & Lungs',
    'Pain & Inflammation',
    'Stress & Sleep',
  ];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCat =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.keyHerb.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShareArticle = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  const getLinkedProduct = (productId?: string) => {
    if (!productId) return null;
    return HERBAL_PRODUCTS.find((p) => p.id === productId);
  };

  return (
    <section id="blog" className="py-20 lg:py-28 bg-[#040c08] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Botanical Medicine & Remedies Compendium</span>
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Herbal Remedies & Clinical Insights
          </h2>
          <p className="mt-3 text-base text-[#a6b6ad]">
            Ancient formulas, evidence-backed preparation guides, and clinical insights curated by our Master Herbalists.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#081810] border border-[#1b3b2f] mb-10 shadow-lg">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold shadow-md'
                    : 'bg-[#06120d] text-[#b8c9bf] hover:text-[#f5f3ec] border border-[#1b3b2f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search remedies, herbs..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] focus:border-[#d4af37] text-xs text-[#f5f3ec] placeholder-[#4f675a] focus:outline-none"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
            >
              {/* Cover Image */}
              <div
                onClick={() => setReadingPost(post)}
                className="relative h-60 bg-[#0c2017] overflow-hidden cursor-pointer"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081810] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-semibold text-[#f5e6c8] bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-[#c5a059]/40">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8da396] mb-2.5">
                    <span>{post.publishDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#d4af37]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3
                    onClick={() => setReadingPost(post)}
                    className="font-serif-classic text-xl font-bold text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {post.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#a6b6ad] line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Herb Highlight */}
                  <div className="mt-4 p-3 rounded-lg bg-[#06140e] border border-[#1b3b2f] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#8da396] block uppercase tracking-wider">
                        Featured Botanical:
                      </span>
                      <span className="font-semibold text-[#d4af37]">
                        {post.content.keyHerb.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6b8275] italic">
                      {post.content.keyHerb.latinName}
                    </span>
                  </div>
                </div>

                {/* Author and Read CTA */}
                <div className="mt-6 pt-4 border-t border-[#1b3b2f] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/50"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#f5f3ec] block">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] text-[#8da396]">
                        {post.author.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setReadingPost(post)}
                    className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#081810] border-2 border-[#c5a059] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 relative shadow-2xl text-[#f5f3ec]">
            {/* Close Button */}
            <button
              onClick={() => setReadingPost(null)}
              aria-label="Close article"
              className="absolute top-5 right-5 p-2 rounded-lg bg-[#0e2118] text-[#8da396] hover:text-[#f5f3ec] border border-[#1b3b2f] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Read Time */}
            <div className="flex items-center gap-3 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-2">
              <span>{readingPost.category}</span>
              <span className="text-[#1b3b2f]">·</span>
              <span className="flex items-center gap-1 text-[#a6b6ad]">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                {readingPost.readTime}
              </span>
            </div>

            {/* Article Title */}
            <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec] leading-tight">
              {readingPost.title}
            </h2>

            {/* Author Attribution */}
            <div className="flex items-center justify-between py-4 my-4 border-y border-[#1b3b2f]">
              <div className="flex items-center gap-3">
                <img
                  src={readingPost.author.avatar}
                  alt={readingPost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#d4af37]"
                />
                <div>
                  <p className="text-xs font-bold text-[#f5f3ec]">
                    {readingPost.author.name}
                  </p>
                  <p className="text-[11px] text-[#8da396]">
                    {readingPost.author.role} · {readingPost.publishDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleShareArticle(readingPost)}
                className="p-2 rounded-lg bg-[#0e2118] border border-[#1b3b2f] text-[#8da396] hover:text-[#d4af37] text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Main Text Content */}
            <div className="space-y-6 text-sm text-[#c9dad0] leading-relaxed">
              <p className="text-base font-light text-[#f5f3ec] leading-relaxed">
                {readingPost.content.introduction}
              </p>

              {readingPost.content.historicalContext && (
                <div className="p-4 rounded-xl bg-[#0b2418] border-l-4 border-[#d4af37] italic text-xs text-[#d8e2dc]">
                  {readingPost.content.historicalContext}
                </div>
              )}

              {/* Botanical Actives Spotlight Box */}
              <div className="p-5 rounded-xl bg-[#06140e] border border-[#1b3b2f] space-y-2">
                <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  Phytochemical Profile
                </span>
                <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                  {readingPost.content.keyHerb.name}{' '}
                  <span className="font-serif-editorial text-sm italic font-normal text-[#8da396]">
                    ({readingPost.content.keyHerb.latinName})
                  </span>
                </h4>
                <p className="text-xs text-[#a6b6ad]">
                  <strong className="text-[#f5f3ec]">Key Bio-Actives: </strong>
                  {readingPost.content.keyHerb.activeCompounds}
                </p>
              </div>

              {/* Remedy Recipe Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c2419] to-[#07150e] border border-[#c5a059]/40 space-y-4">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Dr. Hafizullah Safi’s Clinical Formulation Recipe
                </span>
                <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                  {readingPost.content.remedyRecipe.title}
                </h3>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#f5f3ec] uppercase tracking-wider">
                    Required Botanicals:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#d8e2dc]">
                    {readingPost.content.remedyRecipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1b3b2f]">
                  <p className="text-xs font-bold text-[#f5f3ec] uppercase tracking-wider">
                    Preparation & Steeping Method:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#c9dad0]">
                    {readingPost.content.remedyRecipe.preparationSteps.map(
                      (step, i) => (
                        <li key={i}>{step}</li>
                      )
                    )}
                  </ol>
                </div>

                <div className="p-3 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs">
                  <strong className="text-[#d4af37]">Recommended Regimen: </strong>
                  <span className="text-[#d8e2dc]">
                    {readingPost.content.remedyRecipe.dosageAdvice}
                  </span>
                </div>
              </div>

              {/* Clinical Insights */}
              <div className="space-y-2">
                <h4 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                  Clinical Dispensary Insights
                </h4>
                <p className="text-xs leading-relaxed text-[#b8c9bf]">
                  {readingPost.content.clinicalInsights}
                </p>
              </div>

              {/* Safety Precautions & Contraindications */}
              <div className="p-4 rounded-xl bg-[#1a110a] border border-amber-900/50 flex items-start gap-3 text-xs text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-300 block mb-0.5">
                    Contraindications & Clinical Advisory:
                  </strong>
                  <span>{readingPost.content.contraindications}</span>
                </div>
              </div>
            </div>

            {/* Linked Product Showcase in Blog Footer */}
            {readingPost.relatedProductId && (() => {
              const linkedProd = getLinkedProduct(readingPost.relatedProductId);
              if (!linkedProd) return null;
              return (
                <div className="mt-8 pt-6 border-t border-[#1b3b2f] flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0b2217] border border-[#c5a059]/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={linkedProd.image}
                      alt={linkedProd.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#1b3b2f]"
                    />
                    <div>
                      <span className="text-[10px] text-[#d4af37] font-semibold uppercase">
                        Matched Dispensary Formulation:
                      </span>
                      <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                        {linkedProd.name}
                      </h4>
                      <span className="text-xs font-bold text-[#d4af37]">
                        ${linkedProd.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setReadingPost(null);
                      if (onSelectShopProduct) {
                        onSelectShopProduct(linkedProd.id);
                      }
                      const shopEl = document.getElementById('shop');
                      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-black" />
                    <span>Get This Remedy</span>
                  </button>
                </div>
              );
            })()}

            {/* Footer Action */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setReadingPost(null)}
                className="px-6 py-2.5 rounded-lg bg-[#153426] text-xs font-semibold text-[#f5f3ec] border border-[#2d5e4b] hover:bg-[#1b4330]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

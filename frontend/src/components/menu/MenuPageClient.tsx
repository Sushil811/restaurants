'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import MenuCard from './MenuCard';
import MenuFilters from './MenuFilters';
import ItemDetailModal from './ItemDetailModal';

// ─── Types ──────────────────────────────────────────────────────────────────────
export type Category = 'All' | 'Starters' | 'Main Course' | 'Desserts' | 'Drinks' | 'Special Offers';
export type SortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc';

export interface CustomizationOption {
  label: string;
  price: number;
}

export interface CustomizationGroup {
  group: string;
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isChefSpecial: boolean;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  hasCustomization: boolean;
  customizations?: CustomizationGroup[];
  prepTime: number;
  allergens: string[];
  calories?: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────────
export const MENU_ITEMS: MenuItem[] = [
  // STARTERS
  {
    id: 'st-001',
    name: 'Truffle Seekh Kebab',
    category: 'Starters',
    description: 'Delicate lamb mince infused with black truffle, served with mint chutney foam.',
    longDescription:
      'Our signature starter marries tender Rajasthani lamb with aromatic French black truffle. Slow-cooked on a charcoal sigri and finished with a delicate mint-coriander foam, these kebabs are an ode to two great culinary traditions. Served with pickled cucumber ribbons and saffron aioli.',
    price: 680,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80',
    ],
    isVeg: false,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    rating: 4.8,
    reviewCount: 234,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Spice Level',
        required: true,
        options: [
          { label: 'Mild', price: 0 },
          { label: 'Medium', price: 0 },
          { label: 'Hot', price: 0 },
        ],
      },
      {
        group: 'Add-ons',
        required: false,
        options: [
          { label: 'Extra Mint Chutney', price: 50 },
          { label: 'Truffle Oil Drizzle', price: 120 },
        ],
      },
    ],
    prepTime: 20,
    allergens: ['Lamb', 'Dairy'],
    calories: 320,
  },
  {
    id: 'st-002',
    name: 'Burrata & Mango Chaat',
    category: 'Starters',
    description: 'Creamy burrata with Alphonso mango, chaat masala, and pomegranate pearls.',
    longDescription:
      'A playful fusion of Italian burrata and the beloved Indian street food tradition of chaat. Creamy buffalo mozzarella is paired with sun-ripened Alphonso mangoes, crisp papdi, chaat masala, tamarind gel, and ruby pomegranate pearls for a sweet-tangy-creamy explosion.',
    price: 590,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.6,
    reviewCount: 187,
    isPopular: true,
    hasCustomization: false,
    prepTime: 15,
    allergens: ['Dairy', 'Gluten'],
    calories: 280,
  },
  {
    id: 'st-003',
    name: 'Foie Gras Tikki',
    category: 'Starters',
    description: 'Pan-seared foie gras on a crispy potato tikki with fig chutney.',
    longDescription:
      'Our most daring fusion creation — velvety foie gras seared to perfection, resting atop a golden potato tikki seasoned with cumin and coriander. Finished with a house-made fig and cardamom chutney, micro greens, and a black sesame tuile.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    rating: 4.9,
    reviewCount: 98,
    isPopular: false,
    hasCustomization: false,
    prepTime: 25,
    allergens: ['Duck Liver', 'Potato', 'Gluten'],
    calories: 450,
  },
  {
    id: 'st-004',
    name: 'Paneer Tartare',
    category: 'Starters',
    description: 'House-made paneer, diced finely with capers, cornichons, and spiced mustard dressing.',
    longDescription:
      'A vegetarian take on the classic French tartare. Fresh house-pressed paneer is diced and tossed with capers, French cornichons, red onion, fresh herbs, and a punchy spiced mustard dressing. Served with toasted sourdough crostini.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.4,
    reviewCount: 112,
    isPopular: false,
    hasCustomization: true,
    customizations: [
      {
        group: 'Bread Choice',
        required: false,
        options: [
          { label: 'Sourdough Crostini', price: 0 },
          { label: 'Gluten-Free Crackers', price: 60 },
        ],
      },
    ],
    prepTime: 12,
    allergens: ['Dairy', 'Gluten'],
    calories: 220,
  },

  // MAIN COURSE
  {
    id: 'mc-001',
    name: 'Rogan Josh Confit',
    category: 'Main Course',
    description: 'Slow-confit lamb shank in classic Kashmiri rogan josh spices, served with saffron risotto.',
    longDescription:
      'A 72-hour confit lamb shank prepared in fragrant Kashmiri spices — whole cardamom, cloves, and fennel — then glazed with a rogan josh reduction. Served alongside a delicate saffron-scented arborio risotto and a turmeric-butter jus. A true collision of the subcontinent and Mediterranean.',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    rating: 4.9,
    reviewCount: 312,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Side Choice',
        required: true,
        options: [
          { label: 'Saffron Risotto', price: 0 },
          { label: 'Truffle Mashed Potato', price: 150 },
          { label: 'Garlic Naan', price: 0 },
        ],
      },
      {
        group: 'Spice Level',
        required: false,
        options: [
          { label: 'Mild', price: 0 },
          { label: 'Medium', price: 0 },
          { label: 'Hot', price: 0 },
        ],
      },
    ],
    prepTime: 35,
    allergens: ['Lamb', 'Dairy'],
    calories: 720,
  },
  {
    id: 'mc-002',
    name: 'Bouillabaisse à l\'Indienne',
    category: 'Main Course',
    description: 'Provençal fish stew reimagined with Kerala spices, coconut milk, and tiger prawns.',
    longDescription:
      'Our tribute to the Côte d\'Azur meets the Malabar Coast. A rich broth of tomatoes, fennel, and saffron is elevated with Kerala spices, coconut milk, and a touch of kokum. Filled with tiger prawns, sea bass, and clams, served with a curry-leaf rouille and crusty pain de campagne.',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1625943553852-781b73d45815?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    rating: 4.7,
    reviewCount: 156,
    isPopular: true,
    hasCustomization: false,
    prepTime: 40,
    allergens: ['Shellfish', 'Fish', 'Gluten', 'Dairy'],
    calories: 580,
  },
  {
    id: 'mc-003',
    name: 'Saag Morel Tart',
    category: 'Main Course',
    description: 'A buttery puff pastry tart filled with spinach, wild morel mushrooms, and gruyère.',
    longDescription:
      'Silky blanched spinach and wild morel mushrooms are folded with crème fraîche and aged gruyère, then baked in a golden, flaky all-butter puff pastry shell. Finished with a drizzle of truffle honey and micro herbs. The quintessential vegetarian show-stopper.',
    price: 980,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.5,
    reviewCount: 89,
    isPopular: false,
    hasCustomization: false,
    prepTime: 30,
    allergens: ['Dairy', 'Gluten', 'Mushrooms'],
    calories: 490,
  },
  {
    id: 'mc-004',
    name: 'Duck Breast à la Biryani',
    category: 'Main Course',
    description: 'Magret de canard with biryani-spiced jus, crispy shallots, and kewra-scented rice.',
    longDescription:
      'Crosshatch-scored duck breast, pan-seared to a blush pink, rested in a biryani-spiced jus of cardamom, star anise, and mace. Served with fragrant kewra-water rice and crispy fried shallots. A border-dissolving dialogue between Lyon and Lucknow.',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1544025162-d76694d05afc?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: false,
    rating: 4.6,
    reviewCount: 143,
    isPopular: false,
    hasCustomization: true,
    customizations: [
      {
        group: 'Cooking Temperature',
        required: true,
        options: [
          { label: 'Medium Rare', price: 0 },
          { label: 'Medium', price: 0 },
          { label: 'Well Done', price: 0 },
        ],
      },
    ],
    prepTime: 35,
    allergens: ['Duck', 'Dairy'],
    calories: 680,
  },
  {
    id: 'mc-005',
    name: 'Vegan Dhal Blanc',
    category: 'Main Course',
    description: 'White lentil dhal with herbes de Provence, roasted garlic, and grilled sourdough.',
    longDescription:
      'A vegan celebration of the humble lentil. White urad dhal is slow-cooked with roasted garlic confit, herbes de Provence, and a hint of lemon zest. Finished with the finest cold-pressed olive oil and served with grilled organic sourdough. Simple, nourishing, deeply satisfying.',
    price: 720,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    isVeg: true,
    isVegan: true,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.3,
    reviewCount: 67,
    isPopular: false,
    hasCustomization: false,
    prepTime: 25,
    allergens: ['Gluten'],
    calories: 380,
  },

  // DESSERTS
  {
    id: 'ds-001',
    name: 'Ras Malai Crème Brûlée',
    category: 'Desserts',
    description: 'Classic French crème brûlée with a rose-cardamom ras malai twist, torched to perfection.',
    longDescription:
      'Our most iconic dessert bridges two beloved traditions. The silky vanilla bean custard is infused with rose water and green cardamom, then caramelised tableside. Served alongside a miniature ras malai ball soaked in saffron-kewra cream, with a dusting of dried rose petals and crushed pistachio.',
    price: 480,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: true,
    rating: 4.9,
    reviewCount: 389,
    isPopular: true,
    hasCustomization: false,
    prepTime: 15,
    allergens: ['Dairy', 'Eggs'],
    calories: 380,
  },
  {
    id: 'ds-002',
    name: 'Gulab Jamun Tarte Tatin',
    category: 'Desserts',
    description: 'Warm upside-down tart with rose-syrup gulab jamun, vanilla ice cream, and caramel.',
    longDescription:
      'A dramatic reinvention of the traditional tarte tatin. Miniature gulab jamuns replace the classic apple, caramelised in a cast-iron pan with a rich golden caramel and inverted onto a buttery puff pastry disc. Served warm with a scoop of fresh cream-vanilla ice cream and a golden caramel drizzle.',
    price: 420,
    discountPrice: 380,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.7,
    reviewCount: 201,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Ice Cream Flavour',
        required: false,
        options: [
          { label: 'Vanilla Bean', price: 0 },
          { label: 'Kulfi-Pistachio', price: 60 },
          { label: 'Rose Gelato', price: 60 },
        ],
      },
    ],
    prepTime: 18,
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    calories: 520,
  },
  {
    id: 'ds-003',
    name: 'Mango Soufflé',
    category: 'Desserts',
    description: 'Light-as-air Alphonso mango soufflé with a mango-saffron coulis and crème anglaise.',
    longDescription:
      'Ordering this dessert is an act of faith — and it rewards every time. Our mango soufflé rises perfectly golden in a buttered ramekin, fragrant with pure Alphonso mango pulp. Served immediately at the table with a cold mango-saffron coulis and warm crème anglaise. Allow 20 minutes — it is worth every second.',
    price: 560,
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    rating: 4.8,
    reviewCount: 145,
    isPopular: false,
    hasCustomization: false,
    prepTime: 22,
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    calories: 290,
  },

  // DRINKS
  {
    id: 'dr-001',
    name: 'Saffron Gold Martini',
    category: 'Drinks',
    description: 'Vodka, saffron syrup, fresh lemon, elderflower — a luminous gold signature cocktail.',
    longDescription:
      'Our signature cocktail is an edible jewel. Premium triple-distilled vodka is shaken with house-made saffron-honey syrup, fresh Meyer lemon juice, and elderflower liqueur. Strained into a chilled coupe and finished with a single strand of Kashmiri saffron and a lemon twist. Luminous, fragrant, unforgettable.',
    price: 680,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80',
    isVeg: true,
    isVegan: true,
    isGlutenFree: true,
    isChefSpecial: true,
    rating: 4.8,
    reviewCount: 278,
    isPopular: true,
    hasCustomization: false,
    prepTime: 8,
    allergens: [],
    calories: 180,
  },
  {
    id: 'dr-002',
    name: 'Rose & Cardamom Lassi',
    category: 'Drinks',
    description: 'Thick hung-curd lassi with rose syrup, green cardamom, and fresh cream.',
    longDescription:
      'A regal non-alcoholic offering. Premium hung curd is churned smooth with rose syrup, freshly cracked green cardamom, a pinch of saffron, and topped with a dollop of fresh cream. Served chilled in a traditional clay tumbler with dried rose petals.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: true,
    isChefSpecial: false,
    rating: 4.6,
    reviewCount: 162,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Sweetness',
        required: false,
        options: [
          { label: 'Regular', price: 0 },
          { label: 'Less Sweet', price: 0 },
          { label: 'Extra Sweet', price: 0 },
        ],
      },
    ],
    prepTime: 5,
    allergens: ['Dairy'],
    calories: 220,
  },
  {
    id: 'dr-003',
    name: 'Lumiere Tea Ritual',
    category: 'Drinks',
    description: 'A curated selection of rare first-flush Darjeeling, French herbal blends, and Assam CTC.',
    longDescription:
      'Our tea service is a ceremony. Choose from first-flush Darjeeling (earthy, muscatel), a French jasmine-lavender blend, or robust Assam CTC with warm spices. Each pot is steeped precisely and served with house-made madeleine cookies and a warm clotted cream.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.7,
    reviewCount: 93,
    isPopular: false,
    hasCustomization: true,
    customizations: [
      {
        group: 'Tea Variety',
        required: true,
        options: [
          { label: 'First-Flush Darjeeling', price: 0 },
          { label: 'Jasmine Lavender (French)', price: 0 },
          { label: 'Assam Spiced CTC', price: 0 },
        ],
      },
    ],
    prepTime: 10,
    allergens: ['Dairy', 'Gluten'],
    calories: 120,
  },

  // SPECIAL OFFERS
  {
    id: 'so-001',
    name: 'Le Grand Déjeuner',
    category: 'Special Offers',
    description: '3-course lunch prix fixe: Starter + Main + Dessert. Best value at Lumiere.',
    longDescription:
      'Our signature weekday lunch experience. Choose one from each: Starters (Burrata Mango Chaat or Paneer Tartare), Mains (Saag Morel Tart or Vegan Dhal Blanc), and Desserts (Gulab Jamun Tarte Tatin). Includes one soft beverage. Available Monday to Friday, 12pm–3pm.',
    price: 1299,
    discountPrice: 999,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    rating: 4.8,
    reviewCount: 445,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Starter',
        required: true,
        options: [
          { label: 'Burrata & Mango Chaat', price: 0 },
          { label: 'Paneer Tartare', price: 0 },
        ],
      },
      {
        group: 'Main',
        required: true,
        options: [
          { label: 'Saag Morel Tart', price: 0 },
          { label: 'Vegan Dhal Blanc', price: 0 },
        ],
      },
      {
        group: 'Dessert',
        required: true,
        options: [
          { label: 'Gulab Jamun Tarte Tatin', price: 0 },
          { label: 'Ras Malai Crème Brûlée', price: 0 },
        ],
      },
    ],
    prepTime: 45,
    allergens: ['Varies by selection'],
    calories: 1200,
  },
  {
    id: 'so-002',
    name: 'Amour Pour Deux',
    category: 'Special Offers',
    description: 'Romantic dinner for two: 5-course tasting menu with wine pairing.',
    longDescription:
      'Our most intimate offering. A five-course chef\'s tasting menu designed for two, featuring the finest seasonal ingredients in a progression from amuse-bouche to mignardises. Optional curated wine pairing with each course. Reserve the candlelit corner booth for a truly romantic evening at Lumiere.',
    price: 4500,
    discountPrice: 3999,
    image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80',
    isVeg: false,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: true,
    rating: 4.9,
    reviewCount: 189,
    isPopular: true,
    hasCustomization: true,
    customizations: [
      {
        group: 'Wine Pairing',
        required: false,
        options: [
          { label: 'No Wine Pairing', price: 0 },
          { label: 'Curated Wine Pairing (+₹2000)', price: 2000 },
          { label: 'Non-Alcoholic Pairing (+₹800)', price: 800 },
        ],
      },
    ],
    prepTime: 120,
    allergens: ['Varies by menu'],
    calories: 2200,
  },
  {
    id: 'so-003',
    name: 'Weekend Brunch Box',
    category: 'Special Offers',
    description: 'Takeaway brunch for 4: pastries, eggs, chaat, juice, and masala chai.',
    longDescription:
      'Lumiere comes home. Our Weekend Brunch Box for four features warm croissants, a frittata with Indian spices, a bhel puri salad, fresh OJ, and a pot of masala chai. Everything packed in our signature gold-and-black takeaway packaging. Order by 8pm Friday, collect Saturday or Sunday 10am–1pm.',
    price: 1800,
    discountPrice: 1499,
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80',
    isVeg: true,
    isVegan: false,
    isGlutenFree: false,
    isChefSpecial: false,
    rating: 4.5,
    reviewCount: 134,
    isPopular: false,
    hasCustomization: false,
    prepTime: 30,
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    calories: 1800,
  },
];

const ITEMS_PER_PAGE = 9;

// ─── Loading Skeleton ───────────────────────────────────────────────────────────
function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-[#e8e0d0] dark:border-[#2e2a22]">
          <div className="skeleton aspect-[4/3]" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="flex justify-between items-center pt-2">
              <div className="skeleton h-6 w-1/4" />
              <div className="skeleton h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-[#f5ecd7] dark:bg-[#1a1a1a] flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-[#c9a84c]" />
      </div>
      <h3 className="font-display text-2xl font-bold text-[#0d0d0d] dark:text-[#f5ecd7] mb-3">
        No dishes found
      </h3>
      <p className="text-[#7a7a7a] max-w-sm mb-8">
        We couldn't find any items matching your search. Try different filters or browse our full menu.
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function MenuPageClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [vegFilter, setVegFilter] = useState(false);
  const [veganFilter, setVeganFilter] = useState(false);
  const [glutenFreeFilter, setGlutenFreeFilter] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, vegFilter, veganFilter, glutenFreeFilter, sortBy]);

  const filteredItems = useMemo(() => {
    let items = [...MENU_ITEMS];

    // Category
    if (activeCategory !== 'All') {
      items = items.filter((i) => i.category === activeCategory);
    }

    // Search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // Dietary
    if (vegFilter) items = items.filter((i) => i.isVeg);
    if (veganFilter) items = items.filter((i) => i.isVegan);
    if (glutenFreeFilter) items = items.filter((i) => i.isGlutenFree);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        items.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        items.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.reviewCount - a.reviewCount;
        });
        break;
    }

    return items;
  }, [activeCategory, debouncedQuery, vegFilter, veganFilter, glutenFreeFilter, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('All');
    setVegFilter(false);
    setVeganFilter(false);
    setGlutenFreeFilter(false);
    setSortBy('popular');
    setCurrentPage(1);
  }, []);

  const activeCriteria =
    (activeCategory !== 'All' ? 1 : 0) +
    (vegFilter ? 1 : 0) +
    (veganFilter ? 1 : 0) +
    (glutenFreeFilter ? 1 : 0) +
    (debouncedQuery ? 1 : 0);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-[#0d0d0d] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/60 via-transparent to-[#0d0d0d]/80" />
        <div className="relative container-lumiere py-24 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#c9a84c] text-sm font-semibold tracking-[0.25em] uppercase mb-4"
          >
            Lumiere Restaurant
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#f5ecd7]/70 text-lg max-w-2xl mx-auto"
          >
            French-Indian fusion crafted with seasonal ingredients and culinary artistry
          </motion.p>
        </div>
      </section>

      <main className="bg-[#f9f6f0] dark:bg-[#0d0d0d] min-h-screen">
        <div className="container-lumiere py-12">

          {/* Search + Filter Toggle Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a7a7a]" />
              <input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border border-[#e8e0d0] dark:border-[#2e2a22] rounded-2xl text-[#0d0d0d] dark:text-[#f5ecd7] placeholder:text-[#7a7a7a] focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-[#0d0d0d] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#1a1a1a] border border-[#e8e0d0] dark:border-[#2e2a22] rounded-2xl font-medium text-[#0d0d0d] dark:text-[#f5ecd7] hover:border-[#c9a84c] transition-all"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#c9a84c]" />
              Filters
              {activeCriteria > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#c9a84c] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeCriteria}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <MenuFilters
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  vegFilter={vegFilter}
                  onVegToggle={() => setVegFilter(!vegFilter)}
                  veganFilter={veganFilter}
                  onVeganToggle={() => setVeganFilter(!veganFilter)}
                  glutenFreeFilter={glutenFreeFilter}
                  onGlutenFreeToggle={() => setGlutenFreeFilter(!glutenFreeFilter)}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Quick-Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
            {(['All', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Special Offers'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white shadow-lg'
                    : 'bg-white dark:bg-[#1a1a1a] text-[#4a4a4a] dark:text-[#c8b99a] border border-[#e8e0d0] dark:border-[#2e2a22] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#7a7a7a] text-sm">
                Showing <span className="font-semibold text-[#0d0d0d] dark:text-[#f5ecd7]">{filteredItems.length}</span> dishes
                {debouncedQuery && (
                  <> for "<span className="text-[#c9a84c]">{debouncedQuery}</span>"</>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-[#7a7a7a]">
                Sort:{' '}
                <span className="text-[#c9a84c] font-semibold capitalize">
                  {sortBy === 'price-asc' ? 'Price: Low to High' : sortBy === 'price-desc' ? 'Price: High to Low' : sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <MenuSkeleton />
          ) : filteredItems.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${debouncedQuery}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedItems.map((item, idx) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onViewDetails={() => setSelectedItem(item)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[#e8e0d0] dark:border-[#2e2a22] disabled:opacity-40 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#c9a84c] to-[#e3ab44] text-white shadow-md'
                      : 'border border-[#e8e0d0] dark:border-[#2e2a22] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[#e8e0d0] dark:border-[#2e2a22] disabled:opacity-40 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

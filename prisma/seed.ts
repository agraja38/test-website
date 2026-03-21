import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const productCatalog = [
  {
    name: "Aurora Lounge Chair",
    sku: "AUR-CHAIR-01",
    price: "89500",
    compareAtPrice: "97500",
    stock: 8,
    isFeatured: true,
    categoryName: "Signature Living",
    shortDescription: "A sculpted accent chair made for premium living rooms.",
    description:
      "Wrapped in tactile boucle with a solid ash base, the Aurora Lounge Chair adds gallery-level presence to your home.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Stoneware Serving Set",
    sku: "STO-SERV-04",
    price: "26900",
    compareAtPrice: "31900",
    stock: 11,
    isFeatured: false,
    categoryName: "Signature Living",
    shortDescription: "Hand-finished serving pieces for intimate dinners.",
    description:
      "An artisan-inspired stoneware collection with matte glaze and elevated proportions for modern tablescapes.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Luna Bedside Lamp",
    sku: "LUNA-LAMP-05",
    price: "14500",
    compareAtPrice: "17800",
    stock: 32,
    isFeatured: true,
    categoryName: "Signature Living",
    shortDescription: "Soft ambient lamp with a brushed brass finish.",
    description:
      "The Luna Bedside Lamp brings warm layered light to your room with a clean silhouette and touch-controlled dimming.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Nordic Throw Blanket",
    sku: "NORD-THROW-06",
    price: "9900",
    compareAtPrice: "12400",
    stock: 40,
    isFeatured: false,
    categoryName: "Signature Living",
    shortDescription: "Soft woven throw for couches and reading corners.",
    description:
      "A textured layered throw designed to add warmth, softness, and visual depth to sofas, beds, and lounge spaces.",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Oak Entry Console",
    sku: "OAK-CONSOLE-07",
    price: "45800",
    compareAtPrice: "51900",
    stock: 6,
    isFeatured: false,
    categoryName: "Signature Living",
    shortDescription: "Slim console table with natural oak finish.",
    description:
      "A practical yet elevated console for entrances and compact spaces, with hidden storage and balanced proportions.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ridge Ceramic Planter",
    sku: "RIDGE-PLANT-08",
    price: "7200",
    compareAtPrice: "8600",
    stock: 54,
    isFeatured: false,
    categoryName: "Signature Living",
    shortDescription: "Decorative planter with sculpted rib detailing.",
    description:
      "A modern ceramic planter for indoor greenery, styled with ribbed form and neutral glaze for versatile placement.",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Calm Ritual Diffuser",
    sku: "CALM-DIFF-02",
    price: "18400",
    compareAtPrice: "21900",
    stock: 24,
    isFeatured: true,
    categoryName: "Wellness Essentials",
    shortDescription: "Ultrasonic diffuser with ceramic shell and soft ambient glow.",
    description:
      "Create a spa-grade atmosphere at home with whisper-quiet misting, warm illumination, and minimalist controls.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Herbal Sleep Tea Set",
    sku: "SLEEP-TEA-09",
    price: "5800",
    compareAtPrice: "6900",
    stock: 78,
    isFeatured: false,
    categoryName: "Wellness Essentials",
    shortDescription: "A calming tea blend for evening wind-down routines.",
    description:
      "A boxed nighttime tea assortment with floral and herbal notes selected for soothing evening rituals and gifting.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Balance Yoga Mat",
    sku: "BAL-YOGA-10",
    price: "12800",
    compareAtPrice: "15200",
    stock: 29,
    isFeatured: true,
    categoryName: "Wellness Essentials",
    shortDescription: "High-grip yoga mat with travel-friendly weight.",
    description:
      "Designed for home and studio use with reliable traction, easy cleaning, and a clean minimal aesthetic.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Pulse Massage Gun",
    sku: "PULSE-REC-11",
    price: "24800",
    compareAtPrice: "28900",
    stock: 18,
    isFeatured: false,
    categoryName: "Wellness Essentials",
    shortDescription: "Compact recovery device with multiple speed settings.",
    description:
      "A handheld massage tool for post-workout recovery and muscle relief, with quiet operation and ergonomic balance.",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Silk Eye Pillow",
    sku: "SILK-EYE-12",
    price: "4300",
    compareAtPrice: "5200",
    stock: 67,
    isFeatured: false,
    categoryName: "Wellness Essentials",
    shortDescription: "Cooling relaxation pillow for meditation or sleep.",
    description:
      "A gently weighted silk eye pillow filled with natural grains and designed for calm screen-free rest.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ceramic Aroma Burner",
    sku: "AROMA-BURN-13",
    price: "6600",
    compareAtPrice: "7900",
    stock: 36,
    isFeatured: false,
    categoryName: "Wellness Essentials",
    shortDescription: "Tabletop burner for oils and wax melts.",
    description:
      "A ceramic aromatherapy burner that adds both scent and quiet visual warmth to a room or bedside setup.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Voyager Weekender",
    sku: "VOY-BAG-03",
    price: "32900",
    compareAtPrice: "38900",
    stock: 16,
    isFeatured: true,
    categoryName: "Travel Ready",
    shortDescription: "Structured travel bag with full-grain accents.",
    description:
      "The Voyager Weekender balances durability and polish with dedicated compartments for devices, shoes, and short-stay essentials.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Transit Tech Organizer",
    sku: "TECH-ORG-14",
    price: "7400",
    compareAtPrice: "9200",
    stock: 63,
    isFeatured: true,
    categoryName: "Travel Ready",
    shortDescription: "Keep chargers, cables, and adapters in one place.",
    description:
      "A slim zip organizer with elastic compartments sized for travel electronics, power banks, and smaller accessories.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Aero Cabin Backpack",
    sku: "AERO-BACK-15",
    price: "21500",
    compareAtPrice: "24900",
    stock: 21,
    isFeatured: false,
    categoryName: "Travel Ready",
    shortDescription: "Structured backpack built for flights and daily carry.",
    description:
      "A travel-first backpack sized for cabin use, with padded laptop storage and quick-access document pockets.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Atlas Passport Wallet",
    sku: "ATLAS-WALLET-16",
    price: "8900",
    compareAtPrice: "10900",
    stock: 47,
    isFeatured: false,
    categoryName: "Travel Ready",
    shortDescription: "Travel wallet for passport, cards, cash, and boarding documents.",
    description:
      "A compact passport wallet with clean organization for essential travel documents while staying slim in hand.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Glide Neck Pillow",
    sku: "GLIDE-NECK-17",
    price: "6100",
    compareAtPrice: "7600",
    stock: 58,
    isFeatured: false,
    categoryName: "Travel Ready",
    shortDescription: "Memory-foam pillow designed for long flights.",
    description:
      "A supportive travel neck pillow that compresses down for packing while keeping its structure during use.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Metro Luggage Tag Set",
    sku: "METRO-TAG-18",
    price: "3200",
    compareAtPrice: "4100",
    stock: 91,
    isFeatured: false,
    categoryName: "Travel Ready",
    shortDescription: "Durable luggage tags with minimalist finishes.",
    description:
      "A refined luggage tag set that makes bags easier to identify while keeping contact details discreet.",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Compact Espresso Maker",
    sku: "ESP-COMPACT-19",
    price: "19800",
    compareAtPrice: "22500",
    stock: 14,
    isFeatured: true,
    categoryName: "Signature Living",
    shortDescription: "Countertop espresso maker for smaller kitchens.",
    description:
      "A compact machine for quick at-home espresso with an easy-clean design and polished kitchen presence.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Marble Coaster Set",
    sku: "MARBLE-20",
    price: "3900",
    compareAtPrice: "4900",
    stock: 83,
    isFeatured: false,
    categoryName: "Signature Living",
    shortDescription: "Minimal coasters for coffee tables and work desks.",
    description:
      "A premium marble coaster set that protects surfaces while adding a polished finish to entertaining areas.",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Thermal Travel Flask",
    sku: "THERMAL-21",
    price: "5400",
    compareAtPrice: "6800",
    stock: 72,
    isFeatured: false,
    categoryName: "Travel Ready",
    shortDescription: "Leakproof flask for coffee, tea, or chilled drinks.",
    description:
      "A stainless steel travel flask with temperature retention for busy workdays, road trips, and weekend travel.",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Daily Supplement Box",
    sku: "SUPP-BOX-22",
    price: "2500",
    compareAtPrice: "3300",
    stock: 130,
    isFeatured: false,
    categoryName: "Wellness Essentials",
    shortDescription: "Seven-day organizer for vitamins and medication.",
    description:
      "A clean pill organizer sized for daily routines, travel packing, and consistent supplement habits.",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
  },
];

const heroSlides = [
  {
    title: "Weekend deals on premium home picks",
    subtitle: "Fast-moving offers across decor, appliances, and statement furniture.",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Shop Home",
    ctaHref: "/shop?category=signature-living",
    sortOrder: 0,
  },
  {
    title: "Travel-ready essentials for every trip",
    subtitle: "Cabin bags, organizers, and accessories built for movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Explore Travel",
    ctaHref: "/shop?category=travel-ready",
    sortOrder: 1,
  },
  {
    title: "Wellness upgrades for your daily routine",
    subtitle: "Recovery, comfort, and self-care products with a cleaner look.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
    ctaLabel: "Browse Wellness",
    ctaHref: "/shop?category=wellness-essentials",
    sortOrder: 2,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@luxecart.local" },
    update: {},
    create: {
      email: "admin@luxecart.local",
      passwordHash,
      firstName: "Store",
      lastName: "Admin",
      role: Role.ADMIN,
    },
  });

  const categoryRecords = await Promise.all(
    [
      {
        name: "Signature Living",
        description: "Elegant furniture and decor with modern warmth.",
      },
      {
        name: "Wellness Essentials",
        description: "Premium self-care and relaxation products.",
      },
      {
        name: "Travel Ready",
        description: "Smart accessories for frequent travelers.",
      },
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: slugify(category.name, { lower: true, strict: true }) },
        update: category,
        create: {
          ...category,
          slug: slugify(category.name, { lower: true, strict: true }),
        },
      }),
    ),
  );

  const categoryMap = new Map(categoryRecords.map((category) => [category.name, category.id]));

  for (const product of productCatalog) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) {
      throw new Error(`Missing category for ${product.name}`);
    }

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        slug: slugify(product.name, { lower: true, strict: true }),
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isPublished: true,
        categoryId,
        images: {
          deleteMany: {},
          create: [
            {
              url: product.image,
              altText: product.name,
              sortOrder: 0,
            },
          ],
        },
      },
      create: {
        name: product.name,
        slug: slugify(product.name, { lower: true, strict: true }),
        shortDescription: product.shortDescription,
        description: product.description,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isPublished: true,
        categoryId,
        images: {
          create: [
            {
              url: product.image,
              altText: product.name,
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: `seed-slide-${slide.sortOrder}` },
      update: slide,
      create: {
        id: `seed-slide-${slide.sortOrder}`,
        ...slide,
      },
    });
  }

  console.log("Seed complete", {
    adminEmail: admin.email,
    adminPassword: "Admin@12345",
    productCount: productCatalog.length,
    heroSlideCount: heroSlides.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

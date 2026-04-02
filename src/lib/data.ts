export interface Job {
  id: string;
  title: string;
  description: string;
  priceRSD: number;
  category: string;
  icon: string;
  location: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  promoText: string;
  logo: string;
  ctaLink: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  priceRSD: number;
  discount?: number;
  image: string;
  link: string;
  vendor: string;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Home Cleaning',
    description: 'Professional deep cleaning for apartments up to 60m². Includes windows and bathroom sanitization.',
    priceRSD: 1200,
    category: 'Cleaning',
    icon: 'cleaning_services',
    location: 'Belgrade / Novi Sad'
  },
  {
    id: '2',
    title: 'Moving Assistant',
    description: 'Heavy lifting and loading help for your move. Minimum 2 hours.',
    priceRSD: 1500,
    category: 'Labor',
    icon: 'local_shipping',
    location: 'Belgrade'
  },
  {
    id: '3',
    title: 'Furniture Assembly',
    description: 'Expert assembly for IKEA, Jysk, and Emmezeta furniture. Bring your own boxes, we bring tools.',
    priceRSD: 2000,
    category: 'Handyman',
    icon: 'construction',
    location: 'All Serbia'
  },
  {
    id: '4',
    title: 'Pet Sitting',
    description: 'Reliable dog walking and cat feeding while you are away. Verified sitters only.',
    priceRSD: 800,
    category: 'Pets',
    icon: 'pets',
    location: 'Novi Sad'
  },
  {
    id: '5',
    title: 'Virtual Assistant',
    description: 'Email management, scheduling, and data entry. English and Serbian fluent.',
    priceRSD: 1000,
    category: 'Admin',
    icon: 'support_agent',
    location: 'Remote'
  },
  {
    id: '6',
    title: 'Gardening Help',
    description: 'Lawn mowing, hedge trimming, and general garden maintenance.',
    priceRSD: 1400,
    category: 'Outdoors',
    icon: 'yard',
    location: 'Subotica'
  }
];

export const featuredCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechStart Serbia',
    description: 'The leading IT consultancy in the Balkans.',
    promoText: 'Get 20% off your first cloud migration consultation.',
    logo: 'cloud',
    ctaLink: '#'
  },
  {
    id: 'c2',
    name: 'GreenEat Delivery',
    description: 'Healthy meal prep delivered to your office.',
    promoText: 'Free delivery for corporate accounts in Belgrade.',
    logo: 'nutrition',
    ctaLink: '#'
  }
];

export const affiliates: AffiliateProduct[] = [
  {
    id: 'a1',
    name: 'Pro Bosch Drill Set',
    vendor: 'Uradi Sam',
    priceRSD: 12999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    link: '#'
  },
  {
    id: 'a2',
    name: 'Ergonomic Office Chair',
    vendor: 'IKEA Serbia',
    priceRSD: 24500,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
    link: '#'
  },
  {
    id: 'a3',
    name: 'Kärcher Window Vac',
    vendor: 'Tehnomanija',
    priceRSD: 8990,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800',
    link: '#'
  }
];
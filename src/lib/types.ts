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

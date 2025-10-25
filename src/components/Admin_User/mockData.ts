export type ServiceProvider = {
  id: string;
  name: string;
  skill: string;
  photo: string;
  location: string;
  rate: number;
  distance: number;
  rating: number;
  reviewCount: number;
  about: string;
  skills: string[];
  reviews: Review[];
};

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  photo: string;
};

export const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Thabo Mthembu',
    skill: 'plumber',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    location: 'Durban Central',
    rate: 250,
    distance: 2.3,
    rating: 4.8,
    reviewCount: 24,
    about: 'Professional plumber with 10+ years of experience. Specialized in residential and commercial plumbing installations, repairs, and maintenance.',
    skills: ['plumber', 'Installation', 'Repairs', 'Maintenance'],
    reviews: [
      {
        id: 'r1',
        customerName: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent work! Fixed my leaking pipes quickly and professionally.',
        date: '2025-10-15'
      },
      {
        id: 'r2',
        customerName: 'David Naidoo',
        rating: 4,
        comment: 'Very reliable and punctual. Good pricing.',
        date: '2025-10-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Zanele Khumalo',
    skill: 'electrician',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    location: 'Umlazi',
    rate: 300,
    distance: 5.7,
    rating: 4.9,
    reviewCount: 38,
    about: 'Certified electrician providing safe and reliable electrical services. Available for emergencies 24/7.',
    skills: ['electrician', 'Wiring', 'Installations', 'Emergency Repairs'],
    reviews: [
      {
        id: 'r3',
        customerName: 'Michael Brown',
        rating: 5,
        comment: 'Outstanding service! Very knowledgeable and professional.',
        date: '2025-10-12'
      }
    ]
  },
  {
    id: '3',
    name: 'Sipho Dlamini',
    skill: 'carpenter',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    location: 'Phoenix',
    rate: 200,
    distance: 8.2,
    rating: 4.7,
    reviewCount: 19,
    about: 'Skilled carpenter specializing in custom furniture and home renovations.',
    skills: ['carpenter', 'Furniture Making', 'Renovations', 'Wood Work'],
    reviews: [
      {
        id: 'r4',
        customerName: 'Lisa van der Merwe',
        rating: 5,
        comment: 'Built beautiful custom shelves for my office. Highly recommended!',
        date: '2025-10-08'
      }
    ]
  },
  {
    id: '4',
    name: 'Nomusa Zulu',
    skill: 'gardener',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    location: 'Pinetown',
    rate: 150,
    distance: 12.5,
    rating: 4.6,
    reviewCount: 15,
    about: 'Passionate gardener with expertise in landscaping and garden maintenance.',
    skills: ['gardener', 'Landscaping', 'Maintenance', 'Plant Care'],
    reviews: [
      {
        id: 'r5',
        customerName: 'John Smith',
        rating: 4,
        comment: 'Great attention to detail. My garden looks amazing!',
        date: '2025-10-05'
      }
    ]
  },
  {
    id: '5',
    name: 'Mandla Ngcobo',
    skill: 'painter',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    location: 'Chatsworth',
    rate: 180,
    distance: 6.8,
    rating: 4.5,
    reviewCount: 22,
    about: 'Professional painter offering interior and exterior painting services.',
    skills: ['painter', 'Interior Painting', 'Exterior Painting', 'Wall Prep'],
    reviews: [
      {
        id: 'r6',
        customerName: 'Amanda Pillay',
        rating: 5,
        comment: 'Very neat and clean work. Finished on time!',
        date: '2025-10-01'
      }
    ]
  },
  {
    id: '6',
    name: 'Precious Mdluli',
    skill: 'cleaner',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    location: 'Westville',
    rate: 120,
    distance: 4.1,
    rating: 4.9,
    reviewCount: 42,
    about: 'Reliable cleaning services for homes and offices. Deep cleaning specialist.',
    skills: ['cleaner', 'Deep Cleaning', 'Office Cleaning', 'Residential'],
    reviews: [
      {
        id: 'r7',
        customerName: 'Robert Jones',
        rating: 5,
        comment: 'Spotless! Best cleaning service I have used.',
        date: '2025-10-18'
      }
    ]
  }
];

export const mockCustomer: Customer = {
  id: 'c1',
  name: 'Nkosi Shabalala',
  email: 'nkosi.shabalala@example.com',
  phone: '+27 82 456 7890',
  location: 'Durban, KwaZulu-Natal',
  memberSince: '2024-03-15',
  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
};

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Nkosi Shabalala',
    email: 'nkosi.shabalala@example.com',
    phone: '+27 82 456 7890',
    location: 'Durban, KwaZulu-Natal',
    memberSince: '2024-03-15',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
  },
  {
    id: 'c2',
    name: 'Thandiwe Mokoena',
    email: 'thandiwe.m@example.com',
    phone: '+27 83 123 4567',
    location: 'Johannesburg, Gauteng',
    memberSince: '2024-05-22',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
  },
  {
    id: 'c3',
    name: 'Johan van Wyk',
    email: 'johan.vw@example.com',
    phone: '+27 84 987 6543',
    location: 'Cape Town, Western Cape',
    memberSince: '2024-06-10',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
  },
  {
    id: 'c4',
    name: 'Lerato Mabaso',
    email: 'lerato.mabaso@example.com',
    phone: '+27 82 345 6789',
    location: 'Pretoria, Gauteng',
    memberSince: '2024-07-08',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
  },
  {
    id: 'c5',
    name: 'Pieter Botha',
    email: 'pieter.b@example.com',
    phone: '+27 83 567 8901',
    location: 'Bloemfontein, Free State',
    memberSince: '2024-08-15',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
  },
  {
    id: 'c6',
    name: 'Nomvula Dube',
    email: 'nomvula.d@example.com',
    phone: '+27 84 234 5678',
    location: 'Durban, KwaZulu-Natal',
    memberSince: '2024-09-03',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop'
  },
  {
    id: 'c7',
    name: 'Siyabonga Ndlovu',
    email: 'siya.ndlovu@example.com',
    phone: '+27 82 876 5432',
    location: 'Port Elizabeth, Eastern Cape',
    memberSince: '2024-09-20',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop'
  },
  {
    id: 'c8',
    name: 'Annemarie Smit',
    email: 'annemarie.s@example.com',
    phone: '+27 83 654 3210',
    location: 'Stellenbosch, Western Cape',
    memberSince: '2024-10-01',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'
  }
];
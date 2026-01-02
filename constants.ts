
import { Vendor, MenuItem } from './types';

export const VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'La Hamburguesería',
    description: 'Hamburguesas artesanales, papas rústicas y las mejores salsas de la ciudad. Opción vegetariana disponible.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
    rating: 4.8,
    waitTime: '15-20 min',
    category: 'Burgers',
    isOpen: true
  },
  {
    id: 'v2',
    name: 'Tacos El Güero',
    description: 'Auténticos tacos mexicanos al pastor, carnitas y suadero. Tortillas hechas a mano en el momento.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80',
    rating: 4.9,
    waitTime: '10-15 min',
    category: 'Tacos',
    isOpen: true
  },
  {
    id: 'v3',
    name: 'Pizza Al Taglio',
    description: 'Pizza de estilo romano vendida por porciones rectangulares. Masa madre con 48hs de fermentación.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    rating: 4.5,
    waitTime: '+45 min',
    category: 'Pizza',
    isOpen: true
  }
];

export const MENU_ITEMS: Record<string, MenuItem[]> = {
  'v1': [
    {
      id: 'm1',
      name: 'Classic Smashed Burger',
      description: 'Doble carne smasheada, cheddar fundido, cebolla crispy y nuestra salsa secreta.',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
      category: 'Hamburguesas',
      popular: true
    },
    {
      id: 'm2',
      name: 'Bacon King',
      description: 'Carne angus 180g, panceta ahumada crujiente, huevo frito y barbacoa casera.',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80',
      category: 'Hamburguesas'
    }
  ],
  'v2': [
    {
      id: 'm3',
      name: 'Tacos al Pastor (x3)',
      description: 'Cerdo marinado con piña, cilantro y cebolla. Incluye salsas picantes.',
      price: 9.00,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865202?auto=format&fit=crop&q=80',
      category: 'Tacos',
      popular: true
    }
  ]
};

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface JeanType {
  name: string;
  slug: string;
  image: string;
}

interface JeanTypesGalleryProps {
  gender: 'hombre' | 'mujer';
  onSelectType: (slug: string) => void;
  selectedType?: string;
}

export function JeanTypesGallery({ gender, onSelectType, selectedType }: JeanTypesGalleryProps) {
  const jeanTypesMujer: JeanType[] = [
    {
      name: 'Ver todo',
      slug: 'ver-todo',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop'
    },
    {
      name: 'Super tiro alto',
      slug: 'super-tiro-alto',
      image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=400&fit=crop'
    },
    {
      name: 'Baggy',
      slug: 'baggy',
      image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=400&fit=crop'
    },
    {
      name: 'Straight leg',
      slug: 'straight-leg',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=300&h=400&fit=crop'
    },
    {
      name: 'Mom fit',
      slug: 'mom-fit',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop'
    },
    {
      name: "90's fit",
      slug: '90s-fit',
      image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=400&fit=crop'
    },
    {
      name: 'Boyfriend',
      slug: 'boyfriend',
      image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=400&fit=crop'
    },
    {
      name: 'Push up',
      slug: 'push-up',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=300&h=400&fit=crop'
    },
    {
      name: 'Tendencia',
      slug: 'tendencia',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop'
    }
  ];

  const jeanTypesHombre: JeanType[] = [
    {
      name: 'Ver todo',
      slug: 'ver-todo',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Slim fit',
      slug: 'slim-fit',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Regular fit',
      slug: 'regular-fit',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Relaxed fit',
      slug: 'relaxed-fit',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Straight',
      slug: 'straight',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Skinny',
      slug: 'skinny',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Baggy',
      slug: 'baggy',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    },
    {
      name: 'Carpenter',
      slug: 'carpenter',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop'
    }
  ];

  const jeanTypes = gender === 'mujer' ? jeanTypesMujer : jeanTypesHombre;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de jeans</h3>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {jeanTypes.map((type, index) => (
            <motion.button
              key={type.slug}
              onClick={() => onSelectType(type.slug)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex-shrink-0 w-32 snap-start group ${
                selectedType === type.slug ? 'ring-2 ring-sky-600 rounded-xl' : ''
              }`}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-1">
                    <ChevronRight className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
              </div>
              <p className={`text-sm font-medium text-center ${
                selectedType === type.slug ? 'text-sky-600' : 'text-gray-700'
              }`}>
                {type.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

export default function RelatedStudies({ studies }) {
  if (!studies || studies.length === 0) return null;
  return (
    <section className="py-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="px-4 sm:px-8 lg:px-16 xl:px-20">
        <h2 className="text-xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Related Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studies.map((study) => (
            <Link key={study._id} to={`/work/${study.slug}`} className="group block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0B] transition-all hover:shadow-lg">
              <div className="aspect-[16/9] overflow-hidden">
                <OptimizedImage src={study.heroImage} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors line-clamp-2">{study.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{study.year || '2026'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Tag } from '../types';

interface TagCloudProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
}

export default function TagCloud({ tags, selectedTag, onTagSelect }: TagCloudProps) {
  const getTagSize = (count: number) => {
    const min = 0.8;
    const max = 1.5;
    const maxCount = Math.max(...tags.map(tag => tag.count), 1);
    
    // Count'a göre boyutu ölçeklendir (min ile max arasında)
    return min + (count / maxCount) * (max - min);
  };

  if (tags.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic text-sm">
        Henüz etiket bulunmuyor
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const size = getTagSize(tag.count);
        const isSelected = selectedTag === tag.name;
        
        return (
          <motion.button
            key={tag.id}
            onClick={() => onTagSelect(tag.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontSize: `${size}rem` }}
            className={`px-3 py-1 rounded-full transition-colors ${
              isSelected
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900/30'
            }`}
          >
            {tag.name}
            <span className="ml-1 text-xs">
              {tag.count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
} 
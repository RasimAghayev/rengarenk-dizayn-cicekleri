
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Category } from '@/types/cash-register';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
  viewMode: 'all' | 'categories';
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  viewMode
}) => {
  return (
    <Card className={viewMode === 'all' ? "md:col-span-1" : "w-full"}>
      <CardHeader>
        <CardTitle className="text-brandBlue">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"} 
              className="w-full justify-start gap-2"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.icon}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;

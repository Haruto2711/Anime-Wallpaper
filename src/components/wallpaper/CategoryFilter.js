import React from 'react';
import Button from 'react-bootstrap/Button';

function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
      <Button
        variant={activeCategory === null ? "primary" : "outline-light"}
        onClick={() => onSelectCategory(null)}
        className="rounded-pill px-4"
      >
        Tất cả
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeCategory === cat.id ? "primary" : "outline-light"}
          onClick={() => onSelectCategory(cat.id)}
          className="rounded-pill px-4"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

export default CategoryFilter;

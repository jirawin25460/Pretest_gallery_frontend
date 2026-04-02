import React, { useState } from 'react';

function ImageCard({ img, onZoom, onTagClick, activeTags }) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/400x600?text=${encodeURIComponent(img.name)}`;
  };

  const allTags = img.tags || [];
  const displayTags = showAllTags ? allTags : allTags.slice(0, 3);
  const hasMore = allTags.length > 3;

  return (
    <div className="pin-card">
      <div className="pin-image-wrapper">
        <img 
          src={img.url} 
          alt={img.name} 
          className="pin-image" 
          onClick={() => onZoom(img)} 
          onError={handleImageError}
          loading="lazy"
        />
        <div className="pin-overlay" onClick={() => onZoom(img)}>
          <span className="image-name-tooltip">{img.name}</span>
        </div>
      </div>

      <div className="pin-info">
        <div className="pin-tags">
          {displayTags.map(tag => (
            <span 
              key={tag.id} 
              className={`hashtag-pill ${activeTags?.includes(tag.name) ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag.name);
              }}
            >
              #{tag.name}
            </span>
          ))}
          
          {hasMore && (
            <span 
              className="more-tags-trigger" 
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTags(!showAllTags);
              }}
              style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#888', marginLeft: '5px' }}
            >
              {showAllTags ? '▲' : '...'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
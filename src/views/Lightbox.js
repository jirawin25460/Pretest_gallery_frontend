import React from 'react';

function Lightbox({ img, onClose }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <span className="close-lightbox">&times;</span>
      <img 
        src={img.url} 
        alt="Zoomed" 
        className="lightbox-img" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}

export default Lightbox;
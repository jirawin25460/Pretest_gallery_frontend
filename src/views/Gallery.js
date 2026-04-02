import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import '../css/Gallery.css';

// กำหนด Base URL ไว้ที่เดียวเพื่อให้จัดการง่าย
const API_BASE_URL = 'https://pretest-gallery.onrender.com/api';

function Gallery() {
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const observer = useRef();
  
  const lastImageRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // แก้ไขจุดที่ 1: ดึงข้อมูล Tags จาก Render
  useEffect(() => {
    axios.get(`${API_BASE_URL}/tags`)
      .then(res => setTags(res.data))
      .catch(err => console.error('Error fetching tags:', err));
  }, []);

  useEffect(() => {
    fetchImages(page, selectedTags, searchQuery, page > 0);
  }, [page, selectedTags, searchQuery]);

  const fetchImages = (pageNum, tagList, search, isAppend = false) => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.append('page', pageNum);
    params.append('size', 20); 
    
    if (search) {
      params.append('search', search);
    }
    
    if (tagList.length > 0) {
      tagList.forEach(t => params.append('tag', t));
    }

    // แก้ไขจุดที่ 2: ดึงข้อมูล Images จาก Render
    axios.get(`${API_BASE_URL}/images?${params.toString()}`)
      .then(res => {
        const newImages = res.data.content;
        setImages(prev => isAppend ? [...prev, ...newImages] : newImages);
        setHasMore(!res.data.last);
      })
      .catch(err => console.error('Error fetching images:', err))
      .finally(() => setIsLoading(false));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedTags([]);
    setPage(0);
  };

  const handleTagClick = (tagName) => {
    let newTags;
    if (tagName === 'All') {
      newTags = [];
    } else {
      if (selectedTags.includes(tagName)) {
        newTags = selectedTags.filter(t => t !== tagName);
      } else {
        if (selectedTags.length < 2) {
          newTags = [...selectedTags, tagName];
        } else {
          const [, second] = selectedTags;
          newTags = [second, tagName];
        }
      }
    }
    
    setSelectedTags(newTags);
    setSearchQuery('');
    setPage(0);
  };

  const breakpointColumnsObj = {
    default: 4, 
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="gallery-container">
      <div className="search-section">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="ค้นหาภาพ" 
            className="search-bar" 
            value={searchQuery}
            onChange={handleSearch}
          />
          {(searchQuery || selectedTags.length > 0) && (
            <button className="clear-btn" onClick={() => handleTagClick('All')}>&times;</button>
          )}
        </div>
      </div>

      <div className="tags-container">
        <span 
          className={`tag ${selectedTags.length === 0 ? 'active' : ''}`}
          onClick={() => handleTagClick('All')}
        >
          ทั้งหมด
        </span>
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className={`tag ${selectedTags.includes(tag.name) ? 'active' : ''}`}
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {!isLoading && images.length === 0 ? (
        <div className="no-results">
          <p>ไม่พบรูปภาพที่คุณกำลังค้นหา</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((img, index) => {
            const isLastElement = images.length === index + 1;
            return (
              <div ref={isLastElement ? lastImageRef : null} key={img.id}>
                <ImageCard 
                  img={img} 
                  activeTags={selectedTags}
                  onZoom={setZoomedImage} 
                  onTagClick={handleTagClick} 
                />
              </div>
            );
          })}
        </Masonry>
      )}

      {isLoading && (
        <div className="loading-state">
          กำลังโหลดภาพเพิ่มเติม...
        </div>
      )}

      {zoomedImage && (
        <Lightbox img={zoomedImage} onClose={() => setZoomedImage(null)} />
      )}
    </div>
  );
}

export default Gallery;
// 상품 갤러리 탭 전환
const tabs = document.querySelectorAll('.tab');
const galleryItems = document.querySelectorAll('.gallery-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.category;
    galleryItems.forEach(item => {
      if (item.dataset.category === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// 페이지 로딩 시 기본으로 '기념일' 카테고리만 표시
function initializeGallery() {
  galleryItems.forEach(item => {
    if (item.dataset.category === 'anniversary') {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// fade-in 스크롤 애니메이션
function handleFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', handleFadeIn);
window.addEventListener('DOMContentLoaded', () => {
  // 초기 fade-in 적용
  document.querySelectorAll('section, .gallery-item, .review-card').forEach(el => {
    el.classList.add('fade-in');
  });
  handleFadeIn();
  
  // 갤러리 초기화
  initializeGallery();
}); 
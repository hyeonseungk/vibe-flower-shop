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

// Supabase 연동 설정
const supabaseUrl = 'https://xlewxcikcavjlrtzuape.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZXd4Y2lrY2F2amxydHp1YXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzAyOTEsImV4cCI6MjA2ODkwNjI5MX0.cZWtexZ-9lyrGSagHOuwOUs7jr2XlL3wLF4jNMyKn6Q';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// 문의 폼 제출 처리
document.getElementById('inquiry-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.querySelector('.submit-btn');
  const messageDiv = document.getElementById('form-message');
  const phoneInput = document.getElementById('phone');
  const inquiryInput = document.getElementById('inquiry');
  
  // 버튼 비활성화 및 로딩 상태 표시
  submitBtn.disabled = true;
  submitBtn.textContent = '전송 중...';
  messageDiv.style.display = 'none';
  
  try {
    // 입력값 검증
    const phone = phoneInput.value.trim();
    const inquiry = inquiryInput.value.trim();
    
    if (!phone || !inquiry) {
      throw new Error('모든 필드를 입력해주세요.');
    }
    
    // 전화번호 형식 검증 (간단한 한국 휴대전화 번호 형식)
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('휴대전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
    }
    
    // Supabase에 데이터 저장
    const { data, error } = await supabase
      .from('customer_inquiries')
      .insert([
        {
          phone_number: phone,
          inquiry: inquiry
        }
      ]);
    
    if (error) {
      throw error;
    }
    
    // 성공 메시지 표시
    messageDiv.className = 'form-message success';
    messageDiv.textContent = '문의사항이 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다!';
    messageDiv.style.display = 'block';
    
    // 폼 초기화
    phoneInput.value = '';
    inquiryInput.value = '';
    
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    
    // 에러 메시지 표시
    messageDiv.className = 'form-message error';
    messageDiv.textContent = error.message || '문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    messageDiv.style.display = 'block';
  } finally {
    // 버튼 상태 복원
    submitBtn.disabled = false;
    submitBtn.textContent = '문의 보내기';
  }
});

// 전화번호 입력 시 자동 하이픈 추가
document.getElementById('phone').addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '');
  
  if (value.length >= 3 && value.length <= 7) {
    value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
  } else if (value.length >= 8) {
    value = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  
  e.target.value = value;
}); 
    gsap.registerPlugin(ScrollTrigger);

    // Hero heading pan out
    gsap.from('.blog-hero-heading', {
      scale: 0.6, opacity: 0, y: 40,
      duration: 1, ease: 'power3.out'
    });
    gsap.from('.section-badge, .page-breadcrumb', {
      opacity: 0, y: 20,
      duration: 0.6, ease: 'power2.out'
    });

    // Featured post
    gsap.from('.blog-featured-img', {
      clipPath: 'inset(0% 0 100% 0)',
      scrollTrigger: { trigger: '.blog-featured', start: 'top 80%' },
      duration: 1.2, ease: 'power3.inOut'
    });
    gsap.from('.blog-featured-card', {
      opacity: 0, x: 60,
      scrollTrigger: { trigger: '.blog-featured', start: 'top 80%' },
      duration: 0.9, ease: 'power3.out', delay: 0.3
    });

    // Filter tabs fade up
    gsap.fromTo('.blog-filter-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: '.blog-latest', start: 'top 85%' }, duration: 0.5, ease: 'power2.out', stagger: 0.1 }
    );
    gsap.fromTo('.blog-latest-title',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: '.blog-latest', start: 'top 85%' }, duration: 0.6, ease: 'power2.out' }
    );

    // Blog cards staggered slide-up
    gsap.utils.toArray('.blog-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 60,
        scrollTrigger: { trigger: card, start: 'top 85%' },
        duration: 0.7, ease: 'power2.out', delay: (i % 3) * 0.15
      });
    });

    // CTA banner
    gsap.from('.blog-cta-inner', {
      opacity: 0, y: 50,
      scrollTrigger: { trigger: '.blog-cta', start: 'top 80%' },
      duration: 0.9, ease: 'power3.out'
    });

    // Filter functionality
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        blogCards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  

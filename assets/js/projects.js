    gsap.registerPlugin(ScrollTrigger);

    // Hero heading scale up from 0.6
    gsap.from('.projects-hero-heading', {
      scale: 0.6, opacity: 0, y: 40,
      duration: 1, ease: 'power3.out'
    });
    gsap.from('.section-badge, .page-breadcrumb', {
      opacity: 0, y: 20,
      duration: 0.6, ease: 'power2.out'
    });

    // Filter tabs fade up
    gsap.fromTo('.project-filter-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.4 }
    );

    // Project cards staggered slide-up on scroll
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 60,
        scrollTrigger: { trigger: card, start: 'top 85%' },
        duration: 0.7, ease: 'power2.out', delay: (i % 2) * 0.15
      });
    });

    // CTA banner fade up on scroll
    gsap.from('.projects-cta-inner', {
      opacity: 0, y: 50,
      scrollTrigger: { trigger: '.projects-cta', start: 'top 80%' },
      duration: 0.9, ease: 'power3.out'
    });

    // Filter functionality
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        projectCards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  

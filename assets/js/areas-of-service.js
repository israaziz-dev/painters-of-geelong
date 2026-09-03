    gsap.registerPlugin(ScrollTrigger);

    // Hero heading pan out
    gsap.from('.areas-hero-heading', {
      scale: 0.6, opacity: 0, y: 40,
      duration: 1, ease: 'power3.out'
    });
    gsap.from('.areas-hero-sub', {
      opacity: 0, y: 20,
      duration: 0.6, ease: 'power2.out', delay: 0.3
    });

    // Area cards staggered slide-up
    gsap.utils.toArray('.area-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: card, start: 'top 85%' }, duration: 0.7, ease: 'power2.out', delay: (i % 3) * 0.15 }
      );
    });

    // CTA banner
    gsap.fromTo('.areas-cta-inner',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, scrollTrigger: { trigger: '.areas-cta', start: 'top 80%' }, duration: 0.9, ease: 'power3.out' }
    );
  

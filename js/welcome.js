/* ===================================================
   SUBJECTS ONLINE — Welcome Page Animations
   Advanced GSAP ScrollTriggers & Mouse Parallax
   =================================================== */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initFeatureScroll();
    initMouseParallax();
});

/**
 * Hero Intro Sequence
 */
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Header fades down
    tl.fromTo('header.hero-elem', 
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, clearProps: 'transform' },
        0.2
    );

    // 2. Small badge slides up
    tl.fromTo('.hero-elem:nth-child(2)', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, clearProps: 'transform' }, 
        0.4
    );

    // 3. Staggered Title Words reveal
    tl.to('.hero-title-word', {
        y: '0%',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    }, 0.6);

    // 4. Description fades up
    tl.fromTo('p.hero-elem', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, clearProps: 'transform' },
        1.2
    );

    // 5. Buttons fade up
    tl.fromTo('.flex.hero-elem', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, clearProps: 'transform' },
        1.4
    );

    // 6. Scroll Indicator
    tl.fromTo('.absolute.bottom-10.hero-elem', 
        { opacity: 0 },
        { opacity: 1, duration: 1, clearProps: 'transform' },
        2.0
    );
}

/**
 * ScrollTrigger for Feature Rows
 */
function initFeatureScroll() {
    const rows = gsap.utils.toArray('.feature-row');

    rows.forEach((row, i) => {
        const imgWrapper = row.querySelector('.feature-img-wrapper');
        const textWrapper = row.querySelector('.feature-text');
        
        // Determine direction based on layout (even vs odd rows if we want alternating, but we set them in HTML)
        const isReverse = row.classList.contains('md:flex-row-reverse');
        const xOffset = isReverse ? 50 : -50;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: 'top 80%', // trigger when top of row hits 80% of viewport
                toggleActions: 'play none none reverse'
            }
        });

        // Image container slides in
        tl.fromTo(imgWrapper, 
            { x: xOffset, opacity: 0, rotationY: isReverse ? -10 : 10 },
            { x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: 'power3.out' },
            0
        );

        // Text wrapper slides up
        tl.fromTo(textWrapper.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
            0.2
        );
    });

    // CTA Section Animation
    gsap.fromTo('.cta-block',
        { y: 50, opacity: 0, scale: 0.95 },
        { 
            y: 0, opacity: 1, scale: 1, 
            duration: 1.2, 
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.cta-block',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

/**
 * Advanced Mouse Parallax
 * Makes background floating elements and glow orbs track mouse slightly
 */
function initMouseParallax() {
    const floatElems = document.querySelectorAll('.float-elem');
    const orbs = document.querySelectorAll('.glow-orb');
    
    // Only enable on desktop
    if (window.innerWidth < 768) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

        // Floating geometric elements in hero
        floatElems.forEach((elem) => {
            const speed = parseFloat(elem.getAttribute('data-speed')) || 1;
            gsap.to(elem, {
                x: x * 30 * speed,
                y: y * 30 * speed,
                duration: 1.5,
                ease: 'power2.out'
            });
        });

        // Background large glow orbs (slower parallax)
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 1.5;
            gsap.to(orb, {
                x: -(x * 20 * speed), // Moves opposite to mouse for depth
                y: -(y * 20 * speed),
                duration: 2.5,
                ease: 'power2.out'
            });
        });
    });
}

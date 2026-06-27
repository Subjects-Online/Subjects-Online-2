/* browse.js */
document.addEventListener('DOMContentLoaded', () => {
    const deptText = localStorage.getItem('subjectsOnlineDept') || 'Accounting';
    const deptKey  = getDeptKey(deptText);
    const favs     = getFavorites();
    const items    = MATERIALS[deptKey] || MATERIALS['accounting'];

    document.getElementById('browse-subtitle').textContent = `${deptText} — ${items.length} modules available.`;

    const grid = document.getElementById('material-grid');
    grid.innerHTML = items.map(item => materialCardHTML(item, favs.includes(item.id))).join('');
    bindFavButtons(grid);

    gsap.fromTo('.material-card',
        { y: 40, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
    );
});

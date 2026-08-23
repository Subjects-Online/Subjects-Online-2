platforms = [
    ("HackTheBox", "Tech", "#111827", "#10b981", "HTB", "Advanced cybersecurity training and penetration testing labs.", "FREE TIER", "PREMIUM"),
    ("TryHackMe", "Tech", "#1e40af", "#ef4444", "THM", "Learn cybersecurity from scratch through gamified, hands-on labs.", "FREE TIER", "PREMIUM"),
    ("Cybrary", "Tech", "#000000", "#3b82f6", "CYB", "IT and cybersecurity training platform for career advancement.", "FREE TIER", "CERTIFIED"),
    ("OffSec", "Tech", "#450a0a", "#dc2626", "OSC", "Industry-leading cybersecurity training and the creators of Kali Linux.", "PREMIUM", "CERTIFIED"),
    ("INE", "Tech", "#172554", "#6366f1", "INE", "Expert IT training for Networking, Cyber Security, Cloud, and Data Science.", "PREMIUM", "CERTIFIED"),
    ("Springboard", "Skills", "#064e3b", "#10b981", "SPR", "Online bootcamps with 1-on-1 mentorship and job guarantees.", "PREMIUM", "MENTORSHIP"),
    ("Thinkful", "Tech", "#4c1d95", "#8b5cf6", "THK", "Tech bootcamps in software engineering, data science, and UX/UI.", "PREMIUM", "MENTORSHIP"),
    ("General Assembly", "Tech", "#7f1d1d", "#ef4444", "GA", "Pioneer in tech bootcamps, offering immersive courses in coding and data.", "PREMIUM", "GLOBAL"),
    ("App Academy", "Tech", "#7c2d12", "#f97316", "a/A", "Top-tier coding bootcamp known for its deferred tuition model.", "FREE OPTIONS", "BOOTCAMP"),
    ("Ironhack", "Tech", "#0f172a", "#38bdf8", "IH", "Global tech school offering web development and data analytics bootcamps.", "PREMIUM", "GLOBAL"),
    ("BrainStation", "Tech", "#000000", "#14b8a6", "BS", "Global leader in digital skills training, empowering businesses and brands.", "PREMIUM", "ENTERPRISE"),
    ("SheCodes", "Tech", "#831843", "#f472b6", "SC", "Coding workshops designed highly specifically to empower women in tech.", "PREMIUM", "COMMUNITY"),
    ("MasterClass", "Skills", "#000000", "#a8a29e", "MC", "Learn from the world's best practitioners in business, design, and more.", "PREMIUM", "ENTERTAINMENT"),
    ("Skillshare", "Skills", "#1e3a8a", "#3b82f6", "SKL", "Online learning community for creators, focusing on creative skills.", "PREMIUM", "COMMUNITY"),
    ("Mindvalley", "Skills", "#4a044e", "#d946ef", "MV", "Transformational education focused on personal growth and mindfulness.", "PREMIUM", "LIFESTYLE"),
    ("Outlier", "Global", "#022c22", "#10b981", "OUT", "Beautiful, cinematic college courses providing real university credit.", "PREMIUM", "CREDIT"),
    ("CodeCombat", "Tech", "#14532d", "#22c55e", "CC", "Learn Python and JavaScript by playing a real coding game.", "FREE TIER", "GAMIFIED"),
    ("Scratch", "Tech", "#b45309", "#f59e0b", "SCR", "Creative coding community for kids, developed by MIT Media Lab.", "FREE", "KIDS"),
    ("Tynker", "Tech", "#1e40af", "#3b82f6", "TYN", "Coding for kids made fun with block-based and text-based programming.", "FREE TIER", "KIDS"),
    ("AWS Skill Builder", "Tech", "#451a03", "#f97316", "AWS", "Official Amazon Web Services cloud training and certification paths.", "FREE TIER", "CERTIFIED"),
    ("Cisco NetAcad", "Tech", "#0f172a", "#0ea5e9", "CIS", "Cisco Networking Academy providing foundational IT and networking skills.", "FREE", "CERTIFIED"),
    ("Fortinet Training", "Tech", "#7f1d1d", "#ef4444", "FTN", "Official cybersecurity training and NSE certification programs by Fortinet.", "FREE TIER", "CERTIFIED"),
    ("Juniper Open Learning", "Tech", "#064e3b", "#10b981", "JUN", "Free certification preparation for networking professionals.", "FREE", "CERTIFIED"),
    ("Linux Academy", "Tech", "#020617", "#fbbf24", "LA", "High-quality, hands-on cloud training (now part of A Cloud Guru/Pluralsight).", "PREMIUM", "CLOUD"),
    ("RangeForce", "Tech", "#172554", "#60a5fa", "RF", "Interactive, hands-on cyber defense training for security operations.", "PREMIUM", "ENTERPRISE")
]

html = ""
for name, category, color1, color2, acronym, desc, tag1, tag2 in platforms:
    html += f'''
            <!-- Item: {name} -->
            <div class="lux-card" data-category="{category.lower()}">
                <div class="card-ambient" style="background: {color2};"></div>
                <div class="lux-card-inner">
                    <div class="card-header">
                        <div class="brand-logo-box" style="background: linear-gradient(135deg, {color1}, {color2});">
                            {acronym}
                        </div>
                    </div>
                    <h3 class="card-title">{name}</h3>
                    <div class="tag-row">
                        <span class="badge badge-free">{tag1}</span>
                        <span class="badge badge-prem">{tag2}</span>
                    </div>
                    <p class="card-desc">{desc}</p>
                    <div class="mt-auto">
                        <a href="#" class="action-link" target="_blank" rel="noopener">
                            Visit Platform
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
'''
with open("platforms.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Done")

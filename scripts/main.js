// ====================
// ページローダー
// ====================

window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('loaded');
        setTimeout(() => loader.remove(), 600);
    }
});

// ====================
// 東京時間表示
// ====================

function updateTokyoTime() {
    const timeElement = document.getElementById('tokyo-time');
    if (!timeElement) return;

    const tokyoTime = new Date().toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    timeElement.textContent = tokyoTime;
}

updateTokyoTime();
let timeInterval = setInterval(updateTokyoTime, 1000);

// ページ非表示時にタイマーを停止（省エネ）
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(timeInterval);
    } else {
        updateTokyoTime();
        timeInterval = setInterval(updateTokyoTime, 1000);
    }
});

// ====================
// モバイルナビゲーション
// ====================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function closeMenu() {
    if (!navMenu || !navMenu.classList.contains('active')) return;
    navMenu.classList.remove('active');
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
}

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isActive);
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = isActive ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = isActive ? '0' : '1';
        spans[2].style.transform = isActive ? 'rotate(-45deg) translate(7px, -6px)' : 'rotate(0) translate(0, 0)';
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ====================
// スムーズスクロール
// ====================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
});

// ====================
// スクロールイベント（統合）
// ====================

const navbar = document.querySelector('.navbar');
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // ナビバーのシャドウ
    if (navbar) {
        navbar.style.boxShadow = scrollTop > 50
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : 'none';
    }

    // トップに戻るボタン
    if (backToTopButton) {
        if (scrollTop > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }

    // アクティブナビリンク
    const sections = document.querySelectorAll('.section, .hero');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        if (scrollTop >= sectionTop - navbarHeight - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// ====================
// トップに戻るボタン
// ====================

if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ====================
// スクロールアニメーション（IntersectionObserver）
// ====================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

// スキルバー進捗アニメーション
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, index * 80);
            });
            skillBarObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

document.addEventListener('DOMContentLoaded', () => {
    // スクロールアニメーション対象
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-category, .contact-item, .timeline-item, .memo-card, .daily-card'
    );
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-ready');
        // グリッド内の交錯遅延
        el.style.transitionDelay = (index % 3) * 0.1 + 's';
        observer.observe(el);
    });

    // スキルバー監視
    document.querySelectorAll('.skill-category').forEach(cat => {
        skillBarObserver.observe(cat);
    });
});

// ====================
// 数字カウンターアニメーション
// ====================

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 1500;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutCubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.round(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }
});

// ====================
// 打字機效果（Hero）
// ====================

function typeWriter(element, texts, speed, pause) {
    if (!element) return;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // カーソル要素を追加
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    element.after(cursor);

    function tick() {
        const current = texts[textIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? speed / 2 : speed;

        if (!isDeleting && charIndex === current.length) {
            delay = pause;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = speed;
        }

        setTimeout(tick, delay);
    }

    tick();
}

document.addEventListener('DOMContentLoaded', () => {
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        typeWriter(typedEl, [
            'システムエンジニア',
            '金融システムの専門家',
            'COBOL / Java / Python',
            '11年以上の実務経験'
        ], 80, 2000);
    }
});

// ====================
// ダークモード切替
// ====================

function getThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const label = theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getThemePreference();
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getThemePreference());

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

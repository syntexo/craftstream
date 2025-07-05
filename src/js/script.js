// Main Script for CraftStream - V5 FINAL (All features merged)

(function() {
    'use strict';

    // --- Main App Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        new WebsiteApp();
    });

    // --- Global Utilities ---
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // --- Main Website Application Class ---
    class WebsiteApp {
        constructor() {
            this.initializeComponents();
        }

        initializeComponents() {
            console.log("CraftStream Website App Initializing...");
            try {
                // Global components that run on all pages
                new HeaderScrollBehavior();
                new MobileNavigation();
                new BackToTop();
                new CurrentYearUpdater();
                
                // Page-specific components
                if (document.getElementById('hero-section')) {
                    new HeroV4(); 
                }
                if (document.querySelector('.filter-tab')) {
                    new BlogFilter();
                }
                if (document.querySelector('.animate-on-scroll')) {
                    new ScrollAnimations();
                }
                if (document.getElementById('contact-form')) {
                    new ContactFormValidation();
                }

                console.log('CraftStream Website App Initialized Successfully.');
            } catch (error) {
                console.error('Error initializing Website App components:', error);
            }
        }
    }

    // --- Component: Header Scroll Behavior ---
    class HeaderScrollBehavior {
        constructor() {
            this.header = document.getElementById('main-header');
            if (!this.header) return;
            this.init();
        }
        init() {
            const handleScroll = () => {
                this.header.classList.toggle('scrolled', window.scrollY > 50);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
    }
    
    // --- Component: Mobile Navigation ---
    class MobileNavigation {
        constructor() {
            this.toggleButton = document.getElementById('mobile-menu-toggle');
            this.overlay = document.querySelector('#main-header + div'); // More robust selector
            if (!this.toggleButton || !this.overlay) return;
            
            this.navContent = this.overlay.querySelector('div');
            this.closeButton = this.overlay.querySelector('button');
            this.isOpen = false;
            this.init();
        }

        init() {
            this.toggleButton.addEventListener('click', () => this.open());
            if(this.closeButton) this.closeButton.addEventListener('click', () => this.close());
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });
        }

        open() {
            if (this.isOpen) return;
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
            this.overlay.classList.remove('invisible', 'opacity-0');
            if(this.navContent) this.navContent.classList.remove('translate-x-full');
        }

        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            document.body.style.overflow = '';
            this.overlay.classList.add('opacity-0');
            if(this.navContent) this.navContent.classList.add('translate-x-full');
            setTimeout(() => {
                this.overlay.classList.add('invisible');
            }, 300);
        }
    }

    // --- Component: Blog Filtering and Search ---
    class BlogFilter {
        constructor() {
            this.container = document.querySelector('.stagger-container');
            this.filterButtons = document.querySelectorAll('.filter-tab');
            this.searchInput = document.getElementById('search-input');
            if (!this.container) return;
            
            this.allPosts = Array.from(this.container.querySelectorAll('.blog-post-card'));
            this.init();
        }

        init() {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleFilterClick(e.target));
            });
            
            if(this.searchInput) {
                this.searchInput.addEventListener('keyup', Utils.debounce(() => this.applyFilters(), 300));
            }
            
            const allButton = document.querySelector('.filter-tab[data-filter="all"]');
            if (allButton) allButton.classList.add('active', 'bg-craft-primary', 'text-white');
        }

        handleFilterClick(clickedButton) {
            this.filterButtons.forEach(btn => btn.classList.remove('active', 'bg-craft-primary', 'text-white'));
            clickedButton.classList.add('active', 'bg-craft-primary', 'text-white');
            this.applyFilters();
        }

        applyFilters() {
            const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
            const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';

            this.allPosts.forEach(post => {
                const postCategories = post.dataset.category || '';
                const postText = (post.textContent || '').toLowerCase();

                const categoryMatch = activeFilter === 'all' || postCategories.includes(activeFilter);
                const searchMatch = searchTerm === '' || postText.includes(searchTerm);

                post.style.display = (categoryMatch && searchMatch) ? 'flex' : 'none';
            });
        }
    }
    
    // --- Component: Hero Section V4 ---
    class HeroV4 {
        constructor() {
            this.heroSection = document.getElementById('hero-section');
            if (!this.heroSection) return;

            this.bgContainer = document.getElementById('hero-backgrounds');
            this.heroImage = document.getElementById('heroImage');
            this.headline = document.getElementById('hero-headline');
            this.subtext = document.getElementById('hero-subtext');
            this.dotsContainer = document.getElementById('hero-dots');
            this.textElements = [this.headline, this.subtext, this.heroSection.querySelector('.flex-col.sm\\:flex-row')];

            this.slides = [
                {
                    bgLeft: '#fde6e8', bgRight: '#e0f2f1',
                    heroImage: 'images/hero/hero1.jpg',
                    headline: `Handcrafted <span class="text-pink-400 drop-shadow-lg">Paper Blooms</span>`,
                    subtext: `Discover the art of creating stunning, lifelike paper flowers for any occasion.`
                },
                {
                    bgLeft: '#fff3cd', bgRight: '#fdfbf6',
                    heroImage: 'images/hero/hero2.jpg',
                    headline: `The Ancient <span class="text-amber-500 drop-shadow-lg">Art of the Fold</span>`,
                    subtext: `Master the ancient art of origami with our detailed tutorials.`
                },
                {
                    bgLeft: '#ffcdd2', bgRight: '#dcedc8',
                    heroImage: 'images/hero/hero3.jpg',
                    headline: `Creative <span class="text-red-500 drop-shadow-lg">Kids Corner</span>`,
                    subtext: `Engage your kids with simple, fun, and colorful paper craft projects.`
                },
                {
                    bgLeft: '#424242', bgRight: '#ff9800',
                    heroImage: 'images/hero/hero4.jpg',
                    headline: `Build Your <span class="text-orange-400 drop-shadow-lg">Legends in Paper</span>`,
                    subtext: `Take on the ultimate challenge with our advanced 3D paper sculpture models.`
                },
                {
                    bgLeft: '#e1d5e7', bgRight: '#f5f5f5',
                    heroImage: 'images/hero/hero5.jpg',
                    headline: `Shape Your <span class="text-purple-400 drop-shadow-lg">Imagination</span>`,
                    subtext: `Explore the unique and versatile world of wire crafting.`
                }
            ];

            this.currentSlideIndex = 0;
            this.isTransitioning = false;
            this.slideInterval = null;
            this.init();
        }

        init() {
            this.createDOMElements();
            this.goToSlide(0, true);
            this.startAutoPlay();
        }

        createDOMElements() {
            this.bgLeft = document.createElement('div');
            this.bgLeft.className = 'background-half left';
            this.bgRight = document.createElement('div');
            this.bgRight.className = 'background-half right';
            this.bgContainer.append(this.bgLeft, this.bgRight);

            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.dataset.index = index;
                dot.addEventListener('click', () => {
                    if (index !== this.currentSlideIndex && !this.isTransitioning) {
                        this.goToSlide(index);
                        this.startAutoPlay(); // Reset timer on manual click
                    }
                });
                this.dotsContainer.appendChild(dot);
            });
        }

        goToSlide(index, isInitial = false) {
            if (this.isTransitioning && !isInitial) return;
            this.isTransitioning = true;
            
            this.currentSlideIndex = index;
            const slideData = this.slides[index];
            
            this.dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));

            this.heroSection.classList.remove('active');
            this.textElements.forEach(el => el.classList.add('hero-content-out'));
            
            setTimeout(() => {
                this.bgLeft.style.backgroundColor = slideData.bgLeft;
                this.bgRight.style.backgroundColor = slideData.bgRight;
                this.heroImage.src = slideData.heroImage;
                this.headline.innerHTML = slideData.headline;
                this.subtext.textContent = slideData.subtext;

                this.heroSection.classList.add('active');
                this.textElements.forEach(el => el.classList.remove('hero-content-out'));
                
                setTimeout(() => this.isTransitioning = false, 500);

            }, isInitial ? 50 : 800);
        }

        startAutoPlay() {
            if (this.slideInterval) clearInterval(this.slideInterval);
            this.slideInterval = setInterval(() => {
                const nextIndex = (this.currentSlideIndex + 1) % this.slides.length;
                this.goToSlide(nextIndex);
            }, 6000);
        }
    }
    
    // --- Component: Scroll-triggered Animations ---
    class ScrollAnimations {
        constructor() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            if (animatedElements.length === 0) return;

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => observer.observe(el));
        }
    }

    // --- Component: Back to Top Button ---
    class BackToTop {
        constructor() {
            this.button = document.getElementById('back-to-top');
            if(!this.button) return;
            window.addEventListener('scroll', () => {
                this.button.classList.toggle('hidden', window.scrollY < 400);
            }, { passive: true });
            this.button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }

    // --- Component: Contact Form Validation ---
    class ContactFormValidation {
         constructor() {
            this.form = document.getElementById('contact-form');
            if (!this.form) return;
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Form submitted! (This is a demo)');
            });
         }
    }

    // --- Component: Update Copyright Year ---
    class CurrentYearUpdater {
        constructor() {
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        }
    }

})();
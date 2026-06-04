        const siteHeader = document.querySelector("header");
        let lastScrollY = window.scrollY;
        let tickingHeader = false;

        function updateHeaderVisibility() {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            const isNearTop = currentScrollY < 24;

            if (siteHeader) {
                if (isNearTop || scrollDelta < -8) siteHeader.classList.remove("header-hidden");
                else if (scrollDelta > 8) siteHeader.classList.add("header-hidden");
            }

            lastScrollY = currentScrollY;
            tickingHeader = false;
        }

        window.addEventListener("scroll", () => {
            if (!tickingHeader) {
                window.requestAnimationFrame(updateHeaderVisibility);
                tickingHeader = true;
            }
        }, { passive: true });

        const hamburger = document.querySelector(".hamburger");
        const mobileMenu = document.querySelector(".mobile-menu");
        const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
        const dropdownToggles = document.querySelectorAll(".mobile-menu .dropdown-toggle");
        const closeMenu = document.querySelector(".close-menu");

        function toggleMobileMenu(forceState) {
            const willOpen = typeof forceState === "boolean" ? forceState : !mobileMenu.classList.contains("active");
            mobileMenu.classList.toggle("active", willOpen);
            mobileMenuOverlay.style.display = willOpen ? "block" : "none";
            document.body.style.overflow = willOpen ? "hidden" : "";
        }

        hamburger?.addEventListener("click", () => toggleMobileMenu());
        mobileMenuOverlay?.addEventListener("click", () => toggleMobileMenu(false));
        closeMenu?.addEventListener("click", () => toggleMobileMenu(false));

        dropdownToggles.forEach((toggle) => {
            toggle.addEventListener("click", (event) => {
                event.preventDefault();
                toggle.classList.toggle("active");
                toggle.nextElementSibling?.classList.toggle("active");
            });
        });

        document.querySelectorAll(".mobile-menu a[href], .mobile-menu button.open-contact").forEach((link) => {
            link.addEventListener("click", () => toggleMobileMenu(false));
        });

        const videoContainer = document.querySelector(".video-container");
        const videos = document.querySelectorAll(".video-container video");
        let startX = 0;
        let moveX = 0;
        let startDragX = 0;
        let index = 0;
        let isDragging = false;

        function updateVideoPosition() {
            if (videoContainer) {
                videoContainer.style.transform = `translateX(-${index * 100}%)`;
            }
        }

        videoContainer?.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; });
        videoContainer?.addEventListener("touchmove", (event) => { moveX = event.touches[0].clientX; });
        videoContainer?.addEventListener("touchend", () => {
            if (startX - moveX > 50 && index < videos.length - 1) index += 1;
            else if (moveX - startX > 50 && index > 0) index -= 1;
            updateVideoPosition();
        });
        videoContainer?.addEventListener("mousedown", (event) => {
            isDragging = true;
            startDragX = event.clientX;
            event.preventDefault();
        });
        document.addEventListener("mousemove", (event) => {
            if (!isDragging) return;
            const dragDistance = event.clientX - startDragX;
            if (Math.abs(dragDistance) > 60) {
                if (dragDistance > 0 && index > 0) index -= 1;
                else if (dragDistance < 0 && index < videos.length - 1) index += 1;
                isDragging = false;
                updateVideoPosition();
            }
        });
        document.addEventListener("mouseup", () => { isDragging = false; });
        videos.forEach((video) => {
            video.addEventListener("dragstart", (event) => event.preventDefault());
            video.play().catch(() => {});
        });
        window.addEventListener("resize", updateVideoPosition);
        updateVideoPosition();

        const formOverlay = document.getElementById("contact-overlay");
        const closeForm = document.querySelector(".close-form");
        const openContactButtons = document.querySelectorAll(".open-contact");

        function openContactForm() {
            formOverlay?.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeContactForm() {
            formOverlay?.classList.remove("active");
            document.body.style.overflow = "";
        }

        openContactButtons.forEach((button) => {
            button.addEventListener("click", openContactForm);
        });
        closeForm?.addEventListener("click", closeContactForm);
        formOverlay?.addEventListener("click", (event) => {
            if (event.target === formOverlay) closeContactForm();
        });

        function smoothScroll(target) {
            const element = document.querySelector(target);
            if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        document.querySelectorAll("[data-scroll-target]").forEach((button) => {
            button.addEventListener("click", () => smoothScroll(button.getAttribute("data-scroll-target")));
        });
        document.querySelectorAll('.desktop-menu a[href^="#"], .mobile-menu a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");
                const target = href ? document.querySelector(href) : null;
                if (!target) return;
                event.preventDefault();
                smoothScroll(href);
            });
        });

        function animateKpiNumbers() {
            document.querySelectorAll(".kpi-number").forEach((stat, statIndex) => {
                const target = Number.parseInt(stat.getAttribute("data-target"), 10);
                if (!Number.isFinite(target)) return;
                const duration = 1400;
                const delay = statIndex * 110;
                let startTime = null;
                stat.textContent = "0+";

                function tick(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.min(target, Math.round(eased * target));
                    stat.textContent = `${value}+`;

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        stat.textContent = `${target}+`;
                    }
                }

                window.setTimeout(() => requestAnimationFrame(tick), delay);
            });
        }

        const kpiSection = document.querySelector(".kpi-grid");
        if (kpiSection) {
            const kpiObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
                        animateKpiNumbers();
                        kpiObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: [0.25, 0.55, 0.75] });
            kpiObserver.observe(kpiSection);
        }

        function animateStats() {
            document.querySelectorAll(".stat-number").forEach((stat) => {
                const target = Number.parseInt(stat.getAttribute("data-target"), 10);
                const duration = 1600;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        stat.textContent = `${target}+`;
                        clearInterval(timer);
                    } else {
                        stat.textContent = `${Math.floor(current)}+`;
                    }
                }, 16);
            });
        }

        const statsSection = document.querySelector(".stats-section");
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35 });
            observer.observe(statsSection);
        }

        function openContainer(plan) {
            let containerId = "residential-plan-container";
            let iframeId = "residential-plan-iframe";
            if (plan.includes("commercial")) {
                containerId = "commercial-plan-container";
                iframeId = "commercial-plan-iframe";
            } else if (plan.includes("industrial")) {
                containerId = "industrial-plan-container";
                iframeId = "industrial-plan-iframe";
            }
            const container = document.getElementById(containerId);
            const iframe = document.getElementById(iframeId);
            if (!container || !iframe) return;
            iframe.src = `html/${plan}-quote.html`;
            container.style.display = "block";
            container.scrollIntoView({ behavior: "smooth", block: "start" });
            iframe.onload = function () {
                try {
                    this.style.height = `${this.contentWindow.document.body.scrollHeight}px`;
                } catch (error) {
                    this.style.height = "540px";
                }
            };
        }

        function closeContainer() {
            ["residential-plan-container", "commercial-plan-container", "industrial-plan-container"].forEach((id) => {
                const container = document.getElementById(id);
                if (container) container.style.display = "none";
            });
        }

        document.querySelectorAll(".plan-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const planType = button.getAttribute("data-plan");
                if (planType) openContainer(planType);
            });
        });

        document.querySelectorAll(".close-plan-container").forEach((button) => {
            button.addEventListener("click", closeContainer);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeContactForm();
                toggleMobileMenu(false);
                closeContainer();
            }
        });

        /* ── Scroll Reveal ── */
        const STAGGER_SELECTORS = [
            '.kpi-card',
            '.pricing-plan',
            '.process-step',
            '.studio-side-card',
            '.industrial-side-card',
            '.industrial-point',
            '.stat-item',
            '.insight-card',
            '.service-card',
            '.testi-card',
            '.wf-card',
            '.loc-card',
        ].join(',');

        const scrollRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                // Animate the parent reveal wrapper
                entry.target.classList.add('in');

                // Stagger animate child cards inside this section
                const children = [...entry.target.querySelectorAll(STAGGER_SELECTORS)];
                children.forEach((child, idx) => {
                    child.style.transitionDelay = `${idx * 0.11}s`;
                    child.classList.add('in');
                });

                // Once revealed, stop watching
                scrollRevealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.08 });

        // Initialise: mark children as hidden, then observe each .reveal section
        document.querySelectorAll('.reveal').forEach((section) => {
            const children = [...section.querySelectorAll(STAGGER_SELECTORS)];
            children.forEach((child) => {
                child.classList.add('reveal-child');
            });
            scrollRevealObserver.observe(section);
        });

/* == INLINE QUOTE PLAN SWITCHER == */
const IQ_MAP = {
    res: { standard: 'res-standard-frame', basic: 'res-standard-frame', premium: 'res-premium-frame', elite: 'res-elite-frame', deluxe: 'res-elite-frame' },
    com: { standard: 'com-standard-frame', startup: 'com-standard-frame', premium: 'com-premium-frame', corporate: 'com-premium-frame', elite: 'com-elite-frame', enterprise: 'com-elite-frame' },
    ind: { standard: 'ind-standard-frame', premium: 'ind-premium-frame', elite: 'ind-elite-frame', advanced: 'ind-elite-frame' }
};

window.resizeIQ = function(frame) {
    try {
        const h = frame.contentWindow.document.body.scrollHeight;
        if (h > 100) frame.style.height = (h + 40) + 'px';
    } catch(e) { frame.style.height = '800px'; }
};

window.switchIQ = function(group, plan, btn) {
    Object.values(IQ_MAP[group]).forEach(id => {
        const f = document.getElementById(id);
        if (f) { f.style.display = 'none'; f.classList.remove('iq-frame-visible'); }
    });
    const target = document.getElementById(IQ_MAP[group][plan]);
    if (target) {
        target.style.display = 'block';
        target.classList.add('iq-frame-visible');
        window.resizeIQ(target);
    }
    btn.closest('.iq-tabs').querySelectorAll('.iq-tab').forEach(t => t.classList.remove('iq-tab-active'));
    btn.classList.add('iq-tab-active');
};

// Global function for the booking modal form submission
window.submitEnquiry = async function(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerText;
    
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const res = await fetch('api/save_enquiry.php', {
            method: 'POST',
            body: formData
        });
        
        let data;
        try {
            data = await res.json();
        } catch(err) {
            data = { success: false, message: 'Server error' };
        }
        
        if (data.success) {
            alert('Booking successful! We will contact you shortly.');
            form.reset();
            // In case closeBookingModal doesn't exist globally
            const modal = document.getElementById('booking-modal');
            if (modal) modal.classList.remove('active');
        } else {
            alert('Error: ' + (data.message || 'Unknown error occurred.'));
        }
    } catch (e) {
        alert('An error occurred while submitting your enquiry. Please try again.');
        console.error(e);
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
};

// Global function for the hero section form submission
window.submitHeroEnquiry = async function(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerText;
    
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const res = await fetch('api/save_hero_enquiry.php', {
            method: 'POST',
            body: formData
        });
        
        let data;
        try {
            data = await res.json();
        } catch(err) {
            data = { success: false, message: 'Server error' };
        }
        
        if (data.success) {
            alert('Booking successful! We will contact you shortly.');
            form.reset();
        } else {
            alert('Error: ' + (data.message || 'Unknown error occurred.'));
        }
    } catch (e) {
        alert('An error occurred while submitting your enquiry. Please try again.');
        console.error(e);
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
};

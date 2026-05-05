// DOM Content Loaded: Ensures all elements are ready before execution
document.addEventListener('DOMContentLoaded', () => {
    // INITIALIZE LENIS SMOOTH SCROLL: Uses high-performance inertial scrolling for a premium feel
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // RequestAnimationFrame (RAF) loop: Required by Lenis to update the scroll position smoothly
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // SLIDER ENGINE: Handles multiple sliders on the same page
    const initSlider = (wrapper) => {
        const slides = wrapper.querySelectorAll('.slide');
        const dots = wrapper.closest('section')?.querySelectorAll('.dot') || [];
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            if (dots.length > 0) dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
            nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => showSlide(index));
                });
            }

            // Auto slide: Transitions every 5 seconds
            setInterval(() => showSlide(currentSlide + 1), 5000);
        }
    };

    // Initialize all sliders found on the page
    document.querySelectorAll('.slider-wrapper').forEach(initSlider);

    // AUTO-NAVIGATE ON SCROLL: Enhances UX by flowing through the presentation-style pages
    let isScrolling = false;
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        const scrollPos = window.innerHeight + window.pageYOffset;
        const totalHeight = document.body.offsetHeight;
        const atBottom = scrollPos >= totalHeight - 10;
        const atTop = window.pageYOffset <= 10;

        const pages = ['index.html', 'domain.html', 'milestones.html', 'documents.html', 'slides.html', 'about.html', 'contact.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pages.indexOf(currentPage);

        let nextPage = null;

        // Navigate Forward (Scroll Down at Bottom)
        if (atBottom && e.deltaY > 0 && currentIndex < pages.length - 1) {
            nextPage = pages[currentIndex + 1];
        } 
        // Navigate Backward (Scroll Up at Top)
        else if (atTop && e.deltaY < 0 && currentIndex > 0) {
            nextPage = pages[currentIndex - 1];
        }

        if (nextPage) {
            isScrolling = true;
            // Fade out transition before navigating
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                window.location.href = nextPage;
            }, 500);
        }
    });

    // CONTACT FORM HANDLING: Integrates with Formspree for serverless email submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            const overlay = document.getElementById('success-overlay');
            
            // Visual feedback: Show loading state
            btn.classList.add('btn-loading');
            btn.disabled = true;

            // FormData collection: Aggregates input values for the POST request
            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('_replyto', document.getElementById('email').value);
            formData.append('contact', document.getElementById('contact_number').value);
            formData.append('message', document.getElementById('message').value);

            // Fetch API: Sends data to Formspree endpoint asynchronously
            fetch("https://formspree.io/f/mpqbpvle", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                btn.classList.remove('btn-loading');
                btn.disabled = false;
                
                if (response.ok) {
                    // Show success modal on successful submission
                    overlay.classList.add('active');
                    contactForm.reset();
                } else {
                    alert("Submission failed. Please check the network connection.");
                }
            }).catch(error => {
                btn.classList.remove('btn-loading');
                btn.disabled = false;
                alert("Error connecting to server: " + error.message);
            });
        });
    }
});
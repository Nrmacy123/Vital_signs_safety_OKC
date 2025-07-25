// Main JavaScript for Vital Signs Safety OKC
// Enhanced functionality for better user experience

document.addEventListener('DOMContentLoaded', function() {

    // Function to fetch and load an HTML component
    const loadComponent = (path, elementId) => {
        const element = document.getElementById(elementId);
        // Only fetch if the target element exists on the page
        if (element) {
            fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok for ${path}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error(`Error loading component into #${elementId}:`, error));
        }
    };

    // Load header and footer using correct relative paths
    loadComponent('assets/components/header.html', 'header');
    loadComponent('assets/components/footer.html', 'footer');

    // 1. SMOOTH SCROLLING FOR NAVIGATION LINKS
    // This needs to be delegated or re-run after components load to catch new links.
    // For now, we assume they are present at load or we can re-run this logic.
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // 2. PHONE NUMBER CLICK-TO-CALL
    // Makes phone numbers clickable. Uses event delegation to work on dynamically loaded content.
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.phone-number')) {
            e.target.style.cursor = 'pointer';
            const number = e.target.textContent.replace(/\D/g, ''); // Remove non-digits
            window.location.href = `tel:${number}`;
        }
    });

    // 3. CONTACT FORM ENHANCEMENT
    // Improves form usability and prevents spam
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--vs-utility-error)';

                    isValid = false;
                } else {
                    field.style.borderColor = 'var(--vs-accent-green)';
                }
            });

            if (isValid) {
                // Show success message (you'll need to add actual form processing)
                showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }

    // 4. PRICING CALCULATOR
    // Helps parents estimate costs
    function initPriceCalculator() {
        const calculator = document.querySelector('#price-calculator');
        if (!calculator) return;

        const consultationPrice = 200;
        const installationBase = 400;
        
        const checkboxes = calculator.querySelectorAll('input[type="checkbox"]');
        const totalDisplay = calculator.querySelector('#estimated-total');
        
        function updateTotal() {
            let total = consultationPrice; // Always include consultation
            let needsInstallation = false;
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked && checkbox.value !== 'consultation') {
                    needsInstallation = true;
                }
            });
            
            if (needsInstallation) {
                total += installationBase;
            }
            
            if (totalDisplay) {
                totalDisplay.textContent = `$${total}+ (plus materials)`;
            }
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateTotal);
        });
        
        updateTotal(); // Initial calculation
    }
    
    initPriceCalculator();

    // 5. SAFETY TIP CAROUSEL
    // Rotates through safety tips to keep content engaging
    function initSafetyTips() {
        const tips = [
            "Tip from a Paramedic: Furniture tip-overs cause more injuries than parents realize. Secure tall furniture to walls.",
            "Did you know? Children can drown in just 2 inches of water. Always supervise around bathtubs and buckets.",
            "Safety Fact: Most child poisonings happen with common household items, not just cleaning supplies.",
            "Paramedic Insight: Window blind cords are a hidden strangulation risk - cut loops and secure cords.",
            "Emergency Stat: Burns from hot liquids send more children to ERs than house fires."
        ];
        
        const tipElement = document.querySelector('#rotating-tip');
        if (!tipElement) return;
        
        let currentTip = 0;
        
        function showNextTip() {
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = tips[currentTip];
                tipElement.style.opacity = '1';
                currentTip = (currentTip + 1) % tips.length;
            }, 300);
        }
        
        // Show first tip
        showNextTip();
        
        // Rotate every 5 seconds
        setInterval(showNextTip, 5000);
    }
    
    initSafetyTips();

    // 6. SCROLL ANIMATIONS
    // Makes elements fade in as user scrolls down
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements with fade-in class
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    initScrollAnimations();

    // 7. EMERGENCY CONTACT HIGHLIGHT
    // Makes contact info stand out when clicked
    const emergencyContact = document.querySelector('.emergency-contact');
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.emergency-contact')) {
            const originalBg = e.target.style.backgroundColor;
            const originalColor = e.target.style.color;
            e.target.style.backgroundColor = 'var(--vs-accent-blue)';
            e.target.style.color = 'var(--vs-neutral-bg-white)';
            e.target.style.transform = 'scale(1.05)';
            setTimeout(() => {
                e.target.style.backgroundColor = originalBg;
                e.target.style.color = originalColor;
                e.target.style.transform = '';
            }, 1000);
        }
    });
    // 8. SERVICE AREA CHECK
    // Simple zip code checker for service area
    function initServiceAreaCheck() {
        const zipInput = document.querySelector('#zip-check');
        const checkButton = document.querySelector('#check-service-area');
        const resultDiv = document.querySelector('#service-area-result');
        
        if (!zipInput || !checkButton || !resultDiv) return;
        
        // OKC metro zip codes (partial list - you'd expand this)
        const serviceZips = ['73101', '73102', '73103', '73104', '73105', '73106', '73107', '73108', '73109', '73110', '73111', '73112', '73113', '73114', '73115', '73116', '73117', '73118', '73119', '73120', '73121', '73122', '73123', '73124', '73125', '73126', '73127', '73128', '73129', '73130', '73131', '73132', '73134', '73135', '73136', '73137', '73139', '73140', '73141', '73142', '73143', '73144', '73145', '73146', '73147', '73148', '73149', '73150', '73151', '73152', '73153', '73154', '73155', '73156', '73157', '73159', '73160', '73162', '73163', '73164', '73165', '73169', '73170', '73172', '73173', '73179', '73184', '73189', '73190', '73194', '73195', '73196'];
        
        checkButton.addEventListener('click', function() {
            const zip = zipInput.value.trim();
            
            if (serviceZips.includes(zip)) {
                resultDiv.innerHTML = `<span style="color: var(--vs-utility-success);">✓ Yes! We serve your area. Call today to schedule.</span>`;
            } else if (zip.length === 5) {
                resultDiv.innerHTML = `<span style="color: var(--vs-neutral-subtle);">We may serve your area. Please call to confirm: 405-999-8448</span>`;
            } else {
                resultDiv.innerHTML = `<span style="color: var(--vs-utility-error);">Please enter a valid 5-digit zip code.</span>`;
            }
        });
        
        // Enter key support
        zipInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkButton.click();
            }
        });
    }
    
    initServiceAreaCheck();

    // 9. NOTIFICATION SYSTEM
    // Shows success/error messages to users
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove the element after the transition ends
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
            },  4000);
    }
    
    // Make showNotification globally available
    window.showNotification = showNotification;

    // 10. LOAD PERFORMANCE TRACKING
    // Simple performance monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (loadTime > 3000) {
            console.log('Page load time:', loadTime + 'ms - Consider optimizing images or scripts');
        }
    });

    console.log('Vital Signs Safety OKC - Website loaded successfully');
});
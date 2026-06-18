PI = window.PI || {
    D: document,
    W: window,
};

/*
* Common init global to entire website:
* */
PI.Utils = {
    init: function () {
        PI.Utils.animateOnScroll();
        PI.Utils.handleVideoPlayback();
        PI.Utils.initStickyCTA();
        PI.Utils.initFAQ();
    },

     // sticky navigation
    animateOnScroll: function () {
        // 1. Sabhi elements jinhe animate karna hai, unhe select karein
    // Aap apne HTML mein in elements par class 'animate-hidden' add kar dein
    const elements = document.querySelectorAll('.animate-hidden');

    // 2. Observer setup
    const observerOptions = {
        threshold: 0.2 // Jab element 10% dikhne lagega, tab animate hoga
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Jab element viewport mein aaye
                entry.target.classList.add('animate-visible');
                // Ek baar animate hone ke baad observer hata dein (performance ke liye)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 3. Har element ko observer mein daalein
    elements.forEach(el => observer.observe(el));
    },

    handleVideoPlayback: function () {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(button => {
        button.addEventListener('click', function () {
            const wrapper = this.parentElement;
            
            // --- NEW: Testimonial ke parent <li> mein 'active' class add karein ---
            const parentLi = this.closest('li');
            if (parentLi) {
                parentLi.classList.add('active');
            }
            // -------------------------------------------------------------------

            const videoId = this.getAttribute('data-url');
            const isShort = this.getAttribute('data-type') === 'short';

            // Minimalist player parameters
            const params = "autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3";
            const src = `https://www.youtube.com/embed/${videoId}?${params}&origin=${window.location.origin}`;

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', src);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            // Content replace
            wrapper.innerHTML = ''; 
            wrapper.appendChild(iframe);
        });
    });
},
    // Sticky CTA Logic
    initStickyCTA: function () {
        const ctaBanner = document.querySelector('.cta');
        // Apne hero CTA button ka class yahan dalein
        const heroCTA = document.querySelector('.book a'); 

        if (!ctaBanner || !heroCTA) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Jab hero CTA screen se bahar gaya, banner show karo
                    ctaBanner.classList.add('show-cta');
                } else {
                    // Jab hero CTA screen mein wapas aaya, banner hide karo
                    ctaBanner.classList.remove('show-cta');
                }
            });
        }, { threshold: 0 }); // Jaise hi thoda sa bhi scroll hua

        observer.observe(heroCTA);
    },
   initFAQ: function () {
    const faqButtons = document.querySelectorAll('.faq-list button');

    faqButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const parentLi = button.closest('li');
            const content = parentLi.querySelector('.faq-content');
            const arrow = button.querySelector('.i_arrow_down');
            
            // Check karein ki kya ye pehle se open hai
            const isOpen = content.classList.contains('is-open');

            // Sabhi ko band karein (Accordion logic)
            document.querySelectorAll('.faq-content').forEach(el => {
                el.classList.remove('is-open');
                const arrowEl = el.closest('li').querySelector('.i_arrow_down');
                if (arrowEl) arrowEl.classList.remove('rotate-arrow');
            });

            // Toggle logic
            if (!isOpen) {
                content.classList.add('is-open');
                if (arrow) arrow.classList.add('rotate-arrow');
            }
        });
    });
}
};

/*
* PI Generic Ajax object:
* Methods to submit data.
* */
PI.HTTP = {
    /**
     * Make an HTTP request.
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
     * @param {string} url - The URL to request.
     * @param {object} data - The data to send in the request body.
     * @param {object} headers - The headers that can be sent in request
     * @param {function} callback - Callback function for handling the response.
     */
    request: async function (method, url, data, headers, callback) {
        const token = this.getExpiry();
        if (token) {
            await this.validateExpiry();
        }

        $.ajax({
            url: url,
            type: method,
            data: JSON.stringify(data),
            // data: data,
            headers: headers,
            xhrFields: {
                withCredentials: true
            },
            contentType: method === 'GET' ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json',

            success: function (response) {
                callback(null, response);
            },
            error: function (xhr, _) {
                callback(xhr, null);
            }
        });
    },

    // Helper methods for common HTTP methods

    get: function (url, data, callback) {
        if (typeof (data) === 'function') {
            callback = data;
            data = {};
        }
        return this.request('GET', url, data, {}, callback);
    },

    post: function (url, data, callback) {
        if (typeof (data) === 'function') {
            callback = data;
            data = {};
        }
        return this.request('POST', url, data, {}, callback);
    },

};

/*
* Entry point
* */
document.addEventListener('DOMContentLoaded', function () {
    PI.Utils.init();
});
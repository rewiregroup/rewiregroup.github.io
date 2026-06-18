PI = window.PI || {
    D: document,
    W: window,
};

/*
* Common init global to entire website:
* */
PI.Utils = {
    init: function () {
        PI.Utils.stickyNavigation();
        PI.Utils.accordion();
        PI.Utils.slideAnimation();
        PI.Utils.activeNavOnScroll();
        PI.Utils.smoothScrollNav();
        PI.Utils.mobileMenu();
        // alert('hello');
    },

     // sticky navigation
    stickyNavigation: function () {
        const header = PI.D.querySelector('.header');
        const nav = PI.D.querySelector('.navigation');
        const content = PI.D.querySelector('.content');
        const aside = PI.D.querySelector('.rightPanel');
        const cta = PI.D.querySelector('.cta');

    if (!header || !nav) return;

    // const headerBottom = header.offsetTop + header.offsetHeight;
    const navOffsetTop = nav.offsetTop;
    const asideOffsetTop = nav.offsetTop;

    function toggleNav() {

        if (PI.W.scrollY + header.offsetHeight >= asideOffsetTop + 205) {
            aside.classList.add('fixed');
        } else {
            aside.classList.remove('fixed');
        }
        

        if (PI.W.scrollY + header.offsetHeight >= navOffsetTop + 70) {
            // Check if screen width is less than 1120px then return
            if (PI.W.innerWidth > 1120) {
                content.classList.add('fixed');
            }
            cta.classList.add('active');
        } else {
            if (PI.W.innerWidth > 1120) {
                content.classList.remove('fixed');
            }
            cta.classList.remove('active');
        }

    }

    PI.W.addEventListener('scroll', toggleNav);
    PI.W.addEventListener('resize', toggleNav);

    toggleNav();
    },

    // Accordion
    accordion: function () {
    const accordions = document.querySelectorAll('.accord li');

    if (!accordions.length) return;

    accordions.forEach(li => {
        const btn = li.querySelector('button');

        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = li.classList.contains('active');

            // Close all (single open behavior)
            accordions.forEach(item => item.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                li.classList.add('active');
            }
        });
    });
    },
    // Slide up
    slideAnimation: function () {
    const elements = PI.D.querySelectorAll('.slide');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // animate only once
            }
        });
    }, {
        threshold: 0.12 // trigger when 12% visible
    });
    elements.forEach(el => observer.observe(el));
    },

    // Active navigation on scroll
    activeNavOnScroll: function () {

        const sections = PI.D.querySelectorAll('.tiles > div');
        const navItems = PI.D.querySelectorAll('#nav-menu li');

        if (!sections.length || !navItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const currentClass = entry.target.classList[0]; 
                    // e.g. "instructor", "solution", etc.

                    // remove active from all
                    navItems.forEach(li => li.classList.remove('act'));

                    // find matching nav item
                    const activeItem = PI.D.querySelector(`#nav-menu li[data-class="${currentClass}"]`);

                    if (activeItem) {
                        activeItem.classList.add('act');
                    }
                }

            });
        }, {
            threshold: 0.5 // trigger when section is 50% visible
        });

        sections.forEach(section => observer.observe(section));
    },

    // Smooth scroll for navigation
    smoothScrollNav: function () {
        const links = PI.D.querySelectorAll('#nav-menu a');
        const navMenu = PI.D.querySelector('.course-nav');
        if (!links.length) return;

        const header = PI.D.querySelector('.header');
        const nav = PI.D.querySelector('.navigation');

        const offset = (header?.offsetHeight || 0) + (nav?.offsetHeight || 0);

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                navMenu.classList.remove('active');

                const targetId = this.getAttribute('href');
                const targetEl = PI.D.querySelector(targetId);

                if (!targetEl) return;

                const elementPosition = targetEl.getBoundingClientRect().top + PI.W.scrollY;
                const offsetPosition = elementPosition - offset + 10; // small spacing

                PI.W.scrollTo({
                    top: offsetPosition - 75,
                    behavior: 'smooth'
                });

            });
        });
    },

    // Mobile menu toggle
    mobileMenu: function () {
        const navMenu = PI.D.querySelector('.course-nav');
        const openBtn = PI.D.querySelector('.mob_menu.open');
        const closeBtn = PI.D.querySelector('.mob_menu.close');

        if (!navMenu || !openBtn || !closeBtn) return;

        openBtn.addEventListener('click', function () {
            navMenu.classList.add('active');
        });

        closeBtn.addEventListener('click', function () {
            navMenu.classList.remove('active');
        });
    },
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
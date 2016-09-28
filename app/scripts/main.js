(function (document) {
    function domReady(cb) {
        document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
    }

    domReady(function () {
        const navButtons = document.querySelectorAll('.nav__links a[href*="#"]');
        [].forEach.call(navButtons, function (el) {
            el.addEventListener('click', function () {
                if (document.querySelector('.nav__links .nav-active')) {
                    document.querySelector('.nav__links .nav-active').classList.remove('nav-active');
                    el.classList.add('nav-active');
                } else {
                    el.classList.add('nav-active');
                }
            });
        });

        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop > 0) {
                document.querySelector('.nav').classList.add('body-is-scrolled');
            } else {
                document.querySelector('.nav').classList.remove('body-is-scrolled');
            }
        });

        const mobileNavToggle = document.querySelectorAll('label[for=backdrop]');

        [].forEach.call(mobileNavToggle, function (el) {
            el.addEventListener('click', function () {
                document.querySelector('body').classList.toggle('drawer-is-opened');
            });
        });
    });
})(document);

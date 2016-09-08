(function (document) {
    function domReady(cb) {
        document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
    }

    domReady(function () {
        const navButtons = document.querySelectorAll('.nav__links a[href*="#"]');
        [].forEach.call(navButtons, function (el) {
            el.addEventListener('click', function () {
                document.querySelector('.nav__links .active').classList.remove('active');
                el.parentNode.classList.add('active');
            });
        });
    });
})(document);

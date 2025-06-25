/*!
 * Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
 * Copyright 2013-2025 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
 */

// ---------------------------------------------------------------------------
//  Main site-wide scripts
// ---------------------------------------------------------------------------

window.addEventListener('DOMContentLoaded', event => {

    // ---------------------------------
    // Navbar shrink on scroll
    // ---------------------------------
    const navbarShrink = () => {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    navbarShrink();                        // Shrink immediately
    document.addEventListener('scroll', navbarShrink);

    // ---------------------------------
    // Activate Bootstrap scrollspy
    // ---------------------------------
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // ---------------------------------
    // Collapse the responsive menu when a link is clicked
    // ---------------------------------
    const navbarToggler   = document.body.querySelector('.navbar-toggler');
    const responsiveLinks = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));

    responsiveLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // ------------------------------------------------------------------
    //  ML model prediction form logic
    // ------------------------------------------------------------------
    //
    //  HTML requirements:
    //    <form id="predict-form"> … </form>
    //    <p   id="prediction-output"></p>
    //
    //  Each <input>/<select> inside the form must have a name="feature_name"
    //  matching the feature columns used to train the model.
    // ------------------------------------------------------------------

    const form   = document.getElementById('predict-form');
    const output = document.getElementById('prediction-output');

    if (form && output) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect form data → plain object
            const formData = new FormData(form);
            const payload  = Object.fromEntries(formData.entries());

            try {
                const res  = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Prediction failed.');

                // Success: show the model’s prediction
                output.textContent = `Prediction: ${data.prediction}`;
                output.classList.remove('text-danger');
                output.classList.add   ('fw-bold');

            } catch (err) {
                // Failure: show error message
                output.textContent = err.message;
                output.classList.add('text-danger');
            }
        });
    }

});

/**
 * Optimisations de performance
 * - Cache des images
 * - Debouncing des événements
 * - Lazy loading
 */

// Cache global des images déjà chargées
const imageCache = new Map();

/**
 * Précharge une image et la stocke en cache
 * @param {string} src - URL de l'image
 * @returns {Promise<Image>}
 */
export function preloadImage(src) {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src));
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = encodeURI(src);
    });
}

/**
 * Crée une fonction debounced
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en ms
 * @returns {Function}
 */
export function debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Crée une fonction throttled
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Délai en ms
 * @returns {Function}
 */
export function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Observe les éléments visibles et ajoute une classe
 */
export function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('[data-observe]').forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * Optimisation: requête réduite au DOM
 */
export const queryCache = new Map();

export function cachedQuery(selector) {
    if (!queryCache.has(selector)) {
        queryCache.set(selector, document.querySelector(selector));
    }
    return queryCache.get(selector);
}

export function cachedQueryAll(selector) {
    if (!queryCache.has(selector)) {
        queryCache.set(selector, document.querySelectorAll(selector));
    }
    return queryCache.get(selector);
}

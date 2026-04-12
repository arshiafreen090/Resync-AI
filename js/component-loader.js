/**
 * Simple component loader for vanilla HTML projects.
 * Usage: <div data-component="navbar"></div>
 */
async function loadComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    const promises = [];

    for (const el of componentElements) {
        const componentName = el.getAttribute('data-component');
        const componentPath = `components/${componentName}.html`;

        promises.push(
            fetch(componentPath)
                .then(response => {
                    if (response.ok) return response.text();
                    throw new Error(`Failed to load component: ${componentName}`);
                })
                .then(html => {
                    el.innerHTML = html;
                    el.removeAttribute('data-component');
                })
                .catch(err => console.error(err))
        );
    }

    // Wait for all components to be loaded before initializing main logic
    await Promise.all(promises);

    if (typeof window.initializeMainLogic === 'function') {
        window.initializeMainLogic();
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadComponents);

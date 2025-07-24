// Scroll to Top Button
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'fixed bottom-4 right-4 bg-[#003F5C] text-white p-3 rounded-full shadow-lg opacity-0 transition-opacity duration-300';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.style.opacity = window.scrollY > 300 ? '1' : '0';
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};
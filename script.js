document.addEventListener('DOMContentLoaded', () => {

    // ----- Función para crear el efecto ripple -----
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        // Coordenadas relativas al botón
        const left = (event.clientX || (event.touches && event.touches[0].clientX)) - rect.left;
        const top = (event.clientY || (event.touches && event.touches[0].clientY)) - rect.top;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${left - radius}px`;
        circle.style.top = `${top - radius}px`;
        circle.classList.add('ripple');

        // Eliminar ripple anterior si existe para evitar acumulación
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        button.appendChild(circle);

        // Eliminar después de la animación
        setTimeout(() => circle.remove(), 600);
    }

    // ----- Función para mostrar toast -----
    let toastTimeout;
    function showToast(message) {
        // Eliminar toast anterior si existe
        const oldToast = document.querySelector('.toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Forzar reflow para que se aplique la transición
        void toast.offsetWidth;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // ----- Configurar todos los botones -----
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        // Efecto ripple al presionar (touch o mouse)
        btn.addEventListener('pointerdown', (e) => {
            createRipple(e);
            // Vibración corta (solo si el dispositivo lo soporta)
            if (navigator.vibrate) navigator.vibrate(10);
        });

        // Prevenir comportamiento por defecto y manejar navegación / acciones
        btn.addEventListener('click', (e) => {
            const isNav = btn.hasAttribute('data-nav'); // Botón que navega
            const isMerceria = btn.id === 'btn-merceria';

            if (isNav) {
                // Para el botón de Fresas: navegar después de un pequeño delay
                e.preventDefault();
                const url = btn.getAttribute('href');
                showToast('Abriendo Fresas con chantilly...');
                setTimeout(() => {
                    window.location.href = url;
                }, 180);
            } else if (isMerceria) {
                // Para Merceria: solo toast
                e.preventDefault();
                showToast('Has seleccionado: Merceria');
            }
        });
    });

    // ----- Orden aleatorio de los botones -----
    const container = document.querySelector('.container');
    const btnList = Array.from(container.querySelectorAll('.btn'));

    // Algoritmo Fisher-Yates para mezclar
    for (let i = btnList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [btnList[i], btnList[j]] = [btnList[j], btnList[i]];
    }

    // Reinsertar en el nuevo orden (la .card se queda arriba)
    btnList.forEach(btn => container.appendChild(btn));

    // Fallback para navegadores que no soportan pointerdown (opcional)
    // ya que pointerdown cubre mouse y touch en la mayoría de navegadores modernos.
});

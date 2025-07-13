document.addEventListener('DOMContentLoaded', function() {
    const createBtn = document.querySelector('.create-btn');
    const createModal = document.getElementById('createModal');
    const modalContent = document.querySelector('.modal-create-content');
    const organizeBtn = document.querySelector('.modal-create-btn:last-child');

    if (createBtn && createModal) {
        createBtn.addEventListener('click', function() {
            createModal.classList.add('show');
        });

        // Cerrar al hacer clic fuera del contenido
        createModal.addEventListener('mousedown', function(e) {
            if (!modalContent.contains(e.target)) {
                createModal.classList.remove('show');
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                createModal.classList.remove('show');
            }
        });
    }

    // Redirección al botón Organize
    if (organizeBtn) {
        organizeBtn.addEventListener('click', function() {
            window.location.href = './organize.html';
        });
    }
}); 
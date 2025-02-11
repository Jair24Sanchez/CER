window.languagesList = [
    "Aari (Omotic)",
    "Abanyom (Bantu)",
    "Abaza (Northwest Caucasian)",
    "Abkhaz or Abkhazian (Northwest Caucasian)",
    "Abujmaria (Dravidian)",
    "Acehnese (Malayo-Polynesian)",
    // ... [Lista completa de idiomas insertada aquí] ...
    "Záparo (Saparoan)",
    "Zapotec (Oto-Manguean)",
    "Zazaki (Iranian)",
    "Zulu (Niger–Congo) (Bantu)",
    "Zuñi or Zuni (isolated)",
    "Zway or Zay (Semitic)"
];

document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language');
    
    if (languageSelect) {
        const languages = [
            "Aari (Omotic)",
            "Abanyom (Bantu)",
            "Abaza (Northwest Caucasian)",
            "Abkhaz or Abkhazian (Northwest Caucasian)",
            "Abujmaria (Dravidian)",
            "Acehnese (Malayo-Polynesian)",
            // ... [Lista completa de idiomas insertada aquí] ...
            "Záparo (Saparoan)",
            "Zapotec (Oto-Manguean)",
            "Zazaki (Iranian)",
            "Zulu (Niger–Congo) (Bantu)",
            "Zuñi or Zuni (isolated)",
            "Zway or Zay (Semitic)"
        ];

        // Agregar las opciones al select
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.split(' (')[0].toLowerCase().replace(/ /g, '-');
            option.textContent = lang;
            languageSelect.appendChild(option);
        });

        // Agregar funcionalidad de búsqueda rápida
        languageSelect.addEventListener('keyup', function(e) {
            const text = e.target.value.toLowerCase();
            const options = languageSelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const optionText = option.text.toLowerCase();
                if (optionText.startsWith(text)) {
                    option.selected = true;
                    break;
                }
            }
        });
    }
}); 
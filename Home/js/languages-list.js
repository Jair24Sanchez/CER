// Lista de idiomas con sus códigos ISO
window.languagesList = [
    { code: 'af', name: 'Afrikáans' },
    { code: 'sq', name: 'Albanés' },
    { code: 'de', name: 'Alemán' },
    { code: 'am', name: 'Amárico' },
    { code: 'ar', name: 'Árabe' },
    { code: 'hy', name: 'Armenio' },
    { code: 'az', name: 'Azerí' },
    { code: 'eu', name: 'Euskera' },
    { code: 'be', name: 'Bielorruso' },
    { code: 'bn', name: 'Bengalí' },
    { code: 'bs', name: 'Bosnio' },
    { code: 'bg', name: 'Búlgaro' },
    { code: 'ca', name: 'Catalán' },
    { code: 'ceb', name: 'Cebuano' },
    { code: 'zh', name: 'Chino' },
    { code: 'hr', name: 'Croata' },
    { code: 'cs', name: 'Checo' },
    { code: 'da', name: 'Danés' },
    { code: 'nl', name: 'Neerlandés' },
    { code: 'en', name: 'Inglés' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'et', name: 'Estonio' },
    { code: 'tl', name: 'Tagalo' },
    { code: 'fi', name: 'Finés' },
    { code: 'fr', name: 'Francés' },
    { code: 'fy', name: 'Frisón' },
    { code: 'gl', name: 'Gallego' },
    { code: 'ka', name: 'Georgiano' },
    { code: 'el', name: 'Griego' },
    { code: 'gu', name: 'Guyaratí' },
    { code: 'ht', name: 'Criollo haitiano' },
    { code: 'ha', name: 'Hausa' },
    { code: 'haw', name: 'Hawaiano' },
    { code: 'he', name: 'Hebreo' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Húngaro' },
    { code: 'is', name: 'Islandés' },
    { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesio' },
    { code: 'ga', name: 'Irlandés' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: 'Japonés' },
    { code: 'jv', name: 'Javanés' },
    { code: 'kn', name: 'Canarés' },
    { code: 'kk', name: 'Kazajo' },
    { code: 'km', name: 'Jemer' },
    { code: 'ko', name: 'Coreano' },
    { code: 'ku', name: 'Kurdo' },
    { code: 'ky', name: 'Kirguís' },
    { code: 'lo', name: 'Lao' },
    { code: 'la', name: 'Latín' },
    { code: 'lv', name: 'Letón' },
    { code: 'lt', name: 'Lituano' },
    { code: 'lb', name: 'Luxemburgués' },
    { code: 'mk', name: 'Macedonio' },
    { code: 'mg', name: 'Malgache' },
    { code: 'ms', name: 'Malayo' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mt', name: 'Maltés' },
    { code: 'mi', name: 'Maorí' },
    { code: 'mr', name: 'Maratí' },
    { code: 'mn', name: 'Mongol' },
    { code: 'my', name: 'Birmano' },
    { code: 'ne', name: 'Nepalí' },
    { code: 'no', name: 'Noruego' },
    { code: 'ny', name: 'Chichewa' },
    { code: 'or', name: 'Oriya' },
    { code: 'ps', name: 'Pastún' },
    { code: 'fa', name: 'Persa' },
    { code: 'pl', name: 'Polaco' },
    { code: 'pt', name: 'Portugués' },
    { code: 'pa', name: 'Panyabí' },
    { code: 'ro', name: 'Rumano' },
    { code: 'ru', name: 'Ruso' },
    { code: 'sm', name: 'Samoano' },
    { code: 'gd', name: 'Gaélico escocés' },
    { code: 'sr', name: 'Serbio' },
    { code: 'st', name: 'Sesoto' },
    { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'si', name: 'Cingalés' },
    { code: 'sk', name: 'Eslovaco' },
    { code: 'sl', name: 'Esloveno' },
    { code: 'so', name: 'Somalí' },
    { code: 'es', name: 'Español' },
    { code: 'su', name: 'Sundanés' },
    { code: 'sw', name: 'Suajili' },
    { code: 'sv', name: 'Sueco' },
    { code: 'tg', name: 'Tayiko' },
    { code: 'ta', name: 'Tamil' },
    { code: 'tt', name: 'Tártaro' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Tailandés' },
    { code: 'tr', name: 'Turco' },
    { code: 'tk', name: 'Turcomano' },
    { code: 'uk', name: 'Ucraniano' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ug', name: 'Uigur' },
    { code: 'uz', name: 'Uzbeko' },
    { code: 'vi', name: 'Vietnamita' },
    { code: 'cy', name: 'Galés' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yidis' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulú' }
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
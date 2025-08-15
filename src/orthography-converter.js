// Haida orthography converter
// Based on https://github.com/morrisalp/haida-orthog

// Lachler to Classic conversion
function lachlerToClassic(text) {
    if (!text) return text;
    
    text = text.toLowerCase();
    
    // Voiced to unvoiced consonants
    text = text.replace(/b/g, 'p');
    text = text.replace(/dl/g, 'tl');
    text = text.replace(/j/g, 'ts');
    text = text.replace(/gw/g, 'kw');
    
    // Special handling for 'd' and 'g' - avoid certain contexts
    text = text.replace(/d/g, 't');
    // Don't devoice 'g' after 'n'
    text = text.replace(/(?<!n)g/g, 'k');
    
    return text;
}

// Classic to Lachler conversion
function classicToLachler(text) {
    if (!text) return text;
    
    text = text.toLowerCase();
    
    // Unvoiced to voiced consonants
    text = text.replace(/p/g, 'b');
    text = text.replace(/tl/g, 'dl');
    text = text.replace(/ts/g, 'j');
    text = text.replace(/kw/g, 'gw');
    text = text.replace(/t/g, 'd');
    text = text.replace(/k/g, 'g');
    
    return text;
}

// Lachler to Enrico conversion
function lachlerToEnrico(text) {
    if (!text) return text;
    
    text = text.toLowerCase();
    
    // Character mappings
    const mappings = [
        ['ḵ', 'q'],
        ['g̱', 'r'],
        ['x̂', 'X'],
        ['ĝ', 'G'],
        ['x̱', 'x'],
        ['x', 'c'],
        ["'", '7']
    ];
    
    for (const [from, to] of mappings) {
        text = text.replace(new RegExp(from, 'g'), to);
    }
    
    // Remove accent marks
    text = text.replace(/[áàâäã]/g, 'a');
    text = text.replace(/[éèêë]/g, 'e');
    text = text.replace(/[íìîï]/g, 'i');
    text = text.replace(/[óòôöõ]/g, 'o');
    text = text.replace(/[úùûü]/g, 'u');
    
    return text;
}

// Enrico to Lachler conversion
function enricoToLachler(text) {
    if (!text) return text;
    
    text = text.toLowerCase();
    
    // Character mappings (reverse of Lachler to Enrico)
    const mappings = [
        ['q', 'ḵ'],
        ['r', 'g̱'],
        ['X', 'x̂'],
        ['G', 'ĝ'],
        ['c', 'x'],
        ['7', "'"]
    ];
    
    for (const [from, to] of mappings) {
        text = text.replace(new RegExp(from, 'g'), to);
    }
    
    // Remove dots and hyphens
    text = text.replace(/[.\-]/g, '');
    
    return text;
}

// Main conversion function
function convertOrthography(text, fromOrthography, toOrthography) {
    if (!text || fromOrthography === toOrthography) return text;
    
    // First convert to Lachler as intermediate
    let lachlerText = text;
    
    if (fromOrthography === 'classic') {
        lachlerText = classicToLachler(text);
    } else if (fromOrthography === 'enrico') {
        lachlerText = enricoToLachler(text);
    }
    
    // Then convert from Lachler to target
    if (toOrthography === 'lachler') {
        return lachlerText;
    } else if (toOrthography === 'classic') {
        return lachlerToClassic(lachlerText);
    } else if (toOrthography === 'enrico') {
        return lachlerToEnrico(lachlerText);
    }
    
    return text;
}

// Convert dictionary entries to different orthography
function convertDictionaryEntries(entries, toOrthography) {
    return entries.map(entry => ({
        ...entry,
        word: convertOrthography(entry.word, 'lachler', toOrthography),
        classifier: entry.classifier ? convertOrthography(entry.classifier, 'lachler', toOrthography) : entry.classifier,
        examples: entry.examples ? entry.examples.map(example => ({
            ...example,
            sentence: convertOrthography(example.sentence, 'lachler', toOrthography)
        })) : [],
        inflections: entry.inflections ? entry.inflections.map(inflection => 
            convertOrthography(inflection, 'lachler', toOrthography)
        ) : []
    }));
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        lachlerToClassic,
        classicToLachler,
        lachlerToEnrico,
        enricoToLachler,
        convertOrthography,
        convertDictionaryEntries
    };
}
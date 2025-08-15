// Haida Lachler orthography to IPA converter
// Exact implementation from https://github.com/morrisalp/haida-orthog

function lachlerToIPA(text) {
    if (!text) return text;
    
    text = text.toLowerCase();

    // Long vowel replacements and special characters (first pass)
    const equivs = ["aa", "ii", "uu", "ee", "oo", "áa", "íi", "úu", "ée", "óo", "x̱", "g̱", "x̂", "hl", "ng"];
    const equivs_ = ["aː", "iː", "uː", "eː", "oː", "áː", "íː", "úː", "éː", "óː", "ʜ", "ʡ", "χ", "ɬ", "ŋ"];
    
    for (let i = 0; i < equivs.length; i++) {
        text = text.replace(new RegExp(equivs[i], 'g'), equivs_[i]);
    }

    // Aspirated consonants
    const asp = ["p", "tl", "ch", "t", "ḵ", "k"];
    const asp_ipa = ["pʰ", "tɬʰ", "tʃʰ", "tʰ", "qʰ", "kʰ"];
    
    for (let i = 0; i < asp.length; i++) {
        text = text.replace(new RegExp(asp[i], 'g'), asp_ipa[i]);
        // Fix ejectives - remove aspiration before ejective mark
        text = text.replace(new RegExp(asp_ipa[i] + "'", 'g'), asp_ipa[i].slice(0, -1) + "'");
    }

    // Fix extra aspiration issues
    const to_fix = ["tʰʃʰ", "tʰɬʰ", "tʰs'", "tʰɬ'"];
    const fixed = ["tʃʰ", "tɬʰ", "ts'", "tɬ'"];
    
    for (let i = 0; i < to_fix.length; i++) {
        text = text.replace(new RegExp(to_fix[i], 'g'), fixed[i]);
    }
    
    // Unaspirated/devoiced consonants
    const unasp = ["d", "b", "dl", "j", "ĝ", "g"];
    const unasp_ipa = ["d̥", "b̥", "d̥ɮ̊", "d̥ʒ̊", "ɢ̥", "ɡ̊"];
    
    for (let i = 0; i < unasp.length; i++) {
        text = text.replace(new RegExp(unasp[i], 'g'), unasp_ipa[i]);
    }

    // Additional equivalences
    const equivs2 = ["y", "'w", "'j", "'l"];
    const equivs2_ = ["j", "wˀ", "jˀ", "lˀ"];
    
    for (let i = 0; i < equivs2.length; i++) {
        text = text.replace(new RegExp(equivs2[i], 'g'), equivs2_[i]);
    }

    // Glottal stop insertion
    // Between vowels with ejective
    text = text.replace(/([aeiouáéíóúː])'([aeiouáéíóú])/g, '$1ʔ$2');
    // Word-initial vowels
    text = text.replace(/^([aeiouáéíóú])/g, 'ʔ$1');
    // After spaces
    text = text.replace(/ ([aeiouáéíóú])/g, ' ʔ$1');

    // Ejective symbol replacement
    text = text.replace(/'/g, 'ʼ');

    // Remove separators
    text = text.replace(/-/g, '');

    // Final step: devoiced to unvoiced unaspirated consonants
    const final_equivs = ["b̥", "d̥ɮ̊", "d̥ʒ̊", "d̥", "ɢ̥", "ɡ̊"];
    const final_equivs_ = ["p", "tɬ", "tʃ", "t", "q", "k"];
    
    for (let i = 0; i < final_equivs.length; i++) {
        text = text.replace(new RegExp(final_equivs[i], 'g'), final_equivs_[i]);
    }

    return text;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lachlerToIPA };
}
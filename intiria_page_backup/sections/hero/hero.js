// hero specific logic
// hero specific logic
async function initDynamicTypewriter() {
    const title = document.querySelector('.hero-title');
    if (!title || title.classList.contains('anim-initialized')) return;
    
    title.classList.add('anim-initialized');
    
    // Dynamically parse phrases from HTML structure!
    const phraseElements = title.querySelectorAll('.typewriter-phrase');
    let phrasesData = [];
    
    if (phraseElements.length > 0) {
        phraseElements.forEach(phraseEl => {
            let phraseParts = [];
            phraseEl.childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    let text = node.textContent;
                    if (text.trim() === '') return; 
                    
                    // Collapse newline indents into a single space
                    text = text.replace(/[\r\n]+\s*/g, ' ');
                    
                    // Trim start if it's the very first node in the sequence
                    if (phraseParts.length === 0) text = text.trimStart();
                    
                    phraseParts.push({ text: text, isSpan: false });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    phraseParts.push({ text: node.textContent, isSpan: true });
                }
            });
            if(phraseParts.length > 0) phrasesData.push(phraseParts);
        });
    } else {
        // Fallback
        phrasesData = [
            [ {text: "Spaces Designed with "}, {text: "Presence, ", isSpan: true}, {text: "Calm & Impact."} ]
        ];
    }
    
    title.innerHTML = '';
    title.style.visibility = 'visible';
    
    // Create text container and cursor
    const textContainer = document.createElement('span');
    textContainer.className = 'typewriter-text';
    title.appendChild(textContainer);

    await new Promise(r => setTimeout(r, 400)); // slight initial pause
    
    let phraseIndex = 0;

    // Infinite Loop for Dynamic Text Effect
    while (true) {
        const currentPhrase = phrasesData[phraseIndex];
        textContainer.innerHTML = '';
        const nodes = [];
        
        // Prepare nodes for typing
        for (const segment of currentPhrase) {
            let node;
            if (segment.isSpan) {
                node = document.createElement('span');
                node.className = 'text-red'; // Assign red accent color
            } else {
                node = document.createTextNode('');
            }
            textContainer.appendChild(node);
            nodes.push({ el: node, text: segment.text, isSpan: segment.isSpan });
        }

        // Typing Phase
        for (const nodeObj of nodes) {
            for (let i = 0; i < nodeObj.text.length; i++) {
                if (nodeObj.isSpan) {
                    nodeObj.el.textContent += nodeObj.text[i];
                } else {
                    nodeObj.el.textContent += nodeObj.text[i];
                }
                await new Promise(r => setTimeout(r, 60 + Math.random() * 40));
            }
        }

        // Pause after fully typing
        await new Promise(r => setTimeout(r, 2500));

        // Backspacing Phase (Deleting)
        for (let j = nodes.length - 1; j >= 0; j--) {
            const nodeObj = nodes[j];
            while (nodeObj.el.textContent.length > 0) {
                nodeObj.el.textContent = nodeObj.el.textContent.slice(0, -1);
                await new Promise(r => setTimeout(r, 25 + Math.random() * 15)); // Deleting is faster than typing
            }
            if (textContainer.contains(nodeObj.el)) {
                textContainer.removeChild(nodeObj.el);
            }
        }

        // Pause before typing next phrase
        await new Promise(r => setTimeout(r, 500));
        
        // Move to next phrase
        phraseIndex = (phraseIndex + 1) % phrasesData.length;
    }
}

// Support dynamic loading execution
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initDynamicTypewriter);
} else {
    setTimeout(initDynamicTypewriter, 100);
}


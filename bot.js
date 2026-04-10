(function() {
    const botId = 'cloud-smart-bot-v6';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:white; z-index:9999999; border-radius:15px; padding:20px; box-shadow:0 15px 40px rgba(0,0,0,0.3); border:3px solid #4f46e5; font-family:sans-serif; pointer-events:auto !important;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="margin:0; color:#4f46e5; font-size:18px;">🚀 Cloud Bot v6.0</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background:red; color:white; border:none; border-radius:50%; width:25px; height:25px; cursor:pointer;">X</button>
        </div>
        <textarea id="smartInput" placeholder="Excel ડેટા અહીં પેસ્ટ કરો..." style="width:100%; height:120px; border:2px solid #e2e8f0; border-radius:8px; padding:10px; font-size:13px;"></textarea>
        <button id="btnStartBot" style="width:100%; margin-top:15px; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 AUTO FILL & SAVE</button>
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:10px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    function setNativeValue(element, value) {
        const { set: valueSetter } = Object.getOwnPropertyDescriptor(element.__proto__, 'value') || {};
        const prototype = Object.getPrototypeOf(element);
        const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    document.getElementById('btnStartBot').onclick = async function() {
        const data = document.getElementById('smartInput').value.trim();
        if(!data) return alert("ડેટા પેસ્ટ કરો!");
        this.disabled = true; this.innerText = "⏳ Processing...";

        const rows = data.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // ૧. હાજરી પૂરવી (Auto-Select Present)
            let presentBtn = Array.from(document.querySelectorAll('label')).find(el => el.textContent.includes('Present')) || document.querySelector('input[value="Present"]');
            if(presentBtn) presentBtn.click();

            // ૨. વિદ્યાર્થી અને ઇનપુટ શોધવા
            let targetCell = Array.from(document.querySelectorAll('td, span, div, p')).find(el => el.children.length === 0 && el.textContent.toLowerCase().includes(key));

            if(targetCell) {
                let rowEl = targetCell.parentElement;
                let inputs = [];
                for(let i=0; i<25; i++) {
                    if(!rowEl) break;
                    inputs = Array.from(rowEl.querySelectorAll('input:not([disabled])')).filter(inp => inp.type !== 'radio');
                    if(inputs.length >= marks.length) break;
                    rowEl = rowEl.parentElement;
                }

                inputs.forEach((inp, idx) => {
                    if(marks[idx]) {
                        inp.focus();
                        setNativeValue(inp, marks[idx]);
                        inp.style.background = "#d1fae5";
                    }
                });

                // ૩. ઓટો-સેવ (Auto-Click Save Button)
                await new Promise(r => setTimeout(r, 500));
                let saveBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.toLowerCase().includes('save'));
                if(saveBtn) {
                    saveBtn.scrollIntoView();
                    saveBtn.click();
                    console.log("Auto-Saved Student:", key);
                }
                
                await new Promise(r => setTimeout(r, 1000)); // આગામી વિદ્યાર્થી માટે થોભો
            }
        }
        alert("🎉 તમામ એન્ટ્રી અને સેવિંગ પૂર્ણ થઈ ગયું છે!");
        this.disabled = false; this.innerText = "🎯 AUTO FILL & SAVE";
    };
})();

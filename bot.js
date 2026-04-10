(function() {
    const botId = 'smart-bot-v8-final';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    // ૧. ડેશબોર્ડ સ્ટાઇલ - Pointer Events Fix
    const style = document.createElement('style');
    style.innerHTML = `
        #${botId} { pointer-events: auto !important; z-index: 2147483647 !important; display: block !important; }
        #smartInput { background: #ffffff !important; color: #000 !important; cursor: text !important; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:#fff; border-radius:15px; padding:20px; box-shadow:0 15px 50px rgba(0,0,0,0.5); border:3px solid #4f46e5; font-family:sans-serif;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <b style="color:#4f46e5;">🚀 Gujarat Smart Bot V8</b>
            <button onclick="this.parentElement.parentElement.remove()" style="background:red; color:white; border:none; border-radius:6px; cursor:pointer; padding:2px 10px;">X</button>
        </div>
        <textarea id="smartInput" placeholder="અહીં એક્સલ ડેટા પેસ્ટ કરો..." style="width:100%; height:130px; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:13px; margin-bottom:10px;"></textarea>
        <div style="display:flex; gap:8px;">
            <button id="btnPaste" style="flex:1; background:#6366f1; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">📋 Paste</button>
            <button id="btnStart" style="flex:2; background:#10b981; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">🎯 START AUTO FILL</button>
        </div>
    `;
    document.body.appendChild(div);

    // ૨. પાવરફુલ પેસ્ટ લોજીક
    document.getElementById('btnPaste').onclick = async function() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('smartInput').value = text;
        } catch (err) {
            let manual = prompt("કૃપા કરીને અહીં ડેટા Paste કરો:");
            if(manual) document.getElementById('smartInput').value = manual;
        }
    };

    // ૩. React-Proof ફિલિંગ ફંક્શન
    function forceUpdateReact(input, val) {
        input.focus();
        let setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));
    }

    // ૪. રન લોજીક
    document.getElementById('btnStart').onclick = async function() {
        const val = document.getElementById('smartInput').value.trim();
        if(!val) return alert("ડેટા પેસ્ટ કરો!");
        this.disabled = true; this.innerText = "⏳ એન્ટ્રી ચાલુ છે...";

        const rows = val.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // હાજરી પૂરવી (Present Selection)
            let present = Array.from(document.querySelectorAll('label')).find(l => l.innerText.includes('Present')) || document.querySelector('input[value="Present"]');
            if(present) present.click();

            // વિદ્યાર્થી શોધવો
            let target = Array.from(document.querySelectorAll('td, span, div, p')).find(el => el.children.length === 0 && el.textContent.toLowerCase().includes(key));
            
            if(target) {
                let rowContainer = target.parentElement;
                let inputs = [];
                for(let i=0; i<25; i++) {
                    if(!rowContainer) break;
                    inputs = Array.from(rowContainer.querySelectorAll('input:not([disabled])')).filter(inp => inp.type !== 'radio');
                    if(inputs.length >= marks.length) break;
                    rowContainer = rowContainer.parentElement;
                }

                // માર્ક્સ ભરવા
                inputs.forEach((inp, idx) => {
                    if(marks[idx] !== undefined && marks[idx] !== "") {
                        forceUpdateReact(inp, marks[idx]);
                        inp.style.background = "#d1fae5";
                    }
                });

                // સેવિંગ માટે થોડો વિરામ (React ને ડેટા સમજવા માટે સમય આપવો)
                await new Promise(r => setTimeout(r, 800));
                
                // સેવ બટન ક્લિક કરવું
                let saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('save'));
                if(saveBtn) {
                    saveBtn.scrollIntoView({ block: 'center' });
                    saveBtn.click();
                }
                
                await new Promise(r => setTimeout(r, 1500)); // આગામી રો માટે વિરામ
            }
        }
        alert("🎉 બધી એન્ટ્રીઓ સફળતાપૂર્વક પૂર્ણ થઈ ગઈ છે!");
        this.disabled = false; this.innerText = "🎯 START AUTO FILL";
    };
})();

(function() {
    const botId = 'smart-bot-v7-final';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    // ૧. ડેશબોર્ડ સ્ટાઇલ - ક્લિક અને પેસ્ટ માટે પરમિશન ફિક્સ
    const style = document.createElement('style');
    style.innerHTML = `
        #${botId} { pointer-events: auto !important; user-select: text !important; display: block !important; }
        #smartInput { pointer-events: auto !important; cursor: text !important; background: #ffffff !important; color: #000000 !important; z-index: 10000001 !important; }
        #btnPaste { background: #6366f1 !important; color: white !important; cursor: pointer !important; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:#ffffff; z-index:2147483647; border-radius:15px; padding:20px; box-shadow:0 15px 50px rgba(0,0,0,0.5); border:3px solid #4f46e5; font-family:sans-serif;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <h3 style="margin:0; color:#4f46e5; font-size:18px;">🚀 Gujarat Smart Bot V7</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background:#ef4444; color:white; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">Close X</button>
        </div>
        
        <p style="font-size:12px; color:#475569; margin-bottom:8px; font-weight:bold;">Excel માંથી કોપી કરી નીચે ક્લિક કરો:</p>
        
        <textarea id="smartInput" placeholder="અહીં ક્લિક કરીને Paste કરો અથવા બટન દબાવો..." style="width:100%; height:140px; border:2px solid #cbd5e1; border-radius:8px; padding:10px; font-size:13px; margin-bottom:12px;"></textarea>
        
        <div style="display:flex; gap:10px;">
            <button id="btnPaste" style="flex:1; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:14px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">📋 PASTE DATA</button>
            <button id="btnRun" style="flex:2; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">🎯 START AUTO FILL</button>
        </div>
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:12px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    // ૨. પાવરફુલ પેસ્ટ બટન (Clipboard API)
    document.getElementById('btnPaste').onclick = async function() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('smartInput').value = text;
            this.innerText = "✅ Pasted!";
            setTimeout(() => { this.innerText = "📋 PASTE DATA"; }, 1500);
        } catch (err) {
            // જો બ્રાઉઝર પરમિશન ના આપે તો Fallback (પ્રોમ્પ્ટ બોક્સ)
            let manualText = prompt("અહીં Excel ડેટા Paste કરો (Ctrl + V):");
            if(manualText) document.getElementById('smartInput').value = manualText;
        }
    };

    // ૩. ફિલિંગ અને ઓટો-સેવ લોજીક
    document.getElementById('btnRun').onclick = async function() {
        const val = document.getElementById('smartInput').value.trim();
        if(!val) return alert("ડેટા પેસ્ટ કરો!");
        this.disabled = true; this.innerText = "⏳ Processing...";

        const rows = val.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // પ્રેઝન્ટ સિલેક્ટ કરવું
            let present = Array.from(document.querySelectorAll('label')).find(l => l.innerText.includes('Present')) || document.querySelector('input[value="Present"]');
            if(present) present.click();

            // નામ શોધીને માર્ક્સ ભરવા
            let target = Array.from(document.querySelectorAll('td, span, div, p')).find(el => el.children.length === 0 && el.textContent.toLowerCase().includes(key));
            if(target) {
                let rowEl = target.parentElement;
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
                        let setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(inp, marks[idx]);
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
                // સેવ બટન ક્લિક કરવું
                await new Promise(r => setTimeout(r, 600));
                let saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('save'));
                if(saveBtn) saveBtn.click();
                await new Promise(r => setTimeout(r, 1200));
            }
        }
        alert("🎉 એન્ટ્રી પૂર્ણ!");
        this.disabled = false; this.innerText = "🎯 START AUTO FILL";
    };
})();

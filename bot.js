(function() {
    // ૧. જૂની વિન્ડો હોય તો તેને દૂર કરો
    const botId = 'cloud-smart-bot-v3';
    let oldBot = document.getElementById(botId);
    if(oldBot) oldBot.remove();

    // ૨. સિક્યોરિટી બાયપાસ કરવા માટે CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #${botId} { pointer-events: all !important; user-select: text !important; display: block !important; }
        #${botId} textarea { cursor: text !important; background: #ffffff !important; color: #000000 !important; }
        #${botId} button { cursor: pointer !important; pointer-events: auto !important; }
    `;
    document.head.appendChild(style);

    // ૩. બોટનું UI (Dashboard)
    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:#ffffff; z-index:2147483647; border-radius:12px; padding:20px; box-shadow:0 20px 40px rgba(0,0,0,0.4); border:3px solid #4f46e5; font-family:sans-serif;';
    
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <h3 style="margin:0; color:#4f46e5; font-size:18px;">🚀 Universal Cloud Bot</h3>
            <button id="closeSmartBot" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Close ❌</button>
        </div>
        
        <p style="font-size:12px; color:#475569; margin-bottom:8px; font-weight:bold;">Excel ડેટા અહીં પેસ્ટ કરો:</p>
        
        <textarea id="smartInput" placeholder="અહીં ક્લિક કરો..." style="width:100%; height:130px; border:1px solid #cbd5e1; border-radius:6px; padding:10px; font-size:13px; margin-bottom:10px; resize:none;"></textarea>
        
        <div style="display:flex; gap:8px;">
            <button id="btnPasteManual" style="flex:1; background:#6366f1; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; font-size:12px;">📋 Paste Data</button>
            <button id="btnStartBot" style="flex:2; background:#10b981; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; font-size:14px;">🎯 START FILLING</button>
        </div>
        
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:12px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    // ૪. બટન ઇવેન્ટ્સ (Events)
    
    // બંધ કરવા માટે
    document.getElementById('closeSmartBot').onclick = () => div.remove();

    // જો Ctrl+V કામ ન કરે તો આ બટનથી પેસ્ટ થશે
    document.getElementById('btnPasteManual').onclick = async function() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('smartInput').value = text;
        } catch (err) {
            alert("બ્રાઉઝરે પેસ્ટ કરવાની ના પાડી. કૃપા કરીને Ctrl + V વાપરો.");
        }
    };

    // માર્ક્સ ભરવા માટે
    document.getElementById('btnStartBot').onclick = async function() {
        const data = document.getElementById('smartInput').value.trim();
        if(!data) { alert("પહેલા ડેટા પેસ્ટ કરો!"); return; }
        this.disabled = true;
        this.innerText = "⏳ એન્ટ્રી ચાલુ છે...";

        const rows = data.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const nameKey = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // નામ શોધવું
            let targetCell = null;
            document.querySelectorAll('td, span, div, p').forEach(el => {
                if(el.children.length === 0 && el.textContent.toLowerCase().includes(nameKey)) targetCell = el;
            });

            if(targetCell) {
                let rowContainer = targetCell.parentElement;
                let inputs = [];
                for(let level=0; level<20; level++) {
                    if(!rowContainer) break;
                    inputs = Array.from(rowContainer.querySelectorAll('input[type="number"], input[type="text"]')).filter(i => !i.disabled);
                    if(inputs.length >= marks.length) break;
                    rowContainer = rowContainer.parentElement;
                }

                inputs.forEach((input, idx) => {
                    if(marks[idx] !== undefined) {
                        input.focus();
                        let setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(input, marks[idx]);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.style.background = "#dcfce7";
                    }
                });
                await new Promise(r => setTimeout(r, 100));
            }
        }
        alert("🎉 એન્ટ્રી પૂર્ણ થઈ ગઈ છે!");
        this.disabled = false;
        this.innerText = "🎯 START FILLING";
    };
})();

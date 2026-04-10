(function() {
    const botId = 'universal-smart-bot-v5';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    // ૧. ડેશબોર્ડ ડિઝાઇન
    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:#ffffff; z-index:2147483647; border-radius:12px; padding:20px; box-shadow:0 15px 45px rgba(0,0,0,0.4); border:3px solid #4f46e5; pointer-events:auto !important;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <h3 style="margin:0; color:#4f46e5; font-size:18px;">🚀 Universal Cloud Bot (V5)</h3>
            <button id="closeSmartBot" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Close ❌</button>
        </div>
        <textarea id="smartInput" placeholder="Excel ડેટા અહીં પેસ્ટ કરો..." style="width:100%; height:130px; border:2px solid #cbd5e1; border-radius:6px; padding:10px; font-size:13px; margin-bottom:12px;"></textarea>
        <button id="btnStartBot" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">🎯 START & SAVE FILLING</button>
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:12px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    document.getElementById('closeSmartBot').onclick = () => div.remove();

    // ૨. મેજિક ફંક્શન: જે ડેટાને ખરેખર વેબસાઈટમાં 'સેવ' કરશે
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        
        // તમામ ઇવેન્ટ્સ ફાયર કરો જેથી વેબસાઈટને ખબર પડે
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    document.getElementById('btnStartBot').onclick = async function() {
        const data = document.getElementById('smartInput').value.trim();
        if(!data) return alert("ડેટા પેસ્ટ કરો!");
        
        this.disabled = true;
        this.innerText = "⏳ એન્ટ્રી ચાલુ છે...";

        const rows = data.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // પેજ પર વિદ્યાર્થીને શોધવો
            let targetCell = Array.from(document.querySelectorAll('td, span, div, p')).find(el => 
                el.children.length === 0 && el.textContent.toLowerCase().includes(key)
            );

            if(targetCell) {
                let rowEl = targetCell.parentElement;
                let inputs = [];
                for(let i=0; i<20; i++) {
                    if(!rowEl) break;
                    inputs = Array.from(rowEl.querySelectorAll('input:not([disabled])'));
                    if(inputs.length >= marks.length) break;
                    rowEl = rowEl.parentElement;
                }

                // માર્ક્સ ભરવા અને સેવ ટ્રિગર કરવું
                inputs.forEach((inp, idx) => {
                    if(marks[idx]) {
                        inp.focus();
                        setNativeValue(inp, marks[idx]); // 🔥 અસલી ફિલિંગ અહી થાય છે
                        inp.style.background = "#d1fae5";
                        inp.style.border = "2px solid #10b981";
                    }
                });
                await new Promise(r => setTimeout(r, 150)); // હ્યુમન ડિલે
            }
        }
        alert("🎉 અભિનંદન! તમામ એન્ટ્રી સફળતાપૂર્વક થઈ ગઈ છે અને સેવ પણ થઈ ગઈ છે.");
        this.disabled = false;
        this.innerText = "🎯 START & SAVE FILLING";
    };
})();

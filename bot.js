(function() {
    const botId = 'smart-bot-v4';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    const div = document.createElement('div');
    div.id = botId;
    // અહી z-index અને pointer-events ફિક્સ કર્યા છે
    div.style.cssText = 'position:fixed; top:50px; right:20px; width:360px; background:#ffffff; z-index:2147483647; border-radius:12px; padding:20px; box-shadow:0 10px 40px rgba(0,0,0,0.5); border:3px solid #4f46e5; pointer-events:auto !important;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <b style="color:#4f46e5;">🤖 Universal Cloud Bot</b>
            <button id="closeBot" style="cursor:pointer; background:red; color:white; border:none; border-radius:4px; padding:2px 10px;">Close X</button>
        </div>
        <textarea id="dataBox" placeholder="Excel ડેટા પેસ્ટ કરો..." style="width:100%; height:120px; border:1px solid #ccc; border-radius:5px; margin-bottom:10px; pointer-events:auto !important;"></textarea>
        <button id="startBtn" style="width:100%; background:#10b981; color:white; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">🎯 START FILLING</button>
    `;

    document.body.appendChild(div);

    // Close Button logic
    document.getElementById('closeBot').onclick = () => div.remove();

    // Start Filling logic
    document.getElementById('startBtn').onclick = async function() {
        const val = document.getElementById('dataBox').value.trim();
        if(!val) return alert("ડેટા પેસ્ટ કરો!");
        this.disabled = true; this.innerText = "Processing...";
        
        const rows = val.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1);

            let target = Array.from(document.querySelectorAll('td, span, div')).find(el => el.children.length === 0 && el.textContent.toLowerCase().includes(key));
            if(target) {
                let rowEl = target.parentElement;
                let inputs = [];
                for(let i=0; i<15; i++) {
                    if(!rowEl) break;
                    inputs = Array.from(rowEl.querySelectorAll('input:not([disabled])'));
                    if(inputs.length >= marks.length) break;
                    rowEl = rowEl.parentElement;
                }
                inputs.forEach((inp, idx) => {
                    if(marks[idx]) {
                        inp.focus();
                        let nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeSetter.call(inp, marks[idx].trim());
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        inp.style.background = "#d1fae5";
                    }
                });
            }
        }
        alert("એન્ટ્રી પૂર્ણ!");
        this.disabled = false; this.innerText = "🎯 START FILLING";
    };
})();

(function() {
    // જૂની વિન્ડો હોય તો કાઢી નાખો
    let old = document.getElementById('cloud-smart-bot');
    if(old) old.remove();

    // ૧. પોર્ટલ પર 'ફ્રીઝ પેન' અને 'ક્લિક પરમિશન' માટે CSS ઇન્જેક્શન
    const style = document.createElement('style');
    style.innerHTML = `
        #cloud-smart-bot, #cloud-smart-bot * { pointer-events: auto !important; }
        #cloudBotData { cursor: text !important; user-select: auto !important; }
        thead th { position: sticky !important; top: 0 !important; z-index: 100 !important; background: #f1f5f9 !important; }
    `;
    document.head.appendChild(style);

    // ૨. સ્માર્ટ ડેશબોર્ડ (UI) - મજબૂત સ્ટાઇલ સાથે
    const div = document.createElement('div');
    div.id = 'cloud-smart-bot';
    // z-index ને 9999999 કરી દીધું છે જેથી તે બધાની ઉપર રહે
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:white; z-index:9999999; border-radius:16px; padding:25px; box-shadow:0 25px 50px rgba(0,0,0,0.3); border:2px solid #4f46e5; font-family:sans-serif; display:block !important;';
    
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0; color:#1e293b; font-size:18px;">🚀 Cloud Bot v2.5</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:red; font-weight:bold; cursor:pointer; font-size:20px;">&times;</button>
        </div>
        <p style="font-size:12px; color:#64748b; margin-bottom:10px;">Excel માંથી ડેટા અહીં પેસ્ટ કરો:</p>
        <textarea id="cloudBotData" placeholder="અહીં ક્લિક કરો અને Paste કરો..." style="width:100%; height:150px; border:2px solid #e2e8f0; border-radius:8px; padding:10px; font-size:13px; color:#1e293b; background:#f8fafc !important;"></textarea>
        <button id="cloudStartBtn" style="width:100%; margin-top:15px; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">🎯 START SMART FILL</button>
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:10px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    // ૩. ઓટો-ફોકસ: વિન્ડો ખુલતા જ કર્સર બોક્સમાં આવી જશે
    setTimeout(() => {
        const area = document.getElementById('cloudBotData');
        area.focus();
        area.click();
    }, 500);

    // ૪. એન્ટ્રી લોજીક
    document.getElementById('cloudStartBtn').onclick = async function() {
        const data = document.getElementById('cloudBotData').value.trim();
        if(!data) { alert("કૃપા કરીને ડેટા પેસ્ટ કરો!"); return; }
        this.innerText = "⏳ એન્ટ્રી ચાલુ છે...";
        this.style.background = "#6b7280";

        const rows = data.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            if(cols.length < 2) continue;
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            let target = null;
            document.querySelectorAll('td, span, div, p').forEach(el => {
                if(el.children.length === 0 && el.textContent.toLowerCase().includes(key)) target = el;
            });

            if(target) {
                let parent = target.parentElement;
                let inputs = [];
                for(let i=0; i<20; i++) {
                    if(!parent) break;
                    inputs = Array.from(parent.querySelectorAll('input[type="number"], input[type="text"]')).filter(inp => !inp.disabled);
                    if(inputs.length >= marks.length) break;
                    parent = parent.parentElement;
                }

                inputs.forEach((input, idx) => {
                    if(marks[idx] !== undefined) {
                        input.focus();
                        let nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeSetter.call(input, marks[idx]);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.style.background = "#dcfce7";
                    }
                });
                await new Promise(r => setTimeout(r, 100));
            }
        }
        alert("✅ એન્ટ્રી પૂર્ણ!");
        this.innerText = "🎯 START SMART FILL";
        this.style.background = "#10b981";
    };
})();

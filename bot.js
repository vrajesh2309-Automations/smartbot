(function() {
    // ૧. ઓટો-ડિટેક્ટ પોર્ટલ (Intelligence)
    const url = window.location.href;
    let portalType = "Unknown";
    if(url.includes("convegenius")) portalType = "Convegenius";
    else if(url.includes("ssagujarat")) portalType = "SSA Portal";

    // ૨. પ્રીમિયમ ફ્રીઝ પેન (UI Fix)
    const style = document.createElement('style');
    style.innerHTML = `
        thead th { position: sticky !important; top: 0; z-index: 1000; background: #f8fafc !important; }
        td:nth-child(2), td:nth-child(3) { position: sticky !important; left: 0; z-index: 999; background: white !important; }
    `;
    document.head.appendChild(style);

    // ૩. સ્માર્ટ ડેશબોર્ડ ઇન્જેક્શન
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:white; z-index:1000000; border-radius:16px; padding:25px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border-top:6px solid #4f46e5; font-family:sans-serif;';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0; color:#1e293b;">🚀 Cloud Bot v2.1</h3>
            <span style="background:#e0e7ff; color:#4338ca; padding:4px 10px; border-radius:20px; font-size:10px; font-weight:bold;">${portalType} Detected</span>
        </div>
        <textarea id="cloudBotData" placeholder="Excel માંથી ડેટા પેસ્ટ કરો..." style="width:100%; height:150px; border:1px solid #e2e8f0; border-radius:8px; padding:10px; font-size:12px;"></textarea>
        <button id="cloudStartBtn" style="width:100%; margin-top:15px; background:#4f46e5; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 START SMART FILL</button>
        <p style="text-align:center; font-size:10px; color:#64748b; margin-top:10px;">Powered by PM Shri Chandana School</p>
    `;
    document.body.appendChild(div);

    // ૪. એડવાન્સ મેચિંગ અને ફિલિંગ લોજીક (React-Proof)
    document.getElementById('cloudStartBtn').onclick = async function() {
        const data = document.getElementById('cloudBotData').value.trim();
        if(!data) { alert("ડેટા પેસ્ટ કરો!"); return; }

        const rows = data.split('\n');
        for(let row of rows) {
            const cols = row.split('\t');
            const key = cols[0].trim().toLowerCase();
            const marks = cols.slice(1).map(m => m.trim());

            // ઇન્ટેલિજન્ટ સર્ચ: નામ અથવા ID ગમે ત્યાં હોય, શોધી કાઢશે
            let target = null;
            document.querySelectorAll('td, span, div').forEach(el => {
                if(el.children.length === 0 && el.textContent.toLowerCase().includes(key)) target = el;
            });

            if(target) {
                let parent = target.parentElement;
                let inputs = [];
                // ૨૫ લેવલ સુધી સ્માર્ટ સર્ચ
                for(let i=0; i<25; i++) {
                    if(!parent) break;
                    inputs = Array.from(parent.querySelectorAll('input[type="number"], input[type="text"]')).filter(inp => !inp.disabled);
                    if(inputs.length >= marks.length) break;
                    parent = parent.parentElement;
                }

                // Native Keyboard Injection (React Bypass)
                inputs.forEach((input, idx) => {
                    if(marks[idx] !== undefined) {
                        input.focus();
                        let nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeSetter.call(input, marks[idx]);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.style.border = "2px solid #10b981";
                        input.style.background = "#f0fdf4";
                    }
                });
                await new Promise(r => setTimeout(r, 150)); // નેચરલ સ્પીડ
            }
        }
        alert("✅ એન્ટ્રી સફળતાપૂર્વક પૂર્ણ થઈ!");
    };
})();

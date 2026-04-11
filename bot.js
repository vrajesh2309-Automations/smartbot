(function() {
    const botId = 'smart-bot-v9-pro';
    if(document.getElementById(botId)) document.getElementById(botId).remove();

    const div = document.createElement('div');
    div.id = botId;
    div.style.cssText = 'position:fixed; top:20px; right:20px; width:380px; background:#fff; border-radius:15px; padding:20px; box-shadow:0 15px 50px rgba(0,0,0,0.5); border:3px solid #4f46e5; z-index:2147483647; font-family:sans-serif;';

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <b style="color:#4f46e5;">🚀 Gujarat Smart Bot V9 (Dropdown Fix)</b>
            <button onclick="this.parentElement.parentElement.remove()" style="background:red; color:white; border:none; border-radius:6px; cursor:pointer; padding:2px 10px;">X</button>
        </div>
        <textarea id="smartInput" placeholder="એક્સલ ડેટા પેસ્ટ કરો (ID અને પછી ક્રમમાં માર્ક્સ)..." style="width:100%; height:130px; border:1px solid #cbd5e1; border-radius:8px; padding:10px; font-size:13px; margin-bottom:10px;"></textarea>
        <button id="btnStart" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:16px;">🎯 START AUTO FILL</button>
        <p style="text-align:center; font-size:10px; color:#94a3b8; margin-top:10px;">PM Shri Chandana School - Smart Tool</p>
    `;
    document.body.appendChild(div);

    // React/MUI Dropdown ફિલિંગ ફંક્શન
    async function fillDropdown(element, value) {
        element.focus();
        element.click(); // ડ્રોપડાઉન ખોલવા માટે
        await new Promise(r => setTimeout(r, 200));

        // જો તે ઇનપુટ હોય તો વેલ્યુ સેટ કરો
        let setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(element, value);
        
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        element.blur();
    }

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

            // ૧. હાજરી (Present) ઓટો ક્લિક
            let presentBtn = Array.from(document.querySelectorAll('input[type="radio"], .MuiRadio-root')).find(el => el.parentElement.innerText.includes('Present') || el.value === 'Present');
            if(presentBtn) presentBtn.click();

            // ૨. વિદ્યાર્થીના ઇનપુટ/ડ્રોપડાઉન શોધવા
            // સ્ક્રીનશોટ મુજબ "Select Score" ધરાવતા તમામ ઇનપુટ્સ શોધો
            let dropdowns = Array.from(document.querySelectorAll('input, [role="combobox"], [role="button"]'))
                                .filter(el => el.innerText?.includes('Select Score') || el.placeholder?.includes('Select Score') || el.getAttribute('aria-label')?.includes('Select Score'));

            // જો ઉપરની રીતે ના મળે, તો બધા જ ઇનપુટ ફિલ્ડ્સ લો
            if(dropdowns.length === 0) {
                dropdowns = Array.from(document.querySelectorAll('input')).filter(i => !['radio', 'checkbox'].includes(i.type));
            }

            // માર્ક્સ ભરવા
            for (let idx = 0; idx < marks.length; idx++) {
                if (dropdowns[idx] && marks[idx] !== "") {
                    await fillDropdown(dropdowns[idx], marks[idx]);
                    dropdowns[idx].style.background = "#d1fae5";
                }
            }

            // ૩. સેવ બટન
            await new Promise(r => setTimeout(r, 1000));
            let saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('save'));
            if(saveBtn) saveBtn.click();

            await new Promise(r => setTimeout(r, 2000)); // આગામી સ્ટુડન્ટ માટે સમય
        }
        alert("🎉 સફળતાપૂર્વક પૂર્ણ!");
        this.disabled = false; this.innerText = "🎯 START AUTO FILL";
    };
})();

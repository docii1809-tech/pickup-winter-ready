(() => {
  const links = window.PWR_AFFILIATE_LINKS || {};
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menu && nav) menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav?.classList.remove("open")));

  const recommendations = {
    battery: {
      title: "Start with a correctly matched jump starter",
      intro: "For a pickup, verify that the exact model supports your engine size and fuel type. Do not rely on peak amps alone.",
      bullets: ["Confirm gas/diesel engine compatibility from the manufacturer.", "Check reverse-polarity and short-circuit protections.", "Review operating-temperature and storage instructions.", "Compare cable reach, clamp design, recharge method, and warranty."],
      category: "Jump starter buying guide"
    },
    tire: {
      title: "Compare a tire inflator by airflow and duty cycle",
      intro: "A high PSI number does not tell you how quickly a compressor can inflate a truck tire or how long it can safely run.",
      bullets: ["Compare airflow ratings at similar pressures.", "Check duty cycle and required cool-down periods.", "Confirm power draw and cable reach.", "Look for a readable gauge and auto shutoff; verify pressure with a reliable gauge."],
      category: "Portable tire inflator guide"
    },
    stuck: {
      title: "Build a safe traction and recovery kit",
      intro: "Start with a shovel and traction aid that fit your tires and storage space. Use recovery equipment only with rated attachment points and proper technique.",
      bullets: ["Compare board dimensions, materials, and manufacturer limits.", "Carry gloves and a compact shovel.", "Never use a strap or rope with unknown ratings.", "Stay clear of tensioned recovery gear and call a professional if unsure."],
      category: "Recovery equipment guide"
    },
    emergency: {
      title: "Build a balanced roadside emergency kit",
      intro: "Choose equipment around the conditions you drive in, your vehicle, and how far you travel from help.",
      bullets: ["Consider a compatible jump starter and tire inflator.", "Pack a flashlight, gloves, warm layers, and shovel.", "Check spare tire, jack, lug wrench, and warning devices.", "Keep your phone charged and tell someone your route in severe weather."],
      category: "Winter readiness checklist"
    }
  };
  document.getElementById("find-button")?.addEventListener("click", () => {
    const need = document.getElementById("need").value;
    const vehicle = document.getElementById("vehicle").value;
    const budget = document.getElementById("budget").value;
    const item = recommendations[need];
    const budgetText = ({value:"under $75",mid:"$75–$150",premium:"$150–$300",any:"a flexible budget"})[budget];
    const vehicleText = ({pickup:"pickup truck",heavy:"heavy-duty pickup",suv:"SUV / 4x4",car:"car / crossover"})[vehicle];
    const result = document.getElementById("finder-result");
    result.innerHTML = `<div class="result-icon">✓</div><p class="eyebrow">YOUR STARTING POINT</p><h3>${item.title}</h3><p>${item.intro}</p><p><b>Your selections:</b> ${vehicleText}; ${budgetText}.</p><ul class="check-list">${item.bullets.map(x=>`<li>${x}</li>`).join("")}</ul><a class="card-link" href="${need==="battery"?"#jump-starters":need==="tire"?"#inflators":need==="stuck"?"#recovery":"#checklist"}">Open ${item.category.toLowerCase()} →</a>`;
  });

  const productNames = {"gooloo-a3-lite":"GOOLOO A3 Lite","viair-400p":"VIAIR 400P","traction-boards":"Recovery traction boards"};
  document.querySelectorAll(".affiliate-actions").forEach(container => {
    const id = container.dataset.product;
    const p = links[id] || {};
    const items = [];
    if (p.amazon) items.push(`<a class="affiliate-button" href="${safeUrl(p.amazon)}" target="_blank" rel="sponsored nofollow noopener">Check Amazon availability ↗</a>`);
    if (p.ebay) items.push(`<a class="affiliate-button secondary" href="${safeUrl(p.ebay)}" target="_blank" rel="sponsored nofollow noopener">Compare on eBay ↗</a>`);
    if (!items.length) items.push(`<div class="affiliate-placeholder">Shopping links are being configured. Product links will appear here after the site owner adds verified affiliate URLs.</div>`);
    container.innerHTML = items.join("");
  });
  function safeUrl(value) {
    try { const u = new URL(value); return (u.protocol === "https:" || u.protocol === "http:") ? u.href : "#"; } catch { return "#"; }
  }
  document.getElementById("reset-checklist")?.addEventListener("click", () => document.querySelectorAll(".checklist-box input[type=checkbox]").forEach(x => x.checked = false));
  document.getElementById("year").textContent = new Date().getFullYear();
})();

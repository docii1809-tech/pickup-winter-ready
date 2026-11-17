/**
 * PICKUP WINTER READY — VANILLA JAVASCRIPT ENGINE
 * Powers:
 * 1. Mobile navigation drawer
 * 2. Central affiliate-config.js link hydration & placeholder modal
 * 3. Interactive Pickup Winter Gear Finder
 * 4. Interactive Winter Readiness Checklist (with localStorage persistence)
 * 5. Static Contact form validation & draft composer
 */

(function () {
  "use strict";

  var STORAGE_KEY = "pwr_winter_checklist_v1";

  /* -----------------------------------------------------------------------
     1. Mobile Navigation Drawer
     ----------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById("mobile-menu-toggle");
    var drawer = document.getElementById("mobile-nav-drawer");
    if (!toggle || !drawer) return;

    toggle.addEventListener("click", function () {
      var isOpen = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "Close" : "Menu";
    });

    var drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
        toggle.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     2. Affiliate Config Hydration & Placeholder Modal
     ----------------------------------------------------------------------- */
  function isValidExternalUrl(url) {
    if (typeof url !== "string") return false;
    var trimmed = url.trim();
    return trimmed.indexOf("https://") === 0 || trimmed.indexOf("http://") === 0;
  }

  function ensurePlaceholderModal() {
    var existing = document.getElementById("affiliate-placeholder-modal");
    if (existing) return existing;

    var modal = document.createElement("div");
    modal.id = "affiliate-placeholder-modal";
    modal.className = "modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "affiliate-modal-title");

    modal.innerHTML =
      '<div class="modal-card">' +
      '  <span class="kicker">Affiliate Link Placeholder</span>' +
      '  <h3 id="affiliate-modal-title">Store Link Pending Owner Setup</h3>' +
      '  <p id="affiliate-modal-body" style="margin-bottom:14px;"></p>' +
      '  <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px;">' +
      '    For site owners: open <code>affiliate-config.js</code> and paste your Amazon Associates or eBay Partner Network URL into the matching product entry. No HTML edits are required.' +
      "  </p>" +
      '  <button type="button" id="affiliate-modal-close" class="btn btn-primary btn-block">Close Notice</button>' +
      "</div>";

    document.body.appendChild(modal);

    var closeBtn = document.getElementById("affiliate-modal-close");
    closeBtn.addEventListener("click", function () {
      modal.classList.remove("is-open");
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        modal.classList.remove("is-open");
      }
    });

    return modal;
  }

  function initAffiliateLinks() {
    var config = window.PICKUP_WINTER_CONFIG || { products: {} };
    var products = config.products || {};

    var disclosureTargets = document.querySelectorAll("[data-affiliate-disclosure]");
    disclosureTargets.forEach(function (el) {
      if (config.disclosureShort) {
        el.textContent = config.disclosureShort;
      }
    });

    var buttons = document.querySelectorAll("[data-product-id][data-retailer]");
    if (!buttons.length) return;

    var modal = ensurePlaceholderModal();
    var modalBody = document.getElementById("affiliate-modal-body");

    buttons.forEach(function (btn) {
      var productId = btn.getAttribute("data-product-id");
      var retailer = btn.getAttribute("data-retailer");
      var entry = products[productId] || {};

      var url = retailer === "amazon" ? entry.amazonUrl : entry.ebayUrl;
      var label = retailer === "amazon" ? entry.amazonLabel : entry.ebayLabel;

      if (isValidExternalUrl(url)) {
        btn.setAttribute("href", url.trim());
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "nofollow sponsored noopener noreferrer");
        btn.classList.remove("btn-placeholder");
        if (retailer === "amazon") {
          btn.classList.add("btn-primary");
        } else {
          btn.classList.add("btn-secondary");
        }
        if (label) {
          btn.textContent = label;
        }
        btn.setAttribute("data-affiliate-status", "active");
      } else {
        btn.setAttribute("href", "#affiliate-placeholder");
        btn.removeAttribute("target");
        btn.removeAttribute("rel");
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-placeholder");
        btn.setAttribute("data-affiliate-status", "placeholder");
        btn.textContent =
          retailer === "amazon"
            ? "Amazon Link (Placeholder)"
            : "eBay Link (Placeholder)";

        btn.addEventListener("click", function (event) {
          event.preventDefault();
          var itemName = entry.name || productId;
          var networkName =
            retailer === "amazon"
              ? "Amazon Associates"
              : "eBay Partner Network";
          modalBody.textContent =
            'The ' +
            networkName +
            ' shopping link for "' +
            itemName +
            '" (ID: ' +
            productId +
            ") has not been added yet, so no external tracking URL is active.";
          modal.classList.add("is-open");
          document.getElementById("affiliate-modal-close").focus();
        });
      }
    });
  }

  /* -----------------------------------------------------------------------
     3. Interactive Pickup Winter Gear Finder
     ----------------------------------------------------------------------- */
  function initGearFinder() {
    var root = document.getElementById("winter-gear-finder");
    if (!root) return;

    var state = {
      truckType: "full-size-gas",
      snowIce: "yes",
      parkOutside: "yes",
      ruralTravel: "yes",
      budget: "moderate"
    };

    var truckSelect = document.getElementById("finder-truck-type");
    var budgetSelect = document.getElementById("finder-budget");
    var outputBox = document.getElementById("finder-results");
    var resetBtn = document.getElementById("finder-reset");
    var baseGuidePrefix = root.getAttribute("data-guide-prefix") || "guides/";

    function getSegButtons(field) {
      return root.querySelectorAll('[data-finder-field="' + field + '"]');
    }

    ["snowIce", "parkOutside", "ruralTravel"].forEach(function (field) {
      var btns = getSegButtons(field);
      btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          state[field] = btn.getAttribute("data-finder-value");
          btns.forEach(function (other) {
            other.setAttribute(
              "aria-pressed",
              String(other === btn)
            );
          });
          renderFinderResults();
        });
      });
    });

    if (truckSelect) {
      truckSelect.addEventListener("change", function () {
        state.truckType = truckSelect.value;
        renderFinderResults();
      });
    }

    if (budgetSelect) {
      budgetSelect.addEventListener("change", function () {
        state.budget = budgetSelect.value;
        renderFinderResults();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state = {
          truckType: "full-size-gas",
          snowIce: "yes",
          parkOutside: "yes",
          ruralTravel: "yes",
          budget: "moderate"
        };
        if (truckSelect) truckSelect.value = "full-size-gas";
        if (budgetSelect) budgetSelect.value = "moderate";
        ["snowIce", "parkOutside", "ruralTravel"].forEach(function (field) {
          getSegButtons(field).forEach(function (btn) {
            btn.setAttribute(
              "aria-pressed",
              String(btn.getAttribute("data-finder-value") === "yes")
            );
          });
        });
        renderFinderResults();
      });
    }

    function renderFinderResults() {
      var recommendations = [];

      // 1. Jump Starter / Starting Power
      if (state.truckType === "heavy-duty-diesel") {
        recommendations.push({
          priority: "Core Priority · Starting Power",
          title: "High-Output Jump Starter (Diesel / Dual-Battery Class) or Supercapacitor Pack",
          reason:
            state.parkOutside === "yes"
              ? "Outdoor overnight parking pulls battery cranking capacity down right when glow plugs and heavy diesel starters demand maximum current."
              : "Diesel trucks and dual-battery systems need higher sustained cranking amperage and heavy-gauge clamps than compact passenger-car boosters.",
          guideHref: baseGuidePrefix + "best-winter-jump-starters.html",
          guideLabel: "Compare Winter Jump Starters"
        });
      } else if (state.truckType === "older-daily-driver") {
        recommendations.push({
          priority: "Core Priority · Starting Reliability",
          title:
            state.budget === "essential"
              ? "Heavy-Gauge 20–25 ft Copper Booster Cables + Compact Lithium Jump Starter"
              : "Full-Size Lithium Jump Starter + Long Copper Booster Cables",
          reason:
            "Older daily-driver pickups often have aging alternators, higher parasitic draw, or corroded terminals that show up on the first deep freeze.",
          guideHref: baseGuidePrefix + "best-winter-jump-starters.html",
          guideLabel: "See Jump Starter Guide"
        });
      } else {
        recommendations.push({
          priority: "Core Priority · Cold-Start Backup",
          title:
            state.parkOutside === "yes"
              ? "Cold-Weather Lithium Jump Starter (Full-Size or Mid-Size Rated)"
              : "Portable Lithium Jump Starter or Heavy-Gauge Booster Cables",
          reason:
            state.parkOutside === "yes"
              ? "Parking outside overnight exposes your starting battery to sub-freezing air, reducing available cranking power when you leave for work."
              : "A portable jump starter lets you start your pickup without waiting for another vehicle to pull nose-to-nose in a tight driveway or lot.",
          guideHref: baseGuidePrefix + "best-winter-jump-starters.html",
          guideLabel: "Read Jump Starter Guide"
        });
      }

      // 2. Tire Inflator & Pressure Management
      recommendations.push({
        priority: "Tire Safety · Cold Pressure Loss",
        title:
          state.truckType === "heavy-duty-diesel" || state.budget === "complete"
            ? "12V Direct-Battery Clamp Tire Inflator + Heavy-Duty Pressure Gauge"
            : "Portable 12V or Cordless Digital Tire Inflator",
        reason:
          "Tire pressure drops roughly 1 PSI for every 10°F temperature drop. Underinflated truck tires lose snow bite, overheat on highway runs, and wear unevenly.",
        guideHref: baseGuidePrefix + "best-portable-tire-inflators.html",
        guideLabel: "Explore Tire Inflators"
      });

      // 3. Snow & Ice Recovery
      if (state.snowIce === "yes" || state.ruralTravel === "yes") {
        recommendations.push({
          priority: "Traction & Self-Recovery",
          title:
            state.budget === "essential"
              ? "Collapsible Snow Shovel, Traction Grit/Boards & Tow Strap"
              : "Recovery Traction Boards, Kinetic Recovery Rope & 2\" Hitch Shackle",
          reason:
            state.ruralTravel === "yes"
              ? "Unplowed county roads, icy driveways, and soft shoulders mean help can be miles away. Self-recovery boards and a shovel get an unloaded rear axle moving again."
              : "Even 4WD pickups high-center in wet plowed berms or spin on glazed intersections; a shovel and traction boards add instant grip.",
          guideHref: baseGuidePrefix + "snow-ice-recovery-equipment.html",
          guideLabel: "View Recovery Gear Guide"
        });
      }

      // 4. Winter Emergency & Cab Survival
      if (state.ruralTravel === "yes" || state.parkOutside === "yes" || state.budget !== "essential") {
        recommendations.push({
          priority: "Cab Readiness & Visibility",
          title:
            state.ruralTravel === "yes"
              ? "72-Hour Cab Winter Emergency Kit, Wool/Thermal Blankets & Extendable Scraper"
              : "Extendable Truck Ice Scraper, Cold-Rated Headlamp & Cab Emergency Kit",
          reason:
            state.ruralTravel === "yes"
              ? "If road closures or a slide-off keep you stranded in freezing wind, warm layers, blankets, visibility beacons, and cold-rated lighting protect occupants."
              : "Full-size pickup windshields and roofs are tall; an extendable scraper/brush clears frozen glass safely while a reliable light handles dark winter commutes.",
          guideHref: baseGuidePrefix + "winter-emergency-kits.html",
          guideLabel: "Build Your Emergency Kit"
        });
      }

      // 5. Preparation Checklist & Driving Habits
      recommendations.push({
        priority: "Zero-Cost Maintenance Step",
        title: "Complete Pre-Freeze Fluid, Battery & Tread Inspection",
        reason:
          "Before buying extra gear, confirm -20°F/-30°F washer fluid, coolant freeze protection, wiper condition, and rear-axle ballast placement.",
        guideHref: baseGuidePrefix + "winter-preparation-checklist.html",
        guideLabel: "Open Interactive Checklist"
      });

      var budgetNote = "";
      if (state.budget === "essential") {
        budgetNote =
          "Budget focus (Essential / Under $150): Start with heavy-gauge booster cables or an entry jump pack, an extendable ice scraper, a basic 12V inflator, and a folding shovel before adding specialized recovery gear.";
      } else if (state.budget === "moderate") {
        budgetNote =
          "Budget focus (Balanced / $150–$400): Prioritize a truck-sized lithium jump starter, a reliable tire inflator, traction boards or shovel, and a core cold-weather cab kit.";
      } else {
        budgetNote =
          "Budget focus (Complete Outfitting / $400+): Pair a high-output jump starter with a direct-clamp air compressor, kinetic recovery rope with hitch shackle, traction boards, and a full rural emergency kit.";
      }

      var html =
        '<p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:14px;">' +
        budgetNote +
        "</p>";

      recommendations.forEach(function (rec) {
        html +=
          '<div class="result-item">' +
          '  <div class="result-priority">' +
          rec.priority +
          "</div>" +
          '  <h4 style="margin-top:4px;margin-bottom:6px;">' +
          rec.title +
          "</h4>" +
          '  <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:8px;">' +
          rec.reason +
          "</p>" +
          '  <a href="' +
          rec.guideHref +
          '" style="font-size:0.875rem;font-weight:700;">' +
          rec.guideLabel +
          " &rarr;</a>" +
          "</div>";
      });

      html +=
        '<p style="font-size:0.8rem;color:var(--text-muted);margin-top:16px;margin-bottom:0;">' +
        "Note: These recommendations are general winter equipment suggestions based on your driving conditions, not personalized mechanical diagnostics for your specific vehicle." +
        "</p>";

      outputBox.innerHTML = html;
    }

    renderFinderResults();
  }

  /* -----------------------------------------------------------------------
     4. Interactive Winter Readiness Checklist (Synced via localStorage)
     ----------------------------------------------------------------------- */
  function loadChecklistState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecklistState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore storage errors in restricted browsing contexts
    }
  }

  function initChecklists() {
    var containers = document.querySelectorAll("[data-checklist-root]");
    if (!containers.length) return;

    function syncAllChecklists() {
      var state = loadChecklistState();

      containers.forEach(function (container) {
        var checkboxes = container.querySelectorAll(".checklist-checkbox");
        var total = checkboxes.length;
        var completed = 0;

        checkboxes.forEach(function (box) {
          var itemId = box.getAttribute("data-check-id");
          var checked = Boolean(state[itemId]);
          box.checked = checked;
          var row = box.closest(".checklist-row");
          if (row) {
            row.classList.toggle("is-checked", checked);
          }
          if (checked) completed++;
        });

        var percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        var countLabel = container.querySelector("[data-checklist-count]");
        var percentLabel = container.querySelector("[data-checklist-percent]");
        var progressFill = container.querySelector("[data-checklist-bar]");
        var statusNote = container.querySelector("[data-checklist-status]");

        if (countLabel) {
          countLabel.textContent = completed + " of " + total + " completed";
        }
        if (percentLabel) {
          percentLabel.textContent = percent + "%";
        }
        if (progressFill) {
          progressFill.style.width = percent + "%";
        }
        if (statusNote) {
          if (completed === 0) {
            statusNote.textContent =
              "Start checking items off as you inspect your pickup and stock winter gear.";
          } else if (completed < total) {
            statusNote.textContent =
              "Progress is saved in this browser. Continue through the remaining winter checks.";
          } else {
            statusNote.textContent =
              "All " +
              total +
              " winter readiness items checked off for this season.";
          }
        }
      });
    }

    containers.forEach(function (container) {
      var checkboxes = container.querySelectorAll(".checklist-checkbox");
      checkboxes.forEach(function (box) {
        box.addEventListener("change", function () {
          var state = loadChecklistState();
          var itemId = box.getAttribute("data-check-id");
          state[itemId] = box.checked;
          saveChecklistState(state);
          syncAllChecklists();
        });
      });

      var resetBtn = container.querySelector("[data-checklist-reset]");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          saveChecklistState({});
          syncAllChecklists();
        });
      }

      var printBtn = container.querySelector("[data-checklist-print]");
      if (printBtn) {
        printBtn.addEventListener("click", function () {
          window.print();
        });
      }
    });

    syncAllChecklists();
  }

  /* -----------------------------------------------------------------------
     5. Static Contact Form Validation & Local Confirmation
     ----------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("pwr-contact-form");
    if (!form) return;

    var feedback = document.getElementById("contact-form-feedback");
    var config = window.PICKUP_WINTER_CONFIG || {};
    var recipient = config.contactEmail || "owner@pickupwinterready.example";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (document.getElementById("contact-name").value || "").trim();
      var email = (document.getElementById("contact-email").value || "").trim();
      var topic = (document.getElementById("contact-topic").value || "").trim();
      var message = (document.getElementById("contact-message").value || "").trim();

      if (!name || !email || email.indexOf("@") === -1 || message.length < 10) {
        feedback.className = "form-feedback is-error";
        feedback.hidden = false;
        feedback.textContent =
          "Please enter your name, a valid email address, and a message of at least 10 characters.";
        return;
      }

      var subject = encodeURIComponent("[Pickup Winter Ready] " + topic + " — " + name);
      var body = encodeURIComponent(
        "From: " + name + " (" + email + ")\nTopic: " + topic + "\n\n" + message
      );
      var mailtoHref = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;

      feedback.className = "form-feedback";
      feedback.hidden = false;
      feedback.innerHTML =
        "<strong>Message prepared.</strong> Because this static GitHub Pages website does not run a mail server, click below to open your email app with your message ready to send:<br><br>" +
        '<a class="btn btn-primary btn-sm" href="' +
        mailtoHref +
        '">Open Email Draft</a>';
    });
  }

  /* Initialize Everything on DOM Ready */
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initAffiliateLinks();
    initGearFinder();
    initChecklists();
    initContactForm();
  });
})();

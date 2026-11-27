/* Marketplace hub filters (marketplace/index.html). The page is complete static HTML; this script only
   filters it. State lives in the address (?job=hear&team=Product&kind=agent&group=Product) so it can be linked and
   reloaded. Filtered addresses are marked noindex. Spec: marketplace-hub-grid-SPEC.md. */
(function () {
  "use strict";
  var grid = document.getElementById("hub-grid");
  var jobsBox = document.getElementById("hub-jobs");
  var teamsBox = document.getElementById("hub-teams");
  var kindsBox = document.getElementById("hub-kinds");
  var countEl = document.getElementById("hub-count");
  var empty = document.getElementById("hub-empty");
  var divider = document.getElementById("hub-div");
  var dividerN = document.getElementById("hub-div-n");
  if (!grid || !jobsBox || !teamsBox || !kindsBox || !countEl || !empty || !divider) return;

  var cards = [].slice.call(grid.querySelectorAll(".hub-card"));
  var jobTiles = [].slice.call(jobsBox.querySelectorAll("[data-job]"));
  var teamPills = [].slice.call(teamsBox.querySelectorAll("[data-team]"));
  var kindPills = [].slice.call(kindsBox.querySelectorAll("[data-kind-filter]"));
  var groupLinks = [].slice.call(document.querySelectorAll("[data-group-link]"));
  var JOB_NAMES = {};
  jobTiles.forEach(function (b) { JOB_NAMES[b.getAttribute("data-job")] = b.textContent.trim(); });
  var TEAMS = teamPills.map(function (b) { return b.getAttribute("data-team"); });
  var GROUPS = groupLinks.map(function (a) { return a.getAttribute("data-group-link"); });

  var state = { job: "", team: "All", kind: "", group: "" };
  var q = new URLSearchParams(location.search);
  if (JOB_NAMES[q.get("job")]) state.job = q.get("job");
  if (TEAMS.indexOf(q.get("team")) > -1) state.team = q.get("team");
  if (q.get("kind") === "flow" || q.get("kind") === "agent") state.kind = q.get("kind");
  if (GROUPS.indexOf(q.get("group")) > -1) state.group = q.get("group");

  jobsBox.hidden = false;
  teamsBox.hidden = false;
  kindsBox.hidden = false;

  function matches(c) {
    if (state.group && c.getAttribute("data-group") !== state.group) return false;
    if (state.kind && c.getAttribute("data-kind") !== state.kind) return false;
    if (state.team !== "All" && c.getAttribute("data-teams").split("|").indexOf(state.team) < 0) return false;
    if (state.job && c.getAttribute("data-jobs").split(" ").indexOf(state.job) < 0) return false;
    return true;
  }

  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  function who() {
    if (state.job && state.team !== "All") return JOB_NAMES[state.job] + " for " + state.team;
    if (state.job) return JOB_NAMES[state.job];
    if (state.team !== "All") return state.team;
    if (state.kind) return state.kind === "agent" ? "agents" : "flows";
    return state.group || "this group";
  }

  function syncAddress(filtered) {
    var p = new URLSearchParams();
    if (state.job) p.set("job", state.job);
    if (state.team !== "All") p.set("team", state.team);
    if (state.kind) p.set("kind", state.kind);
    if (state.group) p.set("group", state.group);
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    var meta = document.getElementById("hub-noindex");
    if (filtered && !meta) {
      meta = document.createElement("meta");
      meta.id = "hub-noindex";
      meta.name = "robots";
      meta.content = "noindex, follow";
      document.head.appendChild(meta);
    } else if (!filtered && meta) {
      meta.remove();
    }
  }

  function render() {
    var ready = 0, soon = 0;
    cards.forEach(function (c) {
      var ok = matches(c);
      c.hidden = !ok;
      if (ok) { if (c.getAttribute("data-status") === "ready") ready++; else soon++; }
    });
    var filtered = !!(state.job || state.group || state.kind || state.team !== "All");

    divider.hidden = soon === 0;
    dividerN.textContent = soon;
    // The empty box sits above the divider when coming-soon flows follow it, else at the end of the grid.
    if (soon > 0) grid.insertBefore(empty, divider); else grid.appendChild(empty);
    if (ready + soon === 0) {
      empty.hidden = false;
      empty.innerHTML = "<b>No flows match.</b> Try another job, team or type.";
    } else if (ready === 0) {
      empty.hidden = false;
      empty.innerHTML = "<b>Nothing to install for " + who() + " yet.</b> " + plural(soon, "flow is", "flows are") +
        " coming soon below. Book a walkthrough and we will show you how it would run.";
    } else {
      empty.hidden = true;
      empty.textContent = "";
    }

    countEl.textContent = "";
    countEl.appendChild(document.createTextNode(
      (ready ? ready + " ready to install, best fit first" : "Nothing ready to install") +
      (state.group ? ", " + state.group + " group" : "")));
    if (filtered) {
      var clear = document.createElement("button");
      clear.type = "button";
      clear.className = "hub-linkbtn";
      clear.setAttribute("data-clear", "");
      clear.textContent = "Clear filters";
      countEl.appendChild(document.createTextNode(" "));
      countEl.appendChild(clear);
    }

    jobTiles.forEach(function (b) { b.setAttribute("aria-pressed", String(state.job === b.getAttribute("data-job"))); });
    teamPills.forEach(function (b) { b.setAttribute("aria-pressed", String(state.team === b.getAttribute("data-team"))); });
    kindPills.forEach(function (b) { b.setAttribute("aria-pressed", String(state.kind === b.getAttribute("data-kind-filter"))); });
    groupLinks.forEach(function (a) {
      if (state.group === a.getAttribute("data-group-link")) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    syncAddress(filtered);
  }

  jobsBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-job]");
    if (!b) return;
    var j = b.getAttribute("data-job");
    state.job = state.job === j ? "" : j;
    render();
  });
  kindsBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-kind-filter]");
    if (!b) return;
    state.kind = b.getAttribute("data-kind-filter");
    render();
  });
  teamsBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-team]");
    if (!b) return;
    state.team = b.getAttribute("data-team");
    render();
  });
  countEl.addEventListener("click", function (e) {
    if (!e.target.closest("[data-clear]")) return;
    state.job = ""; state.team = "All"; state.kind = ""; state.group = "";
    render();
    var first = teamPills[0];
    if (first) first.focus();
  });

  render();
})();

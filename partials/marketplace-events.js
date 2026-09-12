// Shared client wiring for every /marketplace/<slug>/ loop landing page.
// Fires two PostHog events and drives the email-capture form state machine
// against /api/marketplace-email-capture.
//
// Events (spec §Analytics; PostHog must never see the legacy `workflow_slug` /
// `marketplace_workflow_page_view` names):
//   marketplace_loop_page_view   { loop_slug, referrer_source }              on load
//   marketplace_email_capture    { loop_slug, referrer_source, email_domain } on submit 200
//
// PII: no raw email in event payloads — only email_domain.
//
// Contract with the page HTML:
//   <form class="waitlist" data-loop-slug="<slug>" ...>
//     <input name="email" type="email" required>
//     <input type="checkbox" name="consent" required>
//     <div class="cf-turnstile" data-sitekey="..." data-callback="onTurnstileToken"></div>
//     <button type="submit">...</button>
//     <p class="waitlist__status" role="status" aria-live="polite"></p>
//   </form>
//   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
//   <script src="/marketplace-events.js" defer></script>

(function () {
  "use strict";

  var LOOP_SLUGS = {
    "seo-publishing": 1,
    outbound: 1,
    "knowledge-wiki": 1,
    "product-discovery": 1,
  };

  function normalizeReferrer(ref) {
    if (!ref) return "direct";
    var host;
    try {
      host = new URL(ref).hostname.toLowerCase();
    } catch (e) {
      return "other";
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be") {
      return "youtube";
    }
    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
      return "linkedin";
    }
    return "other";
  }

  function loopSlugForForm(form) {
    var attr = form && form.dataset ? form.dataset.loopSlug : "";
    if (attr && LOOP_SLUGS[attr]) return attr;
    // Fallback: second path segment (e.g. /marketplace/outbound/ -> outbound).
    var parts = location.pathname.split("/").filter(Boolean);
    var candidate = parts[1] || parts[0] || "";
    return LOOP_SLUGS[candidate] ? candidate : attr || candidate;
  }

  function pageLoopSlug() {
    var form = document.querySelector("form.waitlist[data-loop-slug]");
    if (form) return loopSlugForForm(form);
    var parts = location.pathname.split("/").filter(Boolean);
    var candidate = parts[1] || parts[0] || "";
    return LOOP_SLUGS[candidate] ? candidate : candidate;
  }

  function emailDomainOf(email) {
    var at = email.lastIndexOf("@");
    return at > 0 && at < email.length - 1 ? email.slice(at + 1).toLowerCase() : "";
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function firePageView() {
    if (typeof window.posthog === "undefined" || !window.posthog.capture) return;
    var loop_slug = pageLoopSlug();
    if (!loop_slug) return;
    window.posthog.capture("marketplace_loop_page_view", {
      loop_slug: loop_slug,
      referrer_source: normalizeReferrer(document.referrer),
    });
  }

  function statusEl(form) {
    return form.querySelector(".waitlist__status");
  }

  function setStatus(form, text, tone) {
    var s = statusEl(form);
    if (!s) return;
    s.textContent = text;
    s.dataset.tone = tone || "";
  }

  function errorCopy(code) {
    switch (code) {
      case "invalid_email":
        return "Please enter a valid work email address.";
      case "consent_required":
        return "Please tick the consent box before submitting.";
      case "turnstile_failed":
        return "Human check didn't pass — please try the challenge again.";
      case "dedupe":
        return "You're already on the list. We'll email you when the video is live.";
      case "delivery_failed":
        return "We couldn't send the confirmation email — try again in a minute or email ai@maskin.io.";
      default:
        return "Something went wrong — please email ai@maskin.io directly.";
    }
  }

  function turnstileTokenFrom(form) {
    var hidden = form.querySelector('input[name="cf-turnstile-response"]');
    if (hidden && hidden.value) return hidden.value;
    var explicit = form.querySelector('input[name="turnstile_token"]');
    return explicit && explicit.value ? explicit.value : "";
  }

  function wireForm(form) {
    if (form._marketplaceWired) return;
    form._marketplaceWired = true;

    var input = form.querySelector('input[name="email"]');
    var consent = form.querySelector('input[name="consent"]');
    var submit = form.querySelector('button[type="submit"]');

    if (input) {
      input.addEventListener("input", function () {
        var v = (input.value || "").trim();
        if (!v) {
          setStatus(form, "", "");
        } else if (!EMAIL_RE.test(v)) {
          setStatus(form, "That doesn't look like a valid email.", "typing");
        } else {
          setStatus(form, "", "");
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = ((input && input.value) || "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        setStatus(form, errorCopy("invalid_email"), "error");
        if (input) input.focus();
        return;
      }
      if (consent && !consent.checked) {
        setStatus(form, errorCopy("consent_required"), "error");
        consent.focus();
        return;
      }
      var loop_slug = loopSlugForForm(form);
      var turnstile_token = turnstileTokenFrom(form);

      setStatus(form, "Adding you to the list\u2026", "submitting");
      if (submit) submit.disabled = true;

      fetch("/api/marketplace-email-capture", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email,
          loop_slug: loop_slug,
          consent: true,
          turnstile_token: turnstile_token,
        }),
      })
        .then(function (r) {
          return r.json().then(function (data) {
            return { ok: r.ok, status: r.status, data: data || {} };
          });
        })
        .then(function (res) {
          if (submit) submit.disabled = false;
          if (res.ok && res.data.ok) {
            if (res.data.dedupe) {
              setStatus(form, errorCopy("dedupe"), "success");
            } else {
              setStatus(
                form,
                "You're on the list. We'll email you when the video is live.",
                "success",
              );
            }
            if (input) input.value = "";
            if (window.posthog && window.posthog.capture) {
              window.posthog.capture("marketplace_email_capture", {
                loop_slug: loop_slug,
                referrer_source: normalizeReferrer(document.referrer),
                email_domain: emailDomainOf(email),
              });
            }
            if (window.turnstile && window.turnstile.reset) {
              try {
                window.turnstile.reset();
              } catch (_) {
                /* noop */
              }
            }
          } else {
            var code =
              (res.data && res.data.error) ||
              (res.status === 502 ? "delivery_failed" : "unknown");
            setStatus(form, errorCopy(code), "error");
          }
        })
        .catch(function () {
          if (submit) submit.disabled = false;
          setStatus(
            form,
            "Network error — please email ai@maskin.io directly.",
            "error",
          );
        });
    });
  }

  function init() {
    firePageView();
    var forms = document.querySelectorAll("form.waitlist");
    for (var i = 0; i < forms.length; i++) wireForm(forms[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

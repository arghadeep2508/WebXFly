/* WebXFly — builds the email address in the browser, so bots that
   scrape raw HTML never see it. Markup: data-mail="domain|name" */
(function () {
  document.querySelectorAll('[data-mail]').forEach(function (el) {
    var addr = el.getAttribute('data-mail').split('|').reverse().join('@');
    var subject = el.getAttribute('data-subject');
    if (el.tagName === 'A') el.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    var out = el.querySelector('[data-mail-text]');
    if (out) out.textContent = addr;
  });
})();

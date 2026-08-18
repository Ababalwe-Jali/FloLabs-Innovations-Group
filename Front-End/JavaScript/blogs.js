(function () {
  'use strict';

  var chips = document.querySelectorAll('.filter-chip');
  var cards = document.querySelectorAll('.journal-card');
  var emptyMsg = document.querySelector('.journal__empty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var filter = chip.getAttribute('data-filter');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (emptyMsg) emptyMsg.hidden = visibleCount !== 0;
    });
  });

  /* Notify form — front-end only. TODO: wire to a real email/newsletter endpoint. */
  var form = document.getElementById('notify-form');
  var confirm = document.getElementById('notify-confirm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('notify-email');
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }
      form.hidden = true;
      if (confirm) confirm.hidden = false;
    });
  }
})();
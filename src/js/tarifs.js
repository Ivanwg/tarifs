import tippy from 'tippy.js';
import interval from './utils/interval';
import { formatSeconds } from './utils/time';


export default function tarifsProcess() {
  const tCards = document.querySelectorAll('.js-card');
  tCards.forEach(card => {
    const title = card.querySelector('.js-card-title');
    const selBtns = card.querySelectorAll('.js-select-btn');
    selBtns.forEach(btn => {
      btn.onclick = e => {
        console.log(`${title && title.textContent.trim() ? title.textContent.trim() : 'Нет информации'}`)
      }
    });


    const timer = card.querySelector('.js-card-timer');
    if (timer && timer.textContent) {
      const timeArr = timer.textContent.split(':');
      if (timeArr.length === 3) {
        let timeoutId;
        let secsLeft = Number(timeArr[2]) + (Number(timeArr[1]) * 60) + Number(timeArr[0]) * 60 * 60;
        clearTimeout(timeoutId);
        timeoutId = interval(() => {
          secsLeft -= 1;
          timer.textContent = formatSeconds(secsLeft);
          if (secsLeft <= 0) {
            selBtns.forEach(btn => {
              btn.setAttribute('disabled', true);
              btn.onclick = null;
            });
          }
          return secsLeft;
        }, 1000);

      }




    }


  });
  const tippiesBtns = document.querySelectorAll('.js-tippy-btn');
  tippiesBtns.forEach(btn => {
    const targetSelector = btn.getAttribute('aria-describedby');
    if (targetSelector) {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl && targetEl.textContent) {
        tippy(btn, {
          content: targetEl.textContent,
          placement: 'bottom-end',
        });
      }
    }
  });
}

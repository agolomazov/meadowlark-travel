
Feature('Cross page');

Scenario('Получение реферера', (I) => {
  I.amOnPage('/tours/hood-river');
  I.see('Тур по реке Худ');
  I.click('Запрос цены для групп', { css: 'a.requestGroupRate' });
  I.amOnPage('/tours/request-group-rate');
});

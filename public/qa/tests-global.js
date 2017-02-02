suite('Global Tests', function () {
  test('У данной страницы допустимый заголовок', function () {
    assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
  });

  test('Есть ли заголовок на странице', function () {
    assert(document.getElementsByTagName('h1').length);
  });
});
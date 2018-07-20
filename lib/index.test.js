const dif = require('./index')

test('returns only changed rules', () => {
  const response = dif(
    '.blue { transform: rotateZ(180deg); color: blue }',
    '.blue { transform: rotateZ(180deg); color: red }'
  )
  expect(response).toBe(`.blue {\n  color: red;\n}`)
})

test('returns unset for missing rules', () => {
  const response = dif(
    '.blue { transform: rotateZ(180deg); color: blue }',
    '.orange { color: red;}'
  )
  expect(response).toBe(
    `.orange {\n  color: red;\n}\n\n.blue {\n  transform: unset;\n  color: unset;\n}`
  )
})

test('returns unset for missing properties', () => {
  const response = dif(
    '.missing-prop { opacity: 1 }',
    '.missing-prop { color: red; }'
  )
  expect(response).toBe(`.missing-prop {\n  color: red;\n  opacity: unset;\n}`)
})

test('supports empty strings', () => {
  const response = dif('', '')
  expect(response).toBe('')
})

test('supports dashes in classnames', () => {
  const response = dif(
    '.db-World-scrollWrapper { opacity: 1 }',
    '.db-World-scrollWrapper { opacity: 0 }'
  )
  expect(response).toBe(`.db-World-scrollWrapper {\n  opacity: 0;\n}`)
})

test('supports compound selectors', () => {
  const response = dif(
    '.db_SearchResults_item.db_SearchResults_link__hasShortcuts.db_is_selected_after { display: none }',
    '.db_SearchResults_item.db_SearchResults_link__hasShortcuts.db_is_selected_after { display: block }'
  )
  expect(response).toBe(
    `.db_SearchResults_item.db_SearchResults_link__hasShortcuts.db_is_selected_after {\n  display: block;\n}`
  )
})

test('supports *', () => {
  const response = dif(`* {top: 7px;}`, `* {top: 5px; color: orange;}`)
  expect(response).toBe(`* {\n  top: 5px;\n  color: orange;\n}`)
})

test('supports psuedo classes', () => {
  const response = dif(
    `a:visited { color: black; }`,
    `a:visited { color: orange; text-decoration: none; }`
  )
  expect(response).toBe(
    `a:visited {\n  color: orange;\n  text-decoration: none;\n}`
  )
})

test('supports psuedo elements', () => {
  const response = dif(
    'p::first-line { opacity: 0 }',
    'p::first-line { opacity: 1}'
  )
  expect(response).toBe(`p::first-line {\n  opacity: 1;\n}`)
})

test('supports adjacent siblings', () => {
  const response = dif(
    'p + h2 { display: block }',
    'p + h2 { display: inline }'
  )
  expect(response).toBe(`p + h2 {\n  display: inline;\n}`)
})

test('supports general siblings', () => {
  const response = dif('p - span { left: 2 }', 'p - span { left: 3 }')
  expect(response).toBe(`p - span {\n  left: 3;\n}`)
})

test('supports child combinator', () => {
  const response = dif(
    'ul > li { color: burgundy }',
    'ul > li { color: yellow }'
  )
  expect(response).toBe(`ul > li {\n  color: yellow;\n}`)
})

test('supports descendant combinator', () => {
  const response = dif(
    'div span { font-size: 100 }',
    'div span { font-size: 2 }'
  )
  expect(response).toBe(`div span {\n  font-size: 2;\n}`)
})

test('supports type selector', () => {
  const response = dif(
    'button { background: violet }',
    'button { background: orange }'
  )
  expect(response).toBe(`button {\n  background: orange;\n}`)
})

test('supports id selector', () => {
  const response = dif(
    '#login { font-family: Verdana }',
    '#login { font-family: Helvetica }'
  )
  expect(response).toBe(`#login {\n  font-family: Helvetica;\n}`)
})

test('supports attribute selector', () => {
  const response = dif(undefined, '[autoplay] { display: none; }')
  expect(response).toBe(`[autoplay] {\n  display: none;\n}`)
})

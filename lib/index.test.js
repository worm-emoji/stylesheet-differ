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

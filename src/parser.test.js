import { QAString } from './parser'

test('unify line feed code and ignore comment lines', () => {
  expect((new QAString('a:=b\r\n# c:=d\r\n\r\ne:=f')).format().toString())
    .toBe('a:=b\ne:=f')
})

test('q1 in example', () => {
  const { meta: _, ...items } = (new QAString('q1:=a1')).format().items[0]
  expect(items).toEqual({
    content: {
      answers: ['a1'],
      question: 'q1',
      type: 'exact-match'
    },
    type: 'qa'
  })
})

test('q2 in example', () => {
  const { meta: _, ...items } = (new QAString('q2:=a1:=a2')).format().items[0]
  expect(items).toEqual({
    content: {
      answers: ['a1', 'a2'],
      question: 'q2',
      type: 'exact-match'
    },
    type: 'qa'
  })
})

test('q3 in example', () => {
  const { meta: _, ...items } = (new QAString('q3:-a1:-a2:-a3:=1')).format().items[0]
  expect(items).toEqual({
    content: {
      answers: ['1'],
      question: 'q3',
      selections: ['a1', 'a2', 'a3'],
      type: 'exact-match-selection'
    },
    type: 'qa'
  })
})

test('q4 in example', () => {
  const { meta: _, ...items } = (new QAString('q4:-a1:-a2:-a3:=1:=2')).format().items[0]
  expect(items).toEqual({
    content: {
      answers: ['1', '2'],
      question: 'q4',
      selections: ['a1', 'a2', 'a3'],
      type: 'exact-match-selection'
    },
    type: 'qa'
  })
})

test('escape for qa', () => {
  expect(QAString.escape('a:-b').toString()).toBe('a[:__colon_hyphen__:]b')
})

test('unescape for qa', () => {
  expect(QAString.unescape('[:__colon_equal__:]').toString()).toBe(':=')
  expect(QAString.unescape('[:__colon_hyphen__:]').toString()).toBe(':-')
  expect(QAString.unescape('[:__colon_plus__:]').toString()).toBe(':+')
  expect(QAString.unescape('[:__empty__:]').toString()).toBe('')
  expect(QAString.unescape('[:__new_line__:]').toString()).toBe('\n')
})

test('unescape for katex', () => {
  expect(QAString.unescapeForKatex('[:__dollar__:]').toString()).toBe('$')
})

test('unescape for qas', () => {
  expect(QAString.unescapeItems([
    {
      content: {
        answers: ['a[:__colon_hyphen__:]b'],
        question: 'c[:__colon_hyphen__:]d',
        type: 'exact-match'
      },
      type: 'qa'
    },
    {
      content: {
        answers: ['1'],
        question: 'e[:__colon_hyphen__:]f',
        selections: ['g[:__colon_hyphen__:]h', 'i[:__colon_hyphen__:]j'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])).toEqual([
    {
      content: {
        answers: ['a:-b'],
        question: 'c:-d',
        type: 'exact-match'
      },
      type: 'qa'
    },
    {
      content: {
        answers: ['1'],
        question: 'e:-f',
        selections: ['g:-h', 'i:-j'],
        type: 'exact-match-selection'
      },
      type: 'qa'
    }
  ])
})

test('allow line breaks inside lines', () => {
  expect(
    (new QAString('text:+un &\ndeux &\ntrois')).format().items[0].content
  ).toBe('un deux trois')
})

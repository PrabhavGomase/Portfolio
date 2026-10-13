/* Small, bounded compiler for the portfolio's browser demo. */
(function (scope) {
  'use strict';
  function compile(expression) {
    if (!expression.length) throw new Error('Enter a regular expression.');
    if (Array.from(expression).length > 64) throw new Error('Use 64 characters or fewer in this preview.');
    const characters = Array.from(expression), tokens = [];
    for (let i = 0; i < characters.length; i++) {
      const value = characters[i];
      if (value === '\\') {
        if (++i === characters.length) throw new Error('An escape needs a character after it.');
        tokens.push({ type: 'literal', value: characters[i], label: '\\' + characters[i] });
      } else if ('|()*+?'.includes(value)) tokens.push({ type: value, label: value });
      else {
        if ('.[]{}^$'.includes(value)) throw new Error('Use literals, |, *, +, ?, and groups. Escape special characters to use them as literals.');
        tokens.push({ type: 'literal', value, label: value === ' ' ? '␠' : value });
      }
    }
    let cursor = 0;
    const current = () => tokens[cursor]?.type;
    function parseUnion() {
      let node = parseConcat();
      while (current() === '|') { cursor++; node = { type: 'union', left: node, right: parseConcat() }; }
      return node;
    }
    function parseConcat() {
      const nodes = [];
      while (cursor < tokens.length && current() !== ')' && current() !== '|') nodes.push(parseRepeat());
      if (!nodes.length) throw new Error('Each group and each side of | needs an expression.');
      return nodes.reduce((left, right) => ({ type: 'concat', left, right }));
    }
    function parseRepeat() {
      let node;
      if (current() === 'literal') node = { type: 'literal', value: tokens[cursor++].value };
      else if (current() === '(') {
        cursor++; node = parseUnion();
        if (current() !== ')') throw new Error('A group is missing its closing parenthesis.');
        cursor++;
      } else throw new Error('A repetition operator needs a character or group before it.');
      if (['*', '+', '?'].includes(current())) {
        node = { type: tokens[cursor++].type, child: node };
        if (['*', '+', '?'].includes(current())) throw new Error('Use one repetition operator per character or group.');
      }
      return node;
    }
    const ast = parseUnion();
    if (cursor < tokens.length) throw new Error('There is an unexpected closing parenthesis.');
    const nfa = [];
    function state() { nfa.push(new Map()); return nfa.length - 1; }
    function edge(from, symbol, to) { if (!nfa[from].has(symbol)) nfa[from].set(symbol, []); nfa[from].get(symbol).push(to); }
    function construct(node) {
      if (node.type === 'literal') { const start = state(), end = state(); edge(start, node.value, end); return { start, end }; }
      if (node.type === 'concat') { const first = construct(node.left), second = construct(node.right); edge(first.end, null, second.start); return { start: first.start, end: second.end }; }
      const start = state(), end = state();
      if (node.type === 'union') { const first = construct(node.left), second = construct(node.right); edge(start, null, first.start); edge(start, null, second.start); edge(first.end, null, end); edge(second.end, null, end); }
      else {
        const child = construct(node.child); edge(start, null, child.start); edge(child.end, null, end);
        if (node.type === '*' || node.type === '?') edge(start, null, end);
        if (node.type === '*' || node.type === '+') edge(child.end, null, child.start);
      }
      return { start, end };
    }
    const fragment = construct(ast);
    const alphabet = [...new Set(tokens.filter(token => token.type === 'literal').map(token => token.value))].sort();
    function closure(seed) {
      const found = new Set(seed), stack = [...seed];
      while (stack.length) for (const next of nfa[stack.pop()].get(null) || []) if (!found.has(next)) { found.add(next); stack.push(next); }
      return [...found].sort((a, b) => a - b);
    }
    const dfa = [], seen = new Map();
    function addSubset(subset) {
      const key = subset.join(',');
      if (seen.has(key)) return seen.get(key);
      if (dfa.length >= 64) throw new Error('This expression creates too many states for the compact preview. Try a simpler expression.');
      const id = dfa.length; seen.set(key, id);
      dfa.push({ subset, accept: subset.includes(fragment.end), transitions: {} }); return id;
    }
    addSubset(closure([fragment.start]));
    for (let i = 0; i < dfa.length; i++) for (const symbol of alphabet) {
      const moved = dfa[i].subset.flatMap(id => nfa[id].get(symbol) || []);
      dfa[i].transitions[symbol] = addSubset(closure(moved));
    }
    let groups = [dfa.map((s, i) => s.accept ? i : -1).filter(i => i >= 0), dfa.map((s, i) => !s.accept ? i : -1).filter(i => i >= 0)].filter(group => group.length);
    while (true) {
      const membership = new Map(groups.flatMap((group, i) => group.map(id => [id, i])));
      const nextGroups = groups.flatMap(group => {
        const buckets = new Map();
        for (const id of group) { const signature = alphabet.map(symbol => membership.get(dfa[id].transitions[symbol])).join(','); if (!buckets.has(signature)) buckets.set(signature, []); buckets.get(signature).push(id); }
        return [...buckets.values()];
      });
      if (nextGroups.length === groups.length) break;
      groups = nextGroups;
    }
    const startGroup = groups.findIndex(group => group.includes(0));
    [groups[0], groups[startGroup]] = [groups[startGroup], groups[0]];
    const membership = new Map(groups.flatMap((group, i) => group.map(id => [id, i])));
    const rawStates = groups.map((group, id) => ({ id, accept: dfa[group[0]].accept, transitions: Object.fromEntries(alphabet.map(symbol => [symbol, membership.get(dfa[group[0]].transitions[symbol])])) }));
    const order = [0], renamed = new Map([[0, 0]]);
    for (let i = 0; i < order.length; i++) for (const symbol of alphabet) {
      const next = rawStates[order[i]].transitions[symbol];
      if (!renamed.has(next)) { renamed.set(next, order.length); order.push(next); }
    }
    const states = order.map((old, id) => ({ id, accept: rawStates[old].accept, transitions: Object.fromEntries(alphabet.map(symbol => [symbol, renamed.get(rawStates[old].transitions[symbol])])) }));
    return { expression, tokens, alphabet, nfaCount: nfa.length, dfaCount: dfa.length, states, start: 0 };
  }
  function trace(machine, text) {
    let state = machine.start;
    const steps = [{ state, character: null, from: null }];
    for (const character of Array.from(text)) {
      const from = state;
      state = state === null ? null : machine.states[state].transitions[character] ?? null;
      steps.push({ state, character, from });
    }
    return { steps, accepted: state !== null && machine.states[state].accept };
  }
  const api = Object.freeze({ compile, trace, matches: (machine, text) => trace(machine, text).accepted });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.RegexLabEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);

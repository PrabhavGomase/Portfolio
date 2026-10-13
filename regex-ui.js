(function () {
  'use strict';
  const card = document.querySelector('.regex-interactive');
  if (!card || !window.RegexLabEngine) return;
  const find = selector => card.querySelector(selector);
  const engine = window.RegexLabEngine;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  let machine = null, view = 'diagram', timer = null, running = false;
  const examples = { suffix: ['(a|b)*abb', 'aabb'], letters: ['(a|b)+', 'abba'], optional: ['ab?c', 'ac'], repeat: ['(ab)*', 'abab'] };
  function stop() { clearTimeout(timer); timer = null; running = false; find('#regex-test-button').innerHTML = 'Run test <span>▶</span>'; }
  function result(label, tone) { const element = find('#regex-match-result'); element.textContent = label; element.className = 'regex-match-result' + (tone ? ` ${tone}` : ''); }
  function draw(active = 0, transition = null) {
    const count = machine.states.length, width = Math.max(350, count * 67 + 25), height = 124;
    const positions = machine.states.map((_, i) => ({ x: count === 1 ? width / 2 : 33 + i * (width - 64) / (count - 1), y: 61 }));
    const edges = new Map();
    machine.states.forEach(state => machine.alphabet.forEach(symbol => { const to = state.transitions[symbol], key = `${state.id}:${to}`; if (!edges.has(key)) edges.set(key, { from: state.id, to, symbols: [] }); edges.get(key).symbols.push(symbol); }));
    const paths = [...edges.values()].map(edge => {
      const first = positions[edge.from], second = positions[edge.to];
      const highlighted = transition && edge.from === transition.from && edge.to === transition.state && edge.symbols.includes(transition.character);
      let d, labelX, labelY;
      if (edge.from === edge.to) { d = `M${first.x - 8} ${first.y - 14}C${first.x - 33} 1 ${first.x + 33} 1 ${first.x + 8} ${first.y - 15}`; labelX = first.x; labelY = 14; }
      else if (edge.to === edge.from + 1) { d = `M${first.x + 17} ${first.y}L${second.x - 21} ${second.y}`; labelX = (first.x + second.x) / 2; labelY = first.y - 7; }
      else {
        const backwards = edge.to < edge.from, bend = backwards ? 109 : 20;
        const side = backwards ? 11 : -11;
        d = `M${first.x + (backwards ? -8 : 8)} ${first.y + side}Q${(first.x + second.x) / 2} ${bend + (backwards ? 20 : -16)} ${second.x + (backwards ? 8 : -8)} ${second.y + side}`;
        labelX = (first.x + second.x) / 2; labelY = backwards ? 99 + Math.min(12, Math.abs(edge.to - edge.from) * 3) : 27;
      }
      const label = edge.symbols.map(symbol => symbol === ' ' ? '␠' : symbol).join(',');
      return `<g class="regex-edge ${highlighted ? 'is-active' : ''}"><path d="${d}" marker-end="url(#regex-arrow${highlighted ? '-active' : ''})"/><text x="${labelX}" y="${labelY}">${esc(label)}</text></g>`;
    }).join('');
    const nodes = machine.states.map((state, i) => `<g class="regex-node ${state.accept ? 'accepting' : ''} ${i === active ? 'is-active' : ''}" transform="translate(${positions[i].x} ${positions[i].y})"><circle r="17"/>${state.accept ? '<circle class="regex-accept-ring" r="13"/>' : ''}<text y="4">q${i}</text><title>State q${i}${state.accept ? ', accepting' : ''}</title></g>`).join('');
    return `<svg class="regex-live-diagram" viewBox="0 0 ${width} ${height}" style="min-width:${Math.min(840, Math.max(0, count - 5) * 63)}px" role="img" aria-label="Minimized DFA with ${count} states. ${active === null ? 'No transition for this character.' : `Current state q${active}.`} Double circles indicate accepting states."><defs><marker id="regex-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6"/></marker><marker id="regex-arrow-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6"/></marker></defs><path class="regex-start-arrow" d="M${positions[0].x - 30} 61H${positions[0].x - 21}" marker-end="url(#regex-arrow)"/>${paths}${nodes}</svg>`;
  }
  function render(active = 0, transition = null) {
    if (!machine) { find('#regex-output-panel').innerHTML = '<div class="regex-panel-placeholder">Compile an expression to explore its states.</div>'; return; }
    if (view === 'diagram') find('#regex-output-panel').innerHTML = draw(active, transition);
    else find('#regex-output-panel').innerHTML = `<div class="regex-token-grid">${machine.tokens.map((token, i) => `<span><b>${esc(token.label)}</b><small>${esc(token.type === 'literal' ? 'literal' : ({ '|': 'union', '(': 'group', ')': 'group', '*': 'repeat', '+': 'repeat', '?': 'optional' })[token.type])}</small><i>${i + 1}</i></span>`).join('')}</div>`;
  }
  function compile() {
    stop(); result('Ready'); find('#regex-status').classList.remove('error');
    try {
      machine = engine.compile(find('#regex-input').value);
      find('#regex-input').removeAttribute('aria-invalid');
      find('#regex-nfa-count').textContent = machine.nfaCount; find('#regex-dfa-count').textContent = machine.dfaCount; find('#regex-min-count').textContent = machine.states.length;
      find('.regex-compile-state').textContent = 'MINIMIZED DFA'; find('#regex-test-button').disabled = false;
      find('#regex-status').textContent = `${machine.nfaCount} NFA → ${machine.dfaCount} DFA → ${machine.states.length} minimized states. Try a string below.`;
    } catch (error) {
      machine = null; find('#regex-input').setAttribute('aria-invalid', 'true'); find('#regex-test-button').disabled = true;
      ['#regex-nfa-count', '#regex-dfa-count', '#regex-min-count'].forEach(selector => find(selector).textContent = '—');
      find('.regex-compile-state').textContent = 'CHECK EXPRESSION'; find('#regex-status').textContent = error.message; find('#regex-status').classList.add('error'); result('Needs compile');
    }
    render();
  }
  find('#regex-compile-form').addEventListener('submit', event => { event.preventDefault(); compile(); });
  find('#regex-input').addEventListener('input', () => { stop(); machine = null; ['#regex-nfa-count', '#regex-dfa-count', '#regex-min-count'].forEach(selector => find(selector).textContent = '—'); find('#regex-test-button').disabled = true; find('#regex-input').removeAttribute('aria-invalid'); find('#regex-status').classList.remove('error'); find('#regex-status').textContent = 'Expression changed. Compile to update the diagram.'; find('.regex-compile-state').textContent = 'NEEDS COMPILE'; result('Needs compile'); render(); });
  find('#regex-example').addEventListener('change', () => { const example = examples[find('#regex-example').value]; if (!example) return; find('#regex-input').value = example[0]; find('#regex-test-input').value = example[1]; compile(); find('#regex-example').value = ''; });
  find('#regex-test-input').addEventListener('input', () => { stop(); result(machine ? 'Ready' : 'Needs compile'); if (machine) { render(); find('#regex-status').textContent = 'String changed. Run the test to trace its path.'; } });
  card.querySelectorAll('[data-regex-view]').forEach(button => {
    const selectView = () => { view = button.dataset.regexView; card.querySelectorAll('[data-regex-view]').forEach(tab => { tab.classList.toggle('selected', tab === button); tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; }); find('#regex-output-panel').setAttribute('aria-labelledby', button.id); render(); };
    button.addEventListener('click', selectView);
    button.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = card.querySelector(`[data-regex-view="${event.key === 'Home' ? 'diagram' : event.key === 'End' ? 'tokens' : view === 'diagram' ? 'tokens' : 'diagram'}"]`); next.click(); next.focus(); } });
  });
  find('#regex-test-form').addEventListener('submit', event => {
    event.preventDefault();
    if (running) { stop(); result('Stopped'); find('#regex-status').textContent = 'Trace stopped. Run the test to start again.'; return; }
    if (!machine) return;
    const text = find('#regex-test-input').value, outcome = engine.trace(machine, text), characters = Array.from(text);
    let index = 0; running = true; result('Tracing…'); find('#regex-test-button').innerHTML = 'Stop <span>■</span>';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350;
    function step() {
      const current = outcome.steps[index]; render(current.state, current);
      find('#regex-status').textContent = index ? `Read ${current.character === ' ' ? '␠' : current.character} · ${current.state === null ? 'no transition' : `q${current.from} → q${current.state}`} · ${index}/${characters.length}` : 'Starting at q0.';
      if (index === outcome.steps.length - 1) { stop(); result(outcome.accepted ? 'Accepted ✓' : 'Rejected ×', outcome.accepted ? 'accepted' : 'rejected'); find('#regex-status').textContent = `${text.length ? 'The string' : 'The empty string'} ${outcome.accepted ? 'matches' : 'does not match'} the compiled expression.`; return; }
      index++; timer = setTimeout(step, delay);
    }
    step();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) { stop(); result('Stopped'); find('#regex-status').textContent = 'Trace paused while you’re away. Run it again when ready.'; } });
  compile();
})();

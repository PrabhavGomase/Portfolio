'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let toastTimer;
function toast(message) { $('.toast').textContent = message; $('.toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('.toast').classList.remove('visible'), 3500); }
function updateThemeButton() { const light = root.dataset.theme === 'light'; $('.theme-toggle').setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`); $('meta[name="theme-color"]').content = light ? '#f4f3eb' : '#151715'; }
function toggleTheme() { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('pg-theme', root.dataset.theme); } catch {} updateThemeButton(); }
$('.theme-toggle').addEventListener('click', toggleTheme); updateThemeButton();
$('#year').textContent = new Date().getFullYear();

const mobileNav = $('.mobile-nav');
function closeMobileNav() { mobileNav.hidden = true; $('.mobile-toggle').setAttribute('aria-expanded', 'false'); $('.mobile-toggle').setAttribute('aria-label', 'Open navigation'); }
$('.mobile-toggle').addEventListener('click', () => { mobileNav.hidden = !mobileNav.hidden; $('.mobile-toggle').setAttribute('aria-expanded', String(!mobileNav.hidden)); $('.mobile-toggle').setAttribute('aria-label', mobileNav.hidden ? 'Open navigation' : 'Close navigation'); });
$$('.mobile-nav a').forEach(a => a.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });
window.matchMedia('(min-width: 651px)').addEventListener('change', e => { if (e.matches) closeMobileNav(); });

if ('IntersectionObserver' in window) {
  root.classList.add('js-ready');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: 0.05 });
  $$('.reveal').forEach(el => reveal.observe(el));
  const navigation = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) $$('.desktop-nav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); }), { rootMargin: '-20% 0px -55% 0px' });
  $$('main > section[id]').forEach(section => navigation.observe(section));
}
let scrollPending = false;
function updateScroll() { const max = document.documentElement.scrollHeight - innerHeight; $('.read-progress').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; scrollPending = false; }
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true }); updateScroll();

$$('.filter').forEach(filter => filter.addEventListener('click', () => {
  $$('.filter').forEach(button => { button.classList.toggle('active', button === filter); button.setAttribute('aria-pressed', String(button === filter)); });
  let count = 0;
  $$('.project-card').forEach(card => { const visible = filter.dataset.filter === 'all' || card.dataset.category.split(' ').includes(filter.dataset.filter); card.hidden = !visible; if (visible) { count++; card.classList.add('visible'); } });
  $('.filter-status').textContent = `Showing ${count} ${filter.dataset.filter === 'all' ? '' : filter.textContent.trim() + ' '}projects.`;
}));

const projects = {
  campus: {
    title: 'Campus Repair Café & Spare Parts Management System', eyebrow: '01 / FULL-STACK APPLICATION',
    summary: 'A campus repair café in one connected workspace. Students request repairs, volunteers pick them up, and coordinators manage sessions and spare-part stock.',
    tags: ['Python', 'Django', 'PostgreSQL', 'HTML/CSS', 'Docker', 'GitHub Actions'], heading: 'What it brings together',
    points: ['Repair requests, volunteer assignments, repair sessions, spare-part donations, inventory, and feedback.', 'A relational database with 10 application models, foreign keys, constraints, and indexes, plus a PostgreSQL view, trigger, and stored procedure.', 'Separate access levels for requesters, volunteers, and coordinators. Transaction-safe workflows keep inventory updates consistent.', 'Search, filtering, pagination, dashboards, and reports, with automated tests and a GitHub Actions CI pipeline.'],
    note: 'The portfolio illustration is a visual concept, not a screenshot of the deployed application. The repository is the source for implementation details.',
    repository: 'https://github.com/PrabhavGomase/campus-repair-cafe'
  },
  regex: {
    title: 'RegexLab: Regex-to-DFA Compiler', eyebrow: '02 / COMPLETED',
    summary: 'A C++ compiler that transforms regular expressions into minimized deterministic finite automata through a complete lexer-to-minimizer pipeline.',
    tags: ['C++', 'Compiler design', 'Automata theory', 'Algorithms'], heading: 'What it does',
    points: ['Tokenizes expressions, parses them with recursive descent, and builds an abstract syntax tree.', 'Constructs a Thompson ε-NFA, then derives a DFA using ε-closure and subset construction.', 'Minimizes the DFA and prints the tokens, AST, ε-NFA, DFA, and minimized DFA for inspection.', 'Supports literals, concatenation, union, Kleene star, plus, optional, grouping, and escaped characters.'],
    note: 'This portfolio preview compiles expressions locally in your browser. The linked repository contains the C++ implementation.',
    repository: 'https://github.com/PrabhavGomase/regex-to-dfa-compiler'
  },
  weather: {
    title: 'Weather Dashboard', eyebrow: '03 / API-POWERED WEB APP',
    summary: 'Enter a city and get its current weather. A straightforward interface connected to real-time conditions through the OpenWeather API.',
    tags: ['JavaScript', 'HTML/CSS', 'OpenWeather API'], heading: 'How it works',
    points: ['Asynchronous JavaScript Fetch calls retrieve real-time data from OpenWeather.', 'Displays temperature, humidity, and wind speed for the city entered.'],
    repository: 'https://github.com/PrabhavGomase/Web-Dev-Projects', note: 'Source link opens the shared Web Dev Projects repository. A live application link has not been provided.'
  },
  tasks: {
    title: 'Task Manager Web App', eyebrow: '04 / EVERYDAY PRODUCTIVITY',
    summary: 'A simple to-do app for adding, deleting, and completing tasks, with a responsive layout for phones and desktops.',
    tags: ['JavaScript', 'HTML/CSS', 'LocalStorage'], heading: 'Core features',
    points: ['Add and delete tasks, and mark them complete.', 'Filter tasks by All, Pending, or Completed.', 'LocalStorage keeps tasks available after refreshing or closing the tab.', 'A responsive layout supports mobile and desktop screens.'],
    repository: 'https://github.com/PrabhavGomase/Web-Dev-Projects', note: 'Source link opens the shared Web Dev Projects repository. A live application link has not been provided.'
  },
  sorting: {
    title: 'Sorting Algorithm Visualizer', eyebrow: '05 / INTERACTIVE ALGORITHMS',
    summary: 'An interactive tool that makes sorting algorithms visible with animated bars and adjustable controls.',
    tags: ['JavaScript', 'HTML/CSS', 'Algorithms'], heading: 'Explore the process',
    points: ['Visualizes Bubble, Selection, Insertion, Merge, and Quick Sort.', 'Adjustable array size and animation speed make it easier to watch each algorithm work.', 'The portfolio includes a new sorting playground inspired by this project, with live comparison and write counts.'],
    repository: 'https://github.com/PrabhavGomase/Web-Dev-Projects', playground: true
  }
};
function escapeHTML(value) { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
const projectDialog = $('#project-dialog');
function openProject(key) {
  const project = projects[key]; if (!project) return;
  $('#project-dialog-content').innerHTML = `<p class="detail-eyebrow">${project.eyebrow}</p><h2 id="dialog-title">${escapeHTML(project.title)}</h2><p class="detail-summary">${escapeHTML(project.summary)}</p><div class="tags">${project.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div><h3>${project.heading}</h3><ul>${project.points.map(point => `<li>${escapeHTML(point)}</li>`).join('')}</ul>${project.note ? `<p class="detail-note">${escapeHTML(project.note)}</p>` : ''}<div class="detail-actions">${project.repository ? `<a class="button primary" href="${project.repository}" target="_blank" rel="noopener noreferrer">View source on GitHub <span>↗</span></a>` : ''}${project.playground ? '<button class="button secondary" id="open-playground">Try the playground ↗</button>' : ''}</div>`;
  projectDialog.showModal();
  if (project.playground) $('#open-playground').addEventListener('click', () => { projectDialog.close(); $('#playground').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' }); $('#algorithm').focus({ preventScroll: true }); });
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
$('.dialog-close').addEventListener('click', () => projectDialog.close());
[projectDialog, $('#command-dialog')].forEach(dialog => dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }));

async function copyEmail() {
  const address = 'prabhavtg@gmail.com';
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(address); } else { const input = document.createElement('textarea'); input.value = address; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select(); const copied = document.execCommand('copy'); input.remove(); if (!copied) throw new Error('Copy unavailable'); } toast('Email copied. Let’s make something useful.'); }
  catch { toast('Copy unavailable here. Select prabhavtg@gmail.com to copy it.'); }
}
$('.copy-email').addEventListener('click', copyEmail);

const commands = [
  { name: 'Selected work', description: 'Explore all five projects', action: () => navigateTo('work') },
  { name: 'About Prabhav', description: 'Education, skills & interests', action: () => navigateTo('about') },
  { name: 'Sorting playground', description: 'Try five algorithms', action: () => navigateTo('playground') },
  { name: 'Contact', description: 'Start a conversation', action: () => navigateTo('contact') },
  { name: 'Download résumé', description: 'Word document', action: () => { const a = document.createElement('a'); a.href = 'assets/Prabhav_Gomase_Resume.docx'; a.download = 'Prabhav_Gomase_Resume.docx'; a.click(); } },
  { name: 'Switch theme', description: 'Dark / light', action: toggleTheme },
  { name: 'Copy email', description: 'prabhavtg@gmail.com', action: copyEmail },
  ...Object.entries(projects).map(([key, project]) => ({ name: project.title, description: 'Project details', action: () => openProject(key) }))
];
let matchingCommands = commands, selectedCommand = 0;
const commandDialog = $('#command-dialog');
function navigateTo(id) { document.getElementById(id).scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' }); }
function renderCommands() { const query = $('#command-search').value.toLowerCase().trim(); matchingCommands = commands.filter(command => (command.name + ' ' + command.description).toLowerCase().includes(query)); selectedCommand = Math.min(selectedCommand, Math.max(0, matchingCommands.length - 1)); $('#command-results').innerHTML = matchingCommands.length ? matchingCommands.map((command, i) => `<button class="command-item ${i === selectedCommand ? 'selected' : ''}" data-command="${i}"><span>${escapeHTML(command.name)}<em>${escapeHTML(command.description)}</em></span><small>↗</small></button>`).join('') : '<p class="command-empty">No matches. Try “work”, “sorting”, or “theme”.</p>'; $$('.command-item').forEach(button => button.addEventListener('click', () => runCommand(Number(button.dataset.command)))); }
function runCommand(index) { const command = matchingCommands[index]; if (!command) return; commandDialog.close(); command.action(); }
function openCommands() { closeMobileNav(); if (projectDialog.open) projectDialog.close(); $('#command-search').value = ''; selectedCommand = 0; renderCommands(); if (!commandDialog.open) commandDialog.showModal(); $('#command-search').focus(); }
$$('.command-trigger').forEach(button => button.addEventListener('click', openCommands));
$('.command-close').addEventListener('click', () => commandDialog.close());
$('#command-search').addEventListener('input', () => { selectedCommand = 0; renderCommands(); });
commandDialog.addEventListener('keydown', event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (matchingCommands.length) { selectedCommand = (selectedCommand + (event.key === 'ArrowDown' ? 1 : -1) + matchingCommands.length) % matchingCommands.length; renderCommands(); $('.command-item.selected')?.scrollIntoView({ block: 'nearest' }); } } else if (event.key === 'Enter') { event.preventDefault(); runCommand(selectedCommand); } });
document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); commandDialog.open ? commandDialog.close() : openCommands(); } });

// Each generator yields comparisons and writes. The visualizer consumes them at the selected pace.
function* bubbleSort(values) { for (let end = values.length - 1; end > 0; end--) { let changed = false; for (let i = 0; i < end; i++) { yield { type: 'compare', indices: [i, i + 1] }; if (values[i] > values[i + 1]) { [values[i], values[i + 1]] = [values[i + 1], values[i]]; yield { type: 'write', indices: [i, i + 1], values: [values[i], values[i + 1]] }; changed = true; } } yield { type: 'sorted', indices: [end] }; if (!changed) break; } }
function* selectionSort(values) { for (let i = 0; i < values.length - 1; i++) { let min = i; for (let j = i + 1; j < values.length; j++) { yield { type: 'compare', indices: [min, j] }; if (values[j] < values[min]) min = j; } if (min !== i) { [values[i], values[min]] = [values[min], values[i]]; yield { type: 'write', indices: [i, min], values: [values[i], values[min]] }; } yield { type: 'sorted', indices: [i] }; } }
function* insertionSort(values) { for (let i = 1; i < values.length; i++) { const key = values[i]; let j = i - 1; while (j >= 0) { yield { type: 'compare', indices: [j, j + 1] }; if (values[j] <= key) break; values[j + 1] = values[j]; yield { type: 'write', indices: [j + 1], values: [values[j]] }; j--; } values[j + 1] = key; yield { type: 'write', indices: [j + 1], values: [key] }; } }
function* mergeSort(values, left = 0, right = values.length - 1) { if (left >= right) return; const mid = Math.floor((left + right) / 2); yield* mergeSort(values, left, mid); yield* mergeSort(values, mid + 1, right); const first = values.slice(left, mid + 1), second = values.slice(mid + 1, right + 1); let i = 0, j = 0, k = left; while (i < first.length && j < second.length) { yield { type: 'compare', indices: [left + i, mid + 1 + j] }; const value = first[i] <= second[j] ? first[i++] : second[j++]; values[k] = value; yield { type: 'write', indices: [k++], values: [value] }; } while (i < first.length) { values[k] = first[i++]; yield { type: 'write', indices: [k], values: [values[k]] }; k++; } while (j < second.length) { values[k] = second[j++]; yield { type: 'write', indices: [k], values: [values[k]] }; k++; } }
function* quickSort(values, left = 0, right = values.length - 1) { if (left >= right) return; const pivot = values[right]; let i = left; for (let j = left; j < right; j++) { yield { type: 'compare', indices: [j, right] }; if (values[j] < pivot) { if (i !== j) { [values[i], values[j]] = [values[j], values[i]]; yield { type: 'write', indices: [i, j], values: [values[i], values[j]] }; } i++; } } if (i !== right) { [values[i], values[right]] = [values[right], values[i]]; yield { type: 'write', indices: [i, right], values: [values[i], values[right]] }; } yield { type: 'sorted', indices: [i] }; yield* quickSort(values, left, i - 1); yield* quickSort(values, i + 1, right); }
const algorithmInfo = {
  bubble: { generator: bubbleSort, complexity: 'O(n²) time · O(1) space', description: 'Compare neighbors and swap them when needed. Each pass moves the largest remaining value to the end.' },
  selection: { generator: selectionSort, complexity: 'O(n²) time · O(1) space', description: 'Find the smallest remaining value and move it into place. Repeat until the entire array is ordered.' },
  insertion: { generator: insertionSort, complexity: 'O(n²) time · O(1) space', description: 'Build a sorted prefix one value at a time, shifting larger values right to make room for the next one.' },
  merge: { generator: mergeSort, complexity: 'O(n log n) time · O(n) space', description: 'Divide the array into smaller halves, then merge the sorted halves back together in order.' },
  quick: { generator: quickSort, complexity: 'Average O(n log n) · Worst O(n²)', description: 'Choose a pivot, partition smaller values before it, then repeat on both sides. Extra stack space is O(log n) on average and O(n) in the worst case.' }
};
let array = [], barElements = [], comparisonCount = 0, writeCount = 0, sorting = false, paused = false, animationId = null, iterator = null, lastFrame = 0;
function renderBars() { $('#sort-bars').innerHTML = array.map(value => `<div class="sort-bar" style="height:${value}%">${array.length <= 30 ? `<span>${value}</span>` : ''}</div>`).join(''); barElements = $$('.sort-bar'); $('#sort-bars').setAttribute('aria-label', `Unsorted array of ${array.length} values. Select Run sort to animate.`); }
function resetMetrics() { comparisonCount = 0; writeCount = 0; $('#comparisons').textContent = '0'; $('#writes').textContent = '0'; }
function stopSort() { if (animationId !== null) cancelAnimationFrame(animationId); animationId = null; sorting = false; paused = false; iterator = null; $('#sort-button').innerHTML = 'Run sort <span>▶</span>'; $('#algorithm').disabled = false; $('#array-size').disabled = false; }
function shuffle() { stopSort(); array = Array.from({ length: Number($('#array-size').value) }, () => 12 + Math.floor(Math.random() * 86)); resetMetrics(); renderBars(); $('.lab-state').textContent = 'Ready when you are.'; }
function finishSort() { stopSort(); barElements.forEach(bar => { bar.classList.remove('comparing'); bar.classList.add('sorted'); }); $('.lab-state').textContent = 'Sorted. A little more order.'; $('#sort-bars').setAttribute('aria-label', `Sorted array of ${array.length} values: ${array.join(', ')}`); }
function applyStep(step) { barElements.forEach(bar => bar.classList.remove('comparing')); if (step.type === 'compare') { comparisonCount++; step.indices.forEach(index => barElements[index].classList.add('comparing')); $('#comparisons').textContent = String(comparisonCount); } else if (step.type === 'write') { writeCount += step.indices.length; step.indices.forEach((index, i) => { array[index] = step.values[i]; barElements[index].style.height = `${step.values[i]}%`; if (barElements[index].firstElementChild) barElements[index].firstElementChild.textContent = String(step.values[i]); barElements[index].classList.add('comparing'); }); $('#writes').textContent = String(writeCount); } else if (step.type === 'sorted') step.indices.forEach(index => barElements[index].classList.add('sorted')); }
function sortFrame(time) { if (!sorting || paused) return; const speed = Number($('#sort-speed').value); const delay = [0, 180, 95, 45, 17, 0][speed]; if (time - lastFrame >= delay) { lastFrame = time; const batch = speed === 5 ? 5 : 1; for (let i = 0; i < batch; i++) { const next = iterator.next(); if (next.done) { finishSort(); return; } applyStep(next.value); } } animationId = requestAnimationFrame(sortFrame); }
$('#sort-button').addEventListener('click', () => { if (sorting) { paused = !paused; $('#sort-button').innerHTML = paused ? 'Resume <span>▶</span>' : 'Pause <span>Ⅱ</span>'; $('.lab-state').textContent = paused ? 'Paused. Take a closer look.' : 'Sorting…'; if (paused && animationId !== null) cancelAnimationFrame(animationId); if (!paused) { lastFrame = 0; animationId = requestAnimationFrame(sortFrame); } return; } resetMetrics(); barElements.forEach(bar => bar.classList.remove('sorted', 'comparing')); iterator = algorithmInfo[$('#algorithm').value].generator([...array]); sorting = true; paused = false; $('#algorithm').disabled = true; $('#array-size').disabled = true; $('#sort-button').innerHTML = 'Pause <span>Ⅱ</span>'; $('.lab-state').textContent = 'Sorting…'; lastFrame = 0; animationId = requestAnimationFrame(sortFrame); });
$('#shuffle').addEventListener('click', shuffle);
$('#array-size').addEventListener('input', () => { $('#size-value').textContent = $('#array-size').value; shuffle(); });
$('#sort-speed').addEventListener('input', () => { $('#speed-value').textContent = ['Slow', 'Steady', 'Medium', 'Fast', 'Fastest'][Number($('#sort-speed').value) - 1]; });
$('#algorithm').addEventListener('change', () => { const info = algorithmInfo[$('#algorithm').value]; $('#algorithm-complexity').textContent = info.complexity; $('#algorithm-description').textContent = info.description; shuffle(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && sorting && !paused) { paused = true; if (animationId !== null) cancelAnimationFrame(animationId); $('#sort-button').innerHTML = 'Resume <span>▶</span>'; $('.lab-state').textContent = 'Paused while you’re away.'; } });
shuffle();

const MAX_PLAYERS = 5;

const scoreFields = [
  { key: "birds", label: "Bird cards" },
  { key: "bonus", label: "Bonus cards" },
  { key: "eggs", label: "Eggs" },
  { key: "food", label: "Food on cards" },
  { key: "tucked", label: "Tucked cards" }
];

function calculateTotal(player) {
  return scoreFields.reduce(
    (sum, field) => sum + Number(player[field.key] || 0),
    0
  );
}

function rankPlayers(players) {
  const sorted = [...players].sort((a, b) => b.total - a.total);

  let rank = 1;
  sorted.forEach((player, index) => {
    if (index > 0 && player.total < sorted[index - 1].total) {
      rank = index + 1;
    }
    player.rank = rank;
  });

  return sorted;
}

function render() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <form id="score-form">
      ${[...Array(MAX_PLAYERS)].map((_, i) => `
        <fieldset>
          <legend>Player ${i + 1}</legend>
          <input type="text" name="name-${i}" placeholder="Name" />

          ${scoreFields.map(field => `
            <label>
              ${field.label}
              <input type="number" min="0" name="${field.key}-${i}" value="0" />
            </label>
          `).join("")}
        </fieldset>
      `).join("")}

      <button type="submit">Calculate ranking</button>
    </form>

    <div id="result"></div>
  `;

  document
    .getElementById("score-form")
    .addEventListener("submit", handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const players = [];

  for (let i = 0; i < MAX_PLAYERS; i++) {
    const name = form[`name-${i}`].value.trim();
    if (!name) continue;

    const player = { name };

    scoreFields.forEach(field => {
      player[field.key] = form[`${field.key}-${i}`].value;
    });

    player.total = calculateTotal(player);
    players.push(player);
  }

  const ranked = rankPlayers(players);
  renderResult(ranked);
}

function renderResult(players) {
  const result = document.getElementById("result");

  if (players.length === 0) {
    result.innerHTML = "<p>No players entered.</p>";
    return;
  }

  result.innerHTML = `
    <h2>Final ranking</h2>
    <ol>
      ${players.map(p => `
        <li>
          ${p.name} — ${p.total} points
        </li>
      `).join("")}
    </ol>
  `;
}

render();
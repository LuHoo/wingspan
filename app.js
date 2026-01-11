const MAX_PLAYERS = 5;

const scoreFields = [
  { key: "birds", label: "Birds" },
  { key: "bonus", label: "Bonus" },
  { key: "endGoals", label: "End of round goals" },
  { key: "eggs", label: "Eggs" },
  { key: "food", label: "Food" },
  { key: "tucked", label: "Tucked" }
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
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              ${scoreFields.map(f => `<th>${f.label}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${[...Array(MAX_PLAYERS)].map((_, i) => `
              <tr>
                <td>
                  <input
                    type="text"
                    name="name-${i}"
                    placeholder="Player ${i + 1}"
                  />
                </td>
                ${scoreFields.map(field => `
                  <td>
                    <input
                      type="number"
                      min="0"
                      name="${field.key}-${i}"
                      placeholder="0"
                    />
                  </td>
                `).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

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

  renderResult(rankPlayers(players));
}

function renderResult(players) {
  const result = document.getElementById("result");

  if (players.length === 0) {
    result.innerHTML = "<p>No players entered.</p>";
    return;
  }

  result.innerHTML = `
    <h2>Final ranking</h2>
    <table class="results">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${players.map(p => `
          <tr>
            <td>${p.rank}</td>
            <td>${p.name}</td>
            <td>${p.total}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

render();
enableAutoSelect();

function enableAutoSelect() {
  const inputs = document.querySelectorAll(
    'input[type="number"]'
  );

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // kleine delay nodig voor mobiel
      setTimeout(() => {
        input.select();
      }, 0);
    });
  });
}
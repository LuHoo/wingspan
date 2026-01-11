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

  // volledige render van formulier en tabel
  app.innerHTML = `
    <form id="score-form">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              ${scoreFields.map(f => `<th>${f.label}</th>`).join("")}
              <th>Total</th>
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
                <td class="total-cell">0</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <button type="submit">Calculate ranking</button>
    </form>
    <div id="result"></div>
  `;

  // bind submit
  document
    .getElementById("score-form")
    .addEventListener("submit", handleSubmit);

  // bind extra features
  enableAutoSelect();
  enableLiveTotals();
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

// selecteer hele waarde bij focus
function enableAutoSelect() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      setTimeout(() => input.select(), 0);
    });
  });
}

// live totals per speler, bindings idempotent
function enableLiveTotals() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input[type="number"]');
    const totalCell = row.querySelector(".total-cell");

    inputs.forEach(input => {
      if (!input.dataset.liveTotalBound) {
        input.addEventListener("input", () => {
          const total = Array.from(inputs).reduce((sum, inp) => {
            return sum + (Number(inp.value) || 0);
          }, 0);
          totalCell.textContent = total;
        });
        input.dataset.liveTotalBound = "true";
      }
    });
  });
}

// initial render
render();
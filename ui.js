class UI {
  width = width - grid.width * grid.columns;

  currentTowerSelection = null;

  constructor() {
    let towerContainer = document.getElementById("tower_container");

    ALL_TOWERS.forEach(towerClass => {
      let tower = new towerClass();
      let card = document.createElement("div");
      card.classList.add("tower");
      towerContainer.appendChild(card);

      let title = document.createElement("p");
      title.textContent = tower.constructor.name;
      card.appendChild(title);

      let details = document.createElement("div");
      details.classList.add("tower_details");
      card.appendChild(details);

      let cost = document.createElement("p");
      cost.textContent = "COST: $" + tower.cost;
      cost.classList.add("tower_cost", "tooltip");
      details.appendChild(cost);

      let damage = document.createElement("p");
      damage.textContent = `DAMAGE: ${tower.damage}`;
      damage.classList.add("tower_damage", "tooltip");
      details.appendChild(damage);

      let firerate = document.createElement("p");
      firerate.textContent = `RoF: ${tower.firerate}/sec`;
      firerate.classList.add("tower_firerate", "tooltip");
      details.appendChild(firerate);

      let range = document.createElement("p");
      range.textContent = `RANGE: ${tower.range} units`;
      range.classList.add("tower_range", "tooltip");
      details.appendChild(range);
    });


    new Array(...towerContainer.children).flat().forEach(card => {
      console.log(card);
      card.addEventListener("mousedown", () => {
        this.currentTowerSelection?.classList.remove("tower_selected");
        this.currentTowerSelection = card;
        card.classList.add("tower_selected");
      });
    })
  }

  draw() {
  }
}
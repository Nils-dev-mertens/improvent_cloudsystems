# Docker compose
## 1. Wat is docker compose
Docker compose is een tool waarmee je multi-container Docker applicaties kunt definiëren en uitvoeren. Met een enkele configuratiebestand (meestal `docker-compose.yml`) kun je de services, netwerken en volumes van je applicatie beschrijven. bvb een node app en mongodb. dit is handig om meerdere services tergelijketijd te starten en beheren in 1 file.


## 2. Basisstructuur van een docker-compose.yml

```yml
services:
  app:
    build: .
    ports:
      - "80:80"
    depends_on:
      - mongodb
    networks:
      - mongodb_network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
    volumes:
      - mongodb_data:/data/db
    networks:
      - mongodb_network

networks:
  mongodb_network:
    driver: bridge

volumes:
  mongodb_data:
```
## 3. Wat doet dit bestand

### `services:`

Hierin staan de containers die Docker moet opstarten.

#### `app:`

* **`build: .`**
  Docker bouwt de container vanuit de Dockerfile in de huidige directory.

* **`ports:`**

  * `"80:80"`
    De applicatie is van buiten bereikbaar op poort 80.

* **`depends_on:`**

  * `mongodb`
    Docker start eerst de MongoDB-container voordat de app start.

* **`networks:`**

  * `mongodb_network`
    De app en MongoDB zitten in hetzelfde netwerk, zodat ze met elkaar kunnen communiceren.

---

#### `mongodb:`

* **`image: mongo:latest`**
  De container gebruikt de laatste versie van het officiële MongoDB-image.

* **`ports:`**

  * `"27017:27017"`
    MongoDB is bereikbaar op de standaardpoort 27017.

* **`environment:`**

  * `MONGO_INITDB_ROOT_USERNAME: root`
  * `MONGO_INITDB_ROOT_PASSWORD: root`
    Deze variabelen stellen de root-gebruiker van MongoDB in.

* **`volumes:`**

  * `mongodb_data:/data/db`
    Data van MongoDB wordt opgeslagen op een volume, zodat het behouden blijft als de container stopt.

* **`networks:`**

  * `mongodb_network`
    Ook deze container zit in hetzelfde netwerk als de app.

---

### `networks:`

#### `mongodb_network:`

* **`driver: bridge`**
  Een standaard netwerkmodus waarmee containers met elkaar kunnen praten.

---

### `volumes:`

#### `mongodb_data:`

* Een named volume voor permanente opslag van MongoDB-data.

## 4. Docker Compose Commands

Elke Docker Compose-configuratie bevindt zich in een aparte map (directory). Om een Compose-project te starten, navigeer je eerst naar de map waarin het `docker-compose.yml`-bestand staat. Start het project vervolgens met het volgende commando:

```sh
docker compose up -d
```

Dit commando start alle services en plaatst ze op de achtergrond (detach mode).

Om het project weer netjes te stoppen en alle bijbehorende containers te verwijderen, gebruik je:

```sh
docker compose down
```
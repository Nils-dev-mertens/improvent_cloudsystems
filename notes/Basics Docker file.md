# Overzicht van Docker-commando's

## 1. Container bouwen en starten

```bash
docker build -t mijn-app .
docker run -d -p 3000:3000 --name node-container mijn-app
```

## 2. Persistente data

### Bind Mount:

```bash
docker run -d -p 3000:3000 --name node-container \
  --mount type=bind,src=$(pwd)/data,dst=/app/data mijn-app
```

- `--mount type=bind` → Verbindt een lokale map met de container
- `src=$(pwd)/data` → Bronnenmap op de host
- `dst=/app/data` → Bestemming in de container

### Volume:

```bash
docker volume create mijn-volume
docker run -d -p 3000:3000 --name node-container \
  --mount type=volume,src=mijn-volume,dst=/app/data mijn-app
```

- `docker volume create` → Maakt een persistent volume aan
- `--mount type=volume` → Gebruikt een Docker-volume
- `src=mijn-volume` → Naam van het volume
- `dst=/app/data` → Mountpunt in de container

## 3. Debugging en beheer

```bash
docker logs node-container
docker exec -it node-container /bin/bash
docker ps -a
docker stop node-container
docker rm node-container
docker rmi mijn-app
```

- `docker logs` → Bekijk containerlogs
- `docker exec -it` → Open een shell in de container
- `docker ps -a` → Lijst alle containers
- `docker stop` → Stopt een draaiende container
- `docker rm` → Verwijdert een container
- `docker rmi` → Verwijdert een image

# Overzicht van Dockerfile


```dockerfile
FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY ./public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 1. FROM nginx:latest

* **Wat doet `FROM`?**
  Dit is altijd het **eerste statement** in een Dockerfile.
  Het bepaalt welke basis-image wordt gebruikt om je eigen image op te bouwen.
  Een image is als een snapshot van een besturingssysteem mét software.

* **Waarom `nginx:latest`?**
  Dit betekent dat je de officiële Nginx-image neemt, met de **laatste stabiele versie** van Nginx die op Docker Hub staat.
  Je hoeft dus niet zelf Nginx te installeren; dat is al gedaan.


## 2. WORKDIR /usr/share/nginx/html

* **Wat doet `WORKDIR`?**
  Hiermee stel je de werkdirectory in waar volgende commando’s (zoals `COPY` of `RUN`) standaard in uitgevoerd worden.

* **Waarom `/usr/share/nginx/html`?**
  Dit is de **standaardlocatie** in de Nginx-container waar de webserver zijn bestanden verwacht (HTML, CSS, afbeeldingen, etc.).
  Door hier naartoe te werken voorkom je steeds het absolute pad te moeten typen.


## 3. COPY ./public /usr/share/nginx/html

* **Wat doet `COPY`?**
  Dit kopieert bestanden van jouw lokale machine (de build context) naar de container.

* **Specifiek hier:**

  * `./public` is een lokale map (bijvoorbeeld met je website bestanden).
  * `/usr/share/nginx/html` is de doelmap in de container.

* **Waarom?**
  Om je eigen websitebestanden beschikbaar te maken voor Nginx om te serveren.

* **Belangrijk:** Dit overschrijft de standaard content in die map met jouw eigen bestanden.


## 4. EXPOSE 80

* **Wat doet `EXPOSE`?**
  Dit vertelt Docker dat de container luistert op poort 80.

* **Let op:**
  Dit opent de poort **niet automatisch** naar buiten toe, het is puur een **documentatie-instructie** voor mensen die de image gebruiken.
  Om de poort toegankelijk te maken, moet je bijvoorbeeld bij `docker run` een poort forwarden met `-p 8080:80`.

## 5. CMD ["nginx", "-g", "daemon off;"]

* **Wat doet `CMD`?**
  Dit is het commando dat wordt uitgevoerd **wanneer de container start**.
  Je kunt dit zien als het “startscript” van de container.

* **Waarom deze command?**

  * `nginx` start de Nginx server.
  * `-g "daemon off;"` zorgt ervoor dat Nginx **in de voorgrond draait**.

* **Waarom in de voorgrond?**
  Docker containers blijven draaien zolang het hoofdproces actief is.
  Als Nginx als daemon (achtergrondproces) zou draaien, stopt het hoofdproces meteen en stopt de container.


## Samenvatting

| Keyword   | Functie                                     | Waarom hier belangrijk                             |
| --------- | ------------------------------------------- | -------------------------------------------------- |
| `FROM`    | Kies de basis-image                         | Gebruik officiële Nginx met laatste versie         |
| `WORKDIR` | Stel werkdirectory in                       | Werken in de Nginx-website map                     |
| `COPY`    | Kopieer bestanden naar de container         | Voeg jouw websitebestanden toe                     |
| `EXPOSE`  | Declareer welke poort de container gebruikt | Informeer dat poort 80 open staat                  |
| `CMD`     | Start het hoofdproces bij containerstart    | Start Nginx in voorgrond, container blijft draaien |

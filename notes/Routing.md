
# IP-Adressen en Subnetten

## 1. Wat is een IP-adres?

Een IP-adres is een uniek adres dat gebruikt wordt om apparaten binnen een netwerk te identificeren. Het bestaat uit 32 bits in IPv4, meestal weergegeven als vier decimale getallen gescheiden door punten (bijvoorbeeld `192.168.1.1`).



## 2. Het Subnetmasker

Het subnetmasker bepaalt welk deel van het IP-adres het netwerk aanduidt en welk deel de host binnen dat netwerk. Het subnetmasker wordt vaak genoteerd in CIDR-notatie (bijv. `/24`).

### Voorbeelden van subnetmaskers:

| CIDR | Decimale notatie       | Host-adressen |
|---|---|--|
| /8   | 255.0.0.0              | 16.777.214      |
| /16  | 255.255.0.0            | 65.534          |
| /24  | 255.255.255.0          | 254             |
| /30  | 255.255.255.252        | 2               |



## 3. Netwerkadres, Hostadressen en Broadcastadres

### Werkwijze:

- **Netwerkadres**: alle hostbits (niet-maskeerbits) op 0.
- **Broadcastadres**: alle hostbits op 1.
- **Hostadressen**: alle adressen tussen netwerk- en broadcastadres.

### Voorbeeld:

Gegeven het IP-adres `100.103.28.116` met subnetmasker `/17`:

- IP (binair): `01100100.01100111.00011100.01110100`
- Subnetmasker (binair): `11111111.11111111.10000000.00000000`

→ Eerste 17 bits blijven behouden.

- **Netwerkadres**: `100.103.0.0`
- **Broadcastadres**: `100.103.127.255`
- **Eerste host**: `100.103.0.1`
- **Laatste host**: `100.103.127.254`



## 4. Subnetten

Een subnet is een logisch afgebakend deel van een groter netwerk, verkregen door het subnetmasker te verlengen.

### Voorbeeld 1: van `/16` naar `/17`

IP: `10.5.3.0/17`

- Subnetmasker: `255.255.128.0`
- Netwerkadres: `10.5.0.0`
- Broadcastadres: `10.5.127.255`

### Voorbeeld 2: `10.4.3.0/16`

- IP (binair): `00001010.00000100.00000011.00000000`
- Subnetmasker: `255.255.0.0` (of `/16`)
- **Netwerkadres**: `10.4.0.0`



## 5. Controle: Is subnet geldig?

### Voorbeeld:

**Vraag:** Is `172.25.13.0/24` een subnet van `172.16.0.0/12`?

- `172.25.13.0` = `10101100.00011001.00001101.00000000`
- `172.16.0.0`  = `10101100.0001` (eerste 12 bits)

**Antwoord:**  
Ja, `172.25.13.0/24` valt binnen het bereik van `172.16.0.0/12`.

## 6. Subnetstructuur in blokken

Een subnetstructuur kan je als volgt visualiseren (bijvoorbeeld bij /17):

```
/16 : 100.103.0.0       - 100.103.255.255  → 65.536 adressen
 /17: 100.103.0.0       - 100.103.127.255  → eerste helft
 /17: 100.103.128.0     - 100.103.255.255  → tweede helft
```

Als je een subnet `/18` maakt binnen `100.103.0.0/17`:

```
/18: 100.103.0.0        - 100.103.63.255
/18: 100.103.64.0       - 100.103.127.255
```
# Handover

Projekt byl v rámci časového limitu posunut směrem k produkčnímu provozu. Zbývající práce je níže seřazena podle priorit zadání a rozdělena do samostatných karet, které lze převést do Trella.

## Technická rozhodnutí

### Optimalizace obrázků přes Sharp je vypnutá

Aplikace aktuálně nepotřebuje serverovou optimalizaci obrázků. Její vypnutí snižuje nároky na výpočetní výkon serveru. Pokud bude správa obrázků později potřeba, měla by ji převzít samostatná služba s podporou CDN.

### Autoprefixer není součástí PostCSS konfigurace

Tailwind CSS 4 řeší vendor prefixy automaticky, takže samostatný `autoprefixer` není potřeba. Viz [Tailwind CSS upgrade guide](https://tailwindcss.com/docs/upgrade-guide#using-postcss).

## Dokončené práce relevantní pro předání

- Todo mutace používají optimistické aktualizace TanStack Query včetně rollbacku a obnovy dat po chybě.
- Todo feature je rozdělená na komponenty, hooky, API vrstvu, schémata, konfiguraci a typy.
- Základní chyby dotazů a mutací se zapisují do konzole.
- Integrační testy tRPC a Payload vrstvy jsou rozpracované v `tests/integration/todos.test.ts`.

## Zjištění bezpečnostního auditu

Statická kontrola repozitáře našla 9 zjištění: 1 s vysokou, 3 se střední a 5 s nízkou závažností. Aplikace při kontrole nebyla spuštěna a externí produkční ochrany mimo repozitář nebyly zohledněny.

### P0: Zabezpečit vytvoření prvního administrátora

Payload veřejně zpřístupňuje `POST /api/admins/first-register`, který při prázdné kolekci obchází běžná přístupová pravidla. Prvního administrátora je nutné vytvořit privátním jednorázovým deployment krokem před zveřejněním Nginx a veřejný endpoint následně trvale zablokovat.

### P0: Zabezpečit produkční autentizaci a přenos dat

- `Admins` používá výchozí cookie bez atributu `Secure`; nastavit explicitní produkční cookie konfiguraci stejně jako u `Users`.
- Produkční Compose publikuje pouze HTTP port 80; ukončit TLS v Nginx nebo povinném upstream proxy, HTTP odmítat či přesměrovat a po stabilizaci zapnout HSTS.
- Ověřit testem, že admin cookie obsahuje `Secure`, `HttpOnly` a očekávané `SameSite` a že přihlašovací endpoint není dostupný přes nezabezpečený veřejný přenos.

### P0: Omezit operaci odemknutí účtů

Payload pro chybějící pravidlo `unlock` povoluje libovolného přihlášeného uživatele. Do `Admins` i `Users` přidat explicitní `unlock: ({ req }) => isAdmin(req.user)` a ověřit, že běžný uživatel nemůže odemknout existující ani neexistující admin účet.

### P1: Opravit mazání uživatelů s todo položkami

Povinný `todos.owner_id` používá cizí klíč `ON DELETE SET NULL`, takže smazání uživatele s todo položkami selže. Zvolit jednu atomickou politiku: smazat závislá todo v transakčním `Users.beforeDelete` hooku, nebo změnit cizí klíč novou migrací na `ON DELETE CASCADE`.

### P1: Omezit nákladné API požadavky

- Nastavit malé serverové `maxBatchSize` pro tRPC a odpovídající klientské `maxItems`; jeden `todos.list` aktuálně spouští pět až šest databázových operací.
- Doplnit per-IP a per-account rate limiting pro login a unlock endpointy. Samotný globální zámek po pěti chybných pokusech umožňuje opakovaně zablokovat známý účet.
- Později nahradit čtyři samostatné dotazy statistik jedním agregačním dotazem a přidat limity databázového poolu a statement timeout.

### P1: Zabránit login CSRF

Cross-site multipart formulář může přihlásit prohlížeč oběti do účtu útočníka a nahradit session cookie. Pro login a další endpointy vydávající přihlašovací údaje kontrolovat přesnou hodnotu `Origin` vůči nakonfigurované produkční URL, případně doplnit CSRF token. V přihlášeném UI viditelně zobrazit aktivní identitu.

### P2: Omezit vývojovou PostgreSQL na localhost

Změnit mapování v `compose.yaml` z `5432:5432` na `127.0.0.1:5432:5432`, nebo publikování portu odstranit, pokud se všechny klienty připojují přes Compose síť.

### Bezpečnostní ověření

- Veřejný požadavek na `admins/first-register` je vždy odmítnutý a edge se nezpřístupní před dokončením bootstrapu.
- Běžný uživatel nemůže měnit autentizační stav administrátora.
- Smazání uživatele s todo položkami proběhne atomicky.
- Nadlimitní tRPC batch je odmítnutý před spuštěním procedur.
- Cross-origin JSON i multipart login jsou odmítnuté před autentizací a vydáním cookie.
- Produkční HTTP je odmítnuté nebo přesměrované na HTTPS a vývojová databáze není dostupná přes síťové rozhraní hostitele.

## Zbývající karty

### P0: Doplnit error boundaries

**Cíl:** Zabránit pádu celé aplikace při neočekávané chybě a nabídnout uživateli možnost zotavení.

**Rozsah:**

- Přidat route-level `error.tsx` pro uživatelskou část aplikace.
- Zobrazit srozumitelnou chybovou obrazovku s možností opakovat akci.
- Neočekávanou chybu zaznamenat přes společnou logovací vrstvu.

**Akceptační kritéria:**

- Chyba při vykreslení todo stránky nezpůsobí prázdnou obrazovku.
- Uživatel může načtení stránky zopakovat bez ručního refreshnutí prohlížeče.
- Produkční UI nezobrazuje stack trace ani interní detaily chyby.

### P0: Zavést produkční logging

**Cíl:** Nahradit roztříštěné použití `console.log` a `console.error` strukturovaným logováním vhodným pro provoz.

**Rozsah:**

- Zavést společné rozhraní loggeru pro klientské a serverové chyby.
- Zaznamenávat chyby tRPC, Payload, TanStack Query a error boundaries s užitečným kontextem.
- Nezapisovat hesla, session údaje ani jiná citlivá data.
- Připravit napojení na externí observability službu.

**Akceptační kritéria:**

- Neočekávané chyby mají konzistentní strukturu a kontext požadavku nebo operace.
- V produkčním kódu nezůstane ad hoc logování chyb přes `console`.
- Citlivá data nejsou součástí logů.

### P0: Dokončit integrační testy

**Cíl:** Ověřit kritické produkční scénáře nad skutečnou tRPC, Payload a PostgreSQL vrstvou.

**Rozsah:**

- Dokončit a stabilizovat testy CRUD operací, filtrování, stránkování a statistik.
- Ověřit autentizaci, izolaci dat mezi uživateli a oprávnění administrátora.
- Doplnit scénáře nevalidních vstupů, minulého termínu a souběžných změn.
- Spouštět testy v CI nad izolovanou testovací databází.

**Akceptační kritéria:**

- `pnpm test:integration` prochází opakovaně bez zbytkových testovacích dat.
- Testy nepoužívají ani nemažou vývojová nebo produkční data.
- CI zablokuje merge při regresi kritických scénářů.

### P0: Zpřísnit validaci hesel

**Cíl:** Zabránit vytvoření účtu se slabým heslem.

**Rozsah:**

- Definovat jednotnou minimální politiku hesel pro administrátory i uživatele.
- Validovat heslo na serveru při vytvoření účtu a při jeho změně.
- Zobrazit konkrétní, ale bezpečnou validační zprávu.
- Doplnit testy povolených a zamítnutých hesel.

**Akceptační kritéria:**

- Slabé heslo nelze uložit ani při přímém volání API.
- Obě autentizační kolekce používají stejnou politiku.
- Validace a její testy neobsahují skutečná přístupová data.

### P0: Zakázat vytvoření todo s termínem v minulosti

**Cíl:** Zajistit, že nové todo nelze založit s již uplynulým termínem.

**Rozsah:**

- Rozšířit serverovou validaci `dueDate` nad rámec kontroly ISO formátu.
- Použít jednoznačnou hranici kalendářního dne a zdokumentovat zvolenou časovou zónu.
- Stejné pravidlo promítnout do formuláře pro okamžitou zpětnou vazbu.
- Rozhodnout a otestovat chování při úpravě staršího todo, jehož termín již uplynul.

**Akceptační kritéria:**

- API odmítne vytvoření todo s termínem před dnešním datem.
- Dnešní datum je povolené.
- Chování je konzistentní mezi klientem, serverem a podporovanými časovými zónami.

### P1: Přidat serverový prefetch TanStack Query

**Cíl:** Zrychlit první načtení todo seznamu a omezit klientský loading stav.

**Rozsah:**

- Na serveru přednačíst data pro výchozí filtry přihlášeného uživatele.
- Dehydratovat QueryClient a hydratovat jej na klientovi.
- Zachovat izolaci cache mezi požadavky a uživateli.
- Zabránit duplicitnímu načtení stejných dat po hydrataci.

**Akceptační kritéria:**

- První todo seznam je součástí serverové odpovědi pro přihlášeného uživatele.
- Po hydrataci se bez změny filtrů nespustí duplicitní request.
- Data jednoho uživatele se nemohou objevit v cache jiného uživatele.

### P1: Doplnit toast notifikace

**Cíl:** Poskytovat jednotnou zpětnou vazbu k úspěšným a neúspěšným operacím.

**Rozsah:**

- Zavést sdílený toast systém přístupný z TanStack Query a formulářů.
- Nahradit existující TODO komentáře a uživatelsky viditelné chyby zapisované pouze do konzole.
- Pokrýt vytvoření, úpravu, smazání, změnu stavu a background refetch error.
- Zajistit přístupné oznamování a nepřekrývat důležité ovládací prvky na mobilu.

**Akceptační kritéria:**

- Uživatel dostane srozumitelnou zprávu po selhání každé mutace.
- Background chyba nepřepíše úspěšně zobrazená stale data.
- Toasty lze ovládat a přečíst pomocí klávesnice a čtečky obrazovky.

### P2: Připravit překlady

**Cíl:** Odstranit texty pevně zapsané v komponentách a připravit aplikaci na více jazyků.

**Rozsah:**

- Zvolit i18n řešení kompatibilní s Next.js App Routerem a serverovými komponentami.
- Přesunout uživatelské texty, validační zprávy a toast notifikace do překladových souborů.
- Zavést výchozí jazyk a fallback pro chybějící klíče.
- Lokalizovat formát data a času.

**Akceptační kritéria:**

- Uživatelské texty todo a autentizační části nejsou pevně zapsané v komponentách.
- Chybějící překlad nezpůsobí pád aplikace.
- Alespoň dva jazyky lze přepnout bez změny zdrojového kódu.

### P2: Sjednotit atomické UI komponenty pomocí Radix UI

**Cíl:** Zlepšit konzistenci, přístupnost a znovupoužitelnost základních ovládacích prvků.

**Rozsah:**

- Identifikovat opakované atomické prvky, například tlačítka, vstupy, dialogy a selecty.
- Přesunout obecné prvky z feature komponent do sdílené složky `components`.
- Pro interaktivní prvky použít vhodné Radix UI primitives a zachovat současný vizuální styl.
- Feature-specifické komponenty ponechat ve `features/todos`.

**Akceptační kritéria:**

- Sdílené komponenty nemají závislost na todo doméně.
- Ovládání klávesnicí, focus management a ARIA atributy odpovídají použitému prvku.
- Refaktor nezmění stávající chování ani responzivní vzhled aplikace.

## Doporučené pořadí

1. Error boundaries a produkční logging.
2. Validace hesel a termínu todo.
3. Dokončení integračních testů a zapojení do CI.
4. Serverový prefetch a ověření izolace cache.
5. Toast notifikace.
6. Překlady a refaktor atomických UI komponent.

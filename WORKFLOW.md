# Workflow

- Ergebnis: MACHBAR
- Wesentliche technische Gründe: Das Repository enthält bereits einen neutralen Framework-Core in `platform/`, ein app-shell in `app/`, eine modulare Server-Schicht in `server/` und ein eigenes GPS-Modul. Die Architektur entspricht dem Zielbild CORE + FINAL FRAMEWORK + MODULE und lässt sich mit Node.js/CommonJS sauber erweitern. Abhängigkeiten sind minimal und die Laufzeitumgebung ist konsistent und lokal startbar.
- Vorgehensweise: Den Core als neutrale Runtime mit Registry, Permission- und Setup-Management erhalten; Module als eigenständige Erweiterungen über ModuleManager/Registry einbinden; Administration und App-UI im gleichen Anwendungskontext betreiben; Server nur für zentrale Dienste, API und Medien-/Sync-Funktionen verwenden; Offline-First über lokale Zustände und optionale Online-Synchronisation umsetzen.
- Zusätzliche Voraussetzungen: Die vorhandene Trennung zwischen Core, App-UI und Server beibehalten; neue Module ausschließlich über definierte Schnittstellen ergänzen; Admin-Zugriff und Serveranbindung über konfigurierbare States statt hart kodierte Pfade verwalten.
- Abschluss: Die Vision ist technisch vollständig umsetzbar. Der vorhandene Codebestand stellt bereits den Ausgangspunkt für die tatsächliche Umsetzung dar und ist durch die vorhandenen Tests über den kritischen Ablauf validiert.

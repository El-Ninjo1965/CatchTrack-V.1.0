# CatchTrack V1.0 Project

## 1. Vision
CatchTrack V1.0 provides a modular system for tracking and evaluating fishing or travel-related activity, with a clean separation between infrastructure and domain logic.

Strategically, CatchTrack V1.0 is the first application built on a longer-term neutral, reusable modular platform. The framework layer is intentionally generic and future-proof; the application layer remains CatchTrack-specific.

## 2. Framework vs. application
- Platform / Framework: generic runtime, identity, administration, module management, permissions, connections, UI shell, configuration, storage abstractions, and module interfaces.
- Application: CatchTrack as the first concrete product built on this shared platform.
- Fachmodule: domain-specific units such as catches, equipment, GPS, weather, calendar, and future fishing modules.

## 2.1 Project responsibility and decision authority
The project is developed and governed by a single person who acts as the sole developer, decision maker, and project owner.

AI systems and coding agents are support tools. They do not make final project decisions.

Technical proposals from AI systems must be reviewed critically. The final decision about architecture, priority, and implementation remains with the developer.

The project architecture remains aligned with the long-term goal of a reusable neutral platform that can later support additional applications beyond CatchTrack.

## 3. Target architecture
- Core: generic runtime, configuration, lifecycle, state, storage, module registry, and system services.
- User Identity / User Interface: generic user identity, user profile context, UI shell, preferences, visibility, module ordering, and presentation rules.
- Administration: generic administration, module lifecycle, availability, configuration, access control, and feature governance.
- Module Manager: generic management for installation, activation, configuration, update, status, and deinstallation of modules.
- Modules: feature-specific domain implementations such as catches, equipment, GPS, weather, calendar, and other application-specific domain functionality.
- Data model: structured, explicit, and modular; avoid hidden coupling between modules and core.
- Interfaces: stable contracts between core, framework services, and modules.

## 4. Core responsibilities
The core contains general infrastructure only:
- startup and shutdown lifecycle
- runtime execution
- event and state handling
- storage and database access
- configuration and error handling
- module registration and management

The core does not contain domain-specific behavior or module-specific logic.

## 5. Module responsibilities
Modules provide specific business or user-facing features. They must use the core interfaces and remain independent from each other unless a clear dependency is required.

Generic platform services are not CatchTrack domain modules. They include:
- User Identity and user profile context
- User Interface shell and navigation logic
- Administration and system governance
- Permission and package logic
- Module manager and lifecycle governance
- Connection abstraction for local server, optional cloud, and future hosting models
- UI configuration, module visibility, and presentation preferences

Application-specific domain modules include:
- Catches / Catchbook
- Equipment
- GPS
- Weather
- Calendar
- future fishing-domain modules

## 6. Data model principles
- Keep domain data explicit and structured.
- Minimize direct coupling between unrelated modules.
- Keep storage and logic responsibilities separated.
- Preserve compatibility with the core architecture.
- Prefer local device storage for GPS data unless a future module explicitly requires server-side persistence with a documented architectural reason.
- Keep personal data minimal and avoid unnecessary storage of personal information on the project server.

## 7. Dynamic user experience
The user interface must be dynamic and responsive. It must not assume a fixed set of modules. Users should be able to:
- show or hide modules
- define ordering and priority
- recognize available modules
- view restricted modules as previews
- receive upgrade guidance for locked features
- personalize presentation settings including font size
- use the interface on small smartphone portrait layouts

## 8. Permission and package model
The framework must support multiple access levels such as Free, Standard, Advanced, and Platinum without hard-coding package names into domain modules. A module may exist and still be locked for a user or tariff. Locked modules may be displayed as previews, while input functions remain blocked and upgrade prompts can be shown.

## 9. Future reusability and store perspective
The architecture must not prevent packaging as a standalone store app and must keep the neutral framework reusable for second and third applications. CatchTrack-specific terms should remain in application or module logic, while the framework remains generic and neutral.

## 10. Generic platform contracts
The platform layer shall provide explicit, reusable contracts for application-level extension without coupling the core to any domain logic.

### 10.1 Generic module contract
A future module shall be able to declare:
- unique module ID
- module name
- version
- description
- status
- required permissions
- dependencies
- configuration
- UI/menu definition
- storage responsibility
- installation lifecycle
- activation and deactivation
- update flow
- uninstallation behavior

The current repository already exposes a neutral module contract in the Core layer and the Module Manager pattern. Future module definitions should remain compatible with that structure and extend it where required, without modifying the frozen Core contracts.

### 10.2 Proposed lifecycle contract
The generic lifecycle shall be documented as:
- DISCOVERED
- AVAILABLE
- INSTALLING
- INSTALLED
- ENABLED
- CONFIGURED
- RUNNING
- DISABLED
- UNINSTALLED

This lifecycle is a platform architecture contract for future module implementations. It does not require immediate full runtime enforcement in every module, but it defines the agreed direction for safe module governance.

### 10.3 Installation and deinstallation contract
A module is responsible for its own resources, including:
- module-specific tables or stores
- module-specific configuration defaults
- UI registration entries
- permission declarations
- module data ownership

Deinstallation must remove only module-owned resources and must never delete data belonging to other modules or unrelated framework components.

If a future implementation cannot yet fully support this contract without a Core change, it must be documented as a future implementation task rather than forcing a Core modification.

### 10.4 Permission and package contract
The platform shall define generic access layering as:
- USER
- PACKAGE
- PERMISSIONS
- MODULE ACCESS
- FEATURE ACCESS

A module may be installed and enabled but still restricted for a specific user or package. This must be evaluated by the platform layer and not hard-coded into domain modules.

The UI must distinguish between:
- not installed
- installed but disabled
- installed but not authorized
- installed and authorized

Package names must remain generic and not be embedded into concrete CatchTrack domain logic.

### 10.5 User interface and menu contract
A module must be able to declare:
- menu label
- icon
- placement
- priority
- visibility
- required permission
- target screen or route
- submenus

The user should be able to later:
- show or hide modules
- reorder modules
- set priorities
- save personal UI preferences
- adjust font size and presentation settings

Hiding a module is not the same as uninstalling it.

### 10.6 Restricted module contract
A user without entitlement may optionally see a module in preview mode. The preview can include:
- description
- feature teaser
- blocked input fields
- upgrade hint
- access requirement explanation

No protected function may be executed without the required authorization.

### 10.7 Connection contract
The platform shall provide a neutral connection abstraction with at least the following conceptual layers:
- Local / Device
- Own Server
- Optional Cloud

No framework element may depend on a specific hosting provider. The connection layer must remain abstract and replaceable.

GPS data should stay local by default unless an explicit future module requires another architecture and documents the reason.

### 10.8 Storage and data abstraction contract
The intended data flow is:
- UI
- Module
- Platform Services
- Storage/Data Abstraction
- Local / Server / Cloud

Modules should not be tightly coupled to a concrete storage location unless a specific module contract requires it. Existing database abstractions must be reused before creating a new storage architecture.

### 10.9 Privacy and data minimization contract
The architecture must keep data minimization as a rule:
- no unnecessary personal data
- pseudonymous user identity preferred
- GPS kept local whenever possible
- only necessary server-side data
- clear data ownership per module
- no unnecessary central collection of personal data

### 10.10 Reuse and store perspective
The platform must support packaging as a neutral, reusable foundation for future apps.

This means:
- neutral platform layer
- CatchTrack as first application
- later other applications on the same base
- generic component naming rather than CatchTrack-specific naming in the framework layer

## 11. Long-term target state
The repository should converge on a clean, modular structure where the core remains stable and extensible, while modules add the domain functionality required by the application. The neutral framework is intended for reuse beyond the fishing domain and beyond the CatchTrack brand, while CatchTrack remains the first concrete app on that foundation.

This project-control structure is intentionally minimal and does not contain operational status or continuation logic.

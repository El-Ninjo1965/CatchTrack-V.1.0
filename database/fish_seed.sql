INSERT OR IGNORE INTO fish
(
    scientific_name,
    family,
    minimum_size,
    record_weight,
    description,
    verified
)

VALUES

(
    'Salmo trutta',
    'Salmonidae',
    25,
    20,
    'Europäische Forelle',
    1
);



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'de',

    'Bachforelle'

FROM fish

WHERE scientific_name = 'Salmo trutta';



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'en',

    'Brown Trout'

FROM fish

WHERE scientific_name = 'Salmo trutta';



/*
==================================================
Karpfen
==================================================
*/


INSERT OR IGNORE INTO fish
(
    scientific_name,
    family,
    minimum_size,
    record_weight,
    description,
    verified
)

VALUES

(
    'Cyprinus carpio',
    'Cyprinidae',
    30,
    45,
    'Karpfenartige Fischart',
    1
);



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'de',

    'Karpfen'

FROM fish

WHERE scientific_name = 'Cyprinus carpio';



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'en',

    'Common Carp'

FROM fish

WHERE scientific_name = 'Cyprinus carpio';



/*
==================================================
Barsch
==================================================
*/


INSERT OR IGNORE INTO fish
(
    scientific_name,
    family,
    minimum_size,
    record_weight,
    description,
    verified
)

VALUES

(
    'Perca fluviatilis',
    'Percidae',
    15,
    3,
    'Europäischer Flussbarsch',
    1
);



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'de',

    'Flussbarsch'

FROM fish

WHERE scientific_name = 'Perca fluviatilis';



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'en',

    'European Perch'

FROM fish

WHERE scientific_name = 'Perca fluviatilis';



/*
==================================================
Hecht
==================================================
*/


INSERT OR IGNORE INTO fish
(
    scientific_name,
    family,
    minimum_size,
    record_weight,
    description,
    verified
)

VALUES

(
    'Esox lucius',
    'Esocidae',
    50,
    25,
    'Raubfisch aus europäischen Gewässern',
    1
);



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'de',

    'Hecht'

FROM fish

WHERE scientific_name = 'Esox lucius';



INSERT OR IGNORE INTO fish_names
(
    fish_id,
    language,
    name
)

SELECT

    id,

    'en',

    'Northern Pike'

FROM fish

WHERE scientific_name = 'Esox lucius';



/*
==================================================
Basis Erweiterungspunkt

Weitere Arten werden später
über Admin-Modul ergänzt.

Keine Core-Änderung notwendig.
==================================================
*/
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0)
);

INSERT INTO products (name, description, price_cents) VALUES
  ('Clavier compact', 'Clavier mecanique compact pour developpeur.', 5990),
  ('Souris precision', 'Souris ergonomique pour poste de travail.', 3490),
  ('Ecran 24 pouces', 'Ecran full HD pour environnement bureautique.', 12990)
ON CONFLICT DO NOTHING;

-- v1.1.0 : ajout NON DESTRUCTIF d'une colonne stock.
-- IF NOT EXISTS + DEFAULT : aucune donnée existante n'est supprimée ni invalidée.
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- Renseigne un stock initial sans toucher aux autres colonnes.
UPDATE products SET stock = 12 WHERE name = 'Clavier compact' AND stock = 0;
UPDATE products SET stock = 30 WHERE name = 'Souris precision' AND stock = 0;
UPDATE products SET stock = 4 WHERE name = 'Ecran 24 pouces' AND stock = 0;

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  preferred_unit TEXT DEFAULT 'celsius', -- 'celsius' ou 'fahrenheit'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lon FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  searched_at TIMESTAMP DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Policies : chaque user accède uniquement à ses données
CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own history"
  ON search_history FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE TABLE petitions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
  user_name text NOT NULL,
  company_name text NOT NULL,
  dpo_email text NOT NULL,
  right_type text NOT NULL,
  petition_text text,
  sent_at timestamp DEFAULT now(),
  status text DEFAULT 'sent'
);

CREATE TABLE tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  petition_id uuid REFERENCES petitions(id),
  user_email text NOT NULL,
  deadline timestamp NOT NULL,
  notif_10_sent boolean DEFAULT false,
  notif_25_sent boolean DEFAULT false,
  result text DEFAULT 'pending'
);

-- Row Level Security (MVP için kapalı tutuyoruz, ileride aktif edilecek)

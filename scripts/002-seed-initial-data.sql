-- Seed initial goals and sample data for iRun MVP

-- Insert sample goals
INSERT INTO public.goals (title, description, goal_type, activity_type, target_value, target_unit, required_plan) VALUES
-- Daily goals
('Corrida Diária 5km', 'Complete 5km de corrida em um dia', 'daily', 'running', 5.00, 'km', 'free'),
('Corrida Diária 10km', 'Complete 10km de corrida em um dia', 'daily', 'running', 10.00, 'km', 'basic'),
('Queima Diária 500 cal', 'Queime 500 calorias em um dia', 'daily', 'any', 500.00, 'calories', 'free'),

-- Weekly goals
('Corrida Semanal 20km', 'Complete 20km de corrida na semana', 'weekly', 'running', 20.00, 'km', 'free'),
('Corrida Semanal 50km', 'Complete 50km de corrida na semana', 'weekly', 'running', 50.00, 'km', 'basic'),
('Ciclismo Semanal 100km', 'Complete 100km de ciclismo na semana', 'weekly', 'cycling', 100.00, 'km', 'premium'),

-- Monthly goals
('Corrida Mensal 100km', 'Complete 100km de corrida no mês', 'monthly', 'running', 100.00, 'km', 'free'),
('Corrida Mensal 200km', 'Complete 200km de corrida no mês', 'monthly', 'running', 200.00, 'km', 'basic'),
('Natação Mensal 20km', 'Complete 20km de natação no mês', 'monthly', 'swimming', 20.00, 'km', 'premium'),

-- Caloric goals
('Queima Total 5000 cal', 'Queime 5000 calorias acumuladas', 'caloric', 'any', 5000.00, 'calories', 'free'),
('Queima Total 10000 cal', 'Queime 10000 calorias acumuladas', 'caloric', 'any', 10000.00, 'calories', 'basic')
ON CONFLICT DO NOTHING;

-- Insert sample partner
INSERT INTO public.partners (name, cnpj, email, phone, category, city, state) VALUES
('Loja Exemplo Fitness', '12.345.678/0001-90', 'contato@exemplofit.com', '(11) 98765-4321', 'Esportes', 'São Paulo', 'SP')
ON CONFLICT DO NOTHING;

-- Insert sample coupon (linked to first goal and first partner)
INSERT INTO public.coupons (partner_id, goal_id, title, description, discount_type, discount_value, terms, valid_from, valid_until, max_redemptions) VALUES
(1, 1, '10% OFF em Tênis', 'Ganhe 10% de desconto na compra de tênis de corrida', 'percentage', 10.00, 'Válido para compras acima de R$ 200', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 100)
ON CONFLICT DO NOTHING;

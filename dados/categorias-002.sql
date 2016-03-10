
UPDATE public.sub_categorias SET limite_minimo = 11, limite_maximo = 12
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Juvenil') AND nome = '11-12';
UPDATE public.sub_categorias SET limite_minimo = 13, limite_maximo = 14
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Juvenil') AND nome = '13-14';
UPDATE public.sub_categorias SET limite_minimo = 15, limite_maximo = 16
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Juvenil') AND nome = '15-16';
UPDATE public.sub_categorias SET limite_minimo = 17, limite_maximo = 17
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Juvenil') AND nome = '17-18';

UPDATE public.sub_categorias SET limite_maximo = 23
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Senior') AND nome = 'Sub-23';
UPDATE public.sub_categorias SET limite_maximo = 23
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Senior') AND nome = 'Sub-23 Peso Leve';


UPDATE public.sub_categorias SET limite_minimo = 27, limite_maximo = 34
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '27-34';
UPDATE public.sub_categorias SET limite_minimo = 35, limite_maximo = 39
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '35-39';
UPDATE public.sub_categorias SET limite_minimo = 40, limite_maximo = 49
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '40-49';
UPDATE public.sub_categorias SET limite_minimo = 50, limite_maximo = 59
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '50-59';
UPDATE public.sub_categorias SET limite_minimo = 60, limite_maximo = 69
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '60-69';
UPDATE public.sub_categorias SET limite_minimo = 70, limite_maximo = 79
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '70-79';
UPDATE public.sub_categorias SET limite_minimo = 70
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '70+';
UPDATE public.sub_categorias SET limite_minimo = 80
  WHERE categoria_id = (SELECT id from public.categorias WHERE nome='Master') AND nome = '80+';


INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'MA', 'I', id, 1, 10, '2016-04-01 15:00', 1 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'FE', 'I', id, 1, 10, '2016-04-01 15:10', 2 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 10, '2016-04-01 15:20', 3 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 10, '2016-04-01 15:30', 4 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MA', 'I', id, 1, 15, '2016-04-01 15:40', 5 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'FE', 'I', id, 1, 15, '2016-04-01 15:55', 6 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 5, '2016-04-01 15:55', 7, 'Intervalo');


INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'D', id, 1, 20, '2016-04-01 16:00', 8 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'D', id, 1, 20, '2016-04-01 16:20', 9 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MI', 'D', id, 1, 20, '2016-04-01 16:40', 10 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    SELECT 2000, 'MI', 'R', 4, id, 1, 15, '2016-04-01 17:00', 11, '3 Homens + 1 Mulher' FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 5, '2016-04-01 17:15', 12, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 4000, 'AB', 'R', 8, id, 1, 30, '2016-04-01 17:20', 13 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    SELECT 2000, 'AB', 'R', 30, id, 1, 20, '2016-04-01 17:50', 14, 'Ski - Duelo' FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'AB', 'R', 30, id, 1, 20, '2016-04-01 18:10', 15 FROM sub_categorias WHERE categoria_id = 4 and nome = 'Aberto';


INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '35-39';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '35-39';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '40-49';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '40-49';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '50-59';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '50-59';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '60-69';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '60-69';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '70+';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = '70+';

INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MI', 'R', 30, id, 1, 20, '2016-04-02 10:20', 1 FROM sub_categorias WHERE categoria_id = 3 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 20, '2016-04-02 10:40', 2, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'MA', 'I', id, 1, 10, '2016-04-02 11:00', 3 FROM sub_categorias WHERE categoria_id = 1 and nome = '11-12';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'FE', 'I', id, 1, 10, '2016-04-02 11:10', 4 FROM sub_categorias WHERE categoria_id = 1 and nome = '11-12';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'MA', 'I', id, 1, 10, '2016-04-02 11:20', 5 FROM sub_categorias WHERE categoria_id = 1 and nome = '13-14';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'FE', 'I', id, 1, 10, '2016-04-02 11:30', 6 FROM sub_categorias WHERE categoria_id = 1 and nome = '13-14';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MA', 'I', id, 1, 15, '2016-04-02 11:40', 7 FROM sub_categorias WHERE categoria_id = 1 and nome = '15-16';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'FE', 'I', id, 1, 15, '2016-04-02 11:55', 8 FROM sub_categorias WHERE categoria_id = 1 and nome = '15-16';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MA', 'I', id, 1, 15, '2016-04-02 12:10', 9 FROM sub_categorias WHERE categoria_id = 1 and nome = '17-18';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'FE', 'I', id, 1, 15, '2016-04-02 12:25', 10 FROM sub_categorias WHERE categoria_id = 1 and nome = '17-18';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 15, '2016-04-02 12:40', 11, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MA', 'I', id, 1, 15, '2016-04-02 12:55', 12 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Sub-23';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'FE', 'I', id, 1, 15, '2016-04-02 13:10', 13 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Sub-23';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'MA', 'I', id, 1, 20, '2016-04-02 13:25', 14 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 2000, 'FE', 'I', id, 1, 20, '2016-04-02 13:45', 15 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 10, '2016-04-02 14:05', 16, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MI', 'I', id, 1, 20, '2016-04-02 14:15', 17 FROM sub_categorias WHERE categoria_id = 5 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 10, '2016-04-02 14:35', 18, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 14:45', 19 FROM sub_categorias WHERE categoria_id = 1 and nome = '15-16';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 15:05', 20 FROM sub_categorias WHERE categoria_id = 1 and nome = '15-16';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 15:15', 21 FROM sub_categorias WHERE categoria_id = 1 and nome = '17-18';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 15:35', 22 FROM sub_categorias WHERE categoria_id = 1 and nome = '17-18';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 10, '2016-04-02 15:55', 23, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 10, '2016-04-02 16:05', 24 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Sub-23';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 10, '2016-04-02 16:15', 25 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Sub-23';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MA', 'I', id, 1, 20, '2016-04-02 16:25', 26 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'FE', 'I', id, 1, 20, '2016-04-02 16:45', 27 FROM sub_categorias WHERE categoria_id = 2 and nome = 'Aberto';

INSERT INTO public.provas (distancia, evento_id, tempo_execucao, data_inicio, ordem, observacao)
    VALUES (0, 1, 10, '2016-04-02 17:05', 28, 'Intervalo');

INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 500, 'MI', 'R', 2, id, 1, 20, '2016-04-02 17:15', 29 FROM sub_categorias WHERE categoria_id = 6 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 1000, 'MI', 'R', 4, id, 1, 10, '2016-04-02 17:35', 30 FROM sub_categorias WHERE categoria_id = 6 and nome = 'Aberto';
INSERT INTO public.provas (distancia, sexo, tipo, revezamento, sub_categoria_id, evento_id, tempo_execucao, data_inicio, ordem)
    SELECT 5000, 'MI', 'R', 30, id, 1, 30, '2016-04-02 17:45', 31 FROM sub_categorias WHERE categoria_id = 6 and nome = 'Aberto';

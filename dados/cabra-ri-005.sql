INSERT INTO public.cursos (evento_id, nome, data_inicio, duracao)
    select id, 'CURSO Introdutório de Remo Indoor', '2016-04-01 10:00', 210 from public.eventos where slug = 'cabra-ri';

INSERT INTO public.cursos (evento_id, nome, data_inicio, duracao)
    select id, 'CURSO de Especialização', '2016-04-02 10:00', 230 from public.eventos where slug = 'cabra-ri';
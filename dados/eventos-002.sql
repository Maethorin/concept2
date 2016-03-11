UPDATE public.eventos SET
    descricao = '
    <div class="row">
    <div class="col-md-12">
    <p>O 8º Campeonato Brasileiro de Remo Indoor é o maior festival de Remo Indoor do Brasil, com 2 dias de evento, diversas categorias por idade, provas coletivas e um grande prêmio para a equipe campeã.</p>
    </div>
    </div>

    <div class="row">
    <div class="col-md-8">
    <img src="/static/img/eventos/cabra-ri/premio.jpg" />
    </div>
    <div class="col-md-4">
    <p>A equipe campeã ganhará um Remo Indoor Concept2 Modelo D. Para conseguir vencer o campeonato é necessário fazer o maior número de pontos. Todas as colocações ganham pontos, então quanto mais integrantes uma equipe tiver, maior as chances. Quanto mais alta a colocação, mais pontos. Confira a tabela.</p>
    </div>
    </div>

    <div class="row">
    <div class="col-md-12">
    <img src="/static/img/eventos/cabra-ri/tabeladepontos.jpg" />
    </div>
    </div>

    <div class="row">
    <div class="col-md-12">
    <p>Além das provas individuais, o CaBra-RI conta com provas em equipes, de duplas, quadras e revezamentos, que incluem um número ilimitado de pessoas, e valem mais pontos. Essas provas são as mais divertidas e emocionantes do campeonato.</p>
    <p>O primeiro dia conta com as competições para o público aberto, especialmente academias e boxes de CrossFit. As provas são de categoria de idade aberta, com distâncias de 500m, 1000m e 2000m para as provas individuais, além de contar com as provas coletivas. A equipe vencedora desse dia ganhará a máquina de Remo Indoor de prêmio.</p>
    </div>
    </div>

    <div class="row">
    <div class="col-md-4">
    <p>O segundo dia tem as provas individuais com as categorias oficiais do remo olímpico, separadas por idade. Há medalhas de 1º a 3º lugar para cada prova.</p>
    <p>Os tempos entrarão em breve no nosso ranking online.</p>
    </div>
    <div class="col-md-8">
    <img src="/static/img/eventos/cabra-ri/medalha.jpg" />
    </div>
    </div>

    <div class="row">
    <div class="col-md-12">
    <p>As máquinas usadas durante o evento estarão à venda a um preço especial. Entre em contato e faça sua pré-compra!</p>
    <img src="/static/img/eventos/cabra-ri/promocao-remoindoor.jpg" />
    </div>
    </div>
    '
WHERE slug = 'cabra-ri';

UPDATE public.eventos SET
    pontuacao = '[
  {"nome":"1x- individual", "pontuacao":[{"colocacao": 1, "pontos":10}, {"colocacao": 2, "pontos":8}, {"colocacao": 3, "pontos":6}, {"colocacao": 4, "pontos":5}, {"colocacao": 5, "pontos":4}, {"colocacao": 6, "pontos":3}, {"colocacao": 7, "pontos":2}, {"colocacao": 8, "pontos":1}]},
  {"nome":"2x- dupla",  "pontuacao":[{"colocacao": 1, "pontos":20}, {"colocacao": 2, "pontos":16}, {"colocacao": 3, "pontos":12}, {"colocacao": 4, "pontos":10}, {"colocacao": 5, "pontos":8}, {"colocacao": 6, "pontos":6}, {"colocacao": 7, "pontos":4}, {"colocacao": 8, "pontos":2}]},
  {"nome":"4x- quadra",  "pontuacao":[{"colocacao": 1, "pontos":40}, {"colocacao": 2, "pontos":32}, {"colocacao": 3, "pontos":24}, {"colocacao": 4, "pontos":20}, {"colocacao": 5, "pontos":16}, {"colocacao": 6, "pontos":12}, {"colocacao": 7, "pontos":8}, {"colocacao": 8, "pontos":4}]},
  {"nome":"Revezamento Aberto",  "pontuacao":[{"colocacao": 1, "pontos":80}, {"colocacao": 2, "pontos":64}, {"colocacao": 3, "pontos":48}, {"colocacao": 4, "pontos":40}, {"colocacao": 5, "pontos":32}, {"colocacao": 6, "pontos":24}, {"colocacao": 7, "pontos":16}, {"colocacao": 8, "pontos":8}]}
]'
WHERE slug = 'cabra-ri';

UPDATE public.eventos SET
    resumo = 'O 8º Campeonato Brasileiro de Remo Indoor é o maior festival de Remo Indoor do Brasil, com 2 dias de evento, diversas categorias por idade, provas coletivas e um grande prêmio para a equipe campeã.'
WHERE slug = 'cabra-ri';

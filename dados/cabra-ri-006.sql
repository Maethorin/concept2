UPDATE public.eventos SET
  url_pagamento_provas = 'https://concept2.com.br/shop/index.php?route=product/product&product_id=125',
  url_pagamento_cursos = 'https://concept2.com.br/shop/index.php?route=product/product&product_id=170'
WHERE slug = 'cabra-ri';

UPDATE public.cursos SET valor = 40000, url_pagamento = 'http://concept2.com.br/shop/index.php?route=product/product&product_id=127' WHERE nome = 'CURSO Introdutório de Remo Indoor';

UPDATE public.cursos SET valor = 40000, url_pagamento = 'http://concept2.com.br/shop/index.php?route=product/product&product_id=169' WHERE nome = 'CURSO de Especialização';
# Conteúdo pastoral do Meu Púlpito (devocional, sugestões de pregação, manual do ministro)

Regras para todo o conteúdo (o dono é pastor da Assembleia de Deus no Paraguai; o público são pastores evangélicos em PT e ES):
- Bilíngue: cada texto é um par [ES, PT]. Espanhol trata o leitor de "usted" (nunca "tú"); português do Brasil, "você".
- Teologia evangélica pentecostal clássica, linguagem respeitosa e simples, sem polêmicas denominacionais.
- Nunca inventar fatos, números, datas ou significados. Citações bíblicas próximas da Reina-Valera 1909 (ES) e da Bíblia Livre/Almeida (PT).
- Referências bíblicas no formato "livro.capítulo.versículo" com livro 0-based (Gênesis=0, Mateus=39, Apocalipse=65); intervalo "42.15.5-7".
  Toda referência precisa existir em app/biblia/pt-livre.json E app/biblia/es-rv1909.json (lista de livros → capítulos → versículos).
  Leia o texto do versículo antes de usar (imprima-o) para garantir que ele diz o que você afirma.
- Sem emojis. Sem títulos sensacionalistas.
- Cada arquivo de saída é JSON UTF-8 compacto, gravado por um script Python em tools/conteudo/ que também valida as referências.

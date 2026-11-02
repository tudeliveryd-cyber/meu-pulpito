# Meu Púlpito

Bloco de notas para escrever sermões e pregar com eles: cores por parte (texto base, introdução, pontos, conclusão), modo Pregar com letra grande, rolagem automática, modo esboço, cronômetro por parte, histórico de pregações, séries e busca por versículo.

- Os sermões ficam no Firebase (mesmo projeto da Tú Delivery, coleção `pulpito/{uid}`), protegidos pelas regras em `firestore-regra-pulpito.txt`.
- Versículos embutidos: Reina-Valera 1909 (domínio público) e Bíblia Livre (licença livre CC BY), via scrollmapper/bible_databases.
- Este repositório tem só o código do app; não contém sermões.
- Se a regra `pulpito` ainda não estiver no Firestore, o app guarda em `empresa/pulpito/{uid}` (área que o dono e os sócios já podem usar).

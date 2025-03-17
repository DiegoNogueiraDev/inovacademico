# Guia para Converter Referências sobre Artrite Reumatoide

Este guia mostra como converter referências bibliográficas no formato ABNT para o formato JSON utilizado no sistema Inova Acadêmico, usando como exemplo referências sobre artrite reumatoide.

## Entendendo o formato ABNT e sua conversão

As referências no formato ABNT seguem um padrão específico:

```
SOBRENOME, Nome do autor. Título: subtítulo. Edição. Local de publicação: Editora, data.
```

Para artigos científicos:

```
SOBRENOME, Nome dos autores. Título do artigo. Nome da revista, Local, volume, número, páginas, data.
```

## Como extrair os dados para o formato do sistema

Vamos converter passo a passo uma referência do formato ABNT para o formato JSON utilizado no sistema:

### Exemplo 1: Artigo científico simples

**Formato ABNT:**
```
ADDOBBATI, C. et al. Polymorphisms and expression of inflammasome genes are associated with the development and severity of rheumatoid arthritis in Brazilian patients. Inflammation Research, v. 67, p. 255-264, 2018.
```

**Formato JSON para o sistema:**
```json
{
  "tipo": "artigo",
  "titulo": "Polymorphisms and expression of inflammasome genes are associated with the development and severity of rheumatoid arthritis in Brazilian patients",
  "autores": "Addobbati, C.; Brandão, L. A. C.; Guimarães, R. L.; Pancoto, J. A. T.; Donadi, E. A.; Crovella, S.; Sandrin-Garcia, P.",
  "ano": "2018",
  "revista": "Inflammation Research",
  "volume": "67",
  "paginas": "255-264",
  "paginaInicial": "255",
  "paginaFinal": "264",
  "htmlFormatado": "<p>ADDOBBATI, C. <em>et al</em>. Polymorphisms and expression of inflammasome genes are associated with the development and severity of rheumatoid arthritis in Brazilian patients. <b>Inflammation Research</b>, v. 67, p. 255-264, 2018.</p>"
}
```

### Exemplo 2: Artigo com subtítulo

**Formato ABNT:**
```
ANDERSON, J. et al. Rheumatoid arthritis disease activity measures: American College of Rheumatology recommendations for use in clinical practice. Arthritis Care & Research (Hoboken), v. 64, n. 5, p. 640-647, 2012.
```

**Formato JSON para o sistema:**
```json
{
  "tipo": "artigo",
  "titulo": "Rheumatoid arthritis disease activity measures",
  "subtitulo": "American College of Rheumatology recommendations for use in clinical practice",
  "autores": "Anderson, J.; Caplan, L.; Yazdany, J.; Robbins, M.; Neogi, T.; Michaud, K.; Saag, K.; O'Dell, J.; Kazi, S.",
  "ano": "2012",
  "revista": "Arthritis Care & Research (Hoboken)",
  "volume": "64",
  "numero": "5",
  "paginas": "640-647",
  "paginaInicial": "640",
  "paginaFinal": "647",
  "htmlFormatado": "<p>ANDERSON, J. <em>et al</em>. Rheumatoid arthritis disease activity measures: American College of Rheumatology recommendations for use in clinical practice. <b>Arthritis Care & Research (Hoboken)</b>, v. 64, n. 5, p. 640-647, 2012.</p>"
}
```

### Exemplo 3: Artigo com mês de publicação

**Formato ABNT:**
```
BARTON, A.; WORTHINGTON, J. Genetic susceptibility to rheumatoid arthritis: an emerging picture. Arthritis and Rheumatism, v. 61, n. 10, p. 1441-1446, 15 out. 2009.
```

**Formato JSON para o sistema:**
```json
{
  "tipo": "artigo",
  "titulo": "Genetic susceptibility to rheumatoid arthritis",
  "subtitulo": "an emerging picture",
  "autores": "Barton, A.; Worthington, J.",
  "ano": "2009",
  "revista": "Arthritis and Rheumatism",
  "volume": "61",
  "numero": "10",
  "paginas": "1441-1446",
  "paginaInicial": "1441",
  "paginaFinal": "1446",
  "mes": "15 out.",
  "htmlFormatado": "<p>BARTON, A.; WORTHINGTON, J. Genetic susceptibility to rheumatoid arthritis: an emerging picture. <b>Arthritis and Rheumatism</b>, v. 61, n. 10, p. 1441-1446, 15 out., 2009.</p>"
}
```

## Dicas para extração de campos específicos

### Autores
- Inverter a ordem (Sobrenome, Nome) para (Nome Sobrenome) no campo `autores`
- Separar autores com ponto e vírgula
- Lista completa quando disponível, ou manter "et al" quando necessário

### Título e Subtítulo
- Dividir o título e subtítulo quando existir dois pontos (:)
- Manter apenas a primeira letra maiúscula no título e subtítulo

### Páginas
- Usar o campo `paginas` para o intervalo completo (ex: "255-264")
- Também adicionar `paginaInicial` e `paginaFinal` para facilitar buscas e ordenação

### Campo htmlFormatado
- Este campo deve conter a referência formatada no padrão ABNT com marcação HTML
- Utilize `<b>` para destacar o título da revista
- Utilize `<em>` para destacar o "et al" ou outras expressões em itálico

## Importando para o Sistema

Existem duas maneiras de adicionar suas referências:

1. **Adição Individual**: 
   - Vá para "Adicionar Referência"
   - Selecione o tipo "Artigo"
   - Preencha todos os campos disponíveis

2. **Importação em Lote**: 
   - Prepare um arquivo JSON contendo todas as suas referências no formato mostrado acima
   - Vá para "Importar Referências"
   - Carregue o arquivo JSON

## Exemplos de Referências Específicas sobre Artrite Reumatoide

### Exemplo para Artigo com Título Complexo:

**Formato ABNT:**
```
BEN HAMAD, M. et al. Association study of CARD8 (p. C10X) and NLRP3 (p. Q705K) variants with rheumatoid arthritis in French and Tunisian populations. International Journal of Immunogenetics, v. 39, n. 2, p. 131-136, 2012.
```

**Formato JSON:**
```json
{
  "tipo": "artigo",
  "titulo": "Association study of CARD8 (p. C10X) and NLRP3 (p. Q705K) variants with rheumatoid arthritis in French and Tunisian populations",
  "autores": "Ben Hamad, M.; Cornelis, F.; Mbarek, H.; Chabchoub, G.; Marzouk, S.; Bahloul, Z.; Rebai, A.; Fakhfakh, F.; Gaddour, L.; Maalej, A.",
  "ano": "2012",
  "revista": "International Journal of Immunogenetics",
  "volume": "39",
  "numero": "2",
  "paginas": "131-136",
  "paginaInicial": "131",
  "paginaFinal": "136",
  "htmlFormatado": "<p>BEN HAMAD, M. <em>et al</em>. Association study of CARD8 (p. C10X) and NLRP3 (p. Q705K) variants with rheumatoid arthritis in French and Tunisian populations. <b>International Journal of Immunogenetics</b>, v. 39, n. 2, p. 131-136, 2012.</p>"
}
```

### Exemplo para Site/Conteúdo Online:

**Formato ABNT:**
```
WORLD HEALTH ORGANIZATION. Rheumatoid arthritis. Disponível em: https://www.who.int/news-room/fact-sheets/detail/rheumatoid-arthritis, 2023. Acesso em: 18 maio de 2024.
```

**Formato JSON:**
```json
{
  "tipo": "site",
  "titulo": "Rheumatoid arthritis",
  "autores": "World Health Organization",
  "ano": "2023",
  "url": "https://www.who.int/news-room/fact-sheets/detail/rheumatoid-arthritis",
  "dataAcesso": "2024-05-18",
  "instituicao": "World Health Organization",
  "htmlFormatado": "<p>WORLD HEALTH ORGANIZATION. Rheumatoid arthritis. Disponível em: https://www.who.int/news-room/fact-sheets/detail/rheumatoid-arthritis, 2023. Acesso em: 18 maio de 2024.</p>"
}
```

## Verificações Finais

Antes de importar suas referências, verifique:

1. Se todos os campos obrigatórios estão preenchidos
2. Se o formato do JSON está correto (sem vírgulas extras ou faltantes)
3. Se o campo `htmlFormatado` está corretamente formatado com as tags HTML
4. Se as datas estão no formato correto

Com este guia, você poderá converter suas referências sobre artrite reumatoide do formato ABNT para o formato utilizado no sistema Inova Acadêmico. 
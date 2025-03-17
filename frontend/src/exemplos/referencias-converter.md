# Guia para Converter Referências para o Formato do Sistema

## Exemplos de Conversão

Neste guia, demonstramos como transformar referências do formato padrão ABNT para o formato compatível com nosso sistema, incluindo os campos estruturados e o HTML formatado correspondente.

### Exemplo 1:

**Referência Original:**
```
ADDOBBATI, C. et al. Polymorphisms and expression of inflammasome genes are
associated with the development and severity of rheumatoid arthritis in Brazilian
patients. Inflammation Research, v. 67, p. 255-264, 2018.
```

**Conversão para o Formato do Sistema:**
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

### Exemplo 2:

**Referência Original:**
```
ANDERSON, J. et al. Rheumatoid arthritis disease activity measures: American
College of Rheumatology recommendations for use in clinical practice. Arthritis Care
& Research (Hoboken), v. 64, n. 5, p. 640-647, 2012.
```

**Conversão para o Formato do Sistema:**
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

### Exemplo 3:

**Referência Original:**
```
BARTON, A.; WORTHINGTON, J. Genetic susceptibility to rheumatoid arthritis: an
emerging picture. Arthritis and Rheumatism, v. 61, n. 10, p. 1441-1446, 15 out.
2009.
```

**Conversão para o Formato do Sistema:**
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

### Exemplo 4:

**Referência Original:**
```
BEN HAMAD, M. et al. Association study of CARD8 (p. C10X) and NLRP3 (p.
Q705K) variants with rheumatoid arthritis in French and Tunisian populations.
International Journal of Immunogenetics, v. 39, n. 2, p. 131-136, 2012.
```

**Conversão para o Formato do Sistema:**
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

## Como Importar suas Referências

Para importar suas referências, você pode:

1. **Importação Manual**: Adicione cada referência usando a página "Adicionar Referência", preenchendo todos os campos detalhados.

2. **Importação em Lote**:
   - Converta suas referências para o formato JSON, seguindo os exemplos acima
   - Use a página "Importar Referências" e envie o arquivo JSON
   - Alternativamente, cole o conteúdo JSON diretamente na área de texto

3. **Importação com HTML Formatado**:
   - Certifique-se de incluir o campo `htmlFormatado` para cada referência
   - Ative a opção "Preservar formatação HTML" na página de importação

## Dicas para Formatação

- Use ponto e vírgula (`;`) para separar autores
- Inclua o sobrenome, seguido de vírgula e depois as iniciais do nome
- Para artigos com subtítulos, separe-os do título principal
- Números de páginas podem ser incluídos como intervalo completo (`paginas`) ou como páginas inicial e final separadas (`paginaInicial` e `paginaFinal`)
- Inclua o DOI quando disponível para facilitar a identificação do artigo

Para mais informações ou assistência, utilize nossa função de visualização prévia na página "Adicionar Referência" para verificar como sua referência será formatada antes de salvar. 
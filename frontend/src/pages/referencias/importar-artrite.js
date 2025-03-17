import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import Navegacao from '../../components/Navegacao';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import artriteReferencias from '../../exemplos/referencias-artrite.json';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImportarArtrite = () => {
  const [json, setJson] = useState('');
  const [erro, setErro] = useState('');
  const [importacaoSucesso, setImportacaoSucesso] = useState(false);
  const [referencias, setReferencias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleImportarJson = () => {
    try {
      setErro('');
      const parsedJson = JSON.parse(json);
      
      if (!Array.isArray(parsedJson)) {
        setErro('O JSON deve ser um array de objetos');
        return;
      }
      
      setReferencias(parsedJson);
      setImportacaoSucesso(true);
    } catch (error) {
      setErro('Erro ao processar o JSON: ' + error.message);
    }
  };

  const handleSalvarReferencias = async () => {
    try {
      setCarregando(true);
      // A API endpoint real seria usada aqui
      // await axios.post('/api/referencias/importar', { referencias });
      
      // Simulação de sucesso
      setTimeout(() => {
        setCarregando(false);
        toast.success('Referências importadas com sucesso!');
        // router.push('/referencias');
      }, 1500);
    } catch (error) {
      setCarregando(false);
      setErro('Erro ao salvar referências: ' + error.message);
    }
  };

  const handlePrepararExemplos = () => {
    setJson(JSON.stringify(artriteReferencias, null, 2));
  };

  return (
    <>
      <Navegacao />
      <Container className="my-4">
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h2>Importação de Referências sobre Artrite Reumatoide</h2>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h4>Importar Referências Específicas sobre Artrite Reumatoide</h4>
              <p>
                Esta página permite importar várias referências sobre artrite reumatoide de uma vez através de um arquivo JSON.
                Você pode usar esta funcionalidade para adicionar rapidamente referências sobre artrite reumatoide e temas relacionados ao sistema.
              </p>

              <div className="p-3 bg-light rounded border mb-4">
                <h5>Como utilizar esta ferramenta:</h5>
                <ol>
                  <li>Prepare um arquivo JSON com suas referências seguindo o formato exemplificado abaixo</li>
                  <li>Cole o conteúdo do arquivo JSON no campo de texto</li>
                  <li>Clique em "Processar JSON" para validar o formato</li>
                  <li>Após validação, clique em "Importar Referências" para adicionar ao sistema</li>
                </ol>
                <Button 
                  variant="outline-primary" 
                  onClick={handlePrepararExemplos}
                  className="mt-2"
                >
                  Carregar Exemplos de Referências
                </Button>
              </div>

              <div className="mb-4">
                <h5>Formato esperado:</h5>
                <pre className="bg-light p-3 rounded">
{`[
  {
    "tipo": "artigo",
    "titulo": "NLRP3 gene polymorphisms and expression in rheumatoid arthritis",
    "autores": "Cheng, L.; Zhang, X.; Li, Y.; Wang, P.; Du, Z.",
    "ano": "2021",
    "revista": "Experimental and Therapeutic Medicine",
    "volume": "22",
    "numero": "4",
    "paginas": "1-9",
    "paginaInicial": "1",
    "paginaFinal": "9",
    "htmlFormatado": "<p>CHENG, L. <em>et al</em>. NLRP3 gene polymorphisms and expression in rheumatoid arthritis. <b>Experimental and Therapeutic Medicine</b>, v. 22, n. 4, p. 1-9, 2021.</p>"
  },
  // Mais referências...
]`}
                </pre>
              </div>

              <div className="p-3 mb-4" style={{background: 'linear-gradient(to right, #e6f7ff, #f0f5ff)'}}>
                <h5>Campos específicos para artigos sobre artrite reumatoide:</h5>
                <ul>
                  <li><strong>subtitulo</strong> - Para artigos com subtítulos (após os dois pontos no título)</li>
                  <li><strong>paginaInicial</strong> e <strong>paginaFinal</strong> - Além do campo pages, para facilitar buscas e ordenação</li>
                  <li><strong>doi</strong> - Identificador de objetos digitais (quando disponível)</li>
                  <li><strong>mes</strong> - Para quando o mês de publicação é relevante</li>
                  <li><strong>notaAdicional</strong> - Informações especiais sobre o artigo (ex: publicado originalmente em outra língua)</li>
                </ul>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Cole seu JSON aqui:</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={10} 
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                    placeholder="Cole seu JSON aqui..."
                  />
                </Form.Group>

                {erro && (
                  <Alert variant="danger">{erro}</Alert>
                )}

                {!importacaoSucesso ? (
                  <Button 
                    variant="primary" 
                    onClick={handleImportarJson}
                  >
                    Processar JSON
                  </Button>
                ) : (
                  <>
                    <Alert variant="success">
                      {referencias.length} referências processadas com sucesso! 
                      Clique em "Importar Referências" para adicionar ao sistema.
                    </Alert>
                    <Button 
                      variant="success" 
                      onClick={handleSalvarReferencias}
                      disabled={carregando}
                    >
                      {carregando ? 'Importando...' : 'Importar Referências'}
                    </Button>
                  </>
                )}
              </Form>
            </div>

            <div className="mt-5 pt-3 border-top">
              <h4>Guia de Conversão de Referências ABNT</h4>
              <p>
                Para converter referências do formato ABNT para o formato do sistema, consulte nosso 
                <Link href="/referencias/guia-converter-artrite">
                  <a target="_blank" rel="noopener noreferrer"> guia detalhado</a>
                </Link>.
              </p>
              
              <h5 className="mt-4">Exemplos de Conversão:</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Formato ABNT:</h6>
                    <p>ADDOBBATI, C. et al. Polymorphisms and expression of inflammasome genes are associated with the development and severity of rheumatoid arthritis in Brazilian patients. Inflammation Research, v. 67, p. 255-264, 2018.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Formato JSON:</h6>
                    <pre style={{fontSize: '0.8rem'}}>
{`{
  "tipo": "artigo",
  "titulo": "Polymorphisms and expression of inflammasome genes...",
  "autores": "Addobbati, C.; Brandão, L. A. C.; ...",
  "ano": "2018",
  "revista": "Inflammation Research",
  "volume": "67",
  "paginas": "255-264"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default ImportarArtrite; 
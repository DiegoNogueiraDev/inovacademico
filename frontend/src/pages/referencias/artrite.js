import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import Navegacao from '../../components/Navegacao';
import Footer from '../../components/Footer';
import Link from 'next/link';
import artriteReferencias from '../../exemplos/referencias-artrite.json';

const Artrite = () => {
  const [referencias, setReferencias] = useState([]);
  const [filteredRefs, setFilteredRefs] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('ano');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      const refs = artriteReferencias;
      setReferencias(refs);
      setFilteredRefs(refs);
      
      // Extrair temas/categorias das referências
      const temas = extrairCategorias(refs);
      setCategorias(['todas', ...temas]);
      
      setLoading(false);
    }, 800);
  }, []);

  // Função para extrair categorias baseadas em palavras-chave dos títulos
  const extrairCategorias = (refs) => {
    const categoriasMap = {
      'NLRP3': 'Inflamassoma NLRP3',
      'inflammasome': 'Inflamassoma',
      'polymorphism': 'Polimorfismos genéticos',
      'SNP': 'Polimorfismos genéticos',
      'gene': 'Genética',
      'genetic': 'Genética',
      'susceptibility': 'Susceptibilidade',
      'biomarker': 'Biomarcadores',
      'activity': 'Atividade da doença',
      'treatment': 'Tratamento',
      'severity': 'Severidade da doença',
      'IL': 'Interleucinas',
      'interleukin': 'Interleucinas',
      'TNF': 'Fatores de Necrose Tumoral',
      'COVID': 'COVID-19'
    };

    const categoriasEncontradas = new Set();
    
    refs.forEach(ref => {
      const titulo = ref.titulo.toLowerCase();
      
      Object.keys(categoriasMap).forEach(keyword => {
        if (titulo.includes(keyword.toLowerCase())) {
          categoriasEncontradas.add(categoriasMap[keyword]);
        }
      });
    });
    
    return Array.from(categoriasEncontradas).sort();
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...referencias];
    
    // Filtrar por categoria
    if (selectedCategoria !== 'todas') {
      const categoriasMap = {
        'Inflamassoma NLRP3': ['nlrp3'],
        'Inflamassoma': ['inflammasome'],
        'Polimorfismos genéticos': ['polymorphism', 'snp', 'variant'],
        'Genética': ['gene', 'genetic'],
        'Susceptibilidade': ['susceptibility'],
        'Biomarcadores': ['biomarker'],
        'Atividade da doença': ['activity', 'severity'],
        'Tratamento': ['treatment', 'therapeutic'],
        'Severidade da doença': ['severity'],
        'Interleucinas': ['il', 'interleukin'],
        'Fatores de Necrose Tumoral': ['tnf'],
        'COVID-19': ['covid']
      };
      
      const keywords = categoriasMap[selectedCategoria] || [];
      filtered = filtered.filter(ref => {
        const tituloLower = ref.titulo.toLowerCase();
        return keywords.some(keyword => tituloLower.includes(keyword));
      });
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ref => 
        ref.titulo.toLowerCase().includes(searchLower) || 
        ref.autores.toLowerCase().includes(searchLower) ||
        (ref.revista && ref.revista.toLowerCase().includes(searchLower))
      );
    }
    
    // Ordenar os resultados
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'ano') {
        aValue = parseInt(a.ano);
        bValue = parseInt(b.ano);
      } else if (sortBy === 'titulo') {
        aValue = a.titulo;
        bValue = b.titulo;
      } else if (sortBy === 'autores') {
        aValue = a.autores;
        bValue = b.autores;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredRefs(filtered);
  }, [referencias, searchTerm, selectedCategoria, sortBy, sortOrder]);

  return (
    <>
      <Navegacao />
      <Container className="my-4">
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h2>Referências sobre Artrite Reumatoide</h2>
            <Link href="/referencias/importar-artrite" className="btn btn-light">
              Importar Referências
            </Link>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando referências...</p>
              </div>
            ) : (
              <>
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Buscar:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por título, autor ou revista..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Categoria:</Form.Label>
                      <Form.Select
                        value={selectedCategoria}
                        onChange={(e) => setSelectedCategoria(e.target.value)}
                      >
                        {categorias.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Ordenar por:</Form.Label>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="ano">Ano</option>
                        <option value="titulo">Título</option>
                        <option value="autores">Autores</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Ordem:</Form.Label>
                      <Form.Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="desc">Decrescente</option>
                        <option value="asc">Crescente</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mb-3">
                  <h5>
                    <Badge bg="secondary">
                      {filteredRefs.length} referências encontradas
                    </Badge>
                  </h5>
                </div>

                {filteredRefs.length === 0 ? (
                  <Alert variant="info">
                    Nenhuma referência encontrada com os filtros selecionados.
                  </Alert>
                ) : (
                  <div className="referencias-list">
                    {filteredRefs.map((ref, index) => (
                      <Card key={index} className="mb-3 shadow-sm">
                        <Card.Body>
                          <h5>{ref.titulo}</h5>
                          {ref.subtitulo && <h6 className="text-muted">{ref.subtitulo}</h6>}
                          <p className="mb-1">
                            <strong>Autores:</strong> {ref.autores}
                          </p>
                          {ref.revista && (
                            <p className="mb-1">
                              <strong>Revista:</strong> {ref.revista}, {ref.ano}
                              {ref.volume && `, v. ${ref.volume}`}
                              {ref.numero && `, n. ${ref.numero}`}
                              {ref.paginas && `, p. ${ref.paginas}`}
                            </p>
                          )}
                          {ref.htmlFormatado && (
                            <div className="mt-2 p-2 bg-light rounded">
                              <strong>Formatação ABNT:</strong>
                              <div dangerouslySetInnerHTML={{ __html: ref.htmlFormatado }} />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Artrite; 
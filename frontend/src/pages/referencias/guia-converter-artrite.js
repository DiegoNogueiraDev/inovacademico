import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import Navegacao from '../../components/Navegacao';
import Footer from '../../components/Footer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const GuiaConverterArtrite = () => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando o carregamento do arquivo markdown
    fetch('/exemplos/guia-converter-artrite.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar o guia:', error);
        setLoading(false);
        setMarkdown('# Erro ao carregar o guia\n\nPor favor, tente novamente mais tarde.');
      });
  }, []);

  return (
    <>
      <Navegacao />
      <Container className="my-4">
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h2>Guia de Conversão de Referências sobre Artrite Reumatoide</h2>
            <Link href="/referencias/artrite">
              <a className="btn btn-light">Voltar para Referências</a>
            </Link>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Carregando guia...</p>
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default GuiaConverterArtrite; 
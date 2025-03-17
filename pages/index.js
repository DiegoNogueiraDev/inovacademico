import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>DevNogueira</title>
        <meta name="description" content="Projeto DevNogueira" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bem-vindo ao <span className="text-rose-500">DevNogueira</span>
        </h1>
        
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <p className="text-gray-300 mb-4">
            O ambiente foi configurado com sucesso! Você já pode começar a desenvolver seu projeto.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://nextjs.org/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Documentação do Next.js
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 
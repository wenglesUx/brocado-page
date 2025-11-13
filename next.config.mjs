/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
       {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
  // Configurações para manter a estrutura de pastas original
  // O Next.js usa a pasta 'app' por padrão, o que parece ser o caso aqui.
  // Se a pasta principal fosse 'client', seria necessário:
  // experimental: {
  //   appDir: true,
  //   basePath: '/client',
  // },
  // Mas a estrutura parece ser compatível com o App Router.

  // Configuração para o Tailwind CSS
  // O Next.js lida com PostCSS/Tailwind nativamente.
  // Certifique-se de que o arquivo postcss.config.js (ou .mjs) esteja correto.

  // Adicionar outras configurações conforme necessário, por exemplo, para imagens ou i18n.
  // output: 'standalone', // Se for necessário para docker
};

export default nextConfig;

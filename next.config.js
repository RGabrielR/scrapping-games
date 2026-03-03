/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "votaciones.hcdn.gob.ar",
      "senado.gob.ar",
      "www.senado.gob.ar",
      "encrypted-tbn0.gstatic.com",
      "encrypted-tbn1.gstatic.com",
      "encrypted-tbn2.gstatic.com",
      "encrypted-tbn3.gstatic.com",
      "img.freepik.com",
      "pixabay.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;

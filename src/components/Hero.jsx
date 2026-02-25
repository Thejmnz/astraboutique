export default function Hero() {
  return (
    <section className="relative pt-20 pb-12 overflow-hidden">
      <div className="hero-gradient absolute inset-0 -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-4">
          Colecciones <span className="font-display italic text-primary font-semibold">Estéticas</span>
          <br />
          <span className="block">con el Nuevo Estilo</span>
        </h1>
        <p className="text-gray-500 text-sm tracking-wide mb-16">
          Enfoque en calidad y estética.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="relative group cursor-pointer overflow-hidden rounded-3xl aspect-[4/5] bg-gray-100">
            <img
              alt="Estilo minimalista moderno"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOfBYS4ghdJNaxgoP4KKT3r-PIr0nRoL2arKOnMTWjcK7m-WJXcP8Defp2KG5IzEXhMiP8BR5AHdYUXAwvcJ3BDqKYo-SvXsuclj2riS8__ficKcb4zUE6eabSuEXe0xIU5OR9NdHF4wuK1Mdm5czwy_qJAUgGzrz2vgymrgynYcZUNLg5hCzvKogROgLxUrnjwdtrMboYesKK8VFIBzBkw3ahx5ToYEFQFKSc8igffCsXBzmQmv_BpmOZpc8tpd0xrouF1lG-9EM"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="relative group cursor-pointer overflow-hidden rounded-3xl aspect-[4/3] bg-gray-100">
              <img
                alt="Detalle de blusa elegante blanca"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX7E-MPop6QY7Xes7dmTFmq_lvK_qi53DupM0JfX_qdKyt7hdFdEYCXHT4ZwDMrd9nbQklnI5RXwnCoGuc2alVonFp-rKh-JbeYuw80VzEEJ7FguZNF8Tzxo3qXQLn-6aiYFQtcAdqKVRn79FGszH2-3M_h3Tug60wqAOw88LZDqz3Iwn1brxJ2vinnUxKd7v7_DX5FxGNEc9YakdfKi8VSrxZhshNbi7--rYwTbbsGr2lwd4ggWBarQKjj-7TF1DpxwvETniv2WY"
              />
            </div>
            <div className="text-center px-4">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-[280px] mx-auto">
                Descubre una amplia gama de opciones de moda, incluyendo ropa, zapatos, accesorios y más
              </p>
              <a
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                href="#"
              >
                COMPRAR AHORA
                <span className="material-icons-outlined text-sm">chevron_right</span>
              </a>
            </div>
          </div>
          <div className="relative group cursor-pointer overflow-hidden rounded-3xl aspect-[4/5] bg-gray-100">
            <img
              alt="Outfit de chaqueta beige elegante"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSsZI1USbLK6772ho9d7NMOaGAdWVCRFoLgWzc8DRaLgL24IWYe7vEC0Mv1MlV1WEzN2-vXE1s11AS4UgPa0jTfuYTxQyQrIQhaBBu9M5w6iLLBT-ejF9t6hXw1aiQxY2_gRvBV6NtQr68HK0dr-iYwMpcQjXk6avR9x-8rTZ61G0vPrUjK7bac5DZU9ZRuV6mCcUZMvUb6NJEe54Ggxudu1bXI7FHNPYiGAUbqPJVY_zGjqDhPvTHM6oIL98b4mqtWQyV1F-37N0"
            />
          </div>
          <button className="absolute top-1/2 left-[64%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300 z-20">
            <span className="material-icons-outlined text-3xl mb-1">north_east</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Explorar</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-b border-orange-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <img 
            src="./Catedral-Logo-Naranja-Original.png"
            alt="Catedral Farmacias Logo" 
            className="h-24 md:h-32 object-contain"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl text-orange-600 mb-2">
              Bienvenido a CATEFARM
            </h2>
            <p className="text-gray-700 text-lg">
              Tu farmacia de confianza, siempre cerca de ti
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

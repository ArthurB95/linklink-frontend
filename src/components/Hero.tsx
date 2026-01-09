import { Sparkles, Link2, QrCode } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Transforme sua presença digital</span>
          </div>
          
          <h1 className="mb-6 tracking-tight">
            <span className="block">Seus links,</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              sua identidade digital
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto mb-10 text-purple-100 text-lg">
            Crie uma página de bio elegante, encurte links e gere QR codes.
            Tudo em um só lugar para conectar você ao seu público de forma memorável.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-full hover:scale-105 transition-transform shadow-xl hover:shadow-2xl">
              Começar Agora 🚀
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full hover:bg-white/20 transition-all">
              Ver Exemplos
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-16 border-t border-white/20">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="text-sm text-purple-200">Links Ilimitados</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-sm text-purple-200">QR Codes Grátis</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-sm text-purple-200">100% Personalizável</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

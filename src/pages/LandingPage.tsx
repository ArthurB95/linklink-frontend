import { useNavigate } from 'react-router-dom';
import { Sparkles, Link2, QrCode, Users, TrendingUp, Shield, Zap, ExternalLink } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Conecte-se com seu público',
      description: 'Reúna todos os seus links importantes em uma página elegante e fácil de compartilhar.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Amplifique seu alcance',
      description: 'Links curtos e memoráveis que aumentam seus cliques e engajamento.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Rápido e eficiente',
      description: 'Crie, compartilhe e gerencie tudo em segundos. Simplicidade que funciona.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Confiável e seguro',
      description: 'Seus dados estão protegidos. Foque no que importa: crescer seu negócio.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
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
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-purple-600 rounded-full hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
              >
                Começar Agora 🚀
              </button>
             {/*} <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full hover:bg-white/20 transition-all"
              >
                Fazer Login
              </button> */}
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

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-gray-900">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ferramentas poderosas que transformam a maneira como você compartilha conteúdo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-gray-900">
              Veja exemplos reais
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra como profissionais e empresas estão usando nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Example 1 - Bio Page */}
            <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-8 mb-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  M
                </div>
                <h3 className="text-center mb-2">Maria Silva</h3>
                <p className="text-center text-sm text-white/80 mb-4">Designer & Creator</p>
                <div className="space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    📱 Meu Portfolio
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    🎨 Behance
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    💼 LinkedIn
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/preview/maria-silva')}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Ver exemplo completo
                  <ExternalLink className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-600 mt-2">Bio Page</p>
              </div>
            </div>

            {/* Example 2 - Business */}
            <div className="group bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl p-8 mb-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🍕
                </div>
                <h3 className="text-center mb-2">Pizza Express</h3>
                <p className="text-center text-sm text-white/80 mb-4">Restaurante</p>
                <div className="space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    📋 Cardápio Digital
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    📍 Localização
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    🛵 Delivery
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/preview/pizza-express')}
                  className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
                >
                  Ver exemplo completo
                  <ExternalLink className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-600 mt-2">Negócio Local</p>
              </div>
            </div>

            {/* Example 3 - Influencer */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl p-8 mb-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <h3 className="text-center mb-2">João Tech</h3>
                <p className="text-center text-sm text-white/80 mb-4">Criador de Conteúdo</p>
                <div className="space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    📺 YouTube
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    📸 Instagram
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-gray-900 text-center text-sm">
                    🎁 Loja
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/preview/joao-tech')}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Ver exemplo completo
                  <ExternalLink className="w-4 h-4" />
                </button>
                <p className="text-sm text-gray-600 mt-2">Criador de Conteúdo</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              Criar minha página agora 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>Conecte-se com seu público de forma simples e poderosa ✨</p>
        </div>
      </footer>
    </div>
  );
}
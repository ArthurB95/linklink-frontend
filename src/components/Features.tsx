import { Users, TrendingUp, Shield, Zap } from 'lucide-react';

export function Features() {
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
            style={{
              animationDelay: `${index * 100}ms`
            }}
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
  );
}

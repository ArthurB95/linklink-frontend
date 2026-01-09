import { useParams } from 'react-router-dom';
import { ExternalLink, QrCode, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Dados mockados de perfis
const profilesData: Record<string, any> = {
  'maria-silva': {
    name: 'Maria Silva',
    bio: 'Designer & Creator apaixonada por criar experiências digitais únicas ✨',
    avatar: 'M',
    theme: 'gradient',
    links: [
      { id: '1', title: '📱 Meu Portfolio', url: 'https://mariasilva.com' },
      { id: '2', title: '🎨 Behance', url: 'https://behance.net/mariasilva' },
      { id: '3', title: '💼 LinkedIn', url: 'https://linkedin.com/in/mariasilva' },
      { id: '4', title: '✉️ Contato', url: 'mailto:maria@example.com' }
    ]
  },
  'pizza-express': {
    name: 'Pizza Express',
    bio: 'As melhores pizzas da cidade! 🍕 Delivery rápido e sabor incomparável',
    avatar: '🍕',
    theme: 'minimal',
    links: [
      { id: '1', title: '📋 Cardápio Digital', url: 'https://pizzaexpress.com/menu' },
      { id: '2', title: '📍 Nossa Localização', url: 'https://maps.google.com' },
      { id: '3', title: '🛵 Pedir Delivery', url: 'https://pizzaexpress.com/delivery' },
      { id: '4', title: '⭐ Avaliações', url: 'https://pizzaexpress.com/reviews' }
    ]
  },
  'joao-tech': {
    name: 'João Tech',
    bio: 'Criador de conteúdo sobre tecnologia e inovação 🚀 Ajudando você a dominar o mundo digital',
    avatar: '⭐',
    theme: 'dark',
    links: [
      { id: '1', title: '📺 Canal no YouTube', url: 'https://youtube.com/joaotech' },
      { id: '2', title: '📸 Instagram', url: 'https://instagram.com/joaotech' },
      { id: '3', title: '🎁 Minha Loja', url: 'https://loja.joaotech.com' },
      { id: '4', title: '📧 Newsletter', url: 'https://joaotech.com/newsletter' }
    ]
  }
};

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [showQRCode, setShowQRCode] = useState(false);

  const profile = username ? profilesData[username] : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-gray-900 mb-2">Perfil não encontrado</h2>
          <p className="text-gray-600">Este link não existe ou foi removido</p>
        </div>
      </div>
    );
  }

  const getThemeStyles = () => {
    switch (profile.theme) {
      case 'gradient':
        return {
          bg: 'bg-gradient-to-br from-indigo-500 to-purple-500',
          linkBg: 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-102',
          text: 'text-white',
          accent: 'text-white/80'
        };
      case 'minimal':
        return {
          bg: 'bg-white',
          linkBg: 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-102',
          text: 'text-gray-900',
          accent: 'text-gray-600'
        };
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
          linkBg: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-102',
          text: 'text-white',
          accent: 'text-white/70'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
          linkBg: 'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-102',
          text: 'text-white',
          accent: 'text-white/80'
        };
    }
  };

  const themeStyles = getThemeStyles();
  const currentUrl = `https://linklink.io/${username}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio,
          url: currentUrl
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success('Link copiado para área de transferência!');
    }
  };

  const handleLinkClick = (link: any) => {
    // Analytics tracking would go here
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="text-center mb-8 animate-fadeIn">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl shadow-lg">
            {profile.avatar}
          </div>

          {/* Name */}
          <h1 className={`mb-3 ${themeStyles.text}`}>{profile.name}</h1>

          {/* Bio */}
          <p className={`max-w-md mx-auto mb-6 ${themeStyles.accent}`}>
            {profile.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              title="Compartilhar"
            >
              <Share2 className={`w-5 h-5 ${themeStyles.text}`} />
            </button>
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              title="Ver QR Code"
            >
              <QrCode className={`w-5 h-5 ${themeStyles.text}`} />
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div 
            className="mb-8 p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn"
            onClick={() => setShowQRCode(false)}
          >
            <div className="text-center">
              <h3 className="text-gray-900 mb-4">Compartilhe via QR Code</h3>
              <div className="bg-white p-6 rounded-xl inline-block">
                <QRCodeSVG
                  value={currentUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Escaneie para acessar este perfil
              </p>
            </div>
          </div>
        )}

        {/* Links Section */}
        <div className="space-y-4">
          {profile.links.map((link: any, index: number) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`w-full px-6 py-4 ${themeStyles.linkBg} rounded-xl transition-all shadow-md hover:shadow-xl group animate-fadeIn`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 text-center">{link.title}</span>
                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 pt-8 border-t ${profile.theme === 'dark' ? 'border-white/10' : 'border-white/20'}`}>
          <p className={`text-sm ${themeStyles.accent} mb-3`}>
            Criado com Link.Link.
          </p>
          <a
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all ${themeStyles.text} text-sm`}
          >
            ✨ Crie sua própria página
          </a>
        </div>
      </div>
    </div>
  );
}

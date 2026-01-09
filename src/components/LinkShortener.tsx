import { useState } from 'react';
import { Copy, ExternalLink, Scissors, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

export function LinkShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([]);

  const generateShortCode = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const shortenLink = () => {
    if (!longUrl) {
      toast.error('Digite uma URL para encurtar');
      return;
    }

    // Validate URL
    try {
      new URL(longUrl);
    } catch {
      toast.error('URL inválida');
      return;
    }

    const slug = customSlug || generateShortCode();
    const shortUrl = `link.io/${slug}`;

    const newLink: ShortenedLink = {
      id: Date.now().toString(),
      originalUrl: longUrl,
      shortUrl: shortUrl,
      clicks: Math.floor(Math.random() * 100), // Mock data
      createdAt: new Date()
    };

    setShortenedLinks([newLink, ...shortenedLinks]);
    setLongUrl('');
    setCustomSlug('');
    toast.success('Link encurtado com sucesso! 🎉');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`https://${text}`);
    toast.success('Link copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-gray-900">Encurte seu link</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">URL Longa</label>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://exemplo.com/sua-url-muito-longa-aqui"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && shortenLink()}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">
              Personalizar (opcional)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 px-4">link.io/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="seu-link-customizado"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={shortenLink}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            <Scissors className="w-5 h-5" />
            Encurtar Link
          </button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm text-gray-600">Instantâneo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm text-gray-600">Personalizável</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-600">Com Estatísticas</div>
          </div>
        </div>
      </div>

      {/* Links History */}
      {shortenedLinks.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="mb-6 text-gray-900">Seus Links Encurtados</h3>

          <div className="space-y-4">
            {shortenedLinks.map((link) => (
              <div
                key={link.id}
                className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <a
                        href={`https://${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {link.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {link.originalUrl}
                    </div>
                  </div>
                  
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                  </a>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{link.clicks} cliques</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div>Criado há {Math.floor((Date.now() - link.createdAt.getTime()) / 60000)} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shortenedLinks.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <p className="text-gray-600">
            Seus links encurtados aparecerão aqui
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Transforme URLs longas em links curtos e rastreáveis
          </p>
        </div>
      )}
    </div>
  );
}

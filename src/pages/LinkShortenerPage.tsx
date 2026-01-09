import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Scissors,
  BarChart3,
  Trash2,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { bioPageService, ShortenedLink } from "../service/api";

export function LinkShortenerPage() {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const REDIRECT_BASE_URL = process.env.REACT_REDIRECT_BASE_URL;

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await bioPageService.getMyShortenedLinks();

      setShortenedLinks(data.reverse());
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar seus links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();

    const onFocus = () => {
      loadLinks();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const shortenLink = async () => {
    if (!longUrl) {
      toast.error("Digite uma URL para encurtar");
      return;
    }

    try {
      new URL(longUrl);
    } catch {
      toast.error("URL inválida. Inclua http:// ou https://");
      return;
    }

    try {
      setCreating(true);
      const newLink = await bioPageService.createShortenedLink(
        longUrl,
        customSlug || undefined
      );

      setShortenedLinks([newLink, ...shortenedLinks]);

      setLongUrl("");
      setCustomSlug("");
      toast.success("Link encurtado com sucesso! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar link.");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (shortUrl: string) => {
    const fullUrl = formatUrl(shortUrl);

    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copiado para área de transferência!");
  };

  const deleteLink = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este link?")) return;

    try {
      // Otimistic Update: Remove da interface antes da API responder (para ser rápido)
      
      setShortenedLinks(shortenedLinks.filter((link) => link.id !== id));

      await bioPageService.deleteShortenedLink(id);
      toast.success("Link excluído");
    } catch (error) {
      toast.error("Erro ao excluir link");
      // Recarrega a lista original em caso de erro
      loadLinks();
    }
  };

  const formatUrl = (url: string) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("localhost")) {
      return `http://${url}`;
    }

    return `${REDIRECT_BASE_URL}/${url}`;
  };

  const totalClicks = shortenedLinks.reduce(
    (sum, link) => sum + (link.clickCount || 0),
    0
  );
  const clickRate =
    shortenedLinks.length > 0
      ? Math.round(totalClicks / shortenedLinks.length)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-purple-600" />
              <h1 className="text-gray-900">Encurtador de Links</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scissors className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-gray-600">Total de Links</h3>
            </div>
            <p className="text-3xl text-gray-900">{shortenedLinks.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-gray-600">Total de Cliques</h3>
            </div>
            <p className="text-3xl text-gray-900">{totalClicks}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-600">Taxa de Cliques</h3>
            </div>
            <p className="text-3xl text-gray-900">{clickRate}</p>
          </div>
        </div>

        {/* Create Link Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Encurtar novo link</h2>
              <p className="text-sm text-gray-600">
                Transforme URLs longas em links curtos e rastreáveis
              </p>
            </div>
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
                onKeyPress={(e) => e.key === "Enter" && shortenLink()}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">
                Personalizar link (opcional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 px-4 py-3">link.io/</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) =>
                    setCustomSlug( 
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="seu-link-customizado"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Use apenas letras minúsculas, números e hífens
              </p>
            </div>

            <button
              onClick={shortenLink}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              {creating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Scissors className="w-5 h-5" />
              )}
              {creating ? "Encurtando..." : "Encurtar Link"}
            </button>
          </div>

          {/* Quick Tips */}
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
              <div className="text-sm text-gray-600">Rastreável</div>
            </div>
          </div>
        </div>

        {/* Links List */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-gray-900 mb-6">
            Seus Links ({shortenedLinks.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : shortenedLinks.length > 0 ? (
            <div className="space-y-4">
              {shortenedLinks.map((link) => (
                <div
                  key={link.id}
                  className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      {/* Short Link */}
                      <div className="flex items-center gap-2 mb-2">
                        <a
                          href={formatUrl(link.shortUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          {link.shortUrl.replace(/^https?:\/\//, "")}
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.shortUrl)}
                          className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-purple-600" />
                        </button>
                        {link.originalUrl && (
                          <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                            Personalizado
                          </span>
                        )}
                      </div>

                      {/* Original URL */}
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 truncate flex-1">
                          {link.originalUrl}
                        </div>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span>{link.clickCount} cliques</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Criado{" "}
                        {new Date(link.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Scissors className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Nenhum link encurtado ainda</p>
              <p className="text-sm">Crie seu primeiro link acima</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

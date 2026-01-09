import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, Share2, AlertCircle, QrCode, X } from "lucide-react";
import { bioPageService, BioPage, QRCodeData } from "../service/api";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export function PublicProfileUser() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<BioPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const currentUrl = window.location.href;
  const API_BASE_URL = "http://192.168.3.7:8080/api/v1";

  useEffect(() => {
    if (username) {
      loadPublicData(username);
    }
  }, [username]);

  const loadPublicData = async (handle: string) => {
    try {
      setLoading(true);
      const pageData = await bioPageService.getBioPageByHandle(handle);
      setData(pageData);
      setImageError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (link: any) => {
    // Registra o clique no backend (opcional, se implementado)
        if (link.id && username) {
      bioPageService.registerPublicLinkClick(username, link.id);
    }

    if (link.url) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const styles = useMemo(() => {
    const theme = data?.theme ? data.theme.toUpperCase().trim() : "GRADIENT";

    switch (theme) {
      case "MINIMAL":
        return {
          bg: "bg-white",
          linkBg: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-102",
          text: "text-gray-900",
          accent: "text-gray-600",
        };
      case "DARK":
        return {
          bg: "bg-gradient-to-br from-gray-900 to-gray-800",
          linkBg:
            "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-102",
          text: "text-white",
          accent: "text-white/70",
        };
      case "GRADIENT":
      default:
        return {
          bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
          linkBg:
            "bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-102",
          text: "text-white",
          accent: "text-white/80",
        };
    }
  }, [data]);

  const getQRCodeValue = (qrCode: any) => {
    if (!qrCode) return currentUrl;

    const isUrl =
      qrCode.content.startsWith("http://") ||
      qrCode.content.startsWith("https://");

    if (isUrl) {
      return `${API_BASE_URL}/qr-codes/public/${qrCode.id}/scan`;
    }

    return qrCode.content;
  };

  const copyBioPageUrl = () => {
    if (!username) {
      toast.error("Username não carregado");
      return;
    }

    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para área de transferência!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            O link que você tentou acessar não existe ou foi removido.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Criar minha Bio Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${styles.bg} py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Container Principal (O "Celular" ou Card Central) */}
        <div className={`text-center mb-8 animate-fadeIn`}>
          {/* Cabeçalho do Perfil */}
          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl shadow-lg">
            {data.avatarUrl && !imageError ? (
              <img
                src={data.avatarUrl}
                alt={data.title}
                className="w-full h-full object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-4xl font-bold ${styles.bg}`}
              >
                {data.title?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className={`mb-3 ${styles.text}`}>{data.title}</h1>

          {/* Bio */}
          <p className={`max-w-md mx-auto mb-6 ${styles.accent}`}>{data.bio}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={copyBioPageUrl}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              title="Compartilhar"
            >
              <Share2 className={`w-5 h-5 ${styles.text}`} />
            </button>
            {data.customQRCode && (
              <button
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                title="Ver QR Code"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode className={`w-5 h-5 ${styles.text}`} />
              </button>
            )}
          </div>
        </div>

        {/* --- QR CODE MODAL --- */}
        {showQRCode && data.customQRCode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setShowQRCode(false)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl transform transition-all scale-100"
              onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro do modal
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Escaneie para acessar
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                  {data.customQRCode.name}
                </p>

                <div
                  className="bg-white p-4 rounded-2xl shadow-inner inline-block border border-gray-100"
                  style={{
                    backgroundColor: data.customQRCode.bgColor || "#ffffff",
                  }}
                >
                  <QRCodeSVG
                    id={`qr-${data.customQRCode.id}`}
                    value={getQRCodeValue(data.customQRCode)}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor={data.customQRCode.fgColor}
                    bgColor={data.customQRCode.bgColor}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => setShowQRCode(false)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Links */}
        <div className="space-y-4">
          {data.links && data.links.length > 0 ? (
            data.links.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className={`w-full px-6 py-4 ${styles.linkBg} rounded-xl transition-all shadow-md hover:shadow-xl group animate-fadeIn`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">{link.title}</span>
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          ) : (
            <div
              className={`text-center py-8 ${styles.text} italic opacity-60`}
            >
              Nenhum link disponível no momento.
            </div>
          )}
        </div>

        {/* Footer / Branding */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <a
            href="/"
            className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity ${styles.text}`}
          >
            <Share2 className="w-3 h-3" />
            Powered by Link.Link.
          </a>
        </div>
      </div>
    </div>
  );
}

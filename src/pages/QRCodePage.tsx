import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Download,
  Smartphone,
  Share2,
  Plus,
  Trash2,
  Save,
  Loader2,
  BarChart3,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { bioPageService, QRCodeData, QRCodeRequest } from "../service/api";

export function QRCodePage() {
  const navigate = useNavigate();
  
  const [url, setUrl] = useState("");
  const [qrName, setQrName] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState("#6366f1");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [includeMargin, setIncludeMargin] = useState(true);
  const [savedQRCodes, setSavedQRCodes] = useState<QRCodeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedQrId, setSelectedQrId] = useState<number | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const colorPresets = [
    { name: "Roxo", color: "#6366f1" },
    { name: "Rosa", color: "#ec4899" },
    { name: "Verde", color: "#10b981" },
    { name: "Azul", color: "#3b82f6" },
    { name: "Preto", color: "#000000" },
    { name: "Laranja", color: "#f97316" },
  ];

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    try {
      setIsLoading(true);

      const [qrCodesData, bioPageData] = await Promise.all([
        bioPageService.getMyQRCodes(),
        bioPageService.getMyBioPage().catch(() => null)
      ]);

      setSavedQRCodes(qrCodesData);

      if (bioPageData && bioPageData.customQRCode) {
        setSelectedQrId(bioPageData.customQRCode.id);
      }

    } catch (error) {
      toast.error("Erro ao carregar dados");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = (qrId?: number) => {
    const elementId = qrId ? `qr-${qrId}` : "qr-code-svg";
    const svgElement = document.getElementById(elementId);

    if (!svgElement) {
      toast.error("QR Code não encontrado para download");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const downloadSize = qrId ? 500 : Math.max(qrSize, 500);

    canvas.width = downloadSize;
    canvas.height = downloadSize;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = qrId ? "#ffffff" : bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${qrId || "novo"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR Code baixado com sucesso! 📥");
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const saveQRCode = async () => {
    if (!url) {
      toast.error("Digite um conteúdo para o QR Code");
      return;
    }

    if (!qrName) {
      toast.error("Dê um nome ao seu QR Code");
      return;
    }

    try {
      setIsSaving(true);

      const payload: QRCodeRequest = {
        name: qrName,
        content: url,
        size: qrSize,
        fgColor: qrColor,
        bgColor: bgColor,
      };

      // Chama a função específica createQRCode
      const newQRCode = await bioPageService.createQRCode(payload);

      setSavedQRCodes([newQRCode, ...savedQRCodes]);

      setQrName("");
      setUrl("");
      toast.success("QR Code salvo com sucesso! 🎉");
    } catch (error) {
      toast.error("Erro ao salvar QR Code");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQRCode = async (id: number) => {
    try {
      // Chama a função específica deleteQRCode
      await bioPageService.deleteQRCode(id);

      setSavedQRCodes(savedQRCodes.filter((qr) => qr.id !== id));
      toast.success("QR Code excluído");
    } catch (error) {
      toast.error("Erro ao excluir QR Code");
      console.error(error);
    }
  };

  const getQRCodeValue = (qr: QRCodeData) => {
    const isUrl =
      qr.content.startsWith("http://") || qr.content.startsWith("https://");

    if (isUrl) {
      return `${API_BASE_URL}/qr-codes/public/${qr.id}/scan`;
    }

    return qr.content;
  };

const selectQRCodeForBioPage = async (id: number) => {
    try {
      // Se clicar no que já está selecionado, desmarca (opcional)
      if (selectedQrId === id) {
          await bioPageService.unlinkQRCodeFromBioPage();
          setSelectedQrId(null);
          toast.success("QR Code removido da Bio Page");
          return;
      }

      // Vincula o novo
      await bioPageService.linkQRCodeToBioPage(id);
      setSelectedQrId(id);
      toast.success("QR Code definido na Bio Page! ✨");
      
    } catch (error) {
      toast.error("Erro ao atualizar Bio Page");
      console.error(error);
    }
  };

  const selectQrCodeId = (qr: QRCodeData) => {
    const isSelected = selectedQrId === qr.id;
  };

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
              <Smartphone className="w-5 h-5 text-purple-600" />
              <h1 className="text-gray-900">Gerador de QR Code</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Generator */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-gray-900 mb-6">Criar QR Code</h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-gray-700">
                  Nome do QR Code
                </label>
                <input
                  type="text"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  placeholder="Ex: QR Code - Evento"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">URL ou Texto</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com ou qualquer texto"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Cole uma URL, telefone, email ou qualquer texto
                </p>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Tamanho</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="64"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-gray-700 w-16 text-right">
                    {qrSize}px
                  </span>
                </div>
              </div>

              <div>
                <label className="block mb-3 text-gray-700">
                  Cor do QR Code
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setQrColor(preset.color)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        qrColor === preset.color
                          ? "border-purple-500 scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded-lg"
                        style={{ backgroundColor: preset.color }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Cor de Fundo</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="margin"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="margin"
                  className="text-gray-700 cursor-pointer"
                >
                  Incluir margem
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveQRCode}
                  disabled={!url || !qrName || isSaving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => downloadQRCode()}
                  disabled={!url}
                  className="flex-1 px-6 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Baixar
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-gray-900 mb-6">Preview</h2>

            <div className="bg-white rounded-2xl p-8 min-h-[500px] flex items-center justify-center">
              {url ? (
                <div className="text-center">
                  <div
                    className="inline-block p-6 rounded-2xl shadow-lg"
                    style={{ backgroundColor: bgColor }}
                  >
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={url}
                      size={Math.min(qrSize, 300)}
                      level="H"
                      fgColor={qrColor}
                      bgColor={bgColor}
                      includeMargin={includeMargin}
                    />
                  </div>

                  <div className="mt-6 text-sm text-gray-600">
                    <p className="mb-2">Escaneie para testar</p>
                    <p className="text-gray-400 max-w-xs mx-auto truncate">
                      {url}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📱</div>
                  <p>Digite uma URL para gerar o QR Code</p>
                  <p className="text-sm mt-2">
                    Perfeito para cartões de visita,
                    <br />
                    menus, eventos e muito mais
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved QR Codes */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-gray-900 mb-6">
            QR Codes Salvos ({savedQRCodes.length})
          </h2>

          {savedQRCodes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedQRCodes.map((qr) => {
                const isSelected = selectedQrId === qr.id;

                return (
                  <div
                    key={qr.id}
                    className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border transition-all group relative ${
                      isSelected
                        ? "border-purple-500 border-2 shadow-xl"
                        : "border-purple-100 hover:shadow-lg"
                    }`}
                  >
                    {isSelected && (
                      <div
                      style={{ top: '-12px', right: '-10px', padding: '5px'  }}
                      className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
                      
                        <Check className="w-3 h-3" />
                        Ativo na Bio Page
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-gray-900 flex-1">{qr.name}</h3>
                      <button
                        onClick={() => deleteQRCode(qr.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4 flex items-center justify-center">
                      <QRCodeSVG
                        id={`qr-${qr.id}`}
                        value={getQRCodeValue(qr)}
                        size={150}
                        level="H"
                        fgColor={qr.fgColor}
                        bgColor={qr.bgColor}
                        includeMargin={true}
                      />
                    </div>

                    <p className="text-sm text-gray-600 mb-4 truncate">
                      {qr.content}
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => selectQRCodeForBioPage(qr.id)}
                        disabled={isSelected}
                        className={`w-full px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-102 ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-default"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-102"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {isSelected ? "QR Code Ativo" : "Usar na Bio Page"}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadQRCode(qr.id)}
                          className="flex-1 px-4 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Baixar
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(qr.content);
                            toast.success("Link copiado!");
                          }}
                          className="px-4 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Criado em{" "}
                      {new Date(qr.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    {qr.scanCount > 0 && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                          {qr.scanCount} scans
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Nenhum QR Code salvo ainda</p>
              <p className="text-sm">Crie e salve seu primeiro QR Code acima</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
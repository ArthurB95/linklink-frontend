import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Smartphone, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeMargin, setIncludeMargin] = useState(true);

  const downloadQRCode = () => {
    if (!url) {
      toast.error('Digite uma URL primeiro');
      return;
    }

    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = qrSize;
    canvas.height = qrSize;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success('QR Code baixado! 📥');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const colorPresets = [
    { name: 'Roxo', color: '#6366f1' },
    { name: 'Rosa', color: '#ec4899' },
    { name: 'Verde', color: '#10b981' },
    { name: 'Azul', color: '#3b82f6' },
    { name: 'Preto', color: '#000000' },
    { name: 'Laranja', color: '#f97316' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900">Gerar QR Code</h3>
          </div>

          <div className="space-y-6">
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
                <span className="text-gray-700 w-16 text-right">{qrSize}px</span>
              </div>
            </div>

            <div>
              <label className="block mb-3 text-gray-700">Cor do QR Code</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    onClick={() => setQrColor(preset.color)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      qrColor === preset.color
                        ? 'border-purple-500 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded-lg"
                      style={{ backgroundColor: preset.color }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{preset.name}</div>
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
              <label htmlFor="margin" className="text-gray-700 cursor-pointer">
                Incluir margem
              </label>
            </div>

            <button
              onClick={downloadQRCode}
              disabled={!url}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Download className="w-5 h-5" />
              Baixar QR Code
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <Share2 className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-700">Fácil de</div>
              <div className="text-sm text-gray-700">Compartilhar</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl text-center">
              <Smartphone className="w-5 h-5 text-pink-600 mx-auto mb-2" />
              <div className="text-sm text-gray-700">Escaneável</div>
              <div className="text-sm text-gray-700">por Celular</div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl">
          <h3 className="mb-6 text-gray-900">Preview</h3>

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
                  <p className="text-gray-400 max-w-xs mx-auto truncate">{url}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📱</div>
                <p>Digite uma URL para gerar o QR Code</p>
                <p className="text-sm mt-2">
                  Perfeito para cartões de visita,<br />
                  menus, eventos e muito mais
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mt-8 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h3 className="mb-6 text-gray-900 text-center">
          Onde usar seu QR Code?
        </h3>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 text-center hover:bg-purple-50 rounded-xl transition-colors">
            <div className="text-3xl mb-2">🎫</div>
            <div className="text-sm text-gray-700">Ingressos</div>
          </div>
          <div className="p-4 text-center hover:bg-purple-50 rounded-xl transition-colors">
            <div className="text-3xl mb-2">🍽️</div>
            <div className="text-sm text-gray-700">Cardápios</div>
          </div>
          <div className="p-4 text-center hover:bg-purple-50 rounded-xl transition-colors">
            <div className="text-3xl mb-2">💼</div>
            <div className="text-sm text-gray-700">Cartões</div>
          </div>
          <div className="p-4 text-center hover:bg-purple-50 rounded-xl transition-colors">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-sm text-gray-700">Produtos</div>
          </div>
        </div>
      </div>
    </div>
  );
}

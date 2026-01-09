import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Copy,
  Save,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import {
  bioPageService,
  BioLink,
  authService
} from "../service/api";

export function BioPage() {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<BioLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [theme, setTheme] = useState<"gradient" | "minimal" | "dark">(
    "gradient"
  );
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bioData, userData] = await Promise.all([
        bioPageService.getMyBioPage(),
        authService.me(), // Endpoint /api/v1/auth/me
      ]);

      setProfileName(bioData.title || "");
      setBio(bioData.bio || "");
      setAvatarUrl(bioData.avatarUrl || "");
      setLinks(bioData.links || []);
      authService.me()

      // Mapeia o tema do backend para o frontend (ajuste conforme seus enums)
      // Se o backend salvar string livre, isso funciona direto.
      if (bioData.theme) {
        // @ts-ignore - Força o tipo se o backend retornar string compatível
        setTheme(
          bioData.theme.toLowerCase().includes("dark")
            ? "dark"
            : bioData.theme.toLowerCase().includes("minimal")
            ? "minimal"
            : "gradient"
        );
      }

      setUsername(userData.username);
    } catch (error) {
      toast.error("Erro ao carregar dados. Faça login novamente.");
      // navigate('/login'); // Opcional: redirecionar se falhar
    } finally {
      setLoading(false);
    }
  };

  const addLink = async () => {
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Preencha título e URL do link");
      return;
    }

    try {
      // Chama API
      const createdLink = await bioPageService.addLink({
        title: newLinkTitle,
        url: newLinkUrl,
      });

      // Atualiza lista com o link real retornado (que contém o ID)
      setLinks([...links, createdLink]);

      // Limpa inputs
      setNewLinkTitle("");
      setNewLinkUrl("");
      toast.success("Link adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o link.");
    }
  };

  // 3. Remover Link (Remove do Backend)
  const removeLink = async (id: number) => {
    try {

      await bioPageService.deleteLink(id);
      toast.success("Link removido");
    } catch (error) {
      toast.error("Erro ao remover link");
      loadData(); // Recarrega dados originais em caso de erro
    }
  };

  // 4. Copiar URL (Gera URL baseada no ID ou username se tiver)
  const copyBioPageUrl = () => {
    if (!username) {
        toast.error("Username não carregado");
        return;
    }

    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para área de transferência!");
  };

  // 5. Salvar Perfil (Título, Bio, Avatar, Tema)
  const saveBioPage = async () => {
    if (!profileName) {
      toast.error("Adicione um nome ao seu perfil");
      return;
    }

    try {
      await bioPageService.updateBioPage({
        title: profileName,
        bio: bio,
        avatarUrl: avatarUrl,
        // @ts-ignore - Envia o tema como string maiúscula para o backend (ajuste se necessário)
        theme: theme.toUpperCase(),
      });
      toast.success("Perfil salvo com sucesso! 🎉");
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "gradient":
        return {
          bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
          linkBg: "bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white",
          text: "text-white",
        };
      case "minimal":
        return {
          bg: "bg-white",
          linkBg: "bg-gray-100 text-gray-900 hover:bg-gray-200",
          text: "text-gray-900",
        };
      case "dark":
        return {
          bg: "bg-gradient-to-br from-gray-900 to-gray-800",
          linkBg: "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20",
          text: "text-white",
        };
    }
  };

  const themeStyles = getThemeStyles();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Eye className="w-5 h-5" />
                {showPreview ? "Ocultar" : "Preview"}
              </button>
              <button
                onClick={saveBioPage}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Personalize sua Bio Page</h2>
          <p className="text-gray-600">
            Crie uma página única para todos os seus links importantes
          </p>
        </div>

        <div
          className={`grid gap-8 ${
            showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl"
          }`}
        >
          {/* Editor */}
          <div className="space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-gray-900 mb-4">Informações do Perfil</h3>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">
                    Foto de Perfil
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                  <p className="text-sm text-gray-600">
                    Cole o link de uma imagem
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">
                    Nome/Título
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Seu nome ou marca"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">
                    <Palette className="w-4 h-4 inline mr-1" />
                    Tema
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme("gradient")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === "gradient"
                          ? "border-purple-500 scale-105"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-2"></div>
                      <p className="text-sm text-gray-700">Gradiente</p>
                    </button>
                    <button
                      onClick={() => setTheme("minimal")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === "minimal"
                          ? "border-purple-500 scale-105"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="h-12 bg-white border border-gray-300 rounded-lg mb-2"></div>
                      <p className="text-sm text-gray-700">Minimal</p>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === "dark"
                          ? "border-purple-500 scale-105"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="h-12 bg-gray-900 rounded-lg mb-2"></div>
                      <p className="text-sm text-gray-700">Dark</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-gray-900 mb-4">Gerenciar Links</h3>

              {/* Add Link Form */}
              <div className="space-y-3 mb-6 p-4 bg-purple-50 rounded-xl">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Título do link"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
                <button
                  onClick={addLink}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Link
                </button>
              </div>

              {/* Links List */}
              {links.length > 0 ? (
                <div className="space-y-2">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900">{link.title}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {link.url}
                        </div>
                      </div>
                      <button
                        onClick={() => link.id && removeLink(link.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum link adicionado ainda</p>
                </div>
              )}
            </div>

            {/* Share Card */}
            {username && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="mb-3">Compartilhe sua Bio Page</h3>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <code className="flex-1 text-sm">
                    {window.location.host}/{username}
                  </code>
                  <button
                    onClick={copyBioPageUrl}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PREVIEW */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-gray-900 mb-4">Preview</h3>
                <div className="relative">
                  <div className="mx-auto w-full max-w-sm bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      <div className={`${themeStyles.bg} p-8 min-h-[600px]`}>
                        <div className="text-center">
                          {/* AVATAR PREVIEW */}
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-white/20 p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                  onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                              ) : (
                                <span className={`text-2xl font-bold ${themeStyles.text}`}>{profileName ? profileName[0].toUpperCase() : "?"}</span>
                              )}
                            </div>
                          </div>

                          <h2 className={`mb-2 font-bold text-xl ${themeStyles.text}`}>{profileName || "Seu Nome"}</h2>
                          <p className={`${themeStyles.text} text-sm mb-8`}>{bio || "Sua bio aparecerá aqui..."}</p>

                          <div className="space-y-3">
                            {links.map((link) => (
                              <div key={link.id} className={`px-6 py-4 ${themeStyles.linkBg} rounded-xl transition-all text-center`}>
                                {link.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Link2,
  QrCode,
  BarChart3,
  Plus,
  ArrowLeft,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BioPageBuilder } from "../components/BioPageBuilder";
import {
  authService,
  bioPageService,
  BioPage,
  BioLink,
  QRCodeData,
  ShortenedLink,
  User,
} from "../service/api";
import { toast } from "sonner";

type ViewMode = "overview" | "editor";

interface ActivityItem {
  id: string | number;
  type: "bio-link" | "qr-code" | "short-link";
  title: string;
  detail: string;
  metric: number;
  metricLabel: string;
  date?: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bioPage, setBioPage] = useState<BioPage | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>("overview");
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [shortLinks, setShortLinks] = useState<ShortenedLink[]>([]);
  const [flippedStats, setFlippedStats] = useState<number | null>(null);
  const [flippedActions, setFlippedActions] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [userData, bioData, qrData, linksData] = await Promise.all([
        authService.me().catch(() => null),
        bioPageService.getMyBioPage().catch(() => null),
        bioPageService.getMyQRCodes().catch(() => []),
        bioPageService.getMyShortenedLinks().catch(() => []),
      ]);

      if (userData) setUser(userData);

      if (bioData) setBioPage(bioData);

      // Garante que é array, mesmo se vier null/undefined
      setQrCodes(Array.isArray(qrData) ? qrData : []);
      setShortLinks(Array.isArray(linksData) ? linksData : []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData: Partial<BioPage>) => {
    try {
      setBioPage((prev) => (prev ? { ...prev, ...updatedData } : null));
      await bioPageService.updateBioPage(updatedData);
      toast.success("Perfil atualizado!");
    } catch (error) {
      toast.error("Erro ao salvar perfil.");
      loadAllData();
    }
  };

  const handleAddLink = async (linkData: { title: string; url: string }) => {
    try {
      const newLink = await bioPageService.addLink(linkData);
      setBioPage((prev) =>
        prev ? { ...prev, links: [...prev.links, newLink] } : null
      );
      toast.success("Link adicionado!");
    } catch (error) {
      toast.error("Erro ao adicionar link.");
    }
  };

  const handleEditLink = async (id: number, data: Partial<BioLink>) => {
    try {
      setBioPage((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          links: prev.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
        };
      });
      await bioPageService.updateLink(id, data);
      toast.success("Link atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar link.");
      loadAllData();
    }
  };

  const handleDeleteLink = async (id: number) => {
    try {
      setBioPage((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          links: prev.links.filter((l) => l.id !== id),
        };
      });
      await bioPageService.deleteLink(id);
      toast.success("Link removido!");
    } catch (error) {
      toast.error("Erro ao remover link.");
      loadAllData();
    }
  };

  const handleReorderLinks = async (newLinks: BioLink[]) => {
    try {
      setBioPage((prev) => (prev ? { ...prev, links: newLinks } : null));
      const ids = newLinks
        .map((l) => l.id)
        .filter((id): id is number => id !== undefined);
      await bioPageService.reorderLinks(ids);
    } catch (error) {
      toast.error("Erro ao reordenar.");
      loadAllData();
    }
  };

  const getRecentActivity = (): ActivityItem[] => {
    const activity: ActivityItem[] = [];

    // 1. Adicionar Links da Bio
    if (bioPage?.links && Array.isArray(bioPage.links)) {
      bioPage.links.forEach((link) => {
        activity.push({
          id: `bio-${link.id}`,
          type: "bio-link",
          title: link.title || "Sem título",
          detail: link.url || "",
          metric: link.clickCount || 0,
          metricLabel: "cliques",
          date: bioPage.updatedAt,
        });
      });
    }

    // 2. Adicionar QR Codes
    if (Array.isArray(qrCodes)) {
      qrCodes.forEach((qr) => {
        activity.push({
          id: `qr-${qr.id}`,
          type: "qr-code",
          title: qr.name || "QR Code Sem Título",
          detail: qr.content || "",
          metric: qr.scanCount || 0,
          metricLabel: "scans",
          date: qr.createdAt,
        });
      });
    }

    // 3. Adicionar Short Links
    if (Array.isArray(shortLinks)) {
      shortLinks.forEach((sl) => {
        activity.push({
          id: `short-${sl.id}`,
          type: "short-link",
          title: sl.title || sl.shortUrl || "Link Encurtado",
          detail: sl.shortUrl || "",
          metric: sl.clickCount || 0,
          metricLabel: "cliques",
          date: sl.createdAt,
        });
      });
    }

    return activity.sort((a, b) => {
      if (a.date && b.date)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });
  };

  const recentActivity = getRecentActivity();

  const totalViews = bioPage?.viewCount || 0;

  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(recentActivity.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivity = recentActivity.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStatsFlip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedStats(flippedStats === index ? null : index);
  };

  const handleActionsFlip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedActions(flippedActions === index ? null : index);
  };

  const totalScans = qrCodes.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);

  const stats = [
    {
      label: "Bio Page (views)",
      value: totalViews,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      description:
        "Visualize o total de visualizações que sua Bio Page recebeu. Saiba exatamente quantas pessoas acessaram e viram sua página de perfil personalizada.",
    },
    {
      label: "Links Encurtados",
      value: shortLinks.length,
      icon: Link2,
      color: "from-purple-500 to-pink-500",
      description:
        "Este número representa a quantidade total de links que você já criou e encurtou na plataforma. Mantenha o controle do volume de URLs que você gerencia.",
    },
    {
      label: "QR Codes (scans)",
      value: totalScans,
      icon: QrCode,
      color: "from-orange-500 to-red-500",
      description:
        "Acompanhe a quantidade total de scans realizados em todos os seus QR Codes. Veja o engajamento acumulado que seus códigos físicos estão gerando.",
    },
    {
      label: "Total de Cliques e Scans",
      value: (bioPage?.links?.length || 0) + qrCodes.length + shortLinks.length,
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      description:
        "Tenha uma visão completa do seu engajamento. Este número soma os cliques em links encurtados e os scans de QR Codes, contabilizando apenas os itens que estão ativos no momento.",
    },
  ];

  const quickActions = [
    {
      title: "Criar Bio Page",
      description: "Monte sua página de links personalizada",
      icon: FileText,
      action: () => navigate("/bio"),
      color: "from-blue-500 to-cyan-500",
      detailedDescription:
        "Crie uma página personalizada com sua bio, foto e todos os seus links importantes. Escolha temas, customize cores e compartilhe um único link que centraliza toda sua presença online. Ideal para influenciadores, empresas e criadores de conteúdo.",
    },
    {
      title: "Encurtar Link",
      description: "Transforme URLs longas em links curtos",
      icon: Link2,
      action: () => navigate("/links"),
      color: "from-purple-500 to-pink-500",
      detailedDescription:
        "Encurte URLs longas e complexas em links curtos e profissionais. Personalize o final do link, adicione títulos descritivos e acompanhe estatísticas de cliques em tempo real. Perfeito para compartilhar em redes sociais, emails e campanhas de marketing.",
    },
    {
      title: "Gerar QR Code",
      description: "Crie QR codes personalizados",
      icon: QrCode,
      action: () => navigate("/qrcode"),
      color: "from-orange-500 to-red-500",
      detailedDescription:
        "Gere QR Codes totalmente personalizados com suas cores de marca. Escolha o tamanho ideal, customize as cores e salve múltiplos códigos para diferentes finalidades. Use em menus digitais, cartões de visita, eventos, embalagens de produtos e muito mais.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!bioPage) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView === "editor" ? (
                <button
                  onClick={() => setCurrentView("overview")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              ) : (
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-gray-900 font-semibold text-lg">
                {currentView === "overview" ? "Dashboard" : "Editar Bio Page"}
              </h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {currentView === "overview" && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user?.name}! 👋
              </h2>
              <p className="text-gray-600">
                Aqui está um resumo da sua atividade.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="h-48 w-full group"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="flex items-start transition-transform duration-500 justify-between mb-4"
                    style={{
                      transformStyle: "preserve-3d",
                      transform:
                        flippedStats === index
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                    }}
                  >
                    {/*Front Side */}
                    <div
                      className="group w-full h-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-sm`}
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <button
                          onClick={(e) => handleStatsFlip(index, e)}
                          className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors group"
                          title="Ver descrição"
                        >
                          <HelpCircle className="w-4 h-4 text-purple-600 cursor-pointer group-hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {stat.label}
                      </div>
                    </div>

                    {/* Back Side */}
                    <div
                      className="absolute w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm`}
                        >
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <button
                          onClick={(e) => handleStatsFlip(index, e)}
                          className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          title="Voltar"
                        >
                          <X className="w-4 h-4 text-white cursor-pointer" />
                        </button>
                      </div>
                      <h4 className="text-white mb-2 text-sm">{stat.label}</h4>
                      <p className="text-white text-xs leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="h-[220px] w-full group perspective"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="flex items-start transition-transform duration-500 justify-between mb-4"
                      style={{
                        transformStyle: "preserve-3d",
                        transform:
                          flippedActions === index
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                      }}
                    >
                      <div
                        className="group w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <button
                            onClick={(e) => handleActionsFlip(index, e)}
                            className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors group"
                            title="Ver descrição"
                          >
                            <HelpCircle className="w-4 h-4 text-purple-600 cursor-pointer group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                        <h4 className="text-gray-900 mb-2">{action.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {action.description}
                        </p>
                        <button
                          key={index}
                          onClick={action.action}
                          className="flex items-center gap-2 text-purple-600"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Criar agora</span>
                        </button>
                      </div>

                      {/* Back Side */}
                      <div
                        className="absolute w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm`}
                          >
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <button
                            onClick={(e) => handleActionsFlip(index, e)}
                            className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            title="Voltar"
                          >
                            <X className="w-4 h-4 text-white cursor-pointer" />
                          </button>
                        </div>
                        <h4 className="text-white mb-2 text-sm">
                          {action.title}
                        </h4>
                        <p className="text-white text-xs leading-relaxed">
                          {action.detailedDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-gray-900 mb-4">Atividade Recente</h3>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {recentActivity.length > 0 ? (
                  paginatedActivity.map((item) => {
                    const detailText = item.detail || "";
                    const detailHref = detailText.startsWith("http")
                      ? detailText
                      : `#`;
                    return (
                      <div
                        key={item.id}
                        className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              {item.type === "bio-link" && (
                                <FileText className="w-5 h-5" />
                              )}
                              {item.type === "qr-code" && (
                                <QrCode className="w-5 h-5" />
                              )}
                              {item.type === "short-link" && (
                                <Link2 className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-gray-900">{item.title}</h4>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                {item.type === "bio-link"
                                  ? "Bio Link"
                                  : item.type === "qr-code"
                                  ? "QR"
                                  : "Link"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 font-medium text-sm">
                              {item.metric} {item.metricLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Você ainda não tem links. Clique em "Personalizar Bio Page"
                    para adicionar.
                  </div>
                )}
                <div className="flex items-center justify-center py-4 bg-gray-50">
                  <button
                    onClick={goToPrevPage}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="mx-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => goToPage(index + 1)}
                        className={`px-4 py-2 mx-1 ${
                          currentPage === index + 1
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        } rounded-full hover:bg-purple-700 transition-colors`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={goToNextPage}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {recentActivity.length > 0 && (
                <span className="text-sm text-gray-500">
                  Total de {recentActivity.length} atividades
                </span>
              )}
            </div>
          </>
        )}

        {currentView === "editor" && bioPage && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BioPageBuilder
              initialData={bioPage}
              onUpdateProfile={handleUpdateProfile}
              onAddLink={handleAddLink}
              onEditLink={handleEditLink}
              onDeleteLink={handleDeleteLink}
              onReorderLinks={handleReorderLinks}
            />
          </div>
        )}
      </div>
    </div>
  );
}

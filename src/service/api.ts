const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface QRCodeData {
  id: number;
  name: string;
  content: string;
  size: number;
  fgColor: string;
  bgColor: string;
  scanCount: number;
  createdAt: string;
}

export interface QRCodeRequest {
  name: string;
  content: string;
  size: number;
  fgColor: string;
  bgColor: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  avatar: string;
  provider: string;
}

export interface BioLink {
  id?: number;
  title: string;
  url: string;
  position?: number;
  isActive?: boolean;
  clickCount?: number;
}

export interface BioPage {
  id: number;
  title: string;
  bio: string;
  avatarUrl: string;
  theme: "LIGHT" | "DARK" | "BLUE" | "PURPLE";
  isPublic: boolean;
  viewCount: number;
  links: BioLink[];
  customQRCode?: QRCodeData;
  updatedAt?: string;
}

export interface ShortenedLink {
  id: number;
  title: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export const authService = {
  me: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao autenticar");
    return response.json();
  },
};

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const bioPageService = {
  // Buscar a BioPage do usuário logado
  getMyBioPage: async (): Promise<BioPage> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao carregar dados");
    return response.json();
  },

  // Atualizar dados do perfil
  updateBioPage: async (data: Partial<BioPage>): Promise<BioPage> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar perfil");
    return response.json();
  },

  // Adicionar novo link
  addLink: async (link: { title: string; url: string }): Promise<BioLink> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my/links`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(link),
    });
    if (!response.ok) throw new Error("Erro ao adicionar link");
    return response.json();
  },

  // Atualizar link existente
  updateLink: async (id: number, link: Partial<BioLink>): Promise<BioLink> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my/links/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(link),
    });
    if (!response.ok) throw new Error("Erro ao atualizar link");
    return response.json();
  },

  // Deletar link
  deleteLink: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my/links/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao remover link");
  },

  // Reordenar links
  reorderLinks: async (linkIds: number[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my/links/reorder`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(linkIds),
    });
    if (!response.ok) throw new Error("Erro ao reordenar links");
  },

  getMyQRCodes: async (): Promise<QRCodeData[]> => {
    const response = await fetch(`${API_BASE_URL}/qr-codes`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) return [];

    const data = await response.json();

    if (data.content && Array.isArray(data.content)) {
      return data.content;
    }
    return Array.isArray(data) ? data : [];
  },

  getBioPageByHandle: async (handle: string): Promise<BioPage> => {
    const response = await fetch(`${API_BASE_URL}/public/bio-pages/${handle}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error("Página não encontrada");
      throw new Error("Erro ao carregar página");
    }
    return response.json();
  },

  // Método para registrar clique
  trackLinkClick: async (linkId: number) => {
    try {
      await fetch(`${API_BASE_URL}/links/${linkId}/click`, { method: "POST" });
    } catch (e) {
      console.error("Erro ao registrar clique", e);
    }
  },

  // Buscar Links
  getMyShortenedLinks: async (): Promise<ShortenedLink[]> => {
    const response = await fetch(`${API_BASE_URL}/links`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (data.content && Array.isArray(data.content)) return data.content;
    return Array.isArray(data) ? data : [];
  },

  // Criar novo link encurtado
  createShortenedLink: async (
    originalUrl: string,
    customSlug?: string
  ): Promise<ShortenedLink> => {
    const body: any = { originalUrl };

    if (customSlug && customSlug.trim() !== "") {
      body.customSlug = customSlug;
    }
    const response = await fetch(`${API_BASE_URL}/links`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao encurtar link");
    }
    return response.json();
  },

  // Deletar link encurtado
  deleteShortenedLink: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/links/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao remover link");
  },

  createQRCode: async (data: QRCodeRequest): Promise<QRCodeData> => {
    const response = await fetch(`${API_BASE_URL}/qr-codes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar QR Code");
    }
    return response.json();
  },

  deleteQRCode: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/qr-codes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao deletar QR Code");
  },

  // Função explícita para buscar um QR Code específico
  getQRCodeById: async (id: number): Promise<QRCodeData> => {
    const response = await fetch(`${API_BASE_URL}/qr-codes/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("QR Code não encontrado");
    return response.json();
  },

  // Vincula um QR Code à Bio Page
  linkQRCodeToBioPage: async (qrCodeId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/bio-pages/my/qrcode/${qrCodeId}`,
      {
        method: "PUT",
        headers: getHeaders(),
      }
    );
    if (!response.ok) throw new Error("Erro ao vincular QR Code");
  },

  // Remove o vínculo (caso queira desmarcar)
  unlinkQRCodeFromBioPage: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bio-pages/my/qrcode`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao desvincular QR Code");
  },

  registerPublicLinkClick: async (
    username: string,
    linkId: number
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/public/bio-pages/${username}/links/${linkId}/click`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn("Falha ao registrar clique (backend retornou erro)");
      }
    } catch (error) {
      console.error("Erro de conexão ao registrar clique", error);
    }
  },
};

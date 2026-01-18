import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PublicProfileUser } from "./PublicProfileUser";
// Importe seu serviço (ajuste o caminho se necessário)
import { bioPageService } from "../service/api"; 

export function RedirectHandler() {
  // Mantemos o nome do parametro como "username" para não quebrar o componente de perfil
  const { username } = useParams<{ username: string }>(); 
  const [loading, setLoading] = useState(true);
  const [isProfile, setIsProfile] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!username) return;

      try {
        // 1. Tenta buscar como se fosse um LINK encurtado
        // Precisamos de um endpoint público que retorne a URL original pelo código
        // Ex: GET /api/v1/public/links/{code}
        const data = await bioPageService.getOriginalLink(username);
        
        if (data && data.originalUrl) {
          // 2. Se achou, força o redirecionamento externo (sai do React)
          window.location.href = data.originalUrl;
          return;
        }
      } catch (error) {
        // 3. Se a API der erro (404), assumimos que NÃO é um link, mas sim um Perfil
        console.log("Não é um link curto, tentando carregar perfil...");
        setIsProfile(true);
      } finally {
        // Só paramos de carregar se formos mostrar o perfil. 
        // Se for redirect, o navegador vai mudar de página, então o loading continua visualmente.
        if (isProfile) setLoading(false);
      }
    };

    checkAndRedirect();
  }, [username]);

  if (loading && !isProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    );
  }

  // Se não for link, renderiza o perfil do usuário normalmente
  // O componente PublicProfileUser vai pegar o "username" do useParams automaticamente
  return <PublicProfileUser />;
}
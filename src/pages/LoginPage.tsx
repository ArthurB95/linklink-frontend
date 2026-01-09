import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_GOOGLE_API_BASE_URL;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  const handleGoogleLogin = () => {
    const targetUrl = `${API_BASE_URL}/oauth2/authorize/google?redirect_uri=${REDIRECT_URI}`;

    window.location.href = targetUrl;
  };

  const handleFacebookLogin = () => {
     alert("Configuração do Facebook pendente no Backend");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600">
            Entre para gerenciar seus links
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="space-y-4">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700">
                Continuar com Google
              </span>
            </button>

            {/* Facebook Login 
            <button
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] hover:shadow-md transition-all group"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continuar com Facebook</span>
            </button>*/}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Ao continuar, você concorda com nossos{" "}
            <button className="text-purple-600 hover:underline">
              Termos de Serviço
            </button>{" "}
            e{" "}
            <button className="text-purple-600 hover:underline">
              Política de Privacidade
            </button>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Voltar para página inicial
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm text-gray-600">Seguro</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm text-gray-600">Rápido</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm text-gray-600">Fácil</div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { BioPage, BioLink } from "../service/api"; // Certifique-se que a pasta é 'services' (plural)
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trash2, Edit2, Plus, Save, X, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface BioPageBuilderProps {
  initialData: BioPage;
  onUpdateProfile: (data: Partial<BioPage>) => void;
  onAddLink: (link: { title: string; url: string }) => void;
  onEditLink: (id: number, link: Partial<BioLink>) => void;
  onDeleteLink: (id: number) => void;
  onReorderLinks: (links: BioLink[]) => void;
}

export function BioPageBuilder({
  initialData,
  onUpdateProfile,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onReorderLinks,
}: BioPageBuilderProps) {
  // Estado local para o formulário de perfil (evita salvar a cada tecla digitada)
  const [profileForm, setProfileForm] = useState({
    title: initialData.title || "",
    bio: initialData.bio || "",
    avatarUrl: initialData.avatarUrl || "",
    isPublic: initialData.isPublic
  });

  // Estado para novo link
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  
  // Estado para link sendo editado
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editLinkForm, setEditLinkForm] = useState({ title: "", url: "" });

  // Sincroniza form quando dados externos mudam
  useEffect(() => {
    setProfileForm({
      title: initialData.title || "",
      bio: initialData.bio || "",
      avatarUrl: initialData.avatarUrl || "",
      isPublic: initialData.isPublic
    });
  }, [initialData]);

  // Handler para salvar perfil
  const handleSaveProfile = () => {
    onUpdateProfile(profileForm);
  };

  // Handler para adicionar link
  const handleAddNewLink = () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Preencha título e URL");
      return;
    }
    onAddLink(newLink);
    setNewLink({ title: "", url: "" });
  };

  // Handler para iniciar edição
  const startEditing = (link: BioLink) => {
    if (!link.id) return;
    setEditingLinkId(link.id);
    setEditLinkForm({ title: link.title, url: link.url });
  };

  // Handler para salvar edição
  const saveEditLink = (id: number) => {
    onEditLink(id, editLinkForm);
    setEditingLinkId(null);
  };

  // Handler para reordenar (Simples Up/Down)
  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...initialData.links];
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    onReorderLinks(newLinks);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* COLUNA DA ESQUERDA: EDITOR */}
      <div className="space-y-6">
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="profile">Perfil & Aparência</TabsTrigger>
          </TabsList>

          {/* ABA DE LINKS */}
          <TabsContent value="links" className="space-y-6 mt-6">
            {/* Card de Novo Link */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input 
                    placeholder="Ex: Meu Instagram" 
                    value={newLink.title}
                    onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input 
                    placeholder="https://instagram.com/..." 
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddNewLink} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Link
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Links */}
            <div className="space-y-3">
              {initialData.links.map((link, index) => (
                <Card key={link.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Controles de Ordem */}
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" size="icon" className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => moveLink(index, 'up')}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" size="icon" className="h-6 w-6"
                        disabled={index === initialData.links.length - 1}
                        onClick={() => moveLink(index, 'down')}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Conteúdo do Link */}
                    <div className="flex-1">
                      {editingLinkId === link.id ? (
                        <div className="space-y-2">
                          <Input 
                            value={editLinkForm.title} 
                            onChange={(e) => setEditLinkForm({...editLinkForm, title: e.target.value})}
                          />
                          <Input 
                            value={editLinkForm.url} 
                            onChange={(e) => setEditLinkForm({...editLinkForm, url: e.target.value})}
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => saveEditLink(link.id!)}>Salvar</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingLinkId(null)}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold">{link.title}</h4>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                          <div className="flex gap-2 mt-2 text-xs text-gray-400">
                            <span>{link.clickCount} cliques</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    {editingLinkId !== link.id && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(link)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => link.id && onDeleteLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {initialData.links.length === 0 && (
                <div className="text-center p-8 text-gray-500 border-2 border-dashed rounded-xl">
                  Nenhum link criado ainda. Adicione o primeiro acima!
                </div>
              )}
            </div>
          </TabsContent>

          {/* ABA DE PERFIL */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Como você aparece na sua página</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileForm.avatarUrl} />
                    <AvatarFallback>{profileForm.title?.substring(0,2)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Label>URL da Foto de Perfil</Label>
                    <Input 
                      value={profileForm.avatarUrl}
                      onChange={(e) => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                      placeholder="https://..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Título da Página</Label>
                  <Input 
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({...profileForm, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio / Descrição</Label>
                  <Textarea 
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Página Pública</Label>
                    <p className="text-sm text-gray-500">Permitir que outros vejam sua página</p>
                  </div>
                  <Switch 
                    checked={profileForm.isPublic}
                    onCheckedChange={(checked) => setProfileForm({...profileForm, isPublic: checked})}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* COLUNA DA DIREITA: PREVIEW (MÓVEL) */}
      <div className="hidden lg:block sticky top-8">
        <div className="bg-gray-900 rounded-[3rem] p-4 max-w-[350px] mx-auto border-[8px] border-gray-800 shadow-2xl">
          <div className="bg-white rounded-[2rem] h-[650px] overflow-hidden overflow-y-auto relative no-scrollbar">
            {/* Header do Preview */}
            <div className="bg-indigo-600 h-32 w-full absolute top-0 left-0"></div>
            
            <div className="relative pt-16 px-6 pb-8 text-center">
              <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg mb-4">
                <AvatarImage src={profileForm.avatarUrl} />
                <AvatarFallback>{profileForm.title?.substring(0,2)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profileForm.title || "Seu Nome"}</h2>
              <p className="text-sm text-gray-600 mb-6">{profileForm.bio || "Sua biografia aparecerá aqui..."}</p>

              {/* Links do Preview */}
              <div className="space-y-3">
                {initialData.links.map(link => (
                  <a 
                    key={link.id}
                    href="#" // Link morto no preview
                    onClick={(e) => e.preventDefault()}
                    className="block w-full p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-center font-medium text-gray-700"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
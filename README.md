# War Room • Direção Executiva (Rede Cruzada)

Protótipo Front-End Stand-Alone de alta performance para validação de experiência de usuário (UX/UI) com o Diretor Executivo da **ONG Rede Cruzada**.

Inspirado em mapas táticos de estratégia (RTS / Age of Empires / Civilization) no território do Rio de Janeiro.

---

## 🚀 Como Executar Localmente

```bash
cd war-room-redecruzada
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ☁️ Publicação na Vercel (1-Click)

O projeto está 100% configurado para o App Router do Next.js sem dependências externas de API ou chaves secretas:

1. Suba esta pasta para um repositório no GitHub ou use a CLI da Vercel:
   ```bash
   npx vercel
   ```
2. O build é automático e gera a URL pública imediata para o Diretor Executivo testar em qualquer computador ou tablet.

---

## 🧩 Compatibilidade com `sistema-rede-cruzada-novo`

Quando o layout for homologado pelo Diretor:
- **Design Tokens**: Alinhados com os tokens institucionais da Rede Cruzada (`--color-cruzada-azul`, `--color-cruzada-amarelo`, etc.).
- **Arquitetura**: Next.js App Router + TypeScript + Tailwind CSS compatível com o diretório `Frontend/` do repositório principal.
- **Portabilidade**: Os componentes em `components/` e os dados mockados em `lib/mockData.ts` podem ser copiados diretamente para o sistema principal e conectados à API C# .NET 8.

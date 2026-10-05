# Handoff — Site Miranda Engenharia

Landing page estática (HTML/CSS/JS, sem build) da **Miranda Engenharia** — engenharia mecânica, Eng. Matheus Miranda, CREA 216375/D, Nova Esperança – PR, atendimento em todo o Brasil.
**Objetivo:** gerar pedidos de orçamento pelo WhatsApp (principal) e e-mail (secundário).
**Domínio definido:** `engmiranda.com.br` (usado em canonical, Open Graph, JSON-LD, sitemap e robots).

## Estado atual (05/10/2026)
- Site completo e verificado no navegador em desktop (1366px) e mobile (375px), sem rolagem horizontal.
- Links do WhatsApp: `wa.me/5544997127007`, com mensagem pré-preenchida por serviço. O formulário foi testado (validação e mensagem montada).
- Logo: o texto "MIRANDA ENGENHARIA" foi ampliado em `assets/img/logo.svg` para ficar com a mesma altura do símbolo. O original em `midias/` está intacto.
- **Ainda não publicado.** A hospedagem sugerida é Netlify ou Vercel.

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | Página única: hero → números → NR-13 → caso Nemak → serviços → logos de clientes → depoimentos → sobre + vídeo → como funciona → FAQ → formulário → rodapé + botão flutuante |
| `assets/js/config.js` | **Único arquivo que o cliente edita**: WhatsApp, e-mail, Instagram, CNPJ, IDs de GA4 / Google Ads / Meta Pixel. Campos vazios ficam ocultos (`data-show`) |
| `assets/js/main.js` | Links wa.me/mailto, formulário → WhatsApp, carregamento das métricas, eventos `generate_lead` / `Contact`, contadores, reveal, vídeo lazy |
| `assets/css/styles.css` | Tema escuro industrial. Tokens em `:root` (ciano da marca `#00B8D9`, verde WhatsApp `#25D366`) |
| `assets/img/` | Fotos otimizadas em WebP, `og-image.jpg`, `favicon.svg`, logos de clientes em branco (`clientes/`) |
| `assets/video/` | `servico-campo.mp4` (vertical 576×1024, 12 s) + `poster.jpg` |
| `midias/` | Originais enviados pelo cliente. **Não publicar** |

## Decisões tomadas com o cliente
- Visual escuro com destaque em ciano. Foco principal em NR-13 / indústria; PMOC, exaustão e climatização em segundo plano.
- Botões diretos com mensagem pronta + mini formulário que monta a mensagem (nada é armazenado).
- E-mail, Instagram e CNPJ ficam ocultos até serem preenchidos no `config.js`.
- Depoimentos reais (Protein Meal, ART Mecânica, Biobras), com correções autorizadas: "RT" → "ART" e "Sócia-proprietária". O cliente autorizou citar a **Nemak** no caso de ≈450 vasos de pressão.
- Logos de clientes em versão monocromática branca (opção "c").
- Promessa: "Orçamento gratuito e sem compromisso". Sem promessa de tempo de resposta.
- Atendimento de seg. a sex., das 8h às 18h. Atendimento presencial em todo o Brasil, com deslocamento no orçamento. ART, PMOC e RT podem ser feitos à distância. Prazo definido no orçamento.

## Pendências
1. **O cliente precisa revisar textos escritos por nós**: exemplos da NR-11 (pontes rolantes, talhas, empilhadeiras), descrição da NR-12, checklist da NR-13 (inspeção inicial/periódica/extraordinária, prontuário, registro de segurança) e respostas do FAQ.
2. Preencher no `config.js`: e-mail, Instagram, CNPJ e IDs de métricas quando houver.
3. Registrar `engmiranda.com.br` e publicar (enviar `index.html`, `assets/`, `robots.txt`, `sitemap.xml`; **sem** `midias/`).
4. Após publicar: enviar o sitemap ao Google Search Console e criar o Perfil da Empresa no Google (SEO local).

## Rodar localmente
Abra `index.html` direto no navegador, ou rode um servidor estático na raiz:

```bash
npx serve .
```

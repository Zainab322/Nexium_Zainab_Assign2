"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Globe, BookOpen, Languages, Download } from "lucide-react";
import { jsPDF } from "jspdf";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ur");

  const handleSummarise = async () => {
    setLoading(true);
    setSummary("");
    setTranslated("");

    try {
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const { text } = await scrapeRes.json();

      const summaryText = text.split(" ").slice(0, 50).join(" ") + "...";
      setSummary(summaryText);

      const translateRes = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: summaryText,
          language,
        }),
      });
      const { translated } = await translateRes.json();
      setTranslated(translated);

      await fetch("/api/saveSummary", {
        method: "POST",
        body: JSON.stringify({ summary: summaryText }),
      });

      await fetch("/api/saveFull", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
    } catch (err) {
      console.error(err);
      setSummary("Error summarising the blog.");
      setTranslated("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Blog Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(summary || "No summary available.", 20, 30);
    doc.setFontSize(16);
doc.text(`Translation (${language.toUpperCase()})`, 20, 50);
    doc.setFontSize(12);
    doc.text(translated || "No translation available.", 20, 60, { maxWidth: 170 });
    doc.save("blog-summary.pdf");
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-[#f5f5f5]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl animate-float-delay"></div>
      </div>

      <header className="relative py-16 px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center mb-6 p-4 rounded-full bg-gradient-to-br from-amber-500/15 to-yellow-400/15 border border-amber-400/30 shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20 transition-all duration-300">
            <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 drop-shadow-lg">
              Blog Summariser
            </span>
          </h1>
          <p className="mt-6 text-xl text-[#d0d0d0] max-w-2xl mx-auto leading-relaxed font-light">
            Transform articles into concise summaries, instantly translated and downloadable as PDF.
          </p>
        </div>
      </header>

      <section className="relative w-full max-w-6xl mx-auto px-6 z-10">
        <div className="grid md:grid-cols-3 gap-8 items-center bg-[#1e1e1e]/80 backdrop-blur-lg p-8 rounded-3xl border border-[#333]/70 shadow-2xl hover:shadow-amber-400/10 transition-shadow duration-300">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-amber-400" />
                <label htmlFor="url" className="block text-sm font-medium text-[#ccc] uppercase tracking-wider">
                  Blog URL
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  id="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-[#252525] border border-[#3a3a3a]/70 text-[#f0f0f0] placeholder-[#777] focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all duration-200 h-14 px-5 text-lg rounded-xl"
                />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#252525] border border-[#3a3a3a]/70 text-[#f0f0f0] px-4 py-2 rounded-xl h-14 text-lg focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmNWY1ZjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9ucy1kb3duIj48cGF0aCBkPSJtNyA2IDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem] pr-10"
                >
                  <option value="ur">Urdu</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                <Button
                  onClick={handleSummarise}
                  disabled={loading || !url}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-[#111] font-semibold rounded-xl shadow-lg hover:shadow-amber-400/30 transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Summarise
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative group">
              <img
                src="/images/hero.jpg"
                alt="Illustration"
                className="w-full max-w-xs rounded-xl border border-[#333]/50 shadow-xl group-hover:shadow-amber-400/20 transition-all duration-500 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#000]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {summary && (
        <section className="relative w-full max-w-4xl mx-auto px-6 mt-16 mb-20 space-y-8 z-10">
          <Card className="bg-[#1e1e1e]/90 border border-[#3a3a3a]/60 shadow-2xl rounded-2xl overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-[#252525] to-[#1e1e1e] border-b border-[#3a3a3a]/30">
              <CardTitle className="flex items-center gap-3 text-2xl font-medium">
                <div className="p-2 bg-amber-400/10 rounded-lg border border-amber-400/20 group-hover:bg-amber-400/20 transition-all duration-300">
                  <BookOpen className="text-amber-400" size={24} />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300">
                  AI Summary
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-[#e0e0e0] font-light">{summary}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e1e]/90 border border-[#3a3a3a]/60 shadow-2xl rounded-2xl overflow-hidden group hover:border-yellow-400/30 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-[#252525] to-[#1e1e1e] border-b border-[#3a3a3a]/30">
              <CardTitle className="flex items-center gap-3 text-2xl font-medium">
                <div className="p-2 bg-yellow-400/10 rounded-lg border border-yellow-400/20 group-hover:bg-yellow-400/20 transition-all duration-300">
                  <Languages className="text-yellow-400" size={24} />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-300">
                  Translation ({language.toUpperCase()})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p 
                dir={language === "ur" || language === "hi" ? "rtl" : "ltr"}
                className="text-lg leading-relaxed text-[#e0e0e0] font-light"
              >
                {translated}
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleDownloadPdf}
              className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-[#111] px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-amber-400/30 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
        </section>
      )}

      <footer className="mt-auto py-8 px-6 text-center text-[#888] text-sm border-t border-[#333]/50">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">© {new Date().getFullYear()} Blog Summariser. All rights reserved.</p>
          <p className="text-xs text-[#666]">
          Crafted with elegance using Next.js, Tailwind CSS & AI          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-2deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
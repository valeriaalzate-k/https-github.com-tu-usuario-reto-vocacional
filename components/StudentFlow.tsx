"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { APT, INT, DIMS, DIMKEYS, CAREERS, type DimKey } from "@/lib/data";
import { buildVec, rankedResults, type Answers } from "@/lib/scoring";

type Screen = "landing" | "code" | "intro" | "quiz" | "interstitial" | "results" | "detail";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function StudentFlow({ schoolName }: { schoolName: string }) {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("landing");
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSubmitting, setCodeSubmitting] = useState(false);

  const [block, setBlock] = useState<1 | 2>(1);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ apt: Answers; int: Answers }>({ apt: {}, int: {} });
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [submittingResult, setSubmittingResult] = useState(false);

  const bank = block === 1 ? APT : INT;
  const key = block === 1 ? "apt" : "int";
  const currentAnswers = answers[key];
  const selIdx = currentAnswers[qIndex];

  function goHome() {
    setScreen("landing");
    setBlock(1);
    setQIndex(0);
    setAnswers({ apt: {}, int: {} });
    setSelectedCareerId(null);
    setCode("");
    setCodeInput("");
    setCodeError(null);
  }

  async function submitCode() {
    const trimmed = codeInput.trim().toUpperCase();
    if (!trimmed) return;
    setCodeSubmitting(true);
    setCodeError(null);
    try {
      const res = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCodeError(
          data.reason === "already_done"
            ? "Ese código ya completó la prueba."
            : "Código no encontrado. Revisa con tu coordinador."
        );
        return;
      }
      setCode(trimmed);
      setScreen("intro");
    } catch {
      setCodeError("No pudimos validar el código. Intenta de nuevo.");
    } finally {
      setCodeSubmitting(false);
    }
  }

  function beginQuiz() {
    setBlock(1);
    setQIndex(0);
    setAnswers({ apt: {}, int: {} });
    setScreen("quiz");
  }

  function select(i: number) {
    setAnswers((s) => ({ ...s, [key]: { ...s[key], [qIndex]: i } }));
  }

  async function next() {
    if (qIndex < bank.length - 1) {
      setQIndex(qIndex + 1);
      return;
    }
    if (block === 1) {
      setScreen("interstitial");
      return;
    }
    const results = rankedResults(answers.apt, answers.int);
    const topId = results[0]?.id ?? null;
    setSubmittingResult(true);
    try {
      if (topId) {
        await fetch("/api/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, topCareerId: topId }),
        });
      }
    } catch {
      // el resultado igual se muestra localmente aunque falle el guardado
    } finally {
      setSubmittingResult(false);
      setScreen("results");
    }
  }

  function back() {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
      return;
    }
    if (block === 1) {
      setScreen("intro");
      return;
    }
    setScreen("interstitial");
  }

  function startBlock2() {
    setBlock(2);
    setQIndex(0);
    setScreen("quiz");
  }

  function restart() {
    setBlock(1);
    setQIndex(0);
    setAnswers({ apt: {}, int: {} });
    setSelectedCareerId(null);
    setScreen("intro");
  }

  const results = useMemo(() => rankedResults(answers.apt, answers.int), [answers]);
  const top3 = results.slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "26px 20px 70px",
        background: "radial-gradient(120% 80% at 50% -10%, #E7DEFB 0%, #EEEBF6 55%)",
      }}
    >
      <button
        onClick={goHome}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 30,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#6D3BF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "var(--font-bricolage)",
            fontWeight: 800,
            fontSize: 18,
            transform: "rotate(-6deg)",
            boxShadow: "0 6px 14px rgba(109,59,245,.35)",
          }}
        >
          R
        </span>
        <span
          style={{
            fontFamily: "var(--font-bricolage)",
            fontWeight: 700,
            fontSize: 18,
            color: "#17141F",
            letterSpacing: "-.02em",
          }}
        >
          Reto Vocacional
        </span>
      </button>

      {screen === "landing" && (
        <div className="rv-fadeup" style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 99,
              background: "#E3DBFB",
              color: "#6D3BF5",
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 22,
              letterSpacing: ".01em",
            }}
          >
            Piloto para colegios
          </div>
          <h1
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.03,
              letterSpacing: "-.035em",
              margin: "0 0 18px",
            }}
          >
            ¿Qué deberías
            <br />
            estudiar?
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              color: "#5C566B",
              maxWidth: 450,
              margin: "0 auto 38px",
            }}
          >
            Cruzamos <b style={{ color: "#17141F" }}>en qué eres bueno</b> con{" "}
            <b style={{ color: "#17141F" }}>lo que te gusta</b> y te damos un Top 3 de carreras
            hechas para ti.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left" }}>
            <button
              className="rv-btn-primary"
              onClick={() => setScreen("code")}
              style={{
                position: "relative",
                overflow: "hidden",
                background: "#6D3BF5",
                border: "none",
                borderRadius: 24,
                padding: "26px 24px",
                cursor: "pointer",
                color: "#fff",
                textAlign: "left",
                boxShadow: "0 16px 34px -8px rgba(109,59,245,.45)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  right: -30,
                  top: -30,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.12)",
                }}
              />
              <span style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 26, marginBottom: 14 }}>🎓</span>
                <span
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 700,
                    fontSize: 21,
                    letterSpacing: "-.02em",
                  }}
                >
                  Soy estudiante
                </span>
                <span style={{ fontSize: 14.5, lineHeight: 1.4, color: "rgba(255,255,255,.82)", marginTop: 4 }}>
                  Haz la prueba y descubre tus carreras →
                </span>
              </span>
            </button>
            <button
              className="rv-btn-secondary"
              onClick={() => router.push("/coord")}
              style={{
                background: "#fff",
                border: "1.5px solid #E4E1EE",
                borderRadius: 24,
                padding: "26px 24px",
                cursor: "pointer",
                textAlign: "left",
                color: "#17141F",
                boxShadow: "0 12px 30px -14px rgba(30,20,60,.25)",
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 26, marginBottom: 14 }}>📋</span>
                <span
                  style={{
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 700,
                    fontSize: 21,
                    letterSpacing: "-.02em",
                  }}
                >
                  Soy coordinador
                </span>
                <span style={{ fontSize: 14.5, lineHeight: 1.4, color: "#6B6578", marginTop: 4 }}>
                  Revisa el avance de tu grupo →
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {screen === "code" && (
        <div
          className="rv-fadeup"
          style={{
            maxWidth: 480,
            width: "100%",
            background: "#fff",
            borderRadius: 26,
            padding: 36,
            boxShadow: "0 22px 55px -22px rgba(30,20,60,.3)",
            border: "1px solid #ECE9F3",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: 99,
              background: "#E9E1FC",
              color: "#6D3BF5",
              fontWeight: 600,
              fontSize: 12.5,
              marginBottom: 18,
            }}
          >
            {schoolName}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: 27,
              lineHeight: 1.1,
              letterSpacing: "-.03em",
              margin: "0 0 10px",
            }}
          >
            Ingresa tu código
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: "#5C566B", margin: "0 0 22px" }}>
            Tu coordinador te dio un código único (ej. RV-2601). Lo usamos solo para marcar que
            completaste la prueba — nunca para mostrar tu resultado individual.
          </p>
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCode()}
            placeholder="RV-2601"
            style={{
              width: "100%",
              border: "1.5px solid #E7E4EF",
              borderRadius: 14,
              padding: "14px 16px",
              fontSize: 16,
              marginBottom: 10,
              outline: "none",
              color: "#17141F",
              textTransform: "uppercase",
            }}
          />
          {codeError && (
            <p style={{ color: "#C0392B", fontSize: 13.5, margin: "0 0 14px" }}>{codeError}</p>
          )}
          <button
            className="rv-continue"
            disabled={codeSubmitting || !codeInput.trim()}
            onClick={submitCode}
            style={{
              width: "100%",
              background: codeSubmitting || !codeInput.trim() ? "#ECEAF3" : "#6D3BF5",
              border: "none",
              borderRadius: 16,
              padding: 17,
              color: codeSubmitting || !codeInput.trim() ? "#B4AEC2" : "#fff",
              fontWeight: 700,
              fontSize: 16.5,
              cursor: codeSubmitting || !codeInput.trim() ? "default" : "pointer",
              marginTop: 8,
            }}
          >
            {codeSubmitting ? "Validando…" : "Continuar →"}
          </button>
        </div>
      )}

      {screen === "intro" && (
        <div
          className="rv-fadeup"
          style={{
            maxWidth: 560,
            width: "100%",
            background: "#fff",
            borderRadius: 26,
            padding: 36,
            boxShadow: "0 22px 55px -22px rgba(30,20,60,.3)",
            border: "1px solid #ECE9F3",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: 99,
              background: "#E9E1FC",
              color: "#6D3BF5",
              fontWeight: 600,
              fontSize: 12.5,
              marginBottom: 18,
            }}
          >
            Antes de empezar
          </div>
          <h2
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1.08,
              letterSpacing: "-.03em",
              margin: "0 0 10px",
            }}
          >
            Tu prueba, en 2 bloques
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#5C566B", margin: "0 0 26px" }}>
            No hay respuestas buenas ni malas. Responde con lo primero que sientas — así el
            resultado es real.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 26 }}>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: 18,
                borderRadius: 18,
                background: "#F6F3FE",
                border: "1px solid #EBE3FC",
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#6D3BF5",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                1
              </span>
              <span>
                <span style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 16.5 }}>
                  En qué eres bueno
                </span>
                <br />
                <span style={{ fontSize: 14.5, color: "#6B6578" }}>
                  8 preguntas de aptitud · qué se te da mejor
                </span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: 18,
                borderRadius: 18,
                background: "#FCF3EF",
                border: "1px solid #F8E2D8",
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#E8663D",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-bricolage)",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                2
              </span>
              <span>
                <span style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 16.5 }}>
                  Lo que te gusta
                </span>
                <br />
                <span style={{ fontSize: 14.5, color: "#6B6578" }}>
                  8 preguntas de intereses · qué te llama
                </span>
              </span>
            </div>
          </div>

          <button
            className="rv-continue"
            onClick={beginQuiz}
            style={{
              width: "100%",
              background: "#6D3BF5",
              border: "none",
              borderRadius: 16,
              padding: 17,
              color: "#fff",
              fontWeight: 700,
              fontSize: 16.5,
              cursor: "pointer",
              boxShadow: "0 12px 26px -8px rgba(109,59,245,.5)",
            }}
          >
            Empezar la prueba →
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#9089A0", margin: "16px 0 0" }}>
            🕐 5–8 minutos · Colegio: {schoolName}
          </p>
        </div>
      )}

      {screen === "quiz" && bank[qIndex] && (
        <QuizScreen
          block={block}
          qIndex={qIndex}
          bankLength={bank.length}
          question={bank[qIndex]}
          selIdx={selIdx}
          onSelect={select}
          onBack={back}
          onContinue={next}
          submitting={submittingResult}
        />
      )}

      {screen === "interstitial" && (
        <div
          className="rv-fadeup"
          style={{
            maxWidth: 520,
            width: "100%",
            background: "#fff",
            borderRadius: 26,
            padding: "44px 36px",
            textAlign: "center",
            boxShadow: "0 22px 55px -22px rgba(30,20,60,.3)",
            border: "1px solid #ECE9F3",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 14 }}>💪</div>
          <h2
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: 29,
              lineHeight: 1.08,
              letterSpacing: "-.03em",
              margin: "0 0 10px",
            }}
          >
            ¡Listo el Bloque 1!
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#5C566B", margin: "0 0 30px" }}>
            Ya sabemos en qué eres bueno. Ahora lo divertido:{" "}
            <b style={{ color: "#E8663D" }}>qué te gusta de verdad</b>.
          </p>
          <button
            className="rv-block2-btn"
            onClick={startBlock2}
            style={{
              background: "#E8663D",
              border: "none",
              borderRadius: 16,
              padding: "16px 32px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 12px 26px -8px rgba(232,102,61,.5)",
            }}
          >
            Ir al Bloque 2 →
          </button>
        </div>
      )}

      {screen === "results" && (
        <ResultsScreen
          top3={top3}
          onOpen={(id) => {
            setSelectedCareerId(id);
            setScreen("detail");
          }}
          onRestart={restart}
        />
      )}

      {screen === "detail" && selectedCareerId && (
        <DetailScreen
          career={CAREERS.find((c) => c.id === selectedCareerId)!}
          vec={buildVec(answers.apt, answers.int)}
          onBack={() => setScreen("results")}
        />
      )}
    </div>
  );
}

function QuizScreen({
  block,
  qIndex,
  bankLength,
  question,
  selIdx,
  onSelect,
  onBack,
  onContinue,
  submitting,
}: {
  block: 1 | 2;
  qIndex: number;
  bankLength: number;
  question: { q: string; opts: { t: string }[] };
  selIdx: number | undefined;
  onSelect: (i: number) => void;
  onBack: () => void;
  onContinue: () => void;
  submitting: boolean;
}) {
  const blockColor = block === 1 ? "#6D3BF5" : "#E8663D";
  const blockChipBg = block === 1 ? "#E9E1FC" : "#FBE4DA";
  const blockLabel = block === 1 ? "Bloque 1 · Aptitud" : "Bloque 2 · Intereses";
  const pPct = Math.round(((qIndex + (selIdx != null ? 1 : 0)) / bankLength) * 100);
  const canContinue = selIdx != null;

  return (
    <div
      style={{
        maxWidth: 560,
        width: "100%",
        background: "#fff",
        borderRadius: 26,
        padding: 32,
        boxShadow: "0 22px 55px -22px rgba(30,20,60,.3)",
        border: "1px solid #ECE9F3",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 12px",
            borderRadius: 99,
            fontWeight: 600,
            fontSize: 12.5,
            background: blockChipBg,
            color: "#17141F",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: blockColor }} />
          {blockLabel}
        </span>
        <span style={{ fontSize: 13, color: "#9089A0", fontWeight: 600 }}>
          Pregunta {qIndex + 1} de {bankLength}
        </span>
      </div>
      <div style={{ height: 8, background: "#ECEAF3", borderRadius: 99, overflow: "hidden", marginBottom: 26 }}>
        <div
          style={{
            height: "100%",
            width: `${pPct}%`,
            background: blockColor,
            borderRadius: 99,
            transition: "width .35s ease",
          }}
        />
      </div>

      <h2
        style={{
          fontFamily: "var(--font-bricolage)",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.2,
          letterSpacing: "-.02em",
          margin: "0 0 22px",
        }}
      >
        {question.q}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {question.opts.map((opt, i) => {
          const selected = selIdx === i;
          return (
            <button
              key={i}
              className="rv-option"
              onClick={() => onSelect(i)}
              style={{
                position: "relative",
                textAlign: "left",
                width: "100%",
                background: "#fff",
                border: selected ? "1.5px solid transparent" : "1.5px solid #E7E4EF",
                borderRadius: 16,
                padding: "16px 18px",
                fontWeight: 500,
                fontSize: 15.5,
                lineHeight: 1.35,
                color: "#17141F",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  flex: "none",
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  border: "1.5px solid #DDD8EA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#8A8398",
                }}
              >
                {LETTERS[i]}
              </span>
              <span style={{ flex: 1 }}>{opt.t}</span>
              {selected && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid #6D3BF5",
                      borderRadius: 16,
                      boxShadow: "0 8px 22px -6px rgba(109,59,245,.4)",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: -9,
                      right: -9,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "#6D3BF5",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: "0 3px 9px rgba(109,59,245,.5)",
                    }}
                  >
                    ✓
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 26, alignItems: "center" }}>
        <button
          className="rv-link-muted"
          onClick={onBack}
          style={{ color: "#8A8398", fontWeight: 600, fontSize: 15, padding: "8px 4px" }}
        >
          ← Atrás
        </button>
        <div style={{ flex: 1 }} />
        {canContinue ? (
          <button
            className="rv-continue"
            disabled={submitting}
            onClick={onContinue}
            style={{
              background: "#6D3BF5",
              border: "none",
              borderRadius: 14,
              padding: "13px 26px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15.5,
              cursor: submitting ? "default" : "pointer",
              boxShadow: "0 10px 22px -8px rgba(109,59,245,.5)",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Calculando…" : "Continuar"}
          </button>
        ) : (
          <button
            disabled
            style={{
              background: "#ECEAF3",
              border: "none",
              borderRadius: 14,
              padding: "13px 26px",
              color: "#B4AEC2",
              fontWeight: 700,
              fontSize: 15.5,
              cursor: "default",
            }}
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({
  top3,
  onOpen,
  onRestart,
}: {
  top3: (typeof CAREERS)[number] extends infer C ? (C & { s: number })[] : never;
  onOpen: (id: string) => void;
  onRestart: () => void;
}) {
  const maxS = top3[0]?.s || 1;
  return (
    <div className="rv-fadeup" style={{ maxWidth: 560, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 99,
            background: "#E3DBFB",
            color: "#6D3BF5",
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          🎉 Tu resultado
        </div>
        <h2
          style={{
            fontFamily: "var(--font-bricolage)",
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            margin: "0 0 8px",
          }}
        >
          Carreras hechas para ti
        </h2>
        <p style={{ fontSize: 15.5, color: "#5C566B", margin: 0 }}>
          Ordenadas por afinidad con tu aptitud + intereses
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {top3.map((c, i) => {
          const p = Math.round(c.s * 100);
          return (
            <button
              key={c.id}
              className="rv-career-card"
              onClick={() => onOpen(c.id)}
              style={{
                position: "relative",
                textAlign: "left",
                width: "100%",
                background: "#fff",
                border: "1px solid #ECE9F3",
                borderRadius: 20,
                padding: 22,
                cursor: "pointer",
                boxShadow: "0 14px 34px -18px rgba(30,20,60,.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    flex: "none",
                    fontFamily: "var(--font-bricolage)",
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: "-.03em",
                    color: "#DCD7EA",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  {i === 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 9px",
                        borderRadius: 99,
                        background: "#FFF0D6",
                        color: "#B8791A",
                        fontWeight: 700,
                        fontSize: 11,
                        marginBottom: 6,
                      }}
                    >
                      ★ MEJOR MATCH
                    </span>
                  )}
                  <div
                    style={{
                      fontFamily: "var(--font-bricolage)",
                      fontWeight: 700,
                      fontSize: 20,
                      letterSpacing: "-.02em",
                      lineHeight: 1.1,
                      color: c.color,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <div style={{ flex: 1, height: 7, background: "#F0EEF6", borderRadius: 99, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(8, Math.round((c.s / maxS) * 100))}%`,
                          background: c.color,
                          borderRadius: 99,
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#6B6578" }}>{p}%</span>
                  </div>
                </div>
                <span style={{ flex: "none", fontSize: 18, color: "#B4AEC2" }}>→</span>
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 13.5, color: "#9089A0", margin: "22px 0 0" }}>
        Toca una carrera para ver un caso real y el panorama en Colombia.
      </p>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button
          className="rv-link-muted"
          onClick={onRestart}
          style={{ color: "#8A8398", fontWeight: 600, fontSize: 14, textDecoration: "underline" }}
        >
          Rehacer la prueba
        </button>
      </div>
    </div>
  );
}

function DetailScreen({
  career,
  vec,
  onBack,
}: {
  career: (typeof CAREERS)[number];
  vec: Record<DimKey, number>;
  onBack: () => void;
}) {
  const s = (() => {
    let dot = 0,
      na = 0,
      nb = 0;
    for (const k of DIMKEYS) {
      const a = vec[k] || 0;
      const b = career.profile[k] || 0;
      dot += a * b;
      na += a * a;
      nb += b * b;
    }
    return na === 0 || nb === 0 ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
  })();
  const pct = Math.round(s * 100);

  const entries = DIMKEYS.map((k) => ({ k, val: vec[k] || 0 }))
    .filter((e) => e.val > 0)
    .sort((a, b) => b.val - a.val)
    .slice(0, 4);
  const mx = entries[0]?.val || 1;

  const hasCaso = !!career.caso;
  const hasMercado = !!career.mercado;
  const hasNeither = !hasCaso && !hasMercado;

  return (
    <div
      className="rv-fadeup"
      style={{
        maxWidth: 560,
        width: "100%",
        background: "#fff",
        borderRadius: 26,
        padding: 32,
        boxShadow: "0 22px 55px -22px rgba(30,20,60,.3)",
        border: "1px solid #ECE9F3",
      }}
    >
      <button
        className="rv-link-muted"
        onClick={onBack}
        style={{ color: "#8A8398", fontWeight: 600, fontSize: 14.5, padding: 0, marginBottom: 20 }}
      >
        ← Volver al Top 3
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: career.color }} />
        <span
          style={{
            padding: "4px 11px",
            borderRadius: 99,
            background: "#F0EEF6",
            color: "#6B6578",
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          {pct}% de afinidad
        </span>
      </div>
      <h2
        style={{
          fontFamily: "var(--font-bricolage)",
          fontWeight: 800,
          fontSize: 30,
          lineHeight: 1.05,
          letterSpacing: "-.03em",
          margin: "0 0 26px",
        }}
      >
        {career.name}
      </h2>

      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-bricolage)",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: ".04em",
            color: "#9089A0",
            marginBottom: 14,
          }}
        >
          Por qué encaja contigo
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((e) => (
            <div key={e.k}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#4A4557",
                  marginBottom: 5,
                }}
              >
                {DIMS[e.k].label}
              </div>
              <div style={{ height: 8, background: "#F0EEF6", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round((e.val / mx) * 100)}%`,
                    background: DIMS[e.k].color,
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasCaso && (
        <div
          style={{
            padding: 22,
            borderRadius: 18,
            background: "#F6F3FE",
            border: "1px solid #EBE3FC",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              color: "#6D3BF5",
              marginBottom: 12,
            }}
          >
            👤 Alguien que ya lo vivió
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.55, color: "#2E2A38", margin: "0 0 10px", fontStyle: "italic" }}>
            &ldquo;{career.caso}&rdquo;
          </p>
          <p style={{ fontSize: 13.5, color: "#8A8398", fontWeight: 600, margin: 0 }}>— {career.casoBy}</p>
        </div>
      )}

      {hasMercado && career.mercado && (
        <div style={{ padding: 22, borderRadius: 18, background: "#F3FAF5", border: "1px solid #D9EFE0" }}>
          <div
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              color: "#2FA65A",
              marginBottom: 14,
            }}
          >
            📍 En Colombia hoy
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#8A8398", fontWeight: 600, marginBottom: 3 }}>
                Demanda laboral
              </div>
              <div style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 18, color: "#17141F" }}>
                {career.mercado.empleabilidad}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#8A8398", fontWeight: 600, marginBottom: 3 }}>
                Salario de entrada aprox.
              </div>
              <div style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 18, color: "#17141F" }}>
                {career.mercado.salario}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#5C566B", margin: 0 }}>{career.mercado.nota}</p>
        </div>
      )}

      {hasNeither && (
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            background: "#F7F6FA",
            border: "1px dashed #DDD8EA",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, color: "#8A8398", margin: 0 }}>
            Pronto agregaremos un caso real y el panorama laboral de esta carrera.
          </p>
        </div>
      )}
    </div>
  );
}

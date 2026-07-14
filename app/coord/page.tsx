import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CAREERS } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CoordPage() {
  const [school, roster] = await Promise.all([
    prisma.school.findFirst(),
    prisma.rosterCode.findMany({ orderBy: { code: "asc" } }),
  ]);

  const schoolName = school?.name ?? "Colegio San Marcos";
  const done = roster.filter((r) => r.done).length;
  const total = roster.length;
  const pend = total - done;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const distMap = new Map<string, number>();
  for (const r of roster) {
    if (r.done && r.topCareerId) {
      distMap.set(r.topCareerId, (distMap.get(r.topCareerId) ?? 0) + 1);
    }
  }
  const distItems = Array.from(distMap.entries())
    .map(([id, count]) => {
      const c = CAREERS.find((x) => x.id === id);
      return { name: c?.name ?? id, color: c?.color ?? "#999", count };
    })
    .sort((a, b) => b.count - a.count);
  const maxCount = distItems[0]?.count || 1;

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
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 30,
          color: "#17141F",
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
        <span style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 18, letterSpacing: "-.02em" }}>
          Reto Vocacional
        </span>
      </Link>

      <div style={{ maxWidth: 880, width: "100%" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: 99,
              background: "#E9E1FC",
              color: "#6D3BF5",
              fontWeight: 600,
              fontSize: 12.5,
              marginBottom: 10,
            }}
          >
            Vista del coordinador
          </div>
          <h2
            style={{
              fontFamily: "var(--font-bricolage)",
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1.05,
              letterSpacing: "-.03em",
              margin: 0,
            }}
          >
            {schoolName}
          </h2>
          <p style={{ fontSize: 15, color: "#5C566B", margin: "6px 0 0" }}>
            Grupo piloto · Reto Vocacional
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              border: "1px solid #ECE9F3",
              boxShadow: "0 14px 34px -22px rgba(30,20,60,.3)",
            }}
          >
            <div style={{ fontSize: 13, color: "#8A8398", fontWeight: 600, marginBottom: 8 }}>
              Completaron la prueba
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--font-bricolage)", fontWeight: 800, fontSize: 38, letterSpacing: "-.03em", color: "#2FA65A" }}>
                {done}
              </span>
              <span style={{ fontSize: 17, color: "#9089A0", fontWeight: 600 }}>/ {total}</span>
              <span style={{ marginLeft: "auto", fontWeight: 700, color: "#2FA65A", fontSize: 15 }}>
                {completionPct}%
              </span>
            </div>
            <div style={{ height: 9, background: "#EDEBF3", borderRadius: 99, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${completionPct}%`,
                  background: "#2FA65A",
                  borderRadius: 99,
                  transition: "width .4s ease",
                }}
              />
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              border: "1px solid #ECE9F3",
              boxShadow: "0 14px 34px -22px rgba(30,20,60,.3)",
            }}
          >
            <div style={{ fontSize: 13, color: "#8A8398", fontWeight: 600, marginBottom: 8 }}>Aún pendientes</div>
            <div style={{ fontFamily: "var(--font-bricolage)", fontWeight: 800, fontSize: 38, letterSpacing: "-.03em", color: "#E8663D" }}>
              {pend}
            </div>
            <p style={{ fontSize: 13, color: "#9089A0", margin: "10px 0 0", lineHeight: 1.4 }}>
              Reparte de nuevo el código a quienes falten.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 26,
            border: "1px solid #ECE9F3",
            boxShadow: "0 14px 34px -22px rgba(30,20,60,.3)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            Estado del grupo
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
            {roster.map((r) =>
              r.done ? (
                <div
                  key={r.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 13px",
                    borderRadius: 12,
                    background: "#EAF6EE",
                    border: "1px solid #D3EDDB",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#248049",
                  }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#2FA65A",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    ✓
                  </span>
                  {r.code}
                </div>
              ) : (
                <div
                  key={r.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 13px",
                    borderRadius: 12,
                    background: "#F5F4F8",
                    border: "1px solid #E9E7F0",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#A29CB0",
                  }}
                >
                  <span style={{ flex: "none", width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #CFC9DC" }} />
                  {r.code}
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 26,
            border: "1px solid #ECE9F3",
            boxShadow: "0 14px 34px -22px rgba(30,20,60,.3)",
          }}
        >
          <div style={{ fontFamily: "var(--font-bricolage)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            Hacia dónde se orienta el grupo
          </div>
          <p style={{ fontSize: 13.5, color: "#8A8398", margin: "0 0 18px" }}>
            Distribución agregada de carreras recomendadas — nunca por estudiante.
          </p>
          {distItems.length === 0 ? (
            <p style={{ fontSize: 13.5, color: "#9089A0", margin: 0 }}>
              Todavía no hay resultados registrados en este grupo.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {distItems.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ flex: "none", width: 160, fontSize: 14, fontWeight: 600, color: "#4A4557" }}>
                    {d.name}
                  </span>
                  <div style={{ flex: 1, height: 22, background: "#F4F2F9", borderRadius: 8, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.max(6, Math.round((d.count / maxCount) * 100))}%`,
                        background: d.color,
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <span style={{ flex: "none", width: 26, textAlign: "right", fontWeight: 700, fontSize: 14, color: "#6B6578" }}>
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginTop: 18,
            padding: "16px 18px",
            borderRadius: 14,
            background: "#F6F3FE",
            border: "1px solid #EBE3FC",
          }}
        >
          <span style={{ fontSize: 16 }}>🔒</span>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#5C566B", margin: 0 }}>
            Por privacidad, nunca ves el resultado individual de un estudiante — solo si completó
            la prueba o no.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { PERSONALITY_QUESTIONS } from "@/lib/constants";
import { PersonalityProfile } from "@/lib/types";

interface Props {
  data: PersonalityProfile;
  onChange: (d: PersonalityProfile) => void;
}

export default function PersonalityModule({ data, onChange }: Props) {
  const selectAnswer = (qId: string, answer: "A" | "B") =>
    onChange({ answers: { ...data.answers, [qId]: answer } });

  const answered = Object.keys(data.answers).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Personality snapshot
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">
          8 quick questions. Go with your gut — there are no right answers.
        </p>
      </div>

      {/* Progress within this step */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{
              width: `${(answered / PERSONALITY_QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs text-zinc-500 tabular-nums">
          {answered}/{PERSONALITY_QUESTIONS.length}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {PERSONALITY_QUESTIONS.map((q, idx) => {
          const selected = data.answers[q.id];
          return (
            <div
              key={q.id}
              className={`rounded-xl border p-4 transition-all ${
                selected
                  ? "border-zinc-600 bg-zinc-900/60"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <p className="text-sm text-zinc-300 font-medium mb-3">
                <span className="text-zinc-600 mr-2">
                  {String(idx + 1).padStart(2, "0")}.
                </span>
                {q.question}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["A", "B"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectAnswer(q.id, opt)}
                    className={`px-4 py-3 rounded-lg border text-sm text-left leading-snug transition-all ${
                      selected === opt
                        ? "border-violet-500 bg-violet-500/15 text-white"
                        : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-600 mr-1.5">
                      {opt}.
                    </span>
                    {opt === "A" ? q.a : q.b}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {answered === PERSONALITY_QUESTIONS.length && (
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
          <p className="text-violet-300 text-sm font-medium">
            ✓ All questions answered
          </p>
          <p className="text-zinc-500 text-xs mt-1">
            Your personality profile is ready to analyse
          </p>
        </div>
      )}
    </div>
  );
}

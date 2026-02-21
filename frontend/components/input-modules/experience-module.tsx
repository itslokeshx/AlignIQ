"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExperienceProfile } from "@/lib/types";

interface Props {
  data: ExperienceProfile;
  onChange: (d: ExperienceProfile) => void;
}

export default function ExperienceModule({ data, onChange }: Props) {
  const set = (key: keyof ExperienceProfile, val: unknown) =>
    onChange({ ...data, [key]: val });

  const setProject = (i: number, val: string) => {
    const p = [...(data.projects || ["", "", ""])];
    p[i] = val;
    set("projects", p);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Your experience</h2>
        <p className="text-zinc-400 mt-1 text-sm">
          Any domain counts — internships, projects, gigs, leadership.
        </p>
      </div>

      {/* Internships */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Internships / work experiences completed
        </Label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, "4+"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("internships", n === "4+" ? 4 : (n as number))}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                data.internships === (n === "4+" ? 4 : n)
                  ? "border-blue-500 bg-blue-500/10 text-blue-300"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          Notable projects
          <span className="text-zinc-500 font-normal ml-2">
            — briefly describe up to 3
          </span>
        </Label>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              placeholder={
                [
                  "e.g. Built a sentiment analysis tool using Python & NLTK",
                  "e.g. Designed a sustainable packaging concept for a FMCG brand",
                  "e.g. Wrote and staged a short play for my college fest",
                ][i]
              }
              value={(data.projects || [])[i] || ""}
              onChange={(e) => setProject(i, e.target.value)}
              className="w-full h-10 rounded-md bg-zinc-900 border border-zinc-700 text-white px-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>
      </div>

      {/* Competitions */}
      <div className="space-y-2">
        <Label className="text-zinc-300 text-sm font-medium">
          Competitions, hackathons, olympiads, case studies
          <span className="text-zinc-500 font-normal ml-2">(any field)</span>
        </Label>
        <Input
          placeholder="e.g. 2 hackathons, 1 national law moot, inter-college design jam"
          value={data.competitions}
          onChange={(e) => set("competitions", e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-11"
        />
      </div>

      {/* Leadership */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300 text-sm font-medium">
            Leadership role held
          </Label>
          <button
            type="button"
            onClick={() => set("leadership", !data.leadership)}
            className={`relative inline-flex w-10 h-5 flex-shrink-0 rounded-full transition-colors ${data.leadership ? "bg-blue-600" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.leadership ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <div
          className={`grid transition-all duration-200 ease-in-out ${data.leadership ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <Input
              placeholder="e.g. President, Design Society | Captain, Debate team"
              value={data.leadership_desc}
              onChange={(e) => set("leadership_desc", e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10"
            />
          </div>
        </div>
      </div>

      {/* Volunteer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300 text-sm font-medium">
            Volunteer / NGO / community work
          </Label>
          <button
            type="button"
            onClick={() => set("volunteer", !data.volunteer)}
            className={`relative inline-flex w-10 h-5 flex-shrink-0 rounded-full transition-colors ${data.volunteer ? "bg-blue-600" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.volunteer ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <div
          className={`grid transition-all duration-200 ease-in-out ${data.volunteer ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <Input
              placeholder="e.g. Teaching underprivileged kids, Marathon volunteer"
              value={data.volunteer_desc}
              onChange={(e) => set("volunteer_desc", e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10"
            />
          </div>
        </div>
      </div>

      {/* Clubs + Awards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm font-medium">
            Clubs & societies
          </Label>
          <Input
            placeholder="e.g. Photography club, Model UN"
            value={data.clubs}
            onChange={(e) => set("clubs", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm font-medium">
            Awards / recognitions
          </Label>
          <Input
            placeholder="e.g. Best paper award, 1st at Techfest"
            value={data.awards}
            onChange={(e) => set("awards", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10"
          />
        </div>
      </div>

      {/* Earned from skill */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300 text-sm font-medium">
            Have you ever earned money using a skill you have?
          </Label>
          <button
            type="button"
            onClick={() => set("earned_from_skill", !data.earned_from_skill)}
            className={`relative inline-flex w-10 h-5 flex-shrink-0 rounded-full transition-colors ${data.earned_from_skill ? "bg-emerald-600" : "bg-zinc-700"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.earned_from_skill ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <div
          className={`grid transition-all duration-200 ease-in-out ${data.earned_from_skill ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <Input
              placeholder="e.g. Freelance logo design, tutoring, video editing gigs"
              value={data.earned_desc}
              onChange={(e) => set("earned_desc", e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-blue-500 h-10"
            />
          </div>
        </div>
      </div>

      {/* Readiness slider */}
      <div className="space-y-3">
        <Label className="text-zinc-300 text-sm font-medium">
          How career-ready do you feel right now?
          <span className="text-blue-400 font-semibold ml-2">
            {data.readiness_rating}/10
          </span>
        </Label>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={data.readiness_rating}
          onChange={(e) => set("readiness_rating", parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Not at all</span>
          <span>Fully ready</span>
        </div>
      </div>
    </div>
  );
}

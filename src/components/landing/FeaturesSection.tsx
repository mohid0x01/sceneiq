import { motion } from "framer-motion";
import { Brain, Map, Clock, Shield, Layers, Play } from "lucide-react";

const features = [
  { icon: Brain, title: "Multilingual NLP", desc: "Roman Urdu and English FIR processing with 70B parameter language models trained on South Asian legal text." },
  { icon: Map, title: "3D Scene Reconstruction", desc: "Real-time browser-based animated reconstruction of the crime scene with spatial accuracy and entity placement." },
  { icon: Clock, title: "Timeline Playback", desc: "Scrub through the incident chronologically, watching events unfold step-by-step on an interactive timeline." },
  { icon: Shield, title: "Hallucination Shield", desc: "Every extracted entity is grounded to source text. Confidence scores flag uncertain extractions in real-time." },
  { icon: Layers, title: "Entity Intelligence", desc: "Actors, vehicles, weapons, and locations extracted and classified with relationship mapping between entities." },
  { icon: Play, title: "Secure by Design", desc: "Officer-level data isolation with row-level security. Your cases are visible only to authorized personnel." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="label-uppercase">Capabilities</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-text-primary">What SCENEIQ Delivers</h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card-scene rounded-[4px] p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <f.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

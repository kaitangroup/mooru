import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Users, Award, Globe, Heart } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />

      {/* HERO */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-[900px] mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.05em] bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
            About Guroos
          </span>

          <h1 className="mt-6 font-[var(--font-display)] text-[clamp(2.5rem,4vw,4rem)] leading-[1.05] tracking-[-0.03em]">
            A better way to connect with experts.
          </h1>

          <p className="mt-6 text-[#6e6a63] text-lg max-w-[60ch] mx-auto">
            Guroos helps you learn directly from experts, creators, and experts through meaningful conversations.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="px-4 pb-20">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="font-[var(--font-display)] text-2xl mb-5">
              Our mission
            </h2>

            <p className="text-[#6e6a63] leading-relaxed mb-4">
              We believe knowledge should be accessible directly from the source.
              Instead of searching endlessly, Guroos lets you talk to the people who
              actually create ideas, write books, and shape industries.
            </p>

            <p className="text-[#6e6a63] leading-relaxed">
              Whether you want clarity, advice, or deeper understanding, we make
              expert conversations simple and accessible.
            </p>
          </div>

          <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6">
            <img
              src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="px-4 pb-20">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="font-[var(--font-display)] text-2xl text-center mb-12">
            Our values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: <Users className="h-6 w-6 text-[#01696f]" />,
                title: "Community",
                text: "Building meaningful connections between learners and experts.",
              },
              {
                icon: <Award className="h-6 w-6 text-[#01696f]" />,
                title: "Excellence",
                text: "High-quality experts and trusted conversations.",
              },
              {
                icon: <Globe className="h-6 w-6 text-[#01696f]" />,
                title: "Accessibility",
                text: "Knowledge available anywhere, anytime.",
              },
              {
                icon: <Heart className="h-6 w-6 text-[#01696f]" />,
                title: "Passion",
                text: "Driven by curiosity and love for learning.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#d7e7e5] flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-[#6e6a63]">{v.text}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 pb-20">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="font-[var(--font-display)] text-2xl text-center mb-12">
            Our impact
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">

            {[
              { num: "10,000+", label: "Users" },
              { num: "2,500+", label: "Experts" },
              { num: "100+", label: "Topics" },
              { num: "4.8★", label: "Rating" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6"
              >
                <div className="text-2xl font-semibold mb-1">{s.num}</div>
                <p className="text-[#6e6a63] text-sm">{s.label}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="px-4 pb-20">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="font-[var(--font-display)] text-2xl text-center mb-12">
            Our team
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                name: "Sarah Chen",
                role: "Founder",
                img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
              },
              {
                name: "Michael Rodriguez",
                role: "CTO",
                img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
              },
              {
                name: "Emily Johnson",
                role: "Head of Education",
                img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition p-6 text-center"
              >
                <img
                  src={m.img}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-[#01696f] text-sm mt-1">{m.role}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
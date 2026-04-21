import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Users, Award, Globe, Heart } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <Header />

      {/* HERO */}
      <section className="py-10 px-4">
  <div className="max-w-[1100px] mx-auto">

    {/* EYEBROW */}
    <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[#d7e7e5] text-[#01696f] px-3 py-1 rounded-full">
      About Guroos.net
 
    </span>

    {/* HEADING */}
    <h1 className="mt-5 font-[var(--font-display)] text-[clamp(2rem,3vw,3.5rem)] max-w-[700px] leading-[1.05]">
      A better way to connect with content creators.
    </h1>

    {/* SUBTEXT */}
    <p className="text-[#6e6a63] mt-4 max-w-[600px] text-base leading-relaxed">
      Guroos.net helps you connect directly with experts and content creators, so you can learn through meaningful, real question and answer sessions.
    </p>

  </div>
</section>

      {/* MISSION */}
      <section className="px-4 py-20 border-t border-[#e5e2dc]">
  <div className="max-w-[800px] mx-auto">

    <h2 className="font-[var(--font-display)] text-2xl mb-5 text-[#28251d]">
      Our mission
    </h2>

    <p className="text-[#6e6a63] leading-relaxed mb-4">
      We believe knowledge should be accessible directly from the source.
      Instead of searching endlessly, Guroos.net lets you talk to the people who
      write books and  create podcasts and other contents.
    </p>

    <p className="text-[#6e6a63] leading-relaxed">
      Whether you want clarity, advice, or deeper understanding, we make
      expert conversations simple and accessible.
    </p>

  </div>
</section>

      {/* VALUES */}
      <section className="px-4 py-20 border-t border-[#e5e2dc]">
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
      {/* <section className="px-4 pb-20">
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
      </section> */}

      {/* TEAM */}
      <section className="px-4 py-20 border-t border-[#e5e2dc]">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="font-[var(--font-display)] text-2xl text-center mb-12">
            Our team
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {[
              {
                name: "Roland Jones",
                role: "Founder",
                img: "https://yt3.googleusercontent.com/oLhy2Cg-KtpciX47hH7TZ-rQOcfsGJgcKPmNdRVJ7izcFIDOtawBdzLP9DUT56PEDTBAriTyPQ=s160-c-k-c0x00ffffff-no-rj",
              },
              {
                name: "Md Shariful Islam",
                role: "CTO",
                img: "https://scontent.fdac157-1.fna.fbcdn.net/v/t39.30808-6/650352084_34819296040987920_3063129045925547474_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeGp-xfUClcUdp7uD3MYHQkFsRmrZjLyjQKxGatmMvKNAnMfGTNOFlTcuUx1QgJDEaNLJTNSl2UXbwLVR0vOM39M&_nc_ohc=jHui0MTR7xsQ7kNvwFfeUdr&_nc_oc=AdpDoMKBOjdJ9flaA3m6j2Rl6yP2xBcTMYGDtU58p-OZlFEMbK7cucQ5Hvr7xNKLLzk&_nc_zt=23&_nc_ht=scontent.fdac157-1.fna&_nc_gid=oKB61h0s8uM7B1Sd7RKLUg&_nc_ss=7a3a8&oh=00_Af0oBNcmG5s1Q1QU3J4bgcG7OM3KSJmTDTEuCEA2_jF7xw&oe=69EC04C9",
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
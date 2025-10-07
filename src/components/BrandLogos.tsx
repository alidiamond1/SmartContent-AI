export default function BrandLogos() {
  const logos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCnrI6Bw-xC7CrSftDKG-BRl8qlVCf972O2Ql3rh5v33JBGwWNuZ2maDs8g8QvyHv8zvXIOE5LAD_x7a7Scq-niPbXR0BjARMeCEbSqPYRGqTSQNqj3-5ocFcy-tvS9Wm30GoWysiUwBFAXbd3vkS2LCR1R645DxOXC0zRzPkTD62R9AgWtyPfPyhfd4Mc5BUz-PRW-Q2ye694KslnbNSnKV0NODEdatxAry9zpRksiMtcwDHPbwO0L9ybkV6PsjUQcnQSpg14ZKA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8dw2yuZD8IYhIW1tPaVlQibUg17h8st6lxnFv_qh0Cxtb_YXxk4U6cgK8HuZXsZNqcwJRUWmoi-1lRMgpX5JUXxlIXOE4-nfNBrc54pIDbTMPzpBJwzfXT0Z043sVng_VUkIYGk9UtDiJHzOnclGnRCaYOLcbW9di4aPKqbDYQGigvhdEYWA8iEdUdfIYGwIUT507C7rh2dpVRk003-CrzoOInfC72i7PtxbR8OGZJ1p96vHDh47I1H35gUVxONkA6k2O5THtOQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCBnTFbRwTIPGWHGKoWl3w5QIzTl7KI5oQsW5VWs2gaP_2HCsD-QEnL-MIxe5bmhfwNKTYRzFkcBUrOnMVFQIhdKx1BmiUL7aVrpWltK_BV9VnLBbdU894sxCKKR8FTK--dvELdELCm8QzH_jLazFb6U5ZihcqR0iN48Yj_MBgNufJdr_9YW_dqoxqZ8lB6b5M3-yZRPQPkfUBRnPqdLf2tqyV3ZdFjYoKj7WuDKVYqBryB2CluTbO6VIFZmwMAO2DWnO2u282D0A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC6SHNryxILLLjZZkWwpkw-jXo-LB-CC5pepHQcQlkFAdVG-88fxZZ2IEvPsN5v0IDKQEpqMr8YNyPSYHqf6a7PvfjFOu4vCpmlYi3ibAzeB5Oa40ecmzWLC1y_M0i03cuc1E7Mi6sjHWAGaWY3KXGWhtgSqa7HljmP6dQF_cZX43a1xhuPPSjbroDwwdK5gHkHqyI7ZogGpY3mB_bPxENzYcr7plBWcgE6beIfG1RbpZrA-LQUhi1rjjsX6e86DJDTwzykOLktLA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA606BJiP9BLhAF_CUmp3nQNomidlEXiQsUCEzWeC_3IpxcpA3yT7WIPB1b40bpvZF83zrZKvhhW-PK3hn_kCoEO_jrM46VeA6RUdwCiJMCRZ9NkRFad8ERzCzp-jxdyi58GRYHkvgpMb_Vwt-uv2REudUoRgfj6X8-p3YsDHZeoJiitns0Ukgxpg5_T-gFDIJXQTCSxwMu5qTOWcWbaabWe6xRg2CVhbNTQhrO1Z_8XRdMQmJtdKiBJkBhVOY5bERrGrqMNel6EA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD3NgE4kjvzW70fHKNGJjVzQyrYvP9T_zP9-olh2hledP7MujkI07F0EoNm3dykickrBkUr4GQ4ZQrVaim1MLps2NCqBjNJRCyGlSpYhdXyYbHYuR5pQNYWX6xUFB_2J0i4WTKmldEJOpsKXycGjnlRNkD79kM1caDCjuAtlT2JPw1cCNsH3ZscjuKaYwI9-mL7PCmwy16iFjf2ti1Q95hbgm_nQyi4j-Dt4vreQ64tX1f0bZ_OREUCw4OowOsnx-O7OenqRz8D4A'
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold">
          Trusted by Leading Brands
        </h2>
        <div className="mt-12 grid grid-cols-2 items-center justify-center gap-8 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="aspect-square w-full rounded-lg bg-cover bg-center grayscale transition-all hover:grayscale-0 hover:scale-105"
              style={{ backgroundImage: `url("${logo}")` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
